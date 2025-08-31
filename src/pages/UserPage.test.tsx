import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UsersPage from "./UserPage";
import { worker } from "../mocks/browser";
import { beforeAll, afterAll, afterEach, test, expect } from "vitest";

// Start/stop MSW mock server
beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

test("renders Users List title", () => {
  render(<UsersPage />);
  expect(screen.getByText(/Users List/i)).toBeInTheDocument();
});

test("loads users into table", async () => {
  render(<UsersPage />);
  await waitFor(() => {
    expect(screen.getByText(/User 1/i)).toBeInTheDocument();
  });
});

test("toggles user status with optimistic UI", async () => {
  render(<UsersPage />);

  // wait for user to load
  const firstUser = await screen.findByText(/User 1/i);
  expect(firstUser).toBeInTheDocument();

  // ✅ select first user row (checkbox)
  const firstCheckbox = screen.getAllByRole("checkbox")[1]; // first row's checkbox
  fireEvent.click(firstCheckbox);

  // ✅ click the "Toggle Status" chip/button
  const toggleBtn = screen.getByText(/Toggle Status/i);
  fireEvent.click(toggleBtn);

  // ✅ expect a snackbar to appear with "inactive" (since User 1 started active)
  await waitFor(() => {
    expect(screen.getByText(/User 1 inactive/i)).toBeInTheDocument();
  });

  // ✅ check if status chip in table updated
  await waitFor(() => {
    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
  });
});