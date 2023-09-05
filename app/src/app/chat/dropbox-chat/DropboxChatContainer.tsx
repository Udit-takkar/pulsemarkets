import { Form as RFForm } from "react-final-form";
import { FormApi } from "final-form";
import { useEffect } from "react";
import { DropboxESignRequest } from "api/chat/types";

import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useMessageContext } from "context/message/useMessageContext";
import { ChatContextMessage } from "context/message/MessageContext.types";

import { DropboxChat } from "./DropboxChat";
import { ChatFormValues, FieldNames } from "./DropboxChat.types";

export const DropboxChatContainer = () => {
  const routes = useRoutes();

  const messageContext = useMessageContext();

  useEffect(() => {
    messageContext.displayInitialMessage();
  }, []);

  const onSubmit = async (values: ChatFormValues, form: FormApi<ChatFormValues>) => {
    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: true }));

    const message: ChatContextMessage = { content: values.message, role: "user", type: "text" };

    messageContext.appendMessage(message);

    const loadingMessage = messageContext.appendMessage({
      type: "readonly",
      content: "Processing...",
      role: "assistant",
    });

    try {
      form.reset();

      const messages = messageContext.getPlainMessages();

      const result = await fetch(routes.api.chat.dropboxESign(), {
        method: "POST",
        body: JSON.stringify({
          messages,
          currentMessage: messageContext.extractApiRequestValues(message),
        } as DropboxESignRequest),
      });

      const json = await result.json();

      console.log(json);

      messageContext.deleteMessage(loadingMessage.id!);

      if (json.error) {
        throw new Error(json.error);
      }

      messageContext.appendMessage({ ...json.choices[0].message, type: "text" });
    } catch (error) {
      console.log(error);

      messageContext.deleteMessage(loadingMessage.id!);

      messageContext.appendMessage({
        content: `Apologies, I wasn't able to complete your request.

        - Maybe the file is too large?
        - The content may be unreadable
        - Check your internet connection`,
        role: "assistant",
        type: "text",
      });

      form.mutators.setValue(FieldNames.message, values.message);
    }

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: false }));
  };

  return (
    <RFForm
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => <DropboxChat onSubmit={handleSubmit} />}
    />
  );
};
