# Setup

```bash
npm install
```

Run project :
```bash
npm run dev
```

(Create an .env with this content)[https://dash.cloudflare.com/f3ce197a7566316351089c61b0c859b8/r2/api-tokens/create?type=user] but just replace the R2 keys (ACCESS and SECRET KEY) by your account key in `.env`.

Create the database schema with Drizzle ORM :
```bash
npx drizzle-kit migrate
```

Go to (signup)[http://localhost:5173/signup] to create an admin account
