
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- DIAGONISTICS START ---");

    // 1. Check Total Count
    const total = await prisma.question.count();
    console.log(`Total Questions in DB: ${total}`);

    // 2. Group by Category
    const byCategory = await prisma.question.groupBy({
        by: ['categoryId'],
        _count: {
            id: true
        }
    });

    console.log("\nCounts by Category:");
    byCategory.forEach(c => {
        console.log(`- ${c.categoryId}: ${c._count.id}`);
    });

    // 3. Group by isExam
    const byExam = await prisma.question.groupBy({
        by: ['isExam'],
        _count: {
            id: true
        }
    });

    console.log("\nCounts by isExam:");
    byExam.forEach(e => {
        console.log(`- isExam=${e.isExam}: ${e._count.id}`);
    });

    // 4. Sample check for python-basics
    const sample = await prisma.question.findFirst({
        where: { categoryId: 'python-basics' },
        select: { id: true, categoryId: true, isExam: true }
    });
    console.log("\nSample Question (python-basics):", sample);

    console.log("--- DIAGONISTICS END ---");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
