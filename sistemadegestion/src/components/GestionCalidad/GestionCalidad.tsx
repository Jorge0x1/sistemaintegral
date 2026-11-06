import Alerta from '../Alerta/Alerta'
import BotonAgregar from '../BotonAgregar/BotonAgregar'
import BotonIcono from '../BotonIcono/BotonIcono'
import Encabezado from '../Encabezado/Encabezado'
import TablaRiesgos from '../TablaRiesgos/TablaRiesgos'
import { useRiesgos } from '../../hooks/useRiesgos'
import './GestionCalidad.css'

function GestionCalidad({ onVolver }: { onVolver: () => void }) {
  const r = useRiesgos()

  return (
    <main className="dashboard">
      <Encabezado
        titulo="Gestión de Calidad"
        inicio={
          <BotonIcono
            icono="atras"
            titulo="Volver al inicio"
            disabled={r.editando !== null}
            onClick={onVolver}
          />
        }
      >
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

export default GestionCalidad
