
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing isExam flags...");

    // 1-120: False (Original questions)
    const update1 = await prisma.question.updateMany({
        where: {
            id: { lte: 120 }
        },
        data: {
            isExam: false
        }
    });
    console.log(`Set ${update1.count} questions (ID <= 120) to isExam=false`);

    // 121+: True (Additional questions)
    const update2 = await prisma.question.updateMany({
        where: {
            id: { gt: 120 }
        },
        data: {
            isExam: true
        }
    });
    console.log(`Set ${update2.count} questions (ID > 120) to isExam=true`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
