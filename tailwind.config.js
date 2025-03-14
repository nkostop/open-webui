import typography from '@tailwindcss/typography';
import containerQuries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				gray: {
					50: 'var(--color-gray-50, #f9f9f9)',
					100: 'var(--color-gray-100, #ececec)',
					200: 'var(--color-gray-200, #e3e3e3)',
					300: 'var(--color-gray-300, #cdcdcd)',
					400: 'var(--color-gray-400, #b4b4b4)',
					500: 'var(--color-gray-500, #00D69D)',
					600: 'var(--color-gray-600, #00BC8B)',
					700: 'var(--color-gray-700, #4e4e4e)',
					800: 'var(--color-gray-800, #00BC8B)',
					850: 'var(--color-gray-850, #021C4F)',
					900: 'var(--color-gray-900, rgb(6, 34, 91))',
					950: 'var(--color-gray-950, #021C4F)'
				}
			},
			typography: {
				DEFAULT: {
					css: {
						pre: false,
						code: false,
						'pre code': false,
						'code::before': false,
						'code::after': false
					}
				}
			},
			padding: {
				'safe-bottom': 'env(safe-area-inset-bottom)'
			}
		}
	},
	plugins: [typography, containerQuries]
};
