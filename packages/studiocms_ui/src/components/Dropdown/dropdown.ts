class DropdownHelper {
	container: HTMLDivElement;
	toggle: HTMLDivElement;
	dropdown: HTMLUListElement;

	alignment: 'start' | 'center' | 'end';
	active = false;

	constructor(id: string) {
		this.container = document.getElementById(`${id}-container`) as HTMLDivElement;

		if (!this.container) {
			throw new Error(`Unable to find dropdown with ID ${id}.`);
		}

		this.alignment = this.container.dataset.align as 'start' | 'center' | 'end';

		this.toggle = document.getElementById(`${id}-toggle-btn`) as HTMLDivElement;
		this.dropdown = document.getElementById(`${id}-dropdown`) as HTMLUListElement;

		this.toggle.addEventListener('click', this.toggleDropdown);
		window.addEventListener('scroll', this.hideDropdown);

		this.hideOnClickOutside(this.container);

		this.initialOptClickRegistration();
	}

	public registerClickCallback = (func: (value: string) => void) => {
		const dropdownOpts = this.dropdown.querySelectorAll('li');

		for (const opt of dropdownOpts) {
			opt.removeEventListener('click', this.hideDropdown);

			opt.addEventListener('click', () => {
				func(opt.dataset.value || '');
				this.hideDropdown();
			});
		}
	};

	private initialOptClickRegistration = () => {
		const dropdownOpts = this.dropdown.querySelectorAll('li');

		for (const opt of dropdownOpts) {
			opt.addEventListener('click', this.hideDropdown);
		}
	};

	public toggleDropdown = () => {
		if (this.active) {
			this.hideDropdown();
			return;
		}

		const { bottom, left, right, width, x, y, height } = this.toggle.getBoundingClientRect();
		const { width: dropdownWidth } = this.dropdown.getBoundingClientRect();

		const optionHeight = 36;
		const totalBorderSize = 2;
		const margin = 4;

		const dropdownHeight = this.dropdown.children.length * optionHeight + totalBorderSize + margin;

		const CustomRect = {
			top: bottom + margin,
			left,
			right,
			bottom: bottom + margin + dropdownHeight,
			width: dropdownWidth, // Account for scaling of animation
			height: dropdownHeight,
			x,
			y: y + height + margin,
		};

		this.active = true;

		if (this.alignment === 'end') {
			this.dropdown.style.left = `calc(${width}px - ${CustomRect.width}px)`;
		}

		if (this.alignment === 'center') {
			this.dropdown.style.left = `calc(${width / 2}px - ${CustomRect.width / 2}px)`;
		}

		if (
			CustomRect.top >= 0 &&
			CustomRect.left >= 0 &&
			CustomRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			CustomRect.right <= (window.innerWidth || document.documentElement.clientWidth)
		) {
			this.dropdown.classList.add('active', 'below');
		} else {
			this.dropdown.classList.add('active', 'above');
		}
	};

	public hideDropdown = () => {
		this.dropdown.classList.remove('active');
		this.active = false;

		setTimeout(() => this.dropdown.classList.remove('above', 'below'), 200);
	};

	private hideOnClickOutside = (element: HTMLElement) => {
		const outsideClickListener = (event: MouseEvent) => {
			if (!event.target) return;

			if (!element.contains(event.target as Node) && isVisible(element) && this.active === true) {
				// or use: event.target.closest(selector) === null
				this.hideDropdown();
			}
		};

		document.addEventListener('click', outsideClickListener);
	};
}

export { DropdownHelper };

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
const isVisible = (elem: HTMLElement) =>
	!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
