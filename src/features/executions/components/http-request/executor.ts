import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonString);
  }
  catch(error) {
    throw new Error(`Failed to serialize context to JSON: ${error}`);
  }
});

type HttpRequestData = {
  variablaName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variablaName) {
    throw new NonRetriableError("Variable name not defined.");
  }
  if (!data.method) {
    throw new NonRetriableError("Method not defined.");
  }
  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    console.log(' ENDPOINT: ', endpoint);
    const method = data.method;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body)(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    
    return {
      ...context,
      [data.variableName]: responsePayload,
    }
  });

  return result;
};