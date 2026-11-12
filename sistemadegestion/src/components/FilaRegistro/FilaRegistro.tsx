import BotonIcono from '../BotonIcono/BotonIcono'
import CeldaAcciones from '../CeldaAcciones/CeldaAcciones'
import type { Columna, Registro } from '../../types/registros'
import './FilaRegistro.css'

type Props<R extends Registro, B, C> = {
  registro: R
  columnas: Columna<R, B, C>[]
  cat: C
  nombre: string
  editable: boolean
  bloqueada: boolean
  onEditar: (r: R) => void
  onBorrar: (r: R) => void
}

function FilaRegistro<R extends Registro, B, C>({
  registro,
  columnas,
  cat,
  nombre,
  editable,
  bloqueada,
  onEditar,
  onBorrar,
}: Props<R, B, C>) {
  return (
    <tr className="fila-registro">
      {columnas.map((col) => (
        <td key={col.titulo} className={col.className}>
          {col.ver(registro, cat)}
        </td>
      ))}
      {editable && (
      <CeldaAcciones>
        <BotonIcono
          icono="editar"
          titulo="Editar"
          etiqueta={`Editar ${nombre} ${registro.id}`}
          disabled={bloqueada}
          onClick={() => onEditar(registro)}
        />
        <BotonIcono
          icono="borrar"
          titulo="Borrar"
          etiqueta={`Borrar ${nombre} ${registro.id}`}
          variante="borrar"
          disabled={bloqueada}
          onClick={() => onBorrar(registro)}
        />
      </CeldaAcciones>
      )}
    </tr>
  )
}

export default FilaRegistro
