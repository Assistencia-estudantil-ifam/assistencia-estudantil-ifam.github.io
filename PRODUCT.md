# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: site estático (HTML, CSS e JavaScript sem framework), alimentado por arquivos JSON gerados por um script Python a partir das planilhas exportadas do Tesouro Gerencial. Escolhido porque não precisa de servidor, é gratuito para hospedar e qualquer pessoa da equipe consegue atualizar os dados sem tocar no código.

## Users

- **Público geral e comunidade acadêmica do IFAM** (estudantes, famílias, servidores, imprensa): chegam por um link na página do IFAM, querem saber quanto o instituto recebeu e gastou com assistência estudantil e merenda escolar, por campus e por ano.
- **Estudantes bolsistas**: procuram o próprio nome para conferir se e quando um auxílio foi pago.
- **Gestores e equipe da PROEN e das diretorias dos campi**: acompanham a execução orçamentária (descentralizado, empenhado, liquidado, pago) e comparam campi.
- **Órgãos de controle** (CGU, TCU, auditoria interna): precisam de números rastreáveis até o documento de origem (NE, OB, documento hábil).

## Product Purpose

Portal de transparência dos dados orçamentários e financeiros da Pró-Reitoria de Ensino (PROEN) do Instituto Federal do Amazonas. Substitui, para o público externo, o painel em Power BI, publicando os mesmos números num site aberto, atualizado diariamente.

Sucesso: qualquer pessoa entende em segundos quanto foi previsto, recebido e pago em cada ação e campus, e os números batem com o Power BI interno.

## Positioning

É a fonte oficial e diária da execução da assistência estudantil e da merenda escolar do IFAM, campus a campus, até o pagamento individual da bolsa, coisa que o Portal da Transparência federal não mostra nesse recorte.

## Operating Context

- Os dados vêm do **Tesouro Gerencial**, exportados para Excel pela equipe e usados hoje para alimentar o Power BI.
- Primeira fase: duas planilhas.
  - **Assistência e Merenda Escolar - PROEN**: LOA por ação e campus (2024–2026), execução de 2026 (provisão, crédito disponível, empenhado, liquidado, pago), execução por nota de empenho e natureza de despesa, Fundo da Reitoria e Jogos IF.
  - **Pagamento de Bolsas - Lista de Credores**: pagamentos individuais de auxílio estudantil (aluno, CPF mascarado, OB, documento hábil, observação, valor, campus, ação).
- Outras planilhas, de outros setores, entram depois como novos painéis no mesmo site.
- Ações orçamentárias: **2994** (Assistência aos estudantes / auxílio financeiro), **21IV** (apoio à alimentação do estudante da RFEPCT), **21IH** (atendimento a pessoas com deficiência), **00PI** (alimentação escolar / PNAE, recurso do FNDE).
- Atualização diária: a equipe exporta a planilha e a envia ao repositório de dados; a publicação é automática.
- O site é acessado a partir de um link numa página do IFAM, mas não usa domínio do IFAM.

## Capabilities and Constraints

- Gráficos e tabelas por ano, campus e ação, com filtros e download dos dados exibidos.
- Lista de pagamentos de bolsas com **nome do estudante e CPF mascarado no padrão `***.123.456-**`**, como no Power BI (decisão do usuário). O CPF completo nunca chega ao site.
- CPFs de pessoas físicas que aparecem como favorecidas em notas de empenho também são mascarados; CNPJs aparecem completos.
- A planilha bruta (com CPF completo) nunca pode ir para o repositório público.
- Sem servidor: o site é estático.
- Endereço: https://assistencia-estudantil-ifam.github.io (organização "Assistencia-estudantil-ifam" no GitHub, sem o usuário pessoal no link).
- O nome do estudante aparece completo; só o CPF é mascarado (decisão do usuário).

## Brand Commitments

- Referência visual tornada vinculante pelo usuário: o HUB de Painéis da DDR/Setec/MEC (https://hub-ddr.up.railway.app/) e seus painéis ("está do jeito que gostamos").
- Identificação institucional: Instituto Federal do Amazonas, Pró-Reitoria de Ensino (PROEN). O Power BI usa o logotipo do IFAM e a marca do Governo Federal.
- Linguagem: português do Brasil, termos do orçamento público (LOA, descentralizado, empenhado, liquidado, pago, NE, OB, ND).

## Evidence on Hand

- `dados/` (fora do repositório público): as planilhas originais enviadas pelo usuário.
- Power BI `EXECUÇÃO ASSISTÊNCIA ESTUDANTIL E MERENDA ESCOLAR 2026 - PROEN.pbix`: páginas Resumo Execução, LOA e Execução, Execução Detalhada por NE e ND, Fundo e Jogos IF, Pagamento de Bolsas, LOA 2025-2026 (2994, PCD, Merenda).
- Não há depoimentos, metas ou indicadores além dos que estão nas planilhas; não inventar.

## Product Principles

1. **O número tem que bater com a fonte.** Todo total do site deve conferir com a planilha e com o Power BI; a metodologia explica cada cálculo.
2. **Explicar antes de exibir.** Cada gráfico traz uma frase dizendo o que ele mostra para quem não conhece orçamento público.
3. **Rastreável até o documento.** Dos totais se chega à NE, à OB e ao documento hábil.
4. **Atualizar não pode depender de programador.** Quem exporta a planilha publica os dados.
5. **Proteger o estudante.** Mostrar só o que o padrão federal de transparência mostra; o CPF completo nunca sai da planilha.

## Accessibility & Inclusion

Serviço público federal: seguir o eMAG e a WCAG 2.1 AA (contraste, navegação por teclado, link "Ir para o conteúdo", tabelas acessíveis). Muitos acessos devem vir do celular, inclusive de campi do interior com conexão lenta: páginas leves.
