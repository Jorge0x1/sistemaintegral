import { useCallback, useEffect, useState } from 'react'
import { NUEVO } from '../types/registros'
import type { Cambiar, Editando, Modulo, Registro } from '../types/registros'

// Estado y acciones de un dashboard de registros: carga, edición en línea y persistencia.
// editable: el editor ve y modifica el borrador; si no, se muestra lo publicado.
// onCambio: se llama tras guardar o borrar (hay cambios sin publicar).
export function useRegistros<R extends Registro, I, B, C>(
  modulo: Modulo<R, I, B, C>,
  editable: boolean,
  onCambio?: () => void,
) {
  const [cat, setCat] = useState<C | null>(null)
  const [registros, setRegistros] = useState<R[]>([])
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [editando, setEditando] = useState<Editando>(null)
  const [borrador, setBorrador] = useState<B>(modulo.vacio)
  const [guardando, setGuardando] = useState(false)

  // Se recarga al iniciar o cerrar sesión: cambia entre borrador y publicado
  useEffect(() => {
    let vigente = true
    Promise.all([modulo.cargarCatalogos(), modulo.listar(!editable)])
      .then(([c, r]) => {
        if (!vigente) return
        setCat(() => c)
        setRegistros(r)
        setErrorCarga(null)
      })
      .catch((e: Error) => vigente && setErrorCarga(e.message))
    return () => {
      vigente = false
    }
  }, [modulo, editable])

  const cambiar: Cambiar<B> = (campo, valor) => setBorrador((b) => ({ ...b, [campo]: valor }))

  function nuevo() {
    setBorrador(modulo.vacio())
    setEditando(NUEVO)
    setAviso(null)
  }

  function editar(r: R) {
    setBorrador(modulo.aBorrador(r))
    setEditando(r.id)
    setAviso(null)
  }

  // Estable entre renders: el panel la usa en un efecto al cerrarse la sesión
  const cancelar = useCallback(() => {
    setEditando(null)
    setAviso(null)
  }, [])

  async function guardar() {
    const falta = modulo.faltantes(borrador)
    if (falta.length) {
      setAviso(`Completa: ${falta.join(', ')}`)
      return
    }
    setGuardando(true)
    try {
      const datos = modulo.aDatos(borrador)
      if (editando === NUEVO) {
        const creado = await modulo.crear(datos)
        setRegistros((rs) => [...rs, creado])
      } else if (editando !== null) {
        const actualizado = await modulo.actualizar(editando, datos)
        setRegistros((rs) => rs.map((r) => (r.id === actualizado.id ? actualizado : r)))
      }
      setEditando(null)
      setAviso(null)
      onCambio?.()
    } catch (e) {
      setAviso(`No se pudo guardar: ${(e as Error).message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(r: R) {
    if (!window.confirm(modulo.confirmarBorrado(r))) return
    try {
      await modulo.borrar(r.id)
      setRegistros((rs) => rs.filter((x) => x.id !== r.id))
      onCambio?.()
    } catch (e) {
      setAviso(`No se pudo borrar: ${(e as Error).message}`)
    }
  }

  return {
    cat,
    registros,
    errorCarga,
    aviso,
    editando,
    borrador,
    guardando,
    cambiar,
    nuevo,
    editar,
    cancelar,
    guardar,
    borrar,
  }
}
