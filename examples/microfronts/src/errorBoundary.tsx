import React from "react";

export class ErrorBoundary extends React.Component<
  { fallback: (error: unknown) => React.ReactNode; children: React.ReactNode },
  { error: unknown }
> {
  state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) return this.props.fallback(this.state.error);
    return this.props.children;
  }
}