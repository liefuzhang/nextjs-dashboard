# GitHub Actions Deployment Setup

## Required GitHub Secrets

Add these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

### Required Secrets

1. **STAGING_POSTGRES_URL_NON_POOLING**

   - Description: Direct PostgreSQL connection URL for staging database (port 5432, SSL enabled)
   - Format: `postgresql://user:password@host:5432/database?ssl=true&sslmode=require`
   - Used by: Staging workflow, sets as `POSTGRES_URL_NON_POOLING` env var for `pnpm db:migrate`

2. **PROD_POSTGRES_URL_NON_POOLING**
   - Description: Direct PostgreSQL connection URL for production database (port 5432, SSL enabled)
   - Format: `postgresql://user:password@host:5432/database?ssl=true&sslmode=require`
   - Used by: Production workflow, sets as `POSTGRES_URL_NON_POOLING` env var for `pnpm db:migrate`

### Optional Secrets

3. **VERCEL_PRODUCTION_DEPLOY_HOOK** (Optional)
   - Description: Vercel deploy hook URL for production deployments
   - Format: `https://api.vercel.com/v1/integrations/deploy/[project-id]/[deploy-hook-token]`
   - Used by: Production workflow to trigger manual Vercel deployments
   - Note: If not provided, Vercel will auto-deploy from main branch

## Environment Protection Rules

Set up environment protection rules in GitHub:

1. Go to **Settings > Environments**
2. Create a **production** environment
3. Add **Required reviewers** (recommend at least 1-2 team members)
4. Enable **Prevent self-review** if desired
5. Set **Deployment branches** to **Selected branches** and add **main**

## Workflow Overview

### PR Workflow (`pr.yml`)

- **Trigger**: Pull requests to `main` or `develop`
- **Actions**: Lint (`pnpm lint`), TypeScript check (`npx tsc --noEmit`), build (`pnpm build`)
- **No database access** - uses dummy environment variables
- **No secrets required**
- **Note**: Tests are skipped (no test script configured)

### Staging Workflow (`staging.yml`)

- **Trigger**: Push to `develop` branch
- **Actions**: Install dependencies, validate migrations, run migrations using `pnpm db:migrate`
- **Validation**: Uses `drizzle-kit check` to validate migration files before applying
- **Migration**: Uses `drizzle-kit migrate` with staging database URL
- **Auto-deployment**: Vercel automatically deploys develop branch
- **URL**: staging.example.com (configure in Vercel)

### Production Workflow (`production.yml`)

- **Trigger**: Push to `main` branch
- **Protection**: Requires manual approval (environment protection)
- **Actions**:
  1. Install dependencies
  2. Validate migration files using `drizzle-kit check`
  3. Run production migrations using `pnpm db:migrate`
  4. Trigger Vercel deployment
- **Validation**: Ensures migration files are consistent and valid before applying
- **Migration**: Uses `drizzle-kit migrate` with production database URL for deterministic schema changes
- **Manual approval required** before execution

## Setup Checklist

- [ ] **Fix pnpm lockfile** - Run `pnpm install --no-frozen-lockfile` locally to regenerate lockfile
- [ ] Add required GitHub secrets
- [ ] Set up production environment protection rules
- [ ] Configure Vercel auto-deployment for develop → staging
- [ ] Configure Vercel production domain
- [ ] Test workflows with sample commits
- [ ] Verify staging deployment URL works
- [ ] Test production deployment with manual approval

## Notes

- All workflows use `--no-frozen-lockfile` to handle pnpm configuration mismatches
- Database migrations run using `drizzle-kit migrate` for consistent schema changes
- Production deployments require manual approval for safety
- `drizzle-kit migrate` applies committed migration files for deterministic schema updates

## Best Practice Workflow

### Development (Local)
```bash
# 1. Make schema changes in code (db/schema/*)
# 2. Generate migration file
pnpm db:generate
# 3. Review the generated migration
# 4. Commit both schema changes AND migration files
git add db/schema/* db/migrations/*
git commit -m "Add new customer fields"
```

### CI/CD (Staging & Production)
```bash
# Only apply pre-generated, committed migrations
pnpm db:migrate
```

**Important Notes:**
- Never run `pnpm db:generate` in CI/CD pipelines
- Migration files should be committed to the repository
- Review generated migrations before committing
- Both staging and production apply the same migration files

## Golden Rules for Database Operations

### **Rule #1: Don't mix `push` and `migrate` on the same database**
Once you start using migrations on a database, always use migrations. Mixing approaches causes tracking conflicts.

### **Environment Strategy:**
- **Local/dev playground**: `pnpm db:push` is OK for quick iteration
- **Shared/staging/prod**: Only `pnpm db:generate` (commit SQL) → `pnpm db:migrate`

### **Migration vs Push Decision Tree:**
```
Is this a shared database (staging/prod)?
├── YES → Always use db:generate + db:migrate
└── NO (local dev) → db:push OK for quick iteration

Have you ever run db:migrate on this database?
├── YES → Always use db:migrate going forward
└── NO → Either approach is fine initially
```

## Database Reset (Emergency Only)

### ⚠️ DANGER: Complete Database Reset
If you need to completely reset a database (e.g., corrupted migration state), use this SQL:

```sql
-- DANGER: Nukes all user objects in the public schema
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS drizzle CASCADE;
CREATE SCHEMA public;
-- (Re-grant privileges if your platform requires it)
```

**After reset:**
1. Run `pnpm db:migrate` to apply all migrations from scratch
2. Run `pnpm db:seed` to restore sample data (if needed)

**⚠️ WARNING:** This destroys ALL data. Only use in development or as last resort with proper backups.

## Troubleshooting

### Pnpm Lockfile Mismatch
If you see `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`, run locally:
```bash
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "Fix pnpm lockfile configuration mismatch"
```
