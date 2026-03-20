// ========================================
// APP.JS - Aplicação Principal (Simplificado)
// ========================================

/**
 * Inicializa toda a aplicação
 */
function init() {
	console.log("🚀 E-commerce iniciado");

	// Sistemas globais
	window.modalSystem = new Modal();
	window.navigation = new Navigation();

	// Inicialização por página
	if (document.getElementById("featuredProducts")) {
		renderFeaturedProducts();
	}

	if (document.getElementById("productsGrid")) {
		window.productsGallery = new ProductsGallery();
	}

	// Inicializa manipuladores
	initCartHandlers();
	initLoginHandler();

	// Auto-inicializa formulários com atributo data-validate
	document.querySelectorAll("form[data-validate]").forEach((form) => {
		const formValidator = new FormValidator(form);
		if(form.id === "newsletterForm") {
			formValidator.onSubmit = newsletterHandler;
		}
	});
}

// Inicia quando DOM está pronto
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
