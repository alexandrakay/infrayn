import { ReviewMode } from "@/lib/types";

export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  suggestedMode: ReviewMode;
}

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "API gateway + service mesh + Postgres + Redis + Kafka",
    suggestedMode: "system",
    content: `System: E-commerce platform using a microservices architecture.

Components:
- API Gateway (Kong) routes all external traffic and handles auth token validation
- Order Service (Node.js) handles order lifecycle; talks to Inventory and Payment services via gRPC
- Inventory Service (Go) manages stock; backed by Postgres with a Redis cache for hot SKUs
- Payment Service (Node.js) integrates Stripe; emits events to a Kafka topic on success
- Notification Service (Python) consumes Kafka events; sends email via SendGrid and SMS via Twilio
- Each service has its own Postgres database (database-per-service pattern)
- Service mesh: Istio for mTLS, retries, and circuit breaking between services
- All services deployed on Kubernetes (EKS); horizontal pod autoscaling enabled
- Centralized logging via ELK stack; distributed tracing with Jaeger`,
  },
  {
    id: "monolith",
    name: "Monolith",
    description: "Rails/Django-style single app with a relational DB",
    suggestedMode: "system",
    content: `System: SaaS project management tool built as a Rails monolith.

Components:
- Single Rails application handles all domains: auth, projects, tasks, billing, notifications
- PostgreSQL (RDS) as the primary database; ActiveRecord ORM
- Redis for session storage and Sidekiq background job queue
- Sidekiq workers handle email delivery, invoice generation, and webhook dispatch
- Assets compiled at deploy time; served via CDN (CloudFront)
- Deployed as a single Heroku web dyno with 2 worker dynos for Sidekiq
- Memcached for fragment caching of expensive views
- Single deploy pipeline; all features go out in one release`,
  },
  {
    id: "llm-pipeline",
    name: "LLM Pipeline",
    description: "RAG pipeline with embedding store, orchestration, and streaming",
    suggestedMode: "llm",
    content: `System: Retrieval-augmented generation (RAG) pipeline for a customer support chatbot.

Components:
- Ingestion pipeline: PDFs and HTML docs chunked (512 tokens, 64-token overlap), embedded via OpenAI text-embedding-3-small, stored in Pinecone
- Query path: user message embedded → top-k=5 semantic search in Pinecone → chunks passed as context to Claude claude-sonnet-4-6
- Orchestration: LangChain orchestrates retrieval + generation; runs on AWS Lambda (Python 3.12)
- Prompt: system prompt hardcoded with company persona; user message and retrieved chunks appended
- No conversation memory beyond the current turn; each request is stateless
- Output: streamed back to the frontend via Server-Sent Events
- No guardrails or output validation in place
- Model fallback: none; Claude is the only generation model
- Cost: ~$0.003 per query at current volume (1k queries/day)`,
  },
  {
    id: "serverless",
    name: "Serverless",
    description: "Lambda + API Gateway + DynamoDB + S3",
    suggestedMode: "system",
    content: `System: Image processing and storage platform built on AWS serverless infrastructure.

Components:
- API Gateway (HTTP API) exposes REST endpoints; JWT validation via Lambda authorizer
- Upload Lambda: generates S3 presigned URLs; client uploads directly to S3
- Processing Lambda: triggered by S3 ObjectCreated events; resizes images, generates thumbnails, writes metadata to DynamoDB
- Metadata Lambda: serves image metadata and CDN URLs from DynamoDB
- DynamoDB (on-demand) stores image metadata: user ID, filename, dimensions, S3 key, upload timestamp
- S3: raw uploads in one bucket, processed images in a second bucket; both behind CloudFront
- SQS dead-letter queue captures failed Processing Lambda invocations
- CloudWatch Logs for all Lambda functions; alerts on error rate > 1%
- No VPC; all services use public AWS endpoints with IAM roles for access control`,
  },
  {
    id: "crud-rest-api",
    name: "CRUD REST API",
    description: "Express/FastAPI + single DB, no caching",
    suggestedMode: "system",
    content: `System: Simple task management REST API.

Components:
- FastAPI (Python 3.12) application handling CRUD operations for users, tasks, and tags
- PostgreSQL (single instance, RDS t3.medium) as the only data store
- SQLAlchemy ORM with Alembic for schema migrations
- Uvicorn ASGI server behind an Nginx reverse proxy
- Deployed on a single EC2 instance (t3.medium); no auto-scaling
- Authentication: JWT tokens issued on login; validated on every request via middleware
- No caching layer; every request hits the database
- No message queue; all operations are synchronous
- Backups: daily RDS snapshots retained for 7 days
- No CDN; static files (OpenAPI docs) served directly from the app`,
  },
];
