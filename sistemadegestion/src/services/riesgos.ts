import { escala, matriz, nombres, rangos } from './catalogos'
import { tablaRegistros } from './registros'
import type { CatalogosRiesgos, Riesgo, RiesgoInput } from '../types/riesgos'

const COLUMNAS =
  'id, proceso, fecha_incorporacion, tipo_riesgo, fuente_actividad, evento_riesgo, causa, consecuencia_impacto, controles, severidad, probabilidad, folio, efectividad'

export const tablaRiesgos = tablaRegistros<Riesgo, RiesgoInput>('riesgos', COLUMNAS)

export async function cargarCatalogosRiesgos(): Promise<CatalogosRiesgos> {
  const [procesos, tiposRiesgo, fuentes, causas, consecuencias, severidad, probabilidad, mat, evaluacion] =
    await Promise.all([
      nombres('procesos_riesgos'),
      nombres('tipo'),
      nombres('actividad_riesgos_gc'),
      nombres('causa_riesgo'),
      nombres('consecuencia_riesgo'),
      escala('severidad_riesgo'),
      escala('probabilidad_riesgo'),
      matriz('matriz_riesgo', 'severidad', 'probabilidad'),
      rangos('evaluacion_riesgos'),
    ])
  return {
    procesos,
    tiposRiesgo,
    fuentes,
    causas,
    consecuencias,
    severidad,
    probabilidad,
    matriz: mat,
    evaluacion,
  }
}
