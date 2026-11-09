import { useState } from 'react'
import Bienvenida from './components/Bienvenida/Bienvenida'
import PanelRegistros from './components/PanelRegistros/PanelRegistros'
import { moduloOportunidades } from './config/oportunidades'
import { moduloRiesgos } from './config/riesgos'

type Vista = 'inicio' | 'calidad' | 'oportunidades'

function App() {
  const [vista, setVista] = useState<Vista>('inicio')
  const volver = () => setVista('inicio')

  if (vista === 'calidad') {
    return <PanelRegistros key={vista} titulo="Gestión de Calidad" modulo={moduloRiesgos} onVolver={volver} />
  }
  if (vista === 'oportunidades') {
    return (
      <PanelRegistros
        key={vista}
        titulo="Evaluación de Oportunidades"
        modulo={moduloOportunidades}
        onVolver={volver}
      />
    )
  }
  return (
    <Bienvenida
      onCalidad={() => setVista('calidad')}
      onOportunidades={() => setVista('oportunidades')}
    />
  )
}

export default App
