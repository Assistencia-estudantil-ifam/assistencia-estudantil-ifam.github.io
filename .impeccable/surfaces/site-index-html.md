---
version: 1
slug: "site-index-html"
primary_target: "site/index.html"
related_targets: ["site/paineis/assistencia-merenda/index.html","site/paineis/pagamento-bolsas/index.html"]
---

# Portal de Transparência PROEN/IFAM

Scope: hub (`site/index.html`) + painéis em `site/paineis/*/index.html`. Mode: **Operate** (painéis de dados; o hub é a porta de entrada, também Operate).

Audience/job: público e comunidade do IFAM vindos de um link no site do IFAM; estudantes conferindo o próprio pagamento; gestores e controle comparando campi. Constraints: dados diários a partir de planilhas do Tesouro Gerencial; CPF sempre mascarado; números iguais ao Power BI.

## Direction contract

THESIS: o painel federal de dados abertos que explica cada número em português simples: indicadores, filtros, gráficos de barras com rótulo e uma frase-resumo verde que reescreve o gráfico em palavras e acompanha os filtros. Recusa o "Power BI exportado" de cartões soltos e o dashboard escuro genérico.

OWN-WORLD: linguagem do HUB DDR/Setec/MEC, vinculante pelo usuário. Fundo #F7F8FA, cartões brancos raio 12px, cabeçalho e rodapé verde-floresta #09310C com cantos inferiores arredondados, verde de ação #168821, texto-verde #245829 sobre caixa de resumo #D3F2D6, fonte Rawline (gov.br) 400–700, barras horizontais grossas com cantos arredondados e rótulo "valor · %" na ponta, abas sublinhadas com ícone.

STORY: o visitante vê quanto foi previsto, recebido e pago; filtra o campus dele; lê a frase que explica; desce até o documento (NE/OB) ou baixa a tabela.

FIRST VIEWPORT: cabeçalho verde com sigla institucional, título do painel, descrição de uma linha e selo "Atualizado em dd/mm/aaaa"; seletor de exercício; faixa de 4–5 indicadores; frase-resumo; barra de filtros (campus, ação, …, Limpar); abas (Panorama, Campi, Registros, Metodologia).

FORM: cópia fiel da gramática do painel PNAE na RFEPCT do HUB DDR; assinatura: frase-resumo viva que se reescreve a cada filtro. seed: none (pinned) — "use ele como referência para nosso trabalho, pois está do jeito que gostamos" (https://hub-ddr.up.railway.app/).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
