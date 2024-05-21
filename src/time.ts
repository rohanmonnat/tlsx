import { newInvalidValueError, newOutOfRangeError } from './error';
import { ComponentTokenConfig, ITime, ITimeComponent } from './types';
import { isNonNegativeInteger, isNumber, pad } from './utilts';

export default class Time {
  private readonly components: ITimeComponent[] = ['hour', 'minute', 'second', 'millisecond'];
  private hour: number = 0;
  private minute: number = 0;
  private second: number = 0;
  private millisecond: number = 0;

  constructor(time: Partial<ITime>) {
    this.components.forEach((component: ITimeComponent) => {
      if (time[component]) {
        if (isNumber(time[component])) {
          if (!isNonNegativeInteger(time[component])) {
            throw new Error(`expected ${component} to be a non-negative number got ${time[component]} instead`);
          }

          this[component] = this.normalizeComponent(component, time[component] as number);
        } else {
          throw new Error(`expected ${component} to be a number got ${typeof time[component]} instead`);
        }
      }
    });
  }

  private normalizeComponent = (component: ITimeComponent, value: number): number => {
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

  getHour = (): number => {
    return this.hour;
  };

  getMinute = (): number => {
    return this.minute;
  };

  getSecond = (): number => {
    return this.second;
  };

  getMillisecond = (): number => {
    return this.millisecond;
  };

  setHour = (value: number): number => {
    if (!isNonNegativeInteger(value)) {
      throw newInvalidValueError('hour', value);
    }

    if (!(value >= 0 && value < 24)) {
      throw newOutOfRangeError('hour', '0 to 23', value);
    }

    return (this.hour = value);
  };

  setMinute = (value: number) => {
    if (!isNonNegativeInteger(value)) {
      throw newInvalidValueError('minute', value);
    }

    if (!(value >= 0 && value < 60)) {
      throw newOutOfRangeError('minute', '0 to 59', value);
    }

    return (this.minute = value);
  };

  setSecond = (value: number) => {
    if (!isNonNegativeInteger(value)) {
      throw newInvalidValueError('second', value);
    }

    if (!(value >= 0 && value < 60)) {
      throw newOutOfRangeError('second', '0 to 59', value);
    }

    return (this.second = value);
  };

  setMillisecond = (value: number) => {
    if (!isNonNegativeInteger(value)) {
      throw newInvalidValueError('millisecond', value);
    }

    if (!(value >= 0 && value < 60)) {
      throw newOutOfRangeError('millisecond', '0 to 999', value);
    }

    return (this.millisecond = value);
  };

  isEqual = (time: Time): boolean => {
    if (!(time instanceof Time)) {
      throw new Error('Invalid argument. Argument must be a Time object.');
    }

    return (
      this.hour === time.getHour() &&
      this.minute === time.getMinute() &&
      this.second === time.getSecond() &&
      this.millisecond === time.getMillisecond()
    );
  };

  isSmaller = (time: Time) => {
    if (!(time instanceof Time)) {
      throw new Error('Invalid argument. Argument must be a Time object.');
    }

    if (this.hour < time.getHour()) {
      return true;
    } else if (this.hour > time.getHour()) {
      return false;
    }

    if (this.minute < time.getMinute()) {
      return true;
    } else if (this.minute > time.getMinute()) {
      return false;
    }

    if (this.second < time.getSecond()) {
      return true;
    } else if (this.second > time.getSecond()) {
      return false;
    }

    if (this.millisecond < time.getMillisecond()) {
      return true;
    }

    return false;
  };

  toJSON = (): ITime => {
    return this.components.reduce<Partial<ITime>>((obj: Partial<ITime>, component: ITimeComponent) => {
      obj[component] = this[component];
      return obj;
    }, {}) as ITime;
  };

  format = (fmt: string): string => {
    const formatTokens: Record<ITimeComponent, ComponentTokenConfig> = {
      hour: { identifier: 'hh', size: 2 },
      minute: { identifier: 'mm', size: 2 },
      second: { identifier: 'ss', size: 2 },
      millisecond: { identifier: 'ms', size: 3 },
    };

    return Object.entries(formatTokens).reduce<string>((formattedTime, token) => {
      const [component, config] = token;
      if (component === 'hour' && (formattedTime.includes('a') || formattedTime.includes('A'))) {
        const meridiem = this[component] >= 12 ? 'pm' : 'am';
        const hour = this[component] % 12 === 0 ? 12 : this[component] % 12;
        return formattedTime
          .replace('a', meridiem)
          .replace('A', meridiem.toUpperCase())
          .replace(config.identifier, pad(hour, config.size));
      }

      return formattedTime.replace(config.identifier, pad(this[component as ITimeComponent], config.size));
    }, fmt);
  };
}
