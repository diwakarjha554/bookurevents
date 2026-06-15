import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Backblaze B2 storage via the S3-compatible API.
 *
 * Required env vars (see .env):
 *   B2_ENDPOINT   e.g. https://s3.us-west-002.backblazeb2.com
 *   B2_REGION     e.g. us-west-002
 *   B2_KEY_ID     application keyID
 *   B2_APP_KEY    application key
 *   B2_BUCKET     bucket name
 */

let cached: S3Client | null = null;

function client(): S3Client {
    if (cached) return cached;
    const endpoint = process.env.B2_ENDPOINT;
    const region = process.env.B2_REGION || "us-east-005";
    const accessKeyId = process.env.B2_KEY_ID;
    const secretAccessKey = process.env.B2_APP_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error("Backblaze B2 is not configured. Set B2_ENDPOINT, B2_KEY_ID, B2_APP_KEY in .env");
    }

    cached = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
    });
    return cached;
}

export function isB2Configured(): boolean {
    return Boolean(process.env.B2_ENDPOINT && process.env.B2_KEY_ID && process.env.B2_APP_KEY && process.env.B2_BUCKET);
}

function bucket(): string {
    const b = process.env.B2_BUCKET;
    if (!b) throw new Error("B2_BUCKET is not set");
    return b;
}

/** Upload a file buffer and return the stored object key. */
export async function uploadToB2(
    key: string,
    body: Buffer | Uint8Array,
    contentType: string
): Promise<string> {
    await client().send(
        new PutObjectCommand({
            Bucket: bucket(),
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );
    return key;
}

/** Upload a browser File (from a server action FormData) and return its key. */
export async function uploadFile(file: File, folder: string): Promise<string> {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const safe = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    return uploadToB2(safe, bytes, file.type || "application/octet-stream");
}

/** Generate a temporary signed URL to view a private object. */
export async function getViewUrl(key: string | null | undefined, expiresIn = 3600): Promise<string | null> {
    if (!key || !isB2Configured()) return null;
    try {
        return await getSignedUrl(
            client(),
            new GetObjectCommand({ Bucket: bucket(), Key: key }),
            { expiresIn }
        );
    } catch {
        return null;
    }
}

export async function deleteFromB2(key: string): Promise<void> {
    await client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
