# hello-world
Respository Practice

## Database Initialization

The SQL schema `patient_tracking_schema.sql` sets up the tables required for the project. You can apply this schema using a database engine of your choice. SQLite is a quick option for development, while PostgreSQL is recommended for production environments.

### Using SQLite

Run the following command to create a local database file and load the schema:

```bash
sqlite3 patient_tracking.db < patient_tracking_schema.sql
```

### Using PostgreSQL

If you prefer PostgreSQL, execute the SQL file against your database with:

```bash
psql -d <database_name> -f patient_tracking_schema.sql
```

Replace `<database_name>` with your target database name.
