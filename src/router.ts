import http from "http";
import { User, users } from "./models/user";
import { parseRequestBody } from "./utils/request-parser";

export async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host}`);
  const path = parsedUrl.pathname;

  if (path === "/api/users") {
    await handleUsersRequest(req, res);
  } else if (path.match(/^\/api\/users\/\d+$/)) {
    const userId = Number(path.split("/").pop());
    await handleUserRequest(req, res, userId);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
}

async function handleUsersRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  switch (req.method) {
    case "GET":
      res.writeHead(200);
      res.end(JSON.stringify(users));
      break;

    case "POST":
      try {
        const body = await parseRequestBody<Omit<User, "id">>(req);
        if (!body.name || !body.email) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Name and email are required" }));
          return;
        }

        const newId =
          users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
        const newUser: User = {
          id: newId,
          name: body.name,
          email: body.email,
        };

        users.push(newUser);
        res.writeHead(201);
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid request body" }));
      }
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }
}

async function handleUserRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: number
): Promise<void> {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }

  switch (req.method) {
    case "GET":
      res.writeHead(200);
      res.end(JSON.stringify(users[userIndex]));
      break;

    case "PUT":
      try {
        const body = await parseRequestBody<Omit<User, "id">>(req);
        if (!body.name && !body.email) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Name or email is required" }));
          return;
        }

        users[userIndex] = {
          ...users[userIndex],
          name: body.name,
          email: body.email,
        };

        res.writeHead(200);
        res.end(JSON.stringify(users[userIndex]));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid request body" }));
      }
      break;

    case "DELETE":
      const deletedUser = users.splice(userIndex, 1);
      users.splice(userIndex, 1);

      res.writeHead(200);
      res.end(JSON.stringify(deletedUser));
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }
}
