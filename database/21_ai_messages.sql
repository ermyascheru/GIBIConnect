-- 21_ai_messages.sql
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role ai_message_role NOT NULL,
  content TEXT NOT NULL,
  retrieved_context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
