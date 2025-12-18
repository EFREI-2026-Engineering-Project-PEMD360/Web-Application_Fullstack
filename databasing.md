# How I did the migration (storytime & tutoriel)

I have `betterauth.sqlite` which holds auth data.
I have `src/lib/server/db/schema.ts` which holds the schema for `betterauth.sqlite`.

I have `pemd.sqlite` with pemd data.

I can export `pemd.sqlite` as SQL inserts, and run them in `betterauth.sqlite`.
However, I must first add the schema from `pemd.sqlite` into `betterauth.sqlite`.
There is a table named 'users' in both.

How to rename table "users" :

Datagrip > New > Data Source > SQLite > choose `pemd.sqlite`
- find table users
- left click
- 'rename'
- 'users' -> 'users_legacy'
- uncheck 'search for text occurences'
- click 'refactor'

Now I can export the schema.

First, I must verify database path in `drizzle.config.ts`.
It currently points directly to the file, so I chante it to from `'file:./database/betterauth.sqlite'` to `url: 'file:./database/pemd.sqlite'`.

I then run `npx drizzle-kit pull`. There is a new `/drizzle` folder with `schema.ts` inside. It contains the schema from `pemd.sqlite`. I copy and paste it into `src/lib/server/db/schema.ts`.

I must now apply the changes in `src/lib/server/db/schema.ts` to `betterauth.sqlite`.
I modify `drizzle.config.ts` so that it now points to `betterauth.sqlite`.

I try running `npx drizzle-kit migrate`:
```SQLITE_ERROR: table `account` already exists```

Alright let's check : 
There is a table "accounts" in `pemd.sqlite`. There is also a table "session" and everything from betterauth, but no data.
I delete every empty table from `pemd.sqlite`. 

I found out how to set `drizzle.config.ts` so that it points to `.env`.

I set `DATABASE_URL` to `pemd.sqlite`. I spam a bunch of commands (`npx drizzle-kit pull` and `npx drizzle-kit migrate`). I refrech Datagrip and find that `betterauth.sqlite` now has all the tables, except `user_legacy`.

back to basics. I need to write down assumptions.

`npx drizzle-kit migrate` sur `pemd.sqlite` fail avec "table categorie_v2 already exists".

`npx drizzle-kit migrate` sur `betterauth.sqlite` fail avec "table session already exists".

Je teste en changeant le schéma utilisé par drizzle-kit dans `drizzle.config.ts`.

notes : 

`npx drizzle-kit pull` creates the file `./drizzle/schema.ts` from dbCredentials/url in `drizzle.config.ts`.

I believe that `npx drizzle-kit migrate` will apply the schema from `drizzle.config.ts`. If a table already exists it won't add it.

`npx drizzle-kit migrate` produces a new SQL file that applies the schema from `drizzle.config.ts` to the existing database.

Following these findings we should probably run "pull" on pemd, add the new tables to our existing schema, then run migrate..?

It seems I've already done this a while ago on migration file `0001_outstanding_bastion.sql`. I run it. All the tables are there. I can now run the SQL inserts from `pemd.sqlite`.

It all works fine, except for the SQL insert files `pemd.sql` and `qrcode.sql`. They are too big to run in Datagrip.

I re-delete all empty tables : 
- dechets
- label
- media
- nature
- operation_projet
- sous_categorie
- tags
- structure

All good now ?
