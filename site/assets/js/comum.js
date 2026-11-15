// Biblioteca comum dos painéis de Transparência IFAM.

// ------------------------------------------------------------------ formatos
const fMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fNum = new Intl.NumberFormat("pt-BR");
const fPct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export const moeda = (v) => fMoeda.format(v || 0);
export const numero = (v) => fNum.format(v || 0);
export const pct = (v) => (Number.isFinite(v) ? fPct.format(v) : "—");
export function moedaCurta(v) {
  const a = Math.abs(v || 0);
  if (a >= 1e6) return `R$ ${(v / 1e6).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mi`;
  if (a >= 1e3) return `R$ ${(v / 1e3).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return moeda(v);
}
export const razao = (a, b) => (b ? a / b : NaN);
export function dataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}
export const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export const semAcento = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const soma = (lista, f) => lista.reduce((t, x) => t + (typeof f === "function" ? f(x) : x[f]) , 0);

// ------------------------------------------------------------------ ícones (traços no estilo Lucide)
const ICONES = {
  barras: '<path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-9"/>',
  predio: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10"/><path d="M8 7h4M8 11h4M8 15h4"/><path d="M2 21h20"/>',
  tabela: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 10v10"/>',
  livro: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5"/><path d="M19 17v4H6.5"/>',
  calendario: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  recibo: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  trofeu: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  baixar: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  planilha: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  seta: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  voltar: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  ordenar: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  sobe: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  desce: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  clique: '<path d="M9 9l5 12 1.8-5.2L21 14z"/><path d="M7.2 2.2 8 5.1M5.1 8 2.2 7.2M14 4.1 12 6.2M6.2 12l-2.1 2"/>',
  alerta: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  banco: '<path d="M3 21h18M5 21v-9M9 21v-9M15 21v-9M19 21v-9"/><path d="M2 10 12 3l10 7z"/>',
  estudante: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
};
export function icone(nome, rotulo) {
  const a11y = rotulo ? `role="img" aria-label="${esc(rotulo)}"` : 'aria-hidden="true"';
  return `<svg class="icone" viewBox="0 0 24 24" ${a11y}>${ICONES[nome] || ""}</svg>`;
}
export const MARCA_IF = `<svg viewBox="0 0 30 50" aria-hidden="true"><circle cx="4.5" cy="4.5" r="4.5" fill="#e3342f"/><g fill="#45b549"><rect x="10.5" y="0" width="9" height="9" rx="1.2"/><rect x="21" y="0" width="9" height="9" rx="1.2"/><rect x="0" y="10.25" width="9" height="9" rx="1.2"/><rect x="10.5" y="10.25" width="9" height="9" rx="1.2"/><rect x="0" y="20.5" width="9" height="9" rx="1.2"/><rect x="10.5" y="20.5" width="9" height="9" rx="1.2"/><rect x="21" y="20.5" width="9" height="9" rx="1.2"/><rect x="0" y="30.75" width="9" height="9" rx="1.2"/><rect x="10.5" y="30.75" width="9" height="9" rx="1.2"/><rect x="0" y="41" width="9" height="9" rx="1.2"/><rect x="10.5" y="41" width="9" height="9" rx="1.2"/></g></svg>`;

// ------------------------------------------------------------------ dados
const RAIZ = new URL("../../", import.meta.url); // site/
export async function carregarJSON(caminho) {
  const r = await fetch(new URL(caminho, RAIZ), { cache: "no-cache" });
  if (!r.ok) throw new Error(`Não foi possível carregar ${caminho} (${r.status}).`);
  return r.json();
}
export const urlRaiz = (caminho) => new URL(caminho, RAIZ).href;

// estado na URL (?ano=2026&campus=Coari#campi) para links compartilháveis
export function lerEstado(padrao) {
  const q = new URLSearchParams(location.search);
  const e = { ...padrao };
  for (const k of Object.keys(padrao)) if (q.has(k)) e[k] = q.get(k);
  return e;
}
export function gravarEstado(estado, padrao) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(estado)) if (v && v !== padrao[k]) q.set(k, v);
  const s = q.toString();
  history.replaceState(null, "", `${location.pathname}${s ? "?" + s : ""}${location.hash}`);
}

// ------------------------------------------------------------------ dica flutuante (hover e foco)
let tip;
export function iniciarDicas() {
  tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  document.body.append(tip);
  const mostrar = (alvo, x, y) => {
    tip.innerHTML = alvo.dataset.tip;
    tip.classList.add("visivel");
    const r = tip.getBoundingClientRect();
    const px = Math.min(Math.max(8, x + 14), innerWidth - r.width - 8);
    const py = y + 18 + r.height > innerHeight ? y - r.height - 12 : y + 18;
    tip.style.left = `${px}px`;
    tip.style.top = `${py}px`;
  };
  document.addEventListener("pointermove", (ev) => {
    const alvo = ev.target.closest?.("[data-tip]");
    if (!alvo || ev.pointerType === "touch") return tip.classList.remove("visivel");
    mostrar(alvo, ev.clientX, ev.clientY);
  });
  document.addEventListener("focusin", (ev) => {
    const alvo = ev.target.closest?.("[data-tip]");
    if (!alvo) return;
    const r = alvo.getBoundingClientRect();
    mostrar(alvo, r.left + r.width / 2, r.bottom - 8);
  });
  document.addEventListener("focusout", () => tip.classList.remove("visivel"));
  addEventListener("scroll", () => tip.classList.remove("visivel"), { passive: true });
}

// balões de ajuda dos indicadores
export function iniciarAjudas(raiz = document) {
  raiz.addEventListener("click", (ev) => {
    const b = ev.target.closest(".ajuda");
    document.querySelectorAll(".balao").forEach((x) => x.remove());
    document.querySelectorAll('.ajuda[aria-expanded="true"]').forEach((x) => x !== b && x.setAttribute("aria-expanded", "false"));
    if (!b) return;
    const aberto = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!aberto));
    if (aberto) return;
    const balao = document.createElement("div");
    balao.className = "balao";
    balao.id = "balao-ajuda";
    balao.textContent = b.dataset.ajuda;
    document.body.append(balao);
    b.setAttribute("aria-describedby", "balao-ajuda");
    const r = b.getBoundingClientRect();
    const w = balao.offsetWidth;
    balao.style.left = `${Math.min(Math.max(16, r.left + scrollX - 12), scrollX + innerWidth - w - 16)}px`;
    balao.style.top = `${r.bottom + scrollY + 8}px`;
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") document.querySelectorAll(".balao").forEach((x) => x.remove());
  });
}

// ------------------------------------------------------------------ componentes
export function indicadores(el, itens) {
  el.innerHTML = itens
    .map(
      (i) => `<div class="indicador">
        <div class="indicador__valor">${esc(i.valor)}</div>
        <div class="indicador__rotulo">${esc(i.rotulo)}${i.ajuda ? `<button type="button" class="ajuda" aria-expanded="false" aria-label="O que mede: ${esc(i.rotulo)}" data-ajuda="${esc(i.ajuda)}">${icone("info")}</button>` : ""}</div>
        ${i.nota ? `<div class="indicador__nota">${i.nota}</div>` : ""}
      </div>`
    )
    .join("");
}

/**
 * Barras horizontais com rótulo "valor · %".
 * itens: [{id, rotulo, valor, cor?, dica?}]; opts: {formatar, total, rotuloTotal, selecionado, aoClicar, base}
 */
export function barras(el, itens, opts = {}) {
  const formatar = opts.formatar || moeda;
  const total = opts.total ?? soma(itens, "valor");
  const max = opts.max ?? Math.max(...itens.map((i) => i.valor), 0);
  if (!itens.length || max <= 0) {
    el.innerHTML = vazio(opts.vazio);
    return;
  }
  const clicavel = typeof opts.aoClicar === "function";
  const tag = clicavel ? "button" : "div";
  el.innerHTML = `<div class="barras ${opts.selecionado ? "tem-selecao" : ""}">
    ${itens
      .map((i) => {
        const largura = Math.max(0, (i.valor / max) * 100);
        const parte = opts.semPct ? "" : ` · <small>${pct(razao(i.valor, opts.base ?? total))}</small>`;
        const sel = opts.selecionado && opts.selecionado === i.id;
        const dica = i.dica || `<b>${esc(i.rotulo)}</b><br>${formatar(i.valor)}${opts.semPct ? "" : ` · ${pct(razao(i.valor, opts.base ?? total))}`}`;
        return `<${tag} class="barra ${sel ? "selecionada" : ""}" ${clicavel ? `type="button" data-id="${esc(i.id)}" aria-pressed="${sel}"` : ""} data-tip="${esc(dica)}">
          <span class="barra__rotulo" title="${esc(i.rotulo)}">${esc(i.rotulo)}</span>
          <span class="barra__trilho"><i style="width:${largura}%;${i.cor ? `--cor:${i.cor}` : ""}"></i></span>
          <span class="barra__valor">${i.valorTexto ?? formatar(i.valor)}${parte}</span>
        </${tag}>`;
      })
      .join("")}
    ${opts.rotuloTotal === false ? "" : `<div class="barras__total"><b>Total</b><span>${esc(opts.rotuloTotal || "")}</span><strong>${formatar(total)}</strong></div>`}
  </div>`;
  if (clicavel) el.querySelectorAll("button.barra").forEach((b) => b.addEventListener("click", () => opts.aoClicar(b.dataset.id)));
}

/** Colunas verticais (ex.: meses). itens: [{id, rotulo, valor, rotuloLongo}] */
export function colunas(el, itens, opts = {}) {
  const formatar = opts.formatar || moeda;
  const max = Math.max(...itens.map((i) => i.valor), 0);
  if (!itens.length || max <= 0) {
    el.innerHTML = vazio(opts.vazio);
    return;
  }
  el.innerHTML = `<div class="colunas ${opts.selecionado ? "tem-selecao" : ""} ${itens.length <= 4 ? "poucas" : ""}" style="--n:${itens.length}">
    ${itens
      .map((i) => {
        const sel = opts.selecionado && opts.selecionado === i.id;
        return `<button type="button" class="coluna ${sel ? "selecionada" : ""}" style="--h:${(i.valor / max) * 100}%" data-id="${esc(i.id)}" aria-pressed="${sel}"
          aria-label="${esc(i.rotuloLongo || i.rotulo)}: ${formatar(i.valor)}" data-tip="<b>${esc(i.rotuloLongo || i.rotulo)}</b><br>${formatar(i.valor)}${i.extra ? `<br>${esc(i.extra)}` : ""}">
          <b>${opts.curto ? opts.curto(i.valor) : moedaCurta(i.valor)}</b><i></i></button>`;
      })
      .join("")}
  </div>
  <div class="colunas__eixo" style="--n:${itens.length}" aria-hidden="true">${itens.map((i) => `<span>${esc(i.rotulo)}</span>`).join("")}</div>`;
  if (opts.aoClicar) el.querySelectorAll(".coluna").forEach((b) => b.addEventListener("click", () => opts.aoClicar(b.dataset.id)));
}

export function vazio(texto) {
  return `<div class="vazio"><strong>Nada para mostrar neste recorte</strong>${esc(texto || "Os filtros escolhidos não têm registros. Use “Limpar filtros” para voltar ao total.")}</div>`;
}

// ------------------------------------------------------------------ tabela com busca, ordenação, paginação e download
/**
 * colunas: [{chave, titulo, num?, formatar?, html?, csv?, classe?}]
 */
export function tabela(el, { colunas: cols, linhas, porPagina = 25, nomeArquivo = "dados", buscaDica = "Buscar no recorte…", ordem, totais, legenda }) {
  let busca = "";
  let pagina = 0;
  let ord = ordem || null; // {chave, dir}
  const id = `t${Math.random().toString(36).slice(2, 8)}`;

  el.innerHTML = `
    <div class="tabela-topo">
      <label class="visualmente-oculto" for="${id}-busca">Buscar na tabela</label>
      <input type="search" id="${id}-busca" placeholder="${esc(buscaDica)}" autocomplete="off">
      <span class="contagem" aria-live="polite"></span>
      <button type="button" class="botao botao--verde">${icone("planilha")} Baixar planilha</button>
    </div>
    <div class="tabela-rolagem" tabindex="0" role="region" aria-label="${esc(legenda || "Tabela de registros")}"><table>
      <caption class="visualmente-oculto">${esc(legenda || "")}</caption>
      <thead><tr>${cols
        .map((c) => `<th scope="col" class="${c.num ? "num" : ""}" data-chave="${c.chave}"><button type="button">${esc(c.titulo)}${icone("ordenar")}</button></th>`)
        .join("")}</tr></thead>
      <tbody></tbody>${totais ? "<tfoot></tfoot>" : ""}</table></div>
    <div class="paginacao"><span></span><div>
      <button type="button" class="botao" data-p="-1">Anterior</button>
      <button type="button" class="botao" data-p="1">Próxima</button></div></div>`;

  const corpo = el.querySelector("tbody");
  const cont = el.querySelector(".contagem");
  const pag = el.querySelector(".paginacao span");
  const [ant, prox] = el.querySelectorAll(".paginacao .botao");
  const textoBusca = linhas.map((l) => semAcento(cols.map((c) => (c.busca ? c.busca(l) : c.formatar ? c.formatar(l[c.chave], l) : l[c.chave])).join(" ")));

  function filtradas() {
    const termos = semAcento(busca).split(/\s+/).filter(Boolean);
    let idx = linhas.map((_, i) => i);
    if (termos.length) idx = idx.filter((i) => termos.every((t) => textoBusca[i].includes(t)));
    if (ord) {
      const c = cols.find((x) => x.chave === ord.chave);
      const valor = (l) => (c.ordenar ? c.ordenar(l) : l[ord.chave]);
      idx.sort((a, b) => {
        const va = valor(linhas[a]), vb = valor(linhas[b]);
        const r = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb), "pt-BR");
        return ord.dir === "asc" ? r : -r;
      });
    }
    return idx;
  }

  function desenhar() {
    const idx = filtradas();
    const paginas = Math.max(1, Math.ceil(idx.length / porPagina));
    pagina = Math.min(pagina, paginas - 1);
    const fatia = idx.slice(pagina * porPagina, (pagina + 1) * porPagina);
    corpo.innerHTML = fatia.length
      ? fatia
          .map((i) => {
            const l = linhas[i];
            return `<tr>${cols
              .map((c) => {
                const v = l[c.chave];
                const conteudo = c.html ? c.html(v, l) : esc(c.formatar ? c.formatar(v, l) : v);
                return `<td class="${c.num ? "num" : ""} ${c.classe || ""}">${conteudo}</td>`;
              })
              .join("")}</tr>`;
          })
          .join("")
      : `<tr><td colspan="${cols.length}">${vazio(busca ? `Nenhum registro contém “${busca}”.` : "")}</td></tr>`;
    if (totais) {
      const sel = idx.map((i) => linhas[i]);
      el.querySelector("tfoot").innerHTML = `<tr>${cols
        .map((c, n) => `<td class="${c.num ? "num" : ""}">${n === 0 ? "Total do recorte" : c.somar ? esc((c.formatar || moeda)(soma(sel, c.chave))) : ""}</td>`)
        .join("")}</tr>`;
    }
    cont.innerHTML = `<b>${numero(idx.length)}</b> de ${numero(linhas.length)} registros`;
    pag.textContent = idx.length ? `Página ${pagina + 1} de ${paginas} · ${numero(pagina * porPagina + 1)}–${numero(Math.min(idx.length, (pagina + 1) * porPagina))}` : "";
    ant.disabled = pagina === 0;
    prox.disabled = pagina >= paginas - 1;
    el.querySelectorAll("th").forEach((th) => {
      if (ord && th.dataset.chave === ord.chave) th.setAttribute("aria-sort", ord.dir === "asc" ? "ascending" : "descending");
      else th.removeAttribute("aria-sort");
    });
  }

  let t;
  el.querySelector("input").addEventListener("input", (ev) => {
    clearTimeout(t);
    t = setTimeout(() => {
      busca = ev.target.value.trim();
      pagina = 0;
      desenhar();
    }, 150);
  });
  el.querySelectorAll("th button").forEach((b) =>
    b.addEventListener("click", () => {
      const chave = b.parentElement.dataset.chave;
      const c = cols.find((x) => x.chave === chave);
      ord = ord && ord.chave === chave ? { chave, dir: ord.dir === "asc" ? "desc" : "asc" } : { chave, dir: c.num ? "desc" : "asc" };
      desenhar();
    })
  );
  ant.addEventListener("click", () => { pagina--; desenhar(); el.scrollIntoView({ block: "nearest" }); });
  prox.addEventListener("click", () => { pagina++; desenhar(); el.scrollIntoView({ block: "nearest" }); });
  el.querySelector(".tabela-topo .botao").addEventListener("click", () => {
    const idx = filtradas();
    baixarCSV(nomeArquivo, cols, idx.map((i) => linhas[i]));
  });
  el.addEventListener("click", (ev) => {
    const b = ev.target.closest(".mais");
    if (!b) return;
    const o = b.previousElementSibling;
    const aberta = o.classList.toggle("aberta");
    b.textContent = aberta ? "ver menos" : "ver mais";
    b.setAttribute("aria-expanded", String(aberta));
  });
  desenhar();
}

export function baixarCSV(nome, cols, linhas) {
  const cel = (v) => {
    const s = String(v ?? "");
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const valor = (c, l) => {
    if (c.csv) return c.csv(l[c.chave], l);
    const v = l[c.chave];
    if (typeof v === "number") return v.toLocaleString("pt-BR", { minimumFractionDigits: c.inteiro ? 0 : 2, maximumFractionDigits: c.inteiro ? 0 : 2, useGrouping: false });
    return c.formatar ? c.formatar(v, l) : v;
  };
  const csv = [cols.map((c) => cel(c.titulo)).join(";"), ...linhas.map((l) => cols.map((c) => cel(valor(c, l))).join(";"))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${nome}.csv`;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

// ------------------------------------------------------------------ abas
export function abas(el, aoTrocar) {
  const botoes = [...el.querySelectorAll('[role="tab"]')];
  const bordas = () => {
    el.classList.toggle("mais-esquerda", el.scrollLeft > 4);
    el.classList.toggle("mais-direita", el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  el.addEventListener("scroll", bordas, { passive: true });
  addEventListener("resize", bordas);
  const ativar = (b, foco) => {
    botoes.forEach((x) => {
      const sel = x === b;
      x.setAttribute("aria-selected", String(sel));
      x.tabIndex = sel ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !sel;
    });
    if (foco) b.focus({ preventScroll: true });
    const alvo = b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, alvo), behavior: foco ? "smooth" : "auto" });
    bordas();
    history.replaceState(null, "", `${location.pathname}${location.search}#${b.dataset.aba}`);
    aoTrocar?.(b.dataset.aba);
  };
  botoes.forEach((b, i) => {
    b.addEventListener("click", () => ativar(b));
    b.addEventListener("keydown", (ev) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
      if (d) ativar(botoes[(i + d + botoes.length) % botoes.length], true);
      if (ev.key === "Home") ativar(botoes[0], true);
      if (ev.key === "End") ativar(botoes.at(-1), true);
    });
  });
  const inicial = botoes.find((b) => `#${b.dataset.aba}` === location.hash) || botoes[0];
  ativar(inicial);
}

export function preencherSelect(sel, opcoes, valor, rotuloTodos) {
  sel.innerHTML = (rotuloTodos ? `<option value="">${esc(rotuloTodos)}</option>` : "") + opcoes.map((o) => `<option value="${esc(o.valor)}">${esc(o.rotulo)}</option>`).join("");
  sel.value = opcoes.some((o) => String(o.valor) === String(valor)) ? valor : rotuloTodos ? "" : opcoes[0]?.valor ?? "";
  sel.classList.toggle("ativo", !!rotuloTodos && !!sel.value);
}

export function rodape(el, extra = "") {
  el.innerHTML = `<div class="conteiner">
    <div class="rodape__marcas">${MARCA_IF}<span>Transparência IFAM<small>Instituto Federal do Amazonas</small></span></div>
    <p>Dados do Tesouro Gerencial (SIAFI).</p>
    ${extra}
  </div>`;
}

export function erroCarga(el, e) {
  el.innerHTML = `<div class="resumo resumo--alerta erro-carga" role="alert"><strong>Não foi possível carregar os dados.</strong> ${esc(e.message)} Tente recarregar a página; se o problema continuar, avise a equipe responsável pelos dados.</div>`;
}
