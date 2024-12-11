# Malicious URL Detector

Malicious URL Detector is a browser extension designed to enhance your online security by detecting potentially harmful websites. It uses a backend API to analyze URLs and alerts users with a warning when malicious activity is detected.

---

## Features

- **Real-time Detection**: Automatically checks visited websites against a database of malicious URLs.
- **User Alerts**: Displays a warning modal for flagged websites, allowing users to proceed with caution or leave the site.
- **Lightweight and Efficient**: Minimal impact on browser performance.
- **Customizable Interface**: Intuitive popup with detailed status updates about the current tab's safety.

---

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/malicious-url-detector.git
   ```
2. Open your browser and go to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode."
4. Click **Load unpacked** and select the project folder.

---

## Usage

1. After installation, the extension icon will appear in the browser toolbar.
2. Navigate to any website, and the extension will automatically check its safety.
3. If a malicious URL is detected:
   - A warning badge (`⚠️`) will appear on the extension icon.
   - A modal will alert you with details about the website.
4. Use the extension popup to view the status of the current tab.

---

## Technologies Used

- **Frontend**: JavaScript (content scripts, popup interface).
- **Backend**: REST API hosted on Google Cloud Platform (GCP).
- **Browser APIs**: Chrome Extension APIs (e.g., `tabs`, `browserAction`).

---

## File Structure

```
malicious-url-detector/
├── manifest.json         # Extension configuration
├── background.js         # Handles URL checking and badge updates
├── content.js            # Injects modal into malicious websites
├── popup.js              # Logic for the extension's popup UI
├── popup.html            # HTML for the popup interface
├── Images/
│   └── icon.png          # Extension icon
```

---

## API Endpoint

The extension interacts with the following API:

- **URL**: `http://34.30.11.83:8000/process-url/`
- **Method**: GET
- **Query Parameters**:
  - `url`: The URL to analyze.

---

## Permissions

This extension requests the following permissions:

- `activeTab`, `tabs`: To analyze URLs and detect navigation events.
- `<all_urls>`: To monitor all visited websites for potential threats.

---

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## Contact

For questions or suggestions:

- **Email**: nnrajore@gmail.com
- **GitHub**: https://github.com/Armidess
