import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";

export interface PrivateStorage {
    put(key: string, data: Buffer, mime: string): Promise<void>;
    get(key: string): Promise<Buffer>;
    remove(key: string): Promise<void>;
}
function validKey(key: string) {
    if (!/^[a-zA-Z0-9_/-]+\.[a-zA-Z0-9]+$/.test(key) || key.includes(".."))
        throw new Error("Ungültiger Speicherschlüssel.");
    return key;
}
class LocalStorage implements PrivateStorage {
    private root = path.resolve(
        /* turbopackIgnore: true */ process.env.LOCAL_STORAGE_PATH ??
            "data/private",
    );
    private file(key: string) {
        return path.join(this.root, validKey(key));
    }
    async put(key: string, data: Buffer) {
        const file = this.file(key);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, data, { mode: 0o600 });
    }
    async get(key: string) {
        return readFile(this.file(key));
    }
    async remove(key: string) {
        try {
            await unlink(this.file(key));
        } catch (error) {
            if (!(
                error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT"
            ))
                throw error;
        }
    }
}
class S3Storage implements PrivateStorage {
    private client = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION ?? "eu-central-1",
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
    });
    private bucket = process.env.S3_BUCKET!;
    constructor() {
        if (
            !this.bucket ||
            !process.env.S3_ACCESS_KEY_ID ||
            !process.env.S3_SECRET_ACCESS_KEY
        )
            throw new Error(
                "Privater Objektspeicher ist nicht vollständig konfiguriert.",
            );
    }
    async put(key: string, data: Buffer, mime: string) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: validKey(key),
                Body: data,
                ContentType: mime,
            }),
        );
    }
    async get(key: string) {
        const result = await this.client.send(
            new GetObjectCommand({ Bucket: this.bucket, Key: validKey(key) }),
        );
        return Buffer.from(await result.Body!.transformToByteArray());
    }
    async remove(key: string) {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: validKey(key),
            }),
        );
    }
}
export function storage(): PrivateStorage {
    if (process.env.STORAGE_DRIVER === "s3") return new S3Storage();
    if (process.env.VERCEL || process.env.PLATFORM_ENV === "production")
        throw new Error("Privater dauerhafter Objektspeicher erforderlich.");
    return new LocalStorage();
}
