import { loadEnvConfig } from '@next/env';
import { migrate as migrateLocal } from 'drizzle-orm/pglite/migrator';
import { migrate as migratePostgres } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/pglite';
import { connectDatabase } from '../src/server/db';
loadEnvConfig(process.cwd());
async function main(){
  if((process.env.PLATFORM_ENV==='production'||process.env.VERCEL)&&!process.argv.includes('--allow-production'))throw new Error('Produktionsmigrationen benötigen die ausdrückliche CLI-Option --allow-production und eine vorherige Sicherung.');
  const connection=connectDatabase();try{if(connection.local)await migrateLocal(drizzle(connection.local),{migrationsFolder:'drizzle'});else await migratePostgres(connection.db,{migrationsFolder:'drizzle'});console.log('Versionierte Datenbankmigrationen erfolgreich angewendet.');}finally{await connection.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
