import { supabase } from './supabase'
import type { Escala, Rango } from '../types/registros'

// Lectores genéricos de catálogos; cada módulo decide qué tablas usa

export async function nombres(tabla: string) {
  const { data, error } = await supabase.from(tabla).select('nombre').order('nombre')
  if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
  return data.map((fila) => fila.nombre as string)
}

export async function escala(tabla: string): Promise<Escala[]> {
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

// Matriz de dos ejes → Map con clave "eje1-eje2"
export async function matriz(tabla: string, eje1: string, eje2: string) {
  const { data, error } = await supabase.from(tabla).select(`${eje1}, ${eje2}, valor`)
  if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
  const filas = data as unknown as Record<string, number>[]
  return new Map(filas.map((c) => [`${c[eje1]}-${c[eje2]}`, c.valor]))
}

export async function rangos(tabla: string): Promise<Rango[]> {
  const { data, error } = await supabase.from(tabla).select('rango, descripcion')
  if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
  return data.flatMap((fila) => {
    // "1 al 8" → { min: 1, max: 8 }
    const m = /(\d+)\D+(\d+)/.exec(fila.rango)
    return m ? [{ min: Number(m[1]), max: Number(m[2]), descripcion: fila.descripcion }] : []
  })
}
