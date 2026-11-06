import Alerta from './components/Alerta/Alerta'
import BotonAgregar from './components/BotonAgregar/BotonAgregar'
import Encabezado from './components/Encabezado/Encabezado'
import TablaRiesgos from './components/TablaRiesgos/TablaRiesgos'
import { useRiesgos } from './hooks/useRiesgos'
import './App.css'

function App() {
  const r = useRiesgos()

  return (
    <main className="dashboard">
      <Encabezado titulo="Matriz de riesgos">
        <BotonAgregar
          titulo="Agregar riesgo"
          disabled={!r.cat || r.editando !== null}
          onClick={r.nuevo}
        />
      </Encabezado>

      {r.errorCarga && (
        <Alerta>
          No se pudieron cargar los datos — {r.errorCarga}. ¿Ya ejecutaste el script SQL en Supabase?
        </Alerta>
      )}
      {r.aviso && <Alerta>{r.aviso}</Alerta>}

      <TablaRiesgos
        cat={r.cat}
        riesgos={r.riesgos}
        cargando={!r.cat && !r.errorCarga}
        editando={r.editando}
        borrador={r.borrador}
        guardando={r.guardando}
        cambiar={r.cambiar}
        onEditar={r.editar}
        onBorrar={r.borrar}
        onGuardar={r.guardar}
        onCancelar={r.cancelar}
      />
    </main>
  )
}

export default App
