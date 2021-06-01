import {getCookie, MQUERY, setCookie} from "./common";
import noUiSlider from 'nouislider';

const optionsCountryAutcomlete = {
	
	data: $.fn.intlTelInput.getCountryData(),
	
	getValue: "name",
	
	list: {
		match: {
			enabled: true
		},
		onChooseEvent: () => {
			$("#company-country").intlTelInput("setCountry", $("#company-country").getSelectedItemData().iso2);
		}
	}
};

const popupHandlers = () => {
	$("#company-country").on("countrychange", setValueToCountry);
	
	$(document)
		.on('click', '.js-open-popup', openPopup)
		.on('click', '.js-close-popup', closePopup)
		.on('click', '.js-send-popup', sendPopupMessage)
		.on('click', '.popup', (e) => e.stopPropagation())
		.on('click', '.popup__bg', popupBackgroundClick)
		.on('input', 'textarea', commentAutoSize)
		.on('keyup', 'input', checkInputValue)
		.on('change', '.js-input-stars', changeStars)
		.on('input', '#range-input-min', changeInputRange)
		.on('input', '#range-input-max', changeInputRange)
		.on('change', '.js-radio-popup', toggleRadioHandler);
	
	checkCookieBanner();
	initMultiSlider();
};

const sendPopupMessage = (e) => {
	closePopup(e);
	document.querySelector('.popup__success').style.display = 'block';
};

let inputTimeOut = null;
const checkInputValue = (e) => {
	let input = e.currentTarget;
	if (input.getAttribute('name') === 'rooms') {
		clearTimeout(inputTimeOut);
		inputTimeOut = setTimeout(() => {
			let val = parseInt(input.value);
			
			if (val >= 20) {
				document.querySelector('.js-error-rooms').innerHTML = '';
			} else {
				document.querySelector('.js-error-rooms').innerHTML = 'We cooperate only with hotel 20+ rooms.';
			}
		}, 100);
	}
};

let currentTopWindow = 0;

const changeStars = (e) => {
	let stars = e.currentTarget.getAttribute('data-value');
	
	e.currentTarget.closest('.popup').querySelectorAll('.popup__checkbox').forEach((elm, i) => {
		elm.classList.remove('active');
		elm.querySelector('input').checked = false;
		// if (i+1 != stars)
		//
		//
		// if (i+1 <= stars && e.currentTarget.checked) {
		//     elm.classList.add('active');
		// } else {
		//     elm.classList.remove('active');
		// }
	});
	e.currentTarget.checked = true;
	e.currentTarget.parentNode.classList.add('active');
};

const toggleRadioHandler = (e) => {
	let curr = e.currentTarget.value;
	console.log(curr);
	
	if (document.querySelector('.js-show-radio'))
		document.querySelector('.js-show-radio').style.display = curr === 'true' ? 'block': 'none';
	
};

const openPopup = (e) => {
	let data = e.currentTarget.getAttribute('data-popup');
	if (MQUERY.matches) {
		currentTopWindow = window.pageYOffset;
		document.querySelector('body').classList.add('fixIt');
	}
	
	$('#company-country').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
			return selectedCountryData.name;
		},
		preferredCountries: []
	});
	// $("#company-country").easyAutocomplete(optionsCountryAutcomlete);
	
	$('#company-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});
	
	$('#hotel-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});
	
	$('#personal-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});
	
	document.querySelector(`.popup__${data}`).style.display = 'block';
};

const closePopup = (e) => {
	let target = e.currentTarget;
	if (MQUERY.matches) {
		document.querySelector('body').classList.remove('fixIt');
		window.scrollTo(0, currentTopWindow);
	}
	$('#company-country').intlTelInput('destroy');
	
	target.closest('.popup').querySelectorAll('input').forEach((e) => e.value = '');
	target.closest('.popup__bg').style.display = 'none';
};

const popupBackgroundClick = (e) => {
	let filed = false,
		inputs = e.currentTarget.querySelectorAll('input:not([type="checkbox"])');
	for (let i in inputs) {
		if (inputs[i].value
			&& inputs[i].value.length !== 0
			&& inputs[i].getAttribute('name') !== 'country') {
			filed = true;
			break;
		}
	}
	
	if (!filed) {
		$('#company-country').intlTelInput('destroy');
		
		e.currentTarget.querySelector('.popup').querySelectorAll('input').forEach((e) => e.value = '');
		e.currentTarget.style.display = 'none';
	}
	
};

const getCountryByIP = (callback) => {
	if (getCookie('currentCountry') && getCookie('currentCountry').length > 0) window.currentCountry = getCookie('currentCountry');
	
	if (window.currentCountry) {
		
		callback(window.currentCountry);
	} else {
		$.get('https://ipinfo.io', function () {
		}, "jsonp").always(function (resp) {
			if (resp.status !== 404) {
				let countryCode = (resp && resp.country) ? resp.country : "";
				window.currentCountry = countryCode;
				setCookie('currentCountry', countryCode, 30);
				callback(countryCode);
			}
		});
	}
};

const setValueToCountry = (e, countryData) => {
	e.currentTarget.value = countryData.name;
	if (e.currentTarget.getAttribute('id') === 'company-country') {
		setTimeout(() => {
			$(e.currentTarget).blur();
		});
	}
};

const renderCookieBanner = () => {
	let div = document.createElement('div');
	div.className = 'cookies-banner';
	div.setAttribute('id', 'cookies-banner');
	div.innerHTML = '<div class="container"><div class="cookies-banner__close"></div>\n' +
		'<p>This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies. <a target="_blank"\n href="http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm">Find out more about cookie here</a></p></div>';
	div.querySelector('.cookies-banner__close').addEventListener('click', closeCookieBanner);
	
	document.querySelector('body').insertBefore(div, document.querySelector('.header'));
};

const closeCookieBanner = () => {
	setCookie('cookie-banner', true, 365);
	document.querySelector('#cookies-banner').remove();
};

const checkCookieBanner = () => {
	if (!getCookie('cookie-banner'))
		renderCookieBanner();
};

const commentAutoSize = (e) => {
	let el = e.currentTarget;
	
	el.style.height = 'auto';
	el.style.height = el.scrollHeight + 'px';
};

const changeRangeSlider = (values) => {
	let inputMin = document.getElementById('range-input-min');
	let inputMax = document.getElementById('range-input-max');
	
	inputMin.value = parseInt(values[0]);
	inputMax.value = parseInt(values[1]);
};

let st = null;
const changeInputRange = (e) => {
	const slider = document.getElementById('multi-range');
	let current = e.currentTarget;
	let min = parseInt(current.getAttribute('min')),
		max = parseInt(current.getAttribute('max'));
	let inputMin = document.getElementById('range-input-min');
	let inputMax = document.getElementById('range-input-max');
	
	clearTimeout(st);
	st = setTimeout(() => {
		console.log(current.value);
		if (current === inputMin) {
			if (parseInt(current.value) > parseInt(inputMax.value))
				current.value = inputMax.value;
		} else {
			if (parseInt(current.value) < parseInt(inputMin.value))
				current.value = inputMin.value;
		}
		
		if (parseInt(current.value) < min || parseInt(current.value) > max || isNaN(parseInt(current.value))) {
			current.value = current.getAttribute('id') === 'range-input-min' ? min : max;
		}
		
		slider.noUiSlider.set([inputMin.value, inputMax.value]);
	}, 500);
	
};

const initMultiSlider = () => {
	let slider = document.getElementById('multi-range');
	let wrap = document.querySelector('.popup__range-wrapper');
	
	if (slider && wrap) {
		
		let min = parseInt(wrap.getAttribute('data-min'));
		let max = parseInt(wrap.getAttribute('data-max'));
		
		noUiSlider.create(slider, {
			start: [min + 30, max - 30],
			step: 5,
			connect: true,
			range: {
				'min': min,
				'max': max
			}
		});
		
		changeRangeSlider([min + 30, max - 30]);
		
		slider.noUiSlider.on('change', changeRangeSlider);
	}
};


export default popupHandlers;