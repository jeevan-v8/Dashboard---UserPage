// src/pages/UsersPage.tsx
import { useEffect, useState } from "react";
// import { useMemo } from "react";
import { fetchUsers, updateUserStatus } from "../api/users";
import { type User } from "../models/types";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Container,
  Paper,
  Typography,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "./UserPage.module.css";
import type { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import ErrorBoundary from "../components/errorBoundary";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Load saved state from localStorage on mount
    const savedState = JSON.parse(localStorage.getItem("tableState") || "{}");

    const [columnVisibility, setColumnVisibility] = useState(
      savedState.columnVisibility || {}
    );
    const [sorting, setSorting] = useState(savedState.sorting || []);
    const [globalFilter, setGlobalFilter] = useState(savedState.globalFilter || "");

  useEffect(() => {
    setLoading(true);
    fetchUsers(pagination.pageIndex, pagination.pageSize)
      .then((res) => {
        setUsers(res.data);
        setRowCount(res.total);
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [pagination.pageIndex, pagination.pageSize]);

  // Save state changes to localStorage
useEffect(() => {
  localStorage.setItem(
    "tableState",
    JSON.stringify({ columnVisibility, sorting, globalFilter })
  );
}, [columnVisibility, sorting, globalFilter]);

  // ✅ Inline column definitions
  const columns: MRT_ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 220,
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 260,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue<string>()}
          color={cell.getValue<string>() === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      size: 140,
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("YYYY-MM-DD"),
    },
    {
      accessorKey: "groups",
      header: "Groups",
      size: 280,
      Cell: ({ cell }) => (
        <Stack direction="row" spacing={1}>
          {(cell.getValue<any[]>() ?? []).map((g, i) => (
            <Chip key={i} label={g.name ?? g} size="small" />
          ))}
        </Stack>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 180,
      Cell: ({ cell }) => {
        const role = cell.getValue<string>();
        return (
          <Chip
            label={role}
            color={
              role === "admin"
                ? "error"
                : role === "manager"
                ? "warning"
                : "default"
            }
            size="small"
          />
        );
      },
    }
  ];

  // ✅ Optimistic update for status toggle
  const handleToggleStatus = async (selectedUsers: User[]) => {
    if (!selectedUsers.length) return;

    const updated = [...users];
    for (const user of selectedUsers) {
      const newStatus = user.status === "active" ? "inactive" : "active";

      // Optimistic update
      const index = updated.findIndex((u) => u.id === user.id);
      if (index > -1) updated[index] = { ...user, status: newStatus };
      setUsers([...updated]);

      try {
        await updateUserStatus(user.id, newStatus);
        setSnackbar({
          open: true,
          message: `User ${user.name} ${newStatus}`,
          severity: "success",
        });
      } catch {
        setSnackbar({
          open: true,
          message: `Failed to update ${user.name}`,
          severity: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" className={styles.pageWrapper}>
      <Paper elevation={0} className={styles.tableWrapper}>
        <Typography variant="h5" gutterBottom className={styles.pagetitle}>
          Users List
        </Typography>

        <ErrorBoundary>
          <MaterialReactTable
            columns={columns}
            data={users}
            state={{
              isLoading: loading,
              pagination,
              showSkeletons: loading,
              columnVisibility,
              sorting,
              globalFilter,
            }}
            manualPagination
            rowCount={rowCount}
            onPaginationChange={setPagination}
            layoutMode="grid"
            enableRowSelection
            enableGlobalFilter
            enableColumnFilters // ✅ per-column filters
            enableRowVirtualization // ✅ virtualization
            onColumnVisibilityChange={setColumnVisibility}
            onSortingChange={setSorting}
            onGlobalFilterChange={setGlobalFilter}
            muiToolbarAlertBannerProps={
              users.length === 0 && !loading
                ? { color: "warning", children: "No users found" }
                : undefined
            }
            renderTopToolbarCustomActions={({ table }) => {
              const selectedUsers = table
                .getSelectedRowModel()
                .flatRows.map((row) => row.original);

              return (
                <Chip
                  label="Toggle Status"
                  color="primary"
                  onClick={() => handleToggleStatus(selectedUsers)}
                  disabled={!selectedUsers.length}
                  aria-label="Toggle selected users status" // ✅ accessibility
                />
              );
            }}
          />
        </ErrorBoundary>

        {/* Snackbar same as before */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}