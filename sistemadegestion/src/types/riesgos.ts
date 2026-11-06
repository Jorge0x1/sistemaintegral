export type Riesgo = {
  id: number
  proceso: string
  fecha_incorporacion: string | null
  tipo_riesgo: string
  fuente_actividad: string
  evento_riesgo: string
  causa: string
  consecuencia_impacto: string
  controles: string[]
  severidad: number
  probabilidad: number
  folio: string
}

export type RiesgoInput = Omit<Riesgo, 'id'>

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

export type Catalogos = {
  procesos: string[]
  tiposRiesgo: string[]
  fuentes: string[]
  causas: string[]
  consecuencias: string[]
  severidad: Escala[]
  probabilidad: Escala[]
  matriz: Map<string, number>
  evaluacion: Rango[]
}

// Valores del formulario tal como se escriben (controles separados por comas, S y P como texto)
export type Borrador = {
  proceso: string
  fecha_incorporacion: string
  tipo_riesgo: string
  fuente_actividad: string
  evento_riesgo: string
  causa: string
  consecuencia_impacto: string
  controles: string
  severidad: string
  probabilidad: string
  folio: string
}

export type Cambiar = (campo: keyof Borrador, valor: string) => void

export const NUEVO = 'nuevo'

// Fila en edición: el id de un riesgo, NUEVO para uno por crear, o null si no se edita nada
export type Editando = number | typeof NUEVO | null
