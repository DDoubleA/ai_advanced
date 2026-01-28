
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

function main() {
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    let updatedCount = 0;

    let globalCounter = 0;

    const updatedCategories = categories.map((category: any) => ({
        ...category,
        questions: category.questions.map((q: any) => {
            globalCounter++;
            const isExam = globalCounter > 100; // 1-100: False, 101+: True

            if (isExam) updatedCount++;

            return {
                ...q,
                isExam: isExam
            };
        })
    }));

    fs.writeFileSync(DB_PATH, JSON.stringify(updatedCategories, null, 2), 'utf8');
    console.log(`Updated db.json: Set isExam=true for ${updatedCount} questions.`);
}

main();
