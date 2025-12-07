import { fail } from '@sveltejs/kit';
import { createUser } from '$lib/server/admin';
import type { Actions } from './$types';

export const actions = {
	createUser: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const name = formData.get('name')?.toString();
		const role = formData.get('role')?.toString() as 'admin' | 'user' | undefined;

		// Validation
		if (!email || !password || !name) {
			return fail(400, {
				error: 'Tous les champs sont requis',
				email,
				name,
				role
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Le mot de passe doit contenir au moins 8 caractères',
				email,
				name,
				role
			});
		}

		if (!email.includes('@')) {
			return fail(400, {
				error: 'Email invalide',
				email,
				name,
				role
			});
		}

		try {
			await createUser(event, {
				email,
				password,
				name,
				role: role || 'user'
			});

			return {
				success: true,
				message: 'Utilisateur créé avec succès'
			};
		} catch (error) {
			console.error('Erreur création utilisateur:', error);
			return fail(500, {
				error: 'Erreur lors de la création de l\'utilisateur',
				email,
				name,
				role
			});
		}
	},

} satisfies Actions;
