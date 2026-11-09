import type { Nivel, Rango } from '../types/registros'

// Cruza dos valores de escala en la matriz y busca el rango donde cae el resultado
export function calcularNivel(
  matriz: Map<string, number>,
  rangos: Rango[],
  eje1: number | null,
  eje2: number | null,
): Nivel | null {
  if (!eje1 || !eje2) return null
  const valor = matriz.get(`${eje1}-${eje2}`)
  if (valor === undefined) return null
  const rango = rangos.find((r) => valor >= r.min && valor <= r.max)
  return { valor, descripcion: rango?.descripcion ?? 'Sin rango definido' }
}

// Primera palabra de la descripción, para el color del nivel:
// "Extremo: Es necesario…" → "extremo", "Crítico-Significativo: …" → "critico"
export function claseNivel(descripcion: string) {
  const nombre = descripcion.trim().split(/[\s:-]/)[0].toLowerCase()
  return nombre.normalize('NFD').replace(/[^a-z]/g, '')
}
