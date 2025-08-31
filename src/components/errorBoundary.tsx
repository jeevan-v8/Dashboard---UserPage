import { Component, ReactNode } from "react";
import { Alert } from "@mui/material";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: string | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Alert severity="error">Something went wrong: {this.state.error}</Alert>;
    }
    return this.props.children;
  }
}