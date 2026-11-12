import { useEffect, useState } from 'react'
import BarraSesion from './components/BarraSesion/BarraSesion'
import Bienvenida from './components/Bienvenida/Bienvenida'
import InicioSesion from './components/InicioSesion/InicioSesion'
import PanelRegistros from './components/PanelRegistros/PanelRegistros'
import { moduloAspectos } from './config/aspectos'
import { moduloOportunidades } from './config/oportunidades'
import { crearModuloRiesgos } from './config/riesgos'
import { usePublicacion } from './hooks/usePublicacion'
import { useSesion } from './hooks/useSesion'
import { cerrarSesion } from './services/sesion'

// Matrices de riesgos por proceso: mismo dashboard, cambia el proceso y su catálogo de actividades.
// Para agregar un proceso basta otra entrada aquí. Se crean una sola vez, fuera del componente,
// porque el dashboard recarga datos cuando cambia el módulo.
const MATRICES_RIESGOS = {
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
  calidad: {
    titulo: 'Gestión de Calidad',
    modulo: crearModuloRiesgos('Gestión de Calidad', 'actividad_riesgos_gc'),
  },
  sesg: {
    titulo: 'Sustentabilidad & ESG',
    modulo: crearModuloRiesgos('Sustentabilidad & ESG', 'actividad_riesgos_sesg'),
  },
}

type MatrizRiesgos = keyof typeof MATRICES_RIESGOS
type Vista = 'inicio' | 'riesgos' | 'oportunidades' | 'aspectos' | MatrizRiesgos

const esMatrizRiesgos = (v: Vista): v is MatrizRiesgos => v in MATRICES_RIESGOS

// Acceso discreto de editores: tusitio/#editar abre el formulario de inicio de sesión.
// Con "#" funciona en cualquier hosting sin configurar redirecciones.
const HASH_EDITAR = '#editar'
const pideAcceso = () => window.location.hash === HASH_EDITAR

function quitarHash() {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

function App() {
  const [vista, setVista] = useState<Vista>('inicio')
  const ir = (v: Vista) => () => setVista(v)
  const { editor } = useSesion()
  const publicacion = usePublicacion(editor)
  const [acceso, setAcceso] = useState(pideAcceso)

  // Por si se escribe #editar con la página ya abierta
  useEffect(() => {
    const revisar = () => setAcceso(pideAcceso())
    window.addEventListener('hashchange', revisar)
    return () => window.removeEventListener('hashchange', revisar)
  }, [])

  function cerrarAcceso() {
    quitarHash()
    setAcceso(false)
  }

  function pantalla() {
    const editable = editor !== null

    if (esMatrizRiesgos(vista)) {
      const { titulo, modulo } = MATRICES_RIESGOS[vista]
      return (
        <PanelRegistros
          key={vista}
          titulo={titulo}
          modulo={modulo}
          onVolver={ir('riesgos')}
          editable={editable}
          onCambio={publicacion.revisar}
        />
      )
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
            editable={editable}
            onCambio={publicacion.revisar}
          />
        )
      case 'aspectos':
        return (
          <PanelRegistros
            key={vista}
            titulo="Matriz de Aspectos e Impactos Ambientales"
            modulo={moduloAspectos}
            onVolver={ir('inicio')}
            editable={editable}
            onCambio={publicacion.revisar}
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

  return (
    <>
      {pantalla()}
      {editor && (
        <BarraSesion
          editor={editor}
          pendiente={publicacion.pendiente}
          publicando={publicacion.publicando}
          error={publicacion.error}
          onPublicar={publicacion.publicar}
          onCerrarSesion={cerrarSesion}
        />
      )}
      {acceso && !editor && <InicioSesion onListo={cerrarAcceso} onCerrar={cerrarAcceso} />}
    </>
  )
}

export default App
