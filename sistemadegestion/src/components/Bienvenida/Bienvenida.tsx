import './Bienvenida.css'

function Bienvenida({ onAbrir }: { onAbrir: () => void }) {
  return (
    <main className="bienvenida">
      <h1>Sistema de Gestión Integral</h1>
      <button type="button" className="bienvenida-boton" onClick={onAbrir}>
        Gestión de Calidad
      </button>
    </main>
  )
}

export default Bienvenida
