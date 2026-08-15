// Audio player for MuzFrame Studio using HTML5 Audio for real MP3 playback
class StudioAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private stopTimeoutId: any = null;
  private activeSongId: string | null = null;

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    if (this.stopTimeoutId) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }
    this.activeSongId = null;
  }

  public playSong(songId: string, previewUrl?: string) {
    this.stop();
    if (!previewUrl) return;

    this.activeSongId = songId;
    this.audio = new Audio(previewUrl);
    
    // Play the real audio track
    this.audio.play().catch(e => console.error("Audio playback failed:", e));

    // Stop automatically after 10 seconds (per user requirement)
    this.stopTimeoutId = setTimeout(() => {
      this.stop();
      // Dispatch a custom event to notify React components that playback stopped
      window.dispatchEvent(new CustomEvent('audio-stopped', { detail: { songId } }));
    }, 10000);
  }

  public isPlaying(songId: string): boolean {
    return this.activeSongId === songId;
  }
}

export const studioAudio = new StudioAudioEngine();

