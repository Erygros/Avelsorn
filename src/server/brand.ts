import { readFile } from "node:fs/promises";
import path from "node:path";

/** Original artwork for document generation and inline email attachments. */
export function brandLogoBytes() {
    return readFile(path.join(process.cwd(), "public/brand/avelsorn-logo.png"));
}
