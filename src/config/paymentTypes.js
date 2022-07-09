const allPaymentTypes = {
  PIX: 'pix',
  BOLETO: 'boleto',
  CREDITO: 'cartão de crédito',
  DEBITO: 'cartão de débito',
}

const paymentsTypes = Object.keys(allPaymentTypes);
const paymentsStrings = new Map(Object.entries(paymentsTypes));

module.exports = {
  paymentsTypes,
  paymentsStrings,
}