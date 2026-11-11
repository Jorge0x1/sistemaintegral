import { escala, matriz, nombres, rangos } from './catalogos'
import { tablaRegistros } from './registros'
import type { AspectoAmbiental, AspectoAmbientalInput, CatalogosAspectos } from '../types/aspectos'

const COLUMNAS =
  'id, proceso, actividad, estado_proceso, aspecto, real_potencial, impacto, tipo_impacto, frecuencia, severidad, controles, folio, efectividad'

export const tablaAspectos = tablaRegistros<AspectoAmbiental, AspectoAmbientalInput>(
  'aspectos_ambientales',
  COLUMNAS,
)

export async function cargarCatalogosAspectos(): Promise<CatalogosAspectos> {
  const [procesos, impactos, frecuencia, severidad, mat, evaluacion] = await Promise.all([
    nombres('procesos_aia_meps'),
    nombres('impacto_aia'),
    escala('frecuencia_aia'),
    escala('severidad_aia'),
    matriz('matriz_aia', 'frecuencia', 'severidad'),
    rangos('evaluacion_aia'),
  ])
  return { procesos, impactos, frecuencia, severidad, matriz: mat, evaluacion }
}
