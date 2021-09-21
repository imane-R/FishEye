
let medias = [];
let mediaList = [];
let fullMediaList = [];
let totalLikes = 0;
let currentMediaIndex;
const $mainPhotographers = document.getElementById("main_photgraphers")
const $body = document.getElementById("body")
const $contactMeModal = document.getElementById("contact_me_modal");
const $lightboxModal = document.getElementById("lightbox_modal");

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
        '<img class="photographe_portrait_banner" src="./images/SamplePhotos/PhotographersIDPhotos/' +
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

// open modal function
function openModal(modal) {
    modal.setAttribute("aria-hidden", "false")
    $mainPhotographers.setAttribute('aria-hidden', 'true')
    modal.style.display = "block"
}
// close modal function
function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true")
    $mainPhotographers.setAttribute('aria-hidden', 'false')
    modal.style.display = "none";
}

function sentMessage() {
}



// lightBox open function 
function openLightBox(index) {
    openModal($lightboxModal);
    showMediaInLighBox(index);
}

function showMediaInLighBox(index) {
    index = index % mediaList.length;
    let currentMedia = mediaList.at(index);
    currentMediaIndex = index;
    console.log(currentMedia);
    injectMedia = $lightboxModal.getElementsByClassName("modal_body")[0];
    injectMedia.innerHTML = choiceMediaLightBox(currentMedia) +
        '<span class="close_modal close_modal_media "  onclick="closeLightBox()"  aria-label="Close contact form">' +
        '<em class="fas fa-times"></em>' +
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
    showMediaInLighBox(currentMediaIndex - 1);
}
function nextMedia() {
    showMediaInLighBox(currentMediaIndex + 1);
}
function closeLightBox() {
    closeModal($lightboxModal);
}

window.addEventListener('scroll', scrollEvent);

function scrollEvent() {
    const $contactButtonScroll = document.getElementById("contactButton");
    if (window.scrollY) {
        $contactButtonScroll.style.display = 'block';
    } else {
        $contactButtonScroll.style.display = 'none';
    }
}

// Close modal when escape key is pressed
document.addEventListener('keydown', e => {
    const keyCode = e.keyCode ? e.keyCode : e.which
    if (keyCode === 27) {
        if ($lightboxModal.getAttribute('aria-hidden') == 'false') {
            closeModal($lightboxModal);
        }
        if ($contactMeModal.getAttribute('aria-hidden') == 'false') {
            closeModal($contactMeModal);
        }
    }
    if ($lightboxModal.getAttribute('aria-hidden') == 'false') {
        if (keyCode === 39) {
            nextMedia();
        } else if (keyCode === 37) {
            previousMedia();
        }
    }

 });

 document.getElementById("trier").addEventListener("change", changeDropDownEvent);



