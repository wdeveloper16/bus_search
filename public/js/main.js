$(document).ready(function () {
    var body = $('body');
    //navbar toggle
    var collapse = $('.navbar__collapse');
    var navbar = $('.navbar');
    var toggle = $('.navbar__toggle');
    toggle.click(function () {
        if (navbar.hasClass('navbar--open')) {
            navbar.removeClass('navbar--open');
            collapse.slideUp();
        } else {
            navbar.addClass('navbar--open');
            collapse.slideDown();
        }
    });

    //search-overlay toggle
    var searchOpen = $('.navbar__input').add('.navbar__button');
    var searchOverlay = $('.search-overlay');
    var searchClose = $('.search-overlay__close');
    searchOpen.click(function (e) {
        e.preventDefault();
        searchOverlay.slideDown(400, function () {
            body.addClass('fixed');
        });

    });

    searchClose.click(function (e) {
        e.preventDefault();
        searchOverlay.slideUp(400, function () {
            body.removeClass('fixed');
        });
    });


    //map - overlay
    var mapOpen = $('.city__show-map');
    var mapOverlay = $('.map-overlay');
    var mapClose = $('.map-overlay__close');
    mapOpen.click(function (e) {
        e.preventDefault();
        mapOverlay.slideDown(400, function () {
            body.addClass('fixed');
        });
        mapOpen.hide();

    });

    mapClose.click(function (e) {
        e.preventDefault();
        mapOverlay.slideUp(400, function () {
            body.removeClass('fixed');
        });
        mapOpen.show();
    });


    //resize/ make sticky on desktop
    var map = $('.city__map iframe');
    resizeMap();
    function resizeMap() {
        if (map.length > 0) {
            map.height($(window).height() - map.offset().top + $(window).scrollTop());
        }
    }

    map.sticky({
        bottomSpacing: $('.footer').outerHeight()
    });
    map.on('sticky-start', function () {
        resizeMap();
        map.addClass('fixed')
    });
    map.on('sticky-end', function () {
        resizeMap();
        map.removeClass('fixed')
    });


    var eTop = $('.search__item--submit').not('.search--navbar .search__item--submit').offset().top;

    //alwasy show searchbar if on stops page on desktop
    if ($('.stop').length > 0 && $(window).width() >= 768) {
        $('.navbar--search').addClass('added');
        var searchBarTop = $('.navbar--search').offset().top;

        $(window).scroll(function () {
            var searchBarDiff = searchBarTop - $(window).scrollTop();

            if (searchBarDiff < 0) {
                $('.navbar--search').addClass('fixed').removeClass('added');
                $('body').addClass('fixed-nav');
            } else {
                $('.navbar--search').addClass('added').removeClass('fixed');
                $('body').removeClass('fixed-nav');
            }
        });

    } else {


        $(window).scroll(function () { //when window is scrolled
            if ((eTop - $(window).scrollTop()) <= 0) {
                $('.navbar--search').addClass('visible');

            } else {
                if (!body.hasClass('fixed')) {
                    $('.navbar--search').removeClass('visible');
                }

            }
        });
    }


    //adjust height and expand list on index
    var listHeight = 500;
    var showItems = 10;
    listExpand();
    resizeTeaser();
    $(window).resize(function () {
        listExpand();
        resizeMap();
        resizeTeaser();
        if ($(window).width() >= 768) {
            $('body').removeClass('fixed');
        }
    });

    function resizeTeaser() {
        if ($(window).width() < 768) {
            var height = $('.stop__title-wrapper').outerHeight() > 145 ? $('.stop__title-wrapper').outerHeight() + 25 : 170;
            $('.stop__teaser-map').height(height);
        } else {
            $('.stop__teaser-map').height('');
        }
    }

    function listExpand() {
        $('.list--index-city').each(function () {
            var itemHeight = $(this).find('.list-item').not('.list-item--featured').first().outerHeight(true);
            var itemFeaturedHeight = $(this).find('.list-item--featured').first().outerHeight(true);
            var itemFeaturedHeightLast = $(this).find('.list-item--featured').last().outerHeight(true);

            var listHeight;
            if ($(window).width() < 768) {
                listHeight = 10 * itemHeight + itemFeaturedHeight + itemFeaturedHeightLast;

            } else {
                listHeight = 5 * itemHeight + itemFeaturedHeight;
            }
            var list = $(this);
            list.css('height', listHeight);
        });
    }


    var list = $('.list--index');

    $('.list-button').click(function () {
        var button = $(this);
        var list = button.parent().parent().find('.list');
        list.animate({'height': list.get(0).scrollHeight}, 400, 'swing', function () {
            button.detach();
        });

    })

    //slidedown quipment box
    var closeButtonEquipment = $('.equipment__close');
    var equipmentList = $('.equipment__list');
    var equipment = $('.equipment');
    var banner = $('.banner--vertical').first();
    closeButtonEquipment.click(function (e) {
        e.preventDefault();
        if (equipment.hasClass('equipment--closed')) {
            banner.animate({marginTop:'125px'});
            equipmentList.slideDown();
            equipment.removeClass('equipment--closed');
        } else {
            banner.animate({marginTop:'318px'});
            equipmentList.slideUp();
            equipment.addClass('equipment--closed');
        }
    })

    // smooth scroll to the anchor id
    $('.navbar__link--anchor').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, 'swing');
                return false;
            }
        }
    });

    if (window.location.hash) {
        $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top + 'px'
        }, 1000, 'swing');
    }
});