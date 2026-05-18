import { useEffect, useState } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchCharacters, type CharacterCardData } from './api/characters';
import styles from './App.module.css';

const FIRST_PAGE = 1;

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useLocalStorage(
    'characterSearchTerm',
    ''
  );
  const [characters, setCharacters] = useState<CharacterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: String(FIRST_PAGE) }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let isActive = true;

    async function loadCharacters() {
      try {
        const nextCharacters = await fetchCharacters({
          searchTerm,
          page: FIRST_PAGE,
        });

        if (isActive) {
          setCharacters(nextCharacters);
          setErrorMessage('');
        }
      } catch (error) {
        const nextErrorMessage =
          error instanceof Error ? error.message : 'Unable to load characters.';

        if (isActive) {
          setCharacters([]);
          setErrorMessage(nextErrorMessage);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCharacters();

    return () => {
      isActive = false;
    };
  }, [searchTerm]);

  const handleSearch = (nextSearchTerm: string) => {
    if (nextSearchTerm === searchTerm) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSearchTerm(nextSearchTerm);
    setSearchParams({ page: String(FIRST_PAGE) });
  };

  return (
    <main className={styles.app}>
      <SearchSection
        searchTerm={searchTerm}
        isLoading={isLoading}
        onSearch={handleSearch}
      />

      <ResultsSection
        characters={characters}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </main>
  );
}

function AboutPage() {
  return (
    <main className={styles.page}>
      <h1>About</h1>
      <p>Author: Sandro</p>
      <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
        RS School React course
      </a>
      <Link to="/?page=1">Back to search</Link>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/?page=1">Return to the main app</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
