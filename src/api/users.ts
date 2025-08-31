
// src/api/users.ts
// src/api/users.ts
import axios from "axios";
import type { User } from "../models/types";

export async function fetchUsers(
  page = 0,
  pageSize = 10,
  query = "",
  status = ""
): Promise<{ data: User[]; total: number }> {
  const res = await axios.get<{ data: User[]; total: number }>("/api/users", {
    params: { page, pageSize, query, status },
  });
  return res.data;
}

// ✅ Toggle user status (PATCH /api/users/:id)
export async function updateUserStatus(
  id: string,
  status: "active" | "inactive"
): Promise<User> {
  const res = await axios.patch<User>(`/api/users/${id}`, { status });
  return res.data;
}

