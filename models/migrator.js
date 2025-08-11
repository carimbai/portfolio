import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/errors";

const defaltMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {}, 
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaltMigrationsOptions,
      dbClient,
    });
    return pendingMigrations;
  } catch (error) {
    const serviceErrorObj = new ServiceError({
      message: "Erro ao listar as migrações pendentes.",
      cause: error,
    });
    throw serviceErrorObj;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaltMigrationsOptions,
      dbClient,
      dryRun: false,
    });
    return migratedMigrations;
  } catch (error) {
    const serviceErrorObj = new ServiceError({
      message: "Erro ao executar as migrações pendentes.",
      cause: error,
    });
    throw serviceErrorObj;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
