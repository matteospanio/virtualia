// Audio Player State
let audioPlayer;
let currentTrackIndex = 0;
let playlist = [];
let isLooping = false;
let isDragging = false;

// DOM Elements
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loopBtn = document.getElementById('loopBtn');
const progressBar = document.getElementById('progressBar');
const progressFilled = document.getElementById('progressFilled');
const progressHandle = document.getElementById('progressHandle');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const playlistElement = document.getElementById('playlist');

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('audioPlayer');
    initializePlayer();
    loadPlaylist();
    setupEventListeners();
});

// Initialize player
function initializePlayer() {
    // Audio event listeners
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('error', handleError);
}

// Load playlist from JSON file
async function loadPlaylist() {
    try {
        const response = await fetch('playlist.json');
        playlist = await response.json();
        renderPlaylist();
        
        // Load first track by default (but don't play)
        if (playlist.length > 0) {
            loadTrack(0);
        }
    } catch (error) {
        console.error('Error loading playlist:', error);
        trackTitle.textContent = 'Error loading playlist';
        trackArtist.textContent = 'Please check playlist.json file';
    }
}

// Render playlist items
function renderPlaylist() {
    playlistElement.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentTrackIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="playlist-item-title">${track.title}</div>
            <div class="playlist-item-artist">${track.artist}</div>
        `;
        
        item.addEventListener('click', () => {
            loadTrack(index);
            playTrack();
        });
        
        playlistElement.appendChild(item);
    });
}

// Load a specific track
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    
    // Update audio source
    audioPlayer.src = track.url;
    
    // Update track info
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Update playlist UI
    updatePlaylistUI();
    
    // Reset progress
    progressFilled.style.width = '0%';
    progressHandle.style.left = '0%';
}

// Update playlist UI to show active track
function updatePlaylistUI() {
    const items = playlistElement.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play current track
function playTrack() {
    const playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                updatePlayPauseButton(true);
            })
            .catch(error => {
                console.error('Error playing track:', error);
                updatePlayPauseButton(false);
            });
    }
}

// Pause current track
function pauseTrack() {
    audioPlayer.pause();
    updatePlayPauseButton(false);
}

// Toggle play/pause
function togglePlayPause() {
    if (audioPlayer.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
}

// Update play/pause button UI
function updatePlayPauseButton(isPlaying) {
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Play next track
function playNext() {
    let nextIndex = currentTrackIndex + 1;
    
    if (nextIndex >= playlist.length) {
        if (isLooping) {
            nextIndex = 0;
        } else {
            // Stop at the end
            pauseTrack();
            return;
        }
    }
    
    loadTrack(nextIndex);
    playTrack();
}

// Play previous track
function playPrevious() {
    let prevIndex = currentTrackIndex - 1;
    
    if (prevIndex < 0) {
        if (isLooping) {
            prevIndex = playlist.length - 1;
        } else {
            prevIndex = 0;
        }
    }
    
    loadTrack(prevIndex);
    playTrack();
}

// Toggle loop mode
function toggleLoop() {
    isLooping = !isLooping;
    loopBtn.classList.toggle('active', isLooping);
}

// Handle track end
function handleTrackEnd() {
    playNext();
}

// Update progress bar
function updateProgress() {
    if (isDragging) return;
    
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (!isNaN(duration) && duration > 0) {
        const percentage = (currentTime / duration) * 100;
        progressFilled.style.width = percentage + '%';
        progressHandle.style.left = percentage + '%';
    }
    
    // Update time display
    currentTimeDisplay.textContent = formatTime(currentTime);
}

// Update duration display
function updateDuration() {
    const duration = audioPlayer.duration;
    if (!isNaN(duration)) {
        durationDisplay.textContent = formatTime(duration);
    }
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Seek to position
function seek(event) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioPlayer.duration;
    
    if (!isNaN(newTime)) {
        audioPlayer.currentTime = newTime;
    }
}

// Handle error
function handleError(event) {
    console.error('Audio error:', event);
    const track = playlist[currentTrackIndex];
    trackTitle.textContent = `Error loading: ${track.title}`;
    trackArtist.textContent = 'The audio file may not be accessible';
}

// Setup all event listeners
function setupEventListeners() {
    // Control buttons
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrevious);
    loopBtn.addEventListener('click', toggleLoop);
    
    // Progress bar interactions
    progressBar.addEventListener('click', seek);
    
    // Progress bar dragging
    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        seek(e);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            seek(e);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch support for mobile
    progressBar.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        seek(touch);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            seek(touch);
        }
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                playNext();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                playPrevious();
                break;
            case 'KeyL':
                e.preventDefault();
                toggleLoop();
                break;
        }
    });
}
