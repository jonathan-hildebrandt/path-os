import { getDb } from './db';
import {
  CompletedLocationSchema,
  CompletedRun,
  CompletedRunSchema,
  RunIdSchema,
  RunStatus,
  UncompletedLocationSchema,
  UncompletedRunSchema,
} from './model';
import { calculateRunMetrics } from './metrics';
import { LocationObject } from 'expo-location';
import { convertLocationObjectToLocation } from './utils';

/**
 * Initializes the database by creating necessary tables and indexes.
 * Completes any in-progress runs.
 * @returns Promise<void>
 */
export default async function initDatabase(): Promise<void> {
  const db = await getDb();

  try {
    console.log('🔄 Initializing database...');

    // Uncomment the line below to reset the database
    // resetDatabase();

    // Enable foreign key constraints
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS run (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL DEFAULT 'in_progress',
      durationInSeconds INTEGER,
      distanceInMeters INTEGER,
      avgPaceInSeconds INTEGER,
      elevationGainInMeters INTEGER,
      timestamp INTEGER
    );
  `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      runId INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitudeInMeters REAL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY(runId) REFERENCES run(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS split (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      runId INTEGER NOT NULL,
      km INTEGER NOT NULL,
      avgPaceInSeconds INTEGER NOT NULL,
      elevationGainInMeters INTEGER NOT NULL,
      FOREIGN KEY(runId) REFERENCES run(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

    // Create indexes for performance optimization
    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_location_runId ON location(runId);
    CREATE INDEX IF NOT EXISTS idx_run_timestamp ON run(timestamp);
    CREATE INDEX IF NOT EXISTS idx_split_runId ON split(runId);
  `);

    console.log('✅ Database initialized successfully.');

    completeInProgressRuns();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

/**
 * Resets the database by dropping all tables.
 * @returns Promise<void>
 */
export async function resetDatabase(): Promise<void> {
  const db = await getDb();

  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS location;
      DROP TABLE IF EXISTS split;
      DROP TABLE IF EXISTS run;
    `);

    console.log('✅ Database reset successfully.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

/**
 * Completes all in-progress runs by calculating their metrics and updating the database.
 * @returns Promise<void>
 */
export async function completeInProgressRuns(): Promise<void> {
  try {
    const db = await getDb();
    const runs = await db.getAllAsync(
      `SELECT * FROM run WHERE status = 'in_progress';`
    );

    const parsedRuns = UncompletedRunSchema.array().parse(runs);

    if (parsedRuns.length === 0) {
      console.log('✅ No in-progress runs to complete.');
      return;
    }

    for (const run of parsedRuns) {
      try {
        await completeRun(run.id, { aborted: true });
      } catch (error) {
        console.error(`❌ Error completing run ${run.id}:`, error);
      }
    }

    console.log(`✅ Completed ${parsedRuns.length} in-progress runs.`);
  } catch (error) {
    console.error('❌ Failed to complete in-progress runs:', error);
  }
}

/**
 * Creates a new run in the database.
 * @returns Promise<number> The ID of the newly created run.
 */
export async function createRun(): Promise<number> {
  const db = await getDb();

  try {
    const result = await db.runAsync(`INSERT INTO run DEFAULT VALUES;`);

    console.log(
      `✅ Run created successfully with ID: ${result.lastInsertRowId}`
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ createRun failed:', error);
    throw error;
  }
}

/**
 * Completes a run by updating its metrics in the database.
 * @param run The run to complete.
 * @returns Promise<void>
 */
export async function completeRun(
  runId: number,
  { aborted }: { aborted: boolean } = { aborted: false }
): Promise<void> {
  const db = await getDb();

  try {
    const locations = await db.getAllAsync(
      `SELECT * FROM location WHERE runId = ? ORDER BY timestamp ASC;`,
      [runId]
    );

    const parsedLocations = CompletedLocationSchema.array().parse(locations);
    if (parsedLocations.length === 0) {
      console.warn(`⚠️ No locations for run ${runId}. Skipping.`);
      return;
    }

    const metrics = calculateRunMetrics(parsedLocations);

    const completedRun: CompletedRun = {
      id: runId,
      status: aborted ? RunStatus.ABORTED : RunStatus.COMPLETED,
      timestamp: parsedLocations.at(-1)!.timestamp,
      ...metrics,
    };

    const parsed = CompletedRunSchema.parse(completedRun);

    await db.runAsync(
      `
      UPDATE run SET
        status = ?,
        durationInSeconds = ?,
        distanceInMeters = ?,
        avgPaceInSeconds = ?,
        elevationGainInMeters = ?,
        timestamp = ?
      WHERE id = ?
      `,
      [
        parsed.status,
        parsed.durationInSeconds,
        parsed.distanceInMeters,
        parsed.avgPaceInSeconds,
        parsed.elevationGainInMeters,
        parsed.timestamp,
        parsed.id,
      ]
    );

    console.log(`✅ Run ${runId} completed successfully.`);
  } catch (error) {
    console.error(`❌ Failed to complete run ${runId}:`, error);
    throw error;
  }
}

/**
 * Inserts a new location into the database for a specific run.
 * @param runId - The ID of the run to which the location belongs.
 * @param locationObject - The location object containing latitude, longitude, altitude, and timestamp.
 * @returns Promise<number> The ID of the newly inserted location.
 */
export async function insertLocation(
  runId: number,
  locationObject: LocationObject
): Promise<number> {
  const db = await getDb();

  try {
    const location = convertLocationObjectToLocation(locationObject);

    const parsedRun = RunIdSchema.parse({ runId });
    const parsedLocation = UncompletedLocationSchema.parse(location);

    const result = await db.runAsync(
      `INSERT INTO location (runId, latitude, longitude, altitudeInMeters, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [
        parsedRun.runId,
        parsedLocation.latitude,
        parsedLocation.longitude,
        parsedLocation.altitudeInMeters,
        parsedLocation.timestamp,
      ]
    );

    console.log(`✅ Location inserted with ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ insertLocation failed:', error);
    throw error;
  }
}
