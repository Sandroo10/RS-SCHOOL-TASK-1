import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

interface SearchSectionProps {
  searchTerm: string;
  isLoading: boolean;
  onSearch: (searchTerm: string) => void;
}

export function SearchSection({
  searchTerm,
  isLoading,
  onSearch,
}: SearchSectionProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearchTerm = inputValue.trim();
    setInputValue(trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
  };

  return (
    <section className={styles.searchSection}>
      <nav className={styles.navigation}>
        <h1>Character Search</h1>
        <Link to="/about">About</Link>
      </nav>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={inputValue}
          onChange={handleInputChange}
        />

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          Search
        </button>
      </form>
    </section>
  );
}
