class SingleSidebarHelper {
	sidebar: HTMLElement;
	navbarToggle: HTMLElement;

	constructor(toggleID: string) {
		const sidebarContainer = document.getElementById('sidebar');
		const navToggle = document.getElementById(toggleID);

		if (!sidebarContainer) {
			throw new Error(
				`No item with ID 'sidebar' found. Please add the <Sidebar> component to this page.`
			);
		}

		if (!navToggle) {
			throw new Error(`No item with ID ${toggleID} found.`);
		}

		this.sidebar = sidebarContainer;
		this.navbarToggle = navToggle;

		this.navbarToggle.addEventListener('click', () => {
			this.sidebar.classList.toggle('active');
		});
	}
}

class DoubleSidebarHelper {
	sidebarsContainer: HTMLElement;
	navbarOpen: HTMLElement;
	backToOuter: HTMLElement;

	constructor(openNavID: string, backToOuterID: string) {
		const sidebarsContainer = document.getElementById('sidebars');
		const navOpen = document.getElementById(openNavID);
		const backToOuter = document.getElementById(backToOuterID);

		if (!sidebarsContainer) {
			throw new Error(
				`No item with ID 'sidebars' found. Please add the <DoubleSidebar> component to this page.`
			);
		}

		if (!navOpen) {
			throw new Error(`No item with ID ${openNavID} found.`);
		}

		if (!backToOuter) {
			throw new Error(`No item with ID ${backToOuterID} found.`);
		}

		this.sidebarsContainer = sidebarsContainer;
		this.navbarOpen = navOpen;
		this.backToOuter = backToOuter;

		this.navbarOpen.addEventListener('click', () => {
			this.sidebarsContainer.classList.add('active', 'inner');
		});

		this.backToOuter.addEventListener('click', () => {
			this.sidebarsContainer.classList.remove('inner');
		});
	}

	public showContentOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.hideInnerNavbar);
	};

	public showInnerOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showInnerNavbar);
	};

	public showInnerNavbar = () => {
		this.sidebarsContainer.classList.add('inner');
	};

	public hideInnerNavbar = () => {
		this.sidebarsContainer.classList.remove('active');
	};
}

export { SingleSidebarHelper, DoubleSidebarHelper };
