import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { db } from './server/db/client';
import * as schema from './server/db/schema';
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: schema,
	}),
	
    emailAndPassword: {
		enabled: true
	},
     plugins: [sveltekitCookies(getRequestEvent), admin()],
	
});
