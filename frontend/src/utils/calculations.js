/**
 * Motor de Cálculo Financeiro do Front-end (Seazone OS)
 * Centraliza a modelagem de Cap Rate, Custos Operacionais, Receitas, Payback e Alavancagem.
 */

/**
 * Calcula todas as métricas financeiras de um ativo com base na ocupação e taxa Seazone.
 * @param {Object} asset - Objeto do ativo com market_data e rental_pricing
 * @param {number} occupancyRate - Taxa de ocupação em % (ex: 55)
 * @param {number} seazoneFeePct - Taxa Seazone em % (ex: 20)
 * @returns {Object} Métricas calculadas
 */
export function calculateFinancialMetrics(asset, occupancyRate, seazoneFeePct) {
  const occ = occupancyRate / 100;
  const nights = 365 * occ;
  const medianAdr = asset?.rental_pricing?.median_adr || 0;
  const salePrice = asset?.market_data?.median_sale_price || 1;

  const grossAnnual = medianAdr * nights;
  const seazoneFeeAmount = grossAnnual * (seazoneFeePct / 100);
  const fixedCosts = asset?.market_data?.annual_fixed_costs || (salePrice * 0.012);
  const otaCosts = grossAnnual * 0.03; // ~3% taxas incidentais / canais OTA
  const totalOpex = seazoneFeeAmount + fixedCosts + otaCosts;
  const netIncome = grossAnnual - totalOpex;

  const grossCapRate = salePrice > 0 ? (grossAnnual / salePrice) * 100 : 0;
  const netCapRate = salePrice > 0 ? (netIncome / salePrice) * 100 : 0;
  const monthlyNet = netIncome / 12;
  const payback = netIncome > 0 ? (salePrice / netIncome) : 99;

  // Ponto de Equilíbrio Operacional (Breakeven Occupancy): ponto onde Net Income = 0
  const netMarginPerNight = medianAdr * (1 - (seazoneFeePct / 100) - 0.03);
  const breakevenNights = netMarginPerNight > 0 ? fixedCosts / netMarginPerNight : 365;
  const breakevenOccupancyPct = Math.min(100, Math.max(0, (breakevenNights / 365) * 100));

  return {
    nights: Math.round(nights),
    grossAnnual,
    seazoneFee: seazoneFeeAmount,
    fixedCosts,
    otaCosts,
    totalOpex,
    netIncome,
    grossCapRate,
    netCapRate,
    monthlyNet,
    payback: Number(payback.toFixed(1)),
    breakevenOccupancyPct: Number(breakevenOccupancyPct.toFixed(1))
  };
}

/**
 * Gera pontos para a curva de sensibilidade de um conjunto de ativos.
 * @param {Array} assets - Lista de ativos
 * @param {number} seazoneFeePct - Taxa de gestão Seazone em %
 * @param {Array<number>} [occPoints=[35, 40, 45, 50, 55, 60, 65, 70, 75]]
 * @returns {Array<Object>} Dados formatados para Recharts
 */
export function generateSensitivityChartData(assets, seazoneFeePct, occPoints = [35, 40, 45, 50, 55, 60, 65, 70, 75]) {
  return occPoints.map(occ => {
    const row = { occupancy: `${occ}%` };
    assets.forEach(asset => {
      const calc = calculateFinancialMetrics(asset, occ, seazoneFeePct);
      row[asset.id] = Number(calc.netCapRate.toFixed(2));
    });
    return row;
  });
}

/**
 * Calcula métricas de Alavancagem Financeira (Financiamento Imobiliário vs. Retorno de Caixa).
 * @param {Object} asset - Objeto do ativo
 * @param {Object} calc - Métricas calculadas sem alavancagem
 * @param {number} downPaymentPct - Entrada em % (ex: 30)
 * @param {number} annualInterestRate - Taxa de juros anual em % (ex: 10.5)
 * @param {number} loanTermYears - Prazo do financiamento em anos (ex: 20)
 * @returns {Object} Métricas de alavancagem
 */
export function calculateLeverageMetrics(asset, calc, downPaymentPct = 30, annualInterestRate = 10.5, loanTermYears = 20) {
  const salePrice = asset?.market_data?.median_sale_price || 0;
  const downPayment = salePrice * (downPaymentPct / 100);
  const loanAmount = salePrice - downPayment;

  const monthlyRate = (annualInterestRate / 100) / 12;
  const totalMonths = loanTermYears * 12;

  // Prestação Price: PMT = PV * [i*(1+i)^n] / [(1+i)^n - 1]
  let monthlyPayment = 0;
  if (monthlyRate > 0 && totalMonths > 0 && loanAmount > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = loanAmount * ((monthlyRate * factor) / (factor - 1));
  }

  const annualDebtService = monthlyPayment * 12;
  const noi = calc?.netIncome || 0;
  const leveragedAnnualCashFlow = noi - annualDebtService;
  const leveragedMonthlyCashFlow = leveragedAnnualCashFlow / 12;

  // Cash-on-Cash Return = (Fluxo de Caixa Líquido Anual Alavancado / Capital Próprio Investido na Entrada) * 100
  const cashOnCashReturn = downPayment > 0 ? (leveragedAnnualCashFlow / downPayment) * 100 : 0;

  // Debt Service Coverage Ratio (DSCR) = NOI / Serviço da Dívida Anual
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 99;

  return {
    downPayment,
    loanAmount,
    monthlyPayment,
    annualDebtService,
    leveragedAnnualCashFlow,
    leveragedMonthlyCashFlow,
    cashOnCashReturn: Number(cashOnCashReturn.toFixed(2)),
    dscr: Number(dscr.toFixed(2)),
    isPositiveCashFlow: leveragedAnnualCashFlow > 0
  };
}
