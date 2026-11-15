import { carregarJSON, dataBR, esc, icone, MARCA_IF, moeda, numero, MESES, rodape, semAcento } from "./comum.js";

/*
 * Catálogo de painéis. Para publicar um painel novo (de outro setor):
 * 1. crie a pasta site/paineis/<nome>/ com index.html e painel.js;
 * 2. ensine o pipeline/processar.py a ler a planilha nova (tipo = <chave>);
 * 3. acrescente uma entrada aqui.
 */
const SECOES = [
  {
    titulo: "Assistência estudantil e alimentação",
    paineis: [
      {
        chave: "assistencia",
        url: "paineis/assistencia-merenda/",
        capa: "#168821",
        titulo: "Assistência Estudantil e Merenda Escolar",
        capaTitulo: "Assistência estudantil e merenda escolar",
        descricao: "LOA, recursos recebidos, empenho, liquidação e pagamento por campus e ação; LOA de 2024 a 2026; notas de empenho.",
        termos: "orcamento loa execucao empenho liquidado pago 2994 21iv 21ih 00pi pnae merenda alimentacao deficiencia pcd campus",
      },
      {
        chave: "bolsas",
        url: "paineis/pagamento-bolsas/",
        capa: "#0f6b19",
        titulo: "Pagamento de Bolsas e Auxílios Estudantis",
        capaTitulo: "Pagamento de bolsas",
        descricao: "Cada pagamento de auxílio a estudantes, com data, ordem bancária, campus e valor. Busque pelo nome ou pelo CPF.",
        termos: "bolsa bolsas auxilio auxilios estudante aluno pagamento cpf ob ordem bancaria credores paes",
      },
      {
        chave: "fundojogos",
        url: "paineis/fundo-jogos/",
        capa: "#1b4a20",
        titulo: "Fundo da Reitoria e Jogos dos IFs",
        capaTitulo: "Fundo e Jogos IF",
        descricao: "Orçamento e execução do Fundo da Reitoria e dos Jogos dos Institutos Federais (JIFs) em cada campus.",
        termos: "fundo jogos jif jifs reitoria esporte orcamento execucao saldo campus 2994",
      },
    ],
  },
];

const $ = (id) => document.getElementById(id);
$("marca").insertAdjacentHTML("afterbegin", MARCA_IF);
rodape($("rodape"));

let meta = { paineis: {} };
try {
  meta = await carregarJSON("data/meta.json");
} catch (e) {
  console.error(e);
}

const ultimoAno = (chave) => {
  const anos = meta.paineis?.[chave]?.anos || {};
  const a = Object.keys(anos).sort().at(-1);
  return a ? { ano: a, ...anos[a] } : null;
};

function mini(p, info) {
  const r = info?.resumo;
  if (!r) return "";
  if (r.etapas) {
    const e = r.etapas, max = Math.max(...Object.values(e), 1);
    const nomes = { loa: "LOA", descentralizado: "Descentralizado", empenhado: "Empenhado", liquidado: "Liquidado", pago: "Pago" };
    return `<div><div class="mini" role="img" aria-label="Execução ${info.ano}: ${Object.entries(e).map(([k, v]) => `${nomes[k]} ${moeda(v)}`).join(", ")}">
      ${Object.entries(e).map(([k, v]) => `<i class="${k === "pago" ? "" : "fraco"}" style="height:${(v / max) * 100}%"></i>`).join("")}</div>
      <div class="mini-legenda">${moeda(e.pago)} pagos de ${moeda(e.loa)} da LOA ${info.ano}</div></div>`;
  }
  if (r.totais) {
    const t = r.totais, orc = t.fundo + t.jogos, exe = t.fundoExecutado + t.jogosExecutado;
    const vals = [["Orçamento do Fundo", t.fundo, "fraco"], ["Fundo executado", t.fundoExecutado, ""], ["Orçamento dos Jogos IF", t.jogos, "fraco"], ["Jogos IF executado", t.jogosExecutado, ""]];
    const max = Math.max(...vals.map((v) => v[1]), 1);
    return `<div><div class="mini" role="img" aria-label="${vals.map(([n, v]) => `${n} ${moeda(v)}`).join(", ")}">
      ${vals.map(([, v, c]) => `<i class="${c}" style="height:${(v / max) * 100}%"></i>`).join("")}</div>
      <div class="mini-legenda">${moeda(exe)} executados de ${moeda(orc)} em ${info.ano}</div></div>`;
  }
  if (r.meses) {
    const max = Math.max(...r.meses, 1);
    return `<div><div class="mini" role="img" aria-label="Pago por mês em ${info.ano}: ${r.meses.map((v, i) => `${MESES[i]} ${moeda(v)}`).join(", ")}">
      ${r.meses.map((v) => `<i style="height:${Math.max(2, (v / max) * 100)}%"></i>`).join("")}</div>
      <div class="mini-legenda">${moeda(r.totalPago)} a ${numero(r.estudantes)} estudantes em ${info.ano}</div></div>`;
  }
  return "";
}

$("secoes").innerHTML = SECOES.map(
  (s) => `<section class="hub-secao" aria-labelledby="s-${esc(semAcento(s.titulo).replace(/\W+/g, "-"))}">
    <h2 class="visualmente-oculto" id="s-${esc(semAcento(s.titulo).replace(/\W+/g, "-"))}">${esc(s.titulo)}</h2>
    <div class="cards">
      ${s.paineis
        .map((p) => {
          const info = ultimoAno(p.chave);
          return `<a class="card" href="${p.url}" data-busca="${esc(semAcento(`${p.titulo} ${p.descricao} ${p.termos}`))}">
            <div class="card__capa" style="--capa:${p.capa}">
              <h2>${esc(p.capaTitulo)}${info ? `<small>exercício ${info.ano}</small>` : ""}</h2>
              ${mini(p, info)}
            </div>
            <div class="card__corpo">
              <h3>${esc(p.titulo)}</h3>
              <p>${esc(p.descricao)}</p>
              <div class="card__meta"><span>${info ? `Atualizado em ${dataBR(info.atualizadoEm)}` : "Sem dados publicados"}</span>${icone("seta")}</div>
            </div>
          </a>`;
        })
        .join("")}
    </div>
  </section>`
).join("");

const datas = Object.keys(meta.paineis || {}).map((k) => ultimoAno(k)?.atualizadoEm).filter(Boolean).sort();
if (datas.length) for (const id of ["estado-geral", "estado-cab"]) $(id).lastChild.textContent = `Atualizado em ${dataBR(datas.at(-1))}`;

$("busca").addEventListener("input", (ev) => {
  const t = semAcento(ev.target.value).split(/\s+/).filter(Boolean);
  let visiveis = 0;
  document.querySelectorAll(".card").forEach((c) => {
    const ok = t.every((x) => c.dataset.busca.includes(x));
    c.hidden = !ok;
    visiveis += ok;
  });
  document.querySelectorAll(".hub-secao").forEach((s) => (s.hidden = !s.querySelector(".card:not([hidden])")));
  $("sem-resultado").hidden = visiveis > 0;
});
