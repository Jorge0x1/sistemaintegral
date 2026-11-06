import './CampoSelect.css'

export type OpcionSelect = {
  valor: string
  etiqueta: string
  descripcion?: string
}

type Props = {
  valor: string
  opciones: OpcionSelect[]
  onChange: (valor: string) => void
  etiqueta: string
}

function CampoSelect({ valor, opciones, onChange, etiqueta }: Props) {
  const actual = opciones.find((o) => o.valor === valor)
  return (
    <select
      className="campo-select"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      title={actual?.descripcion}
      aria-label={etiqueta}
    >
      <option value="">—</option>
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor} title={o.descripcion}>
          {o.etiqueta}
        </option>
      ))}
    </select>
  )
}

export default CampoSelect
