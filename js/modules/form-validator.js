// ========================================
// FORM-VALIDATOR.JS - Validação de Formulários
// ========================================

class FormValidator {

	#needsConfirmForRevalidation = {};

	constructor(form) {
		this.form = typeof form === "string" ? document.querySelector(form) : form;
		if (!this.form) return;
		this.errors = {};
		this.init();
	}

	init() {
		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			this.handleSubmit();
		});

		this.form.querySelectorAll("input, textarea, select").forEach((input) => {
			input.addEventListener("blur", () => this.validateField(input));
			input.addEventListener("input", () => this.clearFieldError(input));
			if (input.hasAttribute("data-confirm-for")) {
				const target = document.getElementById(input.dataset.confirmFor);
				this.#needsConfirmForRevalidation[target.id] = input.id;
			}
			if (input.hasAttribute("data-is-phone")) {
				input.addEventListener("input", (event) => this.maskPhone(event));
			}
		});
	}

	validateField(field) {
		const value = field.value.trim();
		let error = null;

		if (this.#needsConfirmForRevalidation[field.id]) {
			const source = document.getElementById(this.#needsConfirmForRevalidation[field.id]);
			if(source?.value !== value) {
				error = "Campos com valores diferentes";
				this.showFieldError(source, error);	
			} else {
				this.clearFieldError(source);
			}
		}

		if (field.hasAttribute("required") && !value) {
			error = "Este campo é obrigatório";
		} else if (
			field.type === "email" &&
			value &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
		) {
			error = "E-mail inválido";
		} else if (
			field.hasAttribute("minlength") &&
			value &&
			value.length < parseInt(field.getAttribute("minlength"))
		) {
			error = `Mínimo de ${field.getAttribute("minlength")} caracteres`;
		} else if (
			field?.name === "agreement" &&
			field?.checked !== true
		) {
			error = "É obrigatório aceitar os termos de uso do site";
		} else if (field.hasAttribute("data-confirm-for")) {
			const target = document.getElementById(field.dataset.confirmFor);
			if(target?.value !== value) {
				error = "Campos com valores diferentes";
				this.showFieldError(target, error);	
			} else {
				this.clearFieldError(target);
			}
		} else if (
			field.hasAttribute("data-is-phone") &&
			value &&
			!/^\([0-9]{2}\)[0-9]{4,5}-[0-9]{4}$/.test(value)
		) {
			error = "Telefone inválido";
		}

		if (error) {
			this.showFieldError(field, error);
			return false;
		} else {
			this.clearFieldError(field);
			return true;
		}
	}

	showFieldError(field, message) {
		field.classList.add("form__input--error");
		let errorEl = field.parentElement.querySelector(".form__error");
		if (!errorEl) {
			errorEl = document.createElement("span");
			errorEl.className = "form__error";
			errorEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span>${message}</span>`;
			field.parentElement.appendChild(errorEl);
		} else {
			errorEl.querySelector("span").textContent = message;
		}
	}

	clearFieldError(field) {
		field.classList.remove("form__input--error");
		const errorEl = field.parentElement.querySelector(".form__error");
		if (errorEl) errorEl.remove();
	}

	validateAll() {
		let isValid = true;
		this.form.querySelectorAll("input, textarea, select").forEach((input) => {
			if (!this.validateField(input)) isValid = false;
		});
		return isValid;
	}

	getData() {
		const formData = new FormData(this.form);
		const data = {};
		formData.forEach((value, key) => {
			data[key] = value;
		});
		return data;
	}

	async handleSubmit() {
		if (!this.validateAll()) {
			this.form.querySelector(".form__input--error")?.focus();
			return;
		}

		const data = this.getData();
		if (typeof this.onSubmit === "function") {
			await this.onSubmit(data);
		} else {
			window.modalSystem.success({
				title: "Sucesso!",
				content: "Formulário enviado com sucesso!",
				actions: [
					{ label: "OK", variant: "primary", onClick: () => this.form.reset() },
				],
			});
		}
	}

	maskPhone(inputEvent) {
		const target = inputEvent.target;
		const newDataValue = target.value.substring(0, 14).replace(/[^0-9]/g, "");
		let newValue = "";
		switch(newDataValue.length) {
			case 11:
				newValue = `(${newDataValue.substring(0, 2)})${newDataValue.substring(2, 7)}-${newDataValue.substring(7, 11)}`;
				break;
			case 10:
			case 9:
			case 8:
			case 7:
				newValue = `-${newDataValue.substring(6, 10) + newValue}`;
			case 6:
			case 5:
			case 4:
			case 3:
				newValue = `)${newDataValue.substring(2, 6) + newValue}`;
			case 2:
			case 1:
				newValue = `(${newDataValue.substring(0, 2) + newValue}`;
				break;
			default:
				//Do nothing
		}
		target.value = newValue;
	}
}
