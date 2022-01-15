import type { NextPage } from "next";
import { useState } from "react";

import { RandomImageTile } from "../components";
import { NasaApiProvider } from "../contexts/NasaApiContext";
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

const Explore: NextPage<Props> = ({ apiKey }) => {
  const [tiles, setTiles] = useState(21);
  const ref = useInfiniteScroll(() => setTiles((tiles) => tiles + 21));

  return (
    <NasaApiProvider apiKey={apiKey}>
      <div
        ref={ref as any}
        className="grid gap-1 sm:gap-2 grid-cols-3 max-w-4xl sm:p-5 w-full mx-auto"
      >
        {[...new Array(tiles)].map((_, i) => (
          <RandomImageTile key={i} />
        ))}
      </div>
    </NasaApiProvider>
  );
};

export default Explore;
