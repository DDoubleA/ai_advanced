
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newQuestions = [
    { text: "코사인 유사도(Cosine Similarity)를 계산할 때, 이 값이 나타내는 두 벡터의 핵심 특성은 무엇인가요?", categoryId: 'rag-agent' }, // Assuming RAG/Vector or Data Analysis
    { text: "Python 데이터 분석 라이브러리 Pandas의 두 가지 핵심 데이터 구조는 무엇인가요?", categoryId: 'data-analysis' },
    { text: "Agentic RAG의 핵심 아이디어로 가장 적절한 것은 무엇인가요?", categoryId: 'rag-agent' },
    { text: "LLM의 파라미터 가중치를 16비트에서 8비트 등으로 낮추어 모델 크기와 계산량을 줄이는 기술은?", categoryId: 'fine-tuning' },
    { text: "GPT-4와 같이 전체 파라미터 중 일부만 활성화하여 계산 효율을 높이는 아키텍처는 무엇인가요?", categoryId: 'llm-basics' },
    { text: "RAG 파이프라인의 Searching 단계에서, 단어의 표면적 일치가 아닌 '의미적 유사성'을 기반으로 검색하는 방식은?", categoryId: 'rag-agent' },
    { text: "LLM의 토큰화(Tokenization) 과정에 대한 설명으로 가장 적절한 것은?", categoryId: 'llm-basics' },
    { text: "Small2Big과 Sliding Window 전략의 공통적인 목적은 무엇인가요?", categoryId: 'rag-agent' },
    { text: "LLM 기반 에이전트가 생각(Reasoning) -> 행동(Acting) -> 관찰(Observation)의 과정을 반복하는 프레임워크는?", categoryId: 'rag-agent' },
    { text: "LLM의 Tool Schema에 대한 설명으로 잘못된 것은?", categoryId: 'rag-agent' },
    { text: "RAG와 파인 튜닝(Fine-tuning)의 차이로 적절한 것은 무엇인가요?", categoryId: 'fine-tuning' },
    { text: "LLM의 사전학습(Pre-training)과 파인 튜닝(Fine-tuning)의 차이에 대한 설명으로 가장 옳은 것은?", categoryId: 'fine-tuning' },
    { text: "RLHF(사람 피드백 기반 강화학습)에서 보상 모델(Reward Model)의 역할은?", categoryId: 'fine-tuning' },
    { text: "Tool Calling의 주요 목적은 무엇인가요?", categoryId: 'rag-agent' },
    { text: "Step-back Prompting의 핵심 아이디어는 무엇인가요?", categoryId: 'prompt-engineering' },
    { text: "RAGAS 프레임워크가 제공하는 주요 평가 항목으로 적절한 것은 무엇인가요?", categoryId: 'rag-agent' }
];

async function main() {
    console.log("Fetching existing questions...");
    const existingQuestions = await prisma.question.findMany();

    console.log(`Found ${existingQuestions.length} existing questions.`);

    const duplicates = [];

    for (const newQ of newQuestions) {
        // Simple fuzzy check: contains significant substring or similarity
        // Taking first 15 chars for quick check or full check
        const potentialMatch = existingQuestions.find(exQ =>
            exQ.text.includes(newQ.text.substring(0, 20)) || newQ.text.includes(exQ.text.substring(0, 20))
        );

        if (potentialMatch) {
            duplicates.push({
                new: newQ.text,
                existing: potentialMatch.text,
                id: potentialMatch.id,
                category: potentialMatch.categoryId
            });
        }
    }

    if (duplicates.length > 0) {
        console.log("\n⚠️ Potential Duplicates Found:");
        duplicates.forEach(d => {
            console.log(`- New: "${d.new.substring(0, 50)}..." matches Existing (ID: ${d.id}, Cat: ${d.category}): "${d.existing.substring(0, 50)}..."`);
        });
    } else {
        console.log("\n✅ No duplicates found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
