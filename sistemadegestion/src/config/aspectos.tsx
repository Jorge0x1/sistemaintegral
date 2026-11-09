import ListaItems from '../components/ListaItems/ListaItems'
import NivelRiesgo from '../components/NivelRiesgo/NivelRiesgo'
import SinValor from '../components/SinValor/SinValor'
import { camposDe, verEscala } from './campos'
import { cargarCatalogosAspectos, tablaAspectos } from '../services/aspectos'
import {
  aBorradorAspecto,
  aDatosAspecto,
  borradorAspectoVacio,
  faltantesAspecto,
} from '../utils/borradorAspecto'
import { aNumero } from '../utils/lista'
import { calcularNivel } from '../utils/nivel'
import type { Modulo } from '../types/registros'
import type {
  AspectoAmbiental,
  AspectoAmbientalInput,
  BorradorAspecto,
  CatalogosAspectos,
} from '../types/aspectos'

const ESTADOS = ['Normal', 'Anormal', 'Emergencia']
const REAL_POTENCIAL = ['Real', 'Potencial']
const TIPOS_IMPACTO = ['Benéfico', 'Adverso']
const EFECTIVIDADES = ['Efectivo', 'No Efectivo', 'En Proceso']

const campo = camposDe<BorradorAspecto, CatalogosAspectos>()

// Significancia: cruce F×S en matriz_aia y su rango en evaluacion_aia
const significancia = (cat: CatalogosAspectos, f: number | null, s: number | null) => (
  <NivelRiesgo nivel={calcularNivel(cat.matriz, cat.evaluacion, f, s)} />
)

const opcional = (v: string | null) => v ?? <SinValor />

export const moduloAspectos: Modulo<
  AspectoAmbiental,
  AspectoAmbientalInput,
  BorradorAspecto,
  CatalogosAspectos
> = {
  nombre: 'aspecto',
  textoVacio: 'No hay aspectos ambientales registrados. Usa el botón + para agregar uno.',
  ...tablaAspectos,
  cargarCatalogos: cargarCatalogosAspectos,
  vacio: borradorAspectoVacio,
  aBorrador: aBorradorAspecto,
  aDatos: aDatosAspecto,
  faltantes: faltantesAspecto,
  confirmarBorrado: (a) => `¿Borrar el aspecto N. ${a.id} (${a.aspecto})?`,
  sugerencias: () => [],
  grupos: [
    {
      titulo: 'Identificación',
      columnas: [
        {
          titulo: 'N.',
          className: 'centro col-n',
          ver: (a) => a.id,
          editar: () => <SinValor />,
        },
        {
          titulo: 'Proceso',
          className: 'col-media',
          ver: (a) => a.proceso,
          editar: campo.seleccion('proceso', 'Proceso', (cat) => cat.procesos),
        },
        {
          titulo: 'Actividad/Evento',
          className: 'col-larga',
          ver: (a) => a.actividad,
          // El botón queda listo a la derecha; su función se definirá después
          editar: campo.textoConBoton(
            'actividad',
            'Actividad/Evento',
            { icono: 'lista', texto: 'Actividades' },
            'Actividad/Evento',
          ),
        },
        {
          titulo: 'Estado del proceso (normal, anormal, emergencia)',
          className: 'centro col-corta',
          ver: (a) => opcional(a.estado_proceso),
          editar: campo.seleccion('estado_proceso', 'Estado del proceso', () => ESTADOS),
        },
        {
          titulo: 'Aspecto ambiental (causa)',
          className: 'col-media',
          ver: (a) => a.aspecto,
          editar: campo.texto('aspecto', 'Aspecto ambiental (causa)', { placeholder: 'Aspecto ambiental' }),
        },
        {
          titulo: '¿El aspecto es real o potencial?',
          className: 'centro col-corta',
          ver: (a) => opcional(a.real_potencial),
          editar: campo.seleccion('real_potencial', '¿El aspecto es real o potencial?', () => REAL_POTENCIAL),
        },
        {
          titulo: 'Impacto ambiental (consecuencia)',
          className: 'col-media',
          ver: (a) => a.impacto,
          editar: campo.seleccion('impacto', 'Impacto ambiental (consecuencia)', (cat) => cat.impactos),
        },
        {
          titulo: 'Tipo de impacto (benéfico/adverso)',
          className: 'centro col-corta',
          ver: (a) => opcional(a.tipo_impacto),
          editar: campo.seleccion('tipo_impacto', 'Tipo de impacto', () => TIPOS_IMPACTO),
        },
      ],
    },
    {
      titulo: 'Análisis',
      columnas: [
        {
          titulo: 'F',
          className: 'centro col-escala',
          ver: (a, cat) => verEscala(cat.frecuencia, a.frecuencia),
          editar: campo.escala('frecuencia', 'Frecuencia de ocurrencia', (cat) => cat.frecuencia),
        },
        {
          titulo: 'S',
          className: 'centro col-escala',
          ver: (a, cat) => verEscala(cat.severidad, a.severidad),
          editar: campo.escala('severidad', 'Severidad', (cat) => cat.severidad),
        },
        {
          titulo: 'Significancia',
          className: 'col-nivel',
          ver: (a, cat) => significancia(cat, a.frecuencia, a.severidad),
          editar: (b, _cambiar, cat) => significancia(cat, aNumero(b.frecuencia), aNumero(b.severidad)),
        },
      ],
    },
    {
      titulo: 'Tratamiento',
      columnas: [
        {
          titulo: 'Controles operacionales (actuales) y otras medidas aplicadas',
          className: 'col-larga',
          ver: (a) => <ListaItems items={a.controles} />,
          editar: campo.texto('controles', 'Controles operacionales', {
            placeholder: 'Separa los controles con comas',
          }),
        },
        {
          titulo: 'Folio',
          className: 'centro col-corta',
          ver: (a) => a.folio,
          editar: campo.texto('folio', 'Folio'),
        },
        {
          titulo: 'Efectividad',
          className: 'centro col-corta',
          ver: (a) => opcional(a.efectividad),
          editar: campo.seleccion('efectividad', 'Efectividad', () => EFECTIVIDADES),
        },
      ],
    },
  ],
}
