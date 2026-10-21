import { Fragment, useEffect, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import {
  actualizarRiesgo,
  borrarRiesgo,
  cargarCatalogos,
  crearRiesgo,
  listarRiesgos,
  nivelDeRiesgo,
} from './api'
import type { Catalogos, Escala, Riesgo, RiesgoInput } from './api'
import './App.css'

// Valores del formulario tal como se escriben (controles separados por comas, S y P como texto)
type Borrador = {
  proceso: string
  fecha_incorporacion: string
  tipo_riesgo: string
  fuente_actividad: string
  evento_riesgo: string
  causa: string
  consecuencia_impacto: string
  controles: string
  severidad: string
  probabilidad: string
  folio: string
}

type Cambiar = (campo: keyof Borrador, valor: string) => void

type Columna = {
  titulo: string
  className?: string
  ver: (r: Riesgo, cat: Catalogos) => ReactNode
  editar: (b: Borrador, cambiar: Cambiar, cat: Catalogos) => ReactNode
}

type Grupo = {
  titulo: string
  columnas: Columna[]
}

const NUEVO = 'nuevo'

function hoy() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function borradorVacio(): Borrador {
  return {
    proceso: '',
    fecha_incorporacion: hoy(),
    tipo_riesgo: '',
    fuente_actividad: '',
    evento_riesgo: '',
    causa: '',
    consecuencia_impacto: '',
    controles: '',
    severidad: '',
    probabilidad: '',
    folio: 'NA',
  }
}

function aBorrador(r: Riesgo): Borrador {
  return {
    ...r,
    controles: r.controles.join(', '),
    severidad: String(r.severidad),
    probabilidad: String(r.probabilidad),
  }
}

function aRiesgo(b: Borrador): RiesgoInput {
  return {
    proceso: b.proceso.trim(),
    fecha_incorporacion: b.fecha_incorporacion,
    tipo_riesgo: b.tipo_riesgo,
    fuente_actividad: b.fuente_actividad.trim(),
    evento_riesgo: b.evento_riesgo.trim(),
    causa: b.causa.trim(),
    consecuencia_impacto: b.consecuencia_impacto.trim(),
    controles: b.controles
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
    severidad: Number(b.severidad),
    probabilidad: Number(b.probabilidad),
    folio: b.folio.trim() || 'NA',
  }
}

function faltantes(b: Borrador) {
  const requeridos: [keyof Borrador, string][] = [
    ['proceso', 'Proceso'],
    ['fecha_incorporacion', 'Fecha de incorporación'],
    ['tipo_riesgo', 'Tipo de riesgo'],
    ['evento_riesgo', 'Evento / Riesgo'],
    ['severidad', 'S'],
    ['probabilidad', 'P'],
  ]
  return requeridos.filter(([campo]) => !b[campo].trim()).map(([, nombre]) => nombre)
}

function formatoFecha(iso: string) {
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}

function claseNivel(descripcion: string) {
  const nivel = descripcion.split(':')[0].trim().toLowerCase()
  return `nivel nivel-${nivel.normalize('NFD').replace(/[^a-z]/g, '')}`
}

function NivelRiesgo({ cat, s, p }: { cat: Catalogos; s: number | null; p: number | null }) {
  const nivel = nivelDeRiesgo(cat, s, p)
  if (!nivel) return <span className="sin-valor">—</span>
  return (
    <div className="nivel-celda">
      <span className={claseNivel(nivel.descripcion)}>{nivel.valor}</span>
      <span>{nivel.descripcion}</span>
    </div>
  )
}

function textoEscala(escala: Escala[], numero: number) {
  const e = escala.find((x) => x.numero === numero)
  return <span title={e?.descripcion}>{e?.valor ?? numero}</span>
}

function SelectEscala({
  valor,
  opciones,
  onChange,
  etiqueta,
}: {
  valor: string
  opciones: Escala[]
  onChange: (v: string) => void
  etiqueta: string
}) {
  const actual = opciones.find((o) => String(o.numero) === valor)
  return (
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      title={actual?.descripcion}
      aria-label={etiqueta}
    >
      <option value="">—</option>
      {opciones.map((o) => (
        <option key={o.valor} value={o.numero} title={o.descripcion}>
          {o.valor}
        </option>
      ))}
    </select>
  )
}

function textoEditable(campo: keyof Borrador, etiqueta: string, lista?: string, placeholder?: string) {
  return (b: Borrador, cambiar: Cambiar) => (
    <input
      type="text"
      value={b[campo]}
      onChange={(e) => cambiar(campo, e.target.value)}
      list={lista}
      placeholder={placeholder}
      aria-label={etiqueta}
    />
  )
}

const grupos: Grupo[] = [
  {
    titulo: 'Matriz de riesgos',
    columnas: [
      {
        titulo: 'N.',
        className: 'centro col-n',
        ver: (r) => r.id,
        editar: () => <span className="sin-valor">—</span>,
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
          <input
            type="date"
            value={b.fecha_incorporacion}
            onChange={(e) => cambiar('fecha_incorporacion', e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            aria-label="Fecha de incorporación"
          />
        ),
      },
      {
        titulo: 'Tipo de riesgo',
        className: 'col-corta',
        ver: (r) => r.tipo_riesgo,
        editar: (b, cambiar, cat) => (
          <select
            value={b.tipo_riesgo}
            onChange={(e) => cambiar('tipo_riesgo', e.target.value)}
            aria-label="Tipo de riesgo"
          >
            <option value="">—</option>
            {cat.tiposRiesgo.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
        ver: (r) =>
          r.controles.length ? (
            <ul className="controles">
              {r.controles.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <span className="sin-valor">—</span>
          ),
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
          <SelectEscala
            valor={b.severidad}
            opciones={cat.severidad}
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
          <SelectEscala
            valor={b.probabilidad}
            opciones={cat.probabilidad}
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
    titulo: 'Evaluación',
    columnas: [
      {
        titulo: 'Folio (acciones)',
        className: 'centro col-corta',
        ver: (r) => r.folio,
        editar: textoEditable('folio', 'Folio (acciones)'),
      },
    ],
  },
]

const columnas = grupos.flatMap((g) => g.columnas)

const iconos = {
  mas: <path d="M12 5v14M5 12h14" />,
  editar: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  borrar: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  guardar: <path d="M5 12l5 5L20 7" />,
  cancelar: <path d="M6 6l12 12M18 6L6 18" />,
}

function Icono({ nombre }: { nombre: keyof typeof iconos }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconos[nombre]}
    </svg>
  )
}

function App() {
  const [cat, setCat] = useState<Catalogos | null>(null)
  const [riesgos, setRiesgos] = useState<Riesgo[]>([])
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [editando, setEditando] = useState<number | typeof NUEVO | null>(null)
  const [borrador, setBorrador] = useState<Borrador>(borradorVacio)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([cargarCatalogos(), listarRiesgos()])
      .then(([c, r]) => {
        setCat(c)
        setRiesgos(r)
      })
      .catch((e: Error) => setErrorCarga(e.message))
  }, [])

  const cambiar: Cambiar = (campo, valor) => setBorrador((b) => ({ ...b, [campo]: valor }))

  function nuevo() {
    setBorrador(borradorVacio())
    setEditando(NUEVO)
    setAviso(null)
  }

  function editar(r: Riesgo) {
    setBorrador(aBorrador(r))
    setEditando(r.id)
    setAviso(null)
  }

  function cancelar() {
    setEditando(null)
    setAviso(null)
  }

  async function guardar() {
    const falta = faltantes(borrador)
    if (falta.length) {
      setAviso(`Completa: ${falta.join(', ')}`)
      return
    }
    setGuardando(true)
    try {
      const datos = aRiesgo(borrador)
      if (editando === NUEVO) {
        const creado = await crearRiesgo(datos)
        setRiesgos((rs) => [...rs, creado])
      } else if (editando !== null) {
        const actualizado = await actualizarRiesgo(editando, datos)
        setRiesgos((rs) => rs.map((r) => (r.id === actualizado.id ? actualizado : r)))
      }
      setEditando(null)
      setAviso(null)
    } catch (e) {
      setAviso(`No se pudo guardar: ${(e as Error).message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(r: Riesgo) {
    if (!window.confirm(`¿Borrar el riesgo N. ${r.id} (${r.evento_riesgo})?`)) return
    try {
      await borrarRiesgo(r.id)
      setRiesgos((rs) => rs.filter((x) => x.id !== r.id))
    } catch (e) {
      setAviso(`No se pudo borrar: ${(e as Error).message}`)
    }
  }

  function teclas(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') guardar()
    if (e.key === 'Escape') cancelar()
  }

  function filaEdicion(c: Catalogos) {
    return (
      <tr className="editando" onKeyDown={teclas}>
        {columnas.map((col) => (
          <td key={col.titulo} className={col.className}>
            {col.editar(borrador, cambiar, c)}
          </td>
        ))}
        <td className="acciones">
          <button type="button" className="icono guardar" onClick={guardar}
            disabled={guardando} title="Guardar" aria-label="Guardar">
            <Icono nombre="guardar" />
          </button>
          <button type="button" className="icono" onClick={cancelar}
            disabled={guardando} title="Cancelar" aria-label="Cancelar">
            <Icono nombre="cancelar" />
          </button>
        </td>
      </tr>
    )
  }

  return (
    <main className="dashboard">
      <header className="barra">
        <h1>Matriz de riesgos</h1>
        <button type="button" className="agregar" onClick={nuevo}
          disabled={!cat || editando !== null} title="Agregar riesgo" aria-label="Agregar riesgo">
          <Icono nombre="mas" />
        </button>
      </header>

      {errorCarga && (
        <p className="alerta">
          No se pudieron cargar los datos — {errorCarga}. ¿Ya ejecutaste el script SQL en Supabase?
        </p>
      )}
      {aviso && <p className="alerta">{aviso}</p>}

      {cat &&
        (
          [
            ['dl-procesos', cat.procesos],
            ['dl-fuentes', cat.fuentes],
            ['dl-causas', cat.causas],
            ['dl-consecuencias', cat.consecuencias],
          ] as const
        ).map(([id, valores]) => (
          <datalist key={id} id={id}>
            {valores.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        ))}

      <div className="tabla-contenedor">
        <table className="matriz">
          <thead>
            <tr>
              {grupos.map((g) => (
                <th key={g.titulo} colSpan={g.columnas.length} className="grupo">
                  {g.titulo}
                </th>
              ))}
              <th rowSpan={2} className="grupo acciones-th">Acciones</th>
            </tr>
            <tr>
              {columnas.map((c) => (
                <th key={c.titulo}>{c.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!cat && !errorCarga && (
              <tr>
                <td colSpan={columnas.length + 1} className="centro vacio">Cargando…</td>
              </tr>
            )}
            {cat && riesgos.length === 0 && editando !== NUEVO && (
              <tr>
                <td colSpan={columnas.length + 1} className="centro vacio">
                  No hay riesgos registrados. Usa el botón + para agregar uno.
                </td>
              </tr>
            )}
            {cat &&
              riesgos.map((r) =>
                editando === r.id ? (
                  <Fragment key={r.id}>{filaEdicion(cat)}</Fragment>
                ) : (
                  <tr key={r.id}>
                    {columnas.map((col) => (
                      <td key={col.titulo} className={col.className}>
                        {col.ver(r, cat)}
                      </td>
                    ))}
                    <td className="acciones">
                      <button type="button" className="icono" onClick={() => editar(r)}
                        disabled={editando !== null} title="Editar" aria-label={`Editar riesgo ${r.id}`}>
                        <Icono nombre="editar" />
                      </button>
                      <button type="button" className="icono borrar" onClick={() => borrar(r)}
                        disabled={editando !== null} title="Borrar" aria-label={`Borrar riesgo ${r.id}`}>
                        <Icono nombre="borrar" />
                      </button>
                    </td>
                  </tr>
                ),
              )}
            {cat && editando === NUEVO && filaEdicion(cat)}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default App
