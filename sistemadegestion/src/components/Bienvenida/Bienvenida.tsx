import BotonIcono from '../BotonIcono/BotonIcono'
import './Bienvenida.css'

export type OpcionInicio = {
  titulo: string
  onAbrir: () => void
}

type Props = {
  titulo: string
  opciones: OpcionInicio[]
  // Sin onVolver es la portada; con onVolver es un submenú
  onVolver?: () => void
}

// Pantalla de menú: título centrado y un botón por cada opción
function Bienvenida({ titulo, opciones, onVolver }: Props) {
  return (
    <main className="bienvenida">
      {onVolver && (
        <div className="bienvenida-volver">
          <BotonIcono icono="atras" titulo="Volver" onClick={onVolver} />
        </div>
      )}
      <h1>{titulo}</h1>
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
