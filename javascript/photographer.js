let medias = [];
let mediaList = [];
let fullMediaList = [];
let totalLikes = 0;
let currentMediaIndex;
const $mainPhotographers = document.getElementById("main_photgraphers")
const $body = document.getElementById("body")
const $contactMeModal = document.getElementById("contact_me_modal");
const $lightboxModal = document.getElementById("lightbox_modal");
const firstName = document.getElementById("first-name");
const errorFirstName = document.getElementById("error_firstName");
const lastName = document.getElementById("last-name");
const errorLastName = document.getElementById("error_lastName");
const email = document.getElementById("email");
const errorEmail = document.getElementById("error_email");
const message  = document.getElementById("message");
const errorMessage = document.getElementById("error_message");
//Regex
const regexLettres = /^[a-zA-Z-\s]+$/;
const regexMessagerie = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

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
  * @param {String} attribute attribute on which medias should be sorted 
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
    let selectedChoice = document.getElementById("trier").getElementsByClassName('same-as-selected')[0].getAttribute('data-value');
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

document.addEventListener("click", closeAllSelect);

function initCustomSelect() {
    /**
 *  look for any elements with the class "dropdown"
 */
    let dropDownSelect, selElement, selectedItem, optionList;
    dropDownSelect = document.getElementsByClassName('dropdown');
    for (let i = 0; i < dropDownSelect.length; i++) {
        selElement = dropDownSelect[i].getElementsByTagName('select')[0];
        /*for each element, create a new DIV that will act as the selected item:*/
        selectedItem = document.createElement('div');
        selectedItem.setAttribute('class', 'select-selected');

        selectedItem.tabIndex="0";
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
            optionItem.setAttribute('role', 'option');
            optionItem.tabIndex ="0";
            if (i === 0) {
                optionItem.classList.add('same-as-selected');
            }
            optionItem.addEventListener("click", function (e) {
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
            '<span class="sr_only">Tag link</span>' +
            '<a class="tag_link" href="#">#' +
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
        photographer.alt +
        '">'
};

/**
 *  create media with likes and their names
 */
function creatMedias(media) {

    let media_photographe = document.createElement('div');
    media_photographe.classList.add('media_photographe');
    media_photographe.innerHTML =
        mediaChoice(media) +
        '<div class="media_texte">' +
        '<p class="media_title">' +
        media.title +
        '</p>' +
        '<div class="media_heart" aria-label="likes">' +
        '<p class="nb_likes">' +
        media.likes +
        '</p>' +
        '<i class="fas fa-heart" tabindex="0" onclick = "incrementLikes(event)" title= "add like"></i>' +
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
            media.title +
            'role="img"' +
            '" tabindex="0' +
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
            '<video class="media" tabindex="0" onclick = "openLightBox(' + (mediaList.length - 1) + ')" >' +
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
        '</p>' +
         '<i class="fas fa-heart total">'+ 
         '</i>';
}

// open modal function
function openModal(modal) {
    modal.setAttribute("aria-hidden", "false")
    $mainPhotographers.setAttribute('aria-hidden', 'true')
    $mainPhotographers.style.display = "none";
    modal.style.display = "block"
}
// close modal function
function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true")
    $mainPhotographers.setAttribute('aria-hidden', 'false')
    $mainPhotographers.style.display = "block";
    modal.style.display = "none";
}
// rest error message
function restErrorMessage(){
    errorFirstName.textContent = "";
    errorLastName.textContent = "";
    errorEmail.textContent = "";
    errorMessage.textContent = "";
  } 
function sentMessage() {
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
  if ( message.value == false){
    errorMessage.textContent = "Veuillez écrire votre message.."
    errorMessage.style.fontSize = "12px";
    errorMessage.style.color = "red";
    isValid = false;
  }
  console.log( "first name :" + firstName.value + '\n' +"last name :" + lastName.value+ '\n' +"email:" + email.value+ '\n' + "message :"+ '\n'+ message.value );
 if (isValid){
    closeModal($contactMeModal);
 }
  return isValid;
}



// lightBox open function 
function openLightBox(index) {
    openModal($lightboxModal);
    showMediaInLighBox(index);
}
// creat lightbox structure 
function showMediaInLighBox(index) {
    index = index % mediaList.length;
    let currentMedia = mediaList.at(index);
    currentMediaIndex = index;
    console.log(currentMedia);
    injectMedia = $lightboxModal.getElementsByClassName("modal_body")[0];
    injectMedia.innerHTML ='<ul class = "img_title_lightbox ">'+
    '<li>'+ choiceMediaLightBox(currentMedia) +'</li>'+
    '<li class="media-title">' + currentMedia.name + '</li>'+
        '</ul>'+
        '<span class="close_modal close_modal_media "  onclick="closeLightBox()"  aria-label="Close contact form">' +
        '<i class="fas fa-times" title="close modal"></i>' +
        '</span>' +
        '<i class="fas fa-chevron-right" onclick="nextMedia()" title= "go to next media">' + '</i>' +
        '<i class="fas fa-chevron-left" onclick="previousMedia()" title= "go to the previous media">' + '</i>';
        
}
// create image or video for the  lightbox
function choiceMediaLightBox(media) {
    if (media.type == "image") {
        return ('<img class="current_media" src="' + media.src + '" role="img" >'
        );
    } else if (media.type == "video") {
        return ('<video class="current_media video_current_media" controls>' +
            '<source src="' + media.src +
            '" type = "video/mp4"' +
            '>' +
            '</video>'
        );
    }
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
    } else {
        if (keyCode === 13) {
            document.activeElement.click()
        }
    }

});
