import { supabase } from './supabase'

// Operaciones de lectura y escritura de una tabla de registros con llave "id"
export function tablaRegistros<R, I extends object>(tabla: string, columnas: string) {
  return {
    listar: async (): Promise<R[]> => {
      const { data, error } = await supabase.from(tabla).select(columnas).order('id')
      if (error) throw new Error(`Tabla "${tabla}": ${error.message}`)
      return data as unknown as R[]
    },
    crear: async (datos: I): Promise<R> => {
      const { data, error } = await supabase.from(tabla).insert(datos).select(columnas).single()
      if (error) throw new Error(error.message)
      return data as unknown as R
    },
    actualizar: async (id: number, datos: I): Promise<R> => {
      const { data, error } = await supabase
        .from(tabla)
        .update(datos)
        .eq('id', id)
        .select(columnas)
        .single()
      if (error) throw new Error(error.message)
      return data as unknown as R
    },
    borrar: async (id: number) => {
      const { error } = await supabase.from(tabla).delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
  }
}
