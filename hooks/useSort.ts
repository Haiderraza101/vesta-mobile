import { useState, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export function useSort<T>(initialData: T[], initialKey?: keyof T, initialOrder: SortOrder = 'asc') {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const sortedData = useMemo(() => {
    if (!sortKey) return initialData;

    const sorted = [...initialData].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [initialData, sortKey, sortOrder]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return {
    sortedData,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
    toggleSort
  };
}
