import { useEffect, useState } from "react";
import { Tooltip, ClickAwayListener } from "@mui/material";
import { Favorite, FavoriteBorderOutlined, Share } from "@mui/icons-material";

import { useSpacestagram } from "../contexts/SpacestagramContext";
import {
  ApodMedia,
  NasaApiError,
  useNasaApi,
} from "../contexts/NasaApiContext";
import { Skeleton } from "./Skeleton";
import styles from "./Card.module.css";
import { useSnackbar } from "../contexts/SnackbarContext";

interface Props {
  date: string;
  image?: ApodMedia;
}

export const Card = ({ date }: Props) => {
  const { getApodByDate } = useNasaApi();
  const [image, setImage] = useState<ApodMedia | undefined>(undefined);

  const snackbar = useSnackbar();
  const { likes, addLike, removeLike } = useSpacestagram();

  const [expanded, setExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showAnimatedHeart, setShowAnimatedHeart] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  useEffect(() => {
    let retries = 0;
    const tryFetch = () => {
      getApodByDate(date)
        .then((image) => setImage(image))
        .catch((error: NasaApiError) => {
          if (retries === 0) {
            snackbar.push(`Failed to load image from NASA. Trying again.`, {
              severity: "warning",
            });
          }
          if (retries === 5) {
            snackbar.push(`${error.msg} from NASA`, {
              severity: "error",
            });
            return;
          }
          retries++;
          tryFetch();
        });
    };

    tryFetch();
  }, []);

  useEffect(() => {
    if (clickCount === 2) {
      addLike(date);
      setShowAnimatedHeart(true);
    }
  }, [clickCount]);

  if (image) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as const;
    const dateString = new Intl.DateTimeFormat("en", options).format(
      new Date(date)
    );

    const clickImage = () => {
      setClickCount((count) => count + 1);
      setTimeout(() => setClickCount((count) => Math.max(count - 1, 0)), 300);
    };

    return (
      <article className={styles.card} role="presentation">
        <div className={styles.title}>{image.title}</div>
        <div className={styles.media} onClick={clickImage}>
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
          {showAnimatedHeart && (
            <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center">
              <Favorite
                onAnimationEnd={() => setShowAnimatedHeart(false)}
                className={styles["animated-heart"]}
                htmlColor="#FFFFFF"
              />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.actions}>
            <button
              className="p-2"
              aria-label={likes.has(date) ? "Unlike" : "Like"}
              onClick={() => {
                if (likes.has(date)) removeLike(date);
                else addLike(date);
              }}
            >
              {likes.has(date) ? (
                <Favorite className={styles.ping} htmlColor="#ed4956" />
              ) : (
                <FavoriteBorderOutlined className="hover:text-gray-500" />
              )}
            </button>

            <ClickAwayListener onClickAway={() => setShowCopyTooltip(false)}>
              <Tooltip
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Link copied"
                open={showCopyTooltip}
                arrow
                placement="top"
              >
                <button
                  className="p-2"
                  aria-label="Share"
                  onClick={() => {
                    const { origin } = new URL(location.href);
                    navigator.clipboard.writeText(`${origin}/?p=${date}`);
                    setShowCopyTooltip(true);
                  }}
                >
                  <Share className="hover:text-gray-500" />
                </button>
              </Tooltip>
            </ClickAwayListener>
          </div>
          <div className={styles.description}>
            {expanded ? (
              <span>{image.explanation}</span>
            ) : (
              <>
                <span className={styles["description-short"]}>
                  {image.explanation}
                </span>
                <button
                  onClick={() => setExpanded(true)}
                  className={styles.more}
                >
                  more
                </button>
              </>
            )}
          </div>
          <div className={styles.date}>{dateString}</div>
        </div>
      </article>
    );
  } else {
    return (
      <article className={styles.card} role="presentation">
        <div className={styles.title}>
          <Skeleton width="200px" />
        </div>
        <Skeleton
          className={styles.media + " pt-[100%]"}
          variant="rectangular"
        />
        <div className={styles.content}>
          <div className={`${styles.actions} flex`}>
            <div className="p-2">
              <FavoriteBorderOutlined />
            </div>
            <div className="p-2">
              <Share />
            </div>
          </div>
          <div className={styles.description}>
            <Skeleton width="100%" />
          </div>
          <div className={styles.date}>
            <Skeleton width="70px" />
          </div>
        </div>
      </article>
    );
  }
};
