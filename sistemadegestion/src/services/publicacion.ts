import { supabase } from './supabase'

// Copia el borrador de los editores a las tablas publicadas (lo que ve el modo lectura).
// Supabase rechaza la llamada si quien la hace no es editor.
export async function publicarCambios() {
  const { error } = await supabase.rpc('publicar_cambios')
  if (error) throw new Error(error.message)
}

export async function hayCambiosSinPublicar() {
  const { data, error } = await supabase.rpc('hay_cambios_sin_publicar')
  if (error) throw new Error(error.message)
  return data === true
}
