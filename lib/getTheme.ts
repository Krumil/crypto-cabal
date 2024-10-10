const code = function () {
	window.__onThemeChange = function () { };

	function setTheme(newTheme: string) {
		window.__theme = newTheme;
		preferredTheme = newTheme;
		document.documentElement.dataset.theme = newTheme;
		window.__onThemeChange(newTheme);
	}

	let preferredTheme: string;

	try {
		preferredTheme = localStorage.getItem('theme') || '';
	} catch (err) {
		preferredTheme = '';
	}

	window.__setPreferredTheme = function (newTheme: string) {
		setTheme(newTheme);
		try {
			localStorage.setItem('theme', newTheme);
		} catch (err) { }
	};

	const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

	darkQuery.addEventListener('change', function (e) {
		window.__setPreferredTheme(e.matches ? 'dark' : 'light');
	});

	setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
};

export const getTheme = `(${code})();`;

// Add these type declarations to avoid TypeScript errors
declare global {
	interface Window {
		__theme: string;
		__onThemeChange: (theme: string) => void;
		__setPreferredTheme: (theme: string) => void;
	}
}