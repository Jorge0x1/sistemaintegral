import type { ReactNode } from 'react'
import './Alerta.css'

function Alerta({ children }: { children: ReactNode }) {
  return <p className="alerta">{children}</p>
}

export default Alerta
