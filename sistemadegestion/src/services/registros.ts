import { supabase } from './supabase'

// Operaciones de lectura y escritura de una tabla de registros con llave "id".
// Los editores trabajan sobre la tabla (borrador); el modo lectura lee <tabla>_publicados,
// que solo cambia con "Publicar cambios".
// "filtro" limita el listado a las filas con esos valores (p. ej. { proceso: "Manufactura EPS" })
export function tablaRegistros<R, I extends object>(
  tabla: string,
  columnas: string,
  filtro: Record<string, string> = {},
) {
  return {
    listar: async (publicados: boolean): Promise<R[]> => {
      const origen = publicados ? `${tabla}_publicados` : tabla
      const { data, error } = await supabase.from(origen).select(columnas).match(filtro).order('id')
      if (error) throw new Error(`Tabla "${origen}": ${error.message}`)
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
