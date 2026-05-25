import { useTheme } from '../../context/useTheme';
import styles from './index.module.css';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <label className={styles.themeSelector}>
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) =>
          setTheme(event.target.value === 'dark' ? 'dark' : 'light')
        }
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
