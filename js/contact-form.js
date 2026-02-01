/**
 * Contact Form Modal Handler
 * Handles modal open/close, form validation, and Web3Forms submission
 */

(function() {
	'use strict';

	// DOM Elements
	let modal = null;
	let openButton = null;
	let closeButton = null;
	let backdrop = null;
	let form = null;
	let submitButton = null;
	let statusContainer = null;
	let focusedElementBeforeModal = null;

	// Focusable elements selector
	const FOCUSABLE_ELEMENTS = 'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), button:not([disabled])';

	/**
	 * Initialize the modal and attach event listeners
	 */
	function init() {
		// Get DOM elements
		modal = document.getElementById('contact-modal');
		openButton = document.getElementById('open-contact-modal');
		closeButton = modal?.querySelector('.modal-close');
		backdrop = modal?.querySelector('.modal-backdrop');
		form = document.getElementById('contact-form');
		submitButton = form?.querySelector('.submit-button');
		statusContainer = form?.querySelector('.form-status');

		// Verify all elements exist
		if (!modal || !openButton || !closeButton || !backdrop || !form || !submitButton || !statusContainer) {
			console.error('Contact modal: Required elements not found');
			return;
		}

		// Attach event listeners
		openButton.addEventListener('click', openModal);
		closeButton.addEventListener('click', closeModal);
		backdrop.addEventListener('click', closeModal);
		document.addEventListener('keydown', handleKeyDown);
		form.addEventListener('submit', handleSubmit);
	}

	/**
	 * Open the modal
	 */
	function openModal() {
		// Save current focus
		focusedElementBeforeModal = document.activeElement;

		// Show modal
		modal.classList.add('active');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');

		// Focus first input field
		const firstInput = form.querySelector(FOCUSABLE_ELEMENTS);
		if (firstInput) {
			setTimeout(() => firstInput.focus(), 100);
		}

		// Setup focus trap
		modal.addEventListener('keydown', trapFocus);
	}

	/**
	 * Close the modal
	 */
	function closeModal() {
		// Hide modal
		modal.classList.remove('active');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');

		// Restore focus
		if (focusedElementBeforeModal) {
			focusedElementBeforeModal.focus();
		}

		// Remove focus trap
		modal.removeEventListener('keydown', trapFocus);

		// Reset form after animation completes
		setTimeout(() => {
			form.reset();
			clearErrors();
			hideStatus();
		}, 300);
	}

	/**
	 * Handle Escape key to close modal
	 */
	function handleKeyDown(event) {
		if (event.key === 'Escape' && modal.classList.contains('active')) {
			closeModal();
		}
	}

	/**
	 * Trap focus inside modal
	 */
	function trapFocus(event) {
		if (event.key !== 'Tab') return;

		const focusableElements = Array.from(modal.querySelectorAll(FOCUSABLE_ELEMENTS));
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Shift + Tab (backward)
		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		}
		// Tab (forward)
		else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}

	/**
	 * Validate form fields
	 * Returns true if valid, false otherwise
	 */
	function validateForm() {
		let isValid = true;
		clearErrors();

		// Get field values
		const name = form.querySelector('#contact-name').value.trim();
		const email = form.querySelector('#contact-email').value.trim();
		const message = form.querySelector('#contact-message').value.trim();

		// Validate name
		if (!name) {
			showError('contact-name', 'O nome é obrigatório');
			isValid = false;
		}

		// Validate email
		if (!email) {
			showError('contact-email', 'O email é obrigatório');
			isValid = false;
		} else if (!isValidEmail(email)) {
			showError('contact-email', 'Por favor introduza um endereço de email válido');
			isValid = false;
		}

		// Validate message
		if (!message) {
			showError('contact-message', 'A mensagem é obrigatória');
			isValid = false;
		}

		return isValid;
	}

	/**
	 * Check if email format is valid
	 */
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Show error message for a field
	 */
	function showError(fieldId, message) {
		const field = form.querySelector(`#${fieldId}`);
		const formGroup = field.closest('.form-group');
		const errorElement = formGroup.querySelector('.error-message');

		formGroup.classList.add('error');
		field.setAttribute('aria-invalid', 'true');
		errorElement.textContent = message;
	}

	/**
	 * Clear all error messages
	 */
	function clearErrors() {
		const errorGroups = form.querySelectorAll('.form-group.error');
		errorGroups.forEach(group => {
			group.classList.remove('error');
			const input = group.querySelector('input, textarea');
			if (input) {
				input.removeAttribute('aria-invalid');
			}
			const errorMessage = group.querySelector('.error-message');
			if (errorMessage) {
				errorMessage.textContent = '';
			}
		});
	}

	/**
	 * Handle form submission
	 */
	async function handleSubmit(event) {
		event.preventDefault();

		// Validate form
		if (!validateForm()) {
			return;
		}

		// Set loading state
		setLoadingState(true);
		hideStatus();

		try {
			// Prepare form data
			const formData = new FormData(form);

			// Submit to Web3Forms
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			// Handle response
			if (data.success) {
				showStatus('success', 'Mensagem enviada com sucesso! Obrigado por entrar em contacto.');
				// Auto-close modal after 2 seconds
				setTimeout(() => {
					closeModal();
				}, 2000);
			} else {
				showStatus('error', data.message || 'Falha ao enviar mensagem. Por favor tente novamente.');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			showStatus('error', 'Erro de rede. Por favor verifique a sua ligação e tente novamente.');
		} finally {
			setLoadingState(false);
		}
	}

	/**
	 * Set loading state on submit button
	 */
	function setLoadingState(isLoading) {
		if (isLoading) {
			submitButton.classList.add('loading');
			submitButton.disabled = true;
		} else {
			submitButton.classList.remove('loading');
			submitButton.disabled = false;
		}
	}

	/**
	 * Show status message
	 */
	function showStatus(type, message) {
		statusContainer.className = 'form-status visible ' + type;
		statusContainer.textContent = message;
	}

	/**
	 * Hide status message
	 */
	function hideStatus() {
		statusContainer.className = 'form-status';
		statusContainer.textContent = '';
	}

	/**
	 * Update copyright year in footer
	 */
	function updateCopyrightYear() {
		const yearElement = document.getElementById('current-year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear();
		}
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			init();
			updateCopyrightYear();
		});
	} else {
		init();
		updateCopyrightYear();
	}
})();
