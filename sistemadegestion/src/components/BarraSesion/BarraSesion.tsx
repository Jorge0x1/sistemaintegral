import './BarraSesion.css'

type Props = {
  editor: string
  onCerrarSesion: () => void
}

// Indicador fijo en la esquina: solo lo ven los editores con sesión iniciada
function BarraSesion({ editor, onCerrarSesion }: Props) {
  return (
    <div className="barra-sesion">
      <span className="barra-sesion-punto" aria-hidden="true" />
      <span className="barra-sesion-correo" title={editor}>
        Editando como {editor}
      </span>
      <button type="button" onClick={onCerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default BarraSesion
