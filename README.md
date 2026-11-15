# Transparência PROEN · IFAM

**Endereço: https://assistencia-estudantil-ifam.github.io**

Site de transparência da Pró-Reitoria de Ensino do Instituto Federal do Amazonas. Publica, com
atualização diária, os dados que hoje alimentam o Power BI da PROEN:

- **Assistência Estudantil e Merenda Escolar**: LOA 2024–2026, descentralização, empenho,
  liquidação e pagamento por campus e ação (2994, 21IV, 21IH, 00PI), notas de empenho por natureza de
  despesa, Fundo da Reitoria e Jogos IF.
- **Pagamento de Bolsas e Auxílios Estudantis**: cada pagamento a estudante, com nome completo, CPF mascarado,
  data, ordem bancária, documento hábil e valor; busca por nome ou CPF.

**Para atualizar os dados, siga o [COMO-ATUALIZAR.md](COMO-ATUALIZAR.md).**

## Como funciona

```
Tesouro Gerencial ──exporta──▶ planilhas .xlsx ──envio pelo navegador──▶ IFAM-dados (privado)
                                                                          │ GitHub Actions
                                                                          ▼
                       site/data/*.json (CPF mascarado) ◀── pipeline/processar.py
                                │
                                ▼ GitHub Pages
                       site público (HTML/CSS/JS, sem servidor)
```

| Pasta | Conteúdo |
|---|---|
| `site/` | o site estático: página inicial (`index.html`) e um painel por pasta em `site/paineis/` |
| `site/data/` | JSON gerados a partir das planilhas (não editar à mão) |
| `pipeline/processar.py` | lê as planilhas, valida as colunas, mascara CPFs e gera os JSON |
| `automacao/repositorio-dados/` | modelo do repositório privado de dados, com o workflow de atualização |
| `.github/workflows/publicar-site.yml` | publica `site/` no GitHub Pages |

## Proteção de dados

- O CPF sai sempre no formato `***.123.456-**`, inclusive quando aparece digitado dentro de
  observações. O script recusa publicar se encontrar qualquer CPF completo no resultado.
- As planilhas originais não entram neste repositório (`.gitignore` bloqueia `*.xlsx`).

## Novos painéis

Para outro setor: crie `site/paineis/<nome>/`, ensine `pipeline/processar.py` a reconhecer a planilha
nova e acrescente o painel ao catálogo em `site/assets/js/hub.js`.
