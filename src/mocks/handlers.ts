// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import type { User } from "../models/types";

const roles = ["admin", "manager", "member"] as const;


let users: User[] = Array.from({ length: 100 }, (_, i) => {
  const role = roles[i % roles.length];
  const now = new Date();

  return {
    id: `${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? "active" : "inactive",
    createdAt: now.toISOString(),
    groups: [],
    role,
  };
});

export const handlers = [
  // GET users
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const query = url.searchParams.get("query") || "";
    const status = url.searchParams.get("status") || "";

    let filtered = users;
    if (query) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((u) => u.status === status);
    }

    const start = page * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return HttpResponse.json(
      {
        data: paginated,
        total: filtered.length,
      },
      { status: 200 }
    );
  }),

  // PATCH user status
  http.patch("/api/users/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { status: "active" | "inactive" };

    const user = users.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    // update status in mock array
    user.status = body.status;

    return HttpResponse.json(user, { status: 200 });
  }),
];