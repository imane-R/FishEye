
let medias = [];

fetch('./photographers.json')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        createPhotographeBanner(data.photographers)
    })
    .catch(function (err) {
        console.log('Erreur' + err);
    });

/*function createTag(elementTag) {
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
}*/

function createPhotographeBanner(element) {
    
    let bannerPhotographe = document.getElementById('banner_photographe_container');
    bannerPhotographe.innerHTML =
        '<h1 class = "photographeName">' +
        element.name +
        '</h1>' +
        '</a>' +
        '<p class="city_country">' +
        element.city +
        ' , ' +
        element.country +
        '</p>' +
        '<p class="tagLine">' +
        element.tagline +
        '</p>' +
        '<p class="price">' +
        element.price +
        '€/jour</p>' +
        /*'<ul class="tag_list filter_mobile">' +
        createTag(element.tags) +
        '</ul>' +*/
        '<img class="photographe_portrait" src="../images/Sample Photos/Photographers ID Photos/' +
        element.portrait +
        '"alt="' +
        element.alt +
        '">';
}