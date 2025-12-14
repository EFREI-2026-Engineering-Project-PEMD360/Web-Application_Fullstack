# Setup

```bash
npm install
```

(Create an .env with this content)[https://dash.cloudflare.com/f3ce197a7566316351089c61b0c859b8/r2/api-tokens/create?type=user] but just replace the R2 keys (ACCESS and SECRET KEY) by your account key:

------

    S3_API_URL=https://f3ce197a7566316351089c61b0c859b8.eu.r2.cloudflarestorage.com
    R2_ACCESS_KEY_ID=YOUR_KEY
    R2_SECRET_ACCESS_KEY=YOUR_KEY
    DATABASE_URL=./pemd360database.db
    BETTER_AUTH_SECRET=riKh1DMMlyZXdVwZB4KACLOjHGI2KZJE
    BETTER_AUTH_URL=http://localhost:5173

------

Create the database schema with Drizzle ORM
```bash
npx drizzle-kit migrate
```

Run project
```bash
npm run dev
```

Go to (signup)[http://localhost:5173/signup] to create an admin account
