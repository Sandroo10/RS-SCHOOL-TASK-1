import { Component } from 'react';
import styles from './index.module.css';

interface ErrorTestButtonState {
  shouldThrowError: boolean;
}

export class ErrorTestButton extends Component<
  Record<string, never>,
  ErrorTestButtonState
> {
  state: ErrorTestButtonState = {
    shouldThrowError: false,
  };

  handleClick = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test application error');
    }

    return (
      <button
        type="button"
        className={styles.errorTestButton}
        onClick={this.handleClick}
      >
        Test error
      </button>
    );
  }
}
