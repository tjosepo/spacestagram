import { useEffect, useState } from "react";
import { Skeleton } from "./Skeleton";
import {
  ApodMedia,
  NasaApiError,
  useNasaApi,
} from "../contexts/NasaApiContext";
import Link from "next/link";
import { useSnackbar } from "../contexts/SnackbarContext";

export const RandomImageTile = () => {
  const snackbar = useSnackbar();
  const { getRandomApod } = useNasaApi();
  const [image, setImage] = useState<ApodMedia | undefined>(undefined);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      snackbar.push(`Getting images from NASA. It may take a while.`, {
        severity: "info",
      });
    }, 5000);
    getRandomApod()
      .then((image) => setImage(image))
      .catch((error: NasaApiError) => {
        snackbar.push(`${error.msg} from NASA`, { severity: "error" });
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });
  }, [getRandomApod, snackbar]);

  useEffect(() => {
    if (
      image &&
      (image.media_type === "other" ||
        (image.media_type === "video" && image.thumbnail_url === ""))
    ) {
      getRandomApod()
        .then((image) => setImage(image))
        .catch((error: NasaApiError) => {
          snackbar.push(`${error.msg} from NASA`, { severity: "error" });
        });
    }
  }, [getRandomApod, image, snackbar]);

  if (
    image &&
    image.media_type !== "other" &&
    !(image.media_type === "video" && image.thumbnail_url === "")
  ) {
    const url = new URL(location.href).origin + "/?p=" + image.date;

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
