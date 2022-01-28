import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Card } from "../components";
import { NasaApiProvider } from "../contexts/NasaApiContext";
import { SnackbarProvider } from "../contexts/SnackbarContext";
import { SpacestagramProvider } from "../contexts/SpacestagramContext";

import useDates from "../hooks/useDates";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { previousDate, previousDates } from "../utils/date-helper";

interface Props {
  apiKey: string;
}

export async function getStaticProps() {
  return {
    props: {
      apiKey: process.env.API_KEY,
    },
  };
}

const Home: NextPage<Props> = ({ apiKey }) => {
  const router = useRouter();
  let startDate = (router.query["p"] as string) || previousDate(Date.now());
  const [dates, setDates] = useState<string[]>([]);
  const ref = useInfiniteScroll(() =>
    setDates((d) => {
      const last = d.at(-1) as string;
      return [...d, previousDate(last)];
    })
  );

  useEffect(() => {
    setDates([startDate, ...previousDates(startDate, 4)]);
  }, [startDate]);

  return (
    <NasaApiProvider apiKey={apiKey}>
      <SpacestagramProvider>
        <SnackbarProvider>
          <div
            ref={ref as any}
            className="flex flex-col sm:gap-6 max-w-2xl sm:p-5 w-full mx-auto"
          >
            {dates.map((date) => (
              <Card key={date} date={date} />
            ))}
          </div>
        </SnackbarProvider>
      </SpacestagramProvider>
    </NasaApiProvider>
  );
};

export default Home;
