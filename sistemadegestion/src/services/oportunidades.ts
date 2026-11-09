import { escala, matriz, nombres, rangos } from './catalogos'
import { tablaRegistros } from './registros'
import type { CatalogosOportunidades, Oportunidad, OportunidadInput } from '../types/oportunidades'

const COLUMNAS =
  'id, enfoque, proceso, fecha_incorporacion, antecedentes, origen, riesgo_aspecto, oportunidad, beneficios, impacto, tiempo, folio, vigencia'

export const tablaOportunidades = tablaRegistros<Oportunidad, OportunidadInput>('oportunidades', COLUMNAS)

export async function cargarCatalogosOportunidades(): Promise<CatalogosOportunidades> {
  const [enfoques, procesos, origenes, impacto, tiempo, mat, evaluacion] = await Promise.all([
    nombres('tipo'),
    nombres('procesos_eo'),
    nombres('origen_eo'),
    escala('impacto'),
    escala('tiempo'),
    matriz('matriz_eo', 'impacto', 'tiempo'),
    rangos('evaluacion_oportunidades'),
  ])
  return { enfoques, procesos, origenes, impacto, tiempo, matriz: mat, evaluacion }
}
