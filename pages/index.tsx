import type { NextPage } from "next";
import { useState } from "react";

import { Card } from "../components";
import { NasaApiProvider } from "../contexts/NasaApiContext";
import { SpacestagramProvider } from "../contexts/SpacestagramContext";

import useDates from "../hooks/useDates";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

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
  const getDates = useDates();
  const [dates, setDates] = useState(() => getDates(5));
  const ref = useInfiniteScroll(() => setDates((d) => [...d, ...getDates()]));

  return (
    <NasaApiProvider apiKey={apiKey}>
      <SpacestagramProvider>
        <div
          ref={ref as any}
          className="flex flex-col sm:gap-6 max-w-2xl sm:p-5 w-full mx-auto"
        >
          {dates.map((date) => (
            <Card key={date} date={date} />
          ))}
        </div>
      </SpacestagramProvider>
    </NasaApiProvider>
  );
};

export default Home;
