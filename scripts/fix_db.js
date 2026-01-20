const fs = require('fs');
const filePath = 'src/data/db.json';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
const linesToDelete = new Set();

// Add line INDICES (0-based) to delete
// Line 3 (index 2)
linesToDelete.add(2);

// Lines 266-555 (index 265-554)
for (let i = 265; i <= 554; i++) linesToDelete.add(i);

// Line 560 (index 559)
linesToDelete.add(559);

// Lines 823-1086 (index 822-1085)
for (let i = 822; i <= 1085; i++) linesToDelete.add(i);

// Line 1091 (index 1090)
linesToDelete.add(1090);

// Lines 1354-1617 (index 1353-1616)
for (let i = 1353; i <= 1616; i++) linesToDelete.add(i);

// Line 1622 (index 1621)
linesToDelete.add(1621);

// Lines 1885-3210 (index 1884-3209)
for (let i = 1884; i <= 3209; i++) linesToDelete.add(i);

const newLines = lines.filter((_, index) => !linesToDelete.has(index));
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Fixed db.json');
