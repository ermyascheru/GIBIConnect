import { fetchAPI, setAuthSession, getUser } from './api.js';

export async function handleLogin(email, password) {
  const res = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (res.success && res.data) {
    setAuthSession(res.data.user, res.data.token);
    window.location.href = 'explore.html';
    return { success: true };
  } else {
    return { success: false, message: res.message || 'Invalid email or password.' };
  }
}

export async function handleRegister(fullName, email, password) {
  const res = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ full_name: fullName, email, password, role: 'user' })
  });

  if (res.success && res.data) {
    setAuthSession(res.data.user, res.data.token);
    window.location.href = 'explore.html';
    return { success: true };
  } else {
    return { success: false, message: res.message || 'Registration failed. Email may already exist.' };
  }
}

export function logout() {
  setAuthSession(null, null);
  window.location.href = 'login.html';
}

export function checkAuthGuard(requireAdmin = false) {
  const user = getUser();
  if (!user && requireAdmin) {
    window.location.href = 'login.html';
    return false;
  }
  if (requireAdmin && user.role !== 'admin' && user.role !== 'moderator') {
    return false;
  }
  return true;
}

window.gibiLogout = logout;
