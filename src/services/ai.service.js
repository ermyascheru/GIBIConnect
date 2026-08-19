const db = require('../config/database');

class AIService {
  async processPrompt({ prompt, institutionId = null, userId = null }) {
    const convQuery = `
      INSERT INTO ai_conversations (user_id, institution_context_id, title)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const title = prompt.slice(0, 50);
    const { rows: convRows } = await db.query(convQuery, [userId || null, institutionId || null, title]);
    const conversationId = convRows[0].id;

    await db.query(
      `INSERT INTO ai_messages (conversation_id, role, content) VALUES ($1, 'user', $2);`,
      [conversationId, prompt]
    );

    let contextData = null;
    if (institutionId) {
      const instRes = await db.query('SELECT name, description, city, region FROM institutions WHERE id = $1', [institutionId]);
      contextData = instRes.rows[0] || null;
    }

    const aiResponse = `GIBIConnect Academic Advisor response for: "${prompt}"`;

    await db.query(
      `INSERT INTO ai_messages (conversation_id, role, content, retrieved_context) VALUES ($1, 'assistant', $2, $3);`,
      [conversationId, aiResponse, contextData ? JSON.stringify(contextData) : null]
    );

    return { conversationId, response: aiResponse };
  }
}

module.exports = new AIService();
