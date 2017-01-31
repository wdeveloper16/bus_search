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

    String.prototype.replaceAt = function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    };
    //search area submit
    function searchSubmit() {
        var depart = $('#itemJourneyDep').val();
        var arrive = $('#itemJourneyArr').val();
        var date = $('.search__item--journey--date input').val();
        var time = $('.search__item--journey--time input').val();
        var passangersBlock = $(".passenger_option");
        var passangerString = "";
        for (var i = 0; i < passangersBlock.length; i++) {
            if ($(passangersBlock[i]).is(':visible')) {
                passangerString += "&passengers[][age]=" + $(passangersBlock[i]).find(".age--input--group input").val() + "&passengers[][discount]=";
            }
        }

        var stringUrl = "dep_ident=" + depart + "&arr_ident=" + arrive + "&date=" + date + passangerString + "&time=" + time + "&dir=dep&parse_lang=de&deeplink_lang=de";
        window.location.pathname = '/results/' + stringUrl;
    }

    $("#searchSubmit").on('click', function () {
        searchSubmit();
    });

    //result init

    function buildResult() {
        if (typeof window.filterData != 'undefined') {
            $(".results-tabs-body").html(" ");
            for (var i = 0; i < filterData.length; i++) {
                var segmentsArea = "";
                for (var k = 0; k < filterData[i].segments.length - 1; k++) {
                    segmentsArea += "<div class=\"Segments__middleLeg\">"
                        + "  <span class=\"Segments__departurePosition\">"
                        + filterData[i].segments[k].dep_name + ""
                        + "  <\/span>"
                        + "  <div class=\"Segments__legInfo\">"
                        + "    <div class=\"Segments__transportIcon\">"
                        + "      <svg fill=\"currentColor\""
                        + "        viewBox=\"0 0 24 24\""
                        + "        xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                        + "        <path d=\"M18.535 9.578c0 1.482-.835 1.552-6.44 1.552-5.656 0-6.626-.07-6.626-1.552v-2.48c0-1.792 2.924-2.95 6.532-2.95 3.61 0 6.533 1.158 6.533 2.95v2.48zm-2.135 5.5c-.67 0-1.214-.55-1.214-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.213.55 1.213 1.23 0 .678-.543 1.228-1.213 1.228zm-8.78 0c-.672 0-1.215-.55-1.215-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.212.55 1.212 1.23 0 .678-.543 1.228-1.213 1.228zm12.254-8.456h-.012c-.1-2.084-2.353-3.48-5.423-3.96V1.237S13.354 1 12.093 1c-1.26 0-2.42.238-2.42.238v1.39C6.523 3.08 4.24 4.493 4.14 6.623h-.01s-.203 1.656-.203 4.17c0 2.576.202 4.312.202 4.312h.007c.05 1.475.937 2.804 2.343 3.77 0 0 .19.14.594.323-.44.832-2.12 3.263-2.267 3.797.407 0 1.645.02 1.99-.01.088-.007.216-.11.26-.238.105-.31 1.237-1.938 1.876-2.97.8.164 1.798.188 3.052.188 1.277 0 2.31-.04 3.128-.217.623 1.045 1.68 2.737 1.858 3.075l.178.163c.37.016 1.654.007 2.043.007-.912-1.662-1.877-3.09-2.265-3.81.386-.174.59-.31.59-.31 1.407-.964 2.296-2.293 2.347-3.768h.007s.197-2.186.197-4.41c0-2.126-.196-4.072-.196-4.072z\"><\/path>"
                        + "      <\/svg>"
                        + "    <\/div>"
                        + "    <span class=\"Segments__departureTime\">"
                        + "    <span>" + filterData[i].segments[k].arr_offset + "<\/span>"
                        + "    <\/span>"
                        + "    <span>SBB<\/span>"
                        + "    <span class=\"Segments__duration\">"
                        + "    <span><\/span>"
                        + "    <\/span>"
                        + "    <span class=\"Segments__stops\">"
                        + "    <\/span>"
                        + "    	<span class=\"Segments__arrivalTime\">"
                        + "    	<span>" + filterData[i].segments[k].dep_offset + "<\/span>"
                        + "    <\/span>"
                        + "   <\/div>"
                        + "<\/div>"
                }

                $(".results-tabs-body").append("<div class=\"result-tabs-area\">"
                    + "                                        <div class=\"result-journeys\">"
                    + "                                            <div class=\"result-journey-wrapper\">"
                    + "                                                <div style=\"margin-bottom: 16px;\">"
                    + "                                                    <div class=\"result-header\">"
                    + "                                                        <img height=\"20\""
                    + "                                                             src=\"http:\/\/cdn-goeuro.com\/static_content\/web\/logos\/42\/sbb.png\">"
                    + "                                                        <div class=\"result-resultPrice\">"
                    + "                                                            <div><span class=\"result-totalLabel\">Total<\/span><\/div>"
                    + "                                                            <div class=\"result-priceContainer\">"
                    + "                                                            <span class=\"\">"
                    + "                                                              <span class=\"result-priceSymbol\">€<\/span>"
                    + "                                                              <span class=\"Result-priceMain\">" + filterData[i].class2.cent1 + "<\/span>"
                    + "                                                              <span>"
                    + "                                                                <span class=\"Result-pricePoint\">.<\/span>"
                    + "                                                                <span class=\"Result-priceFraction\">" + filterData[i].class2.cent2 + "<\/span>"
                    + "                                                              <\/span>"
                    + "                                                            <\/span>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + "                                                    <\/div>"
                    + "                                                <\/div>"
                    + "                                                <div class=\"Result-flex\">"
                    + "                                                    <div class=\"Result-leftSide\">"
                    + "                                                        <div class=\"Journey-journey\">"
                    + "                                                            <div class=\"Journey-firstCol\">"
                    + "                                                                <div class=\"Journey-position\">"
                    + "                                                                    <span>" + filterData[i].dep_offset + "<\/span>"
                    + "                                                                    <span class=\"Journey-positionName\">" + filterData[i].dep_name + "<\/span>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"Journey-secondCol\">"
                    + "                                                                <div class=\"Journey-arrowIcon\"><\/div>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"Journey-thirdCol\">"
                    + "                                                                <div class=\"Journey-position\">"
                    + "                                                                    <span>" + filterData[i].arr_offset + "<\/span>"
                    + "                                                                    <span class=\"Journey-positionName\">" + filterData[i].arr_name + "<\/span>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"Journey-fourthCol\">"
                    + "                                                                <span class=\"Journey-stops\">" + filterData[i].routType + "<\/span>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"Journey-fifthCol\">"
                    + "                                                                <div class=\"Journey-duration\">"
                    + "                                                                    <span>" + filterData[i].duration + "<\/span>"
                    + "                                                                    <span>h<\/span>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + "                                                    <\/div>"
                    + "                                                <\/div>"
                    + "                                                <div class=\"Result-footer\">"
                    + "                                                    <div class=\"Result-flex\">"
                    + "                                                        <div class=\"Result-leftSide\">"
                    + "                                                            <div class=\"BarRoute-barRoute\">"
                    + "                                                                <div class=\"BarRoute-trainMode\">"
                    + "                                                                    <div>"
                    + "                                                                        <div class=\"BarRoute-mainLeg0-DinF2 BarRoute-mainLeg\">"
                    + "                                                                            <div class=\"BarRoute-flightLeg\">"
                    + "                                                                                <span class=\"BarRoute-iataCode\"><\/span>"
                    + "                                                                                <div class=\"BarRoute-mainLegIcon BarRoute-transportIcon\">"
                    + "                                                                                    <svg fill=\"currentColor\""
                    + "                                                                                         viewBox=\"0 0 24 24\""
                    + "                                                                                         xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                    + "                                                                                        <path d=\"M18.535 9.578c0 1.482-.835 1.552-6.44 1.552-5.656 0-6.626-.07-6.626-1.552v-2.48c0-1.792 2.924-2.95 6.532-2.95 3.61 0 6.533 1.158 6.533 2.95v2.48zm-2.135 5.5c-.67 0-1.214-.55-1.214-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.213.55 1.213 1.23 0 .678-.543 1.228-1.213 1.228zm-8.78 0c-.672 0-1.215-.55-1.215-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.212.55 1.212 1.23 0 .678-.543 1.228-1.213 1.228zm12.254-8.456h-.012c-.1-2.084-2.353-3.48-5.423-3.96V1.237S13.354 1 12.093 1c-1.26 0-2.42.238-2.42.238v1.39C6.523 3.08 4.24 4.493 4.14 6.623h-.01s-.203 1.656-.203 4.17c0 2.576.202 4.312.202 4.312h.007c.05 1.475.937 2.804 2.343 3.77 0 0 .19.14.594.323-.44.832-2.12 3.263-2.267 3.797.407 0 1.645.02 1.99-.01.088-.007.216-.11.26-.238.105-.31 1.237-1.938 1.876-2.97.8.164 1.798.188 3.052.188 1.277 0 2.31-.04 3.128-.217.623 1.045 1.68 2.737 1.858 3.075l.178.163c.37.016 1.654.007 2.043.007-.912-1.662-1.877-3.09-2.265-3.81.386-.174.59-.31.59-.31 1.407-.964 2.296-2.293 2.347-3.768h.007s.197-2.186.197-4.41c0-2.126-.196-4.072-.196-4.072z\"><\/path>"
                    + "                                                                                    <\/svg>"
                    + "                                                                                <\/div>"
                    + "                                                                                <span class=\"BarRoute-iataCode\"><\/span>"
                    + "                                                                            <\/div>"
                    + "                                                                        <\/div>"
                    + "                                                                    <\/div>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + "                                                        <div class=\"Result-rightSideButtonContainer\">"
                    + "                                                            <div class=\"Result-selectButton\">"
                    + "                                                                <div><span>Details<\/span><\/div>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + "                                                    <\/div>"
                    + "                                                <\/div>"
                    + "                                            <\/div>"
                    + "                                        <\/div>"
                    + "                                        <div class=\"Result-jdActive\" style=\"display: none;\">"
                    + "                                            <div class=\"JourneyDetails-details\">"
                    + "                                                <div class=\"JourneyDetails-offerGroups\">"
                    + "                                                    <div class=\"JourneyDetails-header\"><span>Book my journey<\/span>"
                    + "                                                    <\/div>"
                    + "                                                    <div class=\"JourneyDetails__offerGroup-1\">"
                    + "                                                        <div class=\"row\">"
                    + "                                                            <div class=\"one column\">"
                    + "                                                                <div class=\"JourneyDetails__transportIcon\">"
                    + "                                                                    <svg fill=\"currentColor\" viewBox=\"0 0 24 24\""
                    + "                                                                         xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                    + "                                                                        <path d=\"M18.535 9.578c0 1.482-.835 1.552-6.44 1.552-5.656 0-6.626-.07-6.626-1.552v-2.48c0-1.792 2.924-2.95 6.532-2.95 3.61 0 6.533 1.158 6.533 2.95v2.48zm-2.135 5.5c-.67 0-1.214-.55-1.214-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.213.55 1.213 1.23 0 .678-.543 1.228-1.213 1.228zm-8.78 0c-.672 0-1.215-.55-1.215-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.212.55 1.212 1.23 0 .678-.543 1.228-1.213 1.228zm12.254-8.456h-.012c-.1-2.084-2.353-3.48-5.423-3.96V1.237S13.354 1 12.093 1c-1.26 0-2.42.238-2.42.238v1.39C6.523 3.08 4.24 4.493 4.14 6.623h-.01s-.203 1.656-.203 4.17c0 2.576.202 4.312.202 4.312h.007c.05 1.475.937 2.804 2.343 3.77 0 0 .19.14.594.323-.44.832-2.12 3.263-2.267 3.797.407 0 1.645.02 1.99-.01.088-.007.216-.11.26-.238.105-.31 1.237-1.938 1.876-2.97.8.164 1.798.188 3.052.188 1.277 0 2.31-.04 3.128-.217.623 1.045 1.68 2.737 1.858 3.075l.178.163c.37.016 1.654.007 2.043.007-.912-1.662-1.877-3.09-2.265-3.81.386-.174.59-.31.59-.31 1.407-.964 2.296-2.293 2.347-3.768h.007s.197-2.186.197-4.41c0-2.126-.196-4.072-.196-4.072z\"><\/path>"
                    + "                                                                    <\/svg>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"five columns\">"
                    + "                                                                <div class=\"JourneyDetails__offerInfo\">"
                    + "                                                              <span class=\"JourneyDetails__positions\">"
                    + "                                                                  <span>" + filterData[i].dep_name + "<\/span> - <span>" + filterData[i].arr_name + "<\/span>"
                    + "                                                              <\/span>"
                    + "                                                                    <span class=\"JourneyDetails__datePrefix\">"
                    + "                                                                    <span data-key=\"dw.onDate\">on<\/span>"
                    + "                                                              <\/span>"
                    + "                                                                    <span>"
                    + "                                                                <span>" + filterData[i].dep_date + "<\/span>"
                    + "                                                              <\/span>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                            <div class=\"six columns\">"
                    + "                                                                <div class=\"row\">"
                    + "                                                                    <div class=\"JourneyDetails__mainFare\">"
                    + "                                                                        <a href='" + filterData[i].deeplink + "' target=\"_blank\""
                    + "                                                                           class=\"JourneyDetails__bookButton\">"
                    + "                                                                            <span class=\"JourneyDetails__bookButtonLabel\">Book<\/span>"
                    + "                                                                        <\/a>"
                    + "                                                                        <div class=\"JourneyDetails__fare\">"
                    + "                                                                            <div>"
                    + "                                                                                <div class=\"JourneyDetails__infoIcon\">"
                    + "                                                                                    <svg fill=\"currentColor\""
                    + "                                                                                         viewBox=\"0 0 16 16\""
                    + "                                                                                         xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                    + "                                                                                        <path d=\"M8 16c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z M7 13h2V6H7v7zm1-8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z\"><\/path>"
                    + "                                                                                    <\/svg>"
                    + "                                                                                <\/div>"
                    + "                                                                            <\/div>"
                    + "                                                                            <div>"
                    + "                                                                                <span class=\"JourneyDetails__fareType\">2nd Class<\/span>"
                    + "                                                                                <a href='" + filterData[i].deeplink + "' target=\"_blank\">"
                    + "                                                                              <span class=\"JourneyDetails__price\">"
                    + "                                                                                <span class=\"JourneyDetails__priceSymbol\">€<\/span>"
                    + "                                                                                <span class=\"JourneyDetails__priceMain\">" + filterData[i].class2.cent1 + "<\/span>"
                    + "                                                                                <span>"
                    + "                                                                                  <span class=\"\">.<\/span>"
                    + "                                                                                  <span class=\"\">" + filterData[i].class2.cent2 + "<\/span>"
                    + "                                                                                <\/span>"
                    + "                                                                              <\/span>"
                    + "                                                                                <\/a>"
                    + "                                                                            <\/div>"
                    + "                                                                        <\/div>"
                    + "                                                                    <\/div>"
                    + "                                                                <\/div>"
                    + "                                                                <div class=\"row\">"
                    + "                                                                    <div class=\"JourneyDetails__fare pull-right\">"
                    + "                                                                        <div>"
                    + "                                                                            <div class=\"JourneyDetails__infoIcon\">"
                    + "                                                                                <svg fill=\"currentColor\""
                    + "                                                                                     viewBox=\"0 0 16 16\""
                    + "                                                                                     xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                    + "                                                                                    <path d=\"M8 16c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z M7 13h2V6H7v7zm1-8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z\"><\/path>"
                    + "                                                                                <\/svg>"
                    + "                                                                            <\/div>"
                    + "                                                                        <\/div>"
                    + "                                                                        <div><span class=\"JourneyDetails__fareType\">1st Class<\/span>"
                    + "                                                                            <a href='" + filterData[i].deeplink + "' target=\"_blank\">"
                    + "                                                                            <span class=\"JourneyDetails__price-2\">"
                    + "                                                                              <span class=\"JourneyDetails__priceSymbol\">€<\/span>"
                    + "                                                                              <span class=\"JourneyDetails__priceMain-2\">" + filterData[i].class1.cent1 + "<\/span>"
                    + "                                                                              <span class=\"\">.<\/span>"
                    + "                                                                              <span class=\"\">" + filterData[i].class1.cent2 + "<\/span>"
                    + "                                                                            <\/span>"
                    + "                                                                            <\/a>"
                    + "                                                                        <\/div>"
                    + "                                                                    <\/div>"
                    + "                                                                <\/div>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + "                                                    <\/div>"
                    + "                                                <\/div>"
                    + "                                                <div class=\"Segments__segmentsInfo\">"
                    + "                                                    <div class=\"Segments__segmentsHeader\">"
                    + "                                                        <div class=\"Segments__segmentsHeadLine\">"
                    + "                                                            <span>" + filterData[i].dep_name + "<\/span>"
                    + "                                                            <span class=\"Segments__arrowRight\"><\/span>"
                    + "                                                            <span>" + filterData[i].arr_name + "<\/span>"
                    + "                                                        <\/div>"
                    + "                                                        <div class=\"Segments__segmentsIntro\">"
                    + "                                                      <span class=\"Segments__pullLeft\">"
                    + "                                                        <span>" + filterData[i].dep_offset + "<\/span> - <span>" + filterData[i].arr_offset + "<\/span>"
                    + "                                                      <\/span>"
                    + "                                                            <span>" + filterData[i].dep_date + "<\/span>"
                    + "                                                            <span class=\"Segments__pullRight\">"
                    + "                                                            <span>" + filterData[i].duration + "<\/span> h"
                    + "                                                         <\/span>"
                    + "                                                        <\/div>"
                    + "                                                    <\/div>"
                    + "                                                    <div id=\"SegmentsArea\">"
                    + "                                                        <div class=\"Segments__firstLeg\">"
                    + "                                                          <span class=\"Segments__departurePosition\">"
                    + "                                                              " + filterData[i].dep_name + ""
                    + "                                                          <\/span>"
                    + "                                                            <div class=\"Segments__legInfo\">"
                    + "                                                                <div class=\"Segments__transportIcon\">"
                    + "                                                                    <svg fill=\"currentColor\" viewBox=\"0 0 24 24\""
                    + "                                                                         xmlns=\"http:\/\/www.w3.org\/2000\/svg\">"
                    + "                                                                        <path d=\"M18.535 9.578c0 1.482-.835 1.552-6.44 1.552-5.656 0-6.626-.07-6.626-1.552v-2.48c0-1.792 2.924-2.95 6.532-2.95 3.61 0 6.533 1.158 6.533 2.95v2.48zm-2.135 5.5c-.67 0-1.214-.55-1.214-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.213.55 1.213 1.23 0 .678-.543 1.228-1.213 1.228zm-8.78 0c-.672 0-1.215-.55-1.215-1.23 0-.677.543-1.228 1.214-1.228.67 0 1.212.55 1.212 1.23 0 .678-.543 1.228-1.213 1.228zm12.254-8.456h-.012c-.1-2.084-2.353-3.48-5.423-3.96V1.237S13.354 1 12.093 1c-1.26 0-2.42.238-2.42.238v1.39C6.523 3.08 4.24 4.493 4.14 6.623h-.01s-.203 1.656-.203 4.17c0 2.576.202 4.312.202 4.312h.007c.05 1.475.937 2.804 2.343 3.77 0 0 .19.14.594.323-.44.832-2.12 3.263-2.267 3.797.407 0 1.645.02 1.99-.01.088-.007.216-.11.26-.238.105-.31 1.237-1.938 1.876-2.97.8.164 1.798.188 3.052.188 1.277 0 2.31-.04 3.128-.217.623 1.045 1.68 2.737 1.858 3.075l.178.163c.37.016 1.654.007 2.043.007-.912-1.662-1.877-3.09-2.265-3.81.386-.174.59-.31.59-.31 1.407-.964 2.296-2.293 2.347-3.768h.007s.197-2.186.197-4.41c0-2.126-.196-4.072-.196-4.072z\"><\/path>"
                    + "                                                                    <\/svg>"
                    + "                                                                <\/div>"
                    + "                                                                <span class=\"Segments__departureTime\">"
                    + "                                                                 <span>" + filterData[i].dep_offset + "<\/span>"
                    + "                                                            <\/span>"
                    + "                                                                <span>SBB<\/span>"
                    + "                                                                <span class=\"Segments__duration\">"
                    + "                                                                <span>" + filterData[i].duration + "<\/span> h"
                    + "                                                            <\/span>"
                    + "                                                                <span class=\"Segments__stops\"><\/span>"
                    + "                                                                <span class=\"Segments__arrivalTime\">"
                    + "                                                                 <span>" + filterData[i].arr_offset + "<\/span>"
                    + "                                                            <\/span>"
                    + "                                                            <\/div>"
                    + "                                                        <\/div>"
                    + segmentsArea
                    + "                                                    <\/div>"
                    + "                                                    <div><span class=\"Segments__arrivalPosition\">" + filterData[i].arr_name + "<\/span>"
                    + "                                                    <\/div>"
                    + "                                                <\/div>"
                    + "                                                <div><\/div>"
                    + "                                            <\/div>"
                    + "                                            <div class=\"JourneyDetails__closeButtonBlock\">"
                    + "                                                <button class=\"JourneyDetails__closeButton\">"
                    + "                                                    <span>Close<\/span>"
                    + "                                                <\/button>"
                    + "                                            <\/div>"
                    + "                                        <\/div>"
                    + "                                    <\/div>"
                )
            }
            window.filterProcess = false;
        }
    }

    buildResult();

    window.filterProcess = false;
    function filterResultData() {
        if (window.arrStop && window.depStop && !window.filterProcess) {
            window.filterProcess = true;
            //price filter area
            var priceFiltered = [];
            for (var pr = 0; pr < baseData.length; pr++) {
                if (typeof baseData[pr].class2.cent1 != 'undefined' && Number(baseData[pr].class2.cent1) <= window.maxPrice) {
                    priceFiltered.push(baseData[pr]);
                } else if (baseData[pr].class2.cent1 == 'n/a') {
                    priceFiltered.push(baseData[pr]);
                }
            }
            //duration filter area
            var durationFiltered = [];
            for (var dr = 0; dr < priceFiltered.length; dr++) {
                var duration = priceFiltered[dr].duration.split(":");
                if (( Number(duration[0]) * 60 + Number(duration[1]) ) <= window.maxDurationSeconds) {
                    durationFiltered.push(priceFiltered[dr]);
                }
            }
            //changes filter

            var changeFiltered = [];
            for (var ch = 0; ch < durationFiltered.length; ch++) {
                if (window.changeDirect && durationFiltered[ch].segments.length == 1) {
                    changeFiltered.push(durationFiltered[ch]);
                }
                if (window.change1 && durationFiltered[ch].segments.length == 2) {
                    changeFiltered.push(durationFiltered[ch]);
                }
                if (window.change2 && durationFiltered[ch].segments.length > 2) {
                    changeFiltered.push(durationFiltered[ch]);
                }
            }
            //time filter
            var timeFiltered = [];
            for (var tm = 0; tm < changeFiltered.length; tm++) {
                var dep = Number(changeFiltered[tm].dep_offset.split(":")[0]) * 60 + Number(changeFiltered[tm].dep_offset.split(":")[1]);
                var arr = Number(changeFiltered[tm].arr_offset.split(":")[0]) * 60 + Number(changeFiltered[tm].arr_offset.split(":")[1]);
                if (dep >= window.depStart && dep <= window.depEnd && arr >= window.arrStart && arr <= window.arrEnd) {
                    timeFiltered.push(changeFiltered[tm]);
                }
            }

            window.filterData = timeFiltered;

        } else {
            window.filterData = [];
        }
        buildResult();
    }

    window.changesFilter = function (filter) {
        if (filter == 1) {
            window.changeDirect = !window.changeDirect;
        } else if (filter == 2) {
            window.change1 = !window.change1
        } else if (filter == 3) {
            window.change2 = !window.change2
        }

        filterResultData();
    }

    //search-overlay toggle
    var searchOpen = $('.navbar__input').add('.navbar__button');
    var searchOverlay = $('.search-overlay');
    var searchClose = $('.search-overlay__close');

    //search depart area
    $(".dep-area").on('keyup', '.form-control', function () {
        if ($(".dep-area .form-control").val().length > 1) {
            $.ajax({
                url: "/sbbStations?q=" + $(".dep-area .form-control").val(),
                method: "GET"
            }).success(function (data) {
                $('#itemJourneyDep').html('');
                $(".dep-area ul.dropdown-menu").html('');
                $('#itemJourneyDep').append("<option value=''></option>");
                for (var i = 0; i < data.length; i++) {
                    $('#itemJourneyDep').append("<option value='" + data[i].sbId + "'>" + data[i].name + "</option>");
                    $(".dep-area ul.dropdown-menu").append("<li class='' data-original-index='" + (i + 1) + "'><a tabindex='0' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span class='text'>" + data[i].name + "</span><span class='glyphicon glyphicon-ok check-mark'></span></a></li>");
                }
            });
        }

    });

    //search arrive area
    $(".arr-area").on('keyup', '.form-control', function () {
        if ($(".arr-area .form-control").val().length > 1) {
            $.ajax({
                url: "/sbbStations?q=" + $(".arr-area .form-control").val(),
                method: "GET"
            }).success(function (data) {
                $('#itemJourneyArr').html('');
                $(".arr-area ul.dropdown-menu").html('');
                $('#itemJourneyArr').append("<option value=''></option>");
                for (var i = 0; i < data.length; i++) {
                    $('#itemJourneyArr').append("<option value='" + data[i].sbId + "'>" + data[i].name + "</option>");
                    $(".arr-area ul.dropdown-menu").append("<li class='' data-original-index='" + (i + 1) + "'><a tabindex='0' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span class='text'>" + data[i].name + "</span><span class='glyphicon glyphicon-ok check-mark'></span></a></li>");
                }
            });
        }

    });

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


    var eTop = $('.search__item--submit').offset().top;

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

    });

    //slidedown quipment box
    var closeButtonEquipment = $('.equipment__close');
    var equipmentList = $('.equipment__list');
    var equipment = $('.equipment');
    var banner = $('.banner--vertical').first();
    closeButtonEquipment.click(function (e) {
        e.preventDefault();
        if (equipment.hasClass('equipment--closed')) {
            banner.animate({marginTop: '125px'});
            equipmentList.slideDown();
            equipment.removeClass('equipment--closed');
        } else {
            banner.animate({marginTop: '318px'});
            equipmentList.slideUp();
            equipment.addClass('equipment--closed');
        }
    });

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

    //toggle for passenger option
    $('#passoptBtn').on('click', function () {
        $('#passengerOption').slideToggle();
        $('.search__item--passopt--btn').toggleClass('passopt--btn--toggle--class');
    });

    //add new passengers
    var passenger1 = $('#newPassenger1');
    var passenger2 = $('#newPassenger2');
    var passenger3 = $('#newPassenger3');
    var passenger4 = $('#newPassenger4');
    var passenger = 'newPassenger';
    var arrPassenger = [passenger1, passenger2, passenger3, passenger4];
    var passangerCount = 1;

    $('.btn-more-passengers').on('click', function () {
        if (!$('#passengerOption .form-group').children('#newPassenger1').is(':visible')) {
            arrPassenger[0].fadeIn();
            passangerCount++;
            $('#passangerCount').html(passangerCount);
        } else if (!$('#passengerOption .form-group').children('#newPassenger2').is(':visible')) {
            arrPassenger[1].fadeIn();
            passangerCount++;
            $('#passangerCount').html(passangerCount);
        } else if (!$('#passengerOption .form-group').children('#newPassenger3').is(':visible')) {
            arrPassenger[2].fadeIn();
            passangerCount++;
            $('#passangerCount').html(passangerCount);
        } else if (!$('#passengerOption .form-group').children('#newPassenger4').is(':visible')) {
            arrPassenger[3].fadeIn();
            passangerCount++;
            $('#passangerCount').html(passangerCount);
        }
    });

    //remove passengers
    $('#newPassengerButton1').on('click', function () {
        passenger1.fadeOut();
        passangerCount--;
        $('#passangerCount').html(passangerCount);
    });
    $('#newPassengerButton2').on('click', function () {
        passenger2.fadeOut();
        passangerCount--;
        $('#passangerCount').html(passangerCount);
    });
    $('#newPassengerButton3').on('click', function () {
        passenger3.fadeOut();
        passangerCount--;
        $('#passangerCount').html(passangerCount);
    });
    $('#newPassengerButton4').on('click', function () {
        passenger4.fadeOut();
        passangerCount--;
        $('#passangerCount').html(passangerCount);
    });

    //Show Arrival Times
    $('.times-collapse-panel').on('click', function () {
        $('.hidden-arrival-part').fadeIn();
        $('.times-collapse-panel').fadeOut();
    });

    if (window.location.pathname.indexOf('results') != -1) {
        //filter slider for departure time
        var sliderDep = document.getElementById('timeSliderDep');
        if (sliderDep) {
            noUiSlider.create(sliderDep, {
                start: [window.depStart, window.depEnd],
                step: 1,
                connect: true,
                range: {
                    'min': window.depStart,
                    'max': window.depEnd
                }
            });
        }

        sliderDep.noUiSlider.on('update', function (values, handle) {
            var startTimeString = parseInt(values[0] / 60) + ":" + values[0] % 60;
            var endTimeString = parseInt(values[1] / 60) + ":" + values[1] % 60;
            $('#depStart').html(startTimeString);
            $('#depEnd').html(endTimeString);
            window.depStart = Number(values[0]);
            window.depEnd = Number(values[1]);
                filterResultData();
        });

        //filter slider for arrival time
        var sliderArr = document.getElementById('timeSliderArr');
        if (sliderArr) {
            noUiSlider.create(sliderArr, {
                start: [window.arrStart, window.arrEnd],
                step: 1,
                connect: true,
                range: {
                    'min': window.arrStart,
                    'max': window.arrEnd
                }
            });
        }

        sliderArr.noUiSlider.on('update', function (values, handle) {
            var startTimeString = parseInt(values[0] / 60) + ":" + values[0] % 60;
            var endTimeString = parseInt(values[1] / 60) + ":" + values[1] % 60;
            $('#arrStart').html(startTimeString);
            $('#arrEnd').html(endTimeString);
            window.arrStart = Number(values[0]);
            window.arrEnd = Number(values[1]);
                filterResultData();
        });

        //filter slider for duration
        var sliderDuration = document.getElementById('durationSlider');

        noUiSlider.create(sliderDuration, {
            start: maxDurationSeconds,
            step: 1,
            connect: [true, false],
            range: {
                'min': 0,
                'max': maxDurationSeconds
            }
        });

        sliderDuration.noUiSlider.on('update', function (values, handle) {
            var durationString = parseInt(values[0] / 60) + ":" + values[0] % 60;
            $('#maxDurationValue').html(durationString);
            window.maxDurationSeconds = Number(values[0]);
                filterResultData();

        });

        // filter slider for price

        if (window.maxPrice != 0) {

            var sliderPrice = document.getElementById('priceSlider');
            noUiSlider.create(sliderPrice, {
                start: window.maxPrice,
                step: 1,
                connect: [true, false],
                range: {
                    'min': 0,
                    'max': window.maxPrice
                }
            });
            sliderPrice.noUiSlider.on('update', function (values, handle) {
                window.maxPrice = Number(values[0]);
                $('#priceFilterMaxArea').html(Number(values[0]));
                    filterResultData();
            });
        }
    }

    $('body').on('click', '#depStopLabel', function () {
        window.depStop = !window.depStop;
        filterResultData()
    });
    $('body').on('click', '#arrStopLabel', function () {
        window.arrStop = !window.arrStop;
        filterResultData()
    });
    //result journey toggle
    $('body').on('click', '.result-journeys', function () {
        $(this).parent('.result-tabs-area').children('.Result-jdActive').slideToggle();
        $(this).parent('.result-tabs-area').toggleClass('class-result-tabs-area-after-clicking');
    });
    $('body').on('click', '.result-ticket-sm-xs', function () {
        $(this).next('.result-ticket-details-sm-xs').slideToggle();
    });

    //close button for result journey details area
    $('body').on('click', '.JourneyDetails__closeButton', function () {
        $(this).closest('.Result-jdActive').slideToggle();
        var thisElem = $(this).closest('.Result-jdActive').parent('.result-tabs-area');
        if (thisElem.hasClass('class-result-tabs-area-after-clicking')) {
            thisElem.removeClass('class-result-tabs-area-after-clicking');
        }
    });

    //results page filters area checkbox label :before
    $('.checkbox-label').on('click', function () {
        $(this).toggleClass('checkbox-label-class-before');
    });

    //segments first leg open
    $('.Segments__firstLeg').on('click', function () {

    });
});