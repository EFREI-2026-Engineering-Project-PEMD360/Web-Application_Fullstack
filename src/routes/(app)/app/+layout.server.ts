import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	
	if (!user) {
		return {
			user: null,
			isAdmin: false
		};
	}

	// Vérifier si l'utilisateur a le rôle admin
	const isAdmin = user.role === 'admin';

	return {
		user,
		isAdmin
	};
};
