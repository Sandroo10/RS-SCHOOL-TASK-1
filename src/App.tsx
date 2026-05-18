import { useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes, useSearchParams } from 'react-router-dom';
import { DetailsPanel } from './components/DetailsPanel';
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
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const pageParam = Number(searchParams.get('page'));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : FIRST_PAGE;
  const detailsId = searchParams.get('details');

  const updateParams = (page: number, nextDetailsId = detailsId) => {
    const nextParams = new URLSearchParams();

    nextParams.set('page', String(page));

    if (nextDetailsId) {
      nextParams.set('details', nextDetailsId);
    }

    setSearchParams(nextParams);
  };

  useEffect(() => {
    if (searchParams.get('page') !== String(currentPage)) {
      updateParams(currentPage);
    }
  });

  useEffect(() => {
    let isActive = true;

    async function loadCharacters() {
      try {
        const nextPage = await fetchCharacters({
          searchTerm,
          page: currentPage,
        });

        if (isActive) {
          setCharacters(nextPage.characters);
          setTotalPages(nextPage.totalPages);
          setErrorMessage('');
        }
      } catch (error) {
        const nextErrorMessage =
          error instanceof Error ? error.message : 'Unable to load characters.';

        if (isActive) {
          setCharacters([]);
          setTotalPages(1);
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
  }, [currentPage, searchTerm]);

  const handleSearch = (nextSearchTerm: string) => {
    if (nextSearchTerm === searchTerm) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSearchTerm(nextSearchTerm);
    setSearchParams({ page: String(FIRST_PAGE) });
  };

  const handleSearchTermChange = () => {
    if (currentPage !== FIRST_PAGE || detailsId) {
      setSearchParams({ page: String(FIRST_PAGE) });
    }
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setErrorMessage('');
    updateParams(page);
  };

  const handleSelectCharacter = (id: number) => {
    updateParams(currentPage, String(id));
  };

  const handleCloseDetails = () => {
    updateParams(currentPage, null);
  };

  return (
    <main className={styles.app}>
      <SearchSection
        searchTerm={searchTerm}
        isLoading={isLoading}
        onSearch={handleSearch}
        onSearchTermChange={handleSearchTermChange}
      />

      <div className={detailsId ? styles.splitView : styles.singleView}>
        <ResultsSection
          characters={characters}
          isLoading={isLoading}
          errorMessage={errorMessage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSelectCharacter={handleSelectCharacter}
        />

        <Outlet context={{ onClose: handleCloseDetails }} />
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main className={styles.page}>
      <h1>About</h1>
      <p>Author: Sandro</p>
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
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
      <Route path="/" element={<MainPage />}>
        <Route index element={<DetailsPanel />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
