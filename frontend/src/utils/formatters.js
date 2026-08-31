/**
 * Funções utilitárias de formatação padronizadas para a plataforma Seazone OS.
 * Centraliza a formatação para evitar duplicação de código no front-end.
 */

/**
 * Formata um valor numérico em Reais (BRL).
 * @param {number} val - Valor numérico
 * @param {number} [maxFractionDigits=0] - Casas decimais (padrão 0)
 * @returns {string} Valor formatado (ex: R$ 1.500)
 */
export function formatBRL(val, maxFractionDigits = 0) {
  if (val === null || val === undefined || isNaN(val)) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: maxFractionDigits
  }).format(val);
}

/**
 * Formata um valor numérico em porcentagem com vírgula.
 * @param {number} val - Valor percentual (ex: 7.12)
 * @param {number} [decimals=2] - Casas decimais
 * @returns {string} Valor formatado (ex: 7,12%)
 */
export function formatPct(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0,00%';
  return Number(val).toFixed(decimals).replace('.', ',') + '%';
}

/**
 * Formata um número inteiro com separador de milhar.
 * @param {number} val - Número
 * @returns {string} Número formatado (ex: 1.250)
 */
export function formatNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('pt-BR').format(val);
}
