import { useState } from 'react'
import Bienvenida from './components/Bienvenida/Bienvenida'
import PanelRegistros from './components/PanelRegistros/PanelRegistros'
import { moduloAspectos } from './config/aspectos'
import { moduloOportunidades } from './config/oportunidades'
import { moduloRiesgos } from './config/riesgos'

// Menús: inicio → matriz de riesgos (submenú). Dashboards: calidad, oportunidades, aspectos.
type Vista = 'inicio' | 'riesgos' | 'calidad' | 'oportunidades' | 'aspectos'

function App() {
  const [vista, setVista] = useState<Vista>('inicio')
  const ir = (v: Vista) => () => setVista(v)

  switch (vista) {
    case 'riesgos':
      return (
        <Bienvenida
          titulo="Matriz de Riesgos"
          onVolver={ir('inicio')}
          opciones={[{ titulo: 'Gestión de Calidad', onAbrir: ir('calidad') }]}
        />
      )
    case 'calidad':
      return (
        <PanelRegistros key={vista} titulo="Gestión de Calidad" modulo={moduloRiesgos} onVolver={ir('riesgos')} />
      )
    case 'oportunidades':
      return (
        <PanelRegistros
          key={vista}
          titulo="Evaluación de Oportunidades"
          modulo={moduloOportunidades}
          onVolver={ir('inicio')}
        />
      )
    case 'aspectos':
      return (
        <PanelRegistros
          key={vista}
          titulo="Matriz de Aspectos e Impactos Ambientales"
          modulo={moduloAspectos}
          onVolver={ir('inicio')}
        />
      )
    default:
      return (
        <Bienvenida
          titulo="Sistema de Gestión Integral"
          opciones={[
            { titulo: 'Matriz de Riesgos', onAbrir: ir('riesgos') },
            { titulo: 'Evaluación de Oportunidades', onAbrir: ir('oportunidades') },
            { titulo: 'Matriz de Aspectos e Impactos Ambientales', onAbrir: ir('aspectos') },
          ]}
        />
      )
  }
}

export default App
