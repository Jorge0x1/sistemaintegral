import type { Escala, Rango } from './registros'

export type Oportunidad = {
  id: number
  enfoque: string
  proceso: string
  fecha_incorporacion: string | null
  antecedentes: string
  origen: string
  riesgo_aspecto: string
  oportunidad: string
  beneficios: string[]
  impacto: number
  tiempo: number
  folio: string
  vigencia: string | null
}

export type OportunidadInput = Omit<Oportunidad, 'id'>

export type CatalogosOportunidades = {
  enfoques: string[]
  procesos: string[]
  origenes: string[]
  impacto: Escala[]
  tiempo: Escala[]
  matriz: Map<string, number>
  evaluacion: Rango[]
}

// Valores del formulario tal como se escriben (beneficios separados por comas, I y T como texto)
export type BorradorOportunidad = {
  enfoque: string
  proceso: string
  fecha_incorporacion: string
  antecedentes: string
  origen: string
  riesgo_aspecto: string
  oportunidad: string
  beneficios: string
  impacto: string
  tiempo: string
  folio: string
  vigencia: string
}
