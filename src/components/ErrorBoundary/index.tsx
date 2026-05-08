import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './index.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className={styles.app}>
          <section className={styles.fallbackSection}>
            <h1>Something went wrong.</h1>
            <p>Please refresh the page and try again.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
