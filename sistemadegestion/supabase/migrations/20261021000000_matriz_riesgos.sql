+-- Matriz de riesgos: catálogos, matriz S×P, rangos de evaluación y registros
-- Ejecutar completo en Supabase → SQL Editor

-- ───────────── Catálogos de una columna ─────────────

create table public.procesos (
  nombre text primary key
);

create table public.tipo_riesgo (
  nombre text primary key
);

create table public.fuente_actividad (
  nombre text primary key
);

create table public.causa (
  nombre text primary key
);

create table public.consecuencia_impacto (
  nombre text primary key
);

insert into public.procesos (nombre) values
  ('Manufactura EPS'),
  ('Entrega de Producto al Cliente'),
  ('Desarrollo Tecnologico'),
  ('Programacion de la Cadena'),
  ('Comercializacion EPS');

insert into public.tipo_riesgo (nombre) values
  ('Ambiental'),
  ('Calidad'),
  ('Integral');

insert into public.fuente_actividad (nombre) values
  ('Requisitos Legales'),
  ('Situaciones de Emergencia'),
  ('Aspectos Ambientales Significativos'),
  ('Contexto'),
  ('Partes Interesadas y Eventos Propios de Cada Proceso');

insert into public.causa (nombre) values
  ('Accidentes de Transito'),
  ('Condiciones Climaticas Adversas'),
  ('Equipos/Instrumentos con fallas y/o deterioro'),
  ('Equipos/Instrumentos descalibrados'),
  ('Captura de pedido erronea');

insert into public.consecuencia_impacto (nombre) values
  ('Afectacion de la confiabilidad'),
  ('Afectacion de la disponibilidad'),
  ('Afectacion al personal o instalaciones'),
  ('Afectacion al proceso de EPS'),
  ('Disminucion de ventas de producto');

-- ───────────── Escalas de severidad y probabilidad ─────────────
-- "valor" empieza con el número de la escala (1–5); la app lo usa para el cálculo

create table public.severidad (
  valor text primary key,
  descripcion text not null
);

create table public.probabilidad (
  valor text primary key,
  descripcion text not null
);

insert into public.severidad (valor, descripcion) values
  ('1: Insignificante', '1. Daños menores muy bajo costo $0 a $1,000 dlls 2. Sin reclamo de cliente 3. Sin incidentes con impacto ambiental'),
  ('2: Menor', '1. Bajo costo entre $1,001 a $15,000 dlls 2. Se generaria reclamo informal por parte del cliente 3. Incidente con impacto ambiental menor'),
  ('3: Moderado', '1. Daños de $15,001 a $50,000 dlls 2. Se generaria reclamo formal por parte del cliente 3. Incidente con impacto ambiental moderado'),
  ('4: Mayor', '1. Daños de $50,001 a $250,000 dlls 2. Necesidad de devolucion (material, nota de credito) 3. Incidente con impacto ambiental mayor pero se puede remediar a corto plazo'),
  ('5: Extremo', '1. Daño mayor a $250,000 dlls 2. Perder cliente y/o perder el certificado 3. Incidente con impacto ambiental mayor, se puede remediar pero a largo plazo');

insert into public.probabilidad (valor, descripcion) values
  ('1: Raro', 'Ha ocurrido en los ultimos 2 años o que nunca ha ocurrido'),
  ('2: Improbable', 'Ha ocurrido en el ultimo año'),
  ('3: Creible', 'Ha ocurrido en los ultimos 6 meses'),
  ('4: Probable', 'Ha ocurrido en los ultimos 3 meses'),
  ('5: Casi Seguro', 'Ha ocurrido en el ultimo mes');

-- ───────────── Matriz S×P → valor 1..25 ─────────────
-- S5·P5 = 1 (peor) … S1·P1 = 25 (mejor), según la matriz oficial:
--        P1  P2  P3  P4  P5
--   S5   15   8   6   4   1
--   S4   16  14   7   5   2
--   S3   20  19  13  11   3
--   S2   24  22  18  12   9
--   S1   25  23  21  17  10

create table public.matriz_riesgo (
  severidad smallint not null check (severidad between 1 and 5),
  probabilidad smallint not null check (probabilidad between 1 and 5),
  valor smallint not null check (valor between 1 and 25),
  primary key (severidad, probabilidad)
);

insert into public.matriz_riesgo (severidad, probabilidad, valor) values
  (5, 1, 15), (5, 2,  8), (5, 3,  6), (5, 4,  4), (5, 5,  1),
  (4, 1, 16), (4, 2, 14), (4, 3,  7), (4, 4,  5), (4, 5,  2),
  (3, 1, 20), (3, 2, 19), (3, 3, 13), (3, 4, 11), (3, 5,  3),
  (2, 1, 24), (2, 2, 22), (2, 3, 18), (2, 4, 12), (2, 5,  9),
  (1, 1, 25), (1, 2, 23), (1, 3, 21), (1, 4, 17), (1, 5, 10);

-- ───────────── Rangos de evaluación ─────────────

create table public.evaluacion_riesgos (
  rango text primary key, -- formato "N al M"
  descripcion text not null
);

insert into public.evaluacion_riesgos (rango, descripcion) values
  ('1 al 8', 'Extremo: Es necesario establecer acciones'),
  ('9 al 13', 'Alto: Es necesario establecer acciones'),
  ('14 al 16', 'Importante: Es necesario tener al menos un control documentado o en su defecto, establecer acciones'),
  ('17 al 20', 'Moderado: No es necesario establecer acciones'),
  ('21 al 25', 'Bajo: No se requieren acciones');

-- ───────────── Registros de la matriz ─────────────

create table public.riesgos (
  id bigint generated always as identity primary key,
  proceso text not null,
  fecha_incorporacion date not null default current_date,
  tipo_riesgo text not null references public.tipo_riesgo (nombre) on update cascade,
  fuente_actividad text not null default '',
  evento_riesgo text not null,
  causa text not null default '',
  consecuencia_impacto text not null default '',
  controles text[] not null default '{}',
  severidad smallint not null check (severidad between 1 and 5),
  probabilidad smallint not null check (probabilidad between 1 and 5),
  folio text not null default 'NA',
  created_at timestamptz not null default now()
);

create index riesgos_tipo_riesgo_idx on public.riesgos (tipo_riesgo);

-- ───────────── Acceso desde la app (clave publishable / rol anon) ─────────────
-- Sin login todavía: cualquiera con la URL de la app puede leer y editar.
-- Cuando se agregue autenticación, cambiar "to anon, authenticated" por reglas por usuario.

alter table public.procesos enable row level security;
alter table public.tipo_riesgo enable row level security;
alter table public.fuente_actividad enable row level security;
alter table public.causa enable row level security;
alter table public.consecuencia_impacto enable row level security;
alter table public.severidad enable row level security;
alter table public.probabilidad enable row level security;
alter table public.matriz_riesgo enable row level security;
alter table public.evaluacion_riesgos enable row level security;
alter table public.riesgos enable row level security;

grant select on
  public.procesos,
  public.tipo_riesgo,
  public.fuente_actividad,
  public.causa,
  public.consecuencia_impacto,
  public.severidad,
  public.probabilidad,
  public.matriz_riesgo,
  public.evaluacion_riesgos
to anon, authenticated;

grant select, insert, update, delete on public.riesgos to anon, authenticated;

create policy "lectura catalogo" on public.procesos for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.tipo_riesgo for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.fuente_actividad for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.causa for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.consecuencia_impacto for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.severidad for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.probabilidad for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.matriz_riesgo for select to anon, authenticated using (true);
create policy "lectura catalogo" on public.evaluacion_riesgos for select to anon, authenticated using (true);

create policy "leer riesgos" on public.riesgos for select to anon, authenticated using (true);
create policy "crear riesgos" on public.riesgos for insert to anon, authenticated with check (true);
create policy "editar riesgos" on public.riesgos for update to anon, authenticated using (true) with check (true);
create policy "borrar riesgos" on public.riesgos for delete to anon, authenticated using (true);
