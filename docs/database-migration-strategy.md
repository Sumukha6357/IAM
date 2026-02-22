# Database Migration Strategy

## Rules
- All schema changes must be done via Flyway migrations in `api/src/main/resources/db/migration`.
- Migration naming: `V{number}__description.sql` (e.g., `V3__add_payment_status_column.sql`).
- No manual edits in production databases.
- Hibernate must never mutate schema (`ddl-auto=validate`).
- Application startup must fail on validation or checksum mismatch.

## Creating a New Migration
1. Create a new SQL file in `api/src/main/resources/db/migration` with the next version number.
2. Keep changes small and focused.
3. Include indexes and constraints in the same migration.
4. Run locally against an empty DB to verify clean boot.

## Local Run
1. Drop and recreate your local database.
2. Start the application; Flyway will apply all migrations on startup.

## Rollback Strategy
Flyway Community does not support automatic down migrations.
- Rollback is manual using a database restore or a reverse migration script.
- For production, use a pre-migration backup and verified restore procedure.

## Handling Failed Migrations
- Fix the migration by creating a new versioned migration.
- Never edit a migration that has already been applied in shared environments.
- If a migration fails locally, you may repair (`flyway repair`) after correcting the issue before re-running.