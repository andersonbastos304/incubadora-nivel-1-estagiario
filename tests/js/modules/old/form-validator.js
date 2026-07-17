// ========================================
// FORM-VALIDATOR.JS - Validação de Formulários
// ========================================

class FormValidator {
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
		});
	}

	validateField(field) {
		const value = field.value.trim();
		let error = null;

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
}
