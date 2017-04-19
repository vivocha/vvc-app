/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'vvc-widget-ico\'">' + entity + '</span>' + html;
	}
	var icons = {
		'vvc-file': '&#xe920;',
		'vvc-see': '&#xe921;',
		'vvc-download': '&#xe91f;',
		'vvc-not-send': '&#xe91e;',
		'vvc-writing': '&#xe91d;',
		'vvc-star-empty': '&#xe91b;',
		'vvc-star': '&#xe91c;',
		'vvc-calendar': '&#xe91a;',
		'vvc-arrow-left': '&#xe900;',
		'vvc-chat': '&#xe901;',
		'vvc-check': '&#xe902;',
		'vvc-clipboard': '&#xe903;',
		'vvc-clock': '&#xe904;',
		'vvc-close': '&#xe905;',
		'vvc-doc': '&#xe906;',
		'vvc-down': '&#xe907;',
		'vvc-expand': '&#xe908;',
		'vvc-hangup': '&#xe909;',
		'vvc-headphones': '&#xe90a;',
		'vvc-lock': '&#xe90b;',
		'vvc-minimize': '&#xe90c;',
		'vvc-mute': '&#xe90d;',
		'vvc-pencil': '&#xe90e;',
		'vvc-phone': '&#xe90f;',
		'vvc-pic': '&#xe910;',
		'vvc-reduce': '&#xe911;',
		'vvc-refresh': '&#xe912;',
		'vvc-remove': '&#xe913;',
		'vvc-sign-out': '&#xe914;',
		'vvc-smile': '&#xe915;',
		'vvc-unmute': '&#xe916;',
		'vvc-up': '&#xe917;',
		'vvc-video': '&#xe918;',
		'vvc-video-off': '&#xe919;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/vvc-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
