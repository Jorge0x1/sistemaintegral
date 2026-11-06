import SinValor from '../SinValor/SinValor'
import './ListaControles.css'

function ListaControles({ controles }: { controles: string[] }) {
  if (!controles.length) return <SinValor />
  return (
    <ul className="controles">
      {controles.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  )
}

export default ListaControles
