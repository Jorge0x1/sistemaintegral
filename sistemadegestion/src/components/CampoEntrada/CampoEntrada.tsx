import './CampoEntrada.css'

type Props = {
  valor: string
  onChange: (valor: string) => void
  etiqueta: string
  lista?: string
  placeholder?: string
}

function CampoEntrada({ valor, onChange, etiqueta, lista, placeholder }: Props) {
  return (
    <input
      className="campo-entrada"
      type="text"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      list={lista}
      placeholder={placeholder}
      aria-label={etiqueta}
    />
  )
}

export default CampoEntrada
