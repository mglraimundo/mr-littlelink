/**
 * CV Modal Handler
 * Handles CV modal open/close and accessibility
 */

(function() {
  'use strict';

  // DOM Elements
  let modal = null;
  let openButton = null;
  let closeButton = null;
  let backdrop = null;
  let focusedElementBeforeModal = null;

  /**
   * Initialize the modal and attach event listeners
   */
  function init() {
    // Get DOM elements
    modal = document.getElementById('cv-modal');
    openButton = document.getElementById('open-cv-modal');
    closeButton = modal?.querySelector('.modal-close');
    backdrop = modal?.querySelector('.modal-backdrop');

    // Verify all elements exist
    if (!modal || !openButton || !closeButton || !backdrop) {
      console.error('CV modal: Required elements not found');
      return;
    }

    // Attach event listeners
    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeyDown);
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

    // Focus close button
    setTimeout(() => closeButton.focus(), 100);
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
  }

  /**
   * Handle Escape key to close modal
   */
  function handleKeyDown(event) {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
