const fs = require('fs');
const content = 'DATABASE_URL="postgresql://postgres.orjbnblgjgqhzboldxhs:cardCIZzang@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"';
fs.writeFileSync('.env', content, 'utf8');
console.log('.env created successfully');
