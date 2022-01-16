const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const toISODate = (date: Date | number | string): string => {
  return new Date(date).toISOString().split("T")[0];
};

export const toISODateRange = (
  startDate: Date | number | string,
  endDate: Date | number | string
): string[] => {
  const range: string[] = [];
  for (
    let currentDate = Number(new Date(startDate));
    currentDate <= Number(new Date(endDate));
    currentDate = Number(currentDate) + MILLISECONDS_IN_DAY
  ) {
    range.push(toISODate(currentDate));
  }
  return range;
};

export const previousDate = (date: Date | number | string): string => {
  return toISODate(Number(new Date(date)) - MILLISECONDS_IN_DAY);
};

export const previousDates = (
  date: Date | number | string,
  n: number
): string[] => {
  const dates = [];
  let current = date;
  for (let i = 0; i < n; i++) {
    current = previousDate(current);
    dates.push(current);
  }
  return dates;
};

export const nextDate = (date: Date | number | string): string => {
  return toISODate(Number(new Date(date)) + MILLISECONDS_IN_DAY);
};
