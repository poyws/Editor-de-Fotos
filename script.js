const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const widthRange = document.getElementById('widthRange');
const heightRange = document.getElementById('heightRange');
const brightnessRange = document.getElementById('brightnessRange');
const contrastRange = document.getElementById('contrastRange');
const saturationRange = document.getElementById('saturationRange');
const hueRange = document.getElementById('hueRange');
const cropBtn = document.getElementById('cropBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let originalImage = null;
let currentImage = null;
let isDrawing = false;
let cropStartX = 0;
let cropStartY = 0;
let cropEndX = 0;
let cropEndY = 0;

// Initial canvas setup
canvas.width = 300;
canvas.height = 300;
ctx.fillStyle = '#eee';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Load image
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      currentImage = img;
      canvas.width = img.width;
      canvas.height = img.height;
      widthRange.value = img.width;
      heightRange.value = img.height;
      updateCanvas();
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

// Update functions
function updateCanvas() {
  if (!originalImage) return;

  canvas.width = parseInt(widthRange.value);
  canvas.height = parseInt(heightRange.value);
  
  ctx.filter = `brightness(${100 + parseInt(brightnessRange.value)}%) 
                contrast(${100 + parseInt(contrastRange.value)}%)
                saturate(${100 + parseInt(saturationRange.value)}%)
                hue-rotate(${parseInt(hueRange.value)}deg)`;
  
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

// Event Listeners
widthRange.addEventListener('input', (e) => {
  document.getElementById('widthValue').textContent = `${e.target.value}px`;
  updateCanvas();
});

heightRange.addEventListener('input', (e) => {
  document.getElementById('heightValue').textContent = `${e.target.value}px`;
  updateCanvas();
});

brightnessRange.addEventListener('input', updateCanvas);
contrastRange.addEventListener('input', updateCanvas);
saturationRange.addEventListener('input', updateCanvas);
hueRange.addEventListener('input', updateCanvas);

// Crop functionality
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  isDrawing = true;
  cropStartX = e.clientX - rect.left;
  cropStartY = e.clientY - rect.top;
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  cropEndX = e.clientX - rect.left;
  cropEndY = e.clientY - rect.top;
  isDrawing = false;
});

cropBtn.addEventListener('click', () => {
  const width = cropEndX - cropStartX;
  const height = cropEndY - cropStartY;
  const croppedImage = ctx.getImageData(cropStartX, cropStartY, width, height);
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(croppedImage, 0, 0);
});

// Reset button
resetBtn.addEventListener('click', () => {
  brightnessRange.value = 0;
  contrastRange.value = 0;
  saturationRange.value = 0;
  hueRange.value = 0;
  currentImage = originalImage;
  updateCanvas();
});

// Download button
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
