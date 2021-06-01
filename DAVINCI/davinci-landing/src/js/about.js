import {isEDGE, isFirefox, isIE10, isIE11, MQUERY} from "./common";

export const animateAboutOnMouseMove = ()=> {
    let movementStrength = 25;
    let height = movementStrength / window.innerWidth;
    let width = movementStrength / window.innerHeight;

    if ((isFirefox || isEDGE || isIE10 || isIE11) && document.querySelector('.about__image'))
        document.querySelectorAll('.about__image').forEach(e => e.classList.add('nonPath'));

    let a = false; // to remove

    if (!MQUERY.matches && a) {
        window.addEventListener('mousemove', (e)=> {
            let pageX = e.pageX - (window.innerWidth / 2);
            let pageY = e.pageY - (window.innerHeight / 2);
            let newvalueX = width * pageX * -1 - 25;
            let newvalueY = height * pageY * -1 - 50;
            document.querySelector('.about__image').style.backgroundPosition = `calc(50% + ${newvalueX}px) calc(50% + ${newvalueY}px)`;

            document.querySelectorAll('.about__circle').forEach((e,i)=> {
                let x = width * pageX * -1 - (25 + i*5);
                e.style.transform = `rotate(${x}deg) ${e.getAttribute('data-skew')}`;
            });
        });
    }
};