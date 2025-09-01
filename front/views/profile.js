/* front/views/profile.js */

/**
 * renderProfileView
 * - Renderiza la vista del perfil dentro de #profile-view.
 * - Obtiene el usuario autenticado del backend.
 * - ES: ajusta API_BASE_URL, TOKEN_KEY y endpoint según tu backend real.
 */
window.renderProfileView = async function renderProfileView() {
  // ES: configura tu backend real aquí
  const API_BASE_URL = "http://localhost:3000";
  const TOKEN_KEY = "token";
  const ENDPOINT = "/api/users/me"; // ES: cambia si tu ruta es distinta

  // ES: helper para alternar vistas usando tu misma convención main-view
  function showOnly(id) {
    document.querySelectorAll(".main-view").forEach(v => v.classList.add("hidden"));
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }

  const container = document.getElementById("profile-content");
  showOnly("profile-view");

  // ES: loading
  container.innerHTML = `<p>Loading your profile...</p>`;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    container.innerHTML = `
      <h1 class="text-2xl font-bold mb-2">My Profile</h1>
      <p class="text-gray-700">You are not logged in.</p>
      <a href="javascript:void(0);" class="text-teal-600 underline" id="open-login">Sign in</a>
    `;
    // ES: si tienes un modal de login, dispáralo aquí si aplica
    const openLogin = document.getElementById("open-login");
    if (openLogin) openLogin.addEventListener("click", () => {
      const loginModal = document.getElementById("login-modal");
      if (loginModal) loginModal.classList.remove("hidden");
    });
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        container.innerHTML = `
          <h1 class="text-2xl font-bold mb-2">My Profile</h1>
          <p class="text-gray-700">Your session has expired.</p>
          <a href="javascript:void(0);" class="text-teal-600 underline" id="open-login">Sign in again</a>
        `;
        const openLogin = document.getElementById("open-login");
        if (openLogin) openLogin.addEventListener("click", () => {
          const loginModal = document.getElementById("login-modal");
          if (loginModal) loginModal.classList.remove("hidden");
        });
        return;
      }
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    const user = await res.json();

    // ES: ajusta estos campos según tu respuesta real del backend
    const {
      firstName,
      lastName,
      email,
      phone,
      documentId,
      address,
      city,
      country,
      avatarUrl
    } = user;

    container.innerHTML = `
      <section class="flex items-center gap-4 mb-6">
        <img src="${avatarUrl || 'https://via.placeholder.com/96'}" alt="Avatar"
             class="w-24 h-24 rounded-full object-cover">
        <div>
          <h1 class="text-2xl font-bold">My Profile</h1>
          <p class="text-gray-600">${email || ""}</p>
        </div>
      </section>

      <section class="rounded-2xl border p-5 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${infoRow("First name", firstName)}
          ${infoRow("Last name", lastName)}
          ${infoRow("Email", email)}
          ${infoRow("Phone", phone)}
          ${infoRow("Document ID", documentId)}
          ${infoRow("Address", address)}
          ${infoRow("City", city)}
          ${infoRow("Country", country)}
        </div>
      </section>
    `;
  } catch (err) {
    container.innerHTML = `
      <h1 class="text-2xl font-bold mb-2">My Profile</h1>
      <p class="text-red-600">Error: ${err.message || "Unexpected error"}</p>
    `;
  }
};

/**
 * infoRow
 * - Crea un bloque etiqueta/valor estilizado con Tailwind.
 */
function infoRow(label, value) {
  return `
    <div class="flex flex-col">
      <span class="text-sm text-gray-500">${label}</span>
      <span class="font-medium">${value || "-"}</span>
    </div>
  `;
}
