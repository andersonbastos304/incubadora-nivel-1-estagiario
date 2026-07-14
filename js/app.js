// ========================================
// APP.JS - Aplicação Principal (Simplificado)
// ========================================

/**
 * Inicializa toda a aplicação
 */
async function init() {
	let Modal = await import("./modules/Modal.mjs").then((data) => {return data["default"]});

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
		new FormValidator(form);
	});
}

// Inicia quando DOM está pronto
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
