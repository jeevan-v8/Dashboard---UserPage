// src/layouts/MainLayout.tsx
import { Container, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface MainLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function MainLayout({ title, children }: MainLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Top App Bar */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div">
            {title || "Admin Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}