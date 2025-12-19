# Setup

```bash
npm install
```

Run project :
```bash
npm run dev
```

Download (the database)[https://drive.google.com/file/d/1gCMvfPLbJH-j2mt1_Q0ufkrgXqP3QekW] and place it in the project root. Check that the filename is included in `.gitignore`; as someone could have renamed the file on Google Drive without updating the `.gitignore`, or inversly.

Create an .env with this content Copy `.env.example` to a new `.env` file. Then, replace R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY by (tokens you will generate)[https://dash.cloudflare.com/f3ce197a7566316351089c61b0c859b8/r2/api-tokens/create?type=user].

Create the database schema with Drizzle ORM :
```bash
npx drizzle-kit migrate
```

Go to (signup)[http://localhost:5173/signup] to create an admin account
