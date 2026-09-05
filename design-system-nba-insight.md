# Sistema de diseño — NBA Insight
## "Boxscore en vivo" — fusión de Marcador en vivo + Ficha de anotador + Zona caliente

## 0. Cómo se combinaron las tres direcciones

En vez de mezclar las tres estéticas en cada pantalla (lo que generaría ruido), cada dirección se asigna al tipo de contenido donde explota mejor su potencial, compartiendo **una sola paleta, dos tipografías y un mismo lenguaje de reglas/hairlines** como tejido conectivo:

| Apartado | Dirección dominante | Por qué |
|---|---|---|
| Identidad, Header, Hero | **A — Marcador en vivo** | Es la primera impresión: aquí es donde más rinde la energía kinética del broadcast. |
| Datos y analítica (StatsTable, ComparisonTable, Analytics, stats de detalle) | **C — Zona caliente** | Es donde el rigor analítico importa más; el color dejó de ser decorativo y pasa a codificar rendimiento real. |
| Narrativa y arquitectura (HomePage, Playoffs histórico, Footer) | **B — Ficha de anotador** | Es donde se necesita autoridad editorial para convencer a un reclutador técnico, sin depender de iconos ni tarjetas. |

El resultado no son tres estilos conviviendo, sino **un mismo vocabulario visual (paleta + reglas + numerales condensados) que cambia de énfasis según lo que la pantalla necesita comunicar**.

Principio de restricción: el "momento audaz" único de toda la web es el corte diagonal tipo scorebug en el hero. El resto del sitio es disciplinado — sin sombras, sin degradados decorativos, sin hover-lift genérico.

---

## 1. Tipografía

Dos familias, roles claramente distintos (no tres, para mantener disciplina):

| Rol | Familia | Uso |
|---|---|---|
| **Display / numérico** | Condensada con itálica ligera disponible (p. ej. Oswald, Fjalla One o Barlow Condensed) | Marcadores, cifras grandes de stats, titulares de sección, wordmark del header, cabeceras de columna en tablas. Es el hilo que conecta las tres direcciones: se usa tanto en el hero "en vivo" como en las cifras de la ficha de anotador y en los valores de la zona caliente. |
| **Texto / UI** | Grotesca humanista con más carácter que Inter (p. ej. Public Sans o General Sans) | Cuerpo, navegación, botones, párrafos narrativos. Sustituye a Inter por defecto. |

### Escala tipográfica

| Token | Tamaño / interlineado | Familia | Uso |
|---|---|---|---|
| `display-xl` | 4.5rem / 0.95, tracking -0.01em | Condensada, 700 | H1 del hero |
| `display-lg` | 2.75rem / 1.0 | Condensada, 700 | Títulos de sección editorial |
| `display-md` | 1.75rem / 1.1 | Condensada, 600 | Marcadores de GameCard, cifras de InsightCard |
| `stat-numeral` | 1.25rem / 1, tabular-nums | Condensada, 600 | Valores de StatsTable/ComparisonTable |
| `body-lg` | 1.125rem / 1.6 | Humanista, 400 | Intro de sección, subtítulos narrativos |
| `body` | 0.9375rem / 1.6 | Humanista, 400 | Cuerpo general, máx. ~75 caracteres por línea |
| `label` | 0.8125rem / 1.4, **sentence case** | Humanista, 500 | Etiquetas de columna, nav — nunca en mayúsculas (evita el tell genérico de eyebrows en caps) |

Regla dura: la tipografía condensada solo se usa para números y titulares cortos, nunca para párrafos — evita que "se sienta deportiva" de forma superficial.

---

## 2. Paleta

Una sola paleta compartida por todo el sitio. Los mismos dos acentos (`score-orange` / `live-cyan`) hacen doble función: energía de marcador en vivo **y** codificación funcional de rendimiento (caliente/frío) en las tablas — así no son "tres paletas", son los mismos dos colores usados con coherencia.

| Token | Hex | Uso |
|---|---|---|
| `--ink-950` | `#0A0E14` | Fondo base (carbón azulado, no negro puro) |
| `--ink-900` | `#10141C` | Paneles elevados, cabeceras de tabla |
| `--paper-100` | `#EDEAE2` | Fondo cálido tipo papel de ficha, para callouts puntuales sobre fondo oscuro |
| `--score-orange` | `#FF6B1A` | Acento primario: energía en el header/hero **y** "por encima de la media" en tablas de stats |
| `--live-cyan` | `#2FD3C9` | Acento secundario: indicador "en vivo" **y** "por debajo de la media" en tablas de stats |
| `--ledger-blue` | `#5B8DBE` | Acento de autoridad editorial (enlaces, cifras destacadas en secciones narrativas sobre fondo oscuro) |
| `--ledger-ink` | `#1D3557` | Mismo rol que `--ledger-blue` pero para uso sobre `--paper-100` (mejor contraste ahí) |
| `--rule` | `#212837` | Hairlines sobre fondo oscuro |
| `--rule-paper` | `#C9C3B4` | Hairlines sobre `--paper-100` |
| `--text-primary` | `#F4F2ED` | Texto principal sobre fondo oscuro (blanco roto, no `#fff`) |
| `--text-secondary` | `#9BA3B4` | Texto secundario sobre fondo oscuro |
| `--up-green` | `#3DDC84` | Solo para deltas positivos reales (no decorativo) |
| `--down-red` | `#FF4757` | Solo para deltas negativos reales |

Todas las combinaciones texto/fondo se validan a AA en la Fase 5; aquí se fija la intención, no el contraste final.

---

## 3. Espaciado y grid

- **Escala de espaciado** (base 4px): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`.
- **Contenedores**: páginas narrativas (`HomePage`, `Playoffs`) a `max-width: 72rem`; páginas densas en datos (`Analytics`, `Standings`, `Compare`) a `max-width: 90rem` para que las tablas respiren sin el `overflow-x` forzado que hay hoy.
- **Grid narrativo** (Dirección B): 12 columnas, splits asimétricos (7/5, 8/4) en vez de grids uniformes de 3 tarjetas idénticas — esto reemplaza directamente el patrón repetitivo detectado en la Fase 0 en `HomePage`.
- **Grid de datos** (Dirección C): módulo tipo "zona de tiro" — un grid con celdas de tamaño variable según relevancia del dato (un panel KPI grande junto a varios secundarios pequeños), no una cuadrícula uniforme de tarjetas iguales.

---

## 4. Motivos estructurales (dónde usar cada uno)

1. **Corte diagonal / franja de marcador** (Dirección A) — Header (wordmark + indicador de sección activa), Hero (franja que separa titular de panel de arquitectura), y como único separador de sección permitido en toda la web. No se repite en más de 2-3 puntos por página.
2. **Tinte caliente/frío + grid de zonas** (Dirección C) — StatsTable, ComparisonTable, Analytics, bloques de stats en PlayerDetail/TeamDetail. El tinte de celda (naranja/cian) codifica si el valor está por encima o por debajo de la media de esa columna — nunca es decorativo.
3. **Reglas de ficha (hairlines) + alineación tabular** (Dirección B) — HomePage (arquitectura, "qué demuestra el proyecto"), Playoffs histórico, Footer. Sustituye por completo el patrón de tarjeta-con-sombra-e-icono-circular detectado en la Fase 0.

---

## 5. Especificación de componentes

### Header
- Wordmark "NBA Insight" en `display-md` condensado, sin icono de Lucide genérico; debajo, una franja fina en `--score-orange` de ~3px a modo de "línea de marcador".
- Ítem de navegación activo: no más pastilla blanca rellena; en su lugar, una marca diagonal corta en `--score-orange` bajo el enlace activo (eco discreto del motivo del hero).
- Fondo `--ink-950` con `--rule` como borde inferior de 1px; sin blur pesado.

### Footer
- Se convierte en una "línea de cierre de ficha": una sola fila con hairline superior (`--rule`), texto en `body` normal ("Full-stack: React → Node → PostgreSQL → Python"), y los enlaces a GitHub/LinkedIn como texto plano con subrayado en hover — no más botones con borde.

### PlayerCard / TeamCard
- Sin borde redondeado ni sombra. Panel delimitado por un hairline superior (`--rule`), fondo `--ink-900` liso.
- El número/posición del jugador o abreviatura del equipo se renderiza grande en `display-md` condensado (como un dorsal), sustituyendo el icono-en-círculo repetido.
- Stats en fila tabular horizontal (no grid 2x2 de cajas), con etiquetas en `label` (sentence case).
- Hover: tinte de fondo sutil con `--ledger-blue` al 6% de opacidad — sin `translate-y` ni cambio de borde.

### GameCard
- Layout tipo scorebug real: abreviaturas de equipo + marcador en `display-md` condensado, separados por un hairline vertical.
- Partido en curso: indicador "En directo" como luz testigo (punto pequeño en `--live-cyan` con pulso sutil, respetando `prefers-reduced-motion`) — texto en sentence case, no en mayúsculas.

### StatsTable / ComparisonTable / ComparisonSummary
- Cabecera de columna en `label` (sentence case, no uppercase) con tipografía condensada para los valores numéricos de las celdas (`stat-numeral`, tabular-nums para que las cifras alineen verticalmente).
- Celdas con tinte de fondo `--score-orange`/`--live-cyan` a baja opacidad según la desviación del valor respecto a la media de la columna (rendimiento por encima/por debajo).
- El líder de cada columna se marca con un asterisco/daguer discreto junto al número (`*`), como en una ficha de anotador real, con una nota a pie de tabla — no con un badge de color aparte.
- Sin sombra `shadow-xl`; el panel se delimita solo con `--rule`.

### FeatureCard / InsightCard (HomePage / Analytics)
- `FeatureCard` dentro de HomePage deja de ser una tarjeta con icono circular: se convierte en una fila de ficha de dos columnas (nombre de la capacidad en `--ledger-blue` + descripción), separadas por hairlines — igual que una línea de stat sheet. No se numeran (01/02/03) porque el contenido no es una secuencia real.
- `InsightCard` (cifras KPI en Analytics) conserva el formato "número grande + etiqueta" pero en `display-md` condensado, con tinte caliente/frío de fondo si la cifra es comparativa (por encima/debajo de un benchmark), conectando con el motivo de Zona caliente.

### DataModeBadge / DataSourceBadge — el elemento de marca distintivo
Este es el componente con más potencial sin explotar detectado en la Fase 0; pasa de ser un badge de color genérico a un recurso real de ficha de anotador:
- **`api` (en vivo)**: luz testigo tipo "tally light" de transmisión — punto en `--live-cyan` + texto "En directo" en sentence case, sin fondo de pastilla.
- **`hybrid` (cache/fallback)**: se trata como una nota al pie de ficha de anotador — un daguer (`†`) junto al dato, con una nota breve al final de la sección ("† Dato servido desde cache mientras el proveedor en vivo no está disponible"). Reutiliza una convención real de las hojas de anotación (asteriscos/dagueres para notas) en vez de inventar un badge.
- **`mock` (demo)**: nota de "Datos de muestra" en tono neutro sobre `--paper-100`, sin colores de alerta — es una función intencional del producto, no un error.

---

## 6. Motion

Un único momento de motion orquestado: al cargar el Hero, la franja diagonal tipo scorebug entra con un barrido rápido (~300ms), una sola vez. Todo lo demás es estático o usa transiciones de opacidad/color muy sutiles en hover (sin lift, sin scale). Se respeta `prefers-reduced-motion: reduce` desactivando el barrido inicial.

---

## 7. Qué se elimina explícitamente del sistema actual

- El patrón `rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20` repetido en cada componente.
- El icono-en-círculo-de-color (`size-11 rounded-lg bg-red-500/15 text-red-300`) como recurso universal.
- Las etiquetas en mayúsculas (`uppercase text-zinc-500`) de las cabeceras de tabla.
- Los badges de color sueltos sin relación con el resto de la paleta (sky/emerald/amber independientes).
- El hover genérico `hover:-translate-y-0.5 hover:border-red-400/50`.
- El degradado radial decorativo del hero y las barras de progreso falsas del bloque "Platform snapshot".
