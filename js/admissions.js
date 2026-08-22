// Admissions JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const admissionsList = document.getElementById('admissionsList');
    
    // Mock data
    const admissions = [
        { id: 1, name: "Addis Ababa University", program: "Software Engineering", deadline: "Aug 30, 2026", status: "Open" },
        { id: 2, name: "Jimma University", program: "Medicine", deadline: "Sep 15, 2026", status: "Open" },
        { id: 3, name: "Hawassa University", program: "Computer Science", deadline: "Jul 20, 2026", status: "Closed" }
    ];

    if (admissionsList) {
        admissionsList.innerHTML = admissions.map(adm => `
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-800">${adm.name}</h3>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${adm.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${adm.status}</span>
                </div>
                <p class="text-blue-600 font-medium mb-4">${adm.program}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Deadline: ${adm.deadline}
                </div>
                <a href="Admission_profile.html?id=${adm.id}" class="inline-block text-center w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 rounded font-medium transition">View Details</a>
            </div>
        `).join('');
    }
});
