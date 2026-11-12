import { useEffect } from 'react'
import Alerta from '../Alerta/Alerta'
import BotonAgregar from '../BotonAgregar/BotonAgregar'
import BotonIcono from '../BotonIcono/BotonIcono'
import Encabezado from '../Encabezado/Encabezado'
import TablaRegistros from '../TablaRegistros/TablaRegistros'
import { useRegistros } from '../../hooks/useRegistros'
import type { Modulo, Registro } from '../../types/registros'
import './PanelRegistros.css'

type Props<R extends Registro, I, B, C> = {
  titulo: string
  modulo: Modulo<R, I, B, C>
  onVolver: () => void
  // false = modo lectura: sin botón agregar ni acciones por fila
  editable: boolean
}

// Dashboard completo de un módulo: encabezado, avisos y tabla (editable solo para editores)
function PanelRegistros<R extends Registro, I, B, C>({
  titulo,
  modulo,
  onVolver,
  editable,
}: Props<R, I, B, C>) {
  const r = useRegistros(modulo)
  const { cancelar } = r

  // Si la sesión se cierra a media edición, se descarta la fila abierta
  useEffect(() => {
    if (!editable) cancelar()
  }, [editable, cancelar])

  return (
    <main className="dashboard">
      <Encabezado
        titulo={titulo}
        inicio={
          <BotonIcono
            icono="atras"
            titulo="Volver"
            disabled={r.editando !== null}
            onClick={onVolver}
          />
        }
      >
        {editable && (
          <BotonAgregar
            titulo={`Agregar ${modulo.nombre}`}
            disabled={!r.cat || r.editando !== null}
            onClick={r.nuevo}
          />
        )}
      </Encabezado>

      {r.errorCarga && (
        <Alerta>
          No se pudieron cargar los datos — {r.errorCarga}. ¿Ya ejecutaste el script SQL en Supabase?
        </Alerta>
      )}
      {r.aviso && <Alerta>{r.aviso}</Alerta>}

      <TablaRegistros
        grupos={modulo.grupos}
        nombre={modulo.nombre}
        textoVacio={modulo.textoVacio}
        sugerencias={r.cat ? modulo.sugerencias(r.cat) : []}
        cat={r.cat}
        editable={editable}
        registros={r.registros}
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

export default PanelRegistros
