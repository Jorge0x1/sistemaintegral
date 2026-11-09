import './Icono.css'

const iconos = {
  mas: <path d="M12 5v14M5 12h14" />,
  editar: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  borrar: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  guardar: <path d="M5 12l5 5L20 7" />,
  cancelar: <path d="M6 6l12 12M18 6L6 18" />,
  atras: <path d="M15 6l-6 6 6 6" />,
  info: <path d="M12 11v7M12 6h.01" />,
  calendario: <path d="M7 3v4M17 3v4M4 10h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
  lista: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
}

export type NombreIcono = keyof typeof iconos

function Icono({ nombre }: { nombre: NombreIcono }) {
  return (
    <svg className="icono-svg" viewBox="0 0 24 24" aria-hidden="true">
      {iconos[nombre]}
    </svg>
  )
}

export default Icono
