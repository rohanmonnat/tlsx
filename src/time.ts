import { ITime, ITimeComponent } from './types';
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

  toJSON = (): ITime => {
    return this.components.reduce<Partial<ITime>>((obj: Partial<ITime>, component: ITimeComponent) => {
      obj[component] = this[component];
      return obj;
    }, {}) as ITime;
  };

  format = (fmt: string): string => {
    const formatTokens: Record<
      ITimeComponent,
      {
        identifier: string;
        size: number;
      }
    > = {
      hour: { identifier: 'hh', size: 2 },
      minute: { identifier: 'mm', size: 2 },
      second: { identifier: 'ss', size: 2 },
      millisecond: { identifier: 'ms', size: 3 },
    };

    return Object.entries(formatTokens).reduce<string>((formattedTime, token) => {
      const [component, config] = token;
      if (component === 'hour' && (formattedTime.includes('a') || formattedTime.includes('A'))) {
        const meridiem = this[component] >= 12 ? 'pm' : 'am';
        const hour = this[component] === 0 ? 12 : this[component] % 12;
        return formattedTime
          .replace('a', meridiem)
          .replace('A', meridiem.toUpperCase())
          .replace(config.identifier, pad(hour, config.size));
      }

      return formattedTime.replace(config.identifier, pad(this[component as ITimeComponent], config.size));
    }, fmt);
  };
}
