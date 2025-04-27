import { Todo } from "~/types";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID is required",
    });
  }

  if (method === "GET") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const todo = await $fetch<Todo>(`http://localhost:3000/todos/${id}`);
    return todo;
  }

  throw createError({
    statusCode: 405,
    message: "Method not allowed",
  });
});
