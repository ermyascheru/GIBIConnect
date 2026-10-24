const readline = require('readline');
const aiOrchestrator = require('./orchestration/ai.orchestrator');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentConversationId = null;

console.log('================================================================');
console.log('         GIBICONNECT INTERACTIVE AI TERMINAL (VS CODE)          ');
console.log('================================================================');
console.log('Connected to: Ollama (nomic-embed-text + llama3.2) + pgvector');
console.log('Type your question below (or type "exit" to quit):\n');

function askQuestion() {
  rl.question('\n\x1b[36mYou:\x1b[0m ', async (userInput) => {
    const query = userInput.trim();
    if (!query) {
      askQuestion();
      return;
    }
    if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
      console.log('\nGoodbye!');
      process.exit(0);
    }

    console.log('\x1b[33m[AI Thinking & Retrieving Context...]\x1b[0m');
    try {
      const result = await aiOrchestrator.processConsultation({
        prompt: query,
        conversation_id: currentConversationId
      });

      currentConversationId = result.conversation_id;

      console.log(`\n\x1b[32mGIBIConnect AI (Intent: ${result.intent}):\x1b[0m`);
      console.log(result.answer);

      if (result.sources && result.sources.length > 0) {
        console.log('\n\x1b[34m--- Attributed Sources ---\x1b[0m');
        result.sources.forEach((s, idx) => {
          console.log(`  [${idx + 1}] ${s.title} (${s.institutionName || 'GIBIConnect'}) - Similarity: ${s.similarity}`);
        });
      }
    } catch (err) {
      console.error('\x1b[31mError:\x1b[0m', err.message);
    }

    askQuestion();
  });
}

askQuestion();
