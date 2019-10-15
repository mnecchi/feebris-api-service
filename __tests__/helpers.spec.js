const { isFlu } = require('../helpers');

describe('isFlu helper', () => {

  it('should return false if no value is passed', () => {
    expect(isFlu()).toBeFalsy();
  })

  it('should return false if temperature <= 38', () => {
    expect(isFlu(37, true, true)).toBeFalsy();
  });

  it('should return false if no fever in the last 5 days', () => {
    expect(isFlu(40, true, false)).toBeFalsy();
  });

  it('should return false if no cough', () => {
    expect(isFlu(40, false, true)).toBeFalsy();
  });

  it('should return true if cough, fever in the last 5 days and temperature > 38', () => {
    expect(isFlu(38.1, true, true)).toBeTruthy();
  });
})
