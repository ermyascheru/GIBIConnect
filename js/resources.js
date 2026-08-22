// Resources JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const resourcesContainer = document.getElementById('resourcesContainer');
    
    // Mock data
    const resources = [
        { title: "How to apply for University Placement", category: "Guide", readTime: "5 min read" },
        { title: "Top 10 Scholarships for Freshmen", category: "Listicle", readTime: "8 min read" },
        { title: "Preparing for Entrance Exams", category: "Tips", readTime: "12 min read" }
    ];

    if (resourcesContainer) {
        resourcesContainer.innerHTML = resources.map(res => `
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">${res.category}</span>
                <h3 class="text-lg font-bold text-gray-900 mt-2 mb-4">${res.title}</h3>
                <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    ${res.readTime}
                </div>
            </div>
        `).join('');
    }
});
