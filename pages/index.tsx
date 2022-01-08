import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useNasaApi } from "../contexts/NasaApiContext";
import type { ApodMedia } from "../contexts/NasaApiContext";

import { Card } from "../components";

const Home: NextPage = () => {
  const nasa = useNasaApi();
  const apodRef = useRef(nasa.apod());
  const apod = apodRef.current;

  const [skeletons, setSkeletons] = useState(5);
  const [images, setImages] = useState<ApodMedia[]>([]);

  // Replace the skeletons with actual images
  useEffect(() => {
    (async () => {
      if (skeletons > 0) {
        const image = await (await apod.next()).value;
        setImages((images) => [...images, image]);
        setSkeletons((count) => Math.max(count - 1, 0));
      }
    })();
  }, [skeletons]);

  // Add new skeletons when scrolling down
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => setSkeletons((s) => Math.min(s + 1, 5)),
      {
        rootMargin: "0px 0px 300px 0px",
        threshold: 1,
      }
    );

    observer.observe(endRef.current!);
  }, []);

  return (
    <div className="flex flex-col sm:gap-6">
      {images.map((image) => (
        <Card key={image.date} image={image} />
      ))}
      {skeletons !== 0 &&
        [...Array(skeletons)].map((e, i) => {
          <Card key={i} />;
        })}
      <div ref={endRef} />
    </div>
  );
};

export default Home;
