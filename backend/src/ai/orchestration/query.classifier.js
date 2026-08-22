class QueryClassifier {
  classify(queryText) {
    const q = queryText.toLowerCase();

    const isSummarization = q.includes('summarize') || q.includes('summary') || q.includes('explain this document') || q.includes('read the paper');
    const isTuition = q.includes('tuition') || q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('how much');
    const isScholarship = q.includes('scholarship') || q.includes('grant') || q.includes('financial aid') || q.includes('funding');
    const isProgram = q.includes('program') || q.includes('degree') || q.includes('major') || q.includes('master') || q.includes('bachelor') || q.includes('phd') || q.includes('course');
    const isUniversity = q.includes('university') || q.includes('college') || q.includes('institution') || q.includes('campus') || q.includes('aau') || q.includes('addis ababa');
    const isAdmission = q.includes('admission') || q.includes('requirement') || q.includes('deadline') || q.includes('apply') || q.includes('eligibility');
    const isResearch = q.includes('research') || q.includes('paper') || q.includes('thesis') || q.includes('dissertation') || q.includes('journal') || q.includes('doi');

    let intent = 'GENERAL';

    if (isSummarization) {
      intent = 'RAG';
    } else if ((isUniversity || isProgram || isTuition || isScholarship) && isAdmission) {
      intent = 'HYBRID';
    } else if (isUniversity || isProgram || isTuition || isScholarship) {
      intent = 'STRUCTURED';
    } else if (isResearch || isAdmission) {
      intent = 'HYBRID';
    }

    return {
      intent,
      categories: {
        isUniversity,
        isProgram,
        isTuition,
        isScholarship,
        isAdmission,
        isResearch
      }
    };
  }
}

module.exports = new QueryClassifier();
