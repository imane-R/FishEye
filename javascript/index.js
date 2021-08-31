fetch('./photographers.json', {
})
    .then(function (res) {
        if (res.ok) { return res.json() }
    })
    .then(function (data) {
        drawPhotographers(data.photographers)
    });
function drawPhotographers(photographers) {
    let photographeContainer, photographeName, photographePortrait, photographeCity, photographeCountry, photographeTags, photographeTagline, photographePrice, photographeId;
    let photographesContainer = document.getElementById("photographes_container");
    for (let i = 0; i < photographers.length; i++) {
        photographeContainer = document.createElement("div");
        photographeName = document.createElement("h1");
        photographePortrait = document.createElement("img");
        cityCountry = document.createElement("div")
        photographeCity = document.createElement('p');
        photographeCountry = document.createElement('p');
        photographeTagline = document.createElement('p');
        photographePrice = document.createElement('p');
        photographeTags = document.createElement('p');

        photographeContainer.classList.add("photographe_container");
        cityCountry.classList.add("city_country");
        photographePrice.classList.add("price");
        photographeTagline.classList.add('tagLine');
        photographeTags.classList.add('tags');
        photographeName.classList.add("photographeName");

        photographeName.innerHTML = photographers[i].name;
        photographePortrait.src ="./images/Sample Photos/Photographers ID Photos/" + photographers[i].portrait;
        photographeCity.innerHTML = photographers[i].city +',';
        photographeCountry.innerHTML = photographers[i].country;
        photographeTagline.innerHTML = photographers[i].tagline;
        photographePrice.innerHTML = photographers[i].price +'€/jour';
        photographeTags.innerHTML = photographers[i].tags;
        
    


        photographeContainer.appendChild(photographePortrait);
        photographeContainer.appendChild(photographeName);
        photographeContainer.appendChild(cityCountry);
        cityCountry.appendChild(photographeCity);
        cityCountry.appendChild(photographeCountry);
        photographeContainer.appendChild(photographeTagline);
        photographeContainer.appendChild(photographePrice);
        photographeContainer.appendChild(photographeTags);
        photographesContainer.appendChild(photographeContainer)
    }
}