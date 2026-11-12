import './BarraSesion.css'

type Props = {
  editor: string
  // Hay cambios en el borrador que todavía no ve el modo lectura
  pendiente: boolean
  publicando: boolean
  error: string | null
  onPublicar: () => void
  onCerrarSesion: () => void
}

// Barra fija en la esquina: solo la ven los editores con sesión iniciada
function BarraSesion({ editor, pendiente, publicando, error, onPublicar, onCerrarSesion }: Props) {
  return (
    <div className="barra-sesion-contenedor">
      <div className="barra-sesion">
        <span className="barra-sesion-correo" title={editor}>
          Editando como {editor}
        </span>
        <button
          type="button"
          className={pendiente ? 'barra-sesion-publicar pendiente' : 'barra-sesion-publicar'}
          onClick={onPublicar}
          disabled={!pendiente || publicando}
          title={pendiente ? 'Hay cambios que el modo lectura todavía no muestra' : 'No hay cambios por publicar'}
        >
          {pendiente && <span className="barra-sesion-punto" aria-hidden="true" />}
          {publicando ? 'Publicando…' : pendiente ? 'Publicar Cambios' : 'Todo publicado'}
        </button>
        <button type="button" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
      {error && <p className="barra-sesion-error">{error}</p>}
    </div>
  )
}

export default BarraSesion
