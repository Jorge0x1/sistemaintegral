import CampoEntrada from '../CampoEntrada/CampoEntrada'
import Icono, { type NombreIcono } from '../Icono/Icono'
import './CampoAccion.css'

type Props = {
  valor: string
  onChange: (valor: string) => void
  etiqueta: string
  placeholder?: string
  icono: NombreIcono
  textoBoton: string
  // Sin acción el botón se muestra deshabilitado (función pendiente de definir)
  onAccion?: () => void
}

// Texto libre con un botón cuadrado a su derecha
function CampoAccion({ valor, onChange, etiqueta, placeholder, icono, textoBoton, onAccion }: Props) {
  return (
    <div className="campo-accion">
      <CampoEntrada valor={valor} onChange={onChange} etiqueta={etiqueta} placeholder={placeholder} />
      <button
        type="button"
        className="campo-accion-boton"
        onClick={onAccion}
        disabled={!onAccion}
        title={onAccion ? textoBoton : `${textoBoton} (próximamente)`}
        aria-label={textoBoton}
      >
        <Icono nombre={icono} />
      </button>
    </div>
  )
}

export default CampoAccion
