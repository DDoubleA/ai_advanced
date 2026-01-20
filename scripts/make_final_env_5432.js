const fs = require('fs');
const url = 'postgresql://postgres.orjbnblgjgqhzboldxhs:cardCIZzang@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';
const content = `DATABASE_URL="${url}"\nPOSTGRES_URL="${url}"`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env recreated with port 5432');
