// src/pages/UsersPage.tsx
import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "../../api/users";
import { type User } from "../../models/types";
import { Container, Paper, Typography, Snackbar, Alert } from "@mui/material";
import styles from "./UsersPage.module.css";
import type {
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import UsersTable from "../../components/tables";
import ErrorBoundary from "../../components/errorBoundary";
import MainLayout from "../../layouts/MainLayouts";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const savedState = JSON.parse(localStorage.getItem("tableState") || "{}");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    savedState.columnVisibility || {}
  );
  const [sorting, setSorting] = useState<SortingState>(
    savedState.sorting || []
  );
  const [globalFilter, setGlobalFilter] = useState<string>(
    savedState.globalFilter || ""
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

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

  useEffect(() => {
    localStorage.setItem(
      "tableState",
      JSON.stringify({ columnVisibility, sorting, globalFilter })
    );
  }, [columnVisibility, sorting, globalFilter]);

  const handleToggleStatus = async (selectedUsers: User[]) => {
    if (!selectedUsers.length) return;
    const updated = [...users];

    for (const user of selectedUsers) {
      const newStatus = user.status === "active" ? "inactive" : "active";
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

          <UsersTable
            data={users}
            loading={loading}
            rowCount={rowCount}
            pagination={pagination}
            onPaginationChange={(updater) =>
              setPagination((prev) =>
                typeof updater === "function" ? updater(prev) : updater
              )
            }
            columnVisibility={columnVisibility}
            sorting={sorting}
            globalFilter={globalFilter}
            onColumnVisibilityChange={(updater) =>
              setColumnVisibility((prev) =>
                typeof updater === "function" ? updater(prev) : updater
              )
            }
            onSortingChange={(updater) =>
              setSorting((prev) =>
                typeof updater === "function" ? updater(prev) : updater
              )
            }
            onGlobalFilterChange={setGlobalFilter}
            onToggleStatus={handleToggleStatus}
          />
          
        </ErrorBoundary>

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