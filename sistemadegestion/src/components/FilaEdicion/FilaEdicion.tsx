import type { KeyboardEvent } from 'react'
import BotonIcono from '../BotonIcono/BotonIcono'
import CeldaAcciones from '../CeldaAcciones/CeldaAcciones'
import { columnas } from '../../config/columnasRiesgos'
import type { Borrador, Cambiar, Catalogos } from '../../types/riesgos'
import './FilaEdicion.css'

type Props = {
  borrador: Borrador
  cat: Catalogos
  guardando: boolean
  cambiar: Cambiar
  onGuardar: () => void
  onCancelar: () => void
}

function FilaEdicion({ borrador, cat, guardando, cambiar, onGuardar, onCancelar }: Props) {
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
