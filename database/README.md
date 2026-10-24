# GIBIConnect database implementation

## A — Architecture summary

PostgreSQL is the source of truth for published educational facts and the structured context used by the AI. The core hierarchy is `institutions → faculties → departments → programs`, with many-to-many joins from institutions to scholarships and programs to careers. `programs.institution_id` is intentional denormalization: it avoids repeatedly traversing the hierarchy for the common “programs at institution X” and AI-context queries.

The AI never has a database credential, connection, or arbitrary-SQL capability. An Express service identifies intent and invokes allow-listed repository methods; those methods return only selected published records to the context builder. Controllers call services, services coordinate policy/transactions, and repositories contain parameterized SQL.

`pgcrypto` supplies `gen_random_uuid()` for identifiers. `pg_trgm` supports typo-tolerant name/slug search. The script uses `RESTRICT` for institutional content and canonical records, so an administrator must deliberately remove dependants before deleting an institution; this prevents silent loss. User-owned saves cascade with user deletion, AI conversation users become anonymous (`SET NULL`), and messages cascade only with their conversation. The two pure junction rows attached to a deleted program cascade. These are the only lifecycle cascades.

## B/C/D/E/F — SQL

Run [gibiconnect.sql](gibiconnect.sql) against an empty PostgreSQL database:

```powershell
psql $env:DATABASE_URL -f .\gibiconnect.sql
```

It creates all 23 required tables in one transaction, enums, timestamp triggers, full-text generated vectors with GIN indexes, trigram indexes, published-only partial indexes, constraints, and internally consistent development/demo seed data. The verification queries are preserved as runnable comments at the end of the SQL file. Seed institutional details must be verified before production publication.

Transactions are required whenever an operation has multiple dependent writes: create an institution plus its verification record in one `BEGIN/COMMIT`; create a program plus its `program_careers` rows in one transaction; comparisons are currently a single atomic insert, but should still be within a transaction if created alongside other state.

## G — Node.js integration

[db.js](db.js) is the central `src/config/db.js` connection pool. [institutionRepository.js](institutionRepository.js) demonstrates the repository boundary and uses `$1` parameter binding, which keeps input separate from SQL syntax and prevents injection. A service should use the same repositories to assemble AI context; neither controllers nor the AI model should issue SQL or open connections.

No passwords or connection strings are embedded: supply `DATABASE_URL` via the application environment and store only password hashes in `users.password_hash`.
