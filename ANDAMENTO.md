# Andamento do projeto

Anotações para retomar o trabalho numa nova sessão.

## Onde estamos (15/11/2026)

- Site no ar: **https://assistencia-estudantil-ifam.github.io**. O repositório
  `Assistencia-estudantil-ifam/assistencia-estudantil-ifam.github.io` publica a branch `main`.
- Os ajustes são enviados direto para a `main` (decisão do usuário) e aparecem no site em 1 a 2 minutos.
- Painéis publicados:
  - **Assistência Estudantil e Merenda Escolar**: abas Panorama, Campi (tabela de execução como no
    Power BI, com filtros próprios e o gráfico por campus abaixo), Ano a ano, Despesas, Registros e
    Metodologia.
  - **Pagamento de Bolsas e Auxílios Estudantis**: nome completo e CPF mascarado; busca por
    estudante.
  - **Fundo da Reitoria e Jogos dos IFs**: painel próprio, alimentado pela mesma planilha de
    Assistência e Merenda.
- Nome do site: **Transparência IFAM**; título da página inicial: **Painéis de Transparência do IFAM**.

## Decisões já tomadas

- Os filtros ficam acima dos cartões de indicadores.
- "Fonte: Tesouro Gerencial", sem a frase de atualização diária.
- A planilha bruta (com CPF completo) nunca vai para este repositório público.

## Pendências

- [ ] Criar o repositório privado `IFAM-dados` na organização, com o workflow e a pasta `dados/2026`
      (passo a passo em `COMO-ATUALIZAR.md`).
- [ ] Gerar o token e salvá-lo como `TOKEN_SITE` no `IFAM-dados`.
- [ ] Fazer a primeira atualização pelo upload da planilha e conferir a aba Actions.
- [ ] Continuar as observações do usuário sobre os painéis.
- [ ] Depois: painéis das planilhas de outros setores.
