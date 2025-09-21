

function handleResize() {
  const boardContainer = document.querySelector('.board-container');
  const boardElement = document.querySelector('#board');
  if (!boardContainer || !boardElement || !board) return;

  requestAnimationFrame(() => {
    const boardContainerRect = boardContainer.getBoundingClientRect();
    let availableSize;
    if (window.matchMedia("(orientation: landscape)").matches) {
        availableSize = boardContainerRect.height;
    } else {
        availableSize = boardContainerRect.width;
    }
    const paddingAndBorder = 2 * 2 + 2 * parseFloat(getComputedStyle(boardContainer).paddingLeft);
    const finalSize = Math.max(50, availableSize - paddingAndBorder);
    //boardElement.style.width = `${finalSize}px`;
    boardElement.style.height = `${finalSize}px`;
    if (board && typeof board.resize === 'function') {
      board.resize();
    }
  });
}

let resizeTimeout;
function throttleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 150);
}

// --- Gemini API Integration ---
const analysisModal = document.getElementById('analysisModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const analyzePositionBtn = document.getElementById('analyzePositionBtn');
const analysisResultEl = document.getElementById('analysisResult');
const analysisLoadingEl = document.getElementById('analysisLoading');

async function getPositionAnalysis() {
    if (!game) {
        analysisResultEl.textContent = 'Chess game engine not initialized.';
        return;
    }
    const currentFEN = game.fen();
    const prompt = `Analyze the following chess position from White's perspective. FEN: "${currentFEN}". Provide a brief strategic overview. What are the key strengths and weaknesses for White and Black? Are there any immediate threats or notable tactical opportunities for either side? Keep the analysis concise and easy to understand for an intermediate player.`;

    analyzePositionBtn.disabled = true;
    analyzePositionBtn.querySelector('span').textContent = 'Analyzing...';
    analysisLoadingEl.style.display = 'block';
    analysisResultEl.textContent = '';
    analysisModal.style.display = 'block';

    try {
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; // Provided by Canvas environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`API request failed with status ${response.status}: ${errorData?.error?.message || response.statusText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            analysisResultEl.textContent = text;
        } else {
            analysisResultEl.textContent = 'Could not retrieve analysis. The response structure was unexpected.';
            console.error('Unexpected API response structure:', result);
        }

    } catch (error) {
        console.error('Error fetching analysis:', error);
        analysisResultEl.textContent = `Error: ${error.message}. Check console for details. Make sure you are connected to the internet.`;
    } finally {
        analyzePositionBtn.disabled = false;
        analyzePositionBtn.querySelector('span').textContent = '✨ Analyze';
        analysisLoadingEl.style.display = 'none';
    }
}

if (analyzePositionBtn) {
    analyzePositionBtn.addEventListener('click', getPositionAnalysis);
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        analysisModal.style.display = 'none';
    });
}
// Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === analysisModal) {
        analysisModal.style.display = 'none';
    }
});


// --- Game Menu Modal Integration ---
const gameMenuModal = document.getElementById('gameMenuModal');
const closeGameMenuBtn = document.getElementById('closeGameMenuBtn');
const menuBtn = document.getElementById('menuBtn');
const resignBtn = document.getElementById('resignBtn');
const offerDrawBtn = document.getElementById('offerDrawBtn');

// Show game menu modal
function showGameMenu() {
    gameMenuModal.style.display = 'block';
}

// Hide game menu modal
function hideGameMenu() {
    gameMenuModal.style.display = 'none';
}

// Handle resign action
function handleResign() {
    if (confirm('Are you sure you want to resign? This will end the game.')) {
        // Add your resign logic here
        console.log('Player resigned');
        hideGameMenu();
        
        // Example: Show game over message
        alert('You have resigned. Game over.');
        
        // You might want to:
        // - Update game state
        // - Disable further moves
        // - Show final position
        // - Reset the board for a new game
    }
}

// Handle offer draw action
function handleOfferDraw() {
    if (confirm('Do you want to offer a draw to your opponent?')) {
        // Add your draw offer logic here
        console.log('Draw offered');
        hideGameMenu();
        
        // Example: Show draw offer message
        alert('Draw offer sent to opponent.');
        
        // You might want to:
        // - Send draw offer to opponent (in multiplayer)
        // - Show pending draw offer status
        // - Handle opponent's response
    }
}

// Event listeners
if (menuBtn) {
    menuBtn.addEventListener('click', showGameMenu);
}

if (closeGameMenuBtn) {
    closeGameMenuBtn.addEventListener('click', hideGameMenu);
}

if (resignBtn) {
    resignBtn.addEventListener('click', handleResign);
}

if (offerDrawBtn) {
    offerDrawBtn.addEventListener('click', handleOfferDraw);
}

// Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === gameMenuModal) {
        hideGameMenu();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && gameMenuModal.style.display === 'block') {
        hideGameMenu();
    }
});



// --- Event Listeners & Initialization ---
$(document).ready(function() {
  if (typeof Chessboard === 'function' && $('#board').length) {
    //initializeChessboard();
  } else {
    console.error("Chessboard.js not found or #board element missing.");
    $('#status').text('Error: Chessboard could not be loaded.');
  }
  
  window.addEventListener('resize', throttleResize);
  window.addEventListener('orientationchange', throttleResize);

  $('#newgame').on('click', function() {
    if (game && typeof Chess === 'function') { // Re-initialize chess.js instance
        game = new Chess(); // This effectively resets the game
    }
    if (board) board.start(); // Reset board to starting position
    updateStatus();
  });

  $('#backbtn').on('click', function() {
    if (game) game.undo();
    if (board) board.position(game.fen());
    updateStatus();
  });

  $('#forwardbtn').on('click', function() {
    console.log("Forward button clicked - Redo functionality not implemented.");
  });

  handleResize(); 
});

