import {randomIntFromInterval, MQUERY, MSIZE} from "./common";

export const mapHandlers = () => {
    $(document)
        .on('mouseenter', '.mapsvg-region', hoverPath)
        .on('mouseout', '.mapsvg-region', removePathHover);

    if (document.querySelector('.js-for-regions')) {
        window.addEventListener('resize', resizeWndowSetMap);
        initPlaces();
        setRandomHover();
    }
};

const countriesCount = [
    {
        id: 'SK',
        count: 66
    },
    {
        id:'SI',
        count: 58
    },
    {
        id:'SE',
        count: 112
    },
    {
        id:'RS',
        count: 18
    },
    {
        id:'RO',
        count: 29
    },
    {
        id:'PT',
        count: 88
    },
    {
        id:'NO',
        count: 178
    },
    {
        id:'NL',
        count: 120
    },
    {
        id:'PL',
        count: 331
    },
    {
        id:'EE',
        count: 39
    },
    {
        id:'AT',
        count: 261
    },
    {
        id:'DE',
        count: 705
    },
    {
        id:'CZ',
        count: 319
    },
    {
        id:'IE',
        count: 7
    },
    {
        id:'CH',
        count: 91
    },
    {
        id:'AL',
        count: 11
    },
    {
        id:'DK',
        count: 37
    },
    {
        id:'LV',
        count: 36
    },
    {
        id:'TR',
        count: 12
    },
    {
        id:'BG',
        count: 16
    },
    {
        id:'HR',
        count: 58
    },
    {
        id:'BE',
        count: 78
    },
    {
        id:'ES',
        count: 180
    },
    {
        id:'FI',
        count: 14
    },
    {
        id:'HU',
        count: 251
    },
    {
        id:'ME',
        count: 6
    },
    {
        id:'FR',
        count: 567
    },
    {
        id:'LU',
        count: 5
    },
    {
        id:'GB',
        count: 49
    },
    {
        id:'GR',
        count: 38
    },
    {
        id:'IT',
        count: 488
    },
    {
        id:'LT',
        count: 37
    }
];

let to = null,
    toResize = null;

const countries = $.fn.intlTelInput.getCountryData();

const PLACE_SIZE = 20 * 30;

const resizeWndowSetMap = () => {
    $('.js-for-points-map').html('');
    clearTimeout(toResize);
    toResize = setTimeout(()=> {
        initPlaces();
    }, 50);
};

const hoverPath = (e, isID) => {
    let target = isID ? isID : e.currentTarget;
    let id = target.getAttribute('id');

    let country = countries.filter(country => country.iso2 === id);

    removeActiveClassFromRegions();

    if (isID) isID.classList.add('active');
    else clearInterval(to); 

    if (country.length > 0) {
        removeInfoBlock();
        let info = {
            bgi: `images/country_profile/${id}.jpg`,
            name: country[0].name,
            id: country[0].iso2,
            count: target.getAttribute('data-count') ? target.getAttribute('data-count') : 0
        };
        if (MQUERY.matches) {
            let b = document.querySelector(`#${target.getAttribute('id')}`).getBoundingClientRect();
            let bound = {
                x: b.x + 40,
                width: b.width,
                height: b.height,
                y: target.getBBox().y - (target.getBBox().y / 3)
            };
            renderInfoBlock(info, bound);
        } else {
            let offsetTop = document.querySelector('.js-for-points-map').getBoundingClientRect().y;
            let ba = target.getBoundingClientRect();
            let boundFinal = {
                x: ba.x,
                width: ba.width,
                height: ba.height,
                y: ba.y - offsetTop
            };
            renderInfoBlock(info, boundFinal);
        }
    }

    let region = document.querySelector(`.svgmap__region[data-id="${id}"]`);

    if (region) {
        region.style.animationDelay = '0ms';
        region.classList.add('reverse');
    }
};

const removePathHover = (e, isID) => {
    let target = isID ? isID : e.currentTarget;
    let id = target.getAttribute('id');

    let region = document.querySelector(`.svgmap__region[data-id="${id}"]`);
    removeActiveClassFromRegions();

    if (region) {
        region.style.animationDelay = '0ms';
        region.classList.remove('reverse');
    }
    removeInfoBlock();
};

const setRandomHover = ()=> {
    let randomCountry = countriesCount[randomIntFromInterval(0, countriesCount.length-1)].id;
    let target = document.querySelector(`#${randomCountry.toLowerCase()}`);
    let prev = target;

    removePathHover(null, target);
    hoverPath(null, target);
    to = setInterval(()=> {
        let randomCountry1 = countriesCount[randomIntFromInterval(0, countriesCount.length-1)].id;
        let target1 = document.querySelector(`#${randomCountry1.toLowerCase()}`);
        removePathHover(null, prev);
        hoverPath(null, target1);
        prev = target1;
    }, 3000);
};

const removeActiveClassFromRegions = ()=> {
    document.querySelectorAll('.mapsvg-region').forEach((e)=> {
        e.classList.remove('active');
    });
};

const renderInfoBlock = (info, bound) => {
    let block = document.createElement('div');
    block.className = 'svgmap';
    block.setAttribute('id', 'hoverMapElmenet');
    block.style.left = `${bound.x + (bound.width / 2)}px`;
    block.style.top = `${bound.y + (bound.height / 2)}px`;

    let left = 0;
    if (bound.x + 125 +(bound.width / 2) > window.innerWidth) {
        left = window.innerWidth - (bound.x + 125);
    }

    if (info.id === 'tr') {
        block.style.left =  window.innerWidth < 1260 && window.innerWidth > MSIZE ? `${bound.x + 10}px` : `${bound.x  - 50}px`;
    }

    let triangleLeft = Math.abs(left) - 11 > 104 ? 104 : Math.abs(left) - 11;

    block.innerHTML = `<div class="svgmap__block" style="left: ${left + (-125)}px;">
        <div class="svgmap__locator" style="left: calc(50% + ${Math.abs(left)-11}px)"></div>
        <div class="svgmap__img" style=" background-image: url('${info.bgi}')"></div>
        <div class="svgmap__triangle" style="left: calc(50% + ${triangleLeft}px)"></div>
        <div class="svgmap__txt">
            <div class="svgmap__name">${info.name}</div>
            <div class="svgmap__count">${info.count} hotels</div>
        </div>
    </div>`;

    document.querySelector('.js-for-regions').appendChild(block);
};

const removeInfoBlock = () => {
    if (document.querySelector('#hoverMapElmenet'))
        document.querySelector('#hoverMapElmenet').remove();
};

const getCountPlacesByRegion = (region) => {
    let bound = region.getBBox();

    return parseInt((bound.width * bound.height / PLACE_SIZE) / 2);
};

const setPlacesOnRegion = (count, bound, index, id) => {
    let block = document.createElement('div'),
        arr = [];

    block.className = 'svgmap__region';
    block.style.left = `${bound.x}px`;
    block.style.top = `${bound.y}px`;
    block.style.width = `${bound.width}px`;
    block.style.height = `${bound.height}px`;
    block.setAttribute('data-id', id);
    block.style.backgroundImage = `url("img/countries_pointers/${id}.svg")`;
    block.style.animationDelay = `${index * 15}ms`;

    return block;
};

const initPlaces = () => {
    countriesCount.map((e,i)=> {
        let target = document.querySelector(`#${e.id.toLowerCase()}`);
        target.setAttribute('data-count', e.count);
        let offsetTop = document.querySelector('.js-for-points-map').getBoundingClientRect().y;
        let bound = target.getBBox();
        let ba = target.getBoundingClientRect();
        let boundFinal = {
            x: ba.x,
            width: ba.width,
            height: ba.height,
            y: ba.y - offsetTop
        };
        let div = setPlacesOnRegion(getCountPlacesByRegion(target), boundFinal, i, e.id.toLowerCase());
        document.querySelector('.js-for-points-map').appendChild(div);
    });
};