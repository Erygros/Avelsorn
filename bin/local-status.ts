import { loadEnvConfig } from '@next/env';
import { count } from 'drizzle-orm';
import { connectDatabase } from '../src/server/db';
import { users,posts,outbox } from '../src/server/schema';
loadEnvConfig(process.cwd());
async function main(){const connection=connectDatabase();try{const [accounts]=await connection.db.select({value:count()}).from(users);const [articles]=await connection.db.select({value:count()}).from(posts);const [mails]=await connection.db.select({value:count()}).from(outbox);console.log(JSON.stringify({adapter:process.env.DATABASE_URL?'postgresql':'pglite',accounts:accounts.value,articles:articles.value,outbox:mails.value,appKeyConfigured:!!process.env.APP_SECRET,setupKeyConfigured:!!process.env.SETUP_KEY,backupKeyConfigured:!!process.env.BACKUP_KEY,tasksKeyConfigured:!!process.env.TASKS_SECRET},null,2));}finally{await connection.close();}}
main().catch(error=>{console.error(error);process.exitCode=1;});
