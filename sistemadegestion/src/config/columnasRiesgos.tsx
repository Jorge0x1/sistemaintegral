import type { ReactNode } from 'react'
import CampoEntrada from '../components/CampoEntrada/CampoEntrada'
import CampoEscala from '../components/CampoEscala/CampoEscala'
import CampoFecha from '../components/CampoFecha/CampoFecha'
import CampoSelect from '../components/CampoSelect/CampoSelect'
import ListaControles from '../components/ListaControles/ListaControles'
import NivelRiesgo from '../components/NivelRiesgo/NivelRiesgo'
import SinValor from '../components/SinValor/SinValor'
import { formatoFecha } from '../utils/fecha'
import type { Borrador, Cambiar, Catalogos, Escala, Riesgo } from '../types/riesgos'

export type Columna = {
  titulo: string
  className?: string
  ver: (r: Riesgo, cat: Catalogos) => ReactNode
  editar: (b: Borrador, cambiar: Cambiar, cat: Catalogos) => ReactNode
}

export type Grupo = {
  titulo: string
  columnas: Columna[]
}

const EFECTIVIDADES = ['Efectivo', 'No Efectivo', 'En Proceso']

function textoEscala(escala: Escala[], numero: number) {
  const e = escala.find((x) => x.numero === numero)
  return <span title={e?.descripcion}>{e?.valor ?? numero}</span>
}

function textoEditable(campo: keyof Borrador, etiqueta: string, lista?: string, placeholder?: string) {
  return (b: Borrador, cambiar: Cambiar) => (
    <CampoEntrada
      valor={b[campo]}
      onChange={(v) => cambiar(campo, v)}
      etiqueta={etiqueta}
      lista={lista}
      placeholder={placeholder}
    />
  )
}

export const grupos: Grupo[] = [
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
        editar: textoEditable('proceso', 'Proceso', 'dl-procesos', 'Proceso'),
      },
      {
        titulo: 'Fecha de incorporación',
        className: 'centro col-fecha',
        ver: (r) => formatoFecha(r.fecha_incorporacion),
        editar: (b, cambiar) => (
          <CampoFecha
            valor={b.fecha_incorporacion}
            onChange={(v) => cambiar('fecha_incorporacion', v)}
            etiqueta="Fecha de incorporación"
          />
        ),
      },
      {
        titulo: 'Tipo de riesgo',
        className: 'col-corta',
        ver: (r) => r.tipo_riesgo,
        editar: (b, cambiar, cat) => (
          <CampoSelect
            valor={b.tipo_riesgo}
            opciones={cat.tiposRiesgo.map((t) => ({ valor: t, etiqueta: t }))}
            onChange={(v) => cambiar('tipo_riesgo', v)}
            etiqueta="Tipo de riesgo"
          />
        ),
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
        editar: textoEditable('fuente_actividad', 'Fuente / Actividad', 'dl-fuentes', 'Fuente / Actividad'),
      },
      {
        titulo: 'Evento / Riesgo',
        className: 'col-larga',
        ver: (r) => r.evento_riesgo,
        editar: textoEditable('evento_riesgo', 'Evento / Riesgo', undefined, '¿Qué pudiera pasar?'),
      },
      {
        titulo: 'Causa',
        className: 'col-media',
        ver: (r) => r.causa,
        editar: textoEditable('causa', 'Causa', 'dl-causas', 'Causa'),
      },
      {
        titulo: 'Consecuencia / Impacto',
        className: 'col-media',
        ver: (r) => r.consecuencia_impacto,
        editar: textoEditable('consecuencia_impacto', 'Consecuencia / Impacto', 'dl-consecuencias', 'Consecuencia / Impacto'),
      },
      {
        titulo: 'Control',
        className: 'col-larga',
        ver: (r) => <ListaControles controles={r.controles} />,
        editar: textoEditable('controles', 'Control', undefined, 'Mecanismos vigentes'),
      },
    ],
  },
  {
    titulo: 'Análisis de riesgo',
    columnas: [
      {
        titulo: 'S',
        className: 'centro col-escala',
        ver: (r, cat) => textoEscala(cat.severidad, r.severidad),
        editar: (b, cambiar, cat) => (
          <CampoEscala
            valor={b.severidad}
            escala={cat.severidad}
            onChange={(v) => cambiar('severidad', v)}
            etiqueta="Severidad"
          />
        ),
      },
      {
        titulo: 'P',
        className: 'centro col-escala',
        ver: (r, cat) => textoEscala(cat.probabilidad, r.probabilidad),
        editar: (b, cambiar, cat) => (
          <CampoEscala
            valor={b.probabilidad}
            escala={cat.probabilidad}
            onChange={(v) => cambiar('probabilidad', v)}
            etiqueta="Probabilidad"
          />
        ),
      },
    ],
  },
  {
    titulo: 'Valoración de riesgo',
    columnas: [
      {
        titulo: 'Nivel de riesgo',
        className: 'col-nivel',
        ver: (r, cat) => <NivelRiesgo cat={cat} s={r.severidad} p={r.probabilidad} />,
        editar: (b, _cambiar, cat) => (
          <NivelRiesgo
            cat={cat}
            s={b.severidad ? Number(b.severidad) : null}
            p={b.probabilidad ? Number(b.probabilidad) : null}
          />
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
        editar: textoEditable('folio', 'Folio (acciones)'),
      },
      {
        titulo: 'Efectividad en el Periodo',
        className: 'centro col-corta',
        ver: (r) => r.efectividad ?? <SinValor />,
        editar: (b, cambiar) => (
          <CampoSelect
            valor={b.efectividad}
            opciones={EFECTIVIDADES.map((e) => ({ valor: e, etiqueta: e }))}
            onChange={(v) => cambiar('efectividad', v)}
            etiqueta="Efectividad en el Periodo"
          />
        ),
      },
    ],
  },
]

export const columnas = grupos.flatMap((g) => g.columnas)
