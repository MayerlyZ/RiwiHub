// /front/views/profile.js

// Esta función será llamada por showSection en app.js
function renderUserProfile() {
  const profileContainer = document.getElementById('profile-content');

  // Asegurarnos de que el contenedor existe
  if (!profileContainer) return;

  // Verificamos si la variable global 'userData' existe
  if (typeof userData !== 'undefined' && userData) {
    
    // Construimos la tarjeta del perfil con clases de Tailwind CSS
    profileContainer.innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto border transform transition-all duration-500 ease-in-out scale-100">
        <div class="flex flex-col items-center">
          <div class="relative">
            <img class="w-28 h-28 mb-4 rounded-full shadow-md border-4 border-white" src="./front/images/logopestaña.png" alt="Foto de perfil">
            <span class="absolute bottom-4 right-0 block h-5 w-5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <h2 class="text-3xl font-bold text-gray-800">${userData.name}</h2>
          <p class="text-md text-gray-500 mt-1">${userData.email}</p>
          
          <div class="mt-8 w-full text-left space-y-4">
            <div class="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg">
              <i class="fas fa-calendar-alt w-6 text-center text-gray-400"></i>
              <strong class="font-medium ml-4">Miembro desde:</strong> 
              <span class="ml-auto font-light">${new Date(userData.registrationDate).toLocaleDateString()}</span>
            </div>
            <div class="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg">
              <i class="fas fa-user-tag w-6 text-center text-gray-400"></i>
              <strong class="font-medium ml-4">Rol:</strong> 
              <span class="ml-auto font-light">Cliente</span>
            </div>
          </div>

          <button class="mt-8 w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
            Editar Perfil
          </button>
        </div>
      </div>
    `;

  } else {
    // Mensaje de error si no se encuentran los datos
    profileContainer.innerHTML = `
      <div class="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p class="text-red-600 font-semibold">No se pudo cargar la información del perfil.</p>
        <p class="text-gray-600 mt-2">Por favor, asegúrate de haber iniciado sesión.</p>
      </div>
    `;
    console.error('La variable global "userData" no fue encontrada.');
  }
}