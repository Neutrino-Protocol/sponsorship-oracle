
export const increaseBy = (value: number, percent: number) => value + (percent / 100) * value;

export const isFirstBiggerBy = <T extends number>(value1: T, value2: T) => (value1 / value2) * 100 - 100; // In percents