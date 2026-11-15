import {
  moeda, moedaCurta, baixarCSV, pct, razao, numero, dataBR, esc, soma, icone, MARCA_IF,
  carregarJSON, lerEstado, gravarEstado, iniciarDicas, iniciarAjudas,
  indicadores, barras, colunas, tabela, abas, preencherSelect, rodape, erroCarga, vazio,
} from "../../assets/js/comum.js";

const COR = { "2994": "var(--s-2994)", "21IV": "var(--s-21iv)", "21IH": "var(--s-21ih)", "00PI": "var(--s-00pi)" };
const ORDEM_ACOES = ["2994", "21IV", "21IH", "00PI"];
const COR_ANO = ["var(--ano-1)", "var(--ano-2)", "var(--ano-3)"];


const PADRAO = { ano: "", campus: "", acao: "", hist: "" };
const estado = lerEstado(PADRAO);
const $ = (id) => document.getElementById(id);

let meta, dados;
const cache = {};

iniciarDicas();
iniciarAjudas();
montarMoldura();
iniciar();

function montarMoldura() {
  $("marca").insertAdjacentHTML("afterbegin", MARCA_IF);
  $("voltar").innerHTML = `${icone("voltar")} Todos os painéis`;
  $("limpar").innerHTML = `${icone("x")} Limpar filtros`;
  const rotulos = {
    panorama: ["barras", "Panorama"], campi: ["predio", "Campi"], anos: ["calendario", "Ano a ano"],
    despesas: ["recibo", "Despesas"], registros: ["tabela", "Registros"],
    metodologia: ["livro", "Metodologia e dados"],
  };
  document.querySelectorAll(".aba").forEach((b) => {
    const [ic, txt] = rotulos[b.dataset.aba];
    b.innerHTML = `${icone(ic)}${txt}`;
  });
  document.querySelectorAll("[data-dica]").forEach((p) => (p.innerHTML = `${icone("clique")} Clique numa barra para filtrar; clique de novo para remover.`));
  rodape($("rodape"));
}

async function iniciar() {
  try {
    meta = await carregarJSON("data/meta.json");
    const anos = Object.keys(meta.paineis?.assistencia?.anos || {}).sort().reverse();
    if (!anos.length) throw new Error("Ainda não há dados publicados para este painel.");
    if (!anos.includes(estado.ano)) estado.ano = anos[0];
    preencherSelect($("f-ano"), anos.map((a) => ({ valor: a, rotulo: a })), estado.ano);
    $("f-ano").addEventListener("change", async (ev) => {
      estado.ano = ev.target.value;
      await carregarAno();
    });
    await carregarAno();
    ligarFiltros();
    abas($("abas"));
  } catch (e) {
    console.error(e);
    erroCarga($("indicadores"), e);
    $("resumo-geral").remove();
    $("selo").lastChild.textContent = "Dados indisponíveis";
  }
}

async function carregarAno() {
  const arq = meta.paineis.assistencia.anos[estado.ano].arquivo;
  dados = cache[arq] ||= await carregarJSON(`data/${arq}`);
  $("selo").lastChild.textContent = `Atualizado em ${dataBR(dados.atualizadoEm)} às ${dados.atualizadoEm.slice(11, 16)}`;
  const campi = [...new Set(dados.execucao.map((r) => r.campus))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  preencherSelect($("f-campus"), campi.map((c) => ({ valor: c, rotulo: c })), estado.campus, "Todos os campi");
  const acoes = ORDEM_ACOES.filter((a) => dados.execucao.some((r) => r.acao === a));
  preencherSelect($("f-acao"), acoes.map((a) => ({ valor: a, rotulo: `${a} · ${dados.acoes[a]}` })), estado.acao, "Todas as ações");
  estado.campus = $("f-campus").value;
  estado.acao = $("f-acao").value;
  const hist = dados.historico.map((h) => ({ valor: h.acao, rotulo: `${h.acao} · ${dados.acoes[h.acao]}` }));
  preencherSelect($("f-acao-hist"), hist, estado.hist || estado.acao || hist[0]?.valor);
  metodologia();
  atualizar();
}

function ligarFiltros() {
  $("f-campus").addEventListener("change", (e) => { estado.campus = e.target.value; atualizar(); });
  $("f-acao").addEventListener("change", (e) => {
    estado.acao = e.target.value;
    if (dados.historico.some((h) => h.acao === estado.acao)) { $("f-acao-hist").value = estado.acao; estado.hist = estado.acao; }
    atualizar();
  });
  $("f-acao-hist").addEventListener("change", (e) => { estado.hist = e.target.value; desenharAnos(); gravarEstado(estado, PADRAO); });
  $("limpar").addEventListener("click", () => {
    estado.campus = estado.acao = "";
    $("f-campus").value = $("f-acao").value = "";
    atualizar();
  });
}

// ------------------------------------------------------------------ recortes
const filtrar = (lista, { semCampus = false, semAcao = false } = {}) =>
  lista.filter((r) => (semCampus || !estado.campus || r.campus === estado.campus) && (semAcao || !estado.acao || r.acao === estado.acao));

function recorteTexto() {
  const partes = [];
  if (estado.campus) partes.push(estado.campus === "Reitoria" ? "na <b>Reitoria</b>" : `no campus <b>${esc(estado.campus)}</b>`);
  if (estado.acao) partes.push(`na ação <b>${estado.acao}</b> (${esc(dados.acoes[estado.acao])})`);
  return partes.length ? partes.join(", ") : "em <b>todo o IFAM</b>";
}

const totais = (lista) => Object.fromEntries(
  ["loa", "descentralizado", "disponivel", "empenhado", "saldoEmpenho", "liquidado", "liquidadoAPagar", "pago", "aReceber"].map((k) => [k, soma(lista, k)])
);

function atualizar() {
  gravarEstado(estado, PADRAO);
  $("f-campus").classList.toggle("ativo", !!estado.campus);
  $("f-acao").classList.toggle("ativo", !!estado.acao);
  $("limpar").disabled = !estado.campus && !estado.acao;
  const linhas = filtrar(dados.execucao);
  $("contagem").innerHTML = `<b>${numero(linhas.length)}</b> de ${numero(dados.execucao.length)} linhas de execução (campus × ação)`;

  const t = totais(linhas);
  indicadores($("indicadores"), [
    { valor: moeda(t.loa), rotulo: `LOA ${dados.exercicio}`, ajuda: "Lei Orçamentária Anual: o orçamento aprovado para o ano, distribuído por campus e ação." },
    { valor: moeda(t.descentralizado), rotulo: "Descentralizado", nota: `${pct(razao(t.descentralizado, t.loa))} da LOA`, ajuda: "Crédito que a Reitoria efetivamente repassou para o campus executar (provisão recebida)." },
    { valor: moeda(t.empenhado), rotulo: "Empenhado", nota: `${pct(razao(t.empenhado, t.loa))} da LOA`, ajuda: "Valor reservado para um estudante ou fornecedor. É o primeiro estágio da despesa." },
    { valor: moeda(t.liquidado), rotulo: "Liquidado", nota: `${pct(razao(t.liquidado, t.empenhado))} do empenhado`, ajuda: "Despesa conferida: o serviço foi prestado ou o benefício é devido, e o direito do credor foi reconhecido." },
    { valor: moeda(t.pago), rotulo: "Pago", nota: `${pct(razao(t.pago, t.empenhado))} do empenhado`, ajuda: "Valor que já saiu da conta do IFAM, por ordem bancária." },
  ]);
  $("resumo-geral").innerHTML = linhas.length
    ? `Em ${dados.exercicio}, ${recorteTexto()}, a LOA soma <b>${moeda(t.loa)}</b>. Já foram descentralizados <b>${moeda(t.descentralizado)}</b>, empenhados <b>${moeda(t.empenhado)}</b> e pagos <b>${moeda(t.pago)}</b>, o equivalente a <b>${pct(razao(t.pago, t.loa))}</b> da LOA. Restam <b>${moeda(t.disponivel)}</b> de crédito disponível para empenhar. Os números acompanham os filtros aplicados.`
    : "Nenhum registro neste recorte. Use “Limpar filtros” para voltar ao total.";

  desenharPanorama(linhas, t);
  desenharCampi();
  desenharAnos();
  desenharDespesas();
  desenharRegistros(linhas);
}

// ------------------------------------------------------------------ Panorama
function desenharPanorama(linhas, t) {
  const etapas = [
    ["LOA", "orçamento aprovado", t.loa],
    ["Descentralizado", "repassado ao campus", t.descentralizado],
    ["Empenhado", "comprometido", t.empenhado],
    ["Liquidado", "conferido", t.liquidado],
    ["Pago", "ordem bancária", t.pago],
  ];
  const max = Math.max(...etapas.map((e) => e[2]), 1);
  const el = $("g-etapas");
  if (!linhas.length) el.innerHTML = vazio();
  else
    el.innerHTML = `<div class="etapas">${etapas
      .map(([nome, sub, v], i) => `<div class="etapa" data-tip="<b>${nome}</b><br>${moeda(v)} · ${pct(razao(v, t.loa))} da LOA">
        <span class="etapa__nome">${nome}<small>${sub}</small></span>
        <span class="barra__trilho"><i style="width:${(v / max) * 100}%;--cor:${i === 0 ? "var(--verde-950)" : "var(--verde-600)"}"></i></span>
        <span class="barra__valor">${moeda(v)} · <small>${i === 0 ? "100%" : pct(razao(v, t.loa))}</small></span>
      </div>`)
      .join("")}</div>`;

  const aLiquidar = t.empenhado - t.liquidado;
  $("r-etapas").innerHTML = linhas.length
    ? `${recorteTexto().replace(/^./, (c) => c.toUpperCase())}, de cada R$ 100 da LOA, <b>R$ ${(razao(t.empenhado, t.loa) * 100 || 0).toFixed(0)}</b> já foram empenhados e <b>R$ ${(razao(t.pago, t.loa) * 100 || 0).toFixed(0)}</b> já foram pagos. Há <b>${moeda(aLiquidar)}</b> empenhados que ainda aguardam liquidação${t.aReceber > 0 ? ` e <b>${moeda(t.aReceber)}</b> da LOA ainda a receber` : ""}.`
    : "";

  const porAcao = ORDEM_ACOES.map((a) => {
    const ls = filtrar(dados.execucao, { semAcao: true }).filter((r) => r.acao === a);
    return { id: a, rotulo: `${a} · ${dados.acoes[a]}`, valor: soma(ls, "pago"), cor: COR[a], emp: soma(ls, "empenhado") };
  }).filter((x) => x.emp > 0 || x.valor > 0);
  barras($("g-acoes"), porAcao, {
    selecionado: estado.acao, rotuloTotal: "pago no recorte",
    aoClicar: (id) => { estado.acao = estado.acao === id ? "" : id; $("f-acao").value = estado.acao; atualizar(); },
  });
  const topo = [...porAcao].sort((a, b) => b.valor - a.valor)[0];
  const tot = soma(porAcao, "valor");
  $("r-acoes").innerHTML = topo && tot
    ? `${estado.campus ? `No campus <b>${esc(estado.campus)}</b>` : "No IFAM"}, a ação <b>${topo.id} (${esc(dados.acoes[topo.id])})</b> concentra <b>${pct(razao(topo.valor, tot))}</b> do valor pago (${moeda(topo.valor)}).`
    : "";
}

// ------------------------------------------------------------------ Campi
const COLS_EXEC = [
  { chave: "loa", titulo: () => `LOA ${dados.exercicio}` },
  { chave: "fundoJogos", titulo: () => "Execução Fundo/Jogos IF" },
  { chave: "descentralizado", titulo: () => "Descentralizado" },
  { chave: "disponivel", titulo: () => "Crédito disponível" },
  { chave: "empenhado", titulo: () => "Empenhado" },
  { chave: "saldoEmpenho", titulo: () => "Saldo de empenho" },
  { chave: "liquidadoAPagar", titulo: () => "Liquidado a pagar" },
  { chave: "liquidado", titulo: () => "Liquidado" },
  { chave: "pago", titulo: () => "Pago" },
  { chave: "aReceber", titulo: () => "Crédito a receber" },
  { chave: "pRepassado", titulo: () => "% repassado", pct: ["descentralizado", "loa"] },
  { chave: "pEmpenhado", titulo: () => "% empenhado", pct: ["empenhado", "descentralizado"] },
  { chave: "pLiquidado", titulo: () => "% liquidado", pct: ["liquidado", "empenhado"] },
];
const SOMAVEIS = COLS_EXEC.filter((c) => !c.pct).map((c) => c.chave);
let ordemCampi = { chave: "loa", dir: "desc" };
const abertos = new Set();

function somar(lista) {
  const o = Object.fromEntries(SOMAVEIS.map((k) => [k, soma(lista, k)]));
  for (const c of COLS_EXEC) if (c.pct) o[c.chave] = razao(o[c.pct[0]], o[c.pct[1]]);
  return o;
}
const celulas = (o) =>
  COLS_EXEC.map((c) => `<td class="num">${c.pct ? pct(o[c.chave]) : moeda(o[c.chave])}</td>`).join("");

function desenharCampi() {
  const linhas = filtrar(dados.execucao);
  const grupos = new Map();
  for (const r of linhas) {
    if (!grupos.has(r.campus)) grupos.set(r.campus, []);
    grupos.get(r.campus).push(r);
  }
  const lista = [...grupos].map(([campus, ls]) => ({ campus, ls, t: somar(ls) }));
  const { chave, dir } = ordemCampi;
  lista.sort((a, b) => {
    const r = chave === "campus" ? a.campus.localeCompare(b.campus, "pt-BR") : (a.t[chave] || 0) - (b.t[chave] || 0);
    return dir === "asc" ? r : -r;
  });
  const total = somar(linhas);
  const todosAbertos = lista.length > 0 && lista.every((g) => abertos.has(g.campus) || estado.campus);
  const el = $("tab-campi");
  if (!lista.length) { el.innerHTML = vazio(); $("r-campi").innerHTML = ""; return; }

  const th = (c) => {
    const sel = chave === c.chave;
    return `<th scope="col" class="num" ${sel ? `aria-sort="${dir === "asc" ? "ascending" : "descending"}"` : ""}><button type="button" data-ordem="${c.chave}">${esc(c.titulo())}${icone("ordenar")}</button></th>`;
  };
  el.innerHTML = `
    <div class="tabela-topo">
      <button type="button" class="botao" id="abrir-todos">${todosAbertos ? "Recolher ações" : "Mostrar ações de todos os campi"}</button>
      <span class="contagem"><b>${numero(lista.length)}</b> ${lista.length === 1 ? "unidade" : "unidades"} · ${numero(linhas.length)} linhas campus × ação</span>
      <button type="button" class="botao botao--verde" id="baixar-campi">${icone("planilha")} Baixar planilha</button>
    </div>
    <div class="tabela-rolagem tabela-exec" tabindex="0" role="region" aria-label="Execução por campus">
      <table>
        <caption class="visualmente-oculto">Execução orçamentária por campus e ação, ${dados.exercicio}</caption>
        <thead><tr>
          <th scope="col" ${chave === "campus" ? `aria-sort="${dir === "asc" ? "ascending" : "descending"}"` : ""}><button type="button" data-ordem="campus">Campus / ação${icone("ordenar")}</button></th>
          ${COLS_EXEC.map(th).join("")}
        </tr></thead>
        <tbody>
          ${lista
            .map((g) => {
              const aberto = !!estado.campus || abertos.has(g.campus);
              const ordAcoes = [...g.ls].sort((a, b) => ORDEM_ACOES.indexOf(a.acao) - ORDEM_ACOES.indexOf(b.acao));
              return `<tr class="linha-campus ${aberto ? "aberta" : ""}">
                  <th scope="row"><button type="button" class="expandir" data-campus="${esc(g.campus)}" aria-expanded="${aberto}">
                    <svg class="icone seta-exp" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>${esc(g.campus)}</button></th>
                  ${celulas(g.t)}
                </tr>
                ${aberto
                  ? ordAcoes
                      .map((r) => {
                        const o = { ...r };
                        for (const c of COLS_EXEC) if (c.pct) o[c.chave] = razao(r[c.pct[0]], r[c.pct[1]]);
                        return `<tr class="linha-acao"><th scope="row"><span class="etiqueta"><i style="--cor:${COR[r.acao]}"></i>${esc(r.acao)} · ${esc(dados.acoes[r.acao])}</span></th>${celulas(o)}</tr>`;
                      })
                      .join("")
                  : ""}`;
            })
            .join("")}
        </tbody>
        <tfoot><tr><th scope="row">Total${estado.campus || estado.acao ? " do recorte" : " do IFAM"}</th>${celulas(total)}</tr></tfoot>
      </table>
    </div>`;

  el.querySelectorAll(".expandir").forEach((b) =>
    b.addEventListener("click", () => {
      const c = b.dataset.campus;
      abertos.has(c) ? abertos.delete(c) : abertos.add(c);
      desenharCampi();
      el.querySelector(`.expandir[data-campus="${CSS.escape(c)}"]`)?.focus();
    })
  );
  el.querySelector("#abrir-todos").addEventListener("click", () => {
    if (todosAbertos) abertos.clear();
    else lista.forEach((g) => abertos.add(g.campus));
    desenharCampi();
  });
  el.querySelectorAll("[data-ordem]").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.ordem;
      ordemCampi = ordemCampi.chave === k ? { chave: k, dir: ordemCampi.dir === "asc" ? "desc" : "asc" } : { chave: k, dir: k === "campus" ? "asc" : "desc" };
      desenharCampi();
    })
  );
  el.querySelector("#baixar-campi").addEventListener("click", () => {
    const pctCsv = (v) => (Number.isFinite(v) ? (v * 100).toFixed(1).replace(".", ",") : "");
    const cols = [
      { chave: "campus", titulo: "Campus" },
      { chave: "acao", titulo: "Ação", csv: (v) => (v ? `${v} - ${dados.acoes[v]}` : "Total do campus") },
      ...COLS_EXEC.map((c) => ({ chave: c.chave, titulo: c.titulo(), csv: c.pct ? pctCsv : undefined })),
    ];
    const saida = [];
    for (const g of lista) {
      for (const r of g.ls) {
        const o = { ...r };
        for (const c of COLS_EXEC) if (c.pct) o[c.chave] = razao(r[c.pct[0]], r[c.pct[1]]);
        saida.push(o);
      }
      saida.push({ campus: g.campus, acao: "", ...g.t });
    }
    baixarCSV(`execucao-por-campus-${dados.exercicio}`, cols, saida);
  });

  const [maior] = [...lista].sort((a, b) => b.t.pago - a.t.pago);
  const menorExec = [...lista].filter((g) => g.t.empenhado > 0).sort((a, b) => a.t.pLiquidado - b.t.pLiquidado)[0];
  $("r-campi").innerHTML = lista.length > 1
    ? `${estado.acao ? `Na ação <b>${estado.acao}</b>, ` : ""}<b>${esc(maior.campus)}</b> tem o maior valor pago (<b>${moeda(maior.t.pago)}</b>). ${menorExec ? `O menor percentual liquidado é o de <b>${esc(menorExec.campus)}</b> (<b>${pct(menorExec.t.pLiquidado)}</b> do empenhado).` : ""} No total, ${pct(total.pRepassado)} da LOA já foi repassada aos campi e ${pct(total.pLiquidado)} do empenhado foi liquidado.`
    : `Em <b>${esc(lista[0].campus)}</b>, ${pct(total.pRepassado)} da LOA já foi repassada, ${pct(total.pEmpenhado)} do recebido foi empenhado e ${pct(total.pLiquidado)} do empenhado foi liquidado.`;
}
function alternarCampus(id) {
  estado.campus = estado.campus === id ? "" : id;
  $("f-campus").value = estado.campus;
  atualizar();
}

// ------------------------------------------------------------------ Ano a ano
function desenharAnos() {
  const h = dados.historico.find((x) => x.acao === $("f-acao-hist").value) || dados.historico[0];
  if (!h) { $("g-anos-total").innerHTML = vazio("Não há série histórica nesta planilha."); return; }
  const lista = h.campi.filter((c) => !estado.campus || c.campus === estado.campus);
  const totaisAno = h.anos.map((ano, i) => ({ id: String(ano), rotulo: String(ano), rotuloLongo: `LOA ${ano}`, valor: soma(lista, (c) => c.valores[i]) }));
  colunas($("g-anos-total"), totaisAno, { vazio: "Este campus não tem LOA nesta ação." });
  document.querySelectorAll("#g-anos-total .coluna i").forEach((i, n) => i.style.setProperty("--cor", COR_ANO[n] || COR_ANO[2]));
  const [a, b] = totaisAno.slice(-2);
  const v = razao(b?.valor - a?.valor, a?.valor);
  $("r-anos").innerHTML = a && b
    ? `Na ação <b>${h.acao} (${esc(dados.acoes[h.acao])})</b>${estado.campus ? `, no campus <b>${esc(estado.campus)}</b>` : ""}, a LOA ${Number.isFinite(v) ? (v >= 0 ? "subiu" : "caiu") : "passou"} de <b>${moeda(a.valor)}</b> em ${a.id} para <b>${moeda(b.valor)}</b> em ${b.id}${Number.isFinite(v) ? ` (<b>${v >= 0 ? "+" : ""}${pct(v)}</b>)` : ""}. Em ${totaisAno[0].id} era <b>${moeda(totaisAno[0].valor)}</b>.`
    : "";

  $("leg-anos").innerHTML = h.anos.map((ano, i) => `<li><i style="--cor:${COR_ANO[i]}"></i>LOA ${ano}</li>`).join("");
  const max = Math.max(...h.campi.flatMap((c) => c.valores), 1);
  const ord = [...lista].sort((x, y) => y.valores.at(-1) - x.valores.at(-1));
  $("g-anos-campi").innerHTML = ord.length
    ? `<div class="grupo">${ord
        .map((c) => {
          const [ant, at] = c.valores.slice(-2);
          const vv = razao(at - ant, ant);
          const dica = `<b>${esc(c.campus)}</b><br>${h.anos.map((ano, i) => `${ano}: ${moeda(c.valores[i])}`).join("<br>")}`;
          return `<div class="grupo__item" data-tip="${esc(dica)}">
            <span class="barra__rotulo">${esc(c.campus)}</span>
            <span class="grupo__barras" aria-label="${esc(c.campus)}: ${h.anos.map((ano, i) => `${ano} ${moeda(c.valores[i])}`).join(", ")}">
              ${c.valores.map((val, i) => `<span class="barra__trilho"><i style="width:${(val / max) * 100}%;--cor:${COR_ANO[i]}"></i></span>`).join("")}
            </span>
            <span class="variacao ${Number.isFinite(vv) ? (vv >= 0 ? "sobe" : "desce") : ""}"><b>${moedaCurta(at)}</b>${Number.isFinite(vv) ? `${icone(vv >= 0 ? "sobe" : "desce")}${vv >= 0 ? "+" : ""}${pct(vv)}` : ant === 0 && at > 0 ? "novo" : "—"}<span class="visualmente-oculto"> de ${h.anos.at(-2)} para ${h.anos.at(-1)}</span></span>
          </div>`;
        })
        .join("")}</div>`
    : vazio("Este campus não tem LOA nesta ação.");

  const comVar = ord
    .map((c) => ({ campus: c.campus, ant: c.valores.at(-2), at: c.valores.at(-1) }))
    .filter((c) => c.ant > 0)
    .map((c) => ({ ...c, v: (c.at - c.ant) / c.ant }))
    .sort((x, y) => x.v - y.v);
  const [aY, bY] = h.anos.slice(-2);
  if (!comVar.length) { $("r-anos-campi").innerHTML = ""; return; }
  if (comVar.length === 1) {
    const c = comVar[0];
    $("r-anos-campi").innerHTML = `Em <b>${esc(c.campus)}</b>, a LOA da ação ${h.acao} foi de <b>${moeda(c.ant)}</b> em ${aY} para <b>${moeda(c.at)}</b> em ${bY} (<b>${c.v >= 0 ? "+" : ""}${pct(c.v)}</b>).`;
    return;
  }
  const caiu = comVar.filter((c) => c.v < 0).length;
  const pior = comVar[0], melhor = comVar.at(-1);
  $("r-anos-campi").innerHTML = `De ${aY} para ${bY}, a LOA da ação ${h.acao} caiu em <b>${caiu}</b> de ${comVar.length} campi com orçamento nos dois anos. A maior redução foi em <b>${esc(pior.campus)}</b> (<b>${pct(pior.v)}</b>)${melhor.v > 0 ? ` e o maior aumento, em <b>${esc(melhor.campus)}</b> (<b>+${pct(melhor.v)}</b>)` : ""}.`;
}

// ------------------------------------------------------------------ Despesas
function desenharDespesas() {
  const det = filtrar(dados.detalhe);
  const m = new Map();
  for (const r of det) m.set(r.ndDescricao, (m.get(r.ndDescricao) || 0) + r.empenhado);
  const itens = [...m].map(([rotulo, valor]) => ({ id: rotulo, rotulo, valor })).filter((i) => i.valor > 0).sort((a, b) => b.valor - a.valor);
  barras($("g-natureza"), itens, { rotuloTotal: "empenhado no recorte" });
  const tot = soma(itens, "valor");
  $("r-natureza").innerHTML = itens.length
    ? `${recorteTexto().replace(/^./, (c) => c.toUpperCase())}, <b>${esc(itens[0].rotulo.toLowerCase())}</b> responde por <b>${pct(razao(itens[0].valor, tot))}</b> do empenhado (${moeda(itens[0].valor)}).${itens[1] ? ` Em seguida vem <b>${esc(itens[1].rotulo.toLowerCase())}</b>, com ${pct(razao(itens[1].valor, tot))}.` : ""}`
    : "";
  tabela($("t-empenhos"), {
    legenda: "Notas de empenho do recorte",
    nomeArquivo: `notas-de-empenho-${dados.exercicio}`,
    buscaDica: "Buscar NE, favorecido, natureza…",
    linhas: det,
    ordem: { chave: "empenhado", dir: "desc" },
    totais: true,
    colunas: [
      { chave: "campus", titulo: "Campus" },
      { chave: "acao", titulo: "Ação", html: (v) => `<span class="etiqueta"><i style="--cor:${COR[v]}"></i>${esc(v)}</span>` },
      { chave: "ne", titulo: "Nota de empenho", classe: "doc" },
      { chave: "favorecido", titulo: "Favorecido", formatar: (v) => v || "—" },
      { chave: "documento", titulo: "CPF/CNPJ/UG", classe: "doc", formatar: (v) => v || "—" },
      { chave: "ndDescricao", titulo: "Natureza da despesa", formatar: (v, l) => `${l.nd} · ${v}` },
      { chave: "empenhado", titulo: "Empenhado", num: true, formatar: moeda, somar: true },
      { chave: "liquidado", titulo: "Liquidado", num: true, formatar: moeda, somar: true },
      { chave: "pago", titulo: "Pago", num: true, formatar: moeda, somar: true },
      { chave: "disponivel", titulo: "Crédito disponível", num: true, formatar: moeda, somar: true },
    ],
  });
}

// ------------------------------------------------------------------ Registros
function desenharRegistros(linhas) {
  $("r-registros").innerHTML = `Tabela com <b>${numero(linhas.length)}</b> linhas ${recorteTexto()}, uma por campus e ação orçamentária, com todas as etapas da execução de ${dados.exercicio}. Use “Baixar planilha” para levar exatamente este recorte.`;
  tabela($("t-registros"), {
    legenda: "Execução por campus e ação",
    nomeArquivo: `execucao-por-campus-${dados.exercicio}`,
    linhas: linhas.map((l) => ({ ...l, pctExec: razao(l.empenhado, l.loa) })),
    ordem: { chave: "pago", dir: "desc" },
    totais: true,
    colunas: [
      { chave: "campus", titulo: "Campus" },
      { chave: "acao", titulo: "Ação", html: (v) => `<span class="etiqueta"><i style="--cor:${COR[v]}"></i>${esc(v)}</span>`, busca: (l) => `${l.acao} ${dados.acoes[l.acao]}` },
      { chave: "pi", titulo: "Plano interno", formatar: (v) => v || "—" },
      { chave: "loa", titulo: `LOA ${dados.exercicio}`, num: true, formatar: moeda, somar: true },
      { chave: "descentralizado", titulo: "Descentralizado", num: true, formatar: moeda, somar: true },
      { chave: "disponivel", titulo: "Crédito disponível", num: true, formatar: moeda, somar: true },
      { chave: "empenhado", titulo: "Empenhado", num: true, formatar: moeda, somar: true },
      { chave: "saldoEmpenho", titulo: "Saldo de empenho", num: true, formatar: moeda, somar: true },
      { chave: "liquidadoAPagar", titulo: "Liquidado a pagar", num: true, formatar: moeda, somar: true },
      { chave: "liquidado", titulo: "Liquidado", num: true, formatar: moeda, somar: true },
      { chave: "pago", titulo: "Pago", num: true, formatar: moeda, somar: true },
      { chave: "aReceber", titulo: "Crédito a receber", num: true, formatar: moeda, somar: true },
      { chave: "pctExec", titulo: "% executado × LOA", num: true, formatar: (v) => pct(v), csv: (v) => (Number.isFinite(v) ? (v * 100).toFixed(1).replace(".", ",") : "") },
    ],
  });
}

// ------------------------------------------------------------------ Metodologia
function metodologia() {
  const campi = new Set(dados.execucao.map((r) => r.campus));
  const hist = dados.historico.map((h) => `${h.acao} (${h.anos[0]}–${h.anos.at(-1)})`).join(", ");
  $("metodologia").innerHTML = `
    <h2>Metodologia e dados</h2>
    <p class="secao__desc">De onde vêm os números, o que cada termo significa e como foram tratados.</p>
    <dl class="fichas" style="margin-top:16px">
      <div class="ficha"><dt>Fonte</dt><dd>Tesouro Gerencial (SIAFI)</dd></div>
      <div class="ficha"><dt>Exercício</dt><dd>${dados.exercicio}</dd></div>
      <div class="ficha"><dt>Atualização</dt><dd>Diária · última em ${dataBR(dados.atualizadoEm)}</dd></div>
      <div class="ficha"><dt>Universo</dt><dd>${campi.has("Reitoria") ? campi.size - 1 : campi.size} campi e a Reitoria</dd></div>
      <div class="ficha"><dt>Unidade de análise</dt><dd>Campus × ação orçamentária</dd></div>
      <div class="ficha"><dt>Série histórica da LOA</dt><dd>${esc(hist)}</dd></div>
    </dl>
    <div class="grade-2" style="gap:16px">
      <div class="cartao">
        <h3>${icone("info")}O que o painel mostra</h3>
        <p>A execução orçamentária das ações de assistência estudantil e merenda escolar do IFAM: quanto foi previsto na LOA, quanto a Reitoria repassou a cada campus e em que etapa da despesa está esse dinheiro. Também mostra a execução por nota de empenho e a LOA de anos anteriores. O Fundo da Reitoria e os Jogos IF têm painel próprio.</p>
        <h3 style="margin-top:16px">${icone("banco")}Ações orçamentárias</h3>
        <ul>${ORDEM_ACOES.map((a) => `<li><b>${a}</b> · ${esc(dados.acoes[a])}</li>`).join("")}</ul>
      </div>
      <div class="cartao">
        <h3>${icone("livro")}Definições</h3>
        <ul>
          <li><b>LOA</b>: orçamento aprovado na Lei Orçamentária Anual para a ação no campus.</li>
          <li><b>Descentralizado</b>: crédito que a Reitoria repassou ao campus (provisão recebida).</li>
          <li><b>Crédito disponível</b>: recebido e ainda não empenhado.</li>
          <li><b>Empenhado</b>: valor reservado para um estudante ou fornecedor.</li>
          <li><b>Saldo de empenho</b>: empenhado e ainda não liquidado.</li>
          <li><b>Liquidado</b>: despesa conferida, com o direito do credor reconhecido.</li>
          <li><b>Pago</b>: valor transferido por ordem bancária.</li>
          <li><b>Crédito a receber</b>: LOA menos o descentralizado; negativo quando o campus recebeu mais que a LOA.</li>
          <li><b>% executado × LOA</b>: empenhado ÷ LOA, como no Power BI.</li>
        </ul>
      </div>
      <div class="cartao">
        <h3>${icone("tabela")}Tratamentos aplicados</h3>
        <ul>
          <li>Os nomes das unidades foram padronizados (“IFAM - CAMPUS MANAUS CENTRO” → “Manaus Centro”); a UG do instituto aparece como Reitoria.</li>
          <li>Na planilha, a coluna de orçamento da aba “LOA 2994 00PI” se chama “LOA 2025”; ela traz a LOA do exercício exibido, como no Power BI.</li>
          <li>Na lista de notas de empenho, só entram linhas com algum valor; CPFs de favorecidos aparecem como ***.123.456-**. Quando o favorecido é o próprio campus (pagamento de auxílios em lote), a coluna mostra o código da unidade gestora (UG).</li>
          <li>Em 2024 e 2025 o atendimento a pessoas com deficiência era um plano orçamentário da ação 2994; a partir de 2026 é a ação 21IH. A série histórica compara os valores de cada ano como estão na planilha.</li>
        </ul>
      </div>
    </div>
    <p class="resumo resumo--alerta" style="margin-top:16px"><strong>Cuidados de leitura.</strong> Os valores refletem o Tesouro Gerencial no dia da última atualização e mudam ao longo do ano. Diferenças de centavos podem aparecer por arredondamento. A ação 21IV não tem série histórica nesta planilha. Arquivo de origem: ${esc(dados.arquivoOrigem)}.</p>`;
}
