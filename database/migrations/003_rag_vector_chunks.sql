-- 003_rag_vector_chunks.sql
-- Additive pgvector storage for RAG document chunking and semantic embeddings

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS rag_document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_length INTEGER NOT NULL,
  page_number INTEGER,
  document_version VARCHAR(64),
  metadata JSONB,
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource_id, chunk_index, document_version)
);

CREATE INDEX IF NOT EXISTS rag_document_chunks_resource_idx ON rag_document_chunks(resource_id);
CREATE INDEX IF NOT EXISTS rag_document_chunks_institution_idx ON rag_document_chunks(institution_id);
CREATE INDEX IF NOT EXISTS rag_document_chunks_embedding_hnsw_idx ON rag_document_chunks USING hnsw (embedding vector_cosine_ops);
