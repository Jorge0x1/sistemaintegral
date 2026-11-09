import type { ReactNode } from 'react'

// Tipos compartidos por todos los dashboards de registros (riesgos, oportunidades, …)

export type Registro = { id: number }

export type Escala = {
  numero: number
  valor: string
  descripcion: string
}

export type Rango = {
  min: number
  max: number
  descripcion: string
}

// Resultado de cruzar dos escalas en una matriz y ubicarlo en un rango
export type Nivel = {
  valor: number
  descripcion: string
}

export type Cambiar<B> = (campo: keyof B, valor: string) => void

export const NUEVO = 'nuevo'

// Fila en edición: el id de un registro, NUEVO para uno por crear, o null si no se edita nada
export type Editando = number | typeof NUEVO | null

// R: registro guardado · B: borrador del formulario (todo texto) · C: catálogos del módulo
export type Columna<R, B, C> = {
  titulo: string
  className?: string
  ver: (r: R, cat: C) => ReactNode
  editar: (b: B, cambiar: Cambiar<B>, cat: C) => ReactNode
}

// Un grupo sin título no genera fila de encabezado agrupado
export type Grupo<R, B, C> = {
  titulo: string
  columnas: Columna<R, B, C>[]
}

// Todo lo que un dashboard necesita saber de su tabla. I: datos que se envían a la base.
export type Modulo<R extends Registro, I, B, C> = {
  nombre: string
  textoVacio: string
  grupos: Grupo<R, B, C>[]
  sugerencias: (cat: C) => [id: string, valores: string[]][]
  cargarCatalogos: () => Promise<C>
  listar: () => Promise<R[]>
  crear: (datos: I) => Promise<R>
  actualizar: (id: number, datos: I) => Promise<R>
  borrar: (id: number) => Promise<void>
  vacio: () => B
  aBorrador: (r: R) => B
  aDatos: (b: B) => I
  faltantes: (b: B) => string[]
  confirmarBorrado: (r: R) => string
}
