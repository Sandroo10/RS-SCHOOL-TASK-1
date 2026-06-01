import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { CharacterCardData } from '../../api/characters';
import styles from './index.module.css';

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function createCsv(items: CharacterCardData[]) {
  const header = ['Name', 'Description', 'Details URL'];
  const rows = items.map((item) => [
    escapeCsvValue(item.name),
    escapeCsvValue(item.description),
    escapeCsvValue(`${window.location.origin}/?page=1&details=${item.id}`),
  ]);

  return [header.map(escapeCsvValue), ...rows]
    .map((row) => row.join(','))
    .join('\n');
}

export function SelectedItemsFlyout() {
  const selectedItemsById = useSelectedItemsStore(
    (state) => state.selectedItems
  );
  const clearSelected = useSelectedItemsStore((state) => state.clearSelected);
  const selectedItems = Object.values(selectedItemsById);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDownload = () => {
    const csv = createCsv(selectedItems);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${selectedItems.length}_items.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className={styles.flyout} aria-label="Selected items">
      <strong>{selectedItems.length} selected</strong>
      <div className={styles.actions}>
        <button type="button" onClick={clearSelected}>
          Unselect all
        </button>
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </aside>
  );
}
