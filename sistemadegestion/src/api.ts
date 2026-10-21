import { supabase } from '../utils/supabase'

export type Riesgo = {
  id: number
  proceso: string
  fecha_incorporacion: string
  tipo_riesgo: string
  fuente_actividad: string
  evento_riesgo: string
  causa: string
  consecuencia_impacto: string
  controles: string[]
  severidad: number
  probabilidad: number
  folio: string
}

export type RiesgoInput = Omit<Riesgo, 'id'>

export type Escala = {
  numero: number
  valor: string
  descripcion: string
}

export type Rango = {
  min: number
  max: number
  descripcion: string
}

export type Catalogos = {
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

const COLUMNAS_RIESGO =
  'id, proceso, fecha_incorporacion, tipo_riesgo, fuente_actividad, evento_riesgo, causa, consecuencia_impacto, controles, severidad, probabilidad, folio'

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

export async function listarRiesgos(): Promise<Riesgo[]> {
  const { data, error } = await supabase.from('riesgos').select(COLUMNAS_RIESGO).order('id')
  if (error) throw new Error(`Tabla "riesgos": ${error.message}`)
  return data as Riesgo[]
}

export async function crearRiesgo(riesgo: RiesgoInput): Promise<Riesgo> {
  const { data, error } = await supabase
    .from('riesgos')
    .insert(riesgo)
    .select(COLUMNAS_RIESGO)
    .single()
  if (error) throw new Error(error.message)
  return data as Riesgo
}

export async function actualizarRiesgo(id: number, riesgo: RiesgoInput): Promise<Riesgo> {
  const { data, error } = await supabase
    .from('riesgos')
    .update(riesgo)
    .eq('id', id)
    .select(COLUMNAS_RIESGO)
    .single()
  if (error) throw new Error(error.message)
  return data as Riesgo
}

export async function borrarRiesgo(id: number) {
  const { error } = await supabase.from('riesgos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function nivelDeRiesgo(cat: Catalogos, severidad: number | null, probabilidad: number | null) {
  if (!severidad || !probabilidad) return null
  const valor = cat.matriz.get(`${severidad}-${probabilidad}`)
  if (valor === undefined) return null
  const rango = cat.evaluacion.find((r) => valor >= r.min && valor <= r.max)
  return { valor, descripcion: rango?.descripcion ?? 'Sin rango definido' }
}
