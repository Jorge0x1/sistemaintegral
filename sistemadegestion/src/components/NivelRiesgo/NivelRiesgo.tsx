import InsigniaNivel from '../InsigniaNivel/InsigniaNivel'
import SinValor from '../SinValor/SinValor'
import type { Nivel } from '../../types/registros'
import './NivelRiesgo.css'

// Número coloreado más la descripción del rango, en una sola celda
function NivelRiesgo({ nivel }: { nivel: Nivel | null }) {
  if (!nivel) return <SinValor />
  return (
    <div className="nivel-celda">
      <InsigniaNivel nivel={nivel} />
      <span>{nivel.descripcion}</span>
    </div>
  )
}

export default NivelRiesgo
