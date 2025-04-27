import { Todo } from "~/types";

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    const todos = await $fetch<Todo[]>(
      "http://localhost:3000/todos?_sort=-createdAt,-userId,-id"
    );
    return todos;
  }

  if (method === "POST") {
    const body = await readBody(event);
    const newTodo = await $fetch<Todo>("http://localhost:3000/todos", {
      method: "POST",
      body: {
        ...body,
        userId: 99,
        createdAt: new Date(),
      },
    });
    return newTodo;
  }

  if (method === "DELETE") {
    const body = await readBody(event);
    console.log(body);
    const deletedTodo = await $fetch<Todo>(
      `http://localhost:3000/todos/${body.id}`,
      {
        method: "DELETE",
      }
    );
    return deletedTodo;
  }

  throw createError({
    statusCode: 405,
    message: "Method not allowed",
  });
});
