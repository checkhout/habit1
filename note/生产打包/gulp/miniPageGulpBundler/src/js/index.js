window.onload=function () {
	// rem适配
	(function () {
		var styleNode=document.createElement("style");
		var Ww=document.documentElement.clientWidth/16;
		styleNode.innerHTML='html{font-size:' + Ww +'px !important}';
		document.head.appendChild(styleNode);
	})();

	var swiper1 = new Swiper('.banner1', {
		pagination: {
			el: '.swiper-pagination1',
			clickable: false,
			renderBullet: function (index, className) {
				return '<span class="' + className + '"></span>';

			},
		},
	});
	var swiper2 = new Swiper('.banner2', {
		pagination: {
			el: '.swiper-pagination2',
			clickable: false,
			renderBullet: function (index, className) {
				return '<span class="' + className + '"></span>';

			},
		},
	});
	var swiper3 = new Swiper('.banner3', {
		pagination: {
			el: '.swiper-pagination3',
			clickable: false,
			renderBullet: function (index, className) {
				return '<span class="' + className + '"></span>';

			},
		},
	});
	var swiper4 = new Swiper('.banner4', {
		pagination: {
			el: '.swiper-pagination4',
			clickable: false,
			on: {
				slideChangeTransitionStart: function(){
					alert(this.activeIndex);
				},

			},
			renderBullet: function (index, className) {
				return '<span class="' + className + '"></span>';

			},
		},
	});
};