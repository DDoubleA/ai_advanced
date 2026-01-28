
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

async function main() {
    console.log("Reading db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    let updateCount = 0;

    for (const category of categories) {
        for (const q of category.questions) {
            // Update question in DB by ID
            // We assume IDs in db.json match IDs in DB for these specific questions.
            // However, since db.json might have different IDs if they were sequential within category vs global DB IDs,
            // we should be careful. 
            // In our previous scripts, we tried to keep them in sync, but global ID in DB might differ from local ID in db.json if not managed carefully.
            // But usually for this app we've been using db.json as source of truth for seed.
            // Let's try to find by ID first.

            // Wait, previous strategy was: db.json has local IDs? No, usually Seed script assigns IDs.
            // Let's check if we can update by Text match or just upsert by ID if ID is reliable.
            // Given the recent manual edits were to options/text of existing questions, ID should be stable.

            try {
                // Determine `isExam`. In db.json it might be explicitly set.
                // If missing in json, default to false? or keep existing?
                // The user only edited text/options.

                await prisma.question.update({
                    where: { id: q.id },
                    data: {
                        text: q.text,
                        options: q.options,
                        correctIndex: q.correctIndex,
                        explanation: q.explanation,
                        // Update isExam only if present in JSON, else ignore (or default false?)
                        // Safe to update if present.
                        isExam: q.isExam ?? undefined
                    }
                });
                updateCount++;
            } catch (e) {
                // If ID doesn't exist (maybe new?), we could create it, but for now let's just log error
                // or maybe match by text?
                // For this specific request "Update DB from JSON", update is primary.
                console.warn(`Could not update Question ID ${q.id}: ${(e as Error).message}`);
            }
        }
    }

    console.log(`Updated ${updateCount} questions in DB from db.json.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
