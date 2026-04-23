import * as SQLite from 'expo-sqlite';
import { INIT_QUERIES } from './schema';

export async function initDatabase(db: SQLite.SQLiteDatabase) {
  console.log('DATABASE: Initializing...');
  try {
    // Run table creations
    for (const query of INIT_QUERIES) {
      await db.execAsync(query);
    }
    console.log('DATABASE: Tables created successfully');

    // Initialize settings if empty
    console.log('DATABASE: Checking settings table...');
    const settings = await db.getFirstAsync('SELECT * FROM settings WHERE id = 1');
    console.log('DATABASE: Settings check complete, exists:', !!settings);
    if (!settings) {
      console.log('DATABASE: Inserting default settings...');
      await db.runAsync('INSERT INTO settings (id, schema_version, theme) VALUES (1, 1, ?)', ['dark']);
      console.log('DATABASE: Settings initialized');
    }
  } catch (error) {
    console.error('DATABASE: Initialization failed:', error);
    throw error;
  }
}

export function useDatabase() {
  return SQLite.useSQLiteContext();
}
