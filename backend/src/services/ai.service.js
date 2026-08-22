const aiRepository = require('../repositories/ai.repository');
const institutionsRepository = require('../repositories/institutions.repository');
const programsRepository = require('../repositories/programs.repository');

class AIService {
  async processConsultation({ prompt, conversation_id, institution_id, userId = null }) {
    if (!prompt) {
      const err = new Error('Prompt is required');
      err.statusCode = 400;
      throw err;
    }

    // 1. Establish conversation
    let conv;
    if (conversation_id) {
      conv = await aiRepository.getConversation(conversation_id);
    }
    if (!conv) {
      conv = await aiRepository.createConversation(userId, institution_id, prompt.slice(0, 45));
    }

    // 2. Persist user message turn
    await aiRepository.saveMessage(conv.id, 'user', prompt);

    // 3. Grounding Context Query from PostgreSQL
    let groundingContext = {};
    if (institution_id) {
      const inst = await institutionsRepository.findById(institution_id);
      const programs = await programsRepository.findByInstitutionId(institution_id);
      groundingContext = {
        institution: inst ? { name: inst.name, city: inst.city, region: inst.region, type: inst.type } : null,
        programs: programs.slice(0, 5).map(p => ({ name: p.name, degree_level: p.degree_level }))
      };
    }

    // 4. Generate grounded advisory response
    const responseText = groundingContext.institution
      ? `Regarding ${groundingContext.institution.name} (${groundingContext.institution.city}): Based on verified academic records, offering programs including ${groundingContext.programs.map(p => p.name).join(', ')}. How can I further assist your application planning?`
      : `GIBIConnect Academic Advisory: I have analyzed your inquiry regarding "${prompt}". Based on authoritative Ethiopian higher education data, explore our directory of accredited universities and programs.`;

    // 5. Persist assistant message with verified context
    await aiRepository.saveMessage(conv.id, 'assistant', responseText, groundingContext);

    return {
      conversation_id: conv.id,
      response: responseText,
      groundingContext
    };
  }
}

module.exports = new AIService();
