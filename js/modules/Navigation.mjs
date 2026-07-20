function Navigation(
    {
        force_init = true,
        throw_on_non_object_overlay = false,
        throw_on_non_object_root = false,
        throw_on_non_object_menu_links = false,
        
        root_element = document.querySelector(".header"),
        menu_toggle_element = root_element.querySelector(".header__menu-toggle"),
        navigation_element = root_element.querySelector(".header__nav"),
        overlay_element = root_element.querySelector(".header__overlay"),
        menu_link_elements = root_element.querySelectorAll(".header__menu-link"),
    } = {}
) {
    if(typeof menu_toggle_element !== "object") {
        throw new Error("Menu toggle element must be defined.");
    }
    if(typeof navigation_element !== "object") {
        throw new Error("Navigation element must be defined.");
    }
    if(throw_on_non_object_overlay && typeof overlay_element !== "object") {
        throw new Error("Overlay element must be defined.");
    }
    if(throw_on_non_object_root && typeof root_element !== "object") {
        throw new Error("Root element must be defined.");
    }
    if(throw_on_non_object_menu_links && typeof menu_link_elements !== "object") {
        throw new Error("Menu link elements must be defined.");
    }
    
    this.is_open = false;
    this.throw_on_non_object_root = throw_on_non_object_root;
    this.throw_on_non_object_overlay = throw_on_non_object_overlay;
    
    this.root_element = root_element;
    this.menu_toggle_element = menu_toggle_element;
    this.navigation_element = navigation_element;
    this.overlay_element = overlay_element;
    this.menu_link_elements = menu_link_elements;

    if(force_init) {
        this.init();
    }
}

Navigation.prototype.init = function (
    {
        root_scrolled_class = "scrolled",

        window_width_threshold_px = 768,
        window_scroll_threshold_px = 50,
    } = {}
) {
    this.menu_toggle_element.addEventListener(
        "click",
        () => this.toggle()
    );
    this.overlay_element?.addEventListener(
        "click",
        () => this.close()
    );
    this.menu_link_elements.forEach(
        (link) => {
            link.addEventListener(
                "click",
                () => {if(window.innerWidth <= window_width_threshold_px) this.close();}
            );
        }
    );
    
    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > window_width_threshold_px && this.is_open) this.close();
        }
    );

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > window_scroll_threshold_px) {
                this.header?.classList?.add(root_scrolled_class);
            } else {
                this.header?.classList?.remove(root_scrolled_class);
            }
        }
    );

    this.setActivePage();
}

Navigation.prototype.toggle = function() {
    if(this.is_open) {
        this.close();
    } else {
        this.open();
    }
}

Navigation.prototype.open = function(
    {
        menu_toggle_active_class = "active",
        navigation_active_class = "active",
        overlay_active_class = "active",
    } = {}
) {
    this.menu_toggle_element.classList.add(menu_toggle_active_class);
    this.navigation_element.classList.add(navigation_active_class);
    this.overlay_element?.classList.add(overlay_active_class);

    document.body.style.overflow = "hidden";    //Can this be moved to one of the CSS files?

    this.is_open = true;
}

Navigation.prototype.close = function(
    {
        menu_toggle_active_class = "active",
        navigation_active_class = "active",
        overlay_active_class = "active",
    } = {}
) {
    this.menu_toggle_element.classList.remove(menu_toggle_active_class);
    this.navigation_element.classList.remove(navigation_active_class);
    this.overlay_element?.classList.remove(overlay_active_class);

    document.body.style.overflow = "";    //Can this be moved to one of the CSS files?

    this.is_open = false;
}

Navigation.prototype.setActivePage = function(
    {
        menu_link_active_class = "active",

        index_page = "index.html",

        menu_link_attribute = "href",
    } = {}
) {
    const current_page = window.location.pathname.split("/").pop() || index_page;
    this.menu_link_elements.forEach(
        (link_element) => {
            const link_page = link_element.getAttribute(menu_link_attribute);
            if (link_page === current_page || (current_page === "" && link_page === index_page)) {
                link_element.classList.add(menu_link_active_class);
            }
        }
    );
}

export default Navigation;