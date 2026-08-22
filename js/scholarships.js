// Scholarships JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const scholarshipsList = document.getElementById('scholarshipsList');
    
    // Mock data
    const scholarships = [
        { id: 1, name: "Excellence in STEM", type: "Merit", amount: "15,000 ETB", deadline: "Sep 15, 2026" },
        { id: 2, name: "Regional Support Grant", type: "Need-based", amount: "10,000 ETB", deadline: "Oct 01, 2026" },
        { id: 3, name: "Women in Tech Award", type: "Merit", amount: "20,000 ETB", deadline: "Aug 25, 2026" }
    ];

    if (scholarshipsList) {
        scholarshipsList.innerHTML = scholarships.map(sch => `
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-3">${sch.type}</span>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${sch.name}</h3>
                <p class="text-2xl font-bold text-green-600 mb-4">${sch.amount}</p>
                <div class="flex items-center text-sm text-gray-500 mb-6">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Deadline: ${sch.deadline}
                </div>
                <a href="scholarship_profile.html?id=${sch.id}" class="inline-block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition">View Scholarship</a>
            </div>
        `).join('');
    }
});
