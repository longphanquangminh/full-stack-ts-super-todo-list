import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(<string>process.env.DATABASE_URL_LONGPHAN);

export const db = drizzle(sql, {
  schema,
});
