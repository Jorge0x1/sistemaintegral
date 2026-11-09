import type { Escala, Rango } from './registros'

export type AspectoAmbiental = {
  id: number
  proceso: string
  actividad: string
  estado_proceso: string | null
  aspecto: string
  real_potencial: string | null
  impacto: string
  tipo_impacto: string | null
  frecuencia: number
  severidad: number
  controles: string[]
  folio: string
  efectividad: string | null
}

export type AspectoAmbientalInput = Omit<AspectoAmbiental, 'id'>

export type CatalogosAspectos = {
  procesos: string[]
  impactos: string[]
  frecuencia: Escala[]
  severidad: Escala[]
  matriz: Map<string, number>
  evaluacion: Rango[]
}

// Valores del formulario tal como se escriben (controles separados por comas, F y S como texto)
export type BorradorAspecto = {
  proceso: string
  actividad: string
  estado_proceso: string
  aspecto: string
  real_potencial: string
  impacto: string
  tipo_impacto: string
  frecuencia: string
  severidad: string
  controles: string
  folio: string
  efectividad: string
}
