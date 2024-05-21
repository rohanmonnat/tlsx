import { Time } from '../src';

describe('Time class', () => {
  it('should throw an error when a component is not an non-negative integer', () => {
    expect(() => {
      new Time({
        hour: -12,
      });
    }).toThrow(new Error('expected hour to be a non-negative number got -12 instead'));
  });

  it('should throw an error when a component it not a number', () => {
    expect(() => {
      new Time({
        minute: 'as' as any,
      });
    }).toThrow(new Error('expected minute to be a number got string instead'));
  });
});

describe('isEqual method', () => {
  it('should return true for two Time instances with equal time components', () => {
    const time1 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    const time2 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });

    const result = time1.isEqual(time2);
    expect(result).toBe(true);
  });

  it('should return false for two Time instances with different hours', () => {
    const time1 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    const time2 = new Time({
      hour: 11,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different minutes', () => {
    const time1 = new Time({
      hour: 12,
      minute: 40,
      second: 12,
      millisecond: 12,
    });
    const time2 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different seconds', () => {
    const time1 = new Time({
      hour: 12,
      minute: 45,
      second: 20,
      millisecond: 12,
    });
    const time2 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should return false for two Time instances with different milliseconds', () => {
    const time1 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 10,
    });
    const time2 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    expect(time1.isEqual(time2)).toBe(false);
  });

  it('should throw an error if the argument is not an instance of Time', () => {
    const time1 = new Time({
      hour: 12,
      minute: 45,
      second: 12,
      millisecond: 12,
    });
    const notTime = { hour: 12, minute: 30, second: 45, millisecond: 500 };
    expect(() => time1.isEqual(notTime as any)).toThrow(
      new Error('invalid argument provided, expected instance of time')
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
