import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import BotonIcono from '../BotonIcono/BotonIcono'
import './Modal.css'

type Props = {
  titulo: string
  onCerrar: () => void
  children: ReactNode
  // Ancho máximo en px (por defecto 680)
  ancho?: number
}

function Modal({ titulo, onCerrar, children, ancho }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialogo.current
    if (d && !d.open) {
      d.showModal()
      // showModal enfoca el primer botón (la X); si hay un campo, mejor empezar ahí
      d.querySelector<HTMLElement>('input, select, textarea')?.focus()
    }
  }, [])

  // Se monta en body para no heredar estilos de la tabla. Las teclas no deben llegar
  // a la fila en edición: Escape cerraría el modal y además cancelaría la edición.
  return createPortal(
    <dialog
      ref={dialogo}
      className="modal"
      style={ancho ? { width: `min(${ancho}px, calc(100vw - 32px))` } : undefined}
      aria-label={titulo}
      onClose={onCerrar}
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div className="modal-contenido">
        <header className="modal-encabezado">
          <h2>{titulo}</h2>
          <BotonIcono icono="cancelar" titulo="Cerrar" onClick={onCerrar} />
        </header>
        {children}
      </div>
    </dialog>,
    document.body,
  )
}

export default Modal
