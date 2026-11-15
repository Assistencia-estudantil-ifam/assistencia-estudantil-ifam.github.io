import {
  moeda, pct, razao, numero, dataBR, esc, soma, icone, MARCA_IF, MESES, MESES_LONGOS, semAcento,
  carregarJSON, lerEstado, gravarEstado, iniciarDicas, iniciarAjudas,
  indicadores, barras, colunas, tabela, abas, preencherSelect, rodape, erroCarga,
} from "../../assets/js/comum.js";

const COR = { "2994": "var(--s-2994)", "21IV": "var(--s-21iv)", DT: "var(--s-dt)" };
const PADRAO = { ano: "", campus: "", acao: "", mes: "", busca: "", metrica: "valor" };
const estado = lerEstado(PADRAO);
const $ = (id) => document.getElementById(id);
const estreito = matchMedia("(max-width: 720px)");
estreito.addEventListener("change", () => dados && desenharMeses());

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
  const rotulos = { panorama: ["barras", "Panorama"], campi: ["predio", "Campi"], registros: ["tabela", "Registros"], metodologia: ["livro", "Metodologia e dados"] };
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
    const anos = Object.keys(meta.paineis?.bolsas?.anos || {}).sort().reverse();
    if (!anos.length) throw new Error("Ainda não há dados publicados para este painel.");
    if (!anos.includes(estado.ano)) estado.ano = anos[0];
    preencherSelect($("f-ano"), anos.map((a) => ({ valor: a, rotulo: a })), estado.ano);
    $("f-ano").addEventListener("change", async (ev) => { estado.ano = ev.target.value; estado.mes = ""; await carregarAno(); });
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
  const arq = meta.paineis.bolsas.anos[estado.ano].arquivo;
  dados = cache[arq] ||= await carregarJSON(`data/${arq}`);
  $("selo").lastChild.textContent = `Atualizado em ${dataBR(dados.atualizadoEm)} às ${dados.atualizadoEm.slice(11, 16)}`;
  linhas = dados.pagamentos.map((p) => {
    const [c, acao, data, aluno, cpf, ob, documento, obs, valor] = p;
    return {
      campus: dados.campi[c], acao, data, mes: data.slice(5, 7), aluno, cpf, ob, documento,
      observacao: dados.observacoes[obs], valor,
      chave: `${aluno}|${cpf}`,
      busca: `${semAcento(aluno)} ${cpf.replace(/\D/g, "")} ${cpf}`,
    };
  });
  const campi = [...new Set(linhas.map((l) => l.campus))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  preencherSelect($("f-campus"), campi.map((c) => ({ valor: c, rotulo: c })), estado.campus, "Todos os campi");
  preencherSelect($("f-acao"), Object.entries(dados.acoes).filter(([k]) => linhas.some((l) => l.acao === k)).map(([k, v]) => ({ valor: k, rotulo: k === "DT" ? v : `${k} · ${v}` })), estado.acao, "Todas as ações");
  const meses = [...new Set(linhas.map((l) => l.mes).filter(Boolean))].sort();
  preencherSelect($("f-mes"), meses.map((m) => ({ valor: m, rotulo: `${MESES_LONGOS[+m - 1].replace(/^./, (x) => x.toUpperCase())} de ${dados.exercicio}` })), estado.mes, "Todos os meses");
  estado.campus = $("f-campus").value; estado.acao = $("f-acao").value; estado.mes = $("f-mes").value;
  $("f-busca").value = estado.busca;
  $("f-metrica").value = estado.metrica;
  metodologia();
  atualizar();
}

function ligarFiltros() {
  let t;
  $("f-busca").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { estado.busca = e.target.value.trim(); atualizar(); }, 200); });
  $("f-campus").addEventListener("change", (e) => { estado.campus = e.target.value; atualizar(); });
  $("f-acao").addEventListener("change", (e) => { estado.acao = e.target.value; atualizar(); });
  $("f-mes").addEventListener("change", (e) => { estado.mes = e.target.value; atualizar(); });
  $("f-metrica").addEventListener("change", (e) => { estado.metrica = e.target.value; desenharCampi(); gravarEstado(estado, PADRAO); });
  $("limpar").addEventListener("click", () => {
    Object.assign(estado, { campus: "", acao: "", mes: "", busca: "" });
    $("f-campus").value = $("f-acao").value = $("f-mes").value = $("f-busca").value = "";
    atualizar();
  });
}

const termos = () => semAcento(estado.busca).replace(/[.\-*]/g, " ").split(/\s+/).filter(Boolean);
function filtrar({ semCampus = false, semAcao = false, semMes = false } = {}) {
  const ts = termos();
  return linhas.filter((l) =>
    (semCampus || !estado.campus || l.campus === estado.campus) &&
    (semAcao || !estado.acao || l.acao === estado.acao) &&
    (semMes || !estado.mes || l.mes === estado.mes) &&
    (!ts.length || ts.every((x) => l.busca.includes(x)))
  );
}
const estudantes = (ls) => new Set(ls.map((l) => l.chave)).size;

function recorteTexto() {
  const p = [];
  if (estado.campus) p.push(`no campus <b>${esc(estado.campus)}</b>`);
  if (estado.acao) p.push(estado.acao === "DT" ? "em <b>regularizações</b>" : `na ação <b>${estado.acao}</b>`);
  if (estado.mes) p.push(`em <b>${MESES_LONGOS[+estado.mes - 1]}</b>`);
  return p.length ? p.join(", ") : `em <b>${dados.exercicio}</b>, em todo o IFAM`;
}

function atualizar() {
  gravarEstado(estado, PADRAO);
  for (const [id, v] of [["f-campus", estado.campus], ["f-acao", estado.acao], ["f-mes", estado.mes]]) $(id).classList.toggle("ativo", !!v);
  $("limpar").disabled = !estado.campus && !estado.acao && !estado.mes && !estado.busca;
  const ls = filtrar();
  $("contagem").innerHTML = `<b>${numero(ls.length)}</b> de ${numero(linhas.length)} pagamentos`;

  const total = soma(ls, "valor"), est = estudantes(ls);
  indicadores($("indicadores"), [
    { valor: moeda(total), rotulo: "Total pago", ajuda: "Soma dos valores efetivamente pagos aos estudantes, já descontados os cancelamentos e incluídas as regularizações." },
    { valor: numero(est), rotulo: "Estudantes atendidos", ajuda: "Estudantes diferentes que receberam pelo menos um pagamento no recorte (contados por nome e CPF)." },
    { valor: numero(ls.length), rotulo: "Pagamentos", ajuda: "Quantidade de pagamentos individuais. Um mesmo estudante pode receber vários no ano." },
    { valor: moeda(razao(total, est) || 0), rotulo: "Média por estudante", ajuda: "Total pago dividido pelo número de estudantes atendidos no recorte." },
  ]);

  const r = $("resumo-geral");
  if (estado.busca) {
    const nomes = [...new Set(ls.map((l) => l.aluno))];
    r.innerHTML = ls.length
      ? nomes.length === 1
        ? `Encontramos <b>${numero(ls.length)}</b> pagamento${ls.length > 1 ? "s" : ""} para <b>${esc(nomes[0])}</b> (CPF ${esc(ls[0].cpf || "não informado")}), somando <b>${moeda(total)}</b>. O mais recente foi em <b>${dataBR(ls[0].data)}</b>, pelo campus ${esc(ls[0].campus)}. Veja cada pagamento na aba Registros.`
        : `A busca “${esc(estado.busca)}” encontrou <b>${numero(nomes.length)}</b> estudantes e <b>${numero(ls.length)}</b> pagamentos, somando <b>${moeda(total)}</b>. Digite o nome completo ou os dígitos do CPF para encontrar uma pessoa.`
      : `Nenhum pagamento encontrado para “${esc(estado.busca)}”${estado.campus || estado.acao || estado.mes ? " com os filtros aplicados" : ""}. Confira a grafia ou busque pelos 6 dígitos do meio do CPF (ex.: 737.681).`;
  } else {
    r.innerHTML = ls.length
      ? `${recorteTexto().replace(/^./, (c) => c.toUpperCase())}, foram pagos <b>${moeda(total)}</b> em <b>${numero(ls.length)}</b> pagamentos a <b>${numero(est)}</b> estudantes, uma média de <b>${moeda(razao(total, est))}</b> por estudante. Os números acompanham os filtros aplicados.`
      : "Nenhum pagamento neste recorte. Use “Limpar filtros” para voltar ao total.";
  }

  desenharMeses();
  desenharAcoes();
  desenharCampi();
  desenharRegistros(ls);
}

function desenharMeses() {
  const base = filtrar({ semMes: true });
  const porMes = new Map();
  for (const l of base) {
    const o = porMes.get(l.mes) || { valor: 0, n: 0, est: new Set() };
    o.valor += l.valor; o.n++; o.est.add(l.chave);
    porMes.set(l.mes, o);
  }
  const ultimo = Math.max(...linhas.map((l) => +l.mes), 1);
  const itens = Array.from({ length: ultimo }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    const o = porMes.get(m) || { valor: 0, n: 0, est: new Set() };
    return { id: m, rotulo: MESES[i], rotuloLongo: `${MESES_LONGOS[i]} de ${dados.exercicio}`, valor: o.valor, extra: `${numero(o.n)} pagamentos · ${numero(o.est.size)} estudantes` };
  });
  const aoClicar = (id) => { estado.mes = estado.mes === id ? "" : id; $("f-mes").value = estado.mes; atualizar(); };
  if (estreito.matches) barras($("g-meses"), itens.map((i) => ({ ...i, rotulo: `${i.rotulo}/${dados.exercicio}` })), { selecionado: estado.mes, aoClicar, rotuloTotal: "pago no ano" });
  else colunas($("g-meses"), itens, { selecionado: estado.mes, aoClicar });
  const comValor = itens.filter((i) => i.valor > 0);
  if (!comValor.length) return ($("r-meses").innerHTML = "");
  const pico = [...comValor].sort((a, b) => b.valor - a.valor)[0];
  const dataMax = base.reduce((m, l) => (l.data > m ? l.data : m), "");
  $("r-meses").innerHTML = `O mês com mais pagamentos foi <b>${pico.rotuloLongo}</b>, com <b>${moeda(pico.valor)}</b>. Os dados vão até <b>${dataBR(dataMax)}</b>, data do pagamento mais recente registrado; meses ainda em curso aparecem parciais.`;
}

function desenharAcoes() {
  const base = filtrar({ semAcao: true });
  const itens = Object.entries(dados.acoes)
    .map(([k, v]) => ({ id: k, rotulo: k === "DT" ? v : `${k} · ${v}`, valor: soma(base.filter((l) => l.acao === k), "valor"), cor: COR[k] }))
    .filter((i) => i.valor > 0);
  barras($("g-acoes"), itens, {
    selecionado: estado.acao, rotuloTotal: "pago no recorte",
    aoClicar: (id) => { estado.acao = estado.acao === id ? "" : id; $("f-acao").value = estado.acao; atualizar(); },
  });
  const tot = soma(itens, "valor");
  const est = (k) => estudantes(base.filter((l) => l.acao === k));
  const [maior] = [...itens].sort((x, y) => y.valor - x.valor);
  const dt = itens.find((i) => i.id === "DT");
  $("r-acoes").innerHTML = maior
    ? `${recorteTexto().replace(/^./, (c) => c.toUpperCase())}, a ação <b>${maior.id === "DT" ? "de regularização" : maior.id}</b> responde por <b>${pct(razao(maior.valor, tot))}</b> do valor pago (${moeda(maior.valor)}, para ${numero(est(maior.id))} estudantes).${dt ? ` As regularizações somam <b>${moeda(dt.valor)}</b> em ${numero(base.filter((l) => l.acao === "DT").length)} pagamentos.` : ""}`
    : "";
}

function desenharCampi() {
  const base = filtrar({ semCampus: true });
  const g = new Map();
  for (const l of base) {
    const o = g.get(l.campus) || { valor: 0, pagamentos: 0, est: new Set() };
    o.valor += l.valor; o.pagamentos++; o.est.add(l.chave);
    g.set(l.campus, o);
  }
  const met = estado.metrica;
  const itens = [...g].map(([c, o]) => ({
    id: c, rotulo: c,
    valor: met === "valor" ? o.valor : met === "estudantes" ? o.est.size : met === "pagamentos" ? o.pagamentos : razao(o.valor, o.est.size),
  })).sort((a, b) => b.valor - a.valor);
  const titulos = { valor: "Valor pago por campus", estudantes: "Estudantes atendidos por campus", pagamentos: "Pagamentos por campus", media: "Valor médio por estudante, por campus" };
  const descs = {
    valor: "Total pago pelo campus no recorte.",
    estudantes: "Estudantes diferentes que receberam ao menos um pagamento.",
    pagamentos: "Quantidade de pagamentos individuais feitos pelo campus.",
    media: "Total pago dividido pelo número de estudantes atendidos.",
  };
  $("t-campi").textContent = titulos[met];
  $("d-campi").textContent = descs[met];
  const ehMoeda = met === "valor" || met === "media";
  const alternar = (id) => { estado.campus = estado.campus === id ? "" : id; $("f-campus").value = estado.campus; atualizar(); };
  barras($("g-campi"), itens, met === "media"
    ? { semPct: true, rotuloTotal: false, selecionado: estado.campus, aoClicar: alternar }
    : { formatar: ehMoeda ? moeda : numero, selecionado: estado.campus, aoClicar: alternar, rotuloTotal: met === "valor" ? "pago no recorte" : met === "estudantes" ? "soma dos campi" : "pagamentos" });
  if (!itens.length) return ($("r-campi").innerHTML = "");
  const fmt = ehMoeda ? moeda : numero;
  const [maior] = itens, menor = itens.at(-1);
  $("r-campi").innerHTML = `<b>${esc(maior.rotulo)}</b> tem o maior valor (${fmt(maior.valor)}) e <b>${esc(menor.rotulo)}</b>, o menor (${fmt(menor.valor)}).${met === "estudantes" ? " Um estudante que recebeu por mais de um campus é contado em cada um." : ""}`;
}

function desenharRegistros(ls) {
  $("r-registros").innerHTML = `Tabela com <b>${numero(ls.length)}</b> pagamentos ${estado.busca ? `da busca “${esc(estado.busca)}”` : recorteTexto()}, do mais recente para o mais antigo. O CPF aparece mascarado; a ordem bancária (OB) e o documento hábil permitem conferir cada pagamento no SIAFI. Use “Baixar planilha” para levar este recorte.`;
  tabela($("t-registros"), {
    legenda: "Pagamentos de bolsas do recorte",
    nomeArquivo: `pagamentos-bolsas-${dados.exercicio}`,
    buscaDica: "Buscar na tabela (OB, observação…)",
    linhas: ls,
    ordem: { chave: "data", dir: "desc" },
    porPagina: 25,
    totais: true,
    colunas: [
      { chave: "data", titulo: "Data", formatar: dataBR, classe: "doc" },
      { chave: "aluno", titulo: "Estudante" },
      { chave: "cpf", titulo: "CPF", classe: "cpf", formatar: (v) => v || "—" },
      { chave: "campus", titulo: "Campus" },
      { chave: "acao", titulo: "Ação", html: (v) => `<span class="etiqueta"><i style="--cor:${COR[v]}"></i>${v === "DT" ? "Regularização" : esc(v)}</span>`, csv: (v) => (v === "DT" ? "Regularização" : v) },
      { chave: "ob", titulo: "Ordem bancária", classe: "doc" },
      { chave: "documento", titulo: "Documento hábil", classe: "doc" },
      { chave: "observacao", titulo: "Observação", html: (v) => (v ? `<span class="obs">${esc(v)}</span>${v.length > 110 ? '<button type="button" class="mais" aria-expanded="false">ver mais</button>' : ""}` : "—") },
      { chave: "valor", titulo: "Valor", num: true, formatar: moeda, somar: true },
    ],
  });
}

function metodologia() {
  const datas = linhas.map((l) => l.data).filter(Boolean).sort();
  $("metodologia").innerHTML = `
    <h2>Metodologia e dados</h2>
    <p class="secao__desc">De onde vêm os pagamentos, o que entra na conta e como os dados pessoais são protegidos.</p>
    <dl class="fichas" style="margin-top:16px">
      <div class="ficha"><dt>Fonte</dt><dd>Tesouro Gerencial (SIAFI) · lista de credores</dd></div>
      <div class="ficha"><dt>Exercício</dt><dd>${dados.exercicio}</dd></div>
      <div class="ficha"><dt>Período coberto</dt><dd>${dataBR(datas[0])} a ${dataBR(datas.at(-1))}</dd></div>
      <div class="ficha"><dt>Atualização</dt><dd>Diária · última em ${dataBR(dados.atualizadoEm)}</dd></div>
      <div class="ficha"><dt>Unidade de análise</dt><dd>Pagamento a um estudante</dd></div>
      <div class="ficha"><dt>Registros</dt><dd>${numero(linhas.length)} pagamentos</dd></div>
    </dl>
    <div class="grade-2" style="gap:16px">
      <div class="cartao">
        <h3>${icone("info")}O que o painel mostra</h3>
        <p>Os pagamentos de bolsas e auxílios do Programa de Assistência Estudantil feitos pelos campi do IFAM, um a um: estudante, campus pagador, data, ordem bancária (OB), documento hábil, observação registrada no SIAFI e valor.</p>
        <h3 style="margin-top:16px">${icone("cadeado")}Proteção de dados pessoais</h3>
        <p>O CPF aparece no padrão do Portal da Transparência, com os três primeiros e os dois últimos dígitos ocultos (***.123.456-**). CPFs digitados dentro das observações também são mascarados. O CPF completo não é publicado em nenhum arquivo do site.</p>
      </div>
      <div class="cartao">
        <h3>${icone("livro")}Regras de cálculo</h3>
        <ul>
          <li><b>Total pago</b>: soma do valor efetivamente pago a cada estudante, já descontados os cancelamentos.</li>
          <li><b>Regularização</b>: pagamento refeito por documento DT depois de uma ordem bancária cancelada; entra no total como um pagamento novo.</li>
          <li><b>Estudantes atendidos</b>: pessoas distintas, contadas por nome e CPF mascarado.</li>
          <li><b>Mês</b>: mês da data de pagamento (saque da OB), não o mês de referência do auxílio.</li>
          <li><b>Ação</b>: ação orçamentária da ordem bancária original (2994 ou 21IV).</li>
        </ul>
      </div>
      <div class="cartao">
        <h3>${icone("tabela")}Tratamentos aplicados</h3>
        <ul>
          <li>Base: aba “Painel_Pagamentos” da planilha de lista de credores, a mesma usada no Power BI, já com cancelamentos e regularizações tratados.</li>
          <li>Pagamentos de valor zero ficam de fora.</li>
          <li>Os nomes dos campi foram padronizados (“IFAM - CAMPUS MAUES” → “Maués”).</li>
        </ul>
      </div>
    </div>
    <p class="resumo resumo--alerta" style="margin-top:16px"><strong>Cuidados de leitura.</strong> O valor de um pagamento pode reunir mais de um mês de auxílio (pagamentos retroativos); por isso a observação de cada OB é exibida. Arquivo de origem: ${esc(dados.arquivoOrigem)}.</p>`;
}
