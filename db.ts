import * as SQLite from 'expo-sqlite';

const databaseName = 'pathOS.db';

export default async function initDatabase() {
  
    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS run(
            duration INTEGER,
            distance INTEGER,
            avg_pace INTEGER,
            elevation_gain INTEGER,*
            date DATETIME
        );

        CREATE TABLE IF NOT EXISTS location(
            latitude DOUBLE,
            longitude DOUBLE,
            altitude DOUBLE,
            timestamp DATETIME,
            FOREIGN KEY(run_id) REFERENCES run(ROWID)
        );
    `); 
}

export async function insertRun(
    duration: number,
    distance: number,
    avgPace: number,
    elevationGain: number,
    date: Date
) {
    const db = await SQLite.openDatabaseAsync(databaseName);
    
    const statement = await db.prepareAsync(`
        INSERT INTO run (duration, distance, avg_pace, elevation_gain, date)
        VALUES ($duration, $distance, $avgPace, $elevationGain, $date);
    `);
    
    try {
        const result = await statement.executeAsync({ 
            $duration: duration, 
            $distance: distance, 
            $avgPace: avgPace, 
            $elevationGain: elevationGain, 
            $date: date.toISOString() 
        });
        return result.lastInsertRowId;
    } finally {
        await statement.finalizeAsync();
    }
}

export async function insertLocation(
    latitude: number,
    longitude: number,
    altitude: number,
    timestamp: Date,
    runId: number
    ) {
    const db = await SQLite.openDatabaseAsync(databaseName);
    
    const statement = await db.prepareAsync(`
        INSERT INTO location (latitude, longitude, altitude, timestamp, run_id)
        VALUES ($latitude, $longitude, $altitude, $timestamp, $run_id);
    `);
    
    try {
        const result = await statement.executeAsync({ 
            $latitude: latitude, 
            $longitude: longitude, 
            $altitude: altitude, 
            $timestamp: timestamp.toISOString(), 
            $run_id: runId 
        });
        return result.lastInsertRowId;
    } finally {
        await statement.finalizeAsync();
    }
}



