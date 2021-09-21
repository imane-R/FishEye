
let medias = [];
let mediaList = [];
let fullMediaList = [];
let totalLikes = 0;

fetchAndShowPhotographerMedias();

/**
 * fetch photographers.json and draw photographer banner and medias
 */
function fetchAndShowPhotographerMedias() {
    let params = new URL(document.location).searchParams;
    let photographerIdUrl = params.get('id');
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
                        createUIPhotographerBanner(photographer);
                        showPhotographerPrice(photographer);
                        let modalTitle = document.getElementById('modal_title');
                        modalTitle.innerHTML = "Contactez-moi" + " " + photographer.name;
                    }
                });
            medias = data.media;
            if (data.media != undefined)
                data.media.forEach((media) => {
                    if (photographerIdUrl == media.photographerId) {
                        fullMediaList.push(media);
                        totalLikes = totalLikes + media.likes;
                    }
                });
            showMediasByAttribute("likes");
            showTotalLikes();
        })
        .catch(function (err) {
            console.log('Erreur' + err);
        });
};

/**
 * draw sorted medias by attribute likes, date, title
  * @param {String} attribute attribute on which medias shoud be sorted 
 */
function showMediasByAttribute(attribute) {
    document.getElementById("medias_photographe").innerHTML = '';
    mediaList = [];

    if (!attribute) {
        fullMediaList.forEach((media) => {
            creatMedias(media);
        });
    }

    if (attribute === "likes") {
        fullMediaList.sort(likesComparator).forEach((media) => {
            creatMedias(media);
        });
    }

    if (attribute === "date") {
        fullMediaList.sort(dateComparator).forEach((media) => {
            creatMedias(media);
        });
    }
    if (attribute === "title") {
        fullMediaList.sort(titleComparator).forEach((media) => {
            creatMedias(media);
        });
    }

}

function likesComparator(a, b) {
    return b.likes - a.likes;
}

function dateComparator(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function titleComparator(a, b) {
    return a.title.localeCompare(b.title);
}
/**
 *  On change dropDown, call showMediasByAttribute function
 */
function changeDropDownEvent() {
    let selectedChoice = document.getElementById("trier").value;
    showMediasByAttribute(selectedChoice);
}

/**
 *  create tags 
 */
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

/**
 *  creat banner by showing photographer name, photo, city, country, tagline and call creatTag function
 */
function createUIPhotographerBanner(photographer) {

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
        '<img class="photographe_portrait_banner" src="../images/SamplePhotos/PhotographersIDPhotos/' +
        photographer.portrait +
        '"alt="' +
        photographer.alt +
        '">'
};

/**
 *  
 */
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
    totalLikes++;
    showTotalLikes();
};
function showPhotographerPrice(photographer) {
    let PricePerDay = document.getElementById('price-day');
    PricePerDay.innerHTML = '<p class = "price-per-day">' +
        photographer.price + "€ / jour" + '</p>';
};
function mediaChoice(media) {
    let mediaPath;
    if (media.image) {
        mediaPath = './images/SamplePhotos/' + media.photographerId + '/' + media.image;
        mediaList.push({
            type: 'image',
            src: mediaPath,
            name: media.title,
        });
        return (
            '<img class="media" src="' + mediaPath +
            '" alt="' +
            media.alt +
            '" onclick = "openLightBox(' + (mediaList.length - 1) + ')"' +
            '>'
        )
    } else if (media.video) {
        mediaPath = './images/SamplePhotos/' + media.photographerId + '/' + media.video;
        mediaList.push({
            type: 'video',
            src: mediaPath,
            name: media.title,
        });
        return (
            '<video class="media" onclick = "openLightBox(' + (mediaList.length - 1) + ')" >' +
            '<source src="' + mediaPath +
            '" type = "video/mp4"' +
            '>' +
            '</video>'
        )
    }
}

//injection de la bannière total deslikes

function showTotalLikes() {
    let total_likes = document.getElementById('total-likes');
    total_likes.innerHTML =
        '<p class ="total_likes">' + totalLikes +
        '</p>' + '<i class="fas fa-heart total"></i>';
}

//Contact me button
const contactButtonScroll = document.getElementById("contactButton");
const bgModal = document.getElementById("contact_me_modal");
const buttonClose = document.getElementsByClassName("close_modal")
const media = document.getElementsByClassName("media");
const lightboxModal = document.getElementById("lightbox_modal");
let currentMediaIndex;
let medaiQueryPhone = window.matchMedia("(max-width: 677px)")

function openLightBox(index) {
    index = index % mediaList.length;
    let currentMedia = mediaList.at(index);
    currentMediaIndex = index;
    console.log(currentMedia);
    lightboxModal.style.display = "block";
    injectMedia = lightboxModal.getElementsByClassName("modal_body")[0];
    injectMedia.innerHTML = choiceMediaLightBox(currentMedia) +
        '<span class="close_modal close_modal_media "  onclick="closeLightBox()"  aria-label="Close contact form">' +
        '<i class="fas fa-times"></i>' +
        '</span>' +
        '<i class="fas fa-chevron-right" onclick="nextMedia()">' + '</i>' +
        '<i class="fas fa-chevron-left" onclick="previousMedia()">' + '</i>' +
        '<p class="media-title">' + currentMedia.name + '</p>';
}
function choiceMediaLightBox(media) {
    if (media.type == "image") {
        return ('<img class="current_media" src="' + media.src + '" >'
        );
    } else if (media.type == "video") {
        return ('<video class="current_media" controls>' +
            '<source src="' + media.src +
            '" type = "video/mp4"' +
            '>' +
            '</video>'
        );
    }
}
function previousMedia() {
    openLightBox(currentMediaIndex - 1);
}
function nextMedia() {
    openLightBox(currentMediaIndex + 1);
}
function closeLightBox() {
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
function openModal() {
    bgModal.style.display = "block";
}
// close modal function
function closeModal() {
    bgModal.style.display = "none";
}
function sentMessage() {

}
