import { auth } from '$lib/auth';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function load() {
	// Vérifier si la base de données contient des utilisateurs
	const existingUsers = await db.select().from(user);
	
	// Si des utilisateurs existent déjà, rediriger vers la page de connexion
	if (existingUsers.length > 0) {
		throw redirect(303, '/login');
	}
	
	return {};
}

export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!name || !email || !password) {
			return fail(400, { error: 'Tous les champs sont requis' });
		}

		try {
			// Vérifier si c'est le premier utilisateur
			const existingUsers = await db.select().from(user);
			const isFirstUser = existingUsers.length === 0;

			// Créer l'utilisateur via better-auth API handler
			const signupRequest = new Request(event.url.origin + '/api/auth/sign-up/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
					name,
				}),
			});

			const response = await auth.handler(signupRequest);
			
			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, { 
					error: errorData.message || 'Une erreur est survenue lors de l\'inscription' 
				});
			}

			// Si c'est le premier utilisateur, lui attribuer le rôle admin
			if (isFirstUser) {
				// Mettre à jour le rôle de l'utilisateur
				await db.update(user)
					.set({ role: 'admin' })
					.where(eq(user.email, email));
			}

			return { success: true };
		} catch (error) {
			console.error('Erreur lors de l\'inscription:', error);
			return fail(500, { 
				error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription' 
			});
		}
	}
};
