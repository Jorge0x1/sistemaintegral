import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../Modal/Modal'
import { iniciarSesion } from '../../services/sesion'
import './InicioSesion.css'

type Props = {
  onListo: () => void
  onCerrar: () => void
}

// Formulario de acceso para editores; solo aparece al entrar por la dirección #editar
function InicioSesion({ onListo, onCerrar }: Props) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await iniciarSesion(email, contrasena)
      onListo()
    } catch (err) {
      setError((err as Error).message)
      setEnviando(false)
    }
  }

  return (
    <Modal titulo="Acceso de editores" onCerrar={onCerrar} ancho={380}>
      <form className="inicio-sesion" onSubmit={enviar}>
        <label>
          Correo
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </label>
        {error && <p className="inicio-sesion-error">{error}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </Modal>
  )
}

export default InicioSesion
