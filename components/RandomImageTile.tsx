import { useEffect, useState } from "react";
import { Skeleton } from "./Skeleton";
import { ApodMedia, useNasaApi } from "../contexts/NasaApiContext";
import Link from "next/link";

export const RandomImageTile = () => {
  const { getRandomApod } = useNasaApi();
  const [image, setImage] = useState<ApodMedia | undefined>(undefined);

  useEffect(() => {
    getRandomApod().then((image) => setImage(image));
  }, []);

  useEffect(() => {
    if (
      image &&
      (image.media_type === "other" ||
        (image.media_type === "video" && image.thumbnail_url === ""))
    ) {
      getRandomApod().then((image) => setImage(image));
    }
  }, [image]);

  if (
    image &&
    image.media_type !== "other" &&
    !(image.media_type === "video" && image.thumbnail_url === "")
  ) {
    const url = new URL(location.href).origin + "/p/" + image.date;

    return (
      <Link href={url}>
        <a className="block w-full relative pt-[100%]">
          <Skeleton
            height="100%"
            width="100%"
            className="top-0 absolute"
            variant="rectangular"
          />
          <img
            className="block absolute top-0 w-full h-full object-cover"
            src={image.media_type === "image" ? image.url : image.thumbnail_url}
            alt={image.title}
          />
        </a>
      </Link>
    );
  } else {
    return (
      <div className="block w-full relative pt-[100%]">
        <Skeleton
          height="100%"
          width="100%"
          className="top-0 absolute"
          variant="rectangular"
        />
      </div>
    );
  }
};
