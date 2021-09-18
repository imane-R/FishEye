
let medias = [];
let params = new URL(document.location).searchParams;
let photographerIdUrl = params.get('id');
let mediaList = [];

fetch('./photographers.json')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        if (data.photographers != undefined)
            data.photographers.forEach((photographer) => {
                if (photographerIdUrl == photographer.id) {
                    createPhotographeBanner(photographer);
                // add photographer's price per day
                /*let price_day = document.createElement('span');
                price_day.setAttribute('id', 'price_day');
                document.querySelector('#likes_price').appendChild(price_day);
                price_day.innerHTML += photographer.price + 
                "€ / jour";*/
                }
            });
        medias = data.media;
        if (data.media != undefined)
            data.media.forEach((media) => {
                if (photographerIdUrl == media.photographerId) {
                    creatMedias(media);
                }
            });
    })
    .catch(function (err) {
        console.log('Erreur' + err);
    });


function createTag(elementTag) {
    let result = '';
    elementTag.forEach((tag) => {
        result +=
            '<li>' +
            '<span class="sr_only">Tag link</span>' +
            '<a class="tag_link" href="#">#' +
            tag +
            '</a>' +
            '</li>';
    });
    return result;
}

function createPhotographeBanner(photographer) {

    let bannerPhotographe = document.getElementById('banner_photographe_container');
    bannerPhotographe.innerHTML =
        '<h1 class = "photographeNameBanner">' +
        photographer.name +
        '</h1>' +
        '</a>' +
        '<p class="city_country_banner">' +
        photographer.city +
        ' , ' +
        photographer.country +
        '</p>' +
        '<p class="tagLine_banner">' +
        photographer.tagline +
        '</p>' +
        '<ul class=" tag_list tag_list_banner filter_mobile">' +
        createTag(photographer.tags) +
        '</ul>' +
        '<img class="photographe_portrait_banner" src="../images/Sample Photos/Photographers ID Photos/' +
        photographer.portrait +
        '"alt="' +
        photographer.alt +
        '">' 
}

function creatMedias(media) {

    let media_photographe = document.createElement('div');
    media_photographe.classList.add('media_photographe');
    media_photographe.innerHTML =
        '<div class="media-container">' +
        '</div>' +
        mediaChoice(media) +
        '<div class="media_texte">' +
        '<p class="media_title">' +
        media.title +
        '</p>' +
        '<div class="media_heart" aria-label="likes">' +
        '<p class="nb_likes">' +
        media.likes +
        '</p>' +
        '<i class="fas fa-heart" onclick = "incrementLikes(event)"></i>' +
        '</div>' +
        '</div>';

    document
        .getElementById('medias_photographe')
        .appendChild(media_photographe);
};
function incrementLikes(event) {
    let numLikesElement = event.currentTarget.parentElement.getElementsByClassName('nb_likes')[0];
    let numLikes = parseInt(numLikesElement.innerHTML) + 1;
    numLikesElement.innerHTML = numLikes;
};
function mediaChoice(media){
    let mediaPath;
    if(media.image){
        mediaPath = './images/Sample Photos/' + media.photographerId + '/' + media.image;
        mediaList.push({
            type: 'image',
            src: mediaPath,
            name: media.title,
        });
        return (
            '<img class="media" src="' + mediaPath + 
            '" alt="' +
            media.alt +
            '" onclick = "openLightBox('+ (mediaList.length - 1) + ')"' +
            '>'
        )
    }else if (media.video){
        mediaPath = './images/Sample Photos/' + media.photographerId + '/' + media.video;
        mediaList.push({
            type: 'video',
            src: mediaPath,
            name: media.title,
        });
        return(
            '<video class="media" onclick = "openLightBox('+ (mediaList.length - 1) + ')" controls>' + 
            '<source src="' + mediaPath + 
            '" type = "video/mp4"'+
            '>'+
            '</video>'
        )
    }
}

//Contact me button
const contactButtonScroll = document.getElementById("contactButton");
const bgModal = document.getElementById("contact_me_modal");
const buttonClose = document.getElementsByClassName("close_modal")
const media = document.getElementsByClassName("media");
const lightboxModal = document.getElementById("lightbox_modal");
let currentMediaIndex;
let medaiQueryPhone = window.matchMedia("(max-width: 677px)")

function openLightBox(index){
    let currentMedia = mediaList.at(index);
    currentMediaIndex = index;
    console.log(currentMedia);
    lightboxModal.style.display = "block";
    injectMedia = lightboxModal.getElementsByClassName("modal_body")[0];
    injectMedia.innerHTML = '<img class="current_media" src="'+ currentMedia.src +'" >'+
    '<span class="close_modal close_modal_media "  onclick="closeLightBox()"  aria-label="Close contact form">'+
    '<i class="fas fa-times"></i>'+
     '</span>'+
     '<i class="fas fa-chevron-right" onclick="nextMedia()">' + '</i>'+
     '<i class="fas fa-chevron-left" onclick="previousMedia()">'+ '</i>'+
     '<p class="media-title">'+ currentMedia.name +'</p>' ;
}
 /*function choiceMediaLightBox(media){
    if(media.image){
        return ('<img class="current_media" src="'+ currentMedia.src +'" >'+
        '<span class="close_modal close_modal_media "  onclick="closeLightBox()"  aria-label="Close contact form">');
    }else if(media.video){
        return(

        )
    }
}*/
function previousMedia(){
    openLightBox(currentMediaIndex-1);
}
function nextMedia(){
    openLightBox(currentMediaIndex+1);
}
function closeLightBox(){
    lightboxModal.style.display = "none";
}
window.addEventListener('scroll', scroll);

    function scroll() {
        if (window.scrollY) {
            contactButtonScroll.style.display = 'block';
        } else {
            contactButtonScroll.style.display = 'none';
        }
    };
// open modal function
    function openModal(){
        bgModal.style.display = "block";
    }
// close modal function
function closeModal(){
    bgModal.style.display = "none";
}


/*const firstName =  document.getElementById("first-name");
const errorFirstName = document.getElementById("error_firstName");
const lastName =  document.getElementById("last-name");
const errorLastName = document.getElementById("error_lastName");
const email =  document.getElementById("email");
const errorEmail = document.getElementById("error_email");
const message =  document.getElementById("message");
const errorMessage = document.getElementById("erreur_message");

const regexLettres = /^[a-zA-Z-\s]+$/;
const regexMessagerie = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;


function openModal(){
    bgModal.style.display = "block";
}

// rest error message
function restErrorMessage(){
    errorFirstName.textContent = "";
    errorLastName.textContent = "";
    errorEmail.textContent = "";
    errorMessage.textContent = "";
  } 

  function validate(e) {
    restErrorMessage ()
    let isValid = true;
    //verification the first name is empty or less than 2 characters or contains numbers
    if (!firstName.value || firstName.value.length <= 2 || regexLettres.test(firstName.value) == false) {
      errorFirstName.textContent = "Le prénom doit comporter 2 charactères minimum sans accent et uniquement des lettres.";
      errorFirstName.style.fontSize = "12px";
      errorFirstName.style.color = "red";
      isValid = false;
    }
  
    /*verification the name is empty or less than 2 characters or contains numbers*/
  
   /* if (!lastName.value || lastName.value.length <= 2 || regexLettres.test(lastName.value) == false) {
      errorLastName.textContent = "Le nom doit comporter 2 charactères minimum sans accent et uniquement des lettres.."
      errorLastName.style.fontSize = "12px";
      errorLastName.style.color = "red";
      isValid = false;
    }
  
    //verivication the email is valid or not 
    if (regexMessagerie.test(email.value) == false) {
      errorEmail.textContent = "L'adresse de messagerie n'est pas valide.."
      errorEmail.style.fontSize = "12px";
      errorEmail.style.color = "red";
      isValid = false;
    }

    if (!message.value || message.value.length == 0 ){
        errorMessage.textContent = "Veuillez écrire votre message"
    }
    return isValid;
}*/
