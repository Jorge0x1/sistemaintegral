import { claseNivel } from '../../utils/nivel'
import type { Nivel } from '../../types/registros'
import './InsigniaNivel.css'

// Número del nivel con el color que le toca según su rango
function InsigniaNivel({ nivel }: { nivel: Nivel }) {
  return <span className={`nivel nivel-${claseNivel(nivel.descripcion)}`}>{nivel.valor}</span>
}

export default InsigniaNivel
