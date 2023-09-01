import { NextApiRequest, NextApiResponse } from "next";

import { ChatFormValues } from "app/chat/dropbox-chat/DropboxChat.types";
import logger from "providers/logger";
import { FunctionCallName } from "providers/chat/chat.types";
import chat from "providers/chat";
import openai from "providers/openai";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`getting chat completion from model ${openai.model}`);

    const data: ChatFormValues = JSON.parse(request.body);

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [{ role: "user", content: data.message }],
      model: openai.model,
      functions: [
        {
          name: FunctionCallName.extract_content_from_pdf_file,
          description: "Get the full text of a PDF file and explain it",
          parameters: {
            type: "object",
            properties: {
              file_name: {
                type: "string",
                description: "The name of a PDF file, e.g. a-file.pdf",
              },
              unit: { type: "string" },
            },
            required: ["file_name"],
          },
        },
      ],
    });

    logger.info(chatCompletion);

    const { choices, promises } = chat.processFunctionCalls(chatCompletion.choices);

    if (promises.length > 0) {
      const responses = await Promise.all(promises.map((promise) => promise()));

      response.status(200).json({ choices: responses });

      return;
    }

    response.status(200).json({ choices });
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
      choices: [
        {
          message: {
            role: "assistant",
            content: "Apologies, I couldn't resolve this request. Try again.",
          },
        },
      ],
    });
  }
}
