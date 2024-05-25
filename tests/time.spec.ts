import { ITime, ITimeComponent, Time } from '../src';
import { TIME_COMPONENTS } from '../src/constants';

describe('Time class', () => {
  let components: ITimeComponent[];

  beforeAll(() => {
    components = TIME_COMPONENTS;
  });

  describe('Class instantiation with object', () => {
    it('should create a new valid Time instance', () => {
      const timeObject: ITime = {
        hour: 10,
        minute: 20,
        second: 30,
        millisecond: 500,
      };
      const time = new Time(timeObject);

      components.forEach((component) => {
        expect(time[component as ITimeComponent]).toBe(timeObject[component as ITimeComponent]);
      });
    });

    it('should create a Time instance with all components equal to "0" when object is empty', () => {
      const time = new Time({});

      components.forEach((component) => {
        expect(time[component as ITimeComponent]).toBe(0);
      });
    });

    it('should throw an error when hour is a negative integer', () => {
      expect(() => {
        new Time({
          hour: -12,
        });
      }).toThrow(new Error("Invalid 'hour'. Expected 'hour' to be a positive integer got '-12' instead."));
    });

    it('should throw an error when minute is a string', () => {
      expect(() => {
        new Time({
          minute: 'two' as any,
        });
      }).toThrow(new Error("Invalid 'minute'. Expected 'minute' to be a positive integer got 'two' instead."));
    });

    it('should throw an error when hour is out of range', () => {
      expect(() => {
        new Time({
          hour: 40,
        });
      }).toThrow(new Error("Invalid 'hour'. Expected 'hour' to be in range '0 to 23' got '40' instead."));
    });
  });

  describe('Class instantiation when argument is undefined or absent', () => {
    it('should create a new Time instance with all components equal to "0"', () => {
      const time = new Time();

      components.forEach((component) => {
        expect(time[component as ITimeComponent]).toBe(0);
      });
    });
  });
});

describe('isEqual method', () => {
  it('should return true for two Time instances with equal time components', () => {
    const time1 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    const time2 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });

    const result = time1.isEqual(time2);
    expect(result).toBe(true);
  });

  it('should return false for two Time instances with different hours', () => {
    const time1 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    const time2 = new Time({ hour: 11, minute: 45, second: 12, millisecond: 12 });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different minutes', () => {
    const time1 = new Time({ hour: 12, minute: 40, second: 12, millisecond: 12 });
    const time2 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different seconds', () => {
    const time1 = new Time({ hour: 12, minute: 45, second: 20, millisecond: 12 });
    const time2 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different milliseconds', () => {
    const time1 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 10 });
    const time2 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should throw an error if the argument is not an instance of Time', () => {
    const time1 = new Time({ hour: 12, minute: 45, second: 12, millisecond: 12 });
    const notTime = { hour: 12, minute: 30, second: 45, millisecond: 500 };
    expect(() => time1.isEqual(notTime as any)).toThrow(
      new Error('Invalid Time object. Expected argument to be a Time instance.')
    );
  });
});

describe('isSmaller method', () => {
  it('should return true when the first time is smaller by hours', () => {
    const time1 = new Time({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(true);
  });

  it('should return false when the first time is larger by hours', () => {
    const time1 = new Time({ hour: 13, minute: 0, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(false);
  });

  it('should return true when the first time is smaller by minutes', () => {
    const time1 = new Time({ hour: 12, minute: 10, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 20, second: 0, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(true);
  });

  it('should return false when the first time is larger by minutes', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 20, second: 0, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(false);
  });

  it('should return true when the first time is smaller by seconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 10, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 30, second: 20, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(true);
  });

  it('should return false when the first time is larger by seconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 30, second: 20, millisecond: 0 });
    expect(time1.isSmaller(time2)).toBe(false);
  });

  it('should return true when the first time is smaller by milliseconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 10 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 20 });
    expect(time1.isSmaller(time2)).toBe(true);
  });

  it('should return false when the first time is larger by milliseconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 20 });
    expect(time1.isSmaller(time2)).toBe(false);
  });

  it('should return false when both times are equal', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    expect(time1.isSmaller(time2)).toBe(false);
  });

  it('should throw an error if the argument is not an instance of Time', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    const notTime = { hour: 12, minute: 30, second: 30, millisecond: 30 };
    expect(() => time1.isSmaller(notTime as any)).toThrow(
      'Invalid Time object. Expected argument to be a Time instance.'
    );
  });
});

describe('isGreater method', () => {
  it('should return true when the first time is greater by hours', () => {
    const time1 = new Time({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(true);
  });

  it('should return false when the first time is smaller by hours', () => {
    const time1 = new Time({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 13, minute: 0, second: 0, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(false);
  });

  it('should return true when the first time is greater by minutes', () => {
    const time1 = new Time({ hour: 12, minute: 20, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 10, second: 0, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(true);
  });

  it('should return false when the first time is smaller by minutes', () => {
    const time1 = new Time({ hour: 12, minute: 20, second: 0, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 30, second: 0, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(false);
  });

  it('should return true when the first time is greater by seconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 20, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 30, second: 10, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(true);
  });

  it('should return false when the first time is smaller by seconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 20, millisecond: 0 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 0 });
    expect(time1.isGreater(time2)).toBe(false);
  });

  it('should return true when the first time is greater by milliseconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 20 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 10 });
    expect(time1.isGreater(time2)).toBe(true);
  });

  it('should return false when the first time is smaller by milliseconds', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 20 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    expect(time1.isGreater(time2)).toBe(false);
  });

  it('should return false when both times are equal', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    const time2 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    expect(time1.isGreater(time2)).toBe(false);
  });

  it('should throw an error if the argument is not an instance of Time', () => {
    const time1 = new Time({ hour: 12, minute: 30, second: 30, millisecond: 30 });
    const notTime = { hour: 12, minute: 30, second: 30, millisecond: 30 };
    expect(() => time1.isGreater(notTime as any)).toThrow(
      'Invalid Time object. Expected argument to be a Time instance.'
    );
  });
});

describe('Format time', () => {
  const time = new Time({
    hour: 13,
    minute: 24,
    second: 12,
    millisecond: 24,
  });

  it('should format time correctly with pattern "hh mm ss ms"', () => {
    const formattedTime = time.format('hh mm ss ms');
    expect(formattedTime).toBe('13 24 12 024');
  });

  it('should format time correctly with pattern "hh-mm-ss-ms"', () => {
    const formattedTime = time.format('hh-mm-ss-ms');
    expect(formattedTime).toBe('13-24-12-024');
  });

  it('should format time correctly with pattern "hh:mm:ss:ms"', () => {
    const formattedTime = time.format('hh:mm:ss:ms');
    expect(formattedTime).toBe('13:24:12:024');
  });

  it('should format time correctly with meridiem in uppercase and pattern "hh:mm A"', () => {
    const formattedTime = time.format('hh:mm A');
    expect(formattedTime).toBe('01:24 PM');
  });

  it('should format time correctly with meridiem in lowercase and pattern "hh:mm a"', () => {
    const formattedTime = time.format('hh:mm a');
    expect(formattedTime).toBe('01:24 pm');
  });

  it('should format time correctly with meridiem in lowercase and pattern "hh:mm a"', () => {
    const formattedTime = new Time({ minute: 15 }).format('hh:mm a');
    expect(formattedTime).toBe('12:15 am');
  });
});

describe('Convert to JSON', () => {
  it('should convert time instance to an JSON object', () => {
    const jsonTime = new Time({ hour: 13, second: 45 }).toJSON();
    expect(jsonTime).toEqual({
      hour: 13,
      minute: 0,
      second: 45,
      millisecond: 0,
    });
  });
});
