// Custom Audio Player Logic
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

window.togglePlay = function(audioId, btn) {
    const audio = document.getElementById(audioId);
    const icon = btn.querySelector('.play-icon');
    
    // Pause all other audios
    document.querySelectorAll('audio').forEach(a => {
        if(a.id !== audioId && !a.paused) {
            a.pause();
            const otherBtn = a.nextElementSibling;
            if(otherBtn) otherBtn.querySelector('.play-icon').textContent = '▶';
        }
    });

    if (audio.paused) {
        audio.play();
        icon.textContent = '⏸';
    } else {
        audio.pause();
        icon.textContent = '▶';
    }
};

let isDraggingSeek = false;

window.seekAudioDrag = function(audioId, input) {
    isDraggingSeek = true;
    const progressEl = document.getElementById(`progress-${audioId}`);
    if (progressEl) {
        progressEl.style.width = `${input.value}%`;
    }
};

window.seekAudioChange = function(audioId, input) {
    const audio = document.getElementById(audioId);
    if (!isNaN(audio.duration)) {
        audio.currentTime = (input.value / 100) * audio.duration;
    }
    isDraggingSeek = false;
};

document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            enterBtn.style.display = 'none';
            if (progressContainer) {
                progressContainer.style.display = 'block';
            }
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 12;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Short delay after 100% before fading out
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        loadingScreen.style.visibility = 'hidden';
                        mainContent.style.opacity = '1';
                        
                        // Remove loading screen from DOM after transition
                        setTimeout(() => {
                            loadingScreen.remove();
                        }, 1000);
                    }, 600);
                }
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
            }, 120);
        });
    }

    // Generate 8 Cards
    const cardsGrid = document.querySelector('.cards-grid');
    
    // Trailer Setup
    const trailerVideoId = ''; // Add your Google Drive video ID here when ready (e.g., '1a2b3c4d5e...')
    const trailerContainer = document.getElementById('trailer-container');
    if (trailerContainer) {
        if (trailerVideoId.trim() !== '') {
            trailerContainer.innerHTML = `<iframe src="https://drive.google.com/file/d/${trailerVideoId}/preview" width="800" height="450" frameborder="0" allow="autoplay; fullscreen" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 100%;"></iframe>`;
        } else {
            trailerContainer.innerHTML = `<div class="trailer-placeholder"><h3>Trailer will upload soon</h3></div>`;
        }
    }
    
    // Define the content for each card here. You can change the title and text for each card below:
    const cardsData = [
        { file: '01card.jpg', title: 'Hint ', text: 'As time flies, some start fading away from our lives. Can you guess who’s fading away?' },
        { file: '02card.jpg', title: 'Hint ', text: 'Three butterflies. Three hopes.Each one belongs to someone.But they are slowly flying away.Can you guess who the three are?' },
        { file: '03card.jpg', title: 'Hint', text: 'Think about the Carters past.Look closely. Think wisely.From your perspective, what do you see? What does the past tell you about the Carters? Maybe the answers were there all along.' },
        { file: '04card.jpg', title: 'Hint', text: 'Look at the stars above him.Their formation is not random.Find the pattern.Find its name.Then youl will understand what it means.' },
        { file: '05card.png', title: 'Hint', text: 'A rose. A blood stain.One represents love.The other hides a name.Look closely.Can you identify the person?' },
        { file: '06card.jpg', title: 'Hint', text: 'Someone who carries pride and honor, dedicated to a long journey. But in this world, not everyone can be trusted. Operation New Dawn has failed before not once, not twice, but many times. Behind every failure is one powerful personality. Can you guess who? Time will reveal the truth.' },
        { file: '07card.jpg', title: 'Hint', text: 'The world will mourn. Officials will send their deepest sympathies, and the government will move on. But somewhere in the crowd, one person will never forget Carter and will carry his legacy forward. Who is that person? ' },
        { file: '08card.jpg', title: 'Hint', text: 'The time is 21.07 PM. The first step to represent the story of Distance. Many people cherish the moment, history for America. But one is smiling with tears, filled with pride as well… yet that personality only hopes one thing,  Come Back… ' }
    ];

    cardsData.forEach((data, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const card = document.createElement('div');
        card.className = 'card';
        
        // Flip toggle on click
        cardContainer.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        // Front Face
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        const img = document.createElement('img');
        
        // Handle potentially missing files like 5.jpg gracefully by falling back to 6.jpg
        img.onerror = function() {
            this.onerror = null; // Prevent infinite loop
            this.src = './cards/6.jpg'; 
        };
        img.src = `./cards/${data.file}`;
        img.alt = `Conspiracy Card ${index + 1}`;
        cardFront.appendChild(img);

        // Back Face
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        const hintTitle = document.createElement('h2');
        hintTitle.textContent = data.title;
        
        const hintText = document.createElement('p');
        hintText.textContent = data.text;
        
        cardBack.appendChild(hintTitle);
        cardBack.appendChild(hintText);

        // Append everything
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        cardContainer.appendChild(card);
        cardsGrid.appendChild(cardContainer);
    });

    // Audio setup
    document.querySelectorAll('audio').forEach(audio => {
        const progressEl = document.getElementById(`progress-${audio.id}`);
        const seekInput = document.getElementById(`seek-${audio.id}`);
        const timeEl = document.getElementById(`time-${audio.id}`);
        
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            
            if (!isDraggingSeek) {
                if (progressEl) {
                    progressEl.style.width = `${percent}%`;
                }
                if (seekInput) {
                    seekInput.value = percent;
                }
            }
            
            if (timeEl) {
                timeEl.textContent = `${formatTime(audio.currentTime)} - ${formatTime(audio.duration)}`;
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            if (timeEl) {
                timeEl.textContent = `00:00 - ${formatTime(audio.duration)}`;
            }
        });
        
        audio.addEventListener('ended', () => {
            const btn = audio.nextElementSibling;
            if(btn) btn.querySelector('.play-icon').textContent = '▶';
        });
    });
});
