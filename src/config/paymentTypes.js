const allPaymentTypes = {
  PIX: 'Pix',
  BOLETO: 'Boleto',
  CREDITO: 'Cartão de Crédito',
  DEBITO: 'Cartão de Débito',
};

const paymentTypes = Object.keys(allPaymentTypes);
const paymentStrings = new Map(Object.entries(paymentTypes));

module.exports = {
  paymentTypes,
  paymentStrings,
};
