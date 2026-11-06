import Icono from '../Icono/Icono'
import './BotonAgregar.css'

type Props = {
  titulo: string
  disabled?: boolean
  onClick: () => void
}

function BotonAgregar({ titulo, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      className="agregar"
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      aria-label={titulo}
    >
      <Icono nombre="mas" />
    </button>
  )
}

export default BotonAgregar
