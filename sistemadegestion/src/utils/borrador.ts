import type { Borrador, Riesgo, RiesgoInput } from '../types/riesgos'

export function borradorVacio(): Borrador {
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
  }
}

export function aBorrador(r: Riesgo): Borrador {
  return {
    ...r,
    fecha_incorporacion: r.fecha_incorporacion ?? '',
    controles: r.controles.join(', '),
    severidad: String(r.severidad),
    probabilidad: String(r.probabilidad),
  }
}

export function aRiesgo(b: Borrador): RiesgoInput {
  return {
    proceso: b.proceso.trim(),
    fecha_incorporacion: b.fecha_incorporacion || null,
    tipo_riesgo: b.tipo_riesgo,
    fuente_actividad: b.fuente_actividad.trim(),
    evento_riesgo: b.evento_riesgo.trim(),
    causa: b.causa.trim(),
    consecuencia_impacto: b.consecuencia_impacto.trim(),
    controles: b.controles
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
    severidad: Number(b.severidad),
    probabilidad: Number(b.probabilidad),
    folio: b.folio.trim() || 'NA',
  }
}

export function faltantes(b: Borrador) {
  const requeridos: [keyof Borrador, string][] = [
    ['proceso', 'Proceso'],
    ['tipo_riesgo', 'Tipo de riesgo'],
    ['evento_riesgo', 'Evento / Riesgo'],
    ['severidad', 'S'],
    ['probabilidad', 'P'],
  ]
  return requeridos.filter(([campo]) => !b[campo].trim()).map(([, nombre]) => nombre)
}
