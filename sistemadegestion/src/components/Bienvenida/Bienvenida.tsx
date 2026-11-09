import './Bienvenida.css'

export type OpcionInicio = {
  titulo: string
  onAbrir: () => void
}

// Portada: un botón por cada dashboard del sistema
function Bienvenida({ opciones }: { opciones: OpcionInicio[] }) {
  return (
    <main className="bienvenida">
      <h1>Sistema de Gestión Integral</h1>
      <div className="bienvenida-acciones">
        {opciones.map((o) => (
          <button key={o.titulo} type="button" className="bienvenida-boton" onClick={o.onAbrir}>
            {o.titulo}
          </button>
        ))}
      </div>
    </main>
  )
}

export default Bienvenida
