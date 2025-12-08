import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { isAdmin } = await parent();
	
	// Rediriger si l'utilisateur n'est pas admin
	if (!isAdmin) {
		throw redirect(303, '/app/unauthorized');
	}

	return {};
};
