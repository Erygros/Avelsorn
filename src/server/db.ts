import { PGlite } from "@electric-sql/pglite";
import { drizzle as localDrizzle } from "drizzle-orm/pglite";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { lockSync } from "proper-lockfile";

export type Database = NodePgDatabase<typeof schema>;
type Connection = { db: Database; close: () => Promise<void>; local?: PGlite };
const globalDb = globalThis as unknown as { platformConnection?: Connection };

export function connectDatabase(
    url = process.env.DATABASE_URL,
    directory = process.env.LOCAL_DATABASE_PATH,
): Connection {
    if (url) {
        if (!/^postgres(ql)?:\/\//.test(url))
            throw new Error(
                "DATABASE_URL muss eine PostgreSQL-Verbindung sein.",
            );
        const pool = new Pool({
            connectionString: url,
            max: 5,
            idleTimeoutMillis: 10_000,
            connectionTimeoutMillis: 10_000,
        });
        return { db: drizzle(pool, { schema }), close: () => pool.end() };
    }
    if (process.env.VERCEL || process.env.PLATFORM_ENV === "production")
        throw new Error(
            "Im Produktionsbetrieb ist ein PostgreSQL-Netzwerkdienst erforderlich.",
        );
    const localPath =
        directory === ":memory:"
            ? undefined
            : path.resolve(
                  /* turbopackIgnore: true */ directory ?? "data/postgres",
              );
    if (localPath) mkdirSync(path.dirname(localPath), { recursive: true });
    let released=false;
    const release=localPath?lockSync(localPath,{realpath:false,stale:15_000,update:5_000}):()=>{};
    const unlock=()=>{if(!released){released=true;try{release();}catch{}}};
    if(localPath)process.once('exit',unlock);
    const local = new PGlite(localPath);
    // Both Drizzle PostgreSQL drivers expose the same query/transaction contract.
    return {
        db: localDrizzle(local, { schema }) as unknown as Database,
        close: async () => {try{await local.close();}finally{unlock();}},
        local,
    };
}

export function connection(): Connection {
    return (globalDb.platformConnection ??= connectDatabase());
}
export function db(): Database {
    return connection().db;
}
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type Db = Database | Transaction;
