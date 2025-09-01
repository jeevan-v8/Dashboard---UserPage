import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container
      maxWidth="md"
      sx={{ textAlign: "center", paddingTop: "5rem" }}
    >
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go Home
      </Button>
    </Container>
  );
}