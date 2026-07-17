import Modal from "./Modal.mjs";

/**
 * @param {HTMLElement|string} form 
 * @param {Object} [arguments]
 */
function Form_Validator(
    form,
    {
        force_init = true,
    } = {}
) {
    if(typeof form === "string") {
        this.root_form = document.querySelector(form);
        if(!this.root_form) {
            throw new Error("No form element found");
        }
    } else {
        this.root_form = form;
    }

    if(force_init) {
        this.init();
    }
}

Form_Validator.prototype.init = function(
    {
        fields_query_selector = "input, textarea, select",
    } = {}
) {
    this.root_form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            this.handleSubmit();
        }
    );

    this.root_form.querySelectorAll(
            fields_query_selector).forEach((input) => {
            input.addEventListener(
                "blur",
                () => this.validateField(input)
            );
            input.addEventListener(
                "input",
                () => this.clearFieldError(input)
            );
        }
    );
}

/**
 * @param {HTMLElement} field 
 * @param {Object} [arguments]
 * @param {boolean} [arguments.handle_error_message]
 * @returns {boolean} Is field valid?
 */
Form_Validator.prototype.validateField = function(
    field,
    {
        handle_error_message = true,
    } = {}
) {
    const validate_sequence = [
        validate_required_field.bind(this),
        validate_email.bind(this),
        validate_min_length.bind(this),
    ];

    let is_invalid = false;
    let last_failed_validation_function = null;
    for(const validation_function of validate_sequence) {
        is_invalid = !validation_function({field});
        if(is_invalid) {
            last_failed_validation_function = validation_function;
            break;
        }
    }

    if(handle_error_message) {
        if(is_invalid) {
            this.showFieldError(
                field,
                get_validate_error_message(
                    {error_type: last_failed_validation_function?.name.replace(/^bound /, ""), field: field}
                )
            );
        } else {
            this.clearFieldError(field);
        }
    }
    
    return !is_invalid;
}

/**
 * @param {HTMLElement} field 
 * @param {string} message 
 * @param {Object} [arguments]
 * @param {string} [arguments.error_class]
 * @param {string} [arguments.field_error_class]
 * @param {HTMLElement} [arguments.error_element]
 * @param {HTMLElement} [arguments.target_error_element]
 */
Form_Validator.prototype.showFieldError = function(
    field,
    message,
    {
        error_class = "form__input--error",
        field_error_class = "form__error",
        error_element = field?.parentElement?.querySelector(`.${field_error_class}`),
        target_error_element = (field?.parentElement || document.body),
    } = {}
) {
    field.classList.add(error_class);
    if(error_element) {
        error_element.remove();
    }
    const new_error_element = build_error_element({message: message, error_class: field_error_class});
    target_error_element.append(new_error_element);
}

/**
 * @param {HTMLElement} field
 * @param {Object} [arguments]
 * @param {string} [arguments.error_class]
 * @param {string} [arguments.field_error_class]
 * @param {HTMLElement} [arguments.error_element]
 */
Form_Validator.prototype.clearFieldError = function(
    field,
    {
        error_class = "form__input--error",
        field_error_class = "form__error",
        error_element = field?.parentElement?.querySelector(`.${field_error_class}`),
    } = {}
) {
    field.classList.remove(error_class);
    if(error_element) {
        error_element.remove();
    }
}

/**
 * @param {Object} arguments
 * @param {string} arguments.handle_error_message
 * @param {string} arguments.fields_query_selector
 * @returns {boolean} Is every field valid?
 */
Form_Validator.prototype.validateAll = function(
    {
        handle_error_message = true,
        fields_query_selector = "input, textarea, select",
    } = {}
) {
    let is_valid = true;
    const fields = this.root_form.querySelectorAll(fields_query_selector);
    for(const field of fields) {
        is_valid = is_valid && this.validateField(field, {handle_error_message: handle_error_message});
    }
    return is_valid;
}

Form_Validator.prototype.getData = function() {
    const form_data = new FormData(this.root_form);
    const return_data = {};
    for(const entry of form_data.entries()) {
        return_data[entry[0]] = entry[1];
    }
    return return_data;
}

Form_Validator.prototype.handleSubmit = async function(
    {
        error_class = "form__input--error",

        validate_before_submit = true,
        handle_error_message = true,
        fields_query_selector = "input, textarea, select",

        target_modal = default_create_modal(),
        form_data = (
            () => {
                return this.getData();
            }
        )(),
        submit_function = default_submit_handler.bind(this, form_data, target_modal),
    } = {}
) {
    if(validate_before_submit) {
        const is_valid = this.validateAll(
            {
                handle_error_message: handle_error_message,
                fields_query_selector: fields_query_selector,
            }
        );
        if(!is_valid) {
            this.root_form.querySelector(`.${error_class}`).focus();
            return;
        }
    }
    submit_function();
}

function validate_required_field(
    {
        field,
    }
) {
    if(field?.required) {
        if(field?.value !== "") {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function validate_email(
    {
        field,
    }
) {
    if(field?.type === "email") {
        if((/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field?.value))) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function validate_min_length(
    {
        field,
    }
) {
    if(field?.minLength > 0) {
        if(field?.value.length >= field?.minLength) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function get_validate_error_message(
    {
        error_type = "",
        field = null,
    }
) {
    switch(error_type) {
        case "validate_required_field": return "Este campo é obrigatório";
        case "validate_email": return "E-mail inválido";
        case "validate_min_length": return `Mínimo de ${field?.minLength || "0"} caracteres`;
        default: return "";
    }
}

function build_error_element(
    {
        message = "",
        html_type = "span",
        error_class = "form__error",
    }
) {
    const return_element = document.createElement(html_type);
    return_element.classList.add(error_class);

    const svg_element = build_error_svg_element();
    if(svg_element) {
        return_element.append(svg_element);
    }

    const message_element = document.createElement("span");
    message_element.innerHTML = message;
    return_element.append(message_element);

    return return_element;
}

function build_error_svg_element() {
    const return_element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return_element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return_element.setAttribute("width", "14");
    return_element.setAttribute("height", "14");
    return_element.setAttribute("viewBox", "0 0 24 24");
    return_element.setAttribute("fill", "none");
    return_element.setAttribute("stroke", "currentColor");
    return_element.setAttribute("stroke-width", "2");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");
    return_element.append(circle);

    const line_1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    line_1.setAttribute("x1", "12");
    line_1.setAttribute("y1", "8");
    line_1.setAttribute("x2", "12");
    line_1.setAttribute("y2", "12");
    return_element.append(line_1);

    const line_2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    line_2.setAttribute("x1", "12");
    line_2.setAttribute("y1", "16");
    line_2.setAttribute("x2", "12.01");
    line_2.setAttribute("y2", "16");
    return_element.append(line_2);

    return return_element;
}

function default_submit_handler(data, target_modal) {
    if(target_modal && typeof target_modal.success === "function") {
        target_modal.success(
            {
                title: "Sucesso!",
                content: "Formulário enviado com sucesso!",
                actions: [
                    { label: "OK", variant: "primary", onClick: () => this.root_form.reset() },
                ],
            }
        );
    } else {
        console.log(`Data handled: ${form_data}`);
    }
}

function default_create_modal() {
    if(typeof Modal === "function") {
        Modal();
        return new Modal();
    } else {
        return null;
    }
}

export default Form_Validator;