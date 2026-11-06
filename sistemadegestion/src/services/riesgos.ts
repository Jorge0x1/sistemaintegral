import { supabase } from './supabase'
import type { Riesgo, RiesgoInput } from '../types/riesgos'

const COLUMNAS_RIESGO =
  'id, proceso, fecha_incorporacion, tipo_riesgo, fuente_actividad, evento_riesgo, causa, consecuencia_impacto, controles, severidad, probabilidad, folio, efectividad'

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
