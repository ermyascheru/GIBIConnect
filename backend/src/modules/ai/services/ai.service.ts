import pool from "../../../config/database";
import { llmClient } from "./llm.client";

export class AIService {
  async chat(userId: string, message: string, sessionId?: string) {
    let conversationId = sessionId;

    // Continue a conversation only if it belongs to this user.
    if (conversationId) {
      const existing = await pool.query(
        `SELECT id
         FROM public.ai_conversations
         WHERE id = $1 AND user_id = $2`,
        [conversationId, userId]
      );

      if (existing.rowCount === 0) {
        throw new Error("CONVERSATION_NOT_FOUND");
      }
    } else {
      const created = await pool.query(
        `INSERT INTO public.ai_conversations (user_id, title)
         VALUES ($1, $2)
         RETURNING id`,
        [userId, message.slice(0, 80)]
      );

      conversationId = created.rows[0].id;
    }

    await pool.query(
      `INSERT INTO public.ai_messages (conversation_id, role, content)
       VALUES ($1, 'user', $2)`,
      [conversationId, message]
    );

    const result = await llmClient.generateGroundedCompletion({
      systemPrompt:
        "You are GIBIConnect's educational assistant. Help students understand higher education, university programs, admissions, scholarships, and learning topics. Be clear and honest. Do not invent official university information.",
      userPrompt: message,
      temperature: 0.2,
    });

    await pool.query(
      `INSERT INTO public.ai_messages (conversation_id, role, content)
       VALUES ($1, 'assistant', $2)`,
      [conversationId, result.text]
    );

    return {
      conversationId,
      message: result.text,
      provider: result.provider,
    };
  }

  async listConversations(userId: string) {
    const result = await pool.query(
      `SELECT
         c.id,
         c.title,
         c.created_at,
         c.updated_at,
         (SELECT COUNT(*)::int
          FROM public.ai_messages m
          WHERE m.conversation_id = c.id) AS message_count
       FROM public.ai_conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    return result.rows;
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await pool.query(
      `SELECT id, title, created_at, updated_at
       FROM public.ai_conversations
       WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    if (conversation.rowCount === 0) {
      throw new Error("CONVERSATION_NOT_FOUND");
    }

    const messages = await pool.query(
      `SELECT id, role, content, created_at
       FROM public.ai_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return {
      ...conversation.rows[0],
      messages: messages.rows,
    };
  }

  async renameConversation(
    userId: string,
    conversationId: string,
    title: string
  ) {
    const result = await pool.query(
      `UPDATE public.ai_conversations
       SET title = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING id, title, updated_at`,
      [title, conversationId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("CONVERSATION_NOT_FOUND");
    }

    return result.rows[0];
  }

  async deleteConversation(userId: string, conversationId: string) {
    const result = await pool.query(
      `DELETE FROM public.ai_conversations
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [conversationId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("CONVERSATION_NOT_FOUND");
    }

    return { message: "Conversation deleted successfully." };
  }
}

export const aiService = new AIService();