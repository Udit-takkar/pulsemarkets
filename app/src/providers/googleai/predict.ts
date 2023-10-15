import { helpers } from "@google-cloud/aiplatform";

import logger from "providers/logger";

import predictionServiceClient from "./prediction-service-client";
import { Prompt } from "./googleai.types";

const predict = async (prompt: Prompt, endpoint: string) => {
  const instanceValue = helpers.toValue(prompt);

  const instances = [instanceValue] as protobuf.common.IValue[];

  const parameter = {
    temperature: 1,
    maxOutputTokens: 1000,
    topP: 0.95,
    topK: 40,
  };

  const parameters = helpers.toValue(parameter);

  logger.info(`predict: ${endpoint}`);

  return predictionServiceClient.predict({
    endpoint,
    instances,
    parameters,
  });
};

export default predict;
