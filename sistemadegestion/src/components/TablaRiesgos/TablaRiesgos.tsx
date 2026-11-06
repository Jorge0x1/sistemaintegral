import FilaEdicion from '../FilaEdicion/FilaEdicion'
import FilaRiesgo from '../FilaRiesgo/FilaRiesgo'
import { columnas, grupos } from '../../config/columnasRiesgos'
import { NUEVO } from '../../types/riesgos'
import type { Borrador, Cambiar, Catalogos, Editando, Riesgo } from '../../types/riesgos'
import './TablaRiesgos.css'

type Props = {
  cat: Catalogos | null
  riesgos: Riesgo[]
  cargando: boolean
  editando: Editando
  borrador: Borrador
  guardando: boolean
  cambiar: Cambiar
  onEditar: (r: Riesgo) => void
  onBorrar: (r: Riesgo) => void
  onGuardar: () => void
  onCancelar: () => void
}

function TablaRiesgos({
  cat,
  riesgos,
  cargando,
  editando,
  borrador,
  guardando,
  cambiar,
  onEditar,
  onBorrar,
  onGuardar,
  onCancelar,
}: Props) {
  const totalColumnas = columnas.length + 1

  function filaEdicion(c: Catalogos, key?: number) {
    return (
      <FilaEdicion
        key={key}
        borrador={borrador}
        cat={c}
        guardando={guardando}
        cambiar={cambiar}
        onGuardar={onGuardar}
        onCancelar={onCancelar}
      />
    )
  }

  return (
    <>
      {cat &&
        (
          [
            ['dl-procesos', cat.procesos],
            ['dl-fuentes', cat.fuentes],
            ['dl-causas', cat.causas],
            ['dl-consecuencias', cat.consecuencias],
          ] as const
        ).map(([id, valores]) => (
          <datalist key={id} id={id}>
            {valores.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        ))}

      <div className="tabla-contenedor">
        <table className="matriz">
          <thead>
            <tr>
              {grupos.map((g) => (
                <th key={g.titulo} colSpan={g.columnas.length} className="grupo">
                  {g.titulo}
                </th>
              ))}
              <th rowSpan={2} className="grupo acciones-th">Acciones</th>
            </tr>
            <tr>
              {columnas.map((c) => (
                <th key={c.titulo}>{c.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={totalColumnas} className="centro vacio">Cargando…</td>
              </tr>
            )}
            {cat && riesgos.length === 0 && editando !== NUEVO && (
              <tr>
                <td colSpan={totalColumnas} className="centro vacio">
                  No hay riesgos registrados. Usa el botón + para agregar uno.
                </td>
              </tr>
            )}
            {cat &&
              riesgos.map((r) =>
                editando === r.id ? (
                  filaEdicion(cat, r.id)
                ) : (
                  <FilaRiesgo
                    key={r.id}
                    riesgo={r}
                    cat={cat}
                    bloqueada={editando !== null}
                    onEditar={onEditar}
                    onBorrar={onBorrar}
                  />
                ),
              )}
            {cat && editando === NUEVO && filaEdicion(cat)}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TablaRiesgos
