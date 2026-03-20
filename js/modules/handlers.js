// ========================================
// HANDLERS.JS - Manipuladores de Eventos
// ========================================

function renderFeaturedProducts() {
	const container = document.getElementById("featuredProducts");
	if (!container) return;

	const featured = getFeaturedProducts();
	if (featured.length === 0) {
		container.innerHTML =
			'<p class="text-center">Nenhum produto em destaque.</p>';
		return;
	}

	container.innerHTML = featured.map((p) => createProductCard(p)).join("");
	initFavoriteButtons();
}

function initCartHandlers() {
	const cartBtn = document.querySelector("[data-cart-btn]");
	if (cartBtn) {
		cartBtn.addEventListener("click", (e) => {
			e.preventDefault();
			window.modalSystem.info({
				title: "Carrinho de Compras",
				content:
					'<p class="modal__text">Seu carrinho está vazio.<br>Adicione produtos para começar!</p>',
				actions: [
					{
						label: "Continuar Comprando",
						variant: "primary",
						onClick: () => (window.location.href = "products.html"),
					},
				],
			});
		});
	}

	document.addEventListener("click", (e) => {
		if (e.target.closest("[data-add-cart]")) {
			e.preventDefault();
			const btn = e.target.closest("[data-add-cart]");
			const productName = btn.dataset.productName;

			btn.disabled = true;
			const originalText = btn.innerHTML;
			btn.innerHTML = "Adicionado!";

			setTimeout(() => {
				btn.disabled = false;
				btn.innerHTML = originalText;
			}, 1500);

			window.modalSystem.success({
				title: "Produto Adicionado!",
				content: `<p class="modal__text"><strong>${productName || "Produto"}</strong> foi adicionado ao carrinho!</p>`,
				actions: [
					{ label: "Continuar Comprando", variant: "ghost", onClick: () => {} },
					{ label: "Ver Carrinho", variant: "primary", onClick: () => {} },
				],
			});
		}
	});
}

function initLoginHandler() {
	const loginBtn = document.querySelector("[data-login-btn]");
	if (!loginBtn) return;

	loginBtn.addEventListener("click", (e) => {
		e.preventDefault();
		loginHandler()
	});
}

function loginHandler() {
	const loginForm = `
      <form class="form" id="loginForm">
        <div class="form__group">
          <label class="form__label form__label--required" for="email">E-mail</label>
          <input type="email" id="email" name="email" class="form__input" placeholder="seu@email.com" required>
        </div>
        <div class="form__group">
          <label class="form__label form__label--required" for="password">Senha</label>
          <input type="password" id="password" name="password" class="form__input" placeholder="••••••••" required minlength="6">
        </div>
        <div class="form__group">
          <div class="form__checkbox">
            <input type="checkbox" id="remember" name="remember">
            <label class="form__checkbox-label" for="remember">Lembrar-me</label>
          </div>
        </div>
      </form>
    `;

	window.modalSystem.create({
		title: "Login",
		content: loginForm,
		actions: [
			{ label: "Cadastrar",
				variant: "ghost",
				onClick: () => registerHandler()
			},
			{ label: "Cancelar", variant: "ghost", onClick: () => {} },
			{
				label: "Entrar",
				variant: "primary",
				onClick: () => {
					const form = document.getElementById("loginForm");
					const validator = new FormValidator(form);
					if (validator.validateAll()) {
						window.modalSystem.success({
							title: "Login realizado!",
							content: '<p class="modal__text">Bem-vindo de volta!</p>',
							actions: [
								{ label: "OK", variant: "primary", onClick: () => {} },
							],
						});
					} else {
						form.querySelector(".form__input--error")?.focus();
						throw new Error("Invalid form data! User must correct the fields before sending again!");
					}
				},
			},
		],
	});

	setTimeout(() => {
		const form = document.getElementById("loginForm");
		if (form) new FormValidator(form);
	}, 100);
}

function registerHandler() {
	const registerForm = `
	  <form class="form" id="registerForm" method="post">
		<div class="form__group">
		  <label class="form__label form__label--required" for="name">Nome completo</label>
		  <input type="text" id="name" name="name" class="form__input" placeholder="Nome e sobrenome" required>
		</div>
		<div class="form__group">
		  <label class="form__label form__label--required" for="email">E-mail</label>
		  <input type="email" id="email" name="email" class="form__input" placeholder="seu@email.com" required>
		</div>
		<div class="form__group">
		  <label class="form__label form__label--required" for="emailConfirm">Confirme o e-mail</label>
		  <input type="email" id="emailConfirm" name="emailConfirm" data-confirm-for="email" class="form__input" placeholder="seu@email.com" required>
		</div>
		<div class="form__group">
		  <label class="form__label form__label--required" for="password">Senha</label>
		  <input type="password" id="password" name="password" class="form__input" placeholder="••••••••" required minlength="6">
		</div>
		<div class="form__group">
		  <label class="form__label form__label--required" for="passwordConfirm">Confirme a senha</label>
		  <input type="password" id="passwordConfirm" name="passwordConfirm" data-confirm-for="password" class="form__input" placeholder="••••••••" required minlength="6">
		</div>
		<div class="form__group">
		  <label class="form__label" for="phone">Telefone</label>
		  <input type="text" id="phone" name="phone" class="form__input" data-is-phone="true" placeholder="(99)99999-9999" maxlength="14">
		</div>
		<div class="form__group">
		  <div class="form__checkbox">
		  	<input type="checkbox" id="agreement" name="agreement" value="agree">
		  	<label class="form__checkbox-label" for="agreement">Aceito os termos de uso do site</label>
		  </div>
		</div>
	  </form>
	`;

	window.modalSystem.create({
		title: "Novo Cadastro",
		content: registerForm,
		size: "lg",
		actions: [
			{ 
				label: "Cancelar",
				variant: "ghost",
				onClick: () => loginHandler(),
			},
			{
				label: "Cadastrar",
				variant: "primary",
				onClick: () => {
					const form = document.getElementById("registerForm");
					const validator = new FormValidator(form);
					if (validator.validateAll()) {
						window.modalSystem.success({
							title: "Cadastro realizado!",
							content: '<p class="modal__text">Novo cadastro realizado!</p>',
							actions: [
								{ label: "OK", variant: "primary", onClick: () => {} },
							],
						});
					} else {
						form.querySelector(".form__input--error")?.focus();
						throw new Error("Invalid form data! User must correct the fields before sending again!");
					}
				},
			},
		],
	});

	setTimeout(() => {
		const form = document.getElementById("registerForm");
		if (form) new FormValidator(form);
	}, 100);
}

function newsletterHandler(data) {
	const registerForm = `
	  <p class="modal__text">Novo cadastro para newsletter realizado!</p>
	`;

	window.modalSystem.create({
		title: "Newsletter",
		content: registerForm,
		size: "md",
		actions: [
			{ 
				label: "Ok",
				variant: "primary",
				onClick: () => {},
			},
		],
	});
}