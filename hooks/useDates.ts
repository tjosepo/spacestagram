import { useCallback, useEffect, useRef } from "react";
import { previousDate, toISODate } from "../utils/date-helper";

const useDates = (
  startDate: Date | number | string = previousDate(Date.now())
) => {
  const date = useRef(toISODate(startDate));

  const getDates = (n = 1): string[] => {
    const dates = [];
    for (let i = 0; i < n; i++) {
      dates.push(date.current);
      date.current = previousDate(date.current);
    }
    return dates;
  };

  useEffect(() => {
    date.current = toISODate(startDate);
  }, [startDate]);

  return getDates;
};

export default useDates;
