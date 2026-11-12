import { useCallback, useEffect, useState } from 'react'
import { hayCambiosSinPublicar, publicarCambios } from '../services/publicacion'

// Estado del botón "Publicar cambios" de un editor con sesión iniciada
export function usePublicacion(editor: string | null) {
  const [pendiente, setPendiente] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Se llama al iniciar sesión y después de cada guardado o borrado
  const revisar = useCallback(() => {
    if (!editor) return
    hayCambiosSinPublicar()
      .then((p) => {
        setPendiente(p)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [editor])

  useEffect(revisar, [revisar])

  async function publicar() {
    if (!window.confirm('¿Publicar los cambios? Serán visibles para todos en el modo lectura.')) return
    setPublicando(true)
    setError(null)
    try {
      await publicarCambios()
      setPendiente(false)
    } catch (e) {
      setError(`No se pudo publicar: ${(e as Error).message}`)
    } finally {
      setPublicando(false)
    }
  }

  return { pendiente, publicando, error, revisar, publicar }
}
