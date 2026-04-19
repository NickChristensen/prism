import type { BaseComponentProps } from "@json-render/react";
import { lazy, Suspense } from "react";
import { z } from "zod";

export const tweetPropsSchema = z.object({
  id: z.string(),
});

type TweetProps = z.infer<typeof tweetPropsSchema>;

export const tweetDefinition = {
  props: tweetPropsSchema,
  description:
    "Single tweet card fetched by tweet id. Best for rendering a standalone bookmarked tweet or social post snapshot.",
};

const UITweet = lazy(() =>
  import("@/components/ui/tweet").then((module) => ({ default: module.Tweet })),
);

export function Tweet({ props }: BaseComponentProps<TweetProps>) {
  return (
    <Suspense fallback={null}>
      <UITweet id={props.id} />
    </Suspense>
  );
}
