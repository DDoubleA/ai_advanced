const fs = require('fs');
// Using aws-0 and port 6543 which is standard for Supabase poolers.
// Connection Pooling: Transaction mode is 6543. Session mode is 5432.
// For "db push", we technically need Session mode (5432).
// BUT if 5432 is blocked (DNS/Firewall), we can try 6543.
// However, "Tenant or user not found" suggests the HOSTname might be `aws-0` vs `aws-1`.
// I will try aws-0 first with 6543. 
const content = 'DATABASE_URL="postgresql://postgres.orjbnblgjgqhzboldxhs:cardCIZzang@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"';
fs.writeFileSync('.env', content, 'utf8');
console.log('.env updated to port 6543');
