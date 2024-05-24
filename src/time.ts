import { COMPONENT_RANGE, TIME_COMPONENTS } from './constants';
import { newInvalidComponentError, newInvalidValueError, newOutOfRangeError } from './error';
import { normalizeTimeComponent, parseTimeFromNumber } from './internals';
import { ComponentRange, ComponentTokenConfig, ITime, ITimeComponent } from './types';
import { isNonNegativeInteger, isNumber, pad } from './utilts';

export default class Time {
  private readonly _components: ITimeComponent[];
  private readonly _componentRanges: Record<ITimeComponent, ComponentRange>;
  private hour: number = 0;
  private minute: number = 0;
  private second: number = 0;
  private millisecond: number = 0;

  constructor(time: number);
  constructor(time: string);
  constructor(time: Partial<ITime>);
  constructor(time: number | string | Partial<ITime>) {
    this._componentRanges = COMPONENT_RANGE;
    this._components = TIME_COMPONENTS;

    // Todo: Refactor with intializers
    switch (typeof time) {
      // Todo: Add validation before parsing
      case 'number':
        const { hour, minute, second, millisecond } = parseTimeFromNumber(time);
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond;

        break;

      // Todo: string parser
      case 'string':
        break;

      case 'object':
        this._components.forEach((component: ITimeComponent) => {
          if (time[component]) {
            if (isNumber(time[component])) {
              if (!isNonNegativeInteger(time[component])) {
                throw new Error(`expected ${component} to be a non-negative number got ${time[component]} instead`);
              }

              this[component] = normalizeTimeComponent(component, time[component] as number);
            } else {
              throw new Error(`expected ${component} to be a number got ${typeof time[component]} instead`);
            }
          }
        });
        break;

      default:
        throw new Error(`Invalid time. Expected time to be a string, number or object got ${typeof time}.`);
    }
  }

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

  getComponentRange = (component: string) => {
    const error = this._validateComponent(component);
    if (error) {
      throw error;
    }

    return this._componentRanges[component as ITimeComponent];
  };

  getComponents = (): ITimeComponent[] => {
    return this._components;
  };

  setHour = (value: number): number => {
    const error = this._validateComponentRange('hour', value);

    if (error) {
      throw error;
    }

    return (this.hour = value);
  };

  setMinute = (value: number) => {
    const error = this._validateComponentRange('minute', value);

    if (error) {
      throw error;
    }
    return (this.minute = value);
  };

  setSecond = (value: number) => {
    const error = this._validateComponentRange('second', value);

    if (error) {
      throw error;
    }

    return (this.second = value);
  };

  setMillisecond = (value: number) => {
    const error = this._validateComponentRange('millisecond', value);

    if (error) {
      throw error;
    }

    return (this.millisecond = value);
  };

  isEqual = (time: Time): boolean => {
    const error = this._validateTimeInstance(time);

    if (error) {
      throw error;
    }

    return (
      this.hour === time.getHour() &&
      this.minute === time.getMinute() &&
      this.second === time.getSecond() &&
      this.millisecond === time.getMillisecond()
    );
  };

  isSmaller = (time: Time) => {
    const error = this._validateTimeInstance(time);

    if (error) {
      throw error;
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

  isGreater = (time: Time) => {
    const error = this._validateTimeInstance(time);

    if (error) {
      throw error;
    }

    if (this.hour > time.getHour()) {
      return true;
    } else if (this.hour < time.getHour()) {
      return false;
    }

    if (this.minute > time.getMinute()) {
      return true;
    } else if (this.minute < time.getMinute()) {
      return false;
    }

    if (this.second > time.getSecond()) {
      return true;
    } else if (this.second < time.getSecond()) {
      return false;
    }

    if (this.millisecond > time.getMillisecond()) {
      return true;
    }

    return false;
  };

  toJSON = (): ITime => {
    return this._components.reduce<Partial<ITime>>((obj: Partial<ITime>, component: ITimeComponent) => {
      obj[component] = this[component];
      return obj;
    }, {}) as ITime;
  };

  toMillisecond = (): number => {
    return (
      this.getHour() * 60 * 60 * 1000 + this.getMinute() * 60 * 1000 + this.getSecond() * 1000 + this.getMillisecond()
    );
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

  private _isTimeInstanceValid = (time: any) => {
    return time instanceof Time;
  };

  private _isComponentValid = (component: string) => {
    return this._components.some((cmp) => component === cmp);
  };

  private _isComponentInValidRange = (component: string, value: number) => {
    if (this._isComponentValid(component)) {
      const range = this.getComponentRange(component);
      return value >= range.start && value <= range.end;
    }

    return false;
  };

  private _validateTimeInstance = (time: any) => {
    if (!this._isTimeInstanceValid(time)) {
      return new Error(`Invalid Time object. Expected argument to be a Time instance.`);
    }

    return null;
  };

  private _validateComponent = (component: string) => {
    if (!this._isComponentValid(component)) {
      return newInvalidComponentError(component);
    }

    return null;
  };

  private _validateComponentRange = (component: string, value: number): Error | null => {
    const error = this._validateComponent(component);

    if (error) {
      return error;
    }

    const range = this.getComponentRange(component);

    if (!this._isComponentInValidRange(component, value)) {
      return newOutOfRangeError(component, `${range.start} to ${range.end}`, value);
    }

    return null;
  };

  // Todo: Add validation
  static fromMillisecond = (millisecond: number): Time => {
    return new Time(millisecond);
  };

  static fromSecond = (second: number) => {
    return new Time(second * 1000);
  };

  static fromMinute = (minute: number): Time => {
    return new Time(minute * 60 * 1000);
  };

  static fromHour = (hour: number) => {
    return new Time(hour * 60 * 60 * 1000);
  };
}
