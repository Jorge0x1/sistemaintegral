import SinValor from '../SinValor/SinValor'
import { nivelDeRiesgo } from '../../utils/nivelRiesgo'
import type { Catalogos } from '../../types/riesgos'
import './NivelRiesgo.css'

function claseNivel(descripcion: string) {
  const nivel = descripcion.split(':')[0].trim().toLowerCase()
  return `nivel nivel-${nivel.normalize('NFD').replace(/[^a-z]/g, '')}`
}

function NivelRiesgo({ cat, s, p }: { cat: Catalogos; s: number | null; p: number | null }) {
  const nivel = nivelDeRiesgo(cat, s, p)
  if (!nivel) return <SinValor />
  return (
    <div className="nivel-celda">
      <span className={claseNivel(nivel.descripcion)}>{nivel.valor}</span>
      <span>{nivel.descripcion}</span>
    </div>
  )
}

export default NivelRiesgo
