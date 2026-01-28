
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const questions = [
    {
        text: "RAG(Retrieval-Augmented Generation)를 사용하는 주된 목적 두 가지는?",
        options: [
            "모델의 학습 속도 향상 및 이미지 생성 능력 강화",
            "할루시네이션(환각) 완화 및 최신/내부 데이터 활용",
            "번역 성능의 의도적 저하 및 토큰 사용량의 극대화",
            "파이썬 코드의 자동 실행 및 서버 내 데이터 강제 삭제",
            "사용자 인터페이스(UI) 디자인 자동화 및 네트워크 속도 개선"
        ],
        correctIndex: 1,
        explanation: "RAG는 모델이 학습하지 않은 최신 정보나 기업 내부 데이터를 '검색'해서 프롬프트에 넣어줌으로써, 모르는 것을 아는 척하는 '환각 현상'을 줄이고 답변의 정확도를 높이는 데 사용됩니다.",
        isExam: true
    },
    {
        text: "텍스트를 벡터(숫자 배열)로 변환하여 의미적 유사성을 기반으로 검색하는 방식은?",
        options: [
            "Lexical Search (키워드 기반 검색)",
            "Semantic Search (시맨틱 검색)",
            "Binary Search (이진 검색)",
            "SQL Query (구조화 질의)",
            "Random Access (임의 접근)"
        ],
        correctIndex: 1,
        explanation: "시맨틱 검색은 단어의 철자가 달라도 의미가 비슷하면(예: '강아지'와 '댕댕이') 벡터 공간상에서 가깝게 위치한다는 점을 이용해 검색 결과의 품질을 높입니다.",
        isExam: true
    },
    {
        text: "RAG 파이프라인에서 긴 문서를 모델이 처리하기 좋은 작은 단위로 나누는 과정을 무엇이라 하는가?",
        options: [
            "Embedding (임베딩)",
            "Chunking (청킹)",
            "Training (학습)",
            "Decoding (디코딩)",
            "Fine-tuning (미세 조정)"
        ],
        correctIndex: 1,
        explanation: "LLM은 한 번에 처리할 수 있는 토큰 수에 제한이 있습니다. 따라서 방대한 문서를 의미 있는 단위(단락, 문장 등)로 쪼개는 '청킹' 작업이 필수적입니다.",
        isExam: true
    },
    {
        text: "다음 중 벡터 데이터베이스(Vector DB)가 아닌 것은?",
        options: [
            "Pinecone",
            "Chroma",
            "Milvus",
            "MySQL (기본 설정 상태)",
            "Weaviate"
        ],
        correctIndex: 3,
        explanation: "Pinecone, Chroma, Milvus 등은 고차원 벡터의 유사도 계산에 최적화된 DB입니다. MySQL은 대표적인 관계형 DB(RDBMS)이며, 벡터 검색을 위해서는 별도의 확장 기능(pgvector 등)을 사용해야 합니다.",
        isExam: true
    },
    {
        text: "키워드가 정확히 일치하는 문서를 찾는 데 유리한 검색 방식은? (예: 특정 사번, 제품 코드 검색)",
        options: [
            "Semantic Search",
            "Vector Search",
            "Lexical Search (키워드 검색)",
            "Neural Search",
            "Multi-modal Search"
        ],
        correctIndex: 2,
        explanation: "의미적 유사성이 중요한 경우 시맨틱 검색이 좋지만, 사번이나 고유 코드처럼 '토씨 하나 안 틀리고 똑같은' 데이터를 찾을 때는 전통적인 키워드 기반 검색(BM25 등)이 훨씬 정확합니다.",
        isExam: true
    },
    {
        text: "Bi-Encoder 방식의 장점은?",
        options: [
            "두 문장의 관계를 모델이 실시간으로 비교하여 가장 정밀하다.",
            "문서를 미리 벡터화(임베딩)해 둘 수 있어 검색 속도가 매우 빠르다.",
            "별도의 학습 데이터 없이도 모든 언어에서 완벽하게 작동한다.",
            "텍스트 생성 성능이 GPT-4보다 우월하다.",
            "하드웨어 사양에 관계없이 항상 동일한 속도를 보장한다."
        ],
        correctIndex: 1,
        explanation: "Bi-Encoder는 문서들을 미리 벡터로 만들어 DB에 저장해 둘 수 있습니다. 사용자의 질문이 들어오면 질문만 벡터로 만들어 거리 계산만 하면 되므로, 대규모 데이터 검색에 매우 유리합니다. ",
        isExam: true
    },
    {
        text: "검색된 문서들 중 질문과 가장 관련성이 높은 문서를 다시 정밀하게 순위를 매기는 과정은?",
        options: [
            "Pre-training (사전 학습)",
            "Fine-tuning (미세 조정)",
            "Reranking (재순위화)",
            "Indexing (인덱싱)",
            "Distillation (지식 증류)"
        ],
        correctIndex: 2,
        explanation: "가벼운 모델(Bi-Encoder)로 후보군을 빠르게 뽑은 뒤, 무겁지만 정확한 모델(Cross-Encoder)을 사용하여 최종 순위를 다시 매기는 과정을 Reranking이라고 하며, RAG 성능 향상의 핵심 단계입니다.",
        isExam: true
    },
    {
        text: "청킹(Chunking) 시 인접한 청크 간에 내용을 일부 겹치게 하여 문맥 단절을 방지하는 기법은?",
        options: [
            "Chunk Overlap",
            "Padding",
            "Masking",
            "Dropout",
            "Attention Mask"
        ],
        correctIndex: 0,
        explanation: "문서를 자를 때 경계 부분에서 문맥이 끊기는 것을 막기 위해, 이전 청크의 끝부분을 다음 청크의 시작 부분에 포함시키는 기법을 '오버랩'이라고 합니다.",
        isExam: true
    },
    {
        text: "LLM이 학습하지 않은 최신 정보를 답변하게 하려면 어떤 기술이 가장 적합한가?",
        options: [
            "Zero-shot Prompting",
            "RAG (검색 증강 생성)",
            "모델 경량화 (Quantization)",
            "데이터 삭제 (Pruning)",
            "하이퍼파라미터 튜닝"
        ],
        correctIndex: 1,
        explanation: "모델 자체를 매번 다시 학습시키는 것은 비용이 너무 많이 듭니다. RAG는 외부 검색 엔진이나 DB에서 최신 정보를 긁어와 모델에게 전달하므로 가장 효율적입니다.",
        isExam: true
    },
    {
        text: "다음 중 RAG 시스템 구축 시 'Indexing' 단계에 해당하는 작업은?",
        options: [
            "사용자의 질문 의도를 파악하고 분석한다.",
            "외부 데이터를 로드하고, 청킹 및 임베딩하여 벡터 DB에 저장한다.",
            "LLM이 검색된 문서를 바탕으로 최종 답변을 생성한다.",
            "프롬프트의 페르소나를 설정한다.",
            "모델의 가중치를 업데이트한다."
        ],
        correctIndex: 1,
        explanation: "인덱싱은 답변을 하기 전, 검색 대상이 되는 데이터들을 '찾기 쉬운 상태'로 만들어 DB에 차곡차곡 쌓아두는 준비 과정을 말합니다.",
        isExam: true
    }
];

async function main() {
    console.log("Adding 10 RAG Agent exam questions...");
    
    // 1. Add to Database
    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: 'rag-agent',
                isExam: true
            }
        });
        console.log(`[DB] Added: ${q.text.substring(0, 20)}...`);
    }

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    const category = categories.find((c: any) => c.id === 'rag-agent');
    if (category) {
        // Find max ID to keep consistency locally
        let maxId = 0;
        category.questions.forEach((q: any) => {
            if (q.id > maxId) maxId = q.id;
        });

        questions.forEach(q => {
            maxId++;
            category.questions.push({
                id: maxId,
                ...q
            });
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(categories, null, 2), 'utf8');
        console.log(`[JSON] Added ${questions.length} questions to rag-agent in db.json`);
    } else {
        console.error("Category rag-agent not found in db.json");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
