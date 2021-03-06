/* eslint-disable prettier/prettier */
const allBrazilStates = {
  RO: 'Rondônia',
  AC: 'Acre',
  AM: 'Amazonas',
  RR: 'Roraima',
  PA: 'Pará',
  AP: 'Amapá',
  TO: 'Tocantins',
  MA: 'Maranhão',
  PI: 'Paiuí',
  CE: 'Ceará',
  RN: 'Rio Grande do Norte',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  AL: 'Alagoas',
  SE: 'Sergipe',
  BA: 'Bahia',
  MG: 'Minas Gerais',
  ES: 'Espírito Santo',
  RJ: 'Rio de Janeiro',
  SP: 'São Paulo',
  PR: 'Paraná',
  SC: 'Santa Catarina',
  RS: 'Rio Grande do Sul',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  GO: 'Goiás',
  DF: 'Distrito Federal'
};

const states = Object.keys(allBrazilStates);
const statesStrings = Object.values(allBrazilStates);;

module.exports = {
	states,
	statesStrings
}