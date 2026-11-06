import { useEffect, useState } from 'react'
import { cargarCatalogos } from '../services/catalogos'
import { actualizarRiesgo, borrarRiesgo, crearRiesgo, listarRiesgos } from '../services/riesgos'
import { aBorrador, aRiesgo, borradorVacio, faltantes } from '../utils/borrador'
import { NUEVO } from '../types/riesgos'
import type { Borrador, Cambiar, Catalogos, Editando, Riesgo } from '../types/riesgos'

// Estado y acciones de la matriz de riesgos: carga, edición en línea y persistencia
export function useRiesgos() {
  const [cat, setCat] = useState<Catalogos | null>(null)
  const [riesgos, setRiesgos] = useState<Riesgo[]>([])
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [editando, setEditando] = useState<Editando>(null)
  const [borrador, setBorrador] = useState<Borrador>(borradorVacio)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([cargarCatalogos(), listarRiesgos()])
      .then(([c, r]) => {
        setCat(c)
        setRiesgos(r)
      })
      .catch((e: Error) => setErrorCarga(e.message))
  }, [])

  const cambiar: Cambiar = (campo, valor) => setBorrador((b) => ({ ...b, [campo]: valor }))

  function nuevo() {
    setBorrador(borradorVacio())
    setEditando(NUEVO)
    setAviso(null)
  }

  function editar(r: Riesgo) {
    setBorrador(aBorrador(r))
    setEditando(r.id)
    setAviso(null)
  }

  function cancelar() {
    setEditando(null)
    setAviso(null)
  }

  async function guardar() {
    const falta = faltantes(borrador)
    if (falta.length) {
      setAviso(`Completa: ${falta.join(', ')}`)
      return
    }
    setGuardando(true)
    try {
      const datos = aRiesgo(borrador)
      if (editando === NUEVO) {
        const creado = await crearRiesgo(datos)
        setRiesgos((rs) => [...rs, creado])
      } else if (editando !== null) {
        const actualizado = await actualizarRiesgo(editando, datos)
        setRiesgos((rs) => rs.map((r) => (r.id === actualizado.id ? actualizado : r)))
      }
      setEditando(null)
      setAviso(null)
    } catch (e) {
      setAviso(`No se pudo guardar: ${(e as Error).message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(r: Riesgo) {
    if (!window.confirm(`¿Borrar el riesgo N. ${r.id} (${r.evento_riesgo})?`)) return
    try {
      await borrarRiesgo(r.id)
      setRiesgos((rs) => rs.filter((x) => x.id !== r.id))
    } catch (e) {
      setAviso(`No se pudo borrar: ${(e as Error).message}`)
    }
  }

  return {
    cat,
    riesgos,
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
