import {getBuckets} from '$lib/s3/functionsS3';

export async function load() {
	const buckets = await getBuckets();
	return {
		buckets
	};
}
