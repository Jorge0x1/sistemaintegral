import InsigniaNivel from '../components/InsigniaNivel/InsigniaNivel'
import ListaItems from '../components/ListaItems/ListaItems'
import SinValor from '../components/SinValor/SinValor'
import { camposDe, verEscala } from './campos'
import { cargarCatalogosOportunidades, tablaOportunidades } from '../services/oportunidades'
import {
  aBorradorOportunidad,
  aDatosOportunidad,
  borradorOportunidadVacio,
  faltantesOportunidad,
} from '../utils/borradorOportunidad'
import { formatoFecha } from '../utils/fecha'
import { aNumero } from '../utils/lista'
import { calcularNivel } from '../utils/nivel'
import type { Nivel, Modulo } from '../types/registros'
import type {
  BorradorOportunidad,
  CatalogosOportunidades,
  Oportunidad,
  OportunidadInput,
} from '../types/oportunidades'

const campo = camposDe<BorradorOportunidad, CatalogosOportunidades>()

const nivel = (cat: CatalogosOportunidades, i: number | null, t: number | null) =>
  calcularNivel(cat.matriz, cat.evaluacion, i, t)

// Clasificación: el número de la matriz I×T, con el color de su rango
const clasificacion = (n: Nivel | null) => (n ? <InsigniaNivel nivel={n} /> : <SinValor />)

// Nivel de viabilidad: la descripción del rango donde cae la clasificación
const viabilidad = (n: Nivel | null) => (n ? n.descripcion : <SinValor />)

export const moduloOportunidades: Modulo<
  Oportunidad,
  OportunidadInput,
  BorradorOportunidad,
  CatalogosOportunidades
> = {
  nombre: 'oportunidad',
  textoVacio: 'No hay oportunidades registradas. Usa el botón + para agregar una.',
  ...tablaOportunidades,
  cargarCatalogos: cargarCatalogosOportunidades,
  vacio: borradorOportunidadVacio,
  aBorrador: aBorradorOportunidad,
  aDatos: aDatosOportunidad,
  faltantes: faltantesOportunidad,
  confirmarBorrado: (o) => `¿Borrar la oportunidad N. ${o.id} (${o.oportunidad})?`,
  sugerencias: (cat) => [
    ['dl-procesos-eo', cat.procesos],
    ['dl-origen-eo', cat.origenes],
  ],
  grupos: [
    {
      titulo: '',
      columnas: [
        {
          titulo: 'Enfoque',
          className: 'col-corta',
          ver: (o) => o.enfoque,
          editar: campo.seleccion('enfoque', 'Enfoque', (cat) => cat.enfoques),
        },
        {
          titulo: 'Proceso',
          className: 'col-media',
          ver: (o) => o.proceso,
          editar: campo.texto('proceso', 'Proceso', { lista: 'dl-procesos-eo', placeholder: 'Proceso' }),
        },
        {
          titulo: 'Fecha de Incorporación',
          className: 'centro col-fecha',
          ver: (o) => formatoFecha(o.fecha_incorporacion),
          editar: campo.fecha('fecha_incorporacion', 'Fecha de Incorporación'),
        },
        {
          titulo: 'Antecedentes',
          className: 'col-larga',
          ver: (o) => o.antecedentes,
          editar: campo.texto('antecedentes', 'Antecedentes', { placeholder: 'Antecedentes' }),
        },
        {
          titulo: 'Origen',
          className: 'col-media',
          ver: (o) => o.origen,
          editar: campo.texto('origen', 'Origen', { lista: 'dl-origen-eo', placeholder: 'Origen' }),
        },
        {
          titulo: 'Riesgo y/o Aspecto Relacionado',
          className: 'col-media',
          ver: (o) => o.riesgo_aspecto,
          editar: campo.texto('riesgo_aspecto', 'Riesgo y/o Aspecto Relacionado'),
        },
        {
          titulo: '¿Cuál es la Oportunidad?',
          className: 'col-larga',
          ver: (o) => o.oportunidad,
          editar: campo.texto('oportunidad', '¿Cuál es la Oportunidad?'),
        },
        {
          titulo: 'Impacto Positivo Esperado (beneficios)',
          className: 'col-larga',
          ver: (o) => <ListaItems items={o.beneficios} />,
          editar: campo.texto('beneficios', 'Impacto Positivo Esperado (beneficios)', {
            placeholder: 'Separa los beneficios con comas',
          }),
        },
        {
          titulo: 'I',
          className: 'centro col-escala',
          ver: (o, cat) => verEscala(cat.impacto, o.impacto),
          editar: campo.escala('impacto', 'Impacto', (cat) => cat.impacto),
        },
        {
          titulo: 'T',
          className: 'centro col-escala',
          ver: (o, cat) => verEscala(cat.tiempo, o.tiempo),
          editar: campo.escala('tiempo', 'Tiempo de Implementación', (cat) => cat.tiempo),
        },
        {
          titulo: 'Clasificación',
          className: 'centro',
          ver: (o, cat) => clasificacion(nivel(cat, o.impacto, o.tiempo)),
          editar: (b, _cambiar, cat) => clasificacion(nivel(cat, aNumero(b.impacto), aNumero(b.tiempo))),
        },
        {
          titulo: 'Nivel de viabilidad',
          className: 'col-nivel',
          ver: (o, cat) => viabilidad(nivel(cat, o.impacto, o.tiempo)),
          editar: (b, _cambiar, cat) => viabilidad(nivel(cat, aNumero(b.impacto), aNumero(b.tiempo))),
        },
        {
          titulo: 'Folio asignado (en caso que se tome la oportunidad)',
          className: 'centro col-corta',
          ver: (o) => o.folio,
          editar: campo.texto('folio', 'Folio asignado'),
        },
        {
          titulo: 'Vigencia de OP',
          className: 'centro col-fecha',
          ver: (o) => formatoFecha(o.vigencia),
          editar: campo.fecha('vigencia', 'Vigencia de OP'),
        },
      ],
    },
  ],
}
