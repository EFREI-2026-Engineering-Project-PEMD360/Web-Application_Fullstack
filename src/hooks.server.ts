import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  const url = event.url.pathname;

  if (url.startsWith('/app')) {
    if (!session?.user) {
      throw redirect(303, '/login');
    }
    if (url === '/app') {
      throw redirect(303, '/app/projets');
    }
  }

  if ((url === '/login' || url === '/signup') && session?.user) {
    throw redirect(303, '/app/projets');
  }

  if (url.startsWith('/app/admin')) {
    if (!session?.user) {
      throw redirect(303, '/login');
    }
    if (url === '/app/') {
      throw redirect(303, '/app/projets');
    }
  }

  return svelteKitHandler({ event, resolve, auth, building });
}