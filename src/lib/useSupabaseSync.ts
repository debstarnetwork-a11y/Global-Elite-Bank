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
      (async () => {
        try {
          const { error } = await supabase.from(tableName).upsert(payload);
          if (error) console.warn(`Notice: upserting ${tableName} deferred:`, error.message || error);
        } catch (err: any) {
          console.warn(`Notice: upserting ${tableName} deferred:`, err?.message || err);
        }
      })();
    }

    if (toDelete.length > 0) {
      const deleteIds = toDelete.map(d => d.id);
      (async () => {
        try {
          const { error } = await supabase.from(tableName).delete().in('id', deleteIds);
          if (error) console.warn(`Notice: deleting ${tableName} deferred:`, error.message || error);
        } catch (err: any) {
          console.warn(`Notice: deleting ${tableName} deferred:`, err?.message || err);
        }
      })();
    }

    prevItemsRef.current = items;
  }, [items, tableName, isInitializing]);
}
