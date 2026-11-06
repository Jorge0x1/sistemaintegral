import type { ReactNode } from 'react'
import './Encabezado.css'

function Encabezado({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="barra">
      <h1>{titulo}</h1>
      {children}
    </header>
  )
}

export default Encabezado
