export default {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Long Phan Todo API",
    description: "API for managing tasks",
  },
  basePath: "/",
  tags: [{ name: "Tasks", description: "Endpoints related to task management" }],
  paths: {
    "/tasks": {
      get: {
        summary: "Get all tasks",
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
      post: {
        summary: "Add a new task",
        consumes: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                task: { type: "string" },
              },
              required: ["task"],
            },
          },
        ],
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Get detail of a task",
        parameters: [{ name: "id", in: "path", type: "string", required: true }],
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
      patch: {
        summary: "Edit a task",
        consumes: ["application/json"],
        parameters: [
          { name: "id", in: "path", type: "string", required: true },
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                task: { type: "string" },
                status: { type: "string" },
              },
              required: ["task", "status"],
            },
          },
        ],
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
      delete: {
        summary: "Delete a task",
        parameters: [{ name: "id", in: "path", type: "string", required: true }],
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
    },
    "/tasks/remove/completed": {
      delete: {
        summary: "Delete all completed tasks",
        tags: ["Tasks"],
        responses: { 200: { description: "Success" } },
      },
    },
  },
};
