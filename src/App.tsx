import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, Route, Routes, useSearchParams } from 'react-router-dom';
import { DetailsPanel } from './components/DetailsPanel';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { SelectedItemsFlyout } from './components/SelectedItemsFlyout';
import { ThemeProvider } from './context/ThemeProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  characterListQueryKey,
  useCharactersQuery,
} from './query/characterQueries';
import { QueryProvider } from './query/QueryProvider';
import styles from './App.module.css';

const FIRST_PAGE = 1;

function MainPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useLocalStorage(
    'characterSearchTerm',
    ''
  );
  const pageParam = Number(searchParams.get('page'));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : FIRST_PAGE;
  const detailsId = searchParams.get('details');
  const charactersQuery = useCharactersQuery({
    searchTerm,
    page: currentPage,
  });
  const characters = charactersQuery.data?.characters ?? [];
  const totalPages = charactersQuery.data?.totalPages ?? 1;
  const errorMessage =
    charactersQuery.error instanceof Error ? charactersQuery.error.message : '';
  const isLoading = charactersQuery.isPending || charactersQuery.isFetching;

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

  const handleSearch = (nextSearchTerm: string) => {
    if (nextSearchTerm === searchTerm) {
      return;
    }

    setSearchTerm(nextSearchTerm);
    setSearchParams({ page: String(FIRST_PAGE) });
  };

  const handleSearchTermChange = () => {
    if (currentPage !== FIRST_PAGE || detailsId) {
      setSearchParams({ page: String(FIRST_PAGE) });
    }
  };

  const handlePageChange = (page: number) => {
    updateParams(page);
  };

  const handleSelectCharacter = (id: number) => {
    updateParams(currentPage, String(id));
  };

  const handleCloseDetails = () => {
    updateParams(currentPage, null);
  };

  const handleRefreshCharacters = () => {
    void queryClient.invalidateQueries({
      queryKey: characterListQueryKey(searchTerm, currentPage),
    });
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
          onRefresh={handleRefreshCharacters}
        />

        <Outlet context={{ onClose: handleCloseDetails }} />
      </div>

      <SelectedItemsFlyout />
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
    <QueryProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route index element={<DetailsPanel />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ThemeProvider>
    </QueryProvider>
  );
}
