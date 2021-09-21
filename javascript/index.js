
let selectedTags = [];
bindTagLinkClickEvent();
fetchAndShowPhotographers();
window.addEventListener('scroll', scrollEvent);

/**
 * bind click event on all tag link
 */
function bindTagLinkClickEvent() {
    let tagLinkElement = document.getElementsByClassName("tag_link");
    for (let i = 0; i < tagLinkElement.length; i++) {
        tagLinkElement[i].addEventListener("click", changeTagSelection);
    }
}

/**
 * change state (active or not) of tag when click on it, then call filterPhotographers function
 * @param {Event} event javascript event object
 */
function changeTagSelection(event) {
    let tagName = event.currentTarget.getAttribute("data-tag");
    let tagNameIndex = selectedTags.indexOf(tagName);
    if (tagNameIndex == -1) {
        selectedTags.push(tagName)
        event.currentTarget.classList.add("active");
    } else {
        event.currentTarget.classList.remove("active");
        selectedTags.splice(tagNameIndex, 1)
    }
    filterPhotographers();
}

/**
 * fetch photographers.json and draw photographers
 */
function fetchAndShowPhotographers() {
    fetch('./photographers.json', {
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            if (data.photographers != undefined)
                data.photographers.forEach((photographer) => {
                    createUIPhotographerContainer(photographer);
                });
        })
        .catch(function (err) {
            console.log('Erreur' + err);
        });
}

/**
 * get html li tags from an array of tag
 * @param {Array} tags array of string (tag name)
 */
function getHtmlLiTags(tags) {
    let result = '';
    tags.forEach((tag) => {
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
 * create UI photographer container with its data (link, portrait img, name, city , country , tags) from object photographer
 * @param {Object} photographer javascript event object
 */
function createUIPhotographerContainer(photographer) {
    let photographeContainer = document.createElement('section');
    photographeContainer.classList.add('photographe_container');
    photographeContainer.setAttribute('data-tags', photographer.tags);
    photographeContainer.innerHTML =
        '<a class="photographe_link" href="./photographer.html?id=' +
        photographer.id +
        '"" aria-label="' +
        photographer.name +
        '">' +
        '<img class="photographe_portrait" role="link and image" src="../images/SamplePhotos/PhotographersIDPhotos/' +
        photographer.portrait +
        '"alt="' +
        photographer.name +
        '">' +
        '<h2 class="photographeName">' +
        photographer.name +
        '</h2>' +
        '</a>' +
        '<p class="city_country" role="text paragraph">' +
        photographer.city +
        ' , ' +
        photographer.country +
        '</p>' +
        '<p class="tagLine">' +
        photographer.tagline +
        '</p>' +
        '<p class="price" role="text paragraph">' +
        photographer.price +
        '€/jour</p>' +
        '<ul class="tag_list filter_mobile" role="link">' +
        getHtmlLiTags(photographer.tags);
    '</ul>' + '</section>';
    document
        .getElementById('photographes_container')
        .appendChild(photographeContainer);
}

/**
 * filter photographers by showing only ones which have at least on shared tag with selectedTags
 */
function filterPhotographers() {
    let photographerContainers = document.getElementsByClassName('photographe_container');
    let photographerTags, sharedTags;
    for (let i = 0; i < photographerContainers.length; i++) {
        photographerTags = photographerContainers[i].getAttribute('data-tags');
        sharedTags = photographerTags.split(',').filter(function (tag) {
            if (selectedTags.length == 0) {
                return true;
            } else {
                return selectedTags.indexOf(tag.replace(/s$/, "")) !== -1;
            }
        });
        if (sharedTags.length === 0) {
            photographerContainers[i].classList.add('d-none');
        } else {
            photographerContainers[i].classList.remove('d-none');
        }
    }
}

/**
 * show element header_scroll only when scrolling vertically
 */
function scrollEvent() {
    let headerscroll = document.getElementById('header_scroll');
    if (window.scrollY) {
        headerscroll.style.display = 'block';
    } else {
        headerscroll.style.display = 'none';
    }
};
