// ========================================
// NAVIGATION.JS - Navegação e Menu
// ========================================

class Navigation {
	constructor() {
		this.header = document.querySelector(".header");
		this.menuToggle = document.querySelector(".header__menu-toggle");
		this.nav = document.querySelector(".header__nav");
		this.overlay = document.querySelector(".header__overlay");
		this.isOpen = false;
		this.init();
	}

	init() {
		if (!this.menuToggle || !this.nav) return;

		this.menuToggle.addEventListener("click", () => this.toggle());
		this.overlay?.addEventListener("click", () => this.close());

		document.querySelectorAll(".header__menu-link").forEach((link) => {
			link.addEventListener("click", () => {
				if (window.innerWidth <= 768) this.close();
			});
		});

		window.addEventListener("resize", () => {
			if (window.innerWidth > 768 && this.isOpen) this.close();
		});

		window.addEventListener("scroll", () => {
			if (window.scrollY > 50) {
				this.header?.classList.add("scrolled");
			} else {
				this.header?.classList.remove("scrolled");
			}
		});

		this.setActivePage();
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.isOpen = true;
		this.menuToggle.classList.add("active");
		this.nav.classList.add("active");
		this.overlay?.classList.add("active");
		document.body.style.overflow = "hidden";
	}

	close() {
		this.isOpen = false;
		this.menuToggle.classList.remove("active");
		this.nav.classList.remove("active");
		this.overlay?.classList.remove("active");
		document.body.style.overflow = "";
	}

	setActivePage() {
		const currentPage =
			window.location.pathname.split("/").pop() || "index.html";
		document.querySelectorAll(".header__menu-link").forEach((link) => {
			const linkPage = link.getAttribute("href");
			if (
				linkPage === currentPage ||
				(currentPage === "" && linkPage === "index.html")
			) {
				link.classList.add("active");
			}
		});
	}
}

module.exports = Navigation;