import { Skeleton as MuiSkeleton, SkeletonProps } from "@mui/material";

export const Skeleton = (props: SkeletonProps) => {
  const { className, ...others } = props;

  const classes = [className];
  classes.push("dark:bg-white/10");

  return <MuiSkeleton {...others} className={classes.join(" ")} />;
};
