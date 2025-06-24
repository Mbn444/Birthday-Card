// A single, unified script for both desktop and mobile.

let highestZ = 1;

class Paper {
  holdingPaper = false;
  
  // These will be set based on the event type (mouse or touch)
  prevX = 0;
  prevY = 0;

  // Position of the paper
  currentPaperX = 0;
  currentPaperY = 0;

  rotation = Math.random() * 30 - 15;

  init(paper) {
    // Bind the event handlers to this instance
    this.handleMove = this.handleMove.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    // Listen for both mouse and touch start events
    paper.addEventListener('mousedown', this.handleStart);
    paper.addEventListener('touchstart', this.handleStart);
  }

  handleStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    // Set the z-index to bring the paper to the front
    e.currentTarget.style.zIndex = highestZ;
    highestZ += 1;
    
    // Determine start coordinates based on event type
    if (e.type === 'touchstart') {
      this.prevX = e.touches[0].clientX;
      this.prevY = e.touches[0].clientY;
    } else { // 'mousedown'
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    }
    
    // Add move and end listeners to the window
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('touchmove', this.handleMove, { passive: false }); // passive:false is important for preventDefault() to work
    
    window.addEventListener('mouseup', this.handleEnd);
    window.addEventListener('touchend', this.handleEnd);
  }

  handleMove(e) {
    if (!this.holdingPaper) return;
    
    // Prevent default browser actions, like scrolling on mobile
    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    let clientX, clientY;

    // Determine current coordinates based on event type
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else { // 'mousemove'
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate velocity (change in position)
    const velX = clientX - this.prevX;
    const velY = clientY - this.prevY;
    
    // Update paper's position
    this.currentPaperX += velX;
    this.currentPaperY += velY;
    
    // Update previous coordinates for the next move event
    this.prevX = clientX;
    this.prevY = clientY;
    
    // Apply the transformation to the paper element
    e.currentTarget.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  handleEnd() {
    this.holdingPaper = false;
    
    // VERY IMPORTANT: Remove the listeners from the window to clean up
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('touchmove', this.handleMove);
    
    window.removeEventListener('mouseup', this.handleEnd);
    window.removeEventListener('touchend', this.handleEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  // We need to pass the paper element to the handlers, so we adjust init
  p.init(paper);
});

// A small adjustment to the init and handleMove to get the target paper element
// Let's refine the code slightly for better targeting

// --- REFINED FINAL CODE ---

// Clear the previous forEach loop
// papers.forEach... (remove this part from above)

// This is the final, correct way to initialize
papers.forEach(paper => {
  const p = new Paper();

  p.init = function(paper) {
    // We bind the paper element to the handlers
    this.handleMove = this.handleMove.bind(this, paper);
    this.handleStart = this.handleStart.bind(this, paper);
    this.handleEnd = this.handleEnd.bind(this, paper);

    paper.addEventListener('mousedown', this.handleStart);
    paper.addEventListener('touchstart', this.handleStart);
  };
  
  // Re-define handleMove and handleStart to accept the paper element
  p.handleStart = function(paper, e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    paper.style.zIndex = highestZ;
    highestZ += 1;
    
    if (e.type === 'touchstart') {
      this.prevX = e.touches[0].clientX;
      this.prevY = e.touches[0].clientY;
    } else {
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    }
    
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('mouseup', this.handleEnd);
    window.addEventListener('touchend', this.handleEnd);
  };

  p.handleMove = function(paper, e) {
    if (!this.holdingPaper) return;
    
    if (e.type === 'touchmove') e.preventDefault();

    let clientX, clientY;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const velX = clientX - this.prevX;
    const velY = clientY - this.prevY;
    
    this.currentPaperX += velX;
    this.currentPaperY += velY;
    
    this.prevX = clientX;
    this.prevY = clientY;
    
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  };
  
  p.init(paper);
});
