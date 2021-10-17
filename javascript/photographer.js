let fullMediaList = [];
let totalLikes = 0;
let currentMediaIndex;
let factory = new Factory();

const $mainPhotographers = document.getElementById("main_photgraphers")
const $contactMeModal = document.getElementById("contact_me_modal");
const $lightboxModal = document.getElementById("lightbox_modal");
const firstName = document.getElementById("first-name");
const errorFirstName = document.getElementById("error_firstName");
const lastName = document.getElementById("last-name");
const errorLastName = document.getElementById("error_lastName");
const email = document.getElementById("email");
const errorEmail = document.getElementById("error_email");
const message = document.getElementById("message");
const errorMessage = document.getElementById("error_message");

//Regex
const regexLettres = /^[a-zA-Z-\s]+$/;
const regexMessagerie = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

// KeyBoard codes
const KEY_RETURN = 13;
const KEY_ESCAPE = 27;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

initCustomSelect();
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
}
/**
 * draw sorted medias by attribute likes, date, title
  * @param {String} attribute attribute on which medias should be sorted 
 */
function showMediasByAttribute(attribute) {
    document.getElementById("medias_photographe").innerHTML = '';

    if (!attribute) {
        fullMediaList.forEach((media, index) => {
            creatMedias(media, index);
        });
    }

    if (attribute === "likes") {
        fullMediaList.sort(likesComparator).forEach((media, index) => {
            creatMedias(media, index);
        });
    }

    if (attribute === "date") {
        fullMediaList.sort(dateComparator).forEach((media, index) => {
            creatMedias(media, index);
        });
    }
    if (attribute === "title") {
        fullMediaList.sort(titleComparator).forEach((media, index) => {
            creatMedias(media, index);
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
    let selectedChoice = document.getElementsByClassName('same-as-selected')[0].getAttribute('data-value');
    showMediasByAttribute(selectedChoice);
}

function closeAllSelect(element) {
    /*a function that will close all select boxes in the document,
except the current select box:*/
    var selectItemsElements, selectSelectedElements, arrNo = [];
    selectItemsElements = document.getElementsByClassName("select-items");
    selectSelectedElements = document.getElementsByClassName("select-selected");

    for (let i = 0; i < selectSelectedElements.length; i++) {
        if (element == selectSelectedElements[i]) {
            arrNo.push(i)
        } else {
            selectSelectedElements[i].classList.remove("select-arrow-active");
        }
    }
    for (let i = 0; i < selectItemsElements.length; i++) {
        if (arrNo.indexOf(i)) {
            selectItemsElements[i].classList.add("select-hide");
        }
    }
}

function initCustomSelect() {
    /**
 *  look for any elements with the class "dropdown"
 */
    let dropDownSelect, selElement, selectedItem, optionList, optionItem;
    dropDownSelect = document.getElementsByClassName('dropdown');
    for (let i = 0; i < dropDownSelect.length; i++) {
        selElement = dropDownSelect[i].getElementsByTagName('select')[0];
        /*for each element, create a new DIV that will act as the selected item:*/
        selectedItem = document.createElement('div');
        selectedItem.setAttribute('class', 'select-selected');
        selectedItem.tabIndex = "0";
        selectedItem.innerHTML = selElement.options[selElement.selectedIndex].innerHTML;
        dropDownSelect[i].appendChild(selectedItem);

        /*for each element, create a new DIV that will contain the option list:*/
        optionList = document.createElement('div');
        optionList.setAttribute('class', 'select-items select-hide');
        for (let i = 0; i < selElement.length; i++) {
            /*for each option in the original select element,create a new DIV that will act as an option item:*/
            optionItem = document.createElement('div');
            optionItem.innerHTML = selElement.options[i].innerHTML;
            optionItem.setAttribute('data-value', selElement.options[i].getAttribute('value'));
            optionItem.tabIndex = "0";
            if (i === 0) {
                optionItem.classList.add('same-as-selected');
            }
            optionItem.addEventListener("click", function () {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                let newSelectBox, previousElement, sameAsSelected;
                newSelectBox = this.parentNode.parentNode.getElementsByTagName("select")[0];
                previousElement = this.parentNode.previousSibling;
                for (let i = 0; i < newSelectBox.length; i++) {
                    if (newSelectBox.options[i].innerHTML == this.innerHTML) {
                        newSelectBox.selectedIndex = i;
                        previousElement.innerHTML = this.innerHTML;
                        sameAsSelected = this.parentNode.getElementsByClassName("same-as-selected");
                        for (let i = 0; i < sameAsSelected.length; i++) {
                            sameAsSelected[i].classList.remove("same-as-selected");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }

                }
                previousElement.click();
                changeDropDownEvent();
            });
            optionList.appendChild(optionItem);
        }
        dropDownSelect[i].appendChild(optionList);
        selectedItem.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}


/**
 *  create tags 
 */
function createTag(elementTag) {
    let result = '';
    elementTag.forEach((tag) => {
        result +=
            '<li>' +
            '<span class="sr_only">Tag</span>' +
            '<a class="tag_link">#' +
            tag +
            '</a>' +
            '</li>';
    });
    return result;
}

/**
 *  create banner by showing photographer name, photo, city, country, tagline and call creatTag function
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
        photographer.altText +
        '">'
}

/**
 *  create media with likes and their names
 */
function creatMedias(media, index) {

    let media_photographe = document.createElement('div');
    media_photographe.classList.add('media_photographe');
    media_photographe.setAttribute('data-media-index', index);
    media_photographe.innerHTML =
        factory.createMedia(media, 'thumbnail').html +
        '<div class="media_texte">' +
        '<p class="media_title">' +
        media.title +
        '</p>' +
        '<div class="media_heart" aria-label="likes">' +
        '<p class="nb_likes">' +
        media.likes +'</p>' +
        '<i class="fas fa-heart" tabindex="0" title= "add like"></i>' +
        '</div>' +
        '</div>';

    document
        .getElementById('medias_photographe')
        .appendChild(media_photographe);

    let heartElements = document.getElementsByClassName('fa-heart');
    for (let i = 0; i < heartElements.length; i++) {
        heartElements[i].addEventListener('click', incrementLikes);
    }
    let mediaElements = document.getElementsByClassName('media');
    for (let i = 0; i < mediaElements.length; i++) {
        mediaElements[i].addEventListener('click', openLightBox);
    }
}
function incrementLikes(event) {
    let numLikesElement = event.currentTarget.parentElement.getElementsByClassName('nb_likes')[0]
    let numLikes = parseInt(numLikesElement.innerHTML) + 1
    numLikesElement.innerHTML = numLikes
    totalLikes++
    showTotalLikes();
}

function showPhotographerPrice(photographer) {
    let PricePerDay = document.getElementById('price-day')
    PricePerDay.innerHTML = '<p class = "price-per-day">' +
        photographer.price + "€ / jour" + '</p>'
}

//injection de la bannière total deslikes

function showTotalLikes() {
    let total_likes = document.getElementById('total-likes');
    total_likes.innerHTML =
        '<p class ="total_likes" role = "toale likes">' + totalLikes +
        '</p>' +
        '<i class="fas fa-heart total">' +
        '</i>';
}

// open lightBox function
function openModal(modal) {
    modal.setAttribute("aria-hidden", "false")
    $mainPhotographers.setAttribute('aria-hidden', 'true')
    $mainPhotographers.style.display = "none";
    modal.style.display = "block"
}
// close lightBox  function
function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true")
    $mainPhotographers.setAttribute('aria-hidden', 'false')
    $mainPhotographers.style.display = "block";
    modal.style.display = "none";
}

// open contactMe function
function openContactMe() {
    $contactMeModal.setAttribute("aria-hidden", "false")
    $mainPhotographers.setAttribute('aria-hidden', 'true')
    $mainPhotographers.style.display = "none";
    $contactMeModal.style.display = "block"
}
// close contactMe function
function closeContactMe() {
    $contactMeModal.setAttribute("aria-hidden", "true")
    $mainPhotographers.setAttribute('aria-hidden', 'false')
    $mainPhotographers.style.display = "block";
    $contactMeModal.style.display = "none";
}
// rest error message
function restErrorMessage() {
    errorFirstName.textContent = "";
    errorLastName.textContent = "";
    errorEmail.textContent = "";
    errorMessage.textContent = "";
}
function sentMessage() {
    restErrorMessage()
    let isValid = true;
    //verification the first name is empty or less than 2 characters or contains numbers
    if (!firstName.value || firstName.value.length <= 2 || regexLettres.test(firstName.value) == false) {
        errorFirstName.textContent = "Le prénom doit comporter 2 charactères minimum sans accent et uniquement des lettres.";
        errorFirstName.style.fontSize = "12px";
        errorFirstName.style.color = "red";
        isValid = false;
    }
    /*verification the name is empty or less than 2 characters or contains numbers*/

    if (!lastName.value || lastName.value.length <= 2 || regexLettres.test(lastName.value) == false) {
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
    //verification the message if it's empty 
    if (message.value == false) {
        errorMessage.textContent = "Veuillez écrire votre message.."
        errorMessage.style.fontSize = "12px";
        errorMessage.style.color = "red";
        isValid = false;
    }
    console.log("first name :" + firstName.value + '\n' + "last name :" + lastName.value + '\n' + "email:" + email.value + '\n' + "message :" + '\n' + message.value);
    if (isValid) {
        closeModal($contactMeModal);
    }
    return isValid;
}


// lightBox open function 
function openLightBox(event) {
    let index = parseInt(event.currentTarget.parentNode.getAttribute('data-media-index'));
    openModal($lightboxModal);
    showMediaInLighBox(index);
}

// creat lightbox structure 
function showMediaInLighBox(index) {
    index = index % fullMediaList.length;
    let currentMedia = fullMediaList.at(index);
    currentMediaIndex = index;
    let injectMedia = $lightboxModal.getElementsByClassName("img_title_lightbox")[0];
    injectMedia.innerHTML = '<div>' + factory.createMedia(currentMedia, 'lightbox').html + 
    '</div>' +
    '<div class="media-title">'+
     currentMedia.title + '</div>';
}

// functions to navigate tn the lightbox
function previousMedia() {
    showMediaInLighBox(currentMediaIndex - 1);
}
function nextMedia() {
    showMediaInLighBox(currentMediaIndex + 1);
}

function closeLightBox() {
    closeModal($lightboxModal);
}

/********EVENTS********/

// contact me modal events
document.getElementById('contactButtonDesktop').addEventListener('click', openContactMe);
document.getElementById('contactButtonPhone').addEventListener('click', openContactMe);
document.getElementById('closeOnlyContactMe').addEventListener('click', closeContactMe);
document.getElementById('btn_submit').addEventListener('click', sentMessage);

// lightbox events
document.getElementById('close-light-box').addEventListener('click', closeLightBox);
document.getElementById('next').addEventListener('click', nextMedia);
document.getElementById('previous').addEventListener('click', previousMedia);

//close custom select when clicking outside
document.addEventListener("click", closeAllSelect);


// close modal when escape key is pressed
// navigate between medias in lightbox
// fire click event on active element (accessiblity)
document.addEventListener('keydown', e => {
    const keyCode = e.keyCode ? e.keyCode : e.which

    if (keyCode === KEY_ESCAPE) {
        if ($lightboxModal.getAttribute('aria-hidden') == 'false') {
            closeModal($lightboxModal);
        }
        if ($contactMeModal.getAttribute('aria-hidden') == 'false') {
            closeModal($contactMeModal);
        }
    }
    if ($lightboxModal.getAttribute('aria-hidden') == 'false') {
        if (keyCode === KEY_RIGHT) {
            nextMedia();
        } else if (keyCode === KEY_LEFT) {
            previousMedia();
        }
    } else {
        if (keyCode === KEY_RETURN) {
            document.activeElement.click()
        }
    }

});


