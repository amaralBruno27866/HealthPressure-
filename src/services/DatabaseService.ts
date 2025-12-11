import SQLite from 'react-native-sqlite-storage';
import {User, Measurement, Statistics} from '../models';
import {calculateIMC, classifyIMC, classifyBloodPressure} from '../utils/calculations';

SQLite.enablePromise(true);

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'HealthPressure.db',
        location: 'default',
      });
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        weight REAL NOT NULL,
        height REAL NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        heartRate INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }

  // ==================== USER OPERATIONS ====================

  async addUser(user: User): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const result = await this.db.executeSql(
      'INSERT INTO users (name, age, weight, height) VALUES (?, ?, ?, ?)',
      [user.name, user.age, user.weight, user.height],
    );

    return result[0].insertId;
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const result = await this.db.executeSql('SELECT * FROM users ORDER BY name');
    const users: User[] = [];

    for (let i = 0; i < result[0].rows.length; i++) {
      users.push(result[0].rows.item(i));
    }

    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const result = await this.db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id],
    );

    if (result[0].rows.length > 0) {
      return result[0].rows.item(0);
    }

    return null;
  }

  async updateUser(user: User): Promise<void> {
    if (!this.db || !user.id) {
      throw new Error('Database not initialized or user ID missing');
    }

    await this.db.executeSql(
      'UPDATE users SET name = ?, age = ?, weight = ?, height = ? WHERE id = ?',
      [user.name, user.age, user.weight, user.height, user.id],
    );
  }

  async deleteUser(id: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await this.db.executeSql('DELETE FROM users WHERE id = ?', [id]);
  }

  // ==================== MEASUREMENT OPERATIONS ====================

  async addMeasurement(measurement: Measurement): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const result = await this.db.executeSql(
      'INSERT INTO measurements (userId, systolic, diastolic, heartRate, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        measurement.userId,
        measurement.systolic,
        measurement.diastolic,
        measurement.heartRate,
        measurement.date,
        measurement.notes || null,
      ],
    );

    return result[0].insertId;
  }

  async getMeasurementsByUserId(userId: number, limit?: number): Promise<Measurement[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = limit
      ? 'SELECT * FROM measurements WHERE userId = ? ORDER BY date DESC LIMIT ?'
      : 'SELECT * FROM measurements WHERE userId = ? ORDER BY date DESC';

    const params = limit ? [userId, limit] : [userId];
    const result = await this.db.executeSql(query, params);
    const measurements: Measurement[] = [];

    for (let i = 0; i < result[0].rows.length; i++) {
      measurements.push(result[0].rows.item(i));
    }

    return measurements;
  }

  async deleteMeasurement(id: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await this.db.executeSql('DELETE FROM measurements WHERE id = ?', [id]);
  }

  // ==================== STATISTICS OPERATIONS ====================

  async getStatistics(userId: number): Promise<Statistics | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const user = await this.getUserById(userId);
    if (!user) {
      return null;
    }

    const measurements = await this.getMeasurementsByUserId(userId);

    if (measurements.length === 0) {
      const imc = calculateIMC(user.weight, user.height);
      return {
        avgSystolic: 0,
        avgDiastolic: 0,
        avgHeartRate: 0,
        classification: 'Normal',
        imc,
        imcClassification: classifyIMC(imc),
        totalMeasurements: 0,
      };
    }

    const totalSystolic = measurements.reduce((sum, m) => sum + m.systolic, 0);
    const totalDiastolic = measurements.reduce((sum, m) => sum + m.diastolic, 0);
    const totalHeartRate = measurements.reduce((sum, m) => sum + m.heartRate, 0);

    const avgSystolic = Math.round(totalSystolic / measurements.length);
    const avgDiastolic = Math.round(totalDiastolic / measurements.length);
    const avgHeartRate = Math.round(totalHeartRate / measurements.length);

    const imc = calculateIMC(user.weight, user.height);

    return {
      avgSystolic,
      avgDiastolic,
      avgHeartRate,
      classification: classifyBloodPressure(avgSystolic, avgDiastolic),
      imc: parseFloat(imc.toFixed(1)),
      imcClassification: classifyIMC(imc),
      totalMeasurements: measurements.length,
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export default new DatabaseService();
