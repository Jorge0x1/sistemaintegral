import type { ReactNode } from 'react'
import './CeldaAcciones.css'

function CeldaAcciones({ children }: { children: ReactNode }) {
  return <td className="acciones">{children}</td>
}

export default CeldaAcciones
