import SinValor from '../SinValor/SinValor'
import './ListaItems.css'

// Viñetas para los campos que se capturan separados por comas
function ListaItems({ items }: { items: string[] }) {
  if (!items.length) return <SinValor />
  return (
    <ul className="lista-items">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export default ListaItems
