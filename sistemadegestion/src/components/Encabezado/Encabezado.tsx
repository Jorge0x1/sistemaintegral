import type { ReactNode } from 'react'
import './Encabezado.css'

type Props = {
  titulo: string
  inicio?: ReactNode
  children?: ReactNode
}

function Encabezado({ titulo, inicio, children }: Props) {
  return (
    <header className="barra">
      {inicio}
      <h1>{titulo}</h1>
      {children}
    </header>
  )
}

export default Encabezado
