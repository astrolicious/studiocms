class SingleSidebarHelper {
	sidebar: HTMLElement;
	navbarToggle?: HTMLElement | undefined;

	constructor(toggleID?: string) {
		const sidebarContainer = document.getElementById('sidebar');

		if (!sidebarContainer) {
			throw new Error(
				`No item with ID 'sidebar' found. Please add the <Sidebar> component to this page.`
			);
		}

		this.sidebar = sidebarContainer;

		if (toggleID) {
			const navToggle = document.getElementById(toggleID);

			if (!navToggle) {
				throw new Error(`No item with ID ${toggleID} found.`);
			}

			this.navbarToggle = navToggle;

			this.navbarToggle.addEventListener('click', () => {
				this.sidebar.classList.toggle('active');
			});
		}
	}

	public hideSidebarOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.hideSidebar);
	};

	public showSidebarOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showSidebar);
	};

	public hideSidebar = () => {
		this.sidebar.classList.remove('active');
	};

	public showSidebar = () => {
		this.sidebar.classList.add('active');
	};
}

class DoubleSidebarHelper {
	sidebarsContainer: HTMLElement;
	sidebarOpen: HTMLElement;
	backToOuter: HTMLElement;

	// TODO: Rework into similar to single sidebar
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
		this.sidebarOpen = navOpen;
		this.backToOuter = backToOuter;

		this.sidebarOpen.addEventListener('click', () => {
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

		element.addEventListener('click', this.hideSidebar);
	};

	public showInnerOnClick = (elementID: string) => {
		const element = document.getElementById(elementID);

		if (!element) {
			throw new Error(`No item with ID ${elementID} found.`);
		}

		element.addEventListener('click', this.showInnerSidebar);
	};

	public showInnerSidebar = () => {
		this.sidebarsContainer.classList.add('inner', 'active');
	};

	public showOuterSidebar = () => {
		this.sidebarsContainer.classList.add('active');
		this.sidebarsContainer.classList.remove('inner');
	};

	public hideSidebar = () => {
		this.sidebarsContainer.classList.remove('inner', 'active');
	};
}

export { SingleSidebarHelper, DoubleSidebarHelper };
