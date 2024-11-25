document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      const currentUrl = tabs[0].url;
      const statusDiv = document.getElementById('status');
      
      try {
        const response = await fetch(`http://34.30.11.83:8000/process-url/?url=${encodeURIComponent(currentUrl)}`);
        const data = await response.json();
        
        if (data.result === true) {
          statusDiv.className = 'status danger';
          statusDiv.innerHTML = `
            <strong>Warning!</strong>
            <p>This URL has been detected as potentially malicious.</p>
            <p>URL: ${currentUrl}</p>
          `;
        } else {
          statusDiv.className = 'status safe';
          statusDiv.innerHTML = `
            <strong>Safe!</strong>
            <p>This URL appears to be safe.</p>
          `;
        }
      } catch (error) {
        statusDiv.innerHTML = `Error checking URL: ${error.message}`;
      }
    });
  });