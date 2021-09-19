/*fetch('./photographers.json', {
})
    .then(function (res) {
        if (res.ok) { return res.json() }
    })
    .then(function (data) {
        drawPhotographers(data.photographers, [])
        
    });

/*function bringTags(tags) {
    let taglistElement, tagElemet;
    taglistElement = document.createElement("ul");
    taglistElement.classList.add("tags");
    for (let i = 0; i < tags.length; i++) {
        tagElemet = document.createElement('li');
        tagElemet.innerHTML = tags[i];
        taglistElement.appendChild(tagElemet);
    }
    return taglistElement;
}*/

/*function drawPhotographers(photographers , selectedTags) {
    let photographeContainer, photographeName, photographePortrait, photographeCity, photographeCountry, photographeTagline, photographePrice;
    let photographesContainer = document.getElementById("photographes_container");
    for (let i = 0; i < photographers.length; i++) {
        //if(tags in the array of tags only one element)

        photographeContainer = document.createElement("div");
        photographeName = document.createElement("h1");
        photographePortrait = document.createElement("img");
        cityCountry = document.createElement("div")
        photographeCity = document.createElement('p');
        photographeCountry = document.createElement('p');
        photographeTagline = document.createElement('p');
        photographePrice = document.createElement('p');


        photographeContainer.classList.add("photographe_container");
        cityCountry.classList.add("city_country");
        photographePrice.classList.add("price");
        photographeTagline.classList.add('tagLine');
        photographeName.classList.add("photographeName");

        photographeName.innerHTML = photographers[i].name;
        photographePortrait.src = "./images/Sample Photos/Photographers ID Photos/" + photographers[i].portrait;
        photographeCity.innerHTML = photographers[i].city + ',';
        photographeCountry.innerHTML = photographers[i].country;
        photographeTagline.innerHTML = photographers[i].tagline;
        photographePrice.innerHTML = photographers[i].price + '€/jour';



        photographeContainer.appendChild(photographePortrait);
        photographeContainer.appendChild(photographeName);
        photographeContainer.appendChild(cityCountry);
        cityCountry.appendChild(photographeCity);
        cityCountry.appendChild(photographeCountry);
        photographeContainer.appendChild(photographeTagline);
        photographeContainer.appendChild(photographePrice);
        photographeContainer.appendChild(bringTags(photographers[i].tags));
        photographesContainer.appendChild(photographeContainer)
    }
}*/


let tagLinkElement = document.getElementsByClassName("tag_link");
let selectedTags = [];
for (let i = 0; i < tagLinkElement.length; i++) {
    tagLinkElement[i].addEventListener("click", changeTagSelection);
}


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

fetch('./photographers.json', {
})
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        if (data.photographers != undefined)
            data.photographers.forEach((Element) => {
                createPhotographe(Element);
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

function createPhotographe(photographer) {
    let photographeContainer = document.createElement('section');
    photographeContainer.classList.add('photographe_container');
    photographeContainer.setAttribute('data-tags', photographer.tags);
    photographeContainer.innerHTML =
        '<a class="photographe_link" href="./pagePhotographe.html?id=' +
        photographer.id +
        '"" aria-label="' +
        photographer.name +
        '">' +
        '<img class="photographe_portrait" src="../images/Sample Photos/Photographers ID Photos/' +
        photographer.portrait +
        '"alt="' +
        photographer.alt +
        '">' +
        '<h2 class="photographeName">' +
        photographer.name +
        '</h2>' +
        '</a>' +
        '<p class="city_country">' +
        photographer.city +
        ' , ' +
        photographer.country +
        '</p>' +
        '<p class="tagLine">' +
        photographer.tagline +
        '</p>' +
        '<p class="price">' +
        photographer.price +
        '€/jour</p>' +
        '<ul class="tag_list filter_mobile">' +
        createTag(photographer.tags);
    '</ul>' + '</section>';
    document
        .getElementById('photographes_container')
        .appendChild(photographeContainer);
}

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
//Bouton passer au contenu
const headerscroll = document.getElementById('header_scroll');

window.addEventListener('scroll', scroll);

    function scroll() {
        if (window.scrollY) {
            headerscroll.style.display = 'block';
        } else {
            headerscroll.style.display = 'none';
        }
    };
