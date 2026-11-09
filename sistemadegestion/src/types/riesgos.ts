import type { Escala, Rango } from './registros'

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
  efectividad: string | null
}

export type RiesgoInput = Omit<Riesgo, 'id'>

export type CatalogosRiesgos = {
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
export type BorradorRiesgo = {
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
  efectividad: string
}
