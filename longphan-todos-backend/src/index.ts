import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db";
import { tasks } from "./db/schema";
import { responseData } from "./config/response";
import { Status } from "./common/constants/status.const";
import { eq } from "drizzle-orm";
import { default as swaggerDocument } from "./swagger";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

app.use("*", cors());

app.get("/tasks", async c => {
  try {
    const result = await db.select().from(tasks).orderBy(tasks.id);
    return responseData(c, "Get tasks successfully!", result, 200);
  } catch {
    return responseData(c, "Get tasks failed! Try again!", "", 500);
  }
});

app.post("/tasks", async c => {
  try {
    const { task } = await c.req.json();
    if (!task || typeof task !== "string") {
      return responseData(c, "Post wrong data! Try again!", "", 400);
    }
    await db.insert(tasks).values({ task, status: Status.INCOMPLETE });
    return responseData(c, `Post task '${task}' successfully!`, "", 200);
  } catch {
    return responseData(c, "Post task failed! Try again!", "", 500);
  }
});

app.get("/tasks/:id", async c => {
  try {
    const { id } = c.req.param();
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, Number(id)),
    });
    if (!task) {
      return responseData(c, `Can't find task ID ${id}! Try again!`, "", 400);
    }
    return responseData(c, `Get task ID ${id} successfully!`, task, 200);
  } catch {
    return responseData(c, `Get task failed! Try again!`, "", 500);
  }
});

app.patch("/tasks/:id", async c => {
  try {
    const { id } = c.req.param();
    const taskEdit = await db.query.tasks.findFirst({
      where: eq(tasks.id, Number(id)),
    });
    if (!taskEdit) {
      return responseData(c, `Can't find task ID ${id}! Try again!`, "", 400);
    }
    const { task, status } = await c.req.json();
    if (!task && !status) {
      return responseData(c, "Patch wrong data! Try again!", "", 400);
    }
    if (task) {
      if (typeof task !== "string") {
        return responseData(c, "Task name must be a string! Try again!", "", 400);
      }
    }
    if (status) {
      if (status !== Status.INCOMPLETE && status !== Status.INPROGRESS && status !== Status.COMPLETED) {
        return responseData(c, "Status must be incomplete, inprogress or completed! Try again!", "", 400);
      }
    }
    await db
      .update(tasks)
      .set({ task: task ?? taskEdit.task, status: status ?? taskEdit.status, updatedAt: new Date() })
      .where(eq(tasks.id, Number(id)));
    return responseData(c, `Edit task ID ${id} successfully!`, "", 200);
  } catch {
    return responseData(c, "Edit task failed! Try again!", "", 500);
  }
});

app.delete("/tasks/:id", async c => {
  try {
    const { id } = c.req.param();
    const taskDelete = await db.query.tasks.findFirst({
      where: eq(tasks.id, Number(id)),
    });
    if (!taskDelete) {
      return responseData(c, `Can't find task ID ${id}! Try again!`, "", 400);
    }
    await db.delete(tasks).where(eq(tasks.id, Number(id)));
    return responseData(c, `Delete task ID ${id} successfully!`, "", 200);
  } catch {
    return responseData(c, "Delete task failed! Try again!", "", 500);
  }
});

app.delete("/tasks/remove/completed", async c => {
  try {
    const completedTasks = await db.query.tasks.findMany({
      where: eq(tasks.status, Status.COMPLETED),
    });

    await db.delete(tasks).where(eq(tasks.status, Status.COMPLETED));

    return responseData(c, `Deleted completed tasks successfully!`, "", 200);
  } catch {
    return responseData(c, "Delete tasks failed! Try again!", "", 500);
  }
});

app.get("/doc", async c => {
  return await c.json(swaggerDocument);
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

const port = 3000;
console.log(`Server is running on port: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
