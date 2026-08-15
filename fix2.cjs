const fs = require('fs');
let code = fs.readFileSync('src/pages/ClientDashboard.tsx', 'utf8');

const replacement = `
  const currentSongIds = draftSongIds !== null ? draftSongIds : (playlistData?.songIds || []);

  const handleToggleSong = (songId: string, title?: string) => {
    if (playlistData?.status === "Submitted & Locked") return;
    const isSelected = currentSongIds.includes(songId);
    const newIds = isSelected ? currentSongIds.filter((id: string) => id !== songId) : [...currentSongIds, songId];
    setDraftSongIds(newIds);
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSongName.trim() || playlistData?.status === "Submitted & Locked") return;
    
    const newSongId = \`CUSTOM-\${Date.now()}\`;
    const newIds = [...currentSongIds, newSongId];
    
    const currentNotes = draftNotes !== null ? draftNotes : (playlistData?.notes || "");
    const newNotes = currentNotes + (currentNotes ? "\\n" : "") + \`Custom Song: \${customSongName} (For: \${customEventName})\`;
    
    setDraftSongIds(newIds);
    setDraftNotes(newNotes);
    setCustomSongName("");
    setCustomEventName("");
  };

  const handleSubmitSelections = async () => {
    if (playlistData?.status === "Submitted & Locked") return;
    
    const finalSongIds = draftSongIds !== null ? draftSongIds : (playlistData?.songIds || []);
    const finalNotes = draftNotes !== null ? draftNotes : (playlistData?.notes || "");
    
    const updatedPlaylist = {
      id: playlistData?.id || clientData?.id || user?.id,
      clientId: clientData?.id || user?.id,
      clientName: clientData?.name || user?.name || user?.email,
      songIds: finalSongIds,
      status: playlistData?.status || "Draft",
      notes: finalNotes
    };
    
    setPlaylistData(updatedPlaylist);
    setDraftSongIds(null);
    setDraftNotes(null);
    
    await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPlaylist)
    });
    
    const adminPhone = "923006103262";
    const message = \`*Song Selections Submitted*\\nClient: \${clientData?.name || user?.name}\\nEmail: \${user?.email}\\nTotal Selected: \${finalSongIds.length}\\n\${finalNotes ? 'Includes custom requests.' : ''}\`;
    window.open(\`https://wa.me/\${adminPhone}?text=\${encodeURIComponent(message)}\`, "_blank");
  };
`;

const startIndex = code.indexOf('const handleToggleSong = async');
const endStr = 'window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, "_blank");\n  };';
const endIndex = code.indexOf(endStr, code.indexOf('const handleAddCustomSong = async')) + endStr.length;

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/pages/ClientDashboard.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find bounds", startIndex, endIndex);
}
