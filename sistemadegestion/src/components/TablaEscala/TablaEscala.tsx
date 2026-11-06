import type { Escala } from '../../types/riesgos'
import './TablaEscala.css'

// "1. Daños menores 2. Sin reclamo" → una línea por cada punto numerado
function puntos(descripcion: string) {
  return descripcion.split(/\s+(?=\d+\.\s)/)
}

function TablaEscala({ escala }: { escala: Escala[] }) {
  return (
    <table className="tabla-escala">
      <thead>
        <tr>
          <th>Nivel</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {escala.map((e) => (
          <tr key={e.valor}>
            <td className="tabla-escala-nivel">{e.valor}</td>
            <td>
              {puntos(e.descripcion).map((p) => (
                <div key={p}>{p}</div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TablaEscala
