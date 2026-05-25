import { useState } from 'react';
import styles from './index.module.css';

export function ErrorTestButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (shouldThrowError) {
    throw new Error('Test application error');
  }

  return (
    <button
      type="button"
      className={styles.errorTestButton}
      onClick={() => setShouldThrowError(true)}
    >
      Test error
    </button>
  );
}
