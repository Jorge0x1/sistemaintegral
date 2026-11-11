import { escala, matriz, nombres, rangos } from './catalogos'
import { tablaRegistros } from './registros'
import type { CatalogosRiesgos, Riesgo, RiesgoInput } from '../types/riesgos'

const COLUMNAS =
  'id, proceso, fecha_incorporacion, tipo_riesgo, fuente_actividad, evento_riesgo, causa, consecuencia_impacto, controles, severidad, probabilidad, folio, efectividad'

// Riesgos de un solo proceso
export const tablaRiesgos = (proceso: string) =>
  tablaRegistros<Riesgo, RiesgoInput>('riesgos', COLUMNAS, { proceso })

// tablaActividades: catálogo de actividades del proceso (actividad_riesgos_gc, actividad_riesgos_meps, …)
export async function cargarCatalogosRiesgos(tablaActividades: string): Promise<CatalogosRiesgos> {
  const [procesos, tiposRiesgo, fuentes, causas, consecuencias, severidad, probabilidad, mat, evaluacion] =
    await Promise.all([
      nombres('procesos_riesgos'),
      nombres('tipo'),
      nombres(tablaActividades),
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
