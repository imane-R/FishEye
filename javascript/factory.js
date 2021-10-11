const ABSOLUTE_MEDIA_PATH = './images/SamplePhotos/';

let Factory = function () {
    this.createMedia = function (mediaData, mode) {
        let media;
        if (mediaData.image) {
            if (mode == 'lightbox') {
                media = new ImageLightBox(mediaData);
            } else if (mode == 'thumbnail') {
                media = new ImageThumbnail(mediaData);
            }
        } else if (mediaData.video) {
            if (mode == 'lightbox') {
                media = new VideoLightBox(mediaData);
            } else if (mode == 'thumbnail') {
                media = new VideoThumbnail(mediaData);
            }
        }

        return media;
    }
}

let ImageLightBox = function (mediaData) {
    let mediaPath = ABSOLUTE_MEDIA_PATH + mediaData.photographerId + '/' + mediaData.image;
    this.html = '<img class="current_media" src="' + mediaPath + '" role="img" >';
}

let ImageThumbnail = function (mediaData) {
    let mediaPath = ABSOLUTE_MEDIA_PATH + mediaData.photographerId + '/' + mediaData.image;
    this.html = '<img class="media" src="' + mediaPath +
        '" alt="' +
        mediaData.altText +
        'role="img"' +
        '" tabindex="0"' +
        '>';
}

let VideoLightBox = function (mediaData) {
    let mediaPath = ABSOLUTE_MEDIA_PATH + mediaData.photographerId + '/' + mediaData.video;
    this.html = '<video class="current_media video_current_media" controls>' +
        '<source src="' + mediaPath +
        '" type = "video/mp4"' +
        '>' +
        '</video>';
}

let VideoThumbnail = function (mediaData) {
    let mediaPath = ABSOLUTE_MEDIA_PATH + mediaData.photographerId + '/' + mediaData.video;
    this.html = '<video class="media" tabindex="0"' +
        '>' +
        '<source src="' + mediaPath +
        '" alt="' +
        mediaData.altText +
        '" type = "video/mp4"' +
        '>' +
        '</video>';
}