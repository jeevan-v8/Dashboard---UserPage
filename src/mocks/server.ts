// src/mocks/server.ts//optional
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);