import { TIME_COMPONENTS } from './constants';
import { ITime, ITimeComponent } from './types';

export const normalizeTimeComponent = (component: ITimeComponent, value: number): number => {
  switch (component) {
    case 'hour':
      return value % 24;

    case 'minute':
      return value % 60;

    case 'second':
      return value % 60;

    case 'millisecond':
      return value % 1000;

    default:
      throw new Error(`invalid time component ${component}`);
  }
};

export const parseTimeFromNumber = (value: number, unit: ITimeComponent = 'millisecond'): ITime => {
  let hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0;

  switch (unit) {
    case 'millisecond':
      millisecond = normalizeTimeComponent('millisecond', value);
    case 'second':
      second = normalizeTimeComponent('second', Math.floor(value / 1000));
    case 'minute':
      minute = normalizeTimeComponent('minute', Math.floor(value / (60 * 1000)));
    case 'hour':
      hour = normalizeTimeComponent('hour', Math.floor(value / (60 * 60 * 1000)));
    default:
    // Throw an error
  }

  return {
    hour,
    minute,
    second,
    millisecond,
  };
};

export const parseTimeFromString = (value: string): ITime => {
  return {} as ITime;
};

export const parseTimeFromObject = (value: Partial<ITime>): ITime => {
  return {} as ITime;
};

export const isValidTimeComponent = (component: string) => {
  return TIME_COMPONENTS.some((cmp) => cmp === component);
};
