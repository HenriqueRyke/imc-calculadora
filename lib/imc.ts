export type UnidadePeso = "kg" | "lb";
export type UnidadeAltura = "cm" | "ftin";

export const FATOR_LB_PARA_KG = 0.45359237;

export function converterPesoParaKg(peso: number, unidade: UnidadePeso) {
  return unidade === "lb" ? peso * FATOR_LB_PARA_KG : peso;
}

export function converterAlturaParaMetros(valor: number, unidade: UnidadeAltura, polegadas = 0) {
  if (unidade === "cm") return valor / 100;
  return (valor * 12 + polegadas) * 0.0254;
}

export function calcularIMC(pesoKg: number, alturaMetros: number) {
  return pesoKg / (alturaMetros * alturaMetros);
}

export type Classificacao = { nome: string; indice: number; mensagem: string };

const mensagemObesidade =
  "Seu IMC está na faixa de obesidade. Uma avaliação profissional pode considerar outros fatores importantes além do IMC.";

export function classificarIMC(imc: number): Classificacao {
  if (imc < 18.5) return { nome: "Abaixo do peso", indice: 0, mensagem: "Seu IMC está abaixo da faixa de referência para adultos. O resultado deve ser interpretado considerando outros aspectos da sua saúde." };
  if (imc < 25) return { nome: "Peso adequado", indice: 1, mensagem: "Seu IMC está dentro da faixa de referência para adultos." };
  if (imc < 30) return { nome: "Sobrepeso", indice: 2, mensagem: "Seu IMC está acima da faixa de referência. O IMC é apenas um indicador e não avalia sozinho a composição corporal." };
  if (imc < 35) return { nome: "Obesidade grau I", indice: 3, mensagem: mensagemObesidade };
  if (imc < 40) return { nome: "Obesidade grau II", indice: 4, mensagem: mensagemObesidade };
  return { nome: "Obesidade grau III", indice: 5, mensagem: mensagemObesidade };
}

export function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatarPeso(valor: number, unidade: UnidadePeso) {
  return `${valor.toLocaleString("pt-BR", { minimumFractionDigits: unidade === "lb" ? 1 : 0, maximumFractionDigits: 1 })} ${unidade}`;
}