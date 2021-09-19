
let medias = [];

fetch('./photographers.json')
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  /*.then(function (data) {
    medias = data.media;
    if (data.media != undefined)
      data.media.forEach((Element) =>*/ {
        let div = document.createElement('div');
        div.innerHTML =
          '<section class="photographe_description">' +
          '<a class="photographe_link" href="./pagePhotographe.html" id="' +
          Element.id +
          '" aria-label="Mimi Keel">' +
          '<img class="photographe_portrait" src="' +
          Element.portrait +
          '"alt="' +
          Element.alt +
          '">' +
          '<h2 class="photographe_name">' +
          Element.name +
          '</h2>' +
          '</a>' +
          '<p class="photographe_localisation">' +
          Element.city +
          ' , ' +
          Element.country +
          '</p>' +
          '<p class="photographe_words">' +
          Element.tagline +
          '</p>' +
          '<p class="photographe_price">' +
          Element.price +
          '€/jour</p>' +
          '<ul class="tag_list filter_mobile">' +
          '<li>' +
          '<span class="sr_only">Tag link</span>' +
          '<a class="tag_link" href="#">#' +
          Element.tags[0] +
          '</a>' +
          '</li>' +
          '<li>' +
          '<span class="sr_only">Tag link</span>' +
          '<a class="tag_link" href="#">#' +
          Element.tags[1] +
          '</a>' +
          '</li>' +
          '<li>' +
          '<span class="sr_only">Tag link</span>' +
          '<a class="tag_link" href="#">#' +
          Element.tags[2] +
          '</a>' +
          '</li>' +
          '<li>' +
          '<span class="sr_only">Tag link</span>' +
          '<a class="tag_link" href="#">#' +
          Element.tags[3] +
          '</a>' +
          '</li>' +
          '</ul>' +
          '</section>';

        document.querySelector('.medias_photographe').appendChild(div);
      });
  })
  .catch(function (err) {
    console.log('Erreur' + err);
  });