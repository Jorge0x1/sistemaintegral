import type { Catalogos } from '../types/riesgos'

export function nivelDeRiesgo(cat: Catalogos, severidad: number | null, probabilidad: number | null) {
  if (!severidad || !probabilidad) return null
  const valor = cat.matriz.get(`${severidad}-${probabilidad}`)
  if (valor === undefined) return null
  const rango = cat.evaluacion.find((r) => valor >= r.min && valor <= r.max)
  return { valor, descripcion: rango?.descripcion ?? 'Sin rango definido' }
}
