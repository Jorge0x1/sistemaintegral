import './CampoSelect.css'

type OpcionSelect = {
  valor: string
  etiqueta: string
}

type Props = {
  valor: string
  opciones: OpcionSelect[]
  onChange: (valor: string) => void
  etiqueta: string
}

function CampoSelect({ valor, opciones, onChange, etiqueta }: Props) {
  return (
    <select
      className="campo-select"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      aria-label={etiqueta}
    >
      <option value="">—</option>
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.etiqueta}
        </option>
      ))}
    </select>
  )
}

export default CampoSelect
