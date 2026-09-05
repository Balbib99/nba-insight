# Plan de prompts por fases — Rediseño distintivo de NBA Insight

## Contexto del proyecto

- **Tipo de proyecto**: plataforma full-stack de analítica NBA (portfolio profesional) — landing con arquitectura, directorios de equipos/jugadores, dashboard de analítica, comparador de jugadores, favoritos, standings, playoffs históricos, autenticación con modo demo.
- **Stack**: React + Vite + TypeScript + Tailwind CSS + React Router (frontend); Node/Express (API gateway); PostgreSQL (persistencia/cache); FastAPI + `nba_api` (microservicio Python); API-Sports Basketball (proveedor externo).
- **Perfil/marca a transmitir**: deportivo y enérgico — carácter visual propio de la NBA (dinamismo, color, energía) sin sacrificar la legibilidad de los datos ni la percepción de rigor técnico.
- **Público objetivo (doble)**:
  1. Reclutadores/hiring managers técnicos — deciden si avanzan tu candidatura según la calidad percibida del producto y del código.
  2. Fans de NBA / usuarios finales — deciden si la app les resulta útil y si quieren volver a usarla.
- **Qué evitar explícitamente**:
  - El look "dashboard SaaS genérico": tarjetas blancas con sombra, degradados azul/morado, iconos de Lucide repetidos sin criterio — el "shadcn por defecto".
  - Los clichés deportivos de stock: balones de baloncesto, texturas de cancha, rojo/naranja NBA sin criterio, tipografías "sport bold" genéricas.
- **Skill de diseño a usar en la ejecución**: `frontend-design`.
- **Páginas/componentes clave existentes**: `HomePage`, `TeamsPage`, `Players`, `PlayerDetail`, `TeamDetail`, `Analytics`, `Compare`, `Favorites`, `Standings`, `Playoffs`, `Games`, `AuthPage`; componentes `StatsTable`, `PlayerCard`, `TeamCard`, `ComparisonTable`, `ComparisonSummary`, `GameCard`, `InsightCard`, `FeatureCard`, `Header`, `Footer`, `DataModeBadge`, `DataSourceBadge`, `SearchInput`, `SelectFilter`, `PlayerSelector`, `FavoriteButton`.

---

## Fase 0 — Diagnóstico (dirigido a Claude, sin skill de diseño)

```
Quiero que analices el estado visual actual de NBA Insight (mi portfolio full-stack de analítica NBA: React/Vite/Tailwind, Node/Express, PostgreSQL, FastAPI) antes de tocar nada.

Revisa src/App.tsx, src/pages/*, src/components/*, src/styles.css y la configuración de Tailwind. Quiero un diagnóstico honesto, no cambies código todavía:

1. ¿Qué transmite visualmente el proyecto hoy? ¿Se percibe como un producto de datos serio, como un proyecto de aprendizaje, o como un dashboard genérico de tutorial?
2. ¿Qué patrones son genéricos o reconocibles como "plantilla" (Tailwind por defecto, paleta sin criterio, tipografía del sistema, tarjetas con sombra estándar, iconos de lucide-react sin dirección)?
3. ¿Qué elementos reales del dominio (NBA: equipos, jugadores, stats, playoffs, comparativas) NO se están aprovechando visualmente y podrían ser una fuente de identidad distintiva?
4. ¿Qué partes del proyecto son las más visibles para un reclutador que entra por primera vez (HomePage, Analytics, PlayerDetail) y cuáles son secundarias?
5. ¿Hay inconsistencias visuales entre páginas (espaciado, tipografía, color) que delaten que se construyó sección por sección sin un sistema?

Dame el diagnóstico en una lista priorizada, sin proponer todavía soluciones de diseño.
```

---

## Fase 1 — Explorar direcciones distintivas (usa `frontend-design`)

```
Usa la skill frontend-design para proponerme 2-3 direcciones de diseño distintas para el rediseño de NBA Insight, mi portfolio full-stack de analítica NBA (React/Vite/Tailwind + Node/Express + PostgreSQL + FastAPI/nba_api).

Contexto que debes tener en cuenta:
- Quiero transmitir carácter "deportivo y enérgico": la energía y el dinamismo propios de la NBA, sin perder legibilidad de datos ni percepción de rigor técnico.
- Audiencia doble: (a) reclutadores/hiring managers técnicos que deciden si avanzan mi candidatura según la calidad percibida del producto y del código, y (b) fans de NBA que deciden si la app les resulta útil y quieren volver a usarla.
- Quiero evitar dos cosas explícitamente: el look "dashboard SaaS genérico" (tarjetas blancas con sombra, degradado azul/morado, iconos de Lucide sin criterio, el "shadcn por defecto") y los clichés deportivos de stock (balones, texturas de cancha, rojo/naranja NBA sin criterio, tipografías "sport bold" genéricas).

Para cada dirección dame:
- Nombre/concepto de la dirección.
- Paleta de color y tipografía propuestas (con razonamiento, no solo hex codes).
- Un elemento visual memorable/distintivo (algo que alguien recuerde después de cerrar la pestaña).
- Por qué encaja con el perfil deportivo-analítico y con ambas audiencias.
- Un ejemplo concreto de cómo se vería aplicado en la HomePage y en la tabla de stats (StatsTable/ComparisonTable), que son las piezas más densas en datos del proyecto.

Todavía no implementes código: quiero comparar direcciones antes de elegir.
```

---

## Fase 2 — Sistema de diseño (usa `frontend-design`)

```
Ya elegí la dirección [nombre de la dirección elegida en la Fase 1]. Usa frontend-design para desarrollar el sistema de diseño completo de NBA Insight sobre esa dirección, sin implementarlo en código todavía.

Necesito que definas:
- Escala tipográfica (familias, pesos, tamaños) para: hero/landing, títulos de sección, cuerpo, datos numéricos/stats (deben ser legibles y jerárquicos en tablas densas como StatsTable y ComparisonTable).
- Paleta de color completa con estados: base, acento(s) deportivo(s), éxito/alerta (para indicadores como DataModeBadge/DataSourceBadge que muestran si los datos son en vivo, cache o demo), y variantes para modo claro/oscuro si aplica.
- Sistema de espaciado y grid, pensado para páginas con mucha densidad de datos (Analytics, Standings, Playoffs) y páginas más narrativas (HomePage).
- Especificación de los componentes clave específicos de este proyecto: PlayerCard, TeamCard, GameCard, InsightCard, FeatureCard, StatsTable, ComparisonTable/ComparisonSummary, Header, Footer, y los badges de modo de datos (DataModeBadge, DataSourceBadge) — que deben leerse como parte del sistema, no como un elemento aparte.
- Cómo se diferencian visualmente estados de datos: en vivo (API-Sports/nba_api), cache y demo/fallback — esto es una función real del producto y puede ser un elemento distintivo si se diseña con criterio en vez de con un badge genérico.

Entrégamelo como una guía de estilo aplicable, todavía sin tocar el código de src/.
```

---

## Fase 3 — Contenido y narrativa (dirigido a Claude)

```
Con el sistema de diseño ya definido para NBA Insight, quiero revisar el contenido y la narrativa de las secciones con más peso comunicativo, antes de implementar visualmente.

Enfócate en:
- HomePage: la sección "architecture overview" y la presentación del proyecto como portfolio full-stack (frontend React/Vite, backend Node/Express, PostgreSQL, microservicio FastAPI). Quiero que un reclutador entienda en segundos qué decisiones técnicas tomé y por qué, sin sonar a descripción de tutorial.
- Los textos de FeatureCard/InsightCard en la landing: reemplaza cualquier frase genérica tipo "análisis completo de estadísticas" por afirmaciones concretas sobre lo que el proyecto realmente hace (modos de datos mock/api/hybrid, favoritos con persistencia real en PostgreSQL, autenticación JWT propia, comparador de jugadores).
- Los mensajes de estado de datos (demo mode, fallback, cache) que ve el usuario final: deben sonar transparentes y confiables, no como errores o disculpas.
- Cualquier copy de la página de autenticación (AuthPage) que explique demo mode vs. cuenta real, para que ambos públicos (reclutador probando rápido, fan que quiere volver a usarlo) entiendan la diferencia sin fricción.

Dame el contenido reescrito sección por sección, evitando frases genéricas de landing page, y explica en cada caso qué dato concreto del proyecto usaste para sustituir la frase genérica.
```

---

## Fase 4 — Implementación por secciones (usa `frontend-design`)

```
Implementa el rediseño de NBA Insight de forma incremental usando frontend-design, aplicando el sistema de diseño y el contenido ya definidos en las fases anteriores. No lo hagas todo de golpe: ve sección por sección y valida cada una conmigo antes de seguir.

Orden sugerido (de más visible a menos visible):
1. Header + navegación global (se ve en cada página).
2. HomePage (landing + architecture overview) — es lo primero que ve un reclutador.
3. StatsTable y ComparisonTable/ComparisonSummary — la pieza de datos más densa y diferenciadora del proyecto.
4. PlayerCard, TeamCard, GameCard, InsightCard, FeatureCard — componentes reutilizados en Players, TeamsPage, Games, Analytics.
5. PlayerDetail y TeamDetail (páginas de detalle).
6. Analytics, Standings, Playoffs (páginas de datos históricos/leaderboards).
7. Compare, Favorites, AuthPage.
8. Footer y DataModeBadge/DataSourceBadge (indicadores transversales).

Para cada sección: implementa el cambio, muéstrame cómo quedó, y espera mi validación antes de pasar a la siguiente. Mantén la coherencia con el sistema de diseño definido en la Fase 2 en todo momento.
```

---

## Fase 5 — Accesibilidad, responsive y rendimiento (dirigido a Claude)

```
Revisa el rediseño de NBA Insight ya implementado y corrige lo necesario en estos frentes:

- Contraste de color: verifica que la paleta deportiva/enérgica elegida cumple WCAG AA en texto sobre fondo, especialmente en StatsTable, ComparisonTable y los badges de modo de datos.
- Navegación por teclado: Header, PlayerSelector, SelectFilter, SearchInput y los formularios de AuthPage deben ser completamente navegables sin ratón.
- Semántica: tablas de stats con encabezados correctos (th/scope), landmarks (header/main/footer/nav), textos alternativos en cualquier elemento visual nuevo introducido en el rediseño.
- Responsive: valida HomePage, Analytics, Compare y StatsTable en mobile — son las páginas con más densidad de información y las que más fácil se rompen en pantallas pequeñas.
- Rendimiento de assets: si el rediseño introdujo imágenes, fuentes custom o gradientes/efectos pesados, verifica que no penalizan el tiempo de carga inicial, especialmente pensando en que este proyecto se sirve en Vercel y debe verse bien en la primera impresión de un reclutador.

Corrige lo que encuentres directamente en el código.
```

---

## Fase 6 — Prueba de distintividad (dirigido a Claude)

```
Ponte en el papel de dos personas distintas evaluando NBA Insight ya rediseñado, y dame una evaluación honesta:

1. Un hiring manager técnico que revisa 15 portfolios de candidatos por semana: ¿qué le hace recordar este proyecto sobre los demás? ¿Qué partes todavía parecen "otro dashboard más hecho con Tailwind"?
2. Un fan de NBA que llega a la app buscando datos de su equipo/jugador favorito: ¿la energía visual ayuda a la experiencia o distrae de encontrar el dato que busca?

Para cada perfil, dime específicamente:
- Qué elemento del rediseño es realmente distintivo y por qué.
- Qué partes siguen pareciendo plantilla o genéricas, con el archivo/componente exacto donde ocurre.
- Si tuvieras que elegir una sola cosa más para mejorar la distintividad del proyecto, cuál sería.

Sé crítico, no complaciente: el objetivo es identificar debilidades reales antes de publicarlo.
```

---

## Notas de uso

- **Dirigidas a Claude directamente** (sin invocar skill de diseño): Fase 0 (diagnóstico), Fase 3 (contenido y narrativa), Fase 5 (accesibilidad/responsive/rendimiento) y Fase 6 (prueba de distintividad).
- **Dirigidas a la skill `frontend-design`**: Fase 1 (direcciones), Fase 2 (sistema de diseño) y Fase 4 (implementación).
- Ejecuta las fases en orden y en sesiones separadas si es necesario — no hace falta completarlas todas de una sentada. Cada fase da mejores resultados si la anterior ya quedó validada.
- Cuantos más datos reales y concretos del proyecto lleve cada prompt (nombres de componentes, decisiones técnicas reales, capturas del estado actual), menos genérico será el resultado. Si en algún punto notas que las respuestas se vuelven genéricas, vuelve a inyectar contexto específico de NBA Insight en el prompt antes de continuar.
- La Fase 3 (contenido) sí aplica en este proyecto porque HomePage funciona como landing de portfolio con narrativa propia — no la omitas.
