import { createContext, useContext, useMemo, useRef } from "react";
import { get, getMany, set, setMany } from "idb-keyval";
import { previousDate, toISODate, toISODateRange } from "../utils/date-helper";

export interface NasaApiError {
  code: number;
  msg: string;
  service_version: "v1";
}

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
    let image = await get<ApodMedia>(date);
    if (image) return image;

    const response = await fetch(
      "https://apod.deno.dev/?" +
        new URLSearchParams({
          api_key: apiKey,
          thumbs: "true",
          date,
        })
    );

    const result = (await response.json()) as ApodMedia | NasaApiError;

    if ("code" in result) {
      return Promise.reject(result);
    }

    await set(date, result);
    return result;
  };

  let isBatching = false;
  let currentBatch: [
    (value: ApodMedia) => void,
    (reject: NasaApiError) => void
  ][] = [];
  const getRandomApod = async (): Promise<ApodMedia> => {
    if (!isBatching) {
      isBatching = true;
      setTimeout(async () => {
        const promises = currentBatch;
        isBatching = false;
        currentBatch = [];

        const request = await fetch(
          "https://apod.deno.dev/?" +
            new URLSearchParams({
              api_key: apiKey,
              thumbs: "true",
              count: String(promises.length),
            })
        );

        const results: ApodMedia[] | NasaApiError = await request.json();

        for (const [resolve, reject] of promises) {
          if ("code" in results) {
            reject(results);
            return;
          }

          const result = results.shift() as ApodMedia;
          resolve(result);
        }
      }, 100);
    }
    return new Promise((resolve, reject) => {
      currentBatch.push([resolve, reject]);
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
