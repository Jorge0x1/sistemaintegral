import type { KeyboardEvent } from 'react'
import BotonIcono from '../BotonIcono/BotonIcono'
import CeldaAcciones from '../CeldaAcciones/CeldaAcciones'
import type { Cambiar, Columna } from '../../types/registros'
import './FilaEdicion.css'

type Props<R, B, C> = {
  borrador: B
  columnas: Columna<R, B, C>[]
  cat: C
  guardando: boolean
  cambiar: Cambiar<B>
  onGuardar: () => void
  onCancelar: () => void
}

function FilaEdicion<R, B, C>({
  borrador,
  columnas,
  cat,
  guardando,
  cambiar,
  onGuardar,
  onCancelar,
}: Props<R, B, C>) {
  function teclas(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') onGuardar()
    if (e.key === 'Escape') onCancelar()
  }

  return (
    <tr className="editando" onKeyDown={teclas}>
      {columnas.map((col) => (
        <td key={col.titulo} className={col.className}>
          {col.editar(borrador, cambiar, cat)}
        </td>
      ))}
      <CeldaAcciones>
        <BotonIcono
          icono="guardar"
          titulo="Guardar"
          variante="guardar"
          disabled={guardando}
          onClick={onGuardar}
        />
        <BotonIcono icono="cancelar" titulo="Cancelar" disabled={guardando} onClick={onCancelar} />
      </CeldaAcciones>
    </tr>
  )
}

export default FilaEdicion
