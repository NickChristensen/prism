import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const chatMessageSchema = z.object({
  text: z.string(),
  created_at: z.iso.datetime(),
  sender: z.string().optional(),
  sender_name: z.string().optional(),
  is_from_me: z.boolean(),
});

const chatThreadSchema = z.object({
  chat_id: z.number().int(),
  name: z.string(),
  identifier: z.string(),
  messages: z.array(chatMessageSchema),
});

const chatPropsSchema = z.object({
  thread: chatThreadSchema,
});

type ChatMessage = z.infer<typeof chatMessageSchema>;
type ChatProps = z.infer<typeof chatPropsSchema>;

export const chatDefinition = {
  props: chatPropsSchema,
  description:
    "Use for an iMessage, SMS, or chat conversation thread. Pass an entire thread, including its name and messages array; the component handles sorting distinguishing message senders, and displaying message timestamps. Best for sitrep message threads, conversational exchanges, group chats, or direct-message transcripts.",
};

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <p
      className={cn(
        "max-w-8/10 px-3 py-2 text-sm leading-snug rounded-2xl",
        message.is_from_me
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : "bg-muted text-foreground rounded-bl-sm",
      )}
    >
      {message.text}
    </p>
  );
}

function MessageCluster({ messages }: { messages: ChatMessage[] }) {
  const lastMessage = messages.at(-1);
  const metaClasses = "mx-1 text-xs text-muted-foreground";

  if (!lastMessage) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        lastMessage.is_from_me ? "items-end" : "items-start",
      )}
    >
      {!lastMessage.is_from_me && (
        <p className={metaClasses}>{lastMessage.sender_name}</p>
      )}
      {messages.map((message) => (
        <MessageBubble key={message.created_at} message={message} />
      ))}
      <p className={metaClasses}>
        {new Date(lastMessage.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export function Chat({ props }: BaseComponentProps<ChatProps>) {
  const messages = [...props.thread.messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const messagesGroupedByAdjacentSender = messages.reduce(
    (acc: ChatMessage[][], message) => {
      if (acc.length === 0) {
        return [[message]];
      }

      const lastGroup = acc[acc.length - 1];
      const lastMessage = lastGroup[lastGroup.length - 1];

      if (lastMessage.sender === message.sender) {
        lastGroup.push(message);
        return acc;
      }

      return [...acc, [message]];
    },
    [],
  );

  const threadName =
    props.thread.name ||
    Array.from(
      new Set(
        props.thread.messages
          .map((message) => message.sender_name)
          .filter(Boolean),
      ),
    ).join(", ");

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-center">{threadName}</h3>
      {messagesGroupedByAdjacentSender.map((group) => (
        <MessageCluster key={group[0].created_at} messages={group} />
      ))}
    </div>
  );
}
