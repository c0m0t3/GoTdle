import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

import { Database } from '../../src/database';
import { databaseSchema } from '../../src/database/schema';

export class TestDatabase {
  private container!: StartedPostgreSqlContainer;
  public database!: Database;

  async setup() {
    this.container = await new PostgreSqlContainer().start();
    this.database = drizzle({
      connection: this.container.getConnectionUri(),
      schema: databaseSchema,
      casing: 'snake_case',
    });
    await migrate(this.database, { migrationsFolder: './drizzle' });
  }

  async teardown() {
    await (this.database.$client as { end: () => Promise<void> }).end();
    await this.container.stop();
  }

  async clearDatabase() {
    const client = await (this.database.$client as any).connect();
    try {
      await client.query('BEGIN');
      await client.query('TRUNCATE TABLE "user", "score", "character" RESTART IDENTITY CASCADE');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  

}