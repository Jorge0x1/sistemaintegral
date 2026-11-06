import BotonIcono from '../BotonIcono/BotonIcono'
import CeldaAcciones from '../CeldaAcciones/CeldaAcciones'
import { columnas } from '../../config/columnasRiesgos'
import type { Catalogos, Riesgo } from '../../types/riesgos'
import './FilaRiesgo.css'

type Props = {
  riesgo: Riesgo
  cat: Catalogos
  bloqueada: boolean
  onEditar: (r: Riesgo) => void
  onBorrar: (r: Riesgo) => void
}

function FilaRiesgo({ riesgo, cat, bloqueada, onEditar, onBorrar }: Props) {
  return (
    <tr className="fila-riesgo">
      {columnas.map((col) => (
        <td key={col.titulo} className={col.className}>
          {col.ver(riesgo, cat)}
        </td>
      ))}
      <CeldaAcciones>
        <BotonIcono
          icono="editar"
          titulo="Editar"
          etiqueta={`Editar riesgo ${riesgo.id}`}
          disabled={bloqueada}
          onClick={() => onEditar(riesgo)}
        />
        <BotonIcono
          icono="borrar"
          titulo="Borrar"
          etiqueta={`Borrar riesgo ${riesgo.id}`}
          variante="borrar"
          disabled={bloqueada}
          onClick={() => onBorrar(riesgo)}
        />
      </CeldaAcciones>
    </tr>
  )
}

export default FilaRiesgo
