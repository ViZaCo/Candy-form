'use strict'

//Параллакс двух объектов с разн. коэф.: __image-bg и __text =======================================================
$(window).scroll(function (event) {
	var s = $(this).scrollTop() / 2;
	$('.fullscreen__image-bg').css('transform', 'translate3d(0, ' + s + 'px, 0)');

});
$(window).scroll(function (event) {
	var s = $(this).scrollTop() / 1.4;
	$('.fullscreen__text').css('transform', 'translate3d(0px, ' + s + 'px, 0)');
});
//================================================================

//Прячем и показываем header=====================================
var vh = window.innerHeight / 100;
var prevScrollpos = window.pageYOffset;
var header = document.querySelector('.header');
window.onscroll = function () {
	var currentScrollPos = window.pageYOffset;
	if (prevScrollpos > currentScrollPos) {
		header.classList.add('_bg');
		header.style.top = "0px";
	} else {
		header.style.top = "-70px";
	}
	if (window.pageYOffset < 20 * vh) {
		header.classList.remove('_bg');
	}
	prevScrollpos = currentScrollPos;
}
//==========================

//Меню бургер ======================================
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}
//=================================================

//Прокрутка при клике ====================
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClik);
	});
	function onMenuLinkClik(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}
			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}
//=======================================================

//Анимация при скроле ===============================
const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 8;
			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}
			if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')) {
					animItem.classList.remove('_active');
				}
			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}
	setTimeout(() => {
		animOnScroll();
	}, 300);
	// animOnScroll();
}
//=============================================================

//Кнопки выбора слайдера =======================================
const packageBtns = document.querySelectorAll('.package__btn');
const packageSliders = document.querySelectorAll('.package__slider .slider');
if (packageSliders.length > 0) {
	for (let i = 0; i < packageSliders.length; i++) {
		packageSliders[0].classList.add('_active')
	}
}
packageBtns.forEach(function (packageBtn, index) {
	packageBtns[0].classList.add('_active')
	packageBtn.addEventListener('click', (e) => {
		var packageSlider = packageSliders[index];
		packageBtns.forEach(el => {
			el.classList.remove('_active');
		});
		packageBtn.classList.add('_active')
		packageSliders.forEach(el => {
			el.classList.remove('_active');
		});
		packageSlider.classList.add('_active')
	})
})
//=======================================================

//Слайдер===============================================
$(document).ready(function () {
	$('.slider_1, .slider_2, .slider_3, .slider_4, .slider_5').slick({
		arrows: true,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: true,
		adaptiveHeight: false,
		easing: 'ease',
		centerMode: true,
		variableWidth: true,
		touchTreshhold: 20,
		waitForAnimate: false,

	});
	$('.package__btn').click(function (event) {
		$('.slider_1, .slider_2, .slider_3, .slider_4').slick('setPosition');
	});
});
//============================================

//Обработка формы ============================
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');


	//Индексация и возврат значения Placeholder после потери фокуса -----
	let formElement = form.elements;

	for (let index = 0; index < formElement.length; index++) {

		const input = formElement[index];

		const formInputPlaceholder = input.placeholder;

		input.addEventListener('focus', function (e) {
			input.placeholder = '';
		});
		input.addEventListener('blur', function (e) {
			input.placeholder = formInputPlaceholder;
		});
	}

	//Отправка -------------------------------------------------
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);


		if (error === 0) {
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				form.reset();
			} else {
				alert("Ошибка");
			}
		}
	}
	//Валидация -------------------------------------------------------
	function formValidate(form) {

		const formTel = form.tel;
		const formEmail = form.email;

		let error = 0;


		formRemoveError(formTel);
		formRemoveError(formEmail);

		if (formTel.value === '') {
			formAddError(formTel);
			error++;
			alert('Заполните обязательное поле "Телефон" !');
		}

		if (formEmail.value === '') {

		} else if (emailTest(formEmail)) {
			formAddError(formEmail);
			error++;
			alert('Проверьте указанный email !');
		}

		return error;
	}

	function formAddError(formTel) {
		formTel.classList.add('_error');
	}
	function formRemoveError(formTel) {
		formTel.classList.remove('_error');
	}

	//функция теста email---------------
	function emailTest(formEmail) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formEmail.value);

	}
});
//=======================================================================
// const firstSection = document.querySelector('.first-section');
// if (user.browser.family === 'Chrome') {
// 	firstSection.classList.add("no-webp");
//  }