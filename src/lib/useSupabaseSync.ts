import { useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { camelToSnake } from './casing';

export function useSupabaseSync<T extends { id: string }>(
  items: T[], 
  tableName: string, 
  isInitializing: boolean
) {
  const prevItemsRef = useRef<T[]>([]);

  useEffect(() => {
    if (isInitializing) {
      prevItemsRef.current = items; // Set baseline after initial load
      return;
    }

    const prevItems = prevItemsRef.current;
    
    // Find added or modified items
    const toUpsert = items.filter(item => {
      const prevItem = prevItems.find(p => p.id === item.id);
      return !prevItem || JSON.stringify(prevItem) !== JSON.stringify(item);
    });

    // Find deleted items
    const toDelete = prevItems.filter(p => !items.find(item => item.id === p.id));

    if (toUpsert.length > 0) {
      const payload = toUpsert.map(camelToSnake);
      supabase.from(tableName).upsert(payload).then(({ error }) => {
        if (error) console.error(`Error upserting ${tableName}:`, error);
      });
    }

    if (toDelete.length > 0) {
      const deleteIds = toDelete.map(d => d.id);
      supabase.from(tableName).delete().in('id', deleteIds).then(({ error }) => {
        if (error) console.error(`Error deleting ${tableName}:`, error);
      });
    }

    prevItemsRef.current = items;
  }, [items, tableName, isInitializing]);
}
