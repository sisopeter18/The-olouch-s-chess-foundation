

// Game state
const game = new Chess();

// Centralized configuration object
const configs = {
  // Game settings
  game: {
    time: 1500,
    increment: 0,
    engine: true,
    orientation: null // Will be set dynamically
  },
  
    // Piece styles
    styles: {
        "0": "cburnett",
        "1": "alpha"
    },
  
  // Game state
  state: {
    selectedSquare: null,
    legalMoves: [],
    whiteTime: 1500,
    blackTime: 1500,
    activeColor: 'w',
    gameInterval: null,
    soundPlayedWhite: false,
    soundPlayedBlack: false,
    capture: false,
    dragstarts: [0],
    activeClickHandler: null
  },
  
  // Move tracking
  moves: {
    clc1: null,
    timesClc1: [],
    fromPremove: null,
    activeDelay: 'w',
    gpieceColor: null,
    earlyPremoveStart: null,
    earlyCanceller: null,
    laggedclc1: null,
    single: null,
    complete: [],
    master: [],
    thistime: {}
  },
  
  // Premove system
  premoves: {
    w: null,
    b: null
  },
  
  // Global tracking objects
  globalDual: { color: null, src: null },
  globalUnresolved: { from: null, to: null, color: null },
  initPreClick: { color: null, src: null, flags: "i", oc: null },
  
  // Player information
  players: {
    white: { rating: 1500, rd: 350 },
    black: { rating: 1500, rd: 350 }
  }
};


const players = {
  white: { rating: 1500, rd: 350 },  // rd = rating deviation (Glicko-like)
  black: { rating: 1500, rd: 350 }
};


// Example usage in your chess functions:
var onDragStart = function(source, piece) {
    
  const gamesPiece = game.get(source);
  configs.moves.gpieceColor = gamesPiece.color;
  configs.moves.clc1 = configs.moves.clc1 || source;
  

  const a = configs.moves.activeDelay;
  const b = configs.moves.gpieceColor;
  const c = configs.state.activeColor;

  
  const side = configs.premoves.w ? 'w' : configs.premoves.b ? 'b' : null;
  
  // Reset canceller
  if (configs.moves.earlyCanceller) {
    configs.moves.earlyCanceller = null;
  }
  
  // Case 1: Normal player clicks own piece (www or bbb)
  if (a === b && b === c) {
    // No action needed
    
  }
  
  // Case 2: Player just moved, update delayed tracker
  if (a === b && b !== c) {
    configs.moves.activeDelay = configs.state.activeColor;
    configs.moves.gpieceColor = configs.state.activeColor;
  }
  
  // Case 3: Early capture scenario with existing premove
  if (a === c && b !== c) {
    checkAndExecutePremove();
    if (configs.premoves[side] && configs.premoves[side].to !== configs.premoves[side].from) {
      const moveac = game.move({ 
        from: configs.moves.clc1, 
        to: source, 
        promotion: 'q' 
      });
      
      if (moveac) {
        try {
          handleMove(moveac, configs.game.engine);
        } catch (e) {
          console.error('Move error:', e);
        }
        
        setTimeout(() => {
          $(`#board .square-${configs.moves.clc1}`).removeClass('premove-from');
          configs.moves.timesClc1 = [];
          configs.moves.clc1 = null;
        });
        
        configs.moves.earlyCanceller = 'e';
        return false;
      }
    } else {
      configs.moves.earlyPremoveStart = configs.moves.clc1;
      $(`.square-${source}`).addClass('premove-from');
    }
  }
  
  // Case 4: Opponent clicked (possible premove)
  if (a === c && b !== c) {
    configs.initPreClick = configs.initPreClick.color ? configs.initPreClick : {
      color: a,
      src: configs.moves.clc1,
      oc: c,
      this: b
    };
    
    configs.moves.thistime = { color: configs.moves.gpieceColor, src: source };
    configs.moves.master.push(configs.moves.thistime);
  }
  
  // Get legal moves
  const moves = game.moves({ square: source, verbose: true });
  
  if (game.game_over()) return false;
  
  // Handle no legal moves (capture attempt)
  if (moves.length === 0) {
    if (configs.moves.clc1 !== source) {
      const move = game.move({ 
        from: configs.moves.clc1, 
        to: source, 
        promotion: 'q' 
      });
      
      try {
        handleMove(move, configs.game.engine);
        configs.state.capture = true;
        configs.initPreClick = {};
        configs.moves.master = [];
        configs.premoves[configs.moves.gpieceColor] = null;
      } catch (e) {
        console.error('Drag start error:', e);
      }
    }
    
    configs.moves.clc1 = source;
    return false;
  }
  
  // Normal drag start
  configs.moves.clc1 = source;
  configs.moves.timesClc1.push(configs.moves.clc1);
  
  highlightMoveSquares(configs.moves.clc1);
  
  // Handle multiple clicks on same piece
  if (configs.moves.timesClc1.length === 2) {
    if (configs.moves.timesClc1[0] === configs.moves.timesClc1[1]) {
      configs.moves.timesClc1 = [];
    }
  }
  
  if (configs.state.dragstarts.join('').toString().endsWith('0')) {
    configs.state.dragstarts.push(1);
  }
  
  return true;
}



// Modified onDrop function using configs
function onDrop(source, target) {
  const lastmasterc = configs.moves.master.length > 0 ? 
    configs.moves.master[configs.moves.master.length - 1].color : null;
  
  // Handle multi-master premove scenario
  if (configs.moves.master.length > 1 && 
      configs.moves.master[configs.moves.master.length - 1].src !== target && 
      configs.premoves.w === configs.premoves.b && 
      lastmasterc !== configs.moves.activeDelay) {
    
    configs.premoves[configs.moves.master[configs.moves.master.length - 1].color] = {
      from: configs.moves.master[configs.moves.master.length - 1].src,
      to: target,
      promotion: 'q'
    };
  }
  
  // Handle same-square premove correction
  if (lastmasterc && 
      configs.premoves[lastmasterc] && 
      configs.premoves[lastmasterc].from === configs.premoves[lastmasterc].to && 
      lastmasterc !== configs.moves.activeDelay) {
    
    configs.premoves[lastmasterc] = {
      from: configs.moves.master[configs.moves.master.length - 1].src,
      to: target,
      promotion: 'q'
    };
  }
  
  const theside = configs.premoves.w ? 'w' : configs.premoves.b ? 'b' : null;
  
  // Handle early canceller
  if (configs.moves.earlyCanceller) {
    $('.premove-from, .premove-to').removeClass('premove-from premove-to');
    configs.moves.clc1 = null;
    return false;
  }
  
  // Handle early premove start
  if (configs.moves.earlyPremoveStart) {
    const earlyPiece = game.get(configs.moves.earlyPremoveStart);
    
    if (configs.premoves[theside] && 
        configs.premoves[theside].from === earlyPiece && 
        configs.premoves[theside].to === target) {
      
      configs.premoves[configs.initPreClick.color] = {
        from: configs.moves.earlyPremoveStart,
        to: target,
        promotion: 'q'
      };
      
      configs.moves.earlyPremoveStart = null;
    } else if (!configs.premoves[theside]) {
      configs.premoves[configs.initPreClick.color] = {
        from: configs.moves.earlyPremoveStart,
        to: target,
        promotion: 'q'
      };
      
      configs.moves.earlyPremoveStart = null;
    }
  }
  
  // Handle target piece capture scenario
  const targetPiece = game.get(target);
  if (targetPiece && targetPiece.color !== configs.initPreClick.color) {
    const premove = configs.premoves[configs.initPreClick.color];
    
    if (configs.initPreClick.color && premove && premove.from === premove.to) {
      configs.premoves[configs.initPreClick.color] = {
        from: configs.initPreClick.src,
        to: target,
        promotion: 'q'
      };
      
      // Reset initPreClick
      configs.initPreClick = {
        color: null,
        src: null,
        oc: null,
        flags: 'i'
      };
    }
  }
  
  // Handle non-active color drops (premoves)
  const gamesPieces = game.get(source);
  const gpieceColors = gamesPieces ? gamesPieces.color : null;
  
  if (gpieceColors !== configs.state.activeColor) {
    $('.premove-from, .premove-to').removeClass('premove-from premove-to');
    configs.premoves[gpieceColors] = null;
    $(`.square-${configs.moves.clc1}`).addClass('premove-from');
    
    if (source === target) {
      const move = game.move({ 
        from: configs.moves.clc1, 
        to: target, 
        promotion: 'q' 
      });
      
      if (move === null) return 'snapback';
      
      try {
        handleMove(move, configs.game.engine);
      } catch (e) {
        console.error('Drop error:', e);
      }
      
      checkAndExecutePremove();
      
      setTimeout(() => {
        $(`#board .square-${configs.moves.clc1}`).removeClass('premove-from');
      }, 3);
      
      return false;
    } else {
      // Queue premove
      configs.premoves[gpieceColors] = { 
        from: source, 
        to: target, 
        promotion: 'q' 
      };
      highlightPremove(source, target);
      return 'snapback';
    }
  }
  
  if (source === target) return 'snapback';
  
  const gamePiece = game.get(source);
  if (!gamePiece) return 'snapback';
  
  const pieceColor = gamePiece.color;
  
  if (pieceColor === configs.state.activeColor) {
    configs.premoves[pieceColor] = null;
    $('.premove-from, .premove-to').removeClass('premove-from premove-to');
    
    // Normal move handling
    const move = game.move({ 
      from: configs.moves.clc1, 
      to: target, 
      promotion: 'q' 
    });
    
    if (move === null) return 'snapback';
    
    try {
      handleMove(move, configs.game.engine);
    } catch (e) {
      console.error('Drop error:', e);
    }
    
    return false;
  } else {
    // Queue premove
    configs.premoves[pieceColor] = { 
      from: source, 
      to: target, 
      promotion: 'q' 
    };
    highlightPremove(source, target);
    return 'snapback';
  }
}

// Modified autonomous click handler using configs
function setupChessClickHandler(e) {
  // Reset early premove states
  configs.moves.earlyStarPremove = null;
  const emptyLanding = true;
  
  const gamePiece = game.get(configs.moves.clc1);
  if (!gamePiece) return 'snapback';
  
  const pieceColor = gamePiece.color;
  
  // Update lagged click tracking
  configs.moves.laggedclc1 = !configs.moves.laggedclc1 ? 
    configs.moves.clc1 : configs.moves.laggedclc1;
  
  // Add to completion pattern
  configs.moves.complete.push(pieceColor);
  
  // Pattern analysis with activeColor
  const pattern = configs.moves.complete.join('') + configs.state.activeColor;
  
  console.log('Pattern Analysis:', {
    complete: configs.moves.complete,
    activeColor: configs.state.activeColor,
    pattern: pattern,
    phase: configs.moves.complete.length === 1 ? 'INITIALIZATION' : 
           configs.moves.complete.length === 2 && 
           configs.moves.complete[0] === configs.moves.complete[1] ? 'NORMAL_MOVE' :
           configs.moves.complete.length === 2 && 
           configs.moves.complete[0] !== configs.moves.complete[1] ? 'CAPTURE_PREMOVE' : 'UNKNOWN'
  });
  
  // PHASE 1: INITIALIZATION STATE
  if (configs.moves.complete.length === 1) {
    const srcSquare = extractSquareFromClick(e);
    if (srcSquare) {
      configs.moves.single = srcSquare;
    }
    return;
  }
  
  // PHASE 2: CAPTURE PREMOVE DETECTION
  if (configs.moves.complete.length === 2 && 
      configs.moves.complete[0] !== configs.moves.complete[1]) {
    
    if (pattern === 'bww' || pattern === 'wbb') {
      const targetSquare = extractSquareFromClick(e);
      
      if (targetSquare) {
        // Store capture premove
        configs.premoves[configs.moves.complete[0]] = {
          from: configs.moves.single,
          to: targetSquare,
          promotion: 'q'
        };
        
        highlightPremove(configs.moves.single, targetSquare);
        
        // Cleanup after capture premove
        configs.moves.timesClc1 = [];
        configs.moves.clc1 = null;
        clearHighlights();
        configs.moves.single = null;
        configs.moves.complete = [];
        
        console.log('Capture Premove Stored:', 
          configs.premoves[configs.moves.complete[0]]);
        return;
      }
    }
    
    // Reset after dual capture attempt
    configs.moves.complete = [];
    return;
  }
  
  // PHASE 3: NORMAL MOVE/PREMOVE
  if (configs.moves.complete.length === 2 && 
      configs.moves.complete[0] === configs.moves.complete[1]) {
    
    const destinationSquare = extractSquareFromClick(e);
    
    if (!destinationSquare || !configs.moves.clc1) {
      configs.moves.complete = [];
      return;
    }
    
    // Current player move execution
    if (pieceColor === configs.state.activeColor) {
      try {
        const move = game.move({
          from: configs.moves.clc1,
          to: destinationSquare,
          promotion: 'q'
        });
        
        if (!move) {
          // Smart same-source cancellation logic
          if (configs.moves.laggedclc1 === destinationSquare) {
            // Cancel selection
            configs.moves.clc1 = null;
            configs.moves.complete = [];
            configs.moves.laggedclc1 = null;
            return;
          } else {
            // Reselect different piece or invalid move
            configs.moves.laggedclc1 = destinationSquare;
            const destPiece = game.get(destinationSquare);
            
            if (destPiece) {
              // Update to new source piece
              configs.moves.complete = [destPiece.color];
              configs.moves.clc1 = destinationSquare;
            } else {
              // Invalid square clicked
              configs.moves.clc1 = null;
              configs.moves.complete = [];
              configs.moves.laggedclc1 = null;
            }
            return;
          }
        }
        
        // Successful move execution
        handleMove(move, configs.game.engine);
        checkAndExecutePremove();
        
        setTimeout(() => {
          $(`#board .square-${configs.moves.clc1}`).removeClass('premove-from');
          configs.moves.timesClc1 = [];
          configs.moves.clc1 = null;
          configs.moves.complete = [];
          configs.moves.laggedclc1 = null;
        });
        
      } catch (e) {
        console.error('Move Error:', e);
        configs.moves.complete = [];
      }
    } else {
      // Premove without capture
      configs.premoves[pieceColor] = {
        from: configs.moves.clc1,
        to: destinationSquare,
        promotion: 'q'
      };
      
      highlightPremove(configs.moves.clc1, destinationSquare);
      configs.moves.timesClc1 = [];
      configs.moves.clc1 = null;
      clearHighlights();
      configs.moves.complete = [];
      
      console.log('Non-capture Premove Stored:', configs.premoves[pieceColor]);
    }
  }
}

// Helper function remains the same
function extractSquareFromClick(e) {
  if (!e.target.classList) return null;
  
  const classList = Array.from(e.target.classList);
  const regex = /^square-([a-h][1-8])$/;
  const matchingClass = classList.find(cls => regex.test(cls));
  
  return matchingClass ? matchingClass.match(regex)[1] : null;
}


// Main function to handle a move
function handleMove(move, engine) {
    
    resetUI(move);
    highlightSquare(move.from); //bnew
    highlightSquareTo(move.to); //bnew
    
    updateBoardPosition();
    
    getECOFromFEN(game.fen()).then(result => {
        if (result) {
            //alert(`opp ECO: ${result.eco} (${result.name})`);
            if (result.certainty === "inferred") {
                //alert(`opp Next move: ${result.nextMove}`);
            }
        } else {
            //alert("opp Position not in standard opening theory");
        }
    });
    
    updateGameState();
    checkGameStatus(move);
    
    checkAndExecutePremove();
    if(engine){startEngineAnalysis();}
    updateMaterialAdvantage()

}


function checkAndExecutePremove() {
  const currentColor = configs.state.activeColor;
  const premove = configs.premoves[currentColor];
  
  if (premove) {
    // Clear highlights
    $('.premove-from, .premove-to').removeClass('premove-from premove-to');
    
    const move = game.move({
      from: premove.from,
      to: premove.to,
      promotion: premove.promotion
    });
    
    if (move) {
      handleMove(move, configs.game.engine);
      configs.premoves[currentColor] = null;
      configs.initPreClick = {};
      configs.moves.master = [];
    } else {
      // Nullify premove if invalid (e.g., due to check)
      highlightCheck();
      configs.premoves[currentColor] = null;
    }
  }
}


// Initialize game setup and return configuration object
function initializeGame() {
  // Pick random style
  const styleKeys = Object.keys(configs.styles);
  const currentStyle = configs.styles[Math.floor(Math.random() * styleKeys.length)];
  
  // Generate piece images
  configs.pieceImages = Object.fromEntries(
    ['K','Q','R','B','N','P'].flatMap(p => [
      [`w${p}`, `pieces/${currentStyle}/w${p}.svg`], 
      [`b${p}`, `pieces/${currentStyle}/b${p}.svg`]
    ])
  );
  
  // Determine player orientation
  const player1Color = Math.random() < 0.5 ? 'w' : 'b';
  configs.game.orientation = player1Color === 'w' ? 'white' : 'black';
  
  // Set initial times
  configs.state.whiteTime = configs.game.time;
  configs.state.blackTime = configs.game.time;
  
  // Flip board if needed
  const boardWrapper = document.querySelector('.wrapper');
  if (player1Color === 'b') {
    boardWrapper.classList.add('flipped');
  }

  // Return modular configuration object
  return {
    orientation: configs.game.orientation,
    pieceImages: configs.pieceImages,
    currentStyle: currentStyle,
    playerColor: player1Color,
    timeControl: {
      whiteTime: configs.state.whiteTime,
      blackTime: configs.state.blackTime
    },
    // You can add more properties as needed
    gameConfig: configs.game,
    gameState: configs.state
  };
}

// Initialize the game and get configuration
const gameSetup = initializeGame();

try {
// Initialize board with the returned configuration
var board = Chessboard('board', {
  position: 'start',
  orientation: gameSetup.orientation,
  pieceTheme: (piece) => gameSetup.pieceImages[piece],
  draggable: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
});

document.addEventListener('click', setupChessClickHandler);

}
catch (e){alert(e)}      
       






/*-------------------
//Status & Highlights
--------------------*/


function updateStatus() {
  let status = '';
   
  const moveColor = game.turn() === 'w' ? 'White' : 'Black';

  if (game.in_checkmate()) {
    status = `Game over, ${moveColor === 'White' ? 'Black' : 'White'} wins by checkmate!`;
  } else if (game.in_draw()) {
    status = 'Game over, drawn position';
  } else {
    status = `${moveColor} to move`;
    if (game.in_check()) {
      status += `, ${moveColor} is in check`;
      highlightCheck();
    }
  }

  $('#status').text(status);
}

function endGame(message) {
  clearInterval(configs.state.gameInterval);
  $('#status').text(message);
  board.draggable = false;
}

function highlightSquare(square) {
  $('#board .square-' + square).addClass('highlight');
}

function highlightSquareTo(square) {
  $('#board .square-' + square).addClass('highlight-moveto');
}

function clearSelection(square) {
  $('#board .square-' + square).removeClass('highlight');
  $('#board .square-' + square).removeClass('highlight-from');
}

function highlightMoveSquares(sourceSquare) {
  const moves = game.moves({ square: sourceSquare, verbose: true });

  $('#board .square-' + sourceSquare).addClass('highlight-from');

  for (const move of moves) {
    highlightDot(move.to);
  }
}

function highlightDot(square) {
  const squareEl = $(`.square-${square}`);
  squareEl.addClass('square-highlight');
}

function clearHighlights() {
  $('.square-highlight').removeClass('square-highlight');
}

function highlightPremove(from, to) {
  // Clear all existing premove highlights first
  $('.premove-from, .premove-to').removeClass('premove-from premove-to');
  // Add new highlights
  $(`.square-${from}`).addClass('premove-from');
  $(`.square-${to}`).addClass('premove-to');
}


function highlightCheck() {
  clearCheckHighlights();
  
  if (game.in_check() || game.in_checkmate()) {
    const fenParts = game.fen().split(' ');
    const ranks = fenParts[0].split('/');
    const kingColor = game.turn();
    const kingSymbol = kingColor === 'w' ? 'K' : 'k';

    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      let fileIndex = 0;
      const rank = ranks[rankIndex];
      
      for (const char of rank) {
        if (isNaN(char)) {
          if (char === kingSymbol) {
            const square = `${'abcdefgh'[fileIndex]}${8 - rankIndex}`;
            $(`.square-${square}`).addClass('highlight-check');
            return;
          }
          fileIndex++;
        } else {
          fileIndex += parseInt(char, 10);
        }
      }
    }
  }
}

function clearCheckHighlights() {
  $('.highlight-check').removeClass('highlight-check');
}



document.getElementById('backbtn').addEventListener('click', () => {
  const undopos = game.undo();
  
  if (undopos) {
    updateBoardPosition();
    updateGameState();
    resetUI(undopos);
    checkGameStatus();
  }
});

// Navigation controls using configs
document.getElementById('newgame').addEventListener('click', () => {
  game.reset();
  board.position('start');
  configs.state.whiteTime = configs.game.time;
  configs.state.blackTime = configs.game.time;
  configs.state.activeColor = 'w';
  
  // Reset all move tracking
  configs.moves.clc1 = null;
  configs.moves.timesClc1 = [];
  configs.moves.complete = [];
  configs.moves.master = [];
  configs.premoves.w = null;
  configs.premoves.b = null;
  configs.initPreClick = { color: null, src: null, flags: "i", oc: null };
  
  updateTimers();
  updateStatus();
  clearInterval(configs.state.gameInterval);
  startTimer();
});


// Move history tracking using configs
configs.navigation = {
  moveHistory: [],
  currentMove: -1
};


// Utility functions for accessing config values
const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], configs);
};

const setConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key], configs);
  target[lastKey] = value;
};


// Refactored utility functions using configs
function processMove(clc1, target) {
  const move = game.move({ from: clc1, to: target, promotion: 'q' });
  if (move === null) return 'snapback';

  board.position(game.fen());
   
  configs.state.activeColor = game.turn();
  startTimer();
  updateStatus();
  
  highlightSquare(clc1);
  highlightSquare(target);

  configs.moves.clc1 = null;
  configs.moves.timesClc1 = [];
  
  if (game.in_checkmate()) {
    endGame(`${configs.state.activeColor === 'w' ? 'Black' : 'White'} wins by checkmate!`);
  } else if (game.in_draw()) {
    endGame('Draw!');
  } else if (game.in_check()) {
    highlightCheck();
  }

  return false;
}










// Timer Module (using configs instead of config)

  // Timer functions
  function startTimer() {
    clearInterval(configs.state.gameInterval);
    configs.state.gameInterval = setInterval(() => {
      if (configs.state.activeColor === 'w') {
        configs.state.whiteTime = Math.max(0, configs.state.whiteTime - 1);
      } else {
        configs.state.blackTime = Math.max(0, configs.state.blackTime - 1);
      }
      
      updateTimers();
      
      if (configs.state.whiteTime <= 0 || configs.state.blackTime <= 0) {
        endGame();
      }
    }, 10); // 10ms = 1cs interval
  }
  
  function formatTime(cs) {
    const mins = Math.floor(cs / 6000).toString().padStart(2, '0');
    const secs = Math.floor((cs % 6000) / 100).toString().padStart(2, '0');
    const ds = Math.floor((cs % 100) / 10).toString().padStart(2, '0');
    const csPart = (cs % 10).toString().padStart(2, '0');

    if (cs >= 1000) { // Normal time
      return `${mins}:${secs}`;
    } 
    else if (cs >= 100) { // Under 10 seconds
      return `${mins}:${secs}<span class="deci">:${ds}</span>`;
    }
    else { // Under 1 second
      return `${mins}:${secs}<span class="deci">:${ds}</span><span class="centi">:${csPart}</span>`;
    }
  }

  function updateTimers() {
    const whiteElem = document.getElementById('white-timer');
    const blackElem = document.getElementById('black-timer');
    
    whiteElem.innerHTML = `White: ${formatTime(configs.state.whiteTime)}`;
    blackElem.innerHTML = `Black: ${formatTime(configs.state.blackTime)}`;
  
    const el = document.getElementById('alert-lowtime');
    // Play alert sound when crossing 10s threshold
    if (configs.state.whiteTime <= 1000 && !configs.state.soundPlayedWhite) {
      el.play();
      configs.state.soundPlayedWhite = true;
    }
    if (configs.state.blackTime <= 1000 && !configs.state.soundPlayedBlack) {
      el.play();
      configs.state.soundPlayedBlack = true;
    }
    
    // Critical state styling
    whiteElem.classList.toggle('critical', configs.state.whiteTime < 1000);
    blackElem.classList.toggle('critical', configs.state.blackTime < 1000);
    // hyper critical
    whiteElem.classList.toggle('super-critical', configs.state.whiteTime < 300);
    blackElem.classList.toggle('super-critical', configs.state.blackTime < 300);
  }


       
    
    document.getElementById('forwardbtn').addEventListener('click', () => {
     try{
      //alert("thisfen "+document.querySelector(".white-move").dataset.fen + " vs "+
      //"otherfen "+document.querySelector(".active-move").dataset.fen)
      const active = document.querySelector(".movespan");
    
      //alert("thisfen "+active.querySelector(".white-move").dataset.fen + " vs "+
      //"otherfen "+document.querySelector(".active-move").dataset.fen)
    
      const fenActive = active && active.nextSibling? active.nextSibling: null; //(!active.nextSibling && active.parentElement.nextSibling.classList.contains('active-move'))? 
                        //active.parentElement.nextSibling.querySelector('.movespan');  
    /*
      fenActive.classList.add('active-move');
      const fen = fenActive? fenActive.dataset.fen : null;
      board.position(fen);
     */
     } catch (e){
         alert(e)
     }
    });
    
    // Update move history when moves are made
    function updateMoveHistory(move) {
      moveHistory = moveHistory.slice(0, currentMove + 1);
      moveHistory.push(move);
      currentMove++;
    }
    
    
    
    // Update board position
    function updateBoardPosition() {
        board.position(game.fen());
    }
    
    // Update game state variables
    function updateGameState() {
        configs.state.activeColor = game.turn();
        startTimer();
        configs.initPreClick.flags = "e";
        updateStatus();
    }
    
    // Reset UI elements
    function resetUI(move) {
        configs.moves.timesClc1 = [];
        clearHighlights();
        
        $('.highlight').removeClass('highlight');
        $('.highlight-moveto').removeClass('highlight-moveto');
        $('.highlight-from').removeClass('highlight-from')
        configs.moves.clc1 = null;
        clearCheckHighlights();
        updateMoveHistory();
        //alert(JSON.stringify(game.history({verbose: true})));
        
    }
    
    
    function updateMoveHistory() {
        const moveList = document.querySelector('.move-history');
        // Calculate if we were scrolled to the end before updating
        const wasScrolledToEnd = moveList.scrollLeft + moveList.clientWidth >= moveList.scrollWidth - 10;
        
        // Create a temporary game to reconstruct positions
        const tempGame = new Chess();
        const history = [];
        
        // Rebuild the entire game move by move
        game.history({ verbose: true }).forEach((move, index) => {
            // Make the move and store the FEN AFTER the move
            tempGame.move(move);
            history.push({
                move,
                fen: tempGame.fen(), // Store FEN AFTER this move
                isWhite: index % 2 === 0,
                moveNumber: Math.floor(index / 2) + 1
            });
        });
    
        moveList.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let currentMoveRow = null;
    
        history.forEach((item, index) => {
            if (item.isWhite) {
                // Create new row for white moves
                currentMoveRow = document.createElement('div');
                currentMoveRow.className = 'move-row';
                currentMoveRow.innerHTML = `
                    <span class="move-number">${item.moveNumber}.</span>
                    <span data.fen = "${item.fen}" class="white-move movespan">${item.move.san}</span>
                `;
                currentMoveRow.querySelector('.white-move').dataset.fen = item.fen;
                fragment.appendChild(currentMoveRow);
            } else if (currentMoveRow) {
                // Append black move to existing row
                const blackMove = document.createElement('span');
                blackMove.className = 'black-move movespan';
                blackMove.textContent = item.move.san;
                blackMove.dataset.fen = item.fen;
                currentMoveRow.appendChild(blackMove);
            }
            
            // Store FEN AFTER this move (for both white and black)
            if (currentMoveRow) {
                currentMoveRow.dataset.fen = item.fen;
            }
        });
    
        moveList.appendChild(fragment);
    
        // Add click handlers
        document.querySelectorAll('.movespan').forEach(row => {
            row.addEventListener('click', () => {
                const fen = row.dataset.fen;
                if (fen) {
                    board.position(fen);
                    // Highlight active move
                    document.querySelectorAll('.movespan').forEach(r => 
                        r.classList.remove('active-move'));
                    row.classList.add('active-move');
                }
            });
        });
    
        
        
        if (wasScrolledToEnd && moveList.lastElementChild) {
            setTimeout(() => {
                moveList.lastElementChild.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'end'
                });
            }, 0);
        
            // Use setTimeout to ensure the DOM has updated
            setTimeout(() => {
                moveList.scrollLeft = moveList.scrollWidth;
            }, 0);
        }
    }
    
    
    // Start engine analysis
    function startEngineAnalysis() {
        stockfish.postMessage('position fen ' + game.fen());
        stockfish.postMessage('go depth 8');
        stockfish.postMessage('go movetime 1000'); // Max 1 second per move
        
        stockfish.postMessage('setoption name Skill Level value 2');
        stockfish.postMessage('setoption name Eval Noise value 50');
        stockfish.postMessage('go depth 10 movetime 1000');
    }
    
    
    function updateMaterialAdvantage() {
        const fen = game.fen().split(' ')[0]; // Get the board part of FEN
        const ranks = fen.split('/');
        
        let whiteMaterial = 0;
        let blackMaterial = 0;
        
        const pieceValues = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
        };
    
        // Process each rank in the FEN
        for (const rank of ranks) {
            let expandedRank = '';
            for (const char of rank) {
                expandedRank += isNaN(char) ? char : '.'.repeat(parseInt(char));
            }
            
            // Process each square in the expanded rank
            for (const piece of expandedRank) {
                if (piece === '.') continue;
                
                const isWhite = piece === piece.toUpperCase();
                const type = piece.toLowerCase();
                const value = pieceValues[type];
                
                if (isWhite) {
                    whiteMaterial += value;
                } else {
                    blackMaterial += value;
                }
            }
        }
    
        const advantage = whiteMaterial - blackMaterial;
        //alert(advantage)
        updateAdvantageDisplay('.white-advantage', advantage > 0 ? advantage : 0);
        updateAdvantageDisplay('.black-advantage', advantage < 0 ? -advantage : 0);
    }
    
    // Keep the existing updateAdvantageDisplay function from previous answer
    
    function updateAdvantageDisplay(elementId, advantage) {
        if (advantage === 0) {
            document.querySelector(elementId).innerHTML = '';
            return;
        }
        
        const advantageDiv = document.querySelector(elementId);
        advantageDiv.innerHTML = '';
        
        // Determine which pieces to show based on advantage
        const piecesToShow = [];
        let remainingAdvantage = advantage;
        
        // Queen (9 points)
        const queens = Math.floor(remainingAdvantage / 9);
        if (queens > 0) {
            piecesToShow.push({ type: 'q', count: queens });
            remainingAdvantage %= 9;
        }
        
        // Rook (5 points)
        const rooks = Math.floor(remainingAdvantage / 5);
        if (rooks > 0) {
            piecesToShow.push({ type: 'r', count: rooks });
            remainingAdvantage %= 5;
        }
        
        // Bishop/Knight (3 points)
        const minorPieces = Math.floor(remainingAdvantage / 3);
        if (minorPieces > 0) {
            // Prefer showing knights first (like Lichess)
            piecesToShow.push({ type: 'n', count: minorPieces });
            remainingAdvantage %= 3;
        }
        
        // Pawns (1 point)
        if (remainingAdvantage > 0) {
            piecesToShow.push({ type: 'p', count: remainingAdvantage });
        }
        
        // Create icons for each piece
        piecesToShow.forEach(piece => {
            for (let i = 0; i < piece.count; i++) {
                const pieceColor = elementId === '.white-advantage' ? 'b' : 'w';
                const pieceType = piece.type;
                const pieceKey = `${pieceColor}${pieceType.toUpperCase()}`;
                
                const img = document.createElement('img');
                img.src = pieceImages[pieceKey];
                
                img.className = 'advantage-piece';
                img.alt = `${pieceColor}${pieceType}`;
                img.style.width = '15px'
                
                advantageDiv.appendChild(img);
            }
        });
        
        // Add + if there are multiple pieces
        if (piecesToShow.length > 1) {
            const plus = document.createElement('span');
            plus.textContent = `+${advantage}`;
            plus.className = 'advantage-total';
            advantageDiv.appendChild(plus);
        }
    }
    
    
    // ========================
    //  GLICKO RATING SYSTEM
    // ========================
    const Glicko = (() => {
      const MAX_RD = 350;
      const Q = Math.log(10) / 400;
      const C = 50; // RD inflation constant per day
    
      class Player {
        constructor(id) {
          this.id = id;
          this.rating = 1500;
          this.rd = MAX_RD;
          this.games = 0;
          this.lastActive = Date.now();
        }
    
        applyInactivity(days = 0) {
          if (days > 0) {
            this.rd = Math.min(Math.sqrt(this.rd ** 2 + C ** 2 * days), MAX_RD);
            this.lastActive = Date.now() - (days * 86400000);
          }
        }
      }
    
      function g(rd) {
        return 1 / Math.sqrt(1 + (3 * Q ** 2 * rd ** 2) / (Math.PI ** 2));
      }
    
      function expectedScore(player, opponent) {
        return 1 / (1 + 10 ** (-g(opponent.rd) * (player.rating - opponent.rating) / 400));
      }
    
      function updateRatings(white, black, result) {
        // Convert chess result to Glicko scores
        const scoreMap = {
          '1-0': [1, 0],
          '0-1': [0, 1],
          '1/2-1/2': [0.5, 0.5]
        };
        const [scoreWhite, scoreBlack] = scoreMap[result] || [0.5, 0.5];
    
        // Update white rating
        const E_white = expectedScore(white, black);
        const d2_white = 1 / (Q ** 2 * g(black.rd) ** 2 * E_white * (1 - E_white));
        white.rd = Math.sqrt(1 / (1 / white.rd ** 2 + 1 / d2_white));
        white.rating += Q / (1 / white.rd ** 2 + 1 / d2_white) * g(black.rd) * (scoreWhite - E_white);
    
        // Update black rating
        const E_black = expectedScore(black, white);
        const d2_black = 1 / (Q ** 2 * g(white.rd) ** 2 * E_black * (1 - E_black));
        black.rd = Math.sqrt(1 / (1 / black.rd ** 2 + 1 / d2_black));
        black.rating += Q / (1 / black.rd ** 2 + 1 / d2_black) * g(white.rd) * (scoreBlack - E_black);
    
        // Update game counts
        white.games++;
        black.games++;
      }
    
      return {
        Player,
        updateRatings,
        MAX_RD,
        C
      };
    })();
    
    // ========================
    //  GAME INTEGRATION
    // ========================
    const GameManager = (() => {
      const players = {
        white: new Glicko.Player('white'),
        black: new Glicko.Player('black')
      };
    
      function savePlayers() {
        localStorage.setItem('players', JSON.stringify({
          white: players.white,
          black: players.black
        }));
      }
    
      function loadPlayers() {
        const data = localStorage.getItem('players');
        if (data) {
          const saved = JSON.parse(data);
          players.white = Object.assign(new Glicko.Player('white'), saved.white);
          players.black = Object.assign(new Glicko.Player('black'), saved.black);
        }
      }
    
      function updateRatings(result) {
        Glicko.updateRatings(players.white, players.black, result);
        savePlayers();
        displayRatings();
      }
    
      function displayRatings() {
        alert('Current Ratings:');
        alert(`White: ${players.white.rating.toFixed(1)} (RD: ${players.white.rd.toFixed(1)})`);
        alert(`Black: ${players.black.rating.toFixed(1)} (RD: ${players.black.rd.toFixed(1)})`);
      }
    
      return {
        init: loadPlayers,
        updateRatings,
        displayRatings
      };
    })();
    
    // ========================
    //  INTEGRATED GAME STATUS CHECK
    // ========================
    function checkGameStatus(move) {
        
      if(move.san.startsWith('O-O')){
         document.getElementById('alert-castles').play();
      } else {
        if (game.in_checkmate()) {
          const result = configs.state.activeColor === 'w' ? '0-1' : '1-0';
          endGame(`${configs.state.activeColor === 'w' ? 'Black' : 'White'} wins by checkmate!`);
          document.getElementById('alert-win').play();
          GameManager.updateRatings(result);
        } else if (game.in_draw()) {
          endGame('Draw!');
          document.getElementById('alert-draw').play();
          GameManager.updateRatings('1/2-1/2');
        } else if (game.in_check()) {
          document.getElementById('alert-check').play();
          highlightCheck();
        } else {
            document.getElementById('alert-move').play();
        }
      }
    }
    
    // Initialize when game loads
    GameManager.init();
    
    $('#white-name').text('FM Script');   // e.g. from your user profile
    $('#black-name').text('Nasila');
    
    
     
         var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)); 
         var stockfish = new Worker(!wasmSupported ? '/stockfish.wasm.min.js' : '/stockfish.min.js'); 
         
         stockfish.addEventListener('message', async function(e) {
           if (e.data.startsWith('bestmove')) {
             const bestMove = e.data.split(' ')[1];
             const from = bestMove.slice(0, 2); // e.g., "e2"
             const to = bestMove.slice(2, 4);  // e.g., "e4"
         
             const move = game.move({ from, to, promotion: 'q' });
         
             
             updateBoardPosition();
            
             // Example usage:
             const fen = game.fen();
             // A position from the Italian Game (after several moves)
             //const fen = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
             getECOFromFEN(fen).then(result => {
                 if (result) {
                     //alert(`ECO: ${result.eco} (${result.name})`);
                     if (result.certainty === "inferred") {
                         //alert(`Next move: ${result.nextMove}`);
                     }
                 } else {
                     //alert("Position not in standard opening theory");
                 }
             });
            
             updateGameState();
             resetUI(move);
             checkGameStatus(move);
             updateMaterialAdvantage();
            
             
            
             
          
             // Detect opening for THIS exact move
             //const openingName = await detectOpeningByMoves(move);
             //alert(openingName)
             //alert(JSON.stringify(game.history({verbose: true})))
         
             // Update UI
             /*const isWhiteSystem = game.turn() === 'b';
             const playerDiv = isWhiteSystem ? 
               document.querySelector('.white-player-system') : 
               document.querySelector('.black-player-system');
         
             if (playerDiv && openingName !== "Unknown Opening") {
               playerDiv.textContent = openingName;
             }*/
           }
         });
         
         
         if(configs.game.engine){startEngineAnalysis();}
         
         async function getECOFromFEN(fen) {
             try {
                 // Clean the FEN - only keep position, active color, castling, en passant
                 const cleanFEN = fen.split(' ').slice(0, 6).join(' ');
                 
                 // Use the masters database which has more comprehensive opening data
                 const response = await fetch(
                     `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(cleanFEN)}`
                 );
                 
                 const data = await response.json();
                 
                 if (data.opening) {
                     return {
                         eco: data.opening.eco,
                         name: data.opening.name,
                         moves: data.moves // All possible moves from this position
                     };
                 }
                 
                 // If no exact opening match, find the most popular move that leads to a known opening
                 if (data.moves && data.moves.length > 0) {
                     // Sort by number of games (most popular first)
                     data.moves.sort((a, b) => b.white + b.black + b.draws - (a.white + a.black + a.draws));
                     
                     // Try to find a move that leads to a named opening
                     for (const move of data.moves) {
                         if (move.opening) {
                             return {
                                 eco: move.opening.eco,
                                 name: move.opening.name,
                                 nextMove: move.san,
                                 certainty: "inferred" // Not exact position but leads to known opening
                             };
                         }
                     }
                 }
                 
                 return null; // No known opening found
                 
             } catch (error) {
                 console.error("Error fetching ECO:", error);
                 return null;
             }
         }  
        
         /*
         const fen = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
            getECOFromFEN(fen).then(result => {
                if (result) {
                    alert(`ECO: ${result.eco} (${result.name})`);
                    if (result.certainty === "inferred") {
                        alert(`Next move: ${result.nextMove}`);
                    }
                } else {
                    alert("Position not in standard opening theory");
                }
            });
         */
                        



