import * as SQLite from 'expo-sqlite';
import { INIT_QUERIES } from './schema';

export async function initDatabase(db: SQLite.SQLiteDatabase) {
  // Run table creations
  for (const query of INIT_QUERIES) {
    await db.execAsync(query);
  }

  // Initialize settings if empty
  const settings = await db.getFirstAsync('SELECT * FROM settings WHERE id = 1');
  if (!settings) {
    await db.runAsync('INSERT INTO settings (id, schema_version, theme) VALUES (1, 1, ?)', ['dark']);
  }
}

export function useDatabase() {
  return SQLite.useSQLiteContext();
}
