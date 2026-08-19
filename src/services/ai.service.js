const db = require("../config/database");

class AIService {
  async handleQuery(userId, userMessage) {
    // 1. Log conversation turn
    const convQuery = `
      INSERT INTO ai_conversations (user_id, status)
      VALUES ($1, 'active')
      RETURNING id;
    `;
    const { rows: convRows } = await db.query(convQuery, [userId || null]);
    const conversationId = convRows[0].id;

    // 2. Log incoming user message
    await db.query(
      `INSERT INTO ai_messages (conversation_id, sender, content) VALUES ($1, $2, $3);`,
      [conversationId, "user", userMessage]
    );

    // 3. Generate response with DB context
    const aiResponse = `Assisting with request: "${userMessage}". System ready.`;

    // 4. Log AI system response
    await db.query(
      `INSERT INTO ai_messages (conversation_id, sender, content) VALUES ($1, $2, $3);`,
      [conversationId, "assistant", aiResponse]
    );

    return { conversationId, response: aiResponse };
  }
}

module.exports = new AIService();
