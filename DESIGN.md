---
name: Transparência PROEN · IFAM
description: Open-data budget panels for the Pró-Reitoria de Ensino do IFAM, in the HUB de Painéis DDR/Setec/MEC language, where every chart is rewritten as a plain Portuguese sentence.
colors:
  verde-950: "#09310c"
  verde-700: "#245829"
  verde-600: "#168821"
  verde-200: "#b5e6ba"
  verde-100: "#d3f2d6"
  verde-50: "#ecf9ee"
  s-2994: "#1351b4"
  s-21iv: "#e8a317"
  s-21ih: "#b5367a"
  s-00pi: "#168821"
  s-dt: "#636464"
  ano-1: "#a5d9aa"
  ano-2: "#4fae58"
  ano-3: "#0f6b19"
  alerta: "#b54708"
  alerta-fundo: "#fff4e5"
  alerta-tinta: "#4a2604"
  fundo: "#f7f8fa"
  superficie: "#ffffff"
  superficie-2: "#fcfdff"
  trilho: "#eef0f3"
  linha: "#e3e3e3"
  linha-2: "#efefef"
  tinta: "#202020"
  tinta-2: "#4f5050"
  tinta-3: "#636464"
typography:
  display:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "clamp(1.625rem, 1.3rem + 1.4vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  headline:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "clamp(1.25rem, 0.95rem + 0.75vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontFeature: '"lnum" 1, "tnum" 1'
  title:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  title-sm:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: '"lnum" 1'
  body-sm:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label-strong:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  label-caps:
    fontFamily: 'Rawline, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  etiqueta: "2px"
  mini: "4px"
  barra: "6px"
  raio-p: "8px"
  raio: "12px"
  faixa: "24px"
  pilula: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  stack: "14px"
  lg: "16px"
  xl: "24px"
  secao: "40px"
  gutter: "clamp(16px, 4vw, 104px)"
components:
  topo:
    backgroundColor: "{colors.verde-950}"
    textColor: "{colors.superficie}"
    typography: "{typography.headline}"
    rounded: "{rounded.faixa}"
    padding: "28px 0 32px"
  rodape:
    backgroundColor: "{colors.verde-950}"
    textColor: "{colors.superficie}"
    typography: "{typography.label}"
    rounded: "{rounded.faixa}"
    padding: "32px 0 28px"
  hub-topo:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    height: "64px"
  indicador:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    typography: "{typography.numeral}"
    rounded: "{rounded.raio}"
    padding: "16px 14px 14px 16px"
  resumo:
    backgroundColor: "{colors.verde-100}"
    textColor: "{colors.verde-950}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.raio-p}"
    padding: "12px 16px"
  resumo-alerta:
    backgroundColor: "{colors.alerta-fundo}"
    textColor: "{colors.alerta-tinta}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.raio-p}"
    padding: "12px 16px"
  filtros:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.raio}"
    padding: "16px"
  campo:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.raio-p}"
    padding: "8px 36px 8px 12px"
    height: "40px"
  campo-ativo:
    backgroundColor: "{colors.verde-50}"
    textColor: "{colors.tinta}"
  botao:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    typography: "{typography.label-strong}"
    rounded: "{rounded.raio-p}"
    padding: "7px 14px"
    height: "38px"
  botao-hover:
    backgroundColor: "{colors.fundo}"
    textColor: "{colors.tinta}"
  botao-verde:
    backgroundColor: "{colors.verde-100}"
    textColor: "{colors.verde-700}"
    typography: "{typography.label-strong}"
    rounded: "{rounded.raio-p}"
    padding: "7px 14px"
    height: "38px"
  aba:
    textColor: "{colors.tinta-2}"
    typography: "{typography.body}"
    padding: "10px 14px"
  aba-ativa:
    textColor: "{colors.verde-700}"
  estado:
    backgroundColor: "{colors.verde-100}"
    textColor: "{colors.verde-700}"
    typography: "{typography.caption}"
    rounded: "{rounded.pilula}"
    padding: "5px 14px"
  selo:
    textColor: "{colors.superficie}"
    typography: "{typography.label}"
    rounded: "{rounded.pilula}"
    padding: "5px 14px"
  barra-trilho:
    backgroundColor: "{colors.verde-600}"
    rounded: "{rounded.barra}"
    height: "18px"
  etapa-trilho:
    backgroundColor: "{colors.trilho}"
    rounded: "{rounded.raio-p}"
    height: "28px"
  card:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.raio}"
  card-capa:
    backgroundColor: "{colors.verde-600}"
    textColor: "{colors.superficie}"
    padding: "22px 24px"
    height: "210px"
  cartao:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.raio}"
    padding: "18px 20px"
  ficha:
    backgroundColor: "{colors.verde-100}"
    textColor: "{colors.verde-950}"
    rounded: "{rounded.raio-p}"
    padding: "10px 14px"
  tabela-cabecalho:
    backgroundColor: "{colors.superficie-2}"
    textColor: "{colors.tinta-2}"
    typography: "{typography.label-caps}"
    padding: "11px 12px"
  tip:
    backgroundColor: "{colors.verde-950}"
    textColor: "{colors.superficie}"
    typography: "{typography.caption}"
    rounded: "{rounded.raio-p}"
    padding: "8px 12px"
---

# Design System: Transparência PROEN · IFAM

## Overview

**Creative North Star: "The Ledger That Explains Itself"**

This is a federal open-data ledger that refuses to leave a number unexplained. The visual language is a faithful copy of the HUB de Painéis DDR/Setec/MEC, pinned by the user ("está do jeito que gostamos"): a cool off-white page (`fundo`), white cards with gently rounded corners, a forest-green frame at the top and bottom of every panel, a single action green, and Rawline, the gov.br typeface, self-hosted at 400 to 700. Inside that frame, every chart ends in a green sentence box (`resumo`) that restates the chart in plain Portuguese, with bold figures, and rewrites itself when a filter changes. The sentence is the system's signature; the bars and the indicators exist to be read by it.

Density is operational, not editorial. A panel's first viewport carries the header band, the exercise selector, a row of four to five `indicadores`, the summary sentence, the filter bar and the tabs (Panorama, Campi, Registros, Metodologia), then sections of thick labeled horizontal bars. Space is tight inside a group (4 to 14px) and generous between sections (40px). Nothing is decorative: there is no imagery, no illustration, no gradient. The only drawn ornaments are the IFAM mark (inline SVG), Lucide-style stroke icons, and the white mini-bars on the hub's card covers, which are real data.

The system rejects the "exported Power BI" look of loose floating cards and the generic dark analytics dashboard. It is light, public, and plain-spoken: an audience of students, families, press and auditors arrives from an IFAM link, often on a phone over a slow connection, and must understand what was planned, received and paid in seconds.

**Key Characteristics:**
- Forest-green frame (header band with rounded bottom corners, footer with rounded top corners) around a light working surface.
- One action green for bars, focus and active state; one text green for links, active tabs and accent rules.
- Thick horizontal bars with rounded ends and a "valor · %" label at the tip, aligned on a shared three-column grid.
- A living summary sentence in a pale green box after every chart, turning amber for cautions.
- Flat surfaces separated by 1px hairlines; shadow appears only on hover lift and floating layers.
- Rawline throughout, lining and tabular figures for every number, Brazilian currency formatting in full.

## Colors

A forest-to-mint green family carries identity, action and explanation; a fixed, colorblind-checked series palette carries the budget actions; everything else is cool neutral.

### Primary
- **Floresta (Forest Green)** (`verde-950`): the frame. Panel header band (`topo`), footer (`rodape`), the hover tooltip (`tip`), the LOA reference bar in the execution stages, the ink of the summary sentence and text selection. Also the `theme-color` of every page.
- **Verde de Ação (Action Green)** (`verde-600`): the default bar fill, column fill, the 3px focus outline, the dot of the `estado` pill, list markers, the active-filter border, and the first hub card cover.
- **Verde-Texto (Text Green)** (`verde-700`): links, the active tab label and its 3px underline, the 4px accent rule on `indicador` and `resumo`, icon tint inside `cartao` headings, totals in `barras__total`, sort icons, and the bold count in `contagem`.

### Secondary
- **Menta (Summary Mint)** (`verde-100`): the summary sentence box, the `estado` pill, `ficha` tiles, `botao--verde`, and the selected bar row.
- **Menta Clara** (`verde-50`): hover wash on clickable bars, columns and table rows; background of an active filter `select`.
- **Menta Borda** (`verde-200`): borders of mint surfaces, card hover border, text selection background.

### Tertiary (data series)
- **Série 2994** (`s-2994`, Assistência ao estudante): federal blue.
- **Série 21IV** (`s-21iv`, Alimentação do estudante): amber.
- **Série 21IH** (`s-21ih`, Pessoas com deficiência): magenta.
- **Série 00PI** (`s-00pi`, Merenda escolar/PNAE): the action green.
- **Regularização** (`s-dt`, re-issued payments): neutral grey.
- **Anos** (`ano-1`, `ano-2`, `ano-3`): a sequential green from light to dark for consecutive LOA years (oldest lightest). The second hub card cover uses `ano-3`.
- **Alerta** (`alerta`, `alerta-fundo`, `alerta-tinta`): falling variations (`variacao.desce`) and the cautionary summary (`resumo--alerta`, "Cuidados de leitura", negative balances).

### Neutral
- **Fundo** (`fundo`): page background, cool off-white. Also the plain button hover.
- **Superfície** (`superficie`): cards, indicators, filter bar, tables, fields; white text on the green frame.
- **Superfície 2** (`superficie-2`): sticky table header and table footer.
- **Trilho** (`trilho`): the empty track behind execution-stage bars, skeleton loaders, the help button hover.
- **Linha** (`linha`) and **Linha 2** (`linha-2`): 1px borders of every container, and row dividers inside tables.
- **Tinta** (`tinta`): primary text. **Tinta 2** (`tinta-2`): secondary text, labels, descriptions, inactive tabs. **Tinta 3** (`tinta-3`): notes, hints, the percentage after each bar value, and the field and select icons.

### Named Rules
**The Forest Frame Rule.** Forest green (`verde-950`) is the frame, never the content: header band, footer, tooltip, and the LOA reference bar. Working surfaces stay light.

**The Fixed Series Rule.** Each budget action owns one color in every panel, table tag and legend, in the fixed order 2994, 21IV, 21IH, 00PI, DT. Years always use the light-to-dark `ano-*` sequence. A new panel reuses these assignments; it never reshuffles them.

**The Label Carries the Number Rule.** Color is never the only carrier of a value. Every bar prints "valor · %" at its tip, every column prints its short value above it, and every chart has a text total; this is what lets the lighter series (amber 21IV, `ano-1`) stand on white.

## Typography

**Display Font:** Rawline (with system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Rawline (same stack)

**Character:** Rawline is the gov.br voice: a sober humanist sans that reads as federal service, not as a startup. One family, four weights (400, 500, 600, 700), self-hosted as woff2 with `font-display: swap`; 400 and 700 are preloaded.

### Hierarchy
- **Display** (700, fluid 26 to 34px, 1.2, -0.015em): the hub title only ("Painéis de Transparência da PROEN").
- **Headline** (700, fluid 24 to 30px, 1.2, -0.01em): the panel title inside the forest header band.
- **Numeral** (600, fluid 20 to 24px, 1.15, -0.01em, no wrap): the headline figure of each `indicador`. Drops to 17px on phones.
- **Title** (700, 20px, 1.2): section headings inside a tab ("Do orçamento ao pagamento"). Hub card cover titles use 24px/700, right-aligned, balanced.
- **Title small** (700, 16px): card and `cartao` headings.
- **Body** (400, 16px, 1.5): running text; header description capped at 72ch, hub intro at 70ch.
- **Body small** (400, 15px, 1.6): the summary sentence, section descriptions (capped at 80ch), `cartao` text, field values.
- **Label** (400/600, 14px): bar labels, values, buttons (600), indicator labels, table cells.
- **Caption** (400, 13px): notes, legends, hints (`dica`), field labels (600), tooltip text.
- **Label caps** (700, 12px, 0.04em, uppercase): table column headers only. The hub's card-group heading uses the same treatment at 13px/0.06em, and `ficha` terms at 11px/0.06em.

### Named Rules
**The Tabular Figures Rule.** Every number is set with lining figures (`"lnum" 1` on body) and `tabular-nums` wherever values stack: bar values, columns, table numeric and CPF/document cells, totals, variations. Money is printed in full pt-BR currency (R$ 21.772.289,72); the short form ("R$ 1,2 mi", "R$ 380 mil") is reserved for column-top labels where width is scarce.

**The One Family Rule.** Rawline is the only face. Hierarchy comes from size and weight steps, never from a second family or from monospace.

## Layout

A single centered column: content max width 1232px plus a fluid side gutter of `clamp(16px, 4vw, 104px)` (the `conteiner`). Panels stack vertically in a fixed order: forest header band, exercise row (`estado` pill left, `Exercício` select right), indicator row, summary sentence, filter bar, tabs, tab panel. The stack gap between these first-viewport blocks is 14px; the tab panel starts 28px below the tabs; sections inside a tab are 40px apart; main content has 24px top and 56px bottom padding.

Indicators use an auto-fit grid of minimum 200px with 12px gaps. Filters use an auto-fit grid of minimum 190px with 12px gaps, fields bottom-aligned, and a full-width footer row holding the live record count and the "Limpar filtros" button. Hub cards use an auto-fill grid of minimum 340px with 16px gaps. Two-up content (`grade-2`) uses a minimum of 420px.

Every horizontal chart shares one three-column grid: label (120 to 240px, right-aligned, ellipsis) | track (fluid) | value (`--col-valor`, 19ch, right-aligned). Bars, execution stages, year groups and the total row all use it, so values line up vertically across a whole tab.

There is one breakpoint, 720px. Below it: indicators become two columns (an odd last one spans both), the header band's corners shrink to 18px, chart rows restack into label + value on one line with a full-width track beneath (same scale as desktop), columns drop to 200px tall and hide their value labels when there are more than four, and section controls go full width. Tabs scroll horizontally with a fade mask on the overflowing edge.

**The Shared Value Column Rule.** Any new horizontal chart uses the label | track | 19ch value grid, so its numbers align with every other chart in the panel.

## Elevation & Depth

The system is flat at rest. Depth is conveyed by a tonal step (white `superficie` on the cool `fundo`) and 1px hairline borders (`linha`). Shadows appear only on response to the pointer (hub card lift) or on layers that float above the page (tooltip, help balloon). All shadows are tinted from the forest green rather than black.

### Shadow Vocabulary
- **Sombra** (`box-shadow: 0 1px 2px rgba(9, 49, 12, 0.06), 0 4px 12px rgba(9, 49, 12, 0.05)`): the `balao` help balloon opened from an indicator's info button.
- **Elevação de cartão** (`box-shadow: 0 10px 28px rgba(9, 49, 12, 0.14)`): hub card on hover, with a 2px lift and a mint border.
- **Dica flutuante** (`box-shadow: 0 6px 18px rgba(9, 49, 12, 0.25)`): the forest tooltip that follows the pointer over bars and columns.
- **Anel de foco de campo** (`box-shadow: 0 0 0 3px rgba(22, 136, 33, 0.25)`): focus halo on `select` and search fields, with the border turning action green.

### Named Rules
**The Flat-At-Rest Rule.** Containers declare elevation once: a 1px border, no shadow. A shadow is earned only by hover or by floating above the page.

## Shapes

Gently rounded, never pill-shaped containers. Cards, indicators, the filter bar and the table frame use 12px (`raio`); fields, buttons, the summary box, tiles, tooltips and the selected-bar wash use 8px (`raio-p`). The forest header band rounds only its bottom corners (24px, 18px on phones) and the footer only its top corners (24px), so the frame reads as two soft brackets around the page. Pills (999px) are reserved for small status chips: `estado` and `selo`.

Bars are flat on the left and rounded on the growing end only: 6px for chart bars, 8px for the thick execution-stage bars, 4px for year-group bars and hub mini-bars; columns round their top corners at 6px. Legend swatches are 3px squares-with-radius, table action tags 2px.

A 4px left rule in text green (`verde-700`) marks the two places where the system speaks: each `indicador` and each `resumo`. This accent rule is native to the reference world (the HUB DDR stylesheet uses `border-l-4` with its accent and status colors), and it is used nowhere else.

## Components

### Buttons
Quiet, bordered, utilitarian.
- **Shape:** gently rounded (8px), min height 38px, 14px/600 label, optional 16px stroke icon with 8px gap.
- **Default (`botao`):** white with a 1px `linha` border and `tinta` text; hover shifts to `fundo` with a darker border; active nudges 1px down; disabled drops to 45% opacity.
- **Green (`botao--verde`):** mint fill, mint border, text-green label. Used for the one positive action per table: "Baixar planilha".
- **Focus:** the global 3px action-green outline at 2px offset.
- **Help button (`ajuda`):** a 22px round ghost button holding the info icon beside an indicator label; hover or open state gets a `trilho` wash and text-green icon, and opens the `balao`.

### Chips
- **Estado:** mint pill with a mint border, text-green 13px label and a 7px action-green dot ("Fonte: Tesouro Gerencial · atualização diária", "Atualizado em …").
- **Selo:** the same pill inverted for the forest band: translucent white fill, 35%-white border, white 14px text and a brighter green dot with a soft ring. It carries "Atualizado em dd/mm/aaaa às hh:mm".
- **Etiqueta:** inline 9px colored square plus action code, used in table cells to tie a row to its series color.

### Cards / Containers
- **Indicador:** white, 12px radius, 1px `linha` border with the 4px text-green left rule, padding 16/14/14/16. A numeral, then a 14px label with an optional help button, then an optional 13px note ("86,4% da LOA").
- **Filtros:** white bar, 12px radius, 16px padding, holding fields and the count/Limpar footer.
- **Cartão:** white, 12px radius, padding 18px 20px; 16px/700 heading with a text-green icon; mint list markers. Used on the Metodologia tab.
- **Ficha:** mint tile with a mint border, 8px radius; an 11px uppercase text-green term above a 14px/600 forest value. Used in a definition grid for source facts.
- **Table frame:** white, 12px radius, 1px border, horizontally scrollable region.
- **Shadow strategy:** none at rest (see Elevation & Depth).

### Inputs / Fields
- **Style:** white, 1px grey stroke, 8px radius, min height 40px (44px for the hub search), 15px text. `select` draws its own 16px chevron at the right; search draws a 16px magnifier at the left. Field labels sit above at 13px/600 `tinta-2`.
- **Hover:** stroke darkens.
- **Focus:** stroke turns action green with a 3px translucent green halo; no outline.
- **Active filter:** a `select` holding a non-default value keeps an action-green stroke and a `verde-50` fill, so applied filters are visible at a glance.

### Navigation
- **Hub header (`hub-topo`):** white bar, 64px tall, bottom hairline; IFAM mark and "Transparência PROEN / Instituto Federal do Amazonas" on the left, `estado` pill on the right (moved under the hub title on phones).
- **Panel header (`topo`):** forest band. Brand link (mark plus institution in white/mint) that returns to the hub, panel title, one-paragraph description in 90% white, then the `selo` and a mint "Todos os painéis" back link.
- **Tabs (`abas`):** underline tabs over a hairline; each tab is a 17px stroke icon plus a 16px label in `tinta-2`. Hover turns text green; the selected tab is text green, weight 600, with a 3px text-green underline. Arrow keys, Home and End move between tabs; the active tab is mirrored in the URL hash. Overflow scrolls horizontally with an edge fade.
- **Footer (`rodape`):** forest band with rounded top corners, centered IFAM mark and institution, source line in 90% white.
- **Skip link (`pular`):** "Ir para o conteúdo", white chip that slides in from above on focus.

### Barras (signature chart)
Thick horizontal bars on the shared three-column grid: right-aligned 14px label, an 18px track with a fill that grows from the left with rounded right end, and a tabular "valor · %" at the tip with the percentage in a smaller `tinta-3`. A total row under a hairline closes the chart with the total in text green. When a bar is clickable it becomes a button: hover washes the row `verde-50`, the selected row turns mint and every other fill fades to 35%. Execution stages (`etapas`) use the same grid with a 28px bar on a visible `trilho` track and a two-line label (stage name plus a plain-language gloss: "comprometido", "ordem bancária"). Fills animate their width over 250ms on an exponential ease-out.

### Colunas
Vertical monthly or yearly columns, max 44px wide, 6px top radius, value printed above each in 12px/500, month axis below. Same selection grammar as the bars. 260px tall, 200px on phones.

### Resumo (signature sentence)
A mint box with the 4px text-green left rule, 8px radius, 15px forest text at 1.6 line-height, figures in bold. It appears under the indicators (where it is a polite live region) and after every chart, and rewrites itself whenever the year, a filter or a selection changes. The `resumo--alerta` variant (amber wash, amber rule, dark brown text) carries cautions and negative balances.

### Dicas
The pointer tooltip (`tip`) is a forest chip with white 13px text, following the pointer over any element with a tip and appearing on keyboard focus; it fades and rises 4px over 120ms. A `dica` hint line (13px `tinta-3` with a pointer-click icon) under clickable charts tells the reader the bars filter the panel.

### Hub card
A white card, 12px radius, split into a colored cover (210px, 180px on phones, `--capa` action green or `ano-3`) and a body. The cover holds a right-aligned white 24px title with an "exercício aaaa" subline and a strip of white mini-bars (85% white for the emphasized value, 40% for context) drawn from the panel's real data, with a 12px caption. The body holds the full panel title, a description and an "Atualizado em" line with an arrow that slides 3px on hover while the card lifts 2px.

### Tabela
Sticky uppercase 12px header on `superficie-2`, 14px cells with 11px/12px padding and `linha-2` row rules, row hover in `verde-50`, numeric columns right-aligned and tabular, a bold total footer for the filtered slice. Every header is a sort button with a faded double-chevron that turns text green when active. Above: search field, live count, "Baixar planilha"; below: page status and Anterior/Próxima buttons. Long observations clamp to two lines with a "ver mais" toggle.

### Motion
State transitions are 150ms ease-out (color, border, background, opacity). Data growth is 250ms `cubic-bezier(0.16, 1, 0.3, 1)` on bar width and column height. The hub card lift is 200ms ease-out; the tooltip 120ms. Skeleton loaders shimmer at 1.3s. `prefers-reduced-motion` zeroes all of it.

## Do's and Don'ts

### Do:
- **Do** frame every panel with the forest band (`verde-950`, 24px rounded bottom corners) and the matching footer, and keep the working surface on `fundo` with white containers.
- **Do** follow every chart with a `resumo` sentence that restates it in plain Portuguese, bolds the figures, and updates with every filter; switch to `resumo--alerta` for cautions and negative balances.
- **Do** print "valor · %" at the tip of every bar and a text total under every chart, on the shared label | track | 19ch value grid.
- **Do** keep each budget action's color fixed across panels (2994 blue, 21IV amber, 21IH magenta, 00PI green, Regularização grey) and use the light-to-dark `ano-*` greens for years.
- **Do** set every number in lining, tabular figures and full pt-BR currency; use the short "mi / mil" form only on column-top labels.
- **Do** keep containers flat at 12px radius with a 1px `linha` border; reserve shadows for hover lift and floating layers, tinted from forest green.
- **Do** mark the active filter state on the field itself (action-green stroke, `verde-50` fill) and keep a live record count beside "Limpar filtros".
- **Do** use Lucide-style 2px stroke icons drawn as inline SVG, at 14 to 17px, in `currentColor`.

### Don't:
- **Don't** build the "exported Power BI" page of loose floating cards, or a dark analytics dashboard; the surface stays light and the frame stays forest.
- **Don't** use forest green or the series colors as large content fills; forest is the frame, series colors belong to data marks and their legend swatches.
- **Don't** let color alone carry a value: no bar without its printed value, no series without its label.
- **Don't** add a second typeface, a monospace "data" face, or a weight outside Rawline 400 to 700.
- **Don't** use the 4px left accent rule outside `indicador` and `resumo`.
- **Don't** round containers into pills; 999px is for the `estado` and `selo` chips only.
- **Don't** add imagery, illustration, gradients or decorative texture; the only pictures are the IFAM mark and charts drawn from real data.
