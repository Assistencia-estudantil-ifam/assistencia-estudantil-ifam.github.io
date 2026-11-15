#!/usr/bin/env python3
"""
Processa as planilhas exportadas do Tesouro Gerencial e gera os arquivos JSON
que alimentam o site de transparência (site/data/).

Uso:
    python pipeline/processar.py --entrada dados --saida site/data

As planilhas são reconhecidas pelas abas, não pelo nome do arquivo:
  - Assistência e Merenda Escolar: abas "LOA 2994 00PI" e "Assistência e Merenda Escolar"
  - Pagamento de Bolsas:           aba  "Painel_Pagamentos"

Se a mesma planilha aparecer mais de uma vez (ex.: duas versões enviadas), vale a
mais recente. O CPF completo nunca é gravado: só sai o formato ***.123.456-**.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import pandas as pd

FUSO = dt.timezone(dt.timedelta(hours=-4))  # America/Manaus (sem horário de verão)


class ErroPlanilha(Exception):
    """Erro com mensagem pronta para quem atualiza os dados."""


# --------------------------------------------------------------------------- util

def sem_acento(txt: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", str(txt)) if unicodedata.category(c) != "Mn")


CAMPI = {
    # chave normalizada -> nome de exibição
    "HUMAITA": "Humaitá",
    "ITACOATIARA": "Itacoatiara",
    "MANACAPURU": "Manacapuru",
    "TEFE": "Tefé",
    "EIRUNEPE": "Eirunepé",
    "IRANDUBA": "Iranduba",
    "BOCA DO ACRE": "Boca do Acre",
    "SAO GABRIEL DA CACHOEIRA": "São Gabriel da Cachoeira",
    "MANAUS ZONA LESTE": "Manaus Zona Leste",
    "MANAUS CENTRO": "Manaus Centro",
    "MANAUS DISTRITO INDUSTRIAL": "Manaus Distrito Industrial",
    "COARI": "Coari",
    "PARINTINS": "Parintins",
    "TABATINGA": "Tabatinga",
    "PRESIDENTE FIGUEIREDO": "Presidente Figueiredo",
    "MAUES": "Maués",
    "LABREA": "Lábrea",
    "REITORIA": "Reitoria",
}


def campus(nome) -> str:
    """'IFAM - CAMPUS MANAUS CENTRO' / 'Campus Manaus Centro ' -> 'Manaus Centro'."""
    if nome is None or (isinstance(nome, float) and math.isnan(nome)):
        return "Não informado"
    n = sem_acento(nome).upper().strip()
    if n.startswith("INST.FED") or "REITORIA" in n:
        return "Reitoria"
    n = re.sub(r"^IFAM\s*-\s*", "", n)
    n = re.sub(r"^CAMPUS\s+(AVANCADO\s+)?", "", n).strip()
    return CAMPI.get(n, str(nome).strip().title())


ACOES = {
    "2994": "Assistência ao estudante",
    "21IV": "Alimentação do estudante",
    "21IH": "Pessoas com deficiência",
    "00PI": "Merenda escolar (PNAE)",
}


_ACENTOS = {
    "pais": "país", "tecnico": "técnico", "alimentacao": "alimentação", "assistencia": "assistência",
    "doacao": "doação", "servicos": "serviços", "servico": "serviço", "generos": "gêneros",
    "combustiveis": "combustíveis", "auxilios": "auxílios", "auxilio": "auxílio", "distribuicao": "distribuição",
    "manutencao": "manutenção", "veiculos": "veículos", "administracao": "administração", "gas": "gás",
    "locacao": "locação", "mao-de-obra": "mão de obra", "aplicacoes": "aplicações", "juridica": "jurídica",
    "educacao": "educação", "basica": "básica", "medio": "médio", "deficiencia": "deficiência", "gratuita": "gratuita",
    "conserv.": "conserv.", "desenv.": "desenv.", "didatico": "didático", "pedagogico": "pedagógico",
}


def descricao(v) -> str:
    """'BOLSAS DE ESTUDO NO PAIS' -> 'Bolsas de estudo no país'."""
    t = texto(v)
    if not t or not t.isupper():
        return t
    palavras = [_ACENTOS.get(p, p) for p in t.lower().split()]
    frase = " ".join(palavras)
    return frase[:1].upper() + frase[1:]


def num(v) -> float:
    if v is None:
        return 0.0
    try:
        f = float(v)
    except (TypeError, ValueError):
        txt = str(v).strip().replace(".", "").replace(",", ".")
        try:
            f = float(txt)
        except ValueError:
            return 0.0
    return 0.0 if math.isnan(f) else round(f, 2)


def texto(v) -> str:
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return ""
    t = str(v).strip()
    return "" if t in ("'-8", "'-9", "-8", "-9", "nan", "NaN") else t


def so_digitos(v) -> str:
    return re.sub(r"\D", "", texto(v))


def mascarar_cpf(cpf) -> str:
    d = so_digitos(cpf)
    if len(d) == 11:
        return f"***.{d[3:6]}.{d[6:9]}-**"
    return ""


_CPF_EM_TEXTO = re.compile(r"(?<![\d.])(\d{3})[.\s]?(\d{3})[.\s]?(\d{3})\s?[-–]?\s?(\d{2})(?![\d/])")


def limpar_texto(v) -> str:
    """Mascara CPFs escritos dentro de textos livres (observações, descrições)."""
    t = texto(v)
    return _CPF_EM_TEXTO.sub(lambda m: f"***.{m.group(2)}.{m.group(3)}-**", t) if t else t


def documento_publico(doc) -> str:
    """CPF vira ***.123.456-**; CNPJ e códigos de UG aparecem completos."""
    d = so_digitos(doc)
    if len(d) == 11:
        return mascarar_cpf(d)
    if len(d) == 14:
        return f"{d[:2]}.{d[2:5]}.{d[5:8]}/{d[8:12]}-{d[12:]}"
    if len(d) == 6:
        return f"UG {d}"  # unidade gestora (o próprio campus como favorecido)
    return texto(doc)


def exigir_colunas(df: pd.DataFrame, colunas: list[str], aba: str, arquivo: Path) -> None:
    faltando = [c for c in colunas if c not in df.columns]
    if faltando:
        raise ErroPlanilha(
            f'A aba "{aba}" do arquivo {arquivo.name} não tem as colunas: '
            + ", ".join(f'"{c}"' for c in faltando)
            + ". Confira se a exportação do Tesouro Gerencial usou o mesmo layout de sempre."
        )


def data_do_arquivo(caminho: Path) -> float:
    """Data do último commit do arquivo (no GitHub Actions) ou data de modificação."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%ct", "--", str(caminho)],
            capture_output=True, text=True, check=True, cwd=caminho.parent,
        ).stdout.strip()
        if out:
            return float(out)
    except Exception:
        pass
    return caminho.stat().st_mtime


# ------------------------------------------------------------- identificação

def identificar(arquivo: Path) -> str | None:
    try:
        abas = pd.ExcelFile(arquivo, engine="openpyxl").sheet_names
    except Exception as e:  # arquivo corrompido ou não é Excel
        raise ErroPlanilha(f"Não consegui abrir {arquivo.name}: {e}") from e
    norm = {a.strip() for a in abas}
    if "Painel_Pagamentos" in norm:
        return "bolsas"
    if "LOA 2994 00PI" in norm and "Assistência e Merenda Escolar" in norm:
        return "assistencia"
    return None


def aba(xls: dict[str, pd.DataFrame], nome: str, arquivo: Path) -> pd.DataFrame:
    for k, v in xls.items():
        if k.strip() == nome:
            return v
    raise ErroPlanilha(f'O arquivo {arquivo.name} não tem a aba "{nome}".')


# ------------------------------------------------------- Assistência e Merenda

def processar_assistencia(arquivo: Path) -> tuple[int, dict]:
    xls = pd.read_excel(arquivo, sheet_name=None, engine="openpyxl")

    # Exercício: maior ano presente nas colunas de LOA histórica.
    hist = aba(xls, "LOA 24-25 -2994", arquivo)
    anos_hist = sorted(int(m.group(1)) for c in hist.columns if (m := re.search(r"(20\d\d)\s*$", str(c))))
    if not anos_hist:
        raise ErroPlanilha('A aba "LOA 24-25 -2994" precisa ter colunas no formato "LOA 2994 - 2026".')
    exercicio = anos_hist[-1]

    # ---- Execução por campus e ação
    ex = aba(xls, "LOA 2994 00PI", arquivo)
    col_loa = next((c for c in ex.columns if str(c).startswith("LOA ")), None)
    exigir_colunas(ex, ["UG Nome", "Ação Governo", "Plano Interno", "PROVISAO RECEBIDA", "CRÉDITO DISPONIVEL",
                        "DESPESAS PRE-EMPENHADAS", "DESPESAS EMPENHADAS", "SALDO DE EMPENHO",
                        "DESPESAS LIQUIDADAS A PAGAR", "DESPESAS LIQUIDADAS", "DESPESAS PAGAS",
                        "CRÉDITO A RECEBER"], "LOA 2994 00PI", arquivo)
    if col_loa is None:
        raise ErroPlanilha('A aba "LOA 2994 00PI" precisa ter a coluna de LOA (ex.: "LOA 2025").')
    execucao = []
    for _, r in ex.iterrows():
        acao = texto(r["Ação Governo"])
        if not acao:
            continue
        execucao.append({
            "campus": campus(r["UG Nome"]),
            "acao": acao,
            "pi": texto(r["Plano Interno"]).strip("-"),
            "loa": num(r[col_loa]),
            "fundoJogos": num(r.get("Execução Fundo/Jogos IF")),
            "descentralizado": num(r["PROVISAO RECEBIDA"]),
            "disponivel": num(r["CRÉDITO DISPONIVEL"]),
            "preEmpenhado": num(r["DESPESAS PRE-EMPENHADAS"]),
            "empenhado": num(r["DESPESAS EMPENHADAS"]),
            "saldoEmpenho": num(r["SALDO DE EMPENHO"]),
            "liquidadoAPagar": num(r["DESPESAS LIQUIDADAS A PAGAR"]),
            "liquidado": num(r["DESPESAS LIQUIDADAS"]),
            "pago": num(r["DESPESAS PAGAS"]),
            "aReceber": num(r["CRÉDITO A RECEBER"]),
        })

    # ---- LOA de cada ano (três ações com série histórica)
    def serie(nome_aba: str, acao: str) -> dict:
        df = aba(xls, nome_aba, arquivo)
        exigir_colunas(df, ["UG Nome"], nome_aba, arquivo)
        cols = [(int(m.group(1)), c) for c in df.columns if (m := re.search(r"(20\d\d)\s*$", str(c)))]
        cols.sort()
        linhas = []
        for _, r in df.iterrows():
            if not texto(r["UG Nome"]) or "TOTAL" in sem_acento(r["UG Nome"]).upper():
                continue
            linhas.append({"campus": campus(r["UG Nome"]), "valores": [num(r[c]) for _, c in cols]})
        return {"acao": acao, "anos": [a for a, _ in cols], "campi": linhas}

    historico = [
        serie("LOA 24-25 -2994", "2994"),
        serie("PCD 24-25", "21IH"),
        serie("LOA MERENDA ESCOLAR", "00PI"),
    ]

    # ---- Execução detalhada por nota de empenho e natureza de despesa
    det = aba(xls, "Assistência e Merenda Escolar", arquivo)
    exigir_colunas(det, ["UG Nome", "Ação Governo", "Pi - Descrição", "ND Cód", "ND detalhada - Descrição",
                         "Natureza Despesa Detalhada", "NE CCor", "NE CCor - Favorecido", "Favorecido",
                         "CREDITO DISPONIVEL", "DESPESAS EMPENHADAS (CONTROLE EMPENHO)",
                         "DESPESAS EMPENHADAS A LIQUIDAR (CONTROLE EMP)", "DESPESAS LIQUIDADAS (CONTROLE EMPENHO)",
                         "DESPESAS LIQUIDADAS A PAGAR(CONTROLE EMPENHO)", "DESPESAS PAGAS (CONTROLE EMPENHO)"],
                   "Assistência e Merenda Escolar", arquivo)
    detalhe = []
    for _, r in det.iterrows():
        valores = {
            "disponivel": num(r["CREDITO DISPONIVEL"]),
            "empenhado": num(r["DESPESAS EMPENHADAS (CONTROLE EMPENHO)"]),
            "aLiquidar": num(r["DESPESAS EMPENHADAS A LIQUIDAR (CONTROLE EMP)"]),
            "liquidado": num(r["DESPESAS LIQUIDADAS (CONTROLE EMPENHO)"]),
            "liquidadoAPagar": num(r["DESPESAS LIQUIDADAS A PAGAR(CONTROLE EMPENHO)"]),
            "pago": num(r["DESPESAS PAGAS (CONTROLE EMPENHO)"]),
        }
        if not any(valores.values()):
            continue
        nd_desc = texto(r["ND detalhada - Descrição"])
        if not nd_desc or nd_desc.upper() == "NAO SE APLICA":
            nd_desc = texto(r["Natureza Despesa Detalhada"])
        ne = texto(r["NE CCor"])
        detalhe.append({
            "campus": campus(r["UG Nome"]),
            "acao": texto(r["Ação Governo"]),
            "pi": limpar_texto(r["Pi - Descrição"]),
            "nd": texto(r["ND Cód"]),
            "ndDescricao": descricao(nd_desc),
            "ne": ne[-12:] if len(ne) > 12 else ne,  # 2026NE000042
            "neCompleta": ne,
            "favorecido": limpar_texto(r["Favorecido"]) if texto(r["Favorecido"]).upper() != "NAO SE APLICA" else "",
            "documento": documento_publico(r["NE CCor - Favorecido"]),
            **valores,
        })

    # ---- Fundo da Reitoria e Jogos dos IFs
    fj = aba(xls, "Fundo e Jogos", arquivo)
    exigir_colunas(fj, ["UG Executora", "Fundo", "Fundo Execução", "Jogos IF"], "Fundo e Jogos", arquivo)
    col_jifs = next((c for c in fj.columns if sem_acento(c).upper().startswith("JIF")), None)
    if col_jifs is None:
        raise ErroPlanilha('A aba "Fundo e Jogos" precisa da coluna "JIF’s" (orçamento dos Jogos IF).')
    fundo_jogos = []
    for _, r in fj.iterrows():
        if not texto(r["UG Executora"]):
            continue
        fundo_jogos.append({
            "campus": campus(r["UG Executora"]),
            "fundo": num(r["Fundo"]),
            "jogos": num(r[col_jifs]),
            "fundoExecutado": num(r["Fundo Execução"]),
            "jogosExecutado": num(r["Jogos IF"]),
        })

    return exercicio, {
        "exercicio": exercicio,
        "acoes": ACOES,
        "execucao": execucao,
        "historico": historico,
        "detalhe": detalhe,
        "fundoJogos": fundo_jogos,
    }


# ----------------------------------------------------------- Pagamento de bolsas

ACAO_BOLSA = [
    ("2994", "2994", "Assistência ao estudante"),
    ("21IV", "21IV", "Alimentação do estudante"),
    ("REGULARIZ", "DT", "Regularização sem ação identificada"),
]


def processar_bolsas(arquivo: Path) -> tuple[int, dict]:
    df = pd.read_excel(arquivo, sheet_name="Painel_Pagamentos", engine="openpyxl")
    exigir_colunas(df, ["UG Pagadora Nome", "Data Pagamento", "Aluno Painel", "CPF Painel",
                        "CPF Protegido Painel", "OB Painel", "Documento Hábil Painel",
                        "Observação Painel", "Valor Painel", "Ação Governo Painel"], "Painel_Pagamentos", arquivo)

    datas = pd.to_datetime(df["Data Pagamento"], errors="coerce", dayfirst=True)
    if datas.notna().sum() == 0:
        raise ErroPlanilha('A coluna "Data Pagamento" da aba "Painel_Pagamentos" está vazia ou sem datas válidas.')
    exercicio = int(datas.dt.year.mode().iloc[0])

    campi: list[str] = []
    observacoes: list[str] = []
    idx_obs: dict[str, int] = {}
    linhas = []
    for (_, r), data in zip(df.iterrows(), datas):
        valor = num(r["Valor Painel"])
        if valor == 0:
            continue
        c = campus(r["UG Pagadora Nome"])
        if c not in campi:
            campi.append(c)
        acao_txt = sem_acento(texto(r["Ação Governo Painel"])).upper()
        acao = next((cod for chave, cod, _ in ACAO_BOLSA if acao_txt.startswith(chave)), "DT")
        obs = limpar_texto(r["Observação Painel"])
        if obs not in idx_obs:
            idx_obs[obs] = len(observacoes)
            observacoes.append(obs)
        cpf = mascarar_cpf(r["CPF Painel"]) or texto(r["CPF Protegido Painel"])
        if cpf and not re.fullmatch(r"\*{3}\.\d{3}\.\d{3}-\*{2}", cpf):
            cpf = ""  # nunca publicar algo que não esteja mascarado
        ob = texto(r["OB Painel"])
        dh = texto(r["Documento Hábil Painel"])
        linhas.append([
            campi.index(c),
            acao,
            data.strftime("%Y-%m-%d") if not pd.isna(data) else "",
            limpar_texto(r["Aluno Painel"]).upper(),
            cpf,
            ob[-12:] if len(ob) > 12 else ob,      # 2026OB000122
            dh[-12:] if len(dh) > 12 else dh,      # 2026RP000004
            idx_obs[obs],
            valor,
        ])
    linhas.sort(key=lambda l: (l[2], l[0], l[3]), reverse=True)
    return exercicio, {
        "exercicio": exercicio,
        "acoes": {cod: nome for _, cod, nome in ACAO_BOLSA},
        "campi": campi,
        "observacoes": observacoes,
        "colunas": ["campus", "acao", "data", "aluno", "cpf", "ob", "documento", "observacao", "valor"],
        "pagamentos": linhas,
    }


# ---------------------------------------------------------------------- main

def resumo(tipo: str, dados: dict) -> dict:
    """Números pequenos para os cartões da página inicial (sem carregar o painel inteiro)."""
    if tipo == "assistencia":
        ex = dados["execucao"]
        etapas = {k: round(sum(r[k] for r in ex), 2) for k in ("loa", "descentralizado", "empenhado", "liquidado", "pago")}
        return {"etapas": etapas}
    if tipo == "fundojogos":
        fj = dados["fundoJogos"]
        t = {k: round(sum(r[k] for r in fj), 2) for k in ("fundo", "fundoExecutado", "jogos", "jogosExecutado")}
        return {"totais": t}
    pags = dados["pagamentos"]
    meses = [0.0] * 12
    for p in pags:
        if p[2]:
            meses[int(p[2][5:7]) - 1] += p[8]
    ultimo = max((i for i, v in enumerate(meses) if v), default=-1) + 1
    return {
        "totalPago": round(sum(p[8] for p in pags), 2),
        "estudantes": len({(p[3], p[4]) for p in pags}),
        "meses": [round(v, 2) for v in meses[:ultimo]],
        "ate": max((p[2] for p in pags if p[2]), default=""),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--entrada", default="dados", help="pasta com as planilhas .xlsx (procura em subpastas)")
    ap.add_argument("--saida", default="site/data", help="pasta onde os JSON serão gravados")
    args = ap.parse_args()

    entrada, saida = Path(args.entrada), Path(args.saida)
    saida.mkdir(parents=True, exist_ok=True)
    arquivos = sorted(p for p in entrada.rglob("*.xlsx") if not p.name.startswith("~$"))
    if not arquivos:
        print(f"Nenhuma planilha .xlsx encontrada em {entrada}/", file=sys.stderr)
        return 1

    # Agrupa por tipo; a mais recente de cada tipo e exercício vence.
    por_tipo: dict[str, list[Path]] = {}
    for a in arquivos:
        tipo = identificar(a)
        if tipo is None:
            print(f"Aviso: {a.name} não é uma planilha conhecida; ignorada.")
            continue
        por_tipo.setdefault(tipo, []).append(a)

    meta_path = saida / "meta.json"
    meta = json.loads(meta_path.read_text("utf-8")) if meta_path.exists() else {"paineis": {}}
    agora = dt.datetime.now(FUSO)
    processadores = {"assistencia": processar_assistencia, "bolsas": processar_bolsas}

    def gravar(nome: str, exercicio: int, dados: dict, arq: Path) -> None:
        dados["atualizadoEm"] = agora.isoformat(timespec="minutes")
        dados["arquivoOrigem"] = arq.name
        destino = saida / f"{nome}-{exercicio}.json"
        conteudo = json.dumps(dados, ensure_ascii=False, separators=(",", ":"))
        vazado = re.search(r"(?<![\d.])\d{3}\.\d{3}\.\d{3}-\d{2}(?![\d/])|(?<![\d.])\d{11}(?![\d/])", conteudo)
        if vazado:
            raise ErroPlanilha(f"Encontrei um possível CPF sem máscara ({vazado.group(0)[:3]}...) em {arq.name}; nada foi publicado.")
        destino.write_text(conteudo, "utf-8")
        info = meta["paineis"].setdefault(nome, {"anos": {}})
        info["anos"][str(exercicio)] = {"atualizadoEm": dados["atualizadoEm"], "arquivo": destino.name, "resumo": resumo(nome, dados)}
        print(f"OK  {arq.name} -> {destino} ({destino.stat().st_size // 1024} KB)")

    for tipo, lista in por_tipo.items():
        lista.sort(key=data_do_arquivo, reverse=True)
        vistos: set[int] = set()
        for arq in lista:
            exercicio, dados = processadores[tipo](arq)
            if exercicio in vistos:
                print(f"Aviso: {arq.name} é uma versão mais antiga de {tipo} {exercicio}; ignorada.")
                continue
            vistos.add(exercicio)
            paineis = [(tipo, dados)]
            if tipo == "assistencia":
                # O Fundo da Reitoria e os Jogos IF vêm da mesma planilha, mas têm painel próprio.
                paineis.append(("fundojogos", {"exercicio": exercicio, "fundoJogos": dados.pop("fundoJogos")}))
            for nome, conteudo_painel in paineis:
                gravar(nome, exercicio, conteudo_painel, arq)

    meta["geradoEm"] = agora.isoformat(timespec="minutes")
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), "utf-8")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ErroPlanilha as e:
        print(f"ERRO: {e}", file=sys.stderr)
        sys.exit(2)
