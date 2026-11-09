import './Bienvenida.css'

type Props = {
  onCalidad: () => void
  onOportunidades: () => void
}

function Bienvenida({ onCalidad, onOportunidades }: Props) {
  return (
    <main className="bienvenida">
      <h1>Sistema de Gestión Integral</h1>
      <div className="bienvenida-acciones">
        <button type="button" className="bienvenida-boton" onClick={onCalidad}>
          Gestión de Calidad
        </button>
        <button type="button" className="bienvenida-boton" onClick={onOportunidades}>
          Evaluación de Oportunidades
        </button>
      </div>
    </main>
  )
}

export default Bienvenida
