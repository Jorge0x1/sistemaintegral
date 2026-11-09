import { useState } from 'react'
import Bienvenida from './components/Bienvenida/Bienvenida'
import PanelRegistros from './components/PanelRegistros/PanelRegistros'
import { moduloAspectos } from './config/aspectos'
import { moduloOportunidades } from './config/oportunidades'
import { moduloRiesgos } from './config/riesgos'

type Vista = 'inicio' | 'calidad' | 'oportunidades' | 'aspectos'

const TITULOS: Record<Exclude<Vista, 'inicio'>, string> = {
  calidad: 'Gestión de Calidad',
  oportunidades: 'Evaluación de Oportunidades',
  aspectos: 'Matriz de Aspectos e Impactos Ambientales',
}

function App() {
  const [vista, setVista] = useState<Vista>('inicio')
  const volver = () => setVista('inicio')

  if (vista === 'calidad') {
    return <PanelRegistros key={vista} titulo={TITULOS[vista]} modulo={moduloRiesgos} onVolver={volver} />
  }
  if (vista === 'oportunidades') {
    return <PanelRegistros key={vista} titulo={TITULOS[vista]} modulo={moduloOportunidades} onVolver={volver} />
  }
  if (vista === 'aspectos') {
    return <PanelRegistros key={vista} titulo={TITULOS[vista]} modulo={moduloAspectos} onVolver={volver} />
  }
  return (
    <Bienvenida
      opciones={(Object.keys(TITULOS) as (keyof typeof TITULOS)[]).map((v) => ({
        titulo: TITULOS[v],
        onAbrir: () => setVista(v),
      }))}
    />
  )
}

export default App
