"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import { calcularIMC, classificarIMC, converterAlturaParaMetros, converterPesoParaKg, FATOR_LB_PARA_KG, formatarNumero, formatarPeso, UnidadeAltura, UnidadePeso } from "../lib/imc";

type Resultado = { imc: number; pesoKg: number; classificacao: ReturnType<typeof classificarIMC> };
type Registro = Resultado & { id: number; data: string; peso: number; unidadePeso: UnidadePeso };
const historicoKey = "imc-v3-historico";
const temaKey = "imc-v3-tema";

export default function Home() {
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("");
  const [unidadePeso, setUnidadePeso] = useState<UnidadePeso>("kg");
  const [altura, setAltura] = useState("");
  const [polegadas, setPolegadas] = useState("");
  const [unidadeAltura, setUnidadeAltura] = useState<UnidadeAltura>("cm");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");
  const [historico, setHistorico] = useState<Registro[]>([]);
  const [tema, setTema] = useState<"dark" | "light">("dark");
  const [sobreAberto, setSobreAberto] = useState(false);

  useEffect(() => {
    const carregarPreferencias = window.setTimeout(() => {
      const salvo = localStorage.getItem(historicoKey);
      const temaSalvo = localStorage.getItem(temaKey);
      if (salvo) {
        try { setHistorico(JSON.parse(salvo)); } catch { localStorage.removeItem(historicoKey); }
      }
      if (temaSalvo === "light") setTema("light");
    }, 0);

    return () => window.clearTimeout(carregarPreferencias);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem(temaKey, tema);
  }, [tema]);

  function alterarUnidadePeso(novaUnidade: UnidadePeso) {
    const valor = Number(peso);
    if (peso && Number.isFinite(valor) && valor > 0) setPeso(String(Number((novaUnidade === "lb" ? valor / FATOR_LB_PARA_KG : valor * FATOR_LB_PARA_KG).toFixed(1))));
    setUnidadePeso(novaUnidade);
  }

  function calcular(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const pesoDigitado = Number(peso);
    const alturaDigitada = Number(altura);
    const polegadasDigitadas = Number(polegadas || 0);
    const pesoKg = converterPesoParaKg(pesoDigitado, unidadePeso);
    const alturaMetros = converterAlturaParaMetros(alturaDigitada, unidadeAltura, polegadasDigitadas);
    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!peso || !Number.isFinite(pesoDigitado) || pesoKg < 1 || pesoKg > 500) return setErro(unidadePeso === "lb" ? "Informe um peso entre 2,2 lb e 1.102,3 lb." : "Informe um peso entre 1 e 500 kg.");
    if (!altura || !Number.isFinite(alturaDigitada) || alturaDigitada <= 0 || (unidadeAltura === "ftin" && (alturaDigitada > 8 || polegadasDigitadas < 0 || polegadasDigitadas >= 12))) return setErro("Informe uma altura válida.");
    const imc = calcularIMC(pesoKg, alturaMetros);
    setResultado({ imc, pesoKg, classificacao: classificarIMC(imc) });
    setErro("");
  }

  function salvarResultado() {
    if (!resultado) return;
    const registro: Registro = { ...resultado, id: Date.now(), data: new Date().toISOString(), peso: Number(peso), unidadePeso };
    const novoHistorico = [...historico, registro];
    setHistorico(novoHistorico);
    localStorage.setItem(historicoKey, JSON.stringify(novoHistorico));
  }

  function limparHistorico() {
    if (!window.confirm("Tem certeza que deseja apagar todo o histórico?")) return;
    setHistorico([]);
    localStorage.removeItem(historicoKey);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}><button className={styles.themeButton} type="button" onClick={() => setTema(tema === "dark" ? "light" : "dark")} aria-label="Alternar tema">{tema === "dark" ? "☀" : "☾"}</button><p className={styles.eyebrow}>IMC calculadora</p><h1>Calcule seu IMC e acompanhe sua evolução.</h1></header>
      <section className={styles.section}><h2>Seus dados</h2><form className={styles.form} onSubmit={calcular} noValidate>
        <label>Nome<input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Digite seu nome" /></label>
        <label>Peso<div className={styles.inline}><input type="number" min="1" step="any" value={peso} onChange={(event) => setPeso(event.target.value)} /><select value={unidadePeso} onChange={(event) => alterarUnidadePeso(event.target.value as UnidadePeso)}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
        <label>Altura<div className={styles.inline}><input type="number" min="0" step="any" value={altura} onChange={(event) => setAltura(event.target.value)} placeholder={unidadeAltura === "cm" ? "Ex.: 175" : "Pés"} />{unidadeAltura === "ftin" && <input type="number" min="0" max="11" value={polegadas} onChange={(event) => setPolegadas(event.target.value)} placeholder="Polegadas" />}<select value={unidadeAltura} onChange={(event) => setUnidadeAltura(event.target.value as UnidadeAltura)}><option value="cm">cm</option><option value="ftin">ft/in</option></select></div></label>
        {erro && <p className={styles.error} role="alert">{erro}</p>}<div className={styles.actions}><button className={styles.primary} type="submit">Calcular IMC</button><button type="button" onClick={() => setSobreAberto(true)}>O que é o IMC?</button></div>
      </form></section>
      {resultado && <section className={styles.section} aria-live="polite"><h2>Resultado</h2><div className={styles.result}><p>Olá, {nome.trim()}!</p><span>Seu IMC</span><strong>{formatarNumero(resultado.imc)}</strong><b>{resultado.classificacao.nome}</b><p>{resultado.classificacao.mensagem}</p></div><button className={styles.primary} type="button" onClick={salvarResultado}>Salvar resultado</button></section>}
      <section className={styles.section}><div className={styles.sectionHeading}><h2>Histórico</h2>{historico.length > 0 && <button type="button" onClick={limparHistorico}>Limpar histórico</button>}</div>{historico.length === 0 ? <p className={styles.muted}>Seu histórico de resultados aparecerá aqui.</p> : <ul className={styles.history}>{historico.slice().reverse().map((registro) => <li key={registro.id}><span>{new Date(registro.data).toLocaleDateString("pt-BR")}</span><b>{formatarNumero(registro.imc)}</b><span>{formatarPeso(registro.peso, registro.unidadePeso)}</span></li>)}</ul>}</section>
      {sobreAberto && <div className={styles.overlay} onClick={() => setSobreAberto(false)}><div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="sobre-titulo" onClick={(event) => event.stopPropagation()}><button className={styles.close} type="button" onClick={() => setSobreAberto(false)} aria-label="Fechar">×</button><h2 id="sobre-titulo">O que é o IMC?</h2><p>O Índice de Massa Corporal é uma referência simples que relaciona peso e altura.</p><p><strong>IMC = peso ÷ altura²</strong></p><p>Ele não mede diretamente composição corporal e não substitui uma avaliação profissional.</p></div></div>}
    </main>
  );
}
