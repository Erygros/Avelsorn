import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const result=spawnSync(process.execPath,['node_modules/tsx/dist/cli.mjs','bin/local-status.ts'],{encoding:'utf8',windowsHide:true});
const blocked=result.status!==0&&result.stderr.includes('ELOCKED');
fs.mkdirSync('tests/output',{recursive:true});fs.writeFileSync('tests/output/local-lock.json',JSON.stringify({parallelWriterBlocked:blocked},null,2));
if(!blocked)throw new Error('Die lokale Datenbanksperre wurde nicht wie erwartet nachgewiesen.');
console.log('Paralleler lokaler Datenbankschreiber wie vorgesehen blockiert. Der HTTP-Aufgabenweg bleibt verfügbar.');
