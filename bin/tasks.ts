import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
async function main() {
    if(!process.argv.includes('--direct')){
        if(!process.env.TASKS_SECRET)throw new Error('TASKS_SECRET fehlt. Einrichtung bei gestoppter Anwendung erneut ausführen.');
        const response=await fetch((process.env.PUBLIC_BASE_URL??'http://localhost:3001')+'/api/tasks',{method:'POST',headers:{Authorization:'Bearer '+process.env.TASKS_SECRET},signal:AbortSignal.timeout(60000)});
        const result=await response.json();if(!response.ok)throw new Error('Aufgabenaufruf fehlgeschlagen: '+response.status);console.log(JSON.stringify(result,null,2));return;
    }
    const { runTasks } = await import("../src/server/tasks");
    const { connection } = await import("../src/server/db");
    try {
        console.log(JSON.stringify(await runTasks(), null, 2));
    } finally {
        await connection().close();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
