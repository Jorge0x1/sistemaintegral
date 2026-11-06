import Icono from '../Icono/Icono'
import type { NombreIcono } from '../Icono/Icono'
import './BotonIcono.css'

type Props = {
  icono: NombreIcono
  titulo: string
  etiqueta?: string
  variante?: 'guardar' | 'borrar'
  disabled?: boolean
  onClick: () => void
}

function BotonIcono({ icono, titulo, etiqueta = titulo, variante, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      className={variante ? `boton-icono ${variante}` : 'boton-icono'}
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      aria-label={etiqueta}
    >
      <Icono nombre={icono} />
    </button>
  )
}

export default BotonIcono
