import { supabase } from './supabase'

// Inicio de sesión de editores. Quién puede escribir lo decide Supabase (tabla editores + RLS);
// la app solo lo consulta para mostrar u ocultar los botones de edición.

export async function iniciarSesion(email: string, contrasena: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: contrasena })
  if (error) {
    throw new Error(
      error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos.' : error.message,
    )
  }
  if (!(await esEditor())) {
    await supabase.auth.signOut()
    throw new Error('Esta cuenta no está autorizada para editar.')
  }
}

export async function cerrarSesion() {
  await supabase.auth.signOut()
}

export async function esEditor() {
  const { data, error } = await supabase.rpc('es_editor')
  return !error && data === true
}
