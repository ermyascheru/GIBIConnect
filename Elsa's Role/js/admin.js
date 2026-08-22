import { getUser, getUsers, getResources, approveResource, rejectResource, updateUserRole, updateUserStatus } from './api.js';

async function initAdmin() {
  const user = getUser();
  const restricted = document.getElementById('admin-restricted-view');
  const main = document.getElementById('admin-main-view');

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    if (restricted) restricted.classList.remove('hidden');
    if (main) main.classList.add('hidden');
    return;
  }

  const [usersRes, pendingRes] = await Promise.all([
    getUsers(),
    getResources({ status: 'pending' })
  ]);

  const userCount = document.getElementById('admin-user-count');
  const usersTbody = document.getElementById('admin-users-tbody');
  const queue = document.getElementById('moderation-queue');

  if (usersRes.data) {
    if (userCount) userCount.textContent = usersRes.data.length;
    if (usersTbody) {
      usersTbody.innerHTML = usersRes.data.map(u => `
        <tr class="border-b border-outline-variant/10 hover:bg-surface-container-high/40 transition">
          <td class="p-3 font-semibold text-primary">${u.full_name || 'Scholar'}</td>
          <td class="p-3 font-mono text-[11px]">${u.email}</td>
          <td class="p-3">
            <select onchange="window.handleChangeUserRole('${u.id}', this.value)" class="bg-surface-container-low border border-outline-variant/25 rounded-lg px-2 py-1 text-[10px] font-bold uppercase text-primary outline-none">
              <option value="user" ${u.role === 'user' ? 'selected' : ''}>USER</option>
              <option value="moderator" ${u.role === 'moderator' ? 'selected' : ''}>MODERATOR</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>ADMIN</option>
            </select>
          </td>
          <td class="p-3">
            <button onclick="window.handleToggleUserStatus('${u.id}', '${u.status === 'active' ? 'suspended' : 'active'}')" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${u.status === 'active' ? 'bg-emerald-500/20 text-[#10B981] hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'}">
              ${u.status || 'Active'}
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  if (pendingRes.data && queue) {
    if (pendingRes.data.length === 0) {
      queue.innerHTML = '<p class="text-xs text-on-surface-variant p-4 text-center rounded-xl bg-surface-container-low">✓ All uploaded academic materials are currently verified and approved.</p>';
    } else {
      queue.innerHTML = pendingRes.data.map(r => `
        <div class="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
          <div>
            <span class="px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-amber-400/20 text-amber-300">${r.file_extension}</span>
            <h4 class="font-bold text-sm mt-1 text-primary">${r.title}</h4>
            <p class="text-xs text-on-surface-variant">${r.description || 'Uploaded file'}</p>
          </div>
          <div class="flex gap-2">
            <button onclick="window.handleApprove('${r.id}')" class="px-3 py-1.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-bold hover:bg-[#0da271] transition cursor-pointer">Approve</button>
            <button onclick="window.handleReject('${r.id}')" class="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer">Reject</button>
          </div>
        </div>
      `).join('');
    }
  }
}

window.handleChangeUserRole = async function(id, newRole) {
  const res = await updateUserRole(id, newRole);
  if (res.success) {
    initAdmin();
  } else {
    alert(res.message || 'Failed to update role');
  }
};

window.handleToggleUserStatus = async function(id, newStatus) {
  const res = await updateUserStatus(id, newStatus);
  if (res.success) {
    initAdmin();
  } else {
    alert(res.message || 'Failed to update status');
  }
};

window.handleApprove = async function(id) {
  const res = await approveResource(id);
  if (res.success) {
    alert('Resource approved successfully.');
    initAdmin();
  }
};

window.handleReject = async function(id) {
  const reason = prompt('Rejection reason:') || 'Quality standards';
  const res = await rejectResource(id, reason);
  if (res.success) {
    initAdmin();
  }
};

document.addEventListener('DOMContentLoaded', initAdmin);

