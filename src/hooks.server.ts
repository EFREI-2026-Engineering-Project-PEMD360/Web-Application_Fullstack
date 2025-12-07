import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  // Fetch current session from Better Auth
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });
  
  // Make session and user available on server
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  const url = event.url.pathname;

  // Protéger les routes /app/*
  if (url.startsWith('/app')) {
    if (!session?.user) {
      throw redirect(303, '/login');
    }
    // Rediriger /app vers /app/dashboard si l'utilisateur est connecté
    if (url === '/app' || url === '/app/') {
      throw redirect(303, '/app/dashboard');
    }
  }

  // Rediriger vers /app/dashboard si déjà connecté et tentative d'accès à login/signup
  if ((url === '/login' || url === '/signup') && session?.user) {
    throw redirect(303, '/app/dashboard');
  }

  return svelteKitHandler({ event, resolve, auth, building });
}