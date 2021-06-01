import {smoothScroll, windowScroll} from './common';
import {animateAboutOnMouseMove} from './about';
import popupHandlers from './popup';
import {mapHandlers} from "./map";
import operatorsPage from "./operators";

(function () {
    windowScroll();
    window.addEventListener('scroll', windowScroll);
    animateAboutOnMouseMove();
    popupHandlers();
    mapHandlers();
    operatorsPage();
    $('a[href*="#"]').on('click', smoothScroll);
})();


