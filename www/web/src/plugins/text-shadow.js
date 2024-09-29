const plugin = require('tailwindcss/plugin');

const mainFunction = ({ matchUtilities, theme }) => {
	matchUtilities(
		{ 'text-shadow': (value) => ({ textShadow: value }) },
		{
			values: {
				DEFAULT: '0 1px 1px var(--tw-shadow-color)',
				sm: '0 1px 2px var(--tw-shadow-color)',
				md: '0 1px 4px var(--tw-shadow-color)',
				lg: '0 4px 6px var(--tw-shadow-color)',
				xl: '0 8px 10px var(--tw-shadow-color)',
				'2xl': '0 12px 16px var(--tw-shadow-color)',
			},
		}
	);
};

module.exports = plugin(mainFunction);
