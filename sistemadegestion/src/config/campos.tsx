import CampoEntrada from '../components/CampoEntrada/CampoEntrada'
import CampoEscala from '../components/CampoEscala/CampoEscala'
import CampoFecha from '../components/CampoFecha/CampoFecha'
import CampoSelect from '../components/CampoSelect/CampoSelect'
import type { Cambiar, Escala } from '../types/registros'

type OpcionesTexto = { lista?: string; placeholder?: string }

// Constructores de celdas editables para un borrador B y unos catálogos C.
// Uso: const campo = camposDe<MiBorrador, MisCatalogos>(); campo.texto('nombre', 'Nombre')
export function camposDe<B extends Record<string, string>, C>() {
  type Campo = keyof B & string

  return {
    // Texto libre; con "lista" sugiere valores de un <datalist>
    texto:
      (campo: Campo, etiqueta: string, { lista, placeholder }: OpcionesTexto = {}) =>
      (b: B, cambiar: Cambiar<B>) => (
        <CampoEntrada
          valor={b[campo]}
          onChange={(v) => cambiar(campo, v)}
          etiqueta={etiqueta}
          lista={lista}
          placeholder={placeholder}
        />
      ),

    // Fecha opcional: muestra NA hasta que se elige una en el calendario
    fecha: (campo: Campo, etiqueta: string) => (b: B, cambiar: Cambiar<B>) => (
      <CampoFecha valor={b[campo]} onChange={(v) => cambiar(campo, v)} etiqueta={etiqueta} />
    ),

    // Lista desplegable de valores fijos o de un catálogo
    seleccion:
      (campo: Campo, etiqueta: string, valores: (cat: C) => string[]) =>
      (b: B, cambiar: Cambiar<B>, cat: C) => (
        <CampoSelect
          valor={b[campo]}
          opciones={valores(cat).map((v) => ({ valor: v, etiqueta: v }))}
          onChange={(v) => cambiar(campo, v)}
          etiqueta={etiqueta}
        />
      ),

    // Escala 1–5 con botón "i" que abre la tabla de niveles
    escala:
      (campo: Campo, etiqueta: string, de: (cat: C) => Escala[]) =>
      (b: B, cambiar: Cambiar<B>, cat: C) => (
        <CampoEscala
          valor={b[campo]}
          escala={de(cat)}
          onChange={(v) => cambiar(campo, v)}
          etiqueta={etiqueta}
        />
      ),
  }
}

// Celda de solo lectura de una escala: "4: Mayor", con la descripción al pasar el puntero
export function verEscala(escala: Escala[], numero: number) {
  const e = escala.find((x) => x.numero === numero)
  return <span title={e?.descripcion}>{e?.valor ?? numero}</span>
}
