import { useEffect, useRef, useState } from "react";
import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";

import { ApodMedia } from "../contexts/NasaApiContext";
import { Skeleton } from "./Skeleton";
import styles from "./Card.module.css";

interface Props {
  image?: ApodMedia;
}

export const Card = ({ image }: Props) => {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 2) {
      setLiked(true);
    }
  }, [clickCount]);

  if (image) {
    const date = new Date(image.date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as const;
    const dateString = new Intl.DateTimeFormat("en", options).format(date);

    const clickImage = () => {
      setClickCount((count) => count + 1);
      setTimeout(() => setClickCount((count) => Math.max(count - 1, 0)), 300);
    };

    return (
      <div className={styles.card}>
        <div className={styles.title}>{image.title}</div>
        <img
          onClick={clickImage}
          className={styles.media}
          src={image.media_type === "image" ? image.url : image.thumbnail_url}
          alt={image.title}
        />
        <div className={styles.content}>
          <div className={styles.actions}>
            <button className="p-2" onClick={() => setLiked((value) => !value)}>
              {liked ? (
                <Favorite className={styles.ping} htmlColor="#ed4956" />
              ) : (
                <FavoriteBorderOutlined className="hover:text-gray-500" />
              )}
            </button>
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
      </div>
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
        <div className={styles.actions}>
          <div className="p-2">
            <FavoriteBorderOutlined />
          </div>
        </div>
        <div className={styles.content}>
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
