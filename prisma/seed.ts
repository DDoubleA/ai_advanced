import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

async function main() {
    console.log('Seeding database...');

    // Read existing data
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    for (const category of data) {
        console.log(`Creating category: ${category.name}`);
        await prisma.category.create({
            data: {
                id: category.id,
                name: category.name,
                questions: {
                    create: category.questions.map((q: any) => ({
                        text: q.text,
                        options: q.options,
                        correctIndex: q.correctIndex,
                        explanation: q.explanation,
                    }))
                }
            }
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
