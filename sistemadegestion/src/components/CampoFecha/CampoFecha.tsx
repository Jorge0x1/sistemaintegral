import { useRef } from 'react'
import Icono from '../Icono/Icono'
import { formatoFecha } from '../../utils/fecha'
import './CampoFecha.css'

type Props = {
  valor: string
  onChange: (valor: string) => void
  etiqueta: string
}

// Muestra NA mientras no haya fecha; el calendario se abre solo desde el icono.
// El input nativo queda invisible porque no permite mostrar "NA" como texto.
function CampoFecha({ valor, onChange, etiqueta }: Props) {
  const selector = useRef<HTMLInputElement>(null)

  return (
    <div className="campo-fecha">
      <span>{formatoFecha(valor || null)}</span>
      <button
        type="button"
        className="campo-fecha-boton"
        onClick={() => selector.current?.showPicker?.()}
        title="Seleccionar fecha"
        aria-label={`Seleccionar ${etiqueta}`}
      >
        <Icono nombre="calendario" />
      </button>
      <input
        ref={selector}
        className="campo-fecha-selector"
        type="date"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

export default CampoFecha
