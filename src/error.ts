export const newOutOfRangeError = (component: string, range: string, got: any) => {
  return new Error(`Invalid ${component}. Expected ${component} to be in range ${range} got ${got}.`);
};

export const newInvalidValueError = (component: string, got: any) => {
  return new Error(`Invalid ${component}. Expected ${component} to be a positive integer got ${got}`);
};
