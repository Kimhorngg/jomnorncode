// src/lib/api.js
const API_BASE = "http://localhost:5000/api"; // ← ប្តូរទៅជា URL ពិតប្រាកដរបស់ backend អ្នក

export async function createOrSyncUser(firebaseUser, role) {
  const token = await firebaseUser.getIdToken(true); // force refresh token

  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "អ្នកប្រើប្រាស់",
      role: role, // "student" ឬ "teacher"
      // បន្ថែមវាលផ្សេងទៀតបើ backend ត្រូវការ (ឧ. schoolId)
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `មានបញ្ហា API: ${response.status}`);
  }

  return response.json(); // អាចត្រឡប់ទិន្នន័យអ្នកប្រើប្រាស់
}

export async function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) throw new Error("មិនទាន់ចូលគណនី");

  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("មិនអាចទាញយកព័ត៌មានអ្នកប្រើប្រាស់");
  return response.json();
}