import FilaEdicion from '../FilaEdicion/FilaEdicion'
import FilaRegistro from '../FilaRegistro/FilaRegistro'
import { NUEVO } from '../../types/registros'
import type { Cambiar, Editando, Grupo, Registro } from '../../types/registros'
import './TablaRegistros.css'

type Props<R extends Registro, B, C> = {
  grupos: Grupo<R, B, C>[]
  nombre: string
  textoVacio: string
  sugerencias: [id: string, valores: string[]][]
  cat: C | null
  registros: R[]
  cargando: boolean
  editando: Editando
  borrador: B
  guardando: boolean
  cambiar: Cambiar<B>
  onEditar: (r: R) => void
  onBorrar: (r: R) => void
  onGuardar: () => void
  onCancelar: () => void
}

function TablaRegistros<R extends Registro, B, C>({
  grupos,
  nombre,
  textoVacio,
  sugerencias,
  cat,
  registros,
  cargando,
  editando,
  borrador,
  guardando,
  cambiar,
  onEditar,
  onBorrar,
  onGuardar,
  onCancelar,
}: Props<R, B, C>) {
  const columnas = grupos.flatMap((g) => g.columnas)
  const conGrupos = grupos.some((g) => g.titulo)
  const totalColumnas = columnas.length + 1

  function filaEdicion(c: C, key?: number) {
    return (
      <FilaEdicion
        key={key}
        borrador={borrador}
        columnas={columnas}
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
      {sugerencias.map(([id, valores]) => (
        <datalist key={id} id={id}>
          {valores.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      ))}

      <div className="tabla-contenedor">
        <table className="matriz">
          <thead>
            {conGrupos && (
              <tr>
                {grupos.map((g) => (
                  <th key={g.titulo} colSpan={g.columnas.length} className="grupo">
                    {g.titulo}
                  </th>
                ))}
                <th rowSpan={2} className="grupo acciones-th">Acciones</th>
              </tr>
            )}
            <tr>
              {columnas.map((c) => (
                <th key={c.titulo}>{c.titulo}</th>
              ))}
              {!conGrupos && <th className="acciones-th">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={totalColumnas} className="centro vacio">Cargando…</td>
              </tr>
            )}
            {cat && registros.length === 0 && editando !== NUEVO && (
              <tr>
                <td colSpan={totalColumnas} className="centro vacio">{textoVacio}</td>
              </tr>
            )}
            {cat &&
              registros.map((r) =>
                editando === r.id ? (
                  filaEdicion(cat, r.id)
                ) : (
                  <FilaRegistro
                    key={r.id}
                    registro={r}
                    columnas={columnas}
                    cat={cat}
                    nombre={nombre}
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

export default TablaRegistros
