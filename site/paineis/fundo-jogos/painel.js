import {
  moeda, pct, razao, numero, dataBR, esc, soma, icone, MARCA_IF,
  carregarJSON, lerEstado, gravarEstado, iniciarDicas, iniciarAjudas,
  indicadores, barras, tabela, abas, preencherSelect, rodape, erroCarga, vazio,
} from "../../assets/js/comum.js";

const PADRAO = { ano: "", campus: "", metrica: "executado" };
const estado = lerEstado(PADRAO);
const $ = (id) => document.getElementById(id);

const METRICAS = {
  executado: ["Total executado por campus", "Fundo e Jogos IF executados, somados."],
  fundoExecutado: ["Fundo executado por campus", "Valor do Fundo da Reitoria já executado pelo campus."],
  jogosExecutado: ["Jogos IF executado por campus", "Valor dos Jogos IF já executado pelo campus."],
  orcamento: ["Orçamento total por campus", "Orçamento do Fundo mais o dos Jogos IF."],
  pExecutado: ["% executado do orçamento, por campus", "Total executado dividido pelo orçamento total do campus. Acima de 100% indica execução maior que o orçamento previsto."],
};

let meta, dados, linhas = [];
const cache = {};

iniciarDicas();
iniciarAjudas();
montarMoldura();
iniciar();

function montarMoldura() {
  $("marca").insertAdjacentHTML("afterbegin", MARCA_IF);
  $("voltar").innerHTML = `${icone("voltar")} Todos os painéis`;
  $("limpar").innerHTML = `${icone("x")} Limpar filtros`;
  const rotulos = { panorama: ["barras", "Panorama"], campi: ["predio", "Campi"], metodologia: ["livro", "Metodologia e dados"] };
  document.querySelectorAll(".aba").forEach((b) => {
    const [ic, txt] = rotulos[b.dataset.aba];
    b.innerHTML = `${icone(ic)}${txt}`;
  });
  document.querySelectorAll("[data-dica]").forEach((p) => (p.innerHTML = `${icone("clique")} Clique numa barra para filtrar pelo campus; clique de novo para remover.`));
  rodape($("rodape"));
}

async function iniciar() {
  try {
    meta = await carregarJSON("data/meta.json");
    const anos = Object.keys(meta.paineis?.fundojogos?.anos || {}).sort().reverse();
    if (!anos.length) throw new Error("Ainda não há dados publicados para este painel.");
    if (!anos.includes(estado.ano)) estado.ano = anos[0];
    preencherSelect($("f-ano"), anos.map((a) => ({ valor: a, rotulo: a })), estado.ano);
    $("f-ano").addEventListener("change", async (ev) => { estado.ano = ev.target.value; await carregarAno(); });
    $("f-campus").addEventListener("change", (e) => { estado.campus = e.target.value; atualizar(); });
    $("f-metrica").addEventListener("change", (e) => { estado.metrica = e.target.value; desenharCampi(); gravarEstado(estado, PADRAO); });
    $("limpar").addEventListener("click", () => { estado.campus = ""; $("f-campus").value = ""; atualizar(); });
    await carregarAno();
    abas($("abas"));
  } catch (e) {
    console.error(e);
    erroCarga($("indicadores"), e);
    $("resumo-geral").remove();
    $("selo").lastChild.textContent = "Dados indisponíveis";
  }
}

async function carregarAno() {
  const arq = meta.paineis.fundojogos.anos[estado.ano].arquivo;
  dados = cache[arq] ||= await carregarJSON(`data/${arq}`);
  $("selo").lastChild.textContent = `Atualizado em ${dataBR(dados.atualizadoEm)} às ${dados.atualizadoEm.slice(11, 16)}`;
  linhas = dados.fundoJogos.map((x) => {
    const orcamento = x.fundo + x.jogos, executado = x.fundoExecutado + x.jogosExecutado;
    return { ...x, orcamento, executado, saldoFundo: x.fundo - x.fundoExecutado, saldoJogos: x.jogos - x.jogosExecutado, saldo: orcamento - executado, pExecutado: razao(executado, orcamento) };
  });
  const campi = linhas.map((l) => l.campus).sort((a, b) => a.localeCompare(b, "pt-BR"));
  preencherSelect($("f-campus"), campi.map((c) => ({ valor: c, rotulo: c })), estado.campus, "Todos os campi");
  estado.campus = $("f-campus").value;
  $("f-metrica").value = estado.metrica in METRICAS ? estado.metrica : "executado";
  estado.metrica = $("f-metrica").value;
  metodologia();
  atualizar();
}

const recorte = () => linhas.filter((l) => !estado.campus || l.campus === estado.campus);
const onde = () => (estado.campus ? (estado.campus === "Reitoria" ? "Na <b>Reitoria</b>" : `No campus <b>${esc(estado.campus)}</b>`) : "No IFAM");
function alternarCampus(id) {
  estado.campus = estado.campus === id ? "" : id;
  $("f-campus").value = estado.campus;
  atualizar();
}

function atualizar() {
  gravarEstado(estado, PADRAO);
  $("f-campus").classList.toggle("ativo", !!estado.campus);
  $("limpar").disabled = !estado.campus;
  const ls = recorte();
  $("contagem").innerHTML = `<b>${numero(ls.length)}</b> de ${numero(linhas.length)} unidades`;

  const t = {
    fundo: soma(ls, "fundo"), jogos: soma(ls, "jogos"),
    fe: soma(ls, "fundoExecutado"), je: soma(ls, "jogosExecutado"),
  };
  const orc = t.fundo + t.jogos, exe = t.fe + t.je, sf = t.fundo - t.fe, sj = t.jogos - t.je;
  indicadores($("indicadores"), [
    { valor: moeda(orc), rotulo: "Orçamento Fundo + Jogos IF", ajuda: "Soma do orçamento do Fundo da Reitoria e dos Jogos IF distribuído aos campi." },
    { valor: moeda(exe), rotulo: "Executado Fundo + Jogos IF", nota: `${pct(razao(exe, orc))} do orçamento`, ajuda: "Valor já executado pelos campi com recursos do Fundo e dos Jogos IF." },
    { valor: moeda(sf), rotulo: "Saldo do Fundo", nota: sf < 0 ? "execução acima do orçamento" : `${pct(razao(sf, t.fundo))} do orçamento do Fundo`, ajuda: "Orçamento do Fundo menos o que já foi executado." },
    { valor: moeda(sj), rotulo: "Saldo dos Jogos IF", nota: sj < 0 ? "execução acima do orçamento" : `${pct(razao(sj, t.jogos))} do orçamento dos Jogos`, ajuda: "Orçamento dos Jogos IF menos o que já foi executado. Negativo quando a execução passou do orçamento." },
  ]);
  const r = $("resumo-geral");
  r.classList.toggle("resumo--alerta", sf < 0 || sj < 0);
  r.innerHTML = ls.length
    ? `${onde()}, em ${dados.exercicio}, o Fundo e os Jogos IF somam <b>${moeda(orc)}</b> de orçamento, dos quais <b>${moeda(exe)}</b> já foram executados (<b>${pct(razao(exe, orc))}</b>). ${sj < 0 ? `Os Jogos IF executaram <strong>${moeda(-sj)}</strong> a mais que o orçamento previsto para eles; ` : ""}${sf < 0 ? `O Fundo executou <strong>${moeda(-sf)}</strong> a mais que o seu orçamento; ` : ""}o saldo total é de <b>${moeda(sf + sj)}</b>.`
    : "Nenhum registro neste recorte. Use “Limpar filtros” para voltar ao total.";

  desenharPanorama(ls, t);
  desenharCampi();
}

function desenharPanorama(ls, t) {
  const etapas = [
    ["Fundo", "orçamento", t.fundo, t.fundo, "var(--verde-950)"],
    ["Fundo", "executado", t.fe, t.fundo, "var(--verde-600)"],
    ["Jogos IF", "orçamento", t.jogos, t.jogos, "var(--verde-950)"],
    ["Jogos IF", "executado", t.je, t.jogos, "var(--verde-600)"],
  ];
  const max = Math.max(...etapas.map((e) => e[2]), 1);
  $("g-etapas").innerHTML = ls.length
    ? `<div class="etapas">${etapas
        .map(([nome, sub, v, base, cor], i) => `<div class="etapa" data-tip="<b>${nome}: ${sub}</b><br>${moeda(v)} · ${pct(razao(v, base))} do orçamento" ${i === 2 ? 'style="margin-top:10px"' : ""}>
          <span class="etapa__nome">${nome}<small>${sub}</small></span>
          <span class="barra__trilho"><i style="width:${(v / max) * 100}%;--cor:${cor}"></i></span>
          <span class="barra__valor">${moeda(v)} · <small>${pct(razao(v, base))}</small></span>
        </div>`)
        .join("")}</div>`
    : vazio();
  $("r-etapas").innerHTML = ls.length
    ? `${onde()}, o Fundo executou <b>${pct(razao(t.fe, t.fundo))}</b> do seu orçamento e os Jogos IF, <b>${pct(razao(t.je, t.jogos))}</b>.`
    : "";
  const ord = (k) => ls.filter((x) => x[k] > 0).map((x) => ({ id: x.campus, rotulo: x.campus, valor: x[k] })).sort((a, b) => b.valor - a.valor);
  barras($("g-fundo"), ord("fundoExecutado"), { rotuloTotal: "executado", selecionado: estado.campus, aoClicar: alternarCampus, vazio: "Este campus não executou recursos do Fundo." });
  barras($("g-jogos"), ord("jogosExecutado"), { rotuloTotal: "executado", selecionado: estado.campus, aoClicar: alternarCampus, vazio: "Este campus não executou recursos dos Jogos IF." });
}

function desenharCampi() {
  const met = estado.metrica;
  const [titulo, desc] = METRICAS[met];
  $("t-campi").textContent = titulo;
  $("d-campi").textContent = desc;
  const ehPct = met === "pExecutado";
  const itens = linhas
    .filter((l) => (ehPct ? l.orcamento > 0 : l[met] > 0))
    .map((l) => ({ id: l.campus, rotulo: l.campus, valor: l[met] || 0 }))
    .sort((a, b) => b.valor - a.valor);
  barras($("g-campi"), itens, ehPct
    ? { formatar: pct, semPct: true, rotuloTotal: false, max: Math.max(1, ...itens.map((i) => i.valor)), selecionado: estado.campus, aoClicar: alternarCampus }
    : { selecionado: estado.campus, aoClicar: alternarCampus, rotuloTotal: titulo.split(" por ")[0].toLowerCase() });
  if (itens.length) {
    const [maior] = itens, menor = itens.at(-1);
    const f = ehPct ? pct : moeda;
    $("r-campi").innerHTML = `<b>${esc(maior.rotulo)}</b> tem o maior valor (${f(maior.valor)}) e <b>${esc(menor.rotulo)}</b>, o menor (${f(menor.valor)}).${ehPct ? ` ${numero(itens.filter((i) => i.valor > 1).length)} unidades executaram mais que o orçamento.` : ""}`;
  } else $("r-campi").innerHTML = "";

  const pctCsv = (v) => (Number.isFinite(v) ? (v * 100).toFixed(1).replace(".", ",") : "");
  tabela($("tab-campi"), {
    legenda: "Fundo e Jogos IF por campus",
    nomeArquivo: `fundo-e-jogos-${dados.exercicio}`,
    buscaDica: "Buscar campus…",
    linhas,
    ordem: { chave: "executado", dir: "desc" },
    totais: true,
    colunas: [
      { chave: "campus", titulo: "Campus", html: (v) => (v === estado.campus ? `<b>${esc(v)}</b>` : esc(v)) },
      { chave: "fundo", titulo: "Orçamento Fundo", num: true, formatar: moeda, somar: true },
      { chave: "jogos", titulo: "Orçamento Jogos IF", num: true, formatar: moeda, somar: true },
      { chave: "orcamento", titulo: "Orçamento total", num: true, formatar: moeda, somar: true },
      { chave: "fundoExecutado", titulo: "Fundo executado", num: true, formatar: moeda, somar: true },
      { chave: "jogosExecutado", titulo: "Jogos IF executado", num: true, formatar: moeda, somar: true },
      { chave: "executado", titulo: "Total executado", num: true, formatar: moeda, somar: true },
      { chave: "saldo", titulo: "Saldo", num: true, formatar: moeda, somar: true },
      { chave: "pExecutado", titulo: "% executado", num: true, formatar: (v) => pct(v), csv: pctCsv },
    ],
  });
}

function metodologia() {
  $("metodologia").innerHTML = `
    <h2>Metodologia e dados</h2>
    <p class="secao__desc">De onde vêm os números e como cada valor é calculado.</p>
    <dl class="fichas" style="margin-top:16px">
      <div class="ficha"><dt>Fonte</dt><dd>Tesouro Gerencial (SIAFI)</dd></div>
      <div class="ficha"><dt>Exercício</dt><dd>${dados.exercicio}</dd></div>
      <div class="ficha"><dt>Última atualização</dt><dd>${dataBR(dados.atualizadoEm)}</dd></div>
      <div class="ficha"><dt>Unidade de análise</dt><dd>Campus</dd></div>
    </dl>
    <div class="grade-2" style="gap:16px">
      <div class="cartao">
        <h3>${icone("info")}O que o painel mostra</h3>
        <p>O orçamento da ação 2994 (Assistência ao estudante) alocado na Reitoria e distribuído entre o Fundo e os Jogos dos Institutos Federais (JIFs) de cada campus, e quanto cada campus já executou de cada um.</p>
      </div>
      <div class="cartao">
        <h3>${icone("livro")}Regras de cálculo</h3>
        <ul>
          <li><b>Orçamento total</b>: orçamento do Fundo mais orçamento dos Jogos IF.</li>
          <li><b>Total executado</b>: Fundo executado mais Jogos IF executado.</li>
          <li><b>Saldo</b>: orçamento menos executado; negativo quando a execução passou do orçamento.</li>
          <li><b>% executado</b>: total executado dividido pelo orçamento total.</li>
        </ul>
      </div>
      <div class="cartao">
        <h3>${icone("tabela")}Tratamentos aplicados</h3>
        <ul>
          <li>Base: aba “Fundo e Jogos” da planilha de Assistência e Merenda Escolar, a mesma usada no Power BI.</li>
          <li>Os nomes dos campi foram padronizados para coincidir com os outros painéis.</li>
        </ul>
      </div>
    </div>
    <p class="resumo resumo--alerta" style="margin-top:16px"><strong>Cuidados de leitura.</strong> Os valores refletem a planilha no dia da última atualização. Arquivo de origem: ${esc(dados.arquivoOrigem)}.</p>`;
}
