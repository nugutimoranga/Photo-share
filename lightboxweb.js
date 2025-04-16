const gallery = document.getElementById('gallery');
const uploadInput = document.getElementById('uploadInput');
const modalImage = document.getElementById('modalImage');
const spinner = document.getElementById('loadingSpinner');
const emptyMessage = document.getElementById('emptyMessage');

// Modal image preview using delegation
gallery.addEventListener('click', function (e) {
  const img = e.target.closest('.gallery-img');
  if (img) {
    modalImage.src = img.getAttribute('data-bs-img');
  }
});

// Handle image upload
uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  spinner.classList.remove('hidden');

  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <img src="${e.target.result}" class="img-fluid gallery-img" alt="${file.name}" 
             data-bs-toggle="modal" data-bs-target="#lightboxModal" data-bs-img="${e.target.result}">
      `;
      col.innerHTML = `
  <div class="image-wrapper">
    <button class="delete-btn" title="Remove Image">&times;</button>
    <img src="${e.target.result}" class="img-fluid gallery-img" alt="${file.name}" 
         data-bs-toggle="modal" data-bs-target="#lightboxModal" data-bs-img="${e.target.result}">
  </div>
`;
const deleteBtn = col.querySelector('.delete-btn');
deleteBtn.addEventListener('click', () => {
  col.remove();
  if (gallery.querySelectorAll('.col-md-4').length === 0) {
    emptyMessage.style.display = 'block';
  }
});

      gallery.appendChild(col);
      emptyMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  setTimeout(() => spinner.classList.add('hidden'), 600); // Fake load time
});

function saveToLocalStorage() {
    const images = gallery.querySelectorAll('.gallery-img');
    const imageSources = Array.from(images).map(img => img.src);
    localStorage.setItem('photoshare_images', JSON.stringify(imageSources));
  }
  
  function loadFromLocalStorage() {
    const storedImages = JSON.parse(localStorage.getItem('photoshare_images') || '[]');
    if (storedImages.length) {
      emptyMessage.style.display = 'none';
      storedImages.forEach(src => appendImageToGallery(src));
    }
  }
  
  function appendImageToGallery(src) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="image-wrapper">
        <button class="delete-btn" title="Remove Image">&times;</button>
        <img src="${src}" class="img-fluid gallery-img" alt="Uploaded image" 
             data-bs-toggle="modal" data-bs-target="#lightboxModal" data-bs-img="${src}">
      </div>
    `;
    gallery.appendChild(col);
  
    col.querySelector('.gallery-img').addEventListener('click', () => {
      modalImage.src = src;
    });
  
    col.querySelector('.delete-btn').addEventListener('click', () => {
      col.remove();
      saveToLocalStorage();
      if (gallery.querySelectorAll('.col-md-4').length === 0) {
        emptyMessage.style.display = 'block';
      }
    });
  }
  
  window.addEventListener('load', loadFromLocalStorage);
  const dropArea = document.getElementById('dropArea');

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });
  
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });
  
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });
  
  function handleFiles(files) {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        appendImageToGallery(e.target.result);
        emptyMessage.style.display = 'none';
        saveToLocalStorage();
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Hook into the regular upload
  uploadInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
  const toggle = document.getElementById('darkModeToggle');

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('photoshare_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
  
  window.addEventListener('load', () => {
    const theme = localStorage.getItem('photoshare_theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      toggle.checked = true;
    }
  });
      