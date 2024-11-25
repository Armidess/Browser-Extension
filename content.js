console.log('Content script loaded');

function showMaliciousModal(url) {
  console.log('Showing modal for URL:', url);
  
  // Check if modal already exists
  if (document.getElementById('maliciousModal')) {
    console.log('Modal already exists');
    return;
  }

  // Inject CSS if not already present
  if (!document.getElementById('maliciousModalStyles')) {
    const styles = document.createElement('style');
    styles.id = 'maliciousModalStyles';
    styles.textContent = `
      .malicious-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 2147483647;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .malicious-modal {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 2147483647;
      }

      .malicious-modal-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .malicious-modal-header h2 {
        color: #dc3545;
        margin: 0;
        font-size: 24px;
      }

      .warning-icon {
        color: #dc3545;
        font-size: 24px;
        margin-right: 10px;
      }

      .malicious-url {
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        word-break: break-all;
        margin: 10px 0;
        font-family: monospace;
        border: 1px solid #dee2e6;
      }

      .malicious-modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }

      .modal-btn {
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        border: none;
        transition: all 0.2s;
      }

      .continue-btn {
        background-color: #dc3545;
        color: white;
      }

      .continue-btn:hover {
        background-color: #c82333;
      }

      .leave-btn {
        background-color: #6c757d;
        color: white;
      }

      .leave-btn:hover {
        background-color: #5a6268;
      }
    `;
    document.head.appendChild(styles);
  }

  const modalContainer = document.createElement('div');
  modalContainer.id = 'maliciousModal';
  modalContainer.className = 'malicious-modal-overlay';
  
  modalContainer.innerHTML = `
    <div class="malicious-modal">
      <div class="malicious-modal-header">
        <span class="warning-icon">⚠️</span>
        <h2>Security Warning</h2>
      </div>
      <div class="malicious-modal-content">
        <p>This website has been detected as potentially malicious:</p>
        <div class="malicious-url">${url}</div>
        <p>Are you sure you want to continue?</p>
      </div>
      <div class="malicious-modal-buttons">
        <button class="modal-btn leave-btn" id="leaveButton">Leave Site</button>
        <button class="modal-btn continue-btn" id="continueButton">Continue Anyway</button>
      </div>
    </div>
  `;

  // Ensure body exists before appending
  if (document.body) {
    document.body.appendChild(modalContainer);
  } else {
    // If body doesn't exist yet, wait for it
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(modalContainer);
    });
  }

  // Add event listeners
  modalContainer.querySelector('#continueButton').addEventListener('click', () => {
    modalContainer.remove();
  });

  modalContainer.querySelector('#leaveButton').addEventListener('click', () => {
    window.location.href = 'about:blank';
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  if (request.action === 'showModal') {
    showMaliciousModal(request.url);
    sendResponse({ success: true });
  }
  return true; // Important for async response
});