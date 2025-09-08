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
- **Actions**: Install dependencies, run migrations using `pnpm db:migrate`
- **Migration**: Uses existing `tsx db/migrate.ts` script with staging database URL
- **Auto-deployment**: Vercel automatically deploys develop branch
- **URL**: staging.example.com (configure in Vercel)

### Production Workflow (`production.yml`)

- **Trigger**: Push to `main` branch
- **Protection**: Requires manual approval (environment protection)
- **Actions**:
  1. Install dependencies
  2. Check migration status using `pnpm db:migrate:status` (optional)
  3. Run production migrations using `pnpm db:migrate`
  4. Trigger Vercel deployment
- **Migration**: Uses existing `tsx db/migrate.ts` script with production database URL
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

- All workflows cache pnpm dependencies for faster builds
- Database migrations run before deployments to ensure schema compatibility
- Production deployments require manual approval for safety
- Schema drift checking helps catch potential migration issues early
