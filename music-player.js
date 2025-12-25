// Global Music Player - Shared across all pages
// This script maintains music playback across page navigation

(function () {
  const MUSIC_KEY = "noel_music_state";
  const MUSIC_SRC = "./music/lastxmas.mp3";

  console.log("[Music Player] Initializing...");

  // Get or create audio element
  let audio = document.getElementById("global-music");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "global-music";
    audio.loop = true;
    audio.volume = 0.3;
    audio.src = MUSIC_SRC;
    document.body.appendChild(audio);
    console.log("[Music Player] Audio element created");
  }

  // Restore music state from localStorage
  function restoreMusicState() {
    const state = localStorage.getItem(MUSIC_KEY);
    console.log("[Music Player] Restoring state:", state);

    if (state) {
      const { isPlaying, currentTime } = JSON.parse(state);
      audio.currentTime = currentTime || 0;
      if (isPlaying) {
        console.log("[Music Player] Attempting to resume playback...");
        audio
          .play()
          .then(() => console.log("[Music Player] Resumed successfully"))
          .catch((e) => {
            console.log(
              "[Music Player] Resume blocked, will play on click:",
              e.message
            );
            setupClickToPlay();
          });
      }
    } else {
      // First time - try to auto-play
      console.log("[Music Player] First visit, attempting auto-play...");
      audio
        .play()
        .then(() => {
          console.log("[Music Player] Auto-play successful!");
          saveMusicState();
        })
        .catch((e) => {
          console.log(
            "[Music Player] Auto-play blocked, setting up click-to-play:",
            e.message
          );
          setupClickToPlay();
        });
    }
  }

  // Setup click-to-play fallback
  function setupClickToPlay() {
    const startMusic = () => {
      console.log("[Music Player] User clicked, starting music...");
      audio
        .play()
        .then(() => {
          console.log("[Music Player] Music started successfully");
          saveMusicState();
        })
        .catch((e) => console.error("[Music Player] Failed to start:", e));
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
      document.removeEventListener("keydown", startMusic);
    };

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });
    console.log("[Music Player] Click-to-play listeners added");
  }

  // Save music state to localStorage
  function saveMusicState() {
    const state = {
      isPlaying: !audio.paused,
      currentTime: audio.currentTime,
    };
    localStorage.setItem(MUSIC_KEY, JSON.stringify(state));
  }

  // Save state periodically and before page unload
  setInterval(saveMusicState, 1000);
  window.addEventListener("beforeunload", saveMusicState);

  // Restore state when page loads
  restoreMusicState();

  // Create music control button
  function createMusicControl() {
    const btn = document.createElement("button");
    btn.id = "music-control";
    btn.innerHTML = "🔊";
    btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37, #f4d03f);
            border: 2px solid rgba(212, 175, 55, 0.5);
            color: #000;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
            transition: all 0.3s ease;
        `;

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.6)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 4px 15px rgba(212, 175, 55, 0.4)";
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering click-to-play
      if (audio.paused) {
        console.log("[Music Player] Button clicked: Playing");
        audio.play();
        btn.innerHTML = "🔊";
      } else {
        console.log("[Music Player] Button clicked: Pausing");
        audio.pause();
        btn.innerHTML = "🔇";
      }
      saveMusicState();
    });

    // Update button state
    audio.addEventListener("play", () => {
      btn.innerHTML = "🔊";
      console.log("[Music Player] Playing");
    });
    audio.addEventListener("pause", () => {
      btn.innerHTML = "🔇";
      console.log("[Music Player] Paused");
    });

    document.body.appendChild(btn);
    console.log("[Music Player] Control button created");
  }

  // Create control button when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createMusicControl);
  } else {
    createMusicControl();
  }

  // Expose global controls
  window.NoelMusic = {
    play: () => audio.play(),
    pause: () => audio.pause(),
    toggle: () => (audio.paused ? audio.play() : audio.pause()),
    setVolume: (v) => (audio.volume = Math.max(0, Math.min(1, v))),
  };

  console.log("[Music Player] Initialization complete");
})();
