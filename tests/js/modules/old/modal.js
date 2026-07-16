// ========================================
// MODAL.JS - Sistema de Modais
// ========================================

class Modal {
	constructor() {
		this.modals = new Map();
		this.init();
	}

	init() {
		document.addEventListener("click", (e) => {
			if (
				e.target.classList.contains("modal__close") ||
				e.target.closest(".modal__close")
			) {
				const backdrop = e.target.closest(".modal-backdrop");
				if (backdrop) this.close(backdrop.dataset.modalId);
			}
			if (e.target.classList.contains("modal-backdrop")) {
				this.close(e.target.dataset.modalId);
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") this.closeAll();
		});
	}

	create(options = {}) {
		const {
			id = `modal-${Date.now()}`,
			title = "",
			content = "",
			size = "md",
			actions = [],
			icon = null,
			iconType = null,
		} = options;

		if (this.modals.has(id)) this.close(id);

		const backdrop = document.createElement("div");
		backdrop.className = "modal-backdrop";
		backdrop.dataset.modalId = id;

		let iconHTML = "";
		if (icon) {
			iconHTML = `<div class="modal__icon ${iconType ? `modal__icon--${iconType}` : ""}">${icon}</div>`;
		}

		backdrop.innerHTML = `
      <div class="modal modal--${size}">
        ${
					title
						? `
          <div class="modal__header">
            <h3 class="modal__title">${title}</h3>
            <button class="modal__close" aria-label="Fechar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `
						: ""
				}
        <div class="modal__body">${iconHTML}${content}</div>
        ${
					actions.length
						? `
          <div class="modal__footer">
            ${actions.map((a) => `<button class="btn btn-${a.variant || "primary"}" data-action="${a.label}">${a.label}</button>`).join("")}
          </div>
        `
						: ""
				}
      </div>
    `;

		document.body.appendChild(backdrop);

		actions.forEach((action) => {
			const btn = backdrop.querySelector(`[data-action="${action.label}"]`);
			if (btn && action.onClick) {
				btn.addEventListener("click", () => {
					action.onClick();
					this.close(id);
				});
			}
		});

		this.modals.set(id, { element: backdrop });

		setTimeout(() => {
			backdrop.classList.add("active");
			document.body.classList.add("modal-open");
		}, 10);

		return id;
	}

	close(id) {
		const modal = this.modals.get(id);
		if (!modal) return;

		modal.element.classList.remove("active");
		setTimeout(() => {
			modal.element.remove();
			this.modals.delete(id);
			if (this.modals.size === 0) {
				document.body.classList.remove("modal-open");
			}
		}, 300);
	}

	closeAll() {
		this.modals.forEach((_, id) => this.close(id));
	}

	success(options = {}) {
		return this.create({
			...options,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
			iconType: "success",
			content: options.content || "Operação realizada com sucesso!",
		});
	}

	error(options = {}) {
		return this.create({
			...options,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
			iconType: "error",
			content: options.content || "Ocorreu um erro. Tente novamente.",
		});
	}

	info(options = {}) {
		return this.create({
			...options,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
			iconType: "info",
			content: options.content || "Informação importante.",
		});
	}
}

module.exports = Modal;