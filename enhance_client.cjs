const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf-8');

const targetDownload = `  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      for (let i = 0; i < MY_IMAGES.length; i++) {
        await handleDownload(MY_IMAGES[i], \`event-image-\${i + 1}.jpg\`);
      }
    } catch (error) {
      console.error('Error downloading all images', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };`;

const replacementDownload = `  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      // Powerful logic: Parallel downloading for massive speed improvements
      const downloadPromises = MY_IMAGES.map((url, i) => handleDownload(url, \`event-image-\${i + 1}.jpg\`));
      await Promise.all(downloadPromises);
    } catch (error) {
      console.error('Error downloading all images', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };`;

if (code.includes(targetDownload)) {
  code = code.replace(targetDownload, replacementDownload);
  fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
  console.log("Client Dashboard Enhanced");
} else {
  console.log("Could not find target string in ClientDashboard");
}
