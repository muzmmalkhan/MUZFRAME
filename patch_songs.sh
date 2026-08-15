#!/bin/bash

# Insert states
sed -i '93a\  const [draftSongIds, setDraftSongIds] = useState<string[] | null>(null);\n  const [draftNotes, setDraftNotes] = useState<string | null>(null);' src/pages/ClientDashboard.tsx

