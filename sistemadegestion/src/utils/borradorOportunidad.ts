import { aLista, deLista } from './lista'
import type { BorradorOportunidad, Oportunidad, OportunidadInput } from '../types/oportunidades'

export function borradorOportunidadVacio(): BorradorOportunidad {
  return {
    enfoque: '',
    proceso: '',
    fecha_incorporacion: '',
    antecedentes: '',
    origen: '',
    riesgo_aspecto: '',
    oportunidad: '',
    beneficios: '',
    impacto: '',
    tiempo: '',
    folio: 'NA',
    vigencia: '',
  }
}

export function aBorradorOportunidad(o: Oportunidad): BorradorOportunidad {
  return {
    enfoque: o.enfoque,
    proceso: o.proceso,
    fecha_incorporacion: o.fecha_incorporacion ?? '',
    antecedentes: o.antecedentes,
    origen: o.origen,
    riesgo_aspecto: o.riesgo_aspecto,
    oportunidad: o.oportunidad,
    beneficios: deLista(o.beneficios),
    impacto: String(o.impacto),
    tiempo: String(o.tiempo),
    folio: o.folio,
    vigencia: o.vigencia ?? '',
  }
}

export function aDatosOportunidad(b: BorradorOportunidad): OportunidadInput {
  return {
    enfoque: b.enfoque,
    proceso: b.proceso.trim(),
    fecha_incorporacion: b.fecha_incorporacion || null,
    antecedentes: b.antecedentes.trim(),
    origen: b.origen.trim(),
    riesgo_aspecto: b.riesgo_aspecto.trim(),
    oportunidad: b.oportunidad.trim(),
    beneficios: aLista(b.beneficios),
    impacto: Number(b.impacto),
    tiempo: Number(b.tiempo),
    folio: b.folio.trim() || 'NA',
    vigencia: b.vigencia || null,
  }
}

export function faltantesOportunidad(b: BorradorOportunidad) {
  const requeridos: [keyof BorradorOportunidad, string][] = [
    ['enfoque', 'Enfoque'],
    ['proceso', 'Proceso'],
    ['oportunidad', '¿Cuál es la Oportunidad?'],
    ['impacto', 'I'],
    ['tiempo', 'T'],
  ]
  return requeridos.filter(([campo]) => !b[campo].trim()).map(([, nombre]) => nombre)
}
