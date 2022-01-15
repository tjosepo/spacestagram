import { createContext, useContext, useMemo, useRef } from "react";
import { get, getMany, set, setMany } from "idb-keyval";
import { previousDate, toISODate, toISODateRange } from "../utils/date-helper";

export interface ApodMedia {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: "image" | "video" | "other";
  service_version: "v1";
  title: string;
  url: string;
  thumbnail_url: string;
}

const NasaApiContext = createContext<{
  getApodByDate(date: string): Promise<ApodMedia>;
  getRandomApod(): Promise<ApodMedia>;
}>({
  getApodByDate: () => undefined as any,
  getRandomApod: () => undefined as any,
});

interface Props {
  apiKey: string;
  children: React.ReactNode;
}

export const NasaApiProvider = ({ apiKey, children }: Props) => {
  const getApodByDate = async (date: string): Promise<ApodMedia> => {
    let result = await get<ApodMedia>(date);

    if (!result) {
      const request = await fetch(
        "https://api.nasa.gov/planetary/apod?" +
          new URLSearchParams({
            api_key: apiKey,
            thumbs: "true",
            date,
          })
      );
      result = (await request.json()) as ApodMedia;
    }

    set(date, result);
    return result;
  };

  let isBatching = false;
  let currentBatch: ((value: ApodMedia) => void)[] = [];
  const getRandomApod = async (): Promise<ApodMedia> => {
    if (!isBatching) {
      isBatching = true;
      setTimeout(async () => {
        const resolves = currentBatch;
        isBatching = false;
        currentBatch = [];

        const request = await fetch(
          "https://api.nasa.gov/planetary/apod?" +
            new URLSearchParams({
              api_key: apiKey,
              thumbs: "true",
              count: String(resolves.length),
            })
        );

        const results: ApodMedia[] = await request.json();
        for (const resolve of resolves) {
          const result = results.shift() as ApodMedia;
          resolve(result);
        }
      }, 100);
    }
    return new Promise((resolve) => {
      currentBatch.push(resolve);
    });
  };

  return (
    <NasaApiContext.Provider
      value={useMemo(() => ({ getApodByDate, getRandomApod }), [apiKey])}
    >
      {children}
    </NasaApiContext.Provider>
  );
};

export const useNasaApi = () => useContext(NasaApiContext);
