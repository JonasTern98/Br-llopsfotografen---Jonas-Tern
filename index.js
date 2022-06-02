
const videoElem = document.querySelector('#camera');
const canvas = document.querySelector('#picture')
const canvasContext = canvas.getContext('2d')
let stream;
let photoGallery = JSON.parse(localStorage.getItem('cameraApp')) || [];

const photoSection = document.querySelector('#photo-section');
const takenPhotoSection = document.querySelector('#taken-photo-section');
const gallerySection = document.querySelector('#gallery-section');
const galleryImages = document.querySelector('#gallery-images');
const takePictureButton = document.querySelector('#take-picture');
const newPictureButton = document.querySelector('#new-picture');
const galleryIcon = document.querySelector('.gallery-icon')
const photoIcon = document.querySelector('#photo-icon')


const websiteLoader = setTimeout(loader, 1500)
function loader() {
    const loaderElem = document.querySelector('.loader-wrapper');
    loaderElem.style.display = "none";
}


window.addEventListener('load', async () => {
    if ('mediaDevices' in navigator) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoElem.srcObject = stream;
    }
});

//NOTIFICATIONS
window.addEventListener('load', () => {
    Notification.requestPermission().then((permission) => {
        console.log(permission);
    })
})
function notificationSavedImage() {
    const text = "Din bild har sparats i localStorage!";
    const img = './icons/bf-icon-192.png'

    const notification = new Notification('Bröllopsfotografen', {body: text, icon: img})
}
function notificationDeletedImage() {
    const text = "Din bild har tagits bort från localStorage!";
    const img = './icons/bf-icon-192.png'

    const notification = new Notification('Bröllopsfotografen', {body: text, icon: img})
}


takePictureButton.addEventListener('click', () => {
    canvasContext.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    const imageID = photoGallery.length;
    photoGallery.push({
        id: imageID,
        image: imageData
    });
    localStorage.setItem('cameraApp', JSON.stringify(photoGallery))
    
    photoSection.style.display = 'none';
    takenPhotoSection.style.display = 'flex';
    galleryIcon.style.display ="flex";
    
    
    getImages();
    // updateJsonBin();
    notificationSavedImage();
})

function createImage(){
    const gallImg = photoGallery.map((image, index) => {
        return `<img onclick="deleteImage(${index})" class="gallery-images" src="${image.image}">`
     }).join('');


     galleryImages.innerHTML = gallImg;
};

function getImages(){
    galleryImages.innerHTML = "";
    for(const image of photoGallery){
        
        createImage()
    }
    // jsonBinImages();
};

function loadImages(){
    photoGallery = JSON.parse(localStorage.getItem("cameraApp"));
    galleryImages.innerHTML = "";
        
        const gallImg = photoGallery.map((image, index) => {
            return `<span class="image-container ${index}"><div onclick="deleteImage(${index})" class="delete-button"></div><img class="gallery-images" src="${image.image}"/></span>`
        }).join('');
        
        galleryImages.innerHTML = gallImg;
    }
    
        
function deleteImage (index) {
    const getLocalStorage = JSON.parse(localStorage.getItem("cameraApp"));
    const imageElem = document.getElementsByClassName(`${index}`);
    getLocalStorage.splice(index, 1);

    localStorage.setItem('cameraApp', JSON.stringify(getLocalStorage));
    
    imageElem[0].remove();
    notificationDeletedImage();
    loadImages();
}

//JSONBIN
//     const API_KEY = '$2b$10$djAUNJwI3wHZSvNOZP3nguFIZJKpFK.pKSzx9qcAeWZEbJF26x3yy'

//     async function jsonBinImages(){
//     const response = await fetch('https://api.jsonbin.io/b/62986932402a5b3802199f32/latest', {
//         headers: {
//             'X-Master-Key': API_KEY
//         }
//     })
//     const data = await response.json();

//     galleryImages.innerHTML = "";
        
//     const gallImg = data.map((image, index) => {
//         return `<span class="image-container"><div onclick="deleteImage(${index})" class="delete-button"></div><img class="gallery-images" src="${image.image}"/></span>`
//     }).join('');
    
//     galleryImages.innerHTML = gallImg;
// }

//     async function updateJsonBin(){

//         const response = await fetch('https://api.jsonbin.io/b/62986932402a5b3802199f32', {
//             method: 'PUT',
//             body: JSON.stringify(photoGallery),
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Master-Key': API_KEY
//             }
//         });
//         const data = await response.json()

//         console.log(data)

//         jsonBinImages();
//     }

    





//Modals
newPictureButton.addEventListener('click', () => {
    photoSection.style.display = 'flex';
    takenPhotoSection.style.display = 'none';
    
    
})
galleryIcon.addEventListener('click', () => {
    photoSection.style.display = 'none';
    gallerySection.style.display = 'flex';
    
    loadImages();
    // jsonBinImages();
    
})
photoIcon.addEventListener('click', () => {
    photoSection.style.display = 'flex';
    gallerySection.style.display = 'none';
    
})

//SERVICE WORKER
function registerServiceWorker() {
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('../service-worker.js')
        .then(() =>  {console.log('Registered service worker!')})
        .catch(() => { console.log('Could not register service worker!')})
    };
};

registerServiceWorker();