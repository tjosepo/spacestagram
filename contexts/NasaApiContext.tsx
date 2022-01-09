import { createContext, useContext, useMemo, useRef } from "react";
import { get, getMany, setMany } from "idb-keyval";
import { previousDate, toISODate, toISODateRange } from "../utils/date-helper";

export interface ApodMedia {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: "image" | "video";
  service_version: "v1";
  title: string;
  url: string;
  thumbnail_url: string;
}

export interface ApodDateParameter {
  date: string;
  thumbs?: boolean;
}

export interface ApodCountParameter {
  count: number;
  thumbs?: boolean;
}

export interface ApodRangeParameter {
  startDate: string;
  endDate: string;
  thumbs?: boolean;
}

type ApodQueryParameter =
  | ApodDateParameter
  | ApodCountParameter
  | ApodRangeParameter;

const NasaApiContext = createContext<{
  getApod(params: ApodQueryParameter): Promise<ApodMedia[]>;
  apod(startDate?: string): AsyncGenerator<ApodMedia>;
}>({
  getApod: () => Promise.resolve([]),
  apod: function* () {
    yield Promise.resolve({} as any);
  } as any,
});

export const NasaApiProvider = ({ apiKey, children }: any) => {
  const lastApodDate = useRef(toISODate(Date.now()));

  const getApod = async (params: ApodQueryParameter): Promise<ApodMedia[]> => {
    const { thumbs = true } = params;
    let results: ApodMedia[] = [];

    if ("date" in params) {
      const { date } = params;
      lastApodDate.current = date;

      let post: ApodMedia =
        (await get(date)) ??
        (await fetch(
          "https://api.nasa.gov/planetary/apod?" +
            new URLSearchParams({
              api_key: apiKey,
              thumbs: String(thumbs),
              date,
            })
        ).then((res) => res.json()));

      results.push(post);
    }

    if ("startDate" in params && "endDate" in params) {
      const { startDate, endDate } = params;
      const range = toISODateRange(startDate, endDate);
      lastApodDate.current = startDate;

      let posts: ApodMedia[] = await getMany(range).catch(() =>
        fetch(
          "https://api.nasa.gov/planetary/apod?" +
            new URLSearchParams({
              api_key: apiKey,
              thumbs: String(thumbs),
              start_date: startDate,
              end_date: endDate,
            })
        ).then((res) => res.json())
      );

      results.push(...posts);
    }

    if ("count" in params) {
      const posts: ApodMedia[] = await fetch(
        "https://api.nasa.gov/planetary/apod?" +
          new URLSearchParams({
            api_key: apiKey,
            thumbs: String(thumbs),
            count: String(params.count),
          })
      ).then((res) => res.json());
      results.push(...posts);
    }

    // Save results in idb
    setMany(results.map((media) => [media.date, media]));

    return results;
  };

  async function* apod(
    startDate = previousDate(Date.now())
  ): AsyncGenerator<ApodMedia> {
    let date = startDate;
    while (true) {
      yield (await getApod({ date }))[0];
      date = previousDate(date);
    }
  }

  return (
    <NasaApiContext.Provider
      value={useMemo(() => ({ getApod, apod }), [apiKey])}
    >
      {children}
    </NasaApiContext.Provider>
  );
};

export const useNasaApi = () => useContext(NasaApiContext);
