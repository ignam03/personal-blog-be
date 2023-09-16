--CREATE DATABASE IF NOT EXISTS personal-blog-database
SELECT 'CREATE DATABASE blogdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'blogdb')\gexec