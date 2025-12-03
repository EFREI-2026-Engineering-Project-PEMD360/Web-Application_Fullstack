import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '$lib/s3/client';

export async function getBuckets() {
	const command = new ListBucketsCommand({});
	const response = await s3Client.send(command);
	return response.Buckets ?? [];
}