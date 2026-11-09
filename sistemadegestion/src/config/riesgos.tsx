import ListaItems from '../components/ListaItems/ListaItems'
import NivelRiesgo from '../components/NivelRiesgo/NivelRiesgo'
import SinValor from '../components/SinValor/SinValor'
import { camposDe, verEscala } from './campos'
import { cargarCatalogosRiesgos, tablaRiesgos } from '../services/riesgos'
import {
  aBorradorRiesgo,
  aDatosRiesgo,
  borradorRiesgoVacio,
  faltantesRiesgo,
} from '../utils/borradorRiesgo'
import { formatoFecha } from '../utils/fecha'
import { aNumero } from '../utils/lista'
import { calcularNivel } from '../utils/nivel'
import type { Modulo } from '../types/registros'
import type { BorradorRiesgo, CatalogosRiesgos, Riesgo, RiesgoInput } from '../types/riesgos'

const EFECTIVIDADES = ['Efectivo', 'No Efectivo', 'En Proceso']

const campo = camposDe<BorradorRiesgo, CatalogosRiesgos>()

const nivel = (cat: CatalogosRiesgos, s: number | null, p: number | null) =>
  calcularNivel(cat.matriz, cat.evaluacion, s, p)

export const moduloRiesgos: Modulo<Riesgo, RiesgoInput, BorradorRiesgo, CatalogosRiesgos> = {
  nombre: 'riesgo',
  textoVacio: 'No hay riesgos registrados. Usa el botón + para agregar uno.',
  ...tablaRiesgos,
  cargarCatalogos: cargarCatalogosRiesgos,
  vacio: borradorRiesgoVacio,
  aBorrador: aBorradorRiesgo,
  aDatos: aDatosRiesgo,
  faltantes: faltantesRiesgo,
  confirmarBorrado: (r) => `¿Borrar el riesgo N. ${r.id} (${r.evento_riesgo})?`,
  sugerencias: (cat) => [
    ['dl-procesos', cat.procesos],
    ['dl-fuentes', cat.fuentes],
    ['dl-causas', cat.causas],
    ['dl-consecuencias', cat.consecuencias],
  ],
  grupos: [
    {
      titulo: 'Evento',
      columnas: [
        {
          titulo: 'N.',
          className: 'centro col-n',
          ver: (r) => r.id,
          editar: () => <SinValor />,
        },
        {
          titulo: 'Proceso',
          className: 'col-media',
          ver: (r) => r.proceso,
          editar: campo.texto('proceso', 'Proceso', { lista: 'dl-procesos', placeholder: 'Proceso' }),
        },
        {
          titulo: 'Fecha de incorporación',
          className: 'centro col-fecha',
          ver: (r) => formatoFecha(r.fecha_incorporacion),
          editar: campo.fecha('fecha_incorporacion', 'Fecha de incorporación'),
        },
        {
          titulo: 'Tipo de riesgo',
          className: 'col-corta',
          ver: (r) => r.tipo_riesgo,
          editar: campo.seleccion('tipo_riesgo', 'Tipo de riesgo', (cat) => cat.tiposRiesgo),
        },
      ],
    },
    {
      titulo: 'Identificación de riesgos',
      columnas: [
        {
          titulo: 'Fuente / Actividad',
          className: 'col-media',
          ver: (r) => r.fuente_actividad,
          editar: campo.texto('fuente_actividad', 'Fuente / Actividad', {
            lista: 'dl-fuentes',
            placeholder: 'Fuente / Actividad',
          }),
        },
        {
          titulo: 'Evento / Riesgo',
          className: 'col-larga',
          ver: (r) => r.evento_riesgo,
          editar: campo.texto('evento_riesgo', 'Evento / Riesgo', { placeholder: '¿Qué pudiera pasar?' }),
        },
        {
          titulo: 'Causa',
          className: 'col-media',
          ver: (r) => r.causa,
          editar: campo.texto('causa', 'Causa', { lista: 'dl-causas', placeholder: 'Causa' }),
        },
        {
          titulo: 'Consecuencia / Impacto',
          className: 'col-media',
          ver: (r) => r.consecuencia_impacto,
          editar: campo.texto('consecuencia_impacto', 'Consecuencia / Impacto', {
            lista: 'dl-consecuencias',
            placeholder: 'Consecuencia / Impacto',
          }),
        },
        {
          titulo: 'Control',
          className: 'col-larga',
          ver: (r) => <ListaItems items={r.controles} />,
          editar: campo.texto('controles', 'Control', { placeholder: 'Mecanismos vigentes' }),
        },
      ],
    },
    {
      titulo: 'Análisis de riesgo',
      columnas: [
        {
          titulo: 'S',
          className: 'centro col-escala',
          ver: (r, cat) => verEscala(cat.severidad, r.severidad),
          editar: campo.escala('severidad', 'Severidad', (cat) => cat.severidad),
        },
        {
          titulo: 'P',
          className: 'centro col-escala',
          ver: (r, cat) => verEscala(cat.probabilidad, r.probabilidad),
          editar: campo.escala('probabilidad', 'Probabilidad', (cat) => cat.probabilidad),
        },
      ],
    },
    {
      titulo: 'Valoración de riesgo',
      columnas: [
        {
          titulo: 'Nivel de riesgo',
          className: 'col-nivel',
          ver: (r, cat) => <NivelRiesgo nivel={nivel(cat, r.severidad, r.probabilidad)} />,
          editar: (b, _cambiar, cat) => (
            <NivelRiesgo nivel={nivel(cat, aNumero(b.severidad), aNumero(b.probabilidad))} />
          ),
        },
      ],
    },
    {
      titulo: 'Tratamiento de Riesgo',
      columnas: [
        {
          titulo: 'Folio (acciones)',
          className: 'centro col-corta',
          ver: (r) => r.folio,
          editar: campo.texto('folio', 'Folio (acciones)'),
        },
        {
          titulo: 'Efectividad en el Periodo',
          className: 'centro col-corta',
          ver: (r) => r.efectividad ?? <SinValor />,
          editar: campo.seleccion('efectividad', 'Efectividad en el Periodo', () => EFECTIVIDADES),
        },
      ],
    },
  ],
}
