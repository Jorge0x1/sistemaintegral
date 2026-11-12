import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { esEditor } from '../services/sesion'

export type Sesion = {
  // Correo del editor con sesión iniciada; null en modo lectura
  editor: string | null
}

// Sigue la sesión de Supabase (se conserva en el navegador entre visitas)
// y solo la considera editora si el correo está autorizado en la tabla editores.
export function useSesion(): Sesion {
  const [editor, setEditor] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      const email = sesion?.user.email ?? null
      if (!email) {
        setEditor(null)
        return
      }
      // Fuera del callback: Supabase no permite otras llamadas dentro de él
      setTimeout(async () => {
        const autorizado = await esEditor()
        if (vigente) setEditor(autorizado ? email : null)
      })
    })

    return () => {
      vigente = false
      data.subscription.unsubscribe()
    }
  }, [])

  return { editor }
}
