let checkedUrls = new Set();

async function checkURL(url, tabId) {
  if (checkedUrls.has(url)) return;
  
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || !url.startsWith('http')) {
    return;
  }

  try {
    console.log('Checking URL:', url);
    
    const response = await fetch(`http://34.30.11.83:8000/process-url/?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    console.log('API Response:', data);
    
    if (data.result === true) {
      // First ensure content script is properly injected
      await ensureContentScriptInjected(tabId);
      
      // Set badge
      chrome.browserAction.setBadgeText({ text: "⚠️", tabId: tabId });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000", tabId: tabId });
      
      // Try both methods to show modal
      showModalWithRetry(tabId, url);
    } else {
      chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
    }

    checkedUrls.add(url);
    setTimeout(() => checkedUrls.delete(url), 5 * 60 * 1000);

  } catch (error) {
    console.error('Error checking URL:', error);
  }
}

// Function to ensure content script is injected
async function ensureContentScriptInjected(tabId) {
  try {
    await chrome.tabs.executeScript(tabId, { file: 'content.js' });
    console.log('Content script injected successfully');
  } catch (e) {
    console.log('Content script already exists or injection failed:', e);
  }
}

// Function to show modal with retry mechanism
function showModalWithRetry(tabId, url, retries = 3) {
  // First attempt: Use messaging
  chrome.tabs.sendMessage(tabId, { action: 'showModal', url: url }, (response) => {
    if (chrome.runtime.lastError || !response) {
      console.log('First attempt failed, trying direct injection');
      
      // Second attempt: Direct injection
      chrome.tabs.executeScript(tabId, {
        code: `
          if (typeof showMaliciousModal === 'function') {
            showMaliciousModal('${url.replace(/'/g, "\\'")}');
          } else {
            // If function doesn't exist, inject it
            const script = document.createElement('script');
            script.textContent = \`
              function showMaliciousModal(url) {
                if (document.getElementById('maliciousModal')) return;
                
                const modalContainer = document.createElement('div');
                modalContainer.id = 'maliciousModal';
                modalContainer.className = 'malicious-modal-overlay';
                modalContainer.innerHTML = \\\`
                  <div class="malicious-modal">
                    <div class="malicious-modal-header">
                      <span class="warning-icon">⚠️</span>
                      <h2>Security Warning</h2>
                    </div>
                    <div class="malicious-modal-content">
                      <p>This website has been detected as potentially malicious:</p>
                      <div class="malicious-url">\\\${url}</div>
                      <p>Are you sure you want to continue?</p>
                    </div>
                    <div class="malicious-modal-buttons">
                      <button class="modal-btn leave-btn" id="leaveButton">Leave Site</button>
                      <button class="modal-btn continue-btn" id="continueButton">Continue Anyway</button>
                    </div>
                  </div>
                \\\`;
                
                document.body.appendChild(modalContainer);
                
                document.getElementById('continueButton').addEventListener('click', () => {
                  modalContainer.remove();
                });
                
                document.getElementById('leaveButton').addEventListener('click', () => {
                  window.location.href = 'about:blank';
                });
              }
            \`;
            document.head.appendChild(script);
            showMaliciousModal('${url.replace(/'/g, "\\'")}');
          }
        `
      }, () => {
        if (chrome.runtime.lastError && retries > 0) {
          console.log(`Retry attempt left: ${retries-1}`);
          setTimeout(() => showModalWithRetry(tabId, url, retries-1), 1000);
        }
      });
    }
  });
}

// Event listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('Tab updated:', { tabId, changeInfo, tab });
  if ((changeInfo.status === 'loading' || changeInfo.status === 'complete') && tab.url) {
    checkURL(tab.url, tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      checkURL(tab.url, tab.id);
    }
  });
});