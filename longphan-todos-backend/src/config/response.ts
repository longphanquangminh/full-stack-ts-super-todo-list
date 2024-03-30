import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export const responseData = (c: Context, message: string, content: any, statusCode: StatusCode) => {
  return c.json(
    {
      statusCode,
      message,
      content,
      date: new Date(),
    },
    statusCode,
  );
};
