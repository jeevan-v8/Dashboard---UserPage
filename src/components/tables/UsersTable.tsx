// src/components/UsersTable.tsx
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Chip,
  Stack,
} from "@mui/material";
import type {
  PaginationState,
  SortingState,
  VisibilityState,
  OnChangeFn,
} from "@tanstack/react-table";
import type { User } from "../../models/types";

export interface UsersTableProps {
  data: User[];
  loading: boolean;
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  columnVisibility: VisibilityState;
  sorting: SortingState;
  globalFilter: string;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  onSortingChange: OnChangeFn<SortingState>;
  onGlobalFilterChange: (updater: string) => void;
  onToggleStatus: (selectedUsers: User[]) => Promise<void>;
}

export default function UsersTable({
  data,
  loading,
  rowCount,
  pagination,
  onPaginationChange,
  columnVisibility,
  sorting,
  globalFilter,
  onColumnVisibilityChange,
  onSortingChange,
  onGlobalFilterChange,
  onToggleStatus,
}: UsersTableProps) {
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
        cell.getValue<string>()
          ? new Date(cell.getValue<string>()).toLocaleDateString()
          : "-",
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

  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
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
      onPaginationChange={onPaginationChange}
      layoutMode="grid"
      enableRowSelection
      enableGlobalFilter
      enableColumnFilters
      enableRowVirtualization={process.env.NODE_ENV !== "test"}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onSortingChange={onSortingChange}
      onGlobalFilterChange={onGlobalFilterChange}
      muiToolbarAlertBannerProps={
        data.length === 0 && !loading
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
            onClick={() => onToggleStatus(selectedUsers)}
            disabled={!selectedUsers.length}
            aria-label="Toggle selected users status"
          />
        );
      }}
    />
  );
}