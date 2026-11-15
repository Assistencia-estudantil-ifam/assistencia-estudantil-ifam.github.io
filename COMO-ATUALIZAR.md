# Como atualizar os dados do site

O site lê as mesmas planilhas que alimentam o Power BI. Você envia a planilha nova pelo navegador e o
site se atualiza sozinho em cerca de 2 minutos. Não é preciso mexer em código.

Endereço do site: **https://assistencia-estudantil-ifam.github.io**

Tudo fica na organização **Assistencia-estudantil-ifam** do GitHub, em dois repositórios:

| Repositório | Visibilidade | O que tem |
|---|---|---|
| `assistencia-estudantil-ifam.github.io` (este) | **público** | o site e os números já tratados (nome completo, CPF mascarado) |
| `IFAM-dados` | **privado** | as planilhas originais, com CPF completo |

As planilhas **nunca** devem ser enviadas para o repositório público do site.

---

## Rotina diária (1 a 2 minutos)

1. Exporte do Tesouro Gerencial e atualize as planilhas, como já faz para o Power BI:
   - **Assistência e Merenda Escolar - PROEN.xlsx**
   - **PAGAMENTO DE BOLSAS - LISTA DE CREDORES.xlsx**
2. Abra o repositório **IFAM-dados** no GitHub e entre na pasta `dados/2026`.
3. Clique em **Add file → Upload files** e arraste uma ou as duas planilhas.
   - Use sempre o mesmo nome de arquivo (`assistencia-merenda.xlsx` e `pagamento-bolsas.xlsx`):
     assim o GitHub substitui a versão anterior.
4. Clique em **Commit changes**.
5. Pronto. Em cerca de 2 minutos o site mostra os dados novos e a data “Atualizado em” muda.

Para acompanhar, abra a aba **Actions** do IFAM-dados:

- ✅ verde: dados publicados;
- ❌ vermelho: algo na planilha impediu a publicação. Clique na execução e depois em
  **Processar planilhas** para ler a mensagem. **O site continua no ar com os dados anteriores.**
  O GitHub também manda um e-mail avisando.

Pode enviar só uma das planilhas: a outra continua como estava.

### Mensagens de erro mais comuns

| Mensagem | O que fazer |
|---|---|
| `não tem as colunas: "..."` | A exportação mudou de layout. Exporte de novo com as mesmas colunas de sempre. |
| `não tem a aba "..."` | A planilha foi salva sem uma das abas usadas pelo site. Use o arquivo completo. |
| `não é uma planilha conhecida; ignorada` | O arquivo não tem as abas esperadas (é outra planilha). |
| `Encontrei um possível CPF sem máscara` | Algum texto da planilha tem um CPF num formato que o site não sabe mascarar. Nada foi publicado; avise o responsável técnico. |

### Virada de ano

Crie a pasta `dados/2027` no IFAM-dados (Add file → Create new file → digite `dados/2027/.gitkeep`)
e passe a enviar as planilhas novas para ela. O ano é reconhecido pelos próprios dados e o seletor
**Exercício** do site passa a mostrar 2026 e 2027.

---

## Configuração inicial (uma vez só)

### 1. Criar a organização

1. No GitHub, clique no **+** (canto superior direito) → **New organization** → plano **Free**.
2. *Organization name*: `Assistencia-estudantil-ifam` · e-mail de contato · *My personal account* → **Next** → **Complete setup**.

O nome da organização define o endereço: `https://assistencia-estudantil-ifam.github.io`.

### 2. Levar o site para a organização

1. Junte esta branch à `main` (pull request) no repositório atual.
2. Em **Settings → General**, no fim da página, **Transfer ownership** → escolha a organização `Assistencia-estudantil-ifam`.
3. Já na organização, em **Settings → General → Repository name**, renomeie para
   `assistencia-estudantil-ifam.github.io` (exatamente assim, tudo minúsculo). Esse nome faz o site abrir na raiz do endereço,
   sem `/IFAM` no final.
4. Em **Settings → Pages**, em *Build and deployment → Source*, escolha **GitHub Actions**.
5. Na aba **Actions**, rode **Publicar site**. Em 1 a 2 minutos `https://assistencia-estudantil-ifam.github.io` está no ar.
   É esse o link que vai na página do IFAM.

O GitHub redireciona os endereços antigos do repositório, então nada se perde na transferência.

### 3. Criar o repositório privado de dados

1. Na organização, **New repository** → nome `IFAM-dados` → marque **Private** → **Create repository**.
2. Envie para ele o conteúdo da pasta [`automacao/repositorio-dados/`](automacao/repositorio-dados/)
   deste repositório (o `README.md`, a pasta `dados/` e a pasta `.github/workflows/`).
   Pelo navegador: **Add file → Upload files** e arraste as pastas. A pasta `.github` é oculta no
   Windows e no Mac; se não aparecer, crie o arquivo `.github/workflows/atualizar-site.yml` em
   **Add file → Create new file** e cole o conteúdo.

### 4. Dar ao repositório de dados permissão para atualizar o site

1. Em **sua foto → Settings → Developer settings → Personal access tokens → Fine-grained tokens →
   Generate new token**:
   - *Token name*: `atualizar-site`
   - *Resource owner*: **Assistencia-estudantil-ifam** (a organização, não a sua conta)
   - *Expiration*: até 1 ano (anote a data para renovar)
   - *Repository access*: **Only select repositories** → `assistencia-estudantil-ifam.github.io`
   - *Permissions → Repository permissions → Contents*: **Read and write**
2. Se o GitHub disser que o token aguarda aprovação, aprove em
   **organização → Settings → Personal access tokens → Pending requests** (quem criou a organização pode aprovar).
3. Copie o token gerado.
4. Em **IFAM-dados → Settings → Secrets and variables → Actions → New repository secret**:
   nome `TOKEN_SITE`, valor = o token copiado.

### 5. Primeira carga

Envie as duas planilhas para `dados/2026` do IFAM-dados (rotina diária, passos 2 a 4).

---

## Bom saber

- **Tamanho do repositório de dados.** O GitHub guarda todas as versões enviadas. A planilha de
  bolsas tem cerca de 11 MB, então o IFAM-dados cresce alguns GB por ano. Se o GitHub avisar que o
  repositório está grande, crie um IFAM-dados novo (passos 3 e 4) e apague o antigo depois de
  conferir o site.
- **Token vencido.** Quando o token expira, a atualização falha com erro de permissão no passo
  *Baixar o site*. Gere um novo (passo 4) e substitua o secret `TOKEN_SITE`.
- **Rodar no computador** (opcional, para quem quiser testar antes de enviar):

  ```bash
  pip install -r pipeline/requirements.txt
  python pipeline/processar.py --entrada pasta-com-as-planilhas --saida site/data
  python -m http.server 8000 --directory site
  ```

  e abra `http://localhost:8000`.
