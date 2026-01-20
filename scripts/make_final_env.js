const fs = require('fs');
const url = 'postgresql://postgres.orjbnblgjgqhzboldxhs:cardCIZzang@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
const content = `DATABASE_URL="${url}"\nPOSTGRES_URL="${url}"`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env recreated with correct encoding');
