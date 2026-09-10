function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      // Deduplicate arrays by id if applicable to fix any corrupted state
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
        const unique = [];
        const seenIds = new Set();
        for (const obj of parsed) {
          if (!seenIds.has(obj.id)) {
            unique.push(obj);
            seenIds.add(obj.id);
          }
        }
        return unique as any as T;
      }
      return parsed;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}
