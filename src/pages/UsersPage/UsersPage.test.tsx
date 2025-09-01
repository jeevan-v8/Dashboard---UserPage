// src/pages/UserPage.test.tsx
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { server } from "../../mocks/server";
import { beforeAll, afterAll, afterEach, test, expect } from "vitest";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders Users List title", () => {
  render(<UsersPage />);
  expect(screen.getByText(/Users List/i)).toBeInTheDocument();
});

test("loads users into table (regex anchor)", async () => {
  render(<UsersPage />);
  // Match only exact "User 1"
  const firstCell = await screen.findByRole("cell", { name: /^User 1$/i });
  expect(firstCell).toBeInTheDocument();
});

test("toggles user status with optimistic UI (regex anchor)", async () => {
  render(<UsersPage />);

  // Step 1: Find the exact User 1 cell
  const user1Cell = await screen.findByRole("cell", { name: /^User 1$/i });
  expect(user1Cell).toBeInTheDocument();

  // Step 2: Get the parent row
  const user1Row = user1Cell.closest("tr");
  expect(user1Row).not.toBeNull();

  // Step 3: Find checkbox inside that row
  const checkbox = within(user1Row as HTMLElement).getByRole("checkbox");
  fireEvent.click(checkbox);

  // Step 4: Click the toggle button
  const toggleBtn = screen.getByLabelText("Toggle selected users status");
  fireEvent.click(toggleBtn);

  // Step 5: Verify status cell changes
  await waitFor(() => {
    const statusCell = within(user1Row as HTMLElement).getByRole("cell", {
      name: /inactive|active/i,
    });
    expect(statusCell).toBeInTheDocument();
  });
});