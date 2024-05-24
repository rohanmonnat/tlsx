import { ComponentRange, ITimeComponent } from './types';

export const COMPONENT_RANGE: Record<ITimeComponent, ComponentRange> = {
  hour: {
    start: 0,
    end: 23,
  },
  minute: {
    start: 0,
    end: 59,
  },
  second: {
    start: 0,
    end: 59,
  },
  millisecond: {
    start: 0,
    end: 999,
  },
};

export const TIME_COMPONENTS: ITimeComponent[] = ['hour', 'minute', 'second', 'millisecond'];

export const MAX_MILLISECOND_LIMIT = 1000 * 60 * 60 * 24;
