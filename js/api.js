(function () {
    'use strict';

    var category = null;
    var search = null;

    var API = 'https://newsapi.org/v2/';
    var ENDPOINT_HEADLINES = 'top-headlines?';
    var ENDPOINT_EVERYTHING = 'everything?';
    var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';
    
    window.addEventListener("load", function () {
        getNews();
    });

    function getNews() {
        var url = API + ENDPOINT_HEADLINES + 'country=br&' + API_KEY + getCategory();
        $.get(url, success);
    }

    function getNewsWithSearch() {
        var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
        $.get(url, success);
    }

    function success(data) {
        var divNews = $('#news');
        divNews.empty();
        setTopNews(data.articles[0]);
        for (var i = 1; i < data.articles.length; ++i) {
            divNews.append(getNewsHtml(data.articles[i]));
        }
        loadLazyImage();
    }

    function setTopNews(article) {
        if (article) {
            $('#top-news-title').text(article.title);
            $('#top-news-description').text(article.description);
            $('#top-news-image').attr('src', 'img/default.jpg').attr('data-src', !article.urlToImage ? 'img/default.jpg' : article.urlToImage).attr('alt', article.title).addClass("lazy");
            $('#top-news-link').attr('href', article.url);
        }
    }

    $("#headline").click(function () {
        category = null;
        activeMenu($(this));
    });
    $("#health").click(function () {
        category = 'health';
        activeMenu($(this));
    });
    $("#sports").click(function () {
        category = 'sports';
        activeMenu($(this));
    });
    $("#entertainment").click(function () {
        category = 'entertainment';
        activeMenu($(this));
    });
    $("#technology").click(function () {
        category = 'technology';
        activeMenu($(this));
    });
    $("#search").keypress(function (ev) {
        if (ev.which == 13) {
            search = $(this).val();
            if (search) {
                getNewsWithSearch();
            } else {
                getNews();
            }
        }
    });

    function activeMenu(menu) {
        search = null;
        $("#search").val('');
        $('li.active').removeClass('active');
        menu.addClass('active');
        getNews();
    }

    function getCategory() {
        if (category) {
            return '&category=' + category
        }
        return '';
    }

    function getSearch() {
        if (search) {
            return '&q=' + search
        }
        return '';
    }

    function getNewsHtml(article) {

        var card = $('<div>').addClass('card col-12 col-sm-6');

        var cardContainer = $('<div>').addClass('row');
        card.append(cardContainer);

        cardContainer = addImage(cardContainer);
        cardContainer = addBodyTitle(cardContainer);
        cardContainer = addBodyActions(cardContainer);

        return card;

        function addImage(card) {
            var col = $('<div>')
                .addClass('col-12 col-xl-6')
                .append(
                    $('<img>')
                        .attr('src','img/default.jpg')
                        .attr('data-src', !article.urlToImage ? 'img/default.jpg' : article.urlToImage)
                        .attr('alt', article.title)
                        .addClass('card-img-top lazy')
                );
            return card.append(
                col
            );
        }

        function addBodyTitle(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body col-12 col-xl-6')
                    .append($('<h5>').addClass('card-title').append(article.title))
                    .append($('<h6>').addClass('card-subtitle mb-2 text-muted')
                        .append(moment(article.publishedAt).fromNow()))
                    .append($('<p>').addClass('card-text').append(article.description))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<button>').append('Read Article').addClass('btn btn-link').attr('type', 'button'))
                    .click(function () {
                        window.open(article.url, '_blank');
                    })
            );
        }
    }

    function loadLazyImage() {
        var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazy");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach(function(entry){
                lazyImageObserver.observe(entry);
            })
        } else {
            // Possibly fall back to a more compatible method here
        }
    
        
    }

})();