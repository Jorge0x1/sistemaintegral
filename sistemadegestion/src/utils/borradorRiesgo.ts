import { aLista, deLista } from './lista'
import type { BorradorRiesgo, Riesgo, RiesgoInput } from '../types/riesgos'

export function borradorRiesgoVacio(): BorradorRiesgo {
  return {
    proceso: '',
    fecha_incorporacion: '',
    tipo_riesgo: '',
    fuente_actividad: '',
    evento_riesgo: '',
    causa: '',
    consecuencia_impacto: '',
    controles: '',
    severidad: '',
    probabilidad: '',
    folio: 'NA',
    efectividad: '',
  }
}

export function aBorradorRiesgo(r: Riesgo): BorradorRiesgo {
  return {
    proceso: r.proceso,
    fecha_incorporacion: r.fecha_incorporacion ?? '',
    tipo_riesgo: r.tipo_riesgo,
    fuente_actividad: r.fuente_actividad,
    evento_riesgo: r.evento_riesgo,
    causa: r.causa,
    consecuencia_impacto: r.consecuencia_impacto,
    controles: deLista(r.controles),
    severidad: String(r.severidad),
    probabilidad: String(r.probabilidad),
    folio: r.folio,
    efectividad: r.efectividad ?? '',
  }
}

export function aDatosRiesgo(b: BorradorRiesgo): RiesgoInput {
  return {
    proceso: b.proceso.trim(),
    fecha_incorporacion: b.fecha_incorporacion || null,
    tipo_riesgo: b.tipo_riesgo,
    fuente_actividad: b.fuente_actividad.trim(),
    evento_riesgo: b.evento_riesgo.trim(),
    causa: b.causa.trim(),
    consecuencia_impacto: b.consecuencia_impacto.trim(),
    controles: aLista(b.controles),
    severidad: Number(b.severidad),
    probabilidad: Number(b.probabilidad),
    folio: b.folio.trim() || 'NA',
    efectividad: b.efectividad || null,
  }
}

export function faltantesRiesgo(b: BorradorRiesgo) {
  const requeridos: [keyof BorradorRiesgo, string][] = [
    ['proceso', 'Proceso'],
    ['tipo_riesgo', 'Tipo de riesgo'],
    ['evento_riesgo', 'Evento / Riesgo'],
    ['severidad', 'S'],
    ['probabilidad', 'P'],
  ]
  return requeridos.filter(([campo]) => !b[campo].trim()).map(([, nombre]) => nombre)
}
