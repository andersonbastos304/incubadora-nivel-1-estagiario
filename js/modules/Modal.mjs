/**
 * @param {Object} [options]
 * @param {HTMLElement} [options.root_element]
 * @param {int} [options.timeout_create]
 * @param {int} [options.timeout_close]
 * @param {string} [options.active_class]
 * @param {string} [options.active_backdrop_class]
 */
function Modal(
    {
        root_element = document.body,
        timeout_create = 10,
        timeout_close = 300,
        active_class = "modal-open",
        active_backdrop_class = "active",
    } = {}
) {
    if(!_root_element) {
        _root_element = root_element;
        _timeout_create = timeout_create;
        _timeout_close = timeout_close;
        _active_class = active_class;
        _active_backdrop_class = active_backdrop_class;
    }

}

Modal.prototype.init = function() {
    //Nothing to do here, it's just for compatibility issues.
}

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {string} [options.content]
 * @param {string} [options.size]
 * @param {{label: string, variant: string, onClick: Function}[]} [options.actions]
 * @param {string} [options.icon]
 * @param {string} [options.iconType]
 */
Modal.prototype.create = function(
    {
        id = generate_id(),
        title = "",
        content = "",
        size = "md",
        actions = [],
        icon = null,
        iconType = null,
    } = {}
) {
    const new_element = build_backdrop.call(
        this,
        {
            modal_id: id,
            title: title,
            content: content,
            size: size,
            actions: actions,
            icon: icon,
            icon_type: iconType,
        }
    );
    _root_element.append(new_element);
    
    _modals.set(id, new_element);

    setTimeout(
        () => {
            _root_element.classList.add(_active_class);
        },
        _timeout_create
    );

    return id;
}

/**
 * @param {string} id 
 */
Modal.prototype.close = function(id) {
    const component = _modals.get(id);
    if(component) {
        component.classList.remove(_active_backdrop_class);
        setTimeout(
            () => {
                component.remove();
                _modals.delete(id);
                if(_modals.size === 0) {
                    _root_element.classList.remove(_active_class);
                }
            },
            _timeout_close
        );
    }
}

Modal.prototype.closeAll = function() {
    _modals.forEach(
        (element, id, _modals) => {
            this.close(id);
        }
    );
}

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {string} [options.content]
 * @param {string} [options.size]
 * @param {{label: string, variant: string, onClick: Function}[]} [options.actions]
 */
Modal.prototype.success = function(options = {}) {
    return this.create(
        {
            ...options,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            iconType: "success",
            content: options.content || "Operação realizada com sucesso!",
        }
    );
}

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {string} [options.content]
 * @param {string} [options.size]
 * @param {{label: string, variant: string, onClick: Function}[]} [options.actions]
 */
Modal.prototype.error = function(options = {}) {
    return this.create(
        {
            ...options,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
			iconType: "error",
			content: options.content || "Ocorreu um erro. Tente novamente.",
        }
    );
}

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {string} [options.content]
 * @param {string} [options.size]
 * @param {{label: string, variant: string, onClick: Function}[]} [options.actions]
 */
Modal.prototype.info = function(options = {}) {
    return this.create(
        {
            ...options,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
			iconType: "info",
			content: options.content || "Informação importante.",
        }
    );
}

let _root_element = null;
let _timeout_create = null;
let _timeout_close = null;
let _active_class = null;
let _active_backdrop_class = null;
const _modals = new Map();

function generate_id(
    {
        prefix = "modal-",
    } = {}
) {
    if(typeof Crypto?.randomUUID === "function") {
        return `${prefix}${Crypto.randomUUID()}`;
    } else {
        return `${prefix}${Date.now()}`;
    }
}

function build_backdrop(
    {
        modal_id = generate_id(),
        title = "",
        size = "md",
        icon = null,
        icon_type = null,
        content = "",
        actions = [],
        backdrop_class = "modal-backdrop",
        active_backdrop_class = _active_backdrop_class,
        main_element = build_main({title: title, size: size, icon: icon, icon_type: icon_type, content: content, actions: actions}),
    } = {}
) {
    const return_element = document.createElement("div");
    return_element.classList.add(backdrop_class, active_backdrop_class);
    return_element.dataset.modalId = modal_id;
    return_element.addEventListener(
        "click",
        (event) => {
            if(event?.is_from_modal_close_button || event?.is_from_modal_action_button) {
                this.close(return_element.dataset.modalId);
            }
            if(event.target === return_element) {
                this.closeAll();
            }
            event.stopPropagation();
        }
    );

    if(main_element) {
        return_element.append(main_element);
    }
    
    return return_element;
}

function build_main(
    {
        title = "",
        size = "md",
        icon = null,
        icon_type = null,
        content = "",
        actions = [],
        main_class = "modal",
        main_size_class_prefix = "modal--",
        header_component = build_header({title: title}),
        body_component = build_body({icon: icon, icon_type: icon_type, content: content}),
        footer_component = build_footer({actions: actions}),
    } = {}
) {
    const return_element = document.createElement("div");
    return_element.classList.add(main_class, main_size_class_prefix + size);

    if(header_component) {
        return_element.append(header_component);
    }
    if(body_component) {
        return_element.append(body_component);
    }
    if(footer_component) {
        return_element.append(footer_component);
    }

    return return_element;
}

function build_header(
    {
        title = "",
        header_class = "modal__header",
        title_element = build_header_title({title: title}),
        close_button_element = build_header_close_button(),
    } = {}
) {
    const return_element = document.createElement("div");
    return_element.classList.add(header_class);
    
    if(title != "") {
        if(title_element) {
            return_element.appendChild(title_element);
        }
        if(close_button_element) {
            return_element.appendChild(close_button_element);
        }
        return return_element;
    } else {
        return null;
    }
}

function build_header_title(
    {
        title = "",
        title_class = "modal__title",
    } = {}
) {
    const return_element = document.createElement("h3");
    return_element.classList.add(title_class);
    return_element.textContent = title;
    return return_element;
}

function build_header_close_button(
    {
        close_button_class = "modal__close",
        close_button_aria_label = "Fechar",
        svg = build_header_close_button_svg(),
    } = {}
) {
    const return_element = document.createElement("button");
    return_element.classList.add(close_button_class);
    return_element.ariaLabel = close_button_aria_label;
    return_element.addEventListener(
        "click",
        (event) => {
            event.is_from_modal_close_button = true;
        }
    );

    if(svg) {
        return_element.append(svg);
    }

    return return_element;
}

function build_header_close_button_svg() {
    const return_element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return_element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return_element.setAttribute("width", "24");
    return_element.setAttribute("height", "24");
    return_element.setAttribute("viewBox", "0 0 24 24");
    return_element.setAttribute("fill", "none");
    return_element.setAttribute("stroke", "currentColor");
    return_element.setAttribute("stroke-width", "2");

    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "18");
    line1.setAttribute("y1", "6");
    line1.setAttribute("x2", "6");
    line1.setAttribute("y2", "18");
    return_element.append(line1);

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "6");
    line2.setAttribute("y1", "6");
    line2.setAttribute("x2", "18");
    line2.setAttribute("y2", "18");
    return_element.append(line2);

    return return_element;
}

function build_body(
    {
        icon = null,
        icon_type = null,
        content = "",
        body_class = "modal__body",
        body_icon_element = build_body_icon({icon: icon, icon_type: icon_type}),
    } = {}
) {
    const return_element = document.createElement("div");
    return_element.classList.add(body_class);

    if(body_icon_element) {
        return_element.append(body_icon_element);
    }

    return_element.insertAdjacentHTML("beforeend", content);

    return return_element;
}

function build_body_icon(
    {
        icon = null,
        icon_type = null,
        icon_class = "modal__icon",
        icon_type_class_prefix = "modal__icon--",
    } = {}
) {
    if(icon) {
        const return_element = document.createElement("div");
        return_element.classList.add(icon_class);
        if(icon_type) {
            return_element.classList.add(icon_type_class_prefix + icon_type);
        }
        return_element.insertAdjacentHTML("afterbegin", icon);
        return return_element;
    } else {
        return null;
    }
}

/**
 * @param {Object} argument 
 * @param {{variant?: string, label?: string, on_click?: Function}[]} argument.actions
 * @param {string} [argument.footer_class]
 */
function build_footer(
    {
        actions = [],
        footer_class = "modal__footer",
    } = {}
) {
    const return_element = document.createElement("div");
    return_element.classList.add(footer_class);

    for(const action of actions) {
        if(action.onClick) {
            action.on_click = action.onClick;
        }
        return_element.append(build_footer_button(action));
        delete action.on_click;
    }

    return return_element;
}

/**
 * @param {Object} [argument] 
 * @param {string} [argument.variant]
 * @param {string} [argument.label]
 * @param {Function} [argument.on_click]
 * @param {string} [argument.footer_button_class]
 * @param {string} [argument.footer_button_variant_class_prefix]
 */
function build_footer_button(
    {
        variant = "primary",
        label = "",
        on_click = null,
        footer_button_class = "btn",
        footer_button_variant_class_prefix = "btn-",
    } = {}
) {
    const return_element = document.createElement("button");
    return_element.classList.add(footer_button_class, footer_button_variant_class_prefix + variant);
    return_element.dataset.action = label;
    return_element.innerText = label;

    if(on_click) {
        return_element.addEventListener(
            "click",
            (event) => {
                on_click();
                event.is_from_modal_action_button = true;
            }
        );
    }

    return return_element;
}

export default Modal;