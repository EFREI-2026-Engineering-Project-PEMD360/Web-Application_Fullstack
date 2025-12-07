import { auth } from '$lib/auth';

/**
 * Admin utility functions pour simplifier l'usage du plugin admin de Better Auth
 * Ces fonctions encapsulent les appels à l'API admin et gèrent automatiquement les headers
 */

type RequestEvent = {
	request: Request;
};

/**
 * Crée un utilisateur
 */
export async function createUser(
	event: RequestEvent,
	data: {
		email: string;
		password: string;
		name: string;
		role?: 'admin' | 'user' | ('admin' | 'user')[];
		data?: Record<string, unknown>;
	}
) {
	return await auth.api.createUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Liste tous les utilisateurs avec filtres et pagination
 */
export async function listUsers(
	event: RequestEvent,
	query?: {
		searchValue?: string;
		searchField?: 'email' | 'name';
		searchOperator?: 'contains' | 'starts_with' | 'ends_with';
		limit?: number;
		offset?: number;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
		filterField?: string;
		filterValue?: string | number | boolean;
		filterOperator?: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
	}
) {
	return await auth.api.listUsers({
		query: query || {},
		headers: event.request.headers
	});
}

/**
 * Définit le rôle d'un utilisateur
 */
export async function setUserRole(
	event: RequestEvent,
	data: {
		userId: string;
		role: 'admin' | 'user' | ('admin' | 'user')[];
	}
) {
	return await auth.api.setRole({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Définit le mot de passe d'un utilisateur
 */
export async function setUserPassword(
	event: RequestEvent,
	data: {
		userId: string;
		newPassword: string;
	}
) {
	return await auth.api.setUserPassword({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Met à jour les données d'un utilisateur
 */
export async function updateUser(
	event: RequestEvent,
	data: {
		userId: string;
		data: Record<string, unknown>;
	}
) {
	return await auth.api.adminUpdateUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Bannit un utilisateur
 */
export async function banUser(
	event: RequestEvent,
	data: {
		userId: string;
		banReason?: string;
		banExpiresIn?: number;
	}
) {
	return await auth.api.banUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Débannit un utilisateur
 */
export async function unbanUser(
	event: RequestEvent,
	data: {
		userId: string;
	}
) {
	return await auth.api.unbanUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Liste toutes les sessions d'un utilisateur
 */
export async function listUserSessions(
	event: RequestEvent,
	data: {
		userId: string;
	}
) {
	return await auth.api.listUserSessions({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Révoque une session spécifique
 */
export async function revokeUserSession(
	event: RequestEvent,
	data: {
		sessionToken: string;
	}
) {
	return await auth.api.revokeUserSession({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Révoque toutes les sessions d'un utilisateur
 */
export async function revokeUserSessions(
	event: RequestEvent,
	data: {
		userId: string;
	}
) {
	return await auth.api.revokeUserSessions({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Se faire passer pour un utilisateur (impersonation)
 */
export async function impersonateUser(
	event: RequestEvent,
	data: {
		userId: string;
	}
) {
	return await auth.api.impersonateUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Arrêter de se faire passer pour un utilisateur
 */
export async function stopImpersonating(event: RequestEvent) {
	return await auth.api.stopImpersonating({
		headers: event.request.headers
	});
}

/**
 * Supprime un utilisateur de la base de données
 */
export async function removeUser(
	event: RequestEvent,
	data: {
		userId: string;
	}
) {
	return await auth.api.removeUser({
		body: data,
		headers: event.request.headers
	});
}

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export async function userHasPermission(
	data: {
		userId?: string;
		role?: 'admin' | 'user';
		permissions: {
			readonly user?: ('set-role' | 'set-password' | 'create' | 'list' | 'ban' | 'impersonate' | 'delete' | 'get' | 'update')[];
			readonly session?: ('list' | 'delete' | 'revoke')[];
		};
	}
) {
	return await auth.api.userHasPermission({
		body: data
	});
}
