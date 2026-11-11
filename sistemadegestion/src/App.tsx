import { useState } from 'react'
import Bienvenida from './components/Bienvenida/Bienvenida'
import PanelRegistros from './components/PanelRegistros/PanelRegistros'
import { moduloAspectos } from './config/aspectos'
import { moduloOportunidades } from './config/oportunidades'
import { crearModuloRiesgos } from './config/riesgos'

// Matrices de riesgos por proceso: mismo dashboard, cambia el proceso y su catálogo de actividades.
// Para agregar un proceso basta otra entrada aquí. Se crean una sola vez, fuera del componente,
// porque el dashboard recarga datos cuando cambia el módulo.
const MATRICES_RIESGOS = {
  calidad: {
    titulo: 'Gestión de Calidad',
    modulo: crearModuloRiesgos('Gestión de Calidad', 'actividad_riesgos_gc'),
  },
  meps: {
    titulo: 'Manufactura EPS',
    modulo: crearModuloRiesgos('Manufactura EPS', 'actividad_riesgos_meps'),
  },
  epc: {
    titulo: 'Entrega de Producto al Cliente',
    modulo: crearModuloRiesgos('Entrega de Producto al Cliente', 'actividad_riesgos_epc'),
  },
  dt: {
    titulo: 'Desarrollo Tecnológico',
    modulo: crearModuloRiesgos('Desarrollo Tecnológico', 'actividad_riesgos_dt'),
  },
  pc: {
    titulo: 'Programación de la Cadena',
    modulo: crearModuloRiesgos('Programación de la Cadena', 'actividad_riesgos_pc'),
  },
  ceps: {
    titulo: 'Comercialización EPS',
    modulo: crearModuloRiesgos('Comercialización EPS', 'actividad_riesgos_ceps'),
  },
  gvc: {
    titulo: 'Generación de Valor Clientes',
    modulo: crearModuloRiesgos('Generación de Valor Clientes', 'actividad_riesgo_gvc'),
  },
  ti: {
    titulo: 'TI',
    modulo: crearModuloRiesgos('TI', 'actividad_riesgos_ti'),
  },
  ap: {
    titulo: 'Admon Proyectos',
    modulo: crearModuloRiesgos('Admon Proyectos', 'actividad_riesgo_ap'),
  },
  m: {
    titulo: 'Mantenimiento',
    modulo: crearModuloRiesgos('Mantenimiento', 'actividad_riesgos_m'),
  },
  cs: {
    titulo: 'Cadena de Suministro',
    // En procesos_riesgos se llama "Cadena Suministro"
    modulo: crearModuloRiesgos('Cadena Suministro', 'actividad_riesgos_cs'),
  },
  ch: {
    titulo: 'Capital Humano',
    modulo: crearModuloRiesgos('Capital Humano', 'actividad_riesgos_ch'),
  },
  af: {
    titulo: 'Administración Financiera',
    modulo: crearModuloRiesgos('Administración Financiera', 'actividad_riesgos_af'),
  },
  mash: {
    titulo: 'MASH',
    modulo: crearModuloRiesgos('MASH', 'actividad_riesgos_mash'),
  },
  sesg: {
    titulo: 'Sustentabilidad & ESG',
    modulo: crearModuloRiesgos('Sustentabilidad & ESG', 'actividad_riesgos_sesg'),
  },
}

type MatrizRiesgos = keyof typeof MATRICES_RIESGOS
type Vista = 'inicio' | 'riesgos' | 'oportunidades' | 'aspectos' | MatrizRiesgos

const esMatrizRiesgos = (v: Vista): v is MatrizRiesgos => v in MATRICES_RIESGOS

function App() {
  const [vista, setVista] = useState<Vista>('inicio')
  const ir = (v: Vista) => () => setVista(v)

  if (esMatrizRiesgos(vista)) {
    const { titulo, modulo } = MATRICES_RIESGOS[vista]
    return <PanelRegistros key={vista} titulo={titulo} modulo={modulo} onVolver={ir('riesgos')} />
  }

  switch (vista) {
    case 'riesgos':
      return (
        <Bienvenida
          titulo="Matriz de Riesgos"
          onVolver={ir('inicio')}
          opciones={(Object.keys(MATRICES_RIESGOS) as MatrizRiesgos[]).map((v) => ({
            titulo: MATRICES_RIESGOS[v].titulo,
            onAbrir: ir(v),
          }))}
        />
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
