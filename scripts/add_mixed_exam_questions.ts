
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// Define the mixed questions with their target categories
const mixedQuestions = [
    // --- LLM Basics ---
    {
        categoryId: 'llm-basics',
        text: "학습된 모델을 사용하여 새로운 입력에 대한 결과를 생성하는 과정을 무엇이라 하는가?",
        options: ["Training (학습)", "Inference (추론)", "Backpropagation (역전파)", "Tokenization (토큰화)", "Optimization (최적화)"],
        correctIndex: 1,
        explanation: "모델을 만드는 과정은 학습(Training), 완성된 모델을 실제 서비스에 활용하여 답을 내는 단계는 추론(Inference)입니다.",
        isExam: true
    },
    {
        categoryId: 'llm-basics',
        text: "모델 생성 시 Temperature 값을 0에 가깝게 설정했을 때의 특징으로 옳은 것은?",
        options: ["답변의 무작위성이 높아져서 매우 창의적인 답변이 생성된다.", "확률이 가장 높은 토큰만 선택하여 일관되고 결정론적인 답변을 생성한다.", "모델의 연산 과정이 단순화되어 추론 속도가 2배 이상 빨라진다.", "입력 가능한 최대 토큰 수(Context Window)가 비약적으로 늘어난다.", "사실 여부와 관계없이 사용자의 질문보다 항상 긴 답변을 생성한다."],
        correctIndex: 1,
        explanation: "온도가 낮을수록 답변이 보수적이고 사실에 가까워지며, 온도가 높을수록 다양하고 창의적인 답변이 나옵니다.",
        isExam: true
    },
    {
        categoryId: 'llm-basics',
        text: "LLM의 입력 토큰 수가 모델의 한계(Context Limit)를 초과했을 때 발생하는 문제는?",
        options: ["모델이 부족한 정보를 메우기 위해 자동으로 학습 데이터를 업데이트한다.", "입력된 정보 중 앞부분이 잘려나가는 Truncation(잘림) 현상이 발생한다.", "답변 생성에 필요한 연산량이 줄어들어 서비스 비용이 0원이 된다.", "모델의 파라미터가 실시간으로 최적화되어 지능이 비약적으로 상승한다.", "에러 발생 없이 외부 데이터베이스를 참조하여 모든 문맥을 이해한다."],
        correctIndex: 1,
        explanation: "컨텍스트 윈도우 한계를 넘어서면 모델은 기억 용량을 초과한 가장 오래된 대화 내용부터 잊어버리게 됩니다.",
        isExam: true
    },
    {
        categoryId: 'llm-basics',
        text: "별도의 추가 학습 없이 프롬프트에 몇 개의 예시를 넣는 것만으로 모델이 작업을 이해하는 능력은?",
        options: ["Transfer Learning (전이 학습)", "Fine-Tuning (미세 조정)", "In-Context Learning (문맥 내 학습)", "Meta Learning (메타 학습)", "Supervised Learning (지도 학습)"],
        correctIndex: 2,
        explanation: "가중치 업데이트 없이 프롬프트 내의 예시(Few-shot)만으로 새로운 태스크를 수행하는 LLM의 핵심 능력입니다.",
        isExam: true
    },
    {
        categoryId: 'llm-basics',
        text: "LLM이 실제 지식이 아니라 확률적으로 그럴듯한 문장만 생성한다는 비판적 용어는?",
        options: ["Smart Agent (지능형 에이전트)", "Stochastic Parrot (확률적 앵무새)", "Neural Network (신경망 모델)", "Turing Machine (튜링 기계)", "Digital Oracle (디지털 신탁)"],
        correctIndex: 1,
        explanation: "모델이 문장의 의미를 진정으로 이해하는 것이 아니라, 대량의 데이터에서 배운 확률 통계를 바탕으로 답변을 구성한다는 비판입니다.",
        isExam: true
    },

    // --- Prompt Engineering ---
    {
        categoryId: 'prompt-engineering',
        text: "시스템 프롬프트(System Prompt)의 주된 역할로 가장 적절한 것은?",
        options: ["사용자가 질문을 던질 때마다 매번 본문에 포함해야 하는 핵심 명령어이다.", "모델의 전반적인 페르소나, 태도, 규칙을 설정하는 최상위 운영 지침이다.", "답변 생성 시간을 측정하여 모델의 추론 속도를 조절하는 타이머 역할을 한다.", "답변의 최대 글자 수를 하드웨어 수준에서 강제로 제한하는 기능만 수행한다.", "모델이 외부 인터넷 API에 접속하여 정보를 검색하게 만드는 유일한 통로이다."],
        correctIndex: 1,
        explanation: "대화의 규칙이나 성격(예: \"너는 친절한 마케터야\")을 정의하여 모델의 행동 양식을 결정하는 바탕이 됩니다.",
        isExam: true
    },
    {
        categoryId: 'prompt-engineering',
        text: "프롬프트가 모델의 시스템 설정이나 학습 데이터 내 기밀 정보를 내뱉도록 유도하는 공격은?",
        options: ["Prompt Injection (프롬프트 주입)", "Prompt Leakage (프롬프트 유출)", "Hallucination (환각 현상)", "Data Cleaning (데이터 정제)", "Prompt Chaining (프롬프트 체이닝)"],
        correctIndex: 1,
        explanation: "Injection이 모델의 동작을 조종하는 것이 목적이라면, Leakage는 숨겨진 지침이나 데이터를 탈취하는 데 초점이 맞춰져 있습니다.",
        isExam: true
    },
    {
        categoryId: 'prompt-engineering',
        text: "복잡한 문제를 해결하기 위해 동일한 질문을 여러 번 던져 다수결로 답을 정하는 기법은?",
        options: ["Tree of Thoughts (사고의 트리)", "Self-Consistency (자기 일관성)", "ReAct (실행 및 추론)", "Zero-shot (무예시 프롬프팅)", "Reframing (관점 재설정)"],
        correctIndex: 1,
        explanation: "여러 번의 추론 경로를 거쳐 가장 일관되게 도출된 답을 선택함으로써 최종 답변의 신뢰도를 높입니다.",
        isExam: true
    },
    {
        categoryId: 'prompt-engineering',
        text: "긴 대화로 토큰이 부족할 때 이전 대화 내용을 핵심적으로 요약하여 프롬프트에 넣는 기법은?",
        options: ["Sliding Window (슬라이딩 윈도우)", "Conversation Summary (대화 요약)", "Prompt Deletion (프롬프트 삭제)", "Context Extension (문맥 확장)", "Vector Storage (벡터 저장)"],
        correctIndex: 1,
        explanation: "과거의 대화 기록을 압축하여 중요한 맥락만 보존함으로써 토큰 사용량을 효율적으로 관리합니다.",
        isExam: true
    },
    {
        categoryId: 'prompt-engineering',
        text: "모델에 설정된 윤리적/안전 제한(Safety Filter)을 우회하여 답변을 받아내는 행위는?",
        options: ["Reframing (재구성)", "Jailbreaking (탈옥)", "Tuning (조정)", "Padding (패딩)", "Masking (마스킹)"],
        correctIndex: 1,
        explanation: "악의적인 프롬프트 설계를 통해 모델에 걸린 가드레일을 뚫고 부적절한 답변을 유도하는 시도입니다.",
        isExam: true
    },

    // --- RAG Agent ---
    {
        categoryId: 'rag-agent',
        text: "벡터 DB 검색 시 날짜나 카테고리를 활용해 검색 범위를 미리 필터링하는 기술은?",
        options: ["Embedding (임베딩)", "Metadata Filtering (메타데이터 필터링)", "Normalization (정규화)", "Chunking (청킹)", "Reranking (재순위화)"],
        correctIndex: 1,
        explanation: "의미적 유사도뿐만 아니라 '최신순', '특정 카테고리' 등 메타데이터 조건을 걸어 검색 결과의 정확도를 높입니다.",
        isExam: true
    },
    {
        categoryId: 'rag-agent',
        text: "작은 청크로 정확하게 검색하고, 모델에게는 더 넓은 맥락을 제공하기 위해 상위 문서를 전달하는 방식은?",
        options: ["Hybrid Search (하이브리드 검색)", "Parent Document Retriever (부모 문서 검색)", "Multi-Query Retriever (다중 질의 검색)", "Exact Match Search (정확 일치 검색)", "Random Sampling (무작위 추출)"],
        correctIndex: 1,
        explanation: "검색은 작은 단위(Small Chunk)로 세밀하게 수행하되, 답변 생성 시에는 문맥이 풍부한 큰 단위(Parent Chunk)를 제공하는 전략입니다.",
        isExam: true
    },
    {
        categoryId: 'rag-agent',
        text: "에이전트가 생각(Thought), 행동(Action), 관찰(Observation)을 반복하며 문제를 푸는 패턴은?",
        options: ["ReAct (추론 및 실행)", "Chain of Thought (사고의 사슬)", "Few-shot (소수 예시 학습)", "Map-Reduce (맵 리듀스)", "Refine (답변 개선)"],
        correctIndex: 0,
        explanation: "도구(Tool)를 사용하여 외부 지식을 가져오고 그 결과를 다시 추론에 반영하는 자율 에이전트의 기본 구조입니다.",
        isExam: true
    },
    {
        categoryId: 'rag-agent',
        text: "RAG 시스템에서 'Latency(지연 시간)'를 유발하는 요소 중 사용자가 직접 통제할 수 없는 것은?",
        options: ["데이터 인덱싱 시 설정한 청크의 크기", "검색 단계에서 가져올 결과 문서의 개수", "사용 중인 LLM API 모델의 자체 생성 속도", "사용자가 입력한 프롬프트 및 질문의 길이", "사용자가 답변을 받기 위해 기다리는 시간"],
        correctIndex: 2,
        explanation: "모델의 연산 속도나 서버 부하로 인한 지연은 하드웨어나 모델 제공업체의 영역입니다.",
        isExam: true
    },
    {
        categoryId: 'rag-agent',
        text: "RAG를 도입해도 근본적으로 해결하기 어려운 모델의 고유 한계는?",
        options: ["학습 데이터 시점 이후의 최신 지식 부재", "기업 내부용 비공개 보안 문서에 대한 접근 불가", "모델 자체의 논리적 추론 및 사고 능력 부족", "사실과 다른 답변을 내놓는 Hallucination(환각)", "답변의 말투나 종결 어미 등 페르소나 조정"],
        correctIndex: 2,
        explanation: "RAG는 '참조 지식'을 넣어줄 뿐, 모델이 가진 논리력이나 지능 자체를 개선하지는 못합니다.",
        isExam: true
    },

    // --- Fine Tuning ---
    {
        categoryId: 'fine-tuning',
        text: "전체 훈련 데이터를 모델에 한 번 통과시키는 학습 단위를 무엇이라 하는가?",
        options: ["Batch (배치)", "Epoch (에폭)", "Step (스텝)", "Iteration (이터레이션)", "Learning Rate (학습률)"],
        correctIndex: 1,
        explanation: "1 에폭은 준비된 전체 데이터셋을 한 번 모두 훑어 학습한 상태를 의미합니다.",
        isExam: true
    },
    {
        categoryId: 'fine-tuning',
        text: "과적합(Overfitting)을 방지하기 위해 학습 도중 모델의 성능을 평가하는 별도의 데이터셋은?",
        options: ["Train Set (훈련 세트)", "Validation Set (검증 세트)", "Test Set (테스트 세트)", "Dummy Set (가상 세트)", "Raw Data (원천 데이터)"],
        correctIndex: 1,
        explanation: "학습 중에 실시간으로 모델의 일반화 성능을 체크하여 학습 중단 시점을 결정하는 데 사용됩니다.",
        isExam: true
    },
    {
        categoryId: 'fine-tuning',
        text: "모델 학습 시 오차(Loss)가 줄어들도록 가중치를 조정하는 가장 대표적인 최적화 알고리즘은?",
        options: ["Gradient Descent (경사 하강법)", "Heap Sorting (힙 정렬)", "Linear Regression (선형 회귀)", "K-Means Clustering (K-평균 군집화)", "Decision Tree (의사결정 나무)"],
        correctIndex: 0,
        explanation: "손실 함수의 기울기를 따라 오차가 최소화되는 지점으로 파라미터를 업데이트해 나가는 딥러닝의 핵심 기법입니다.",
        isExam: true
    },
    {
        categoryId: 'fine-tuning',
        text: "GPU 메모리가 부족할 때 베이스 모델을 양자화하여 아주 적은 파라미터만 학습시키는 기법은?",
        options: ["Full Fine-Tuning (전체 미세 조정)", "QLoRA (양자화 로라)", "Distillation (지식 증류)", "Pruning (모델 가지치기)", "Normalization (데이터 정규화)"],
        correctIndex: 1,
        explanation: "모델을 4비트 등으로 압축한 상태에서 LoRA 어댑터만 붙여 학습하여 메모리 효율을 극대화한 방식입니다.",
        isExam: true
    },
    {
        categoryId: 'fine-tuning',
        text: "파인 튜닝 후 정량적 지표 외에 실제 사람이 답변을 직접 보고 품질을 평가하는 방식은?",
        options: ["Unit Test (단위 테스트)", "Human Evaluation (정성 평가)", "Code Review (코드 검토)", "Static Analysis (정적 분석)", "Alpha Testing (알파 테스트)"],
        correctIndex: 1,
        explanation: "생성형 AI 답변의 모호함을 정량적 지표(BLEU 등)만으로는 판단하기 어려워 전문가의 직접 평가가 필수적입니다.",
        isExam: true
    }
];

async function main() {
    console.log(`Preparing to add ${mixedQuestions.length} mixed questions...`);

    // 1. Add to Database
    let addedCount = 0;
    for (const q of mixedQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: q.categoryId,
                isExam: true
            }
        });
        addedCount++;
    }
    console.log(`[DB] Successfully inserted ${addedCount} questions into Postgres.`);

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    let rawData;
    try {
        rawData = fs.readFileSync(DB_PATH, 'utf8');
    } catch (e) {
        console.error("Could not read db.json", e);
        return;
    }

    const categories = JSON.parse(rawData);

    // Helper map to track ID increment per category
    const idTracker: Record<string, number> = {};

    // Initialize trackers
    categories.forEach((c: any) => {
        let maxId = 0;
        c.questions.forEach((q: any) => {
            if (q.id > maxId) maxId = q.id;
        });
        idTracker[c.id] = maxId;
    });

    // Append questions
    let jsonAddedCount = 0;
    mixedQuestions.forEach(q => {
        const category = categories.find((c: any) => c.id === q.categoryId);
        if (category) {
            idTracker[q.categoryId]++;
            category.questions.push({
                id: idTracker[q.categoryId],
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: q.categoryId,
                isExam: true
            });
            jsonAddedCount++;
        } else {
            console.warn(`Category ${q.categoryId} not found in db.json for question: ${q.text.substring(0, 20)}`);
        }
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(categories, null, 2), 'utf8');
    console.log(`[JSON] Successfully appended ${jsonAddedCount} questions to db.json`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
