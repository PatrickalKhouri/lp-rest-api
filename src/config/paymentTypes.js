const allPaymentTypes = {
  PIX: 'Pix',
  BOLETO: 'Boleto',
  CREDITO: 'Cartão de Crédito',
  DEBITO: 'Cartão de Débito',
};

const paymentTypes = Object.keys(allPaymentTypes);
const paymentStrings = Object.values(allPaymentTypes);

module.exports = {
  paymentTypes,
  paymentStrings,
};
