const allPaymentTypes = {
  PIX: 'pix',
  BOLETO: 'boleto',
  CREDITO: 'cartão de crédito',
  DEBITO: 'cartão de débito',
};

const paymentTypes = Object.keys(allPaymentTypes);
const paymentStrings = new Map(Object.entries(paymentTypes));

module.exports = {
  paymentTypes,
  paymentStrings,
};
