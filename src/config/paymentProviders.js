const allPaymentProviders = {
  VISA: 'Visa',
  MASTER: 'Master Card',
  AMEX: 'American Express',
  ELO: 'Elo',
  DINERS: 'Diners Club',
  HIPER: 'Hipercard',
};

const paymentProviders = Object.keys(allPaymentProviders);
const paymentProvidersStrings = new Map(Object.entries(paymentProviders));

module.exports = {
  paymentProviders,
  paymentProvidersStrings,
};
