const db = require('../config/database');

class AIRepository {
  async createConversation(userId = null, institutionId = null, title = 'Academic Advisory Session') {
    const query = `
      INSERT INTO ai_conversations (user_id, institution_context_id, title)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId, institutionId, title]);
    return rows[0];
  }

  async getConversation(id) {
    const query = 'SELECT * FROM ai_conversations WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async saveMessage(conversationId, role, content, retrievedContext = null) {
    const query = `
      INSERT INTO ai_messages (conversation_id, role, content, retrieved_context)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(query, [conversationId, role, content, retrievedContext ? JSON.stringify(retrievedContext) : null]);
    return rows[0];
  }

  async getMessages(conversationId) {
    const query = 'SELECT * FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC';
    const { rows } = await db.query(query, [conversationId]);
    return rows;
  }
}

module.exports = new AIRepository();
