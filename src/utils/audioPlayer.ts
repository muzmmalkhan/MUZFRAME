// Audio player for MuzFrame Studio using HTML5 Audio for real preview playback
class StudioAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private playPromise: Promise<void> | null = null;
  private stopTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private activeSongId: string | null = null;
  private playbackToken = 0;

  public stop() {
    this.playbackToken += 1;

    if (this.stopTimeoutId) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    const audioToStop = this.audio;
    const pendingPlay = this.playPromise;

    this.audio = null;
    this.playPromise = null;
    this.activeSongId = null;

    if (!audioToStop) return;

    // Mute immediately so no audio leaks while an in-flight play() promise settles
    audioToStop.muted = true;
    audioToStop.onended = null;

    const finalizePause = () => {
      try {
        audioToStop.pause();
        audioToStop.currentTime = 0;
        audioToStop.removeAttribute('src');
        audioToStop.load();
      } catch {
        // Ignore teardown errors on already-disposed elements
      }
    };

    if (pendingPlay) {
      pendingPlay.then(finalizePause).catch(() => {
        try {
          audioToStop.removeAttribute('src');
        } catch {
          // Ignore
        }
      });
    } else {
      finalizePause();
    }
  }

  public playSong(songId: string, previewUrl?: string) {
    this.stop();
    if (!previewUrl) return;

    const token = ++this.playbackToken;
    this.activeSongId = songId;

    const audio = new Audio(previewUrl);
    audio.preload = 'auto';
    this.audio = audio;

    audio.onended = () => {
      if (token === this.playbackToken) {
        this.stop();
        window.dispatchEvent(new CustomEvent('audio-stopped', { detail: { songId } }));
      }
    };

    const playPromise = audio.play();
    this.playPromise = playPromise ?? null;

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Switching songs, pausing quickly, or unmounting cancels in-flight play() cleanly
        if (err?.name === 'AbortError' || token !== this.playbackToken) {
          return;
        }
        console.warn('Audio preview unavailable:', err?.message || err);
        if (token === this.playbackToken) {
          this.stop();
          window.dispatchEvent(new CustomEvent('audio-stopped', { detail: { songId } }));
        }
      });
    }

    // Stop automatically after 10 seconds
    this.stopTimeoutId = setTimeout(() => {
      if (token === this.playbackToken) {
        this.stop();
        window.dispatchEvent(new CustomEvent('audio-stopped', { detail: { songId } }));
      }
    }, 10000);
  }

  public isPlaying(songId: string): boolean {
    return this.activeSongId === songId;
  }
}

export const studioAudio = new StudioAudioEngine();
