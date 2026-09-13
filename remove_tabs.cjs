const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

// Update activeTab state
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'gallery' | 'overview' | 'songs' | 'security' | 'booking'>('gallery');",
  "const [activeTab, setActiveTab] = useState<'songs' | 'security' | 'booking'>('booking');"
);

// We need to carefully remove the buttons and content.
const removeSection = (startStr, endStr) => {
  const start = code.indexOf(startStr);
  if (start !== -1) {
    const end = code.indexOf(endStr, start);
    if (end !== -1) {
      code = code.substring(0, start) + code.substring(end + endStr.length);
    }
  }
}

// 1. Remove Gallery button
const galleryBtnStart = '<button \n              onClick={() => setActiveTab(\'gallery\')}';
const galleryBtnEnd = '</button>\n            <button \n              onClick={() => setActiveTab(\'booking\')}';
if (code.includes(galleryBtnStart)) {
  const s = code.indexOf(galleryBtnStart);
  const e = code.indexOf('</button>', s) + '</button>'.length;
  code = code.substring(0, s) + code.substring(e);
}

// 2. Remove Overview button
const overviewBtnStart = '<button \n              onClick={() => setActiveTab(\'overview\')}';
if (code.includes(overviewBtnStart)) {
  const s = code.indexOf(overviewBtnStart);
  const e = code.indexOf('</button>', s) + '</button>'.length;
  code = code.substring(0, s) + code.substring(e);
}

// 3. Remove Gallery Content
const galleryContentStart = '{/* Tab 1: Gallery */}';
const galleryContentEnd = ')}';
if (code.includes(galleryContentStart)) {
  const s = code.indexOf(galleryContentStart);
  const nextTabStart = code.indexOf('{/* Tab 2: Event Details & Timeline */}');
  if (nextTabStart !== -1) {
    code = code.substring(0, s) + code.substring(nextTabStart);
  }
}

// 4. Remove Overview Content
const overviewContentStart = '{/* Tab 2: Event Details & Timeline */}';
if (code.includes(overviewContentStart)) {
  const s = code.indexOf(overviewContentStart);
  const nextTabStart = code.indexOf('{/* Tab 3: Song Selection & Playlist */}');
  if (nextTabStart !== -1) {
    code = code.substring(0, s) + code.substring(nextTabStart);
  }
}

fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
console.log("Removed gallery and overview tabs from ClientDashboard.tsx");
