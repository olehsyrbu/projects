import debounce from 'lodash/debounce';


export const MQUERY = window.matchMedia('screen and (max-width: 959px)');
export const MSIZE = 959;
export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export const isIE10 = /MSIE 10/i.test(navigator.userAgent);
export const isIE11= /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent);
export const isEDGE = /Edge\/\d./i.test(navigator.userAgent);

const _checkElementViewport = (elm, isHTML, half) => {
    let height = half ? window.innerHeight / 1.1 : window.innerHeight;
    if (isHTML && elm.getBoundingClientRect().top < height) return true;
    else if (!isHTML) {
        if (!document.querySelector(elm)) return false;
        else if (document.querySelector(elm).getBoundingClientRect().top < height) return true;
    }
};

const _addClassonViewport = (elm, isHTML, half) => {
    if (isHTML && _checkElementViewport(elm, isHTML, half)) elm.classList.add('active');
    else if (!isHTML && _checkElementViewport(elm, null, half)) document.querySelector(elm).classList.add('active');
};


const _addRequireAnimation = () => {
    document.querySelectorAll('.req-animation').forEach((e) => {
        _addClassonViewport(e, true, true);
    });
};



export const windowScroll = debounce(() => {
    window.requestAnimationFrame(() => {
        _addRequireAnimation();
    });
}, 50);



export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires == "number" && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + "=" + value;

    for (let propName in options) {
        updatedCookie += "; " + propName;
        let propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

export function smoothScroll(e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: $($(e.currentTarget).attr('href')).offset().top
    }, 500, 'linear');
}

export function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}