export interface ITime {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

export type ITimeComponent = keyof ITime;

export type ComponentTokenConfig = {
  identifier: string;
  size: number;
};
