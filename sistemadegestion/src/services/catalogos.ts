import { supabase } from './supabase'
import type { Catalogos, Escala, Rango } from '../types/riesgos'

async function nombres(tabla: string) {
  const { data, error } = await supabase.from(tabla).select('nombre').order('nombre')
  if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
  return data.map((fila) => fila.nombre as string)
}

async function escala(tabla: string): Promise<Escala[]> {
  const { data, error } = await supabase.from(tabla).select('valor, descripcion')
  if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
  return data
    .map((fila) => ({
      numero: parseInt(fila.valor, 10),
      valor: fila.valor as string,
      descripcion: fila.descripcion as string,
    }))
    .sort((a, b) => a.numero - b.numero)
}

async function matriz() {
  const { data, error } = await supabase
    .from('matriz_riesgo')
    .select('severidad, probabilidad, valor')
  if (error) throw new Error(`Tabla "matriz_riesgo": ${error.message}`)
  return new Map(data.map((c) => [`${c.severidad}-${c.probabilidad}`, c.valor as number]))
}

async function evaluacion(): Promise<Rango[]> {
  const { data, error } = await supabase.from('evaluacion_riesgos').select('rango, descripcion')
  if (error) throw new Error(`Tabla "evaluacion_riesgos": ${error.message}`)
  return data.flatMap((fila) => {
    // "1 al 8" → { min: 1, max: 8 }
    const m = /(\d+)\D+(\d+)/.exec(fila.rango)
    return m ? [{ min: Number(m[1]), max: Number(m[2]), descripcion: fila.descripcion }] : []
  })
}

export async function cargarCatalogos(): Promise<Catalogos> {
  const [procesos, tiposRiesgo, fuentes, causas, consecuencias, sev, prob, mat, evalua] =
    await Promise.all([
      nombres('procesos'),
      nombres('tipo_riesgo'),
      nombres('fuente_actividad'),
      nombres('causa'),
      nombres('consecuencia_impacto'),
      escala('severidad'),
      escala('probabilidad'),
      matriz(),
      evaluacion(),
    ])
  return {
    procesos,
    tiposRiesgo,
    fuentes,
    causas,
    consecuencias,
    severidad: sev,
    probabilidad: prob,
    matriz: mat,
    evaluacion: evalua,
  }
}
