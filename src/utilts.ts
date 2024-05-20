export const pad = (value: number, size: number) => {
  return value.toString().padStart(size, '0');
};

export const isNumber = (value: any) => {
  return typeof value === 'number';
};

export const isInteger = (value: any) => {
  return isNumber(value) && Math.floor(value) === value;
};

export const isNonNegativeInteger = (value: any) => {
  return isInteger(value) && value >= 0;
};

export const isString = (value: any) => {
  return typeof value === 'string';
};
