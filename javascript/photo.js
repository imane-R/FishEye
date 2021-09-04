
let medias = [];
let params = new URL(document.location).searchParams;
let urlId = params.get('id');

fetch('./photographers.json')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        if (data.photographers != undefined)
            data.photographers.forEach((element) => {
                if (urlId == element.id){
                    createPhotographeBanner(element);
                }
            });
    })
    .then(function (data) {
        if (data.media != undefined)
            data.media.forEach((element) => {
                
                creatMedias(data.media)
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

function createPhotographeBanner(element) {

    let bannerPhotographe = document.getElementById('banner_photographe_container');
    bannerPhotographe.innerHTML =
        '<h1 class = "photographeNameBanner">' +
        element.name +
        '</h1>' +
        '</a>' +
        '<p class="city_country_banner">' +
        element.city +
        ' , ' +
        element.country +
        '</p>' +
        '<p class="tagLine_banner">' +
        element.tagline +
        '</p>' +
        '<ul class=" tag_list tag_list_banner filter_mobile">' +
        createTag(element.tags) +
        '</ul>' +
        '<img class="photographe_portrait_banner" src="../images/Sample Photos/Photographers ID Photos/' +
        element.portrait +
        '"alt="' +
        element.alt +
        '">'+
        '<button type="button" class="banner_photographe_button">' +
        "Contactez-moi" +
        '</button>';
}
function creatMedias(element) {
    let div = document.createElement('div');
    div.innerHTML =
        '<section class="photographe_description">' +
        '<a class="photographe_link" href="./pagePhotographe.html" id="' +
        element.id +
        '" aria-label="Mimi Keel">' +
        '<img class="photographe_portrait" src="' +
        element.portrait +
        '"alt="' +
        element.alt +
        '">' +
        '<h2 class="photographe_name">' +
        element.name +
        '</h2>' +
        '</a>' +
        '<p class="photographe_localisation">' +
        element.city +
        ' , ' +
        element.country +
        '</p>' +
        '<p class="photographe_words">' +
        element.tagline +
        '</p>' +
        '<p class="photographe_price">' +
        element.price +
        '€/jour</p>' +
        '<ul class="tag_list filter_mobile">' +
        '<li>' +
        '<span class="sr_only">Tag link</span>' +
        '<a class="tag_link" href="#">#' +
        element.tags[0] +
        '</a>' +
        '</li>' +
        '<li>' +
        '<span class="sr_only">Tag link</span>' +
        '<a class="tag_link" href="#">#' +
        element.tags[1] +
        '</a>' +
        '</li>' +
        '<li>' +
        '<span class="sr_only">Tag link</span>' +
        '<a class="tag_link" href="#">#' +
        element.tags[2] +
        '</a>' +
        '</li>' +
        '<li>' +
        '<span class="sr_only">Tag link</span>' +
        '<a class="tag_link" href="#">#' +
        element.tags[3] +
        '</a>' +
        '</li>' +
        '</ul>' +
        '</section>';

    document.querySelector('.medias_photographe').appendChild(div);

}

