const isFlu = (temperature, cough, feverInLast5Days) =>
  cough && feverInLast5Days && temperature > 38;

module.exports = { isFlu };
