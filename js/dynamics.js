// Hamburger menu: injects a button into the header and toggles the <nav> for mobile/tablet
document.addEventListener('DOMContentLoaded', function () {
	try {
		var header = document.querySelector('header');
		var nav = document.querySelector('header nav');

		if (!header || !nav) return; // nothing to do

		// Create hamburger button
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'hamburger';
		btn.setAttribute('aria-label', 'Toggle navigation');
		btn.setAttribute('aria-expanded', 'false');
		btn.setAttribute('aria-controls', 'site-navigation');

		// Create simple bars for the visual
		var bar = document.createElement('span');
		bar.className = 'bar';
		btn.appendChild(bar);

		// Give the nav an id for aria-controls if it doesn't have one
		if (!nav.id) nav.id = 'site-navigation';

		// Insert the button before the nav so layout stays logical
		header.insertBefore(btn, nav);

		// Inject minimal CSS to handle mobile display when nav is opened
		var css = '\n/* Hamburger injected styles - mobile only */\n@media (max-width: 768px) {\n  .hamburger{ display:flex; align-items:center; justify-content:center; width:48px; height:48px; background:transparent; border:0; color:inherit; cursor:pointer; margin-left:0.5rem; }\n  .hamburger .bar{ display:block; width:22px; height:2px; background:#fff; position:relative; transition:transform .22s ease, opacity .22s ease; }\n  .hamburger .bar::before, .hamburger .bar::after{ content:\'\'; width:22px; height:2px; background:#fff; position:absolute; left:0; transition:transform .22s ease, opacity .22s ease; }\n  .hamburger .bar::before{ top:-7px; }\n  .hamburger .bar::after{ top:7px; }\n  /* Hidden by default (mains.css hides nav on small screens) */\n  nav{ display:none; }\n  nav.open{ display:block !important; position:absolute; left:0; right:0; top:100%; background:#00796b; padding:1rem 1.25rem; box-shadow:0 8px 20px rgba(0,0,0,0.18); z-index:999; }\n  nav.open ul{ flex-direction:column; gap:1rem; display:flex; }\n  nav.open ul li a{ color:#fff; font-size:1.05rem; }\n  /* transform hamburger to X when open */\n  .hamburger.open .bar{ transform:rotate(45deg); }\n  .hamburger.open .bar::before{ transform:rotate(90deg) translateX(0); top:0; }\n  .hamburger.open .bar::after{ opacity:0; transform:translateX(-6px); }\n}\n';

		var style = document.createElement('style');
		style.setAttribute('data-injected-by', 'dynamics.js');
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);

		// Toggle function
		function setOpen(open) {
			if (open) {
				nav.classList.add('open');
				btn.classList.add('open');
				btn.setAttribute('aria-expanded', 'true');
				nav.setAttribute('aria-hidden', 'false');
			} else {
				nav.classList.remove('open');
				btn.classList.remove('open');
				btn.setAttribute('aria-expanded', 'false');
				nav.setAttribute('aria-hidden', 'true');
			}
		}

		// initialize aria-hidden based on computed style
		setOpen(false);

		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			var isOpen = nav.classList.contains('open');
			setOpen(!isOpen);
		});

		// Close on Esc
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' || e.key === 'Esc') {
				if (nav.classList.contains('open')) setOpen(false);
			}
		});

		// Close when clicking outside the header/nav
		document.addEventListener('click', function (e) {
			if (!header.contains(e.target) && nav.classList.contains('open')) {
				setOpen(false);
			}
		});

		// On resize, if viewport becomes larger than mobile, ensure nav is visible per mains.css
		window.addEventListener('resize', function () {
			try {
				if (window.innerWidth > 768) {
					// remove open state so desktop rules apply
					nav.classList.remove('open');
					btn.classList.remove('open');
					btn.setAttribute('aria-expanded', 'false');
					nav.setAttribute('aria-hidden', 'false');
				} else {
					// keep nav hidden on mobile by default
					nav.setAttribute('aria-hidden', nav.classList.contains('open') ? 'false' : 'true');
				}
			} catch (e) {
				/* ignore */
			}
		});

	} catch (err) {
		// Fail quietly if JS can't run; avoid breaking the page
		console.error('dynamics.js hamburger init error:', err);
	}
});
