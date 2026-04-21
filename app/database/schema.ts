export const SCHEMA_VERSION = 1;

export const INIT_QUERIES = [
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    schema_version INTEGER NOT NULL DEFAULT 1,
    theme TEXT DEFAULT 'dark'
  );`,
  `CREATE TABLE IF NOT EXISTS plots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    area_acres REAL,
    plant_count INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS treatments (
    id TEXT PRIMARY KEY,
    plot_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'fertilizer', 'pesticide', 'fungicide', 'other'
    date INTEGER NOT NULL,
    notes TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'chemical', 'equipment', 'other'
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS yields (
    id TEXT PRIMARY KEY,
    plot_id TEXT,
    date INTEGER NOT NULL,
    quantity_kg REAL NOT NULL,
    quality_grade TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE SET NULL
  );`,
  `CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    plot_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'disease', 'pest', 'weather', 'other'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    status TEXT NOT NULL, -- 'active', 'resolved'
    date_identified INTEGER NOT NULL,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS combos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    items_json TEXT NOT NULL, -- JSON string of ingredients/quantities
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS schedule (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'treatment', 'harvest', 'maintenance', 'other'
    status TEXT NOT NULL, -- 'pending', 'completed', 'skipped'
    related_id TEXT, -- could be plot_id or treatment_id depending on type
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS weather_log (
    id TEXT PRIMARY KEY,
    date INTEGER NOT NULL,
    temperature REAL,
    rainfall_mm REAL,
    notes TEXT,
    created_at INTEGER NOT NULL
  );`
];
