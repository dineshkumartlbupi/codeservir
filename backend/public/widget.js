(function () {
  'use strict';

  // Get chatbot ID from script tag
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  const chatbotId = currentScript.getAttribute('data-chatbot-id');

  if (!chatbotId) {
    console.error('codeservir: chatbot-id not provided');
    return;
  }

  const API_URL = currentScript.src.replace('/widget.js', '');
  let sessionId = null;
  let config = null;
  let isOpen = false;
  let messages = [];

  // Create widget HTML
  // Create widget HTML
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'codeservir-widget';
    widgetContainer.innerHTML = `
      <style>
        #codeservir-widget {
          position: fixed;
          bottom: 0;
          right: 0;
          z-index: 999999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: none; /* Let clicks pass through the container */
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 20px;
        }

        /* Floating Launcher Button */
        #codeservir-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto; /* Re-enable clicks */
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
          animation: codeservir-float 3s ease-in-out infinite;
          margin-top: 20px;
        }

        @keyframes codeservir-float {
          0% { transform: translateY(0px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
          50% { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
          100% { transform: translateY(0px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        }

        #codeservir-button:hover {
          transform: scale(1.1);
          animation-play-state: paused;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        #codeservir-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        /* Main Chat Window */
        #codeservir-chat-window {
          display: none; /* Explicitly hidden */
          width: 380px;
          height: 600px; /* Slightly shorter to fit smaller screens safely */
          max-height: calc(100vh - 140px);
          background: #f3f4f6;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          flex-direction: column;
          overflow: hidden;
          pointer-events: auto; /* Re-enable clicks */
          margin-bottom: 20px; /* Space from button if we used flex column logic, but for fixed pos this might be ignored unless we change layout strategy. */
          
          /* Fixed positioning relative to viewport to be safe */
          position: fixed;
          bottom: 100px;
          right: 20px;
        }

        #codeservir-chat-window.open {
          display: flex !important; /* Force show */
        }

        /* Header */
        #codeservir-header {
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .codeservir-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .codeservir-header-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .codeservir-header-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }

        .codeservir-header-info p {
          margin: 2px 0 0;
          font-size: 12px;
          opacity: 0.9;
          font-weight: 400;
        }

        #codeservir-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.2s;
        }

        #codeservir-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Messages Area */
        #codeservir-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .codeservir-message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 85%;
        }

        .codeservir-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .codeservir-message.bot {
          align-self: flex-start;
        }

        .codeservir-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .codeservir-avatar svg {
            width: 18px;
            height: 18px;
        }
        
        .codeservir-avatar.user-avatar {
            background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
        }

        .codeservir-message-content {
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        /* Bot Bubble: White, rounded */
        .codeservir-message.bot .codeservir-message-content {
          background: white;
          color: #1f2937;
          border-radius: 12px;
          border-bottom-left-radius: 2px;
        }

        /* User Bubble: Gradient, rounded */
        .codeservir-message.user .codeservir-message-content {
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          color: white;
          border-radius: 12px;
          border-bottom-right-radius: 2px;
        }

        /* Typing Indicator */
        .codeservir-typing {
          display: none;
          margin-left: 36px; /* Align with bot text (avatar width + gap) */
        }
        
        .codeservir-typing-bubble {
            background: white;
            padding: 12px 16px;
            border-radius: 12px;
            border-bottom-left-radius: 2px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: inline-flex;
            gap: 4px;
        }

        .codeservir-typing.active {
          display: block;
        }

        .codeservir-typing span {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }
        
        .codeservir-typing span:nth-child(2) { animation-delay: 0.2s; }
        .codeservir-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Input Area */
        #codeservir-footer {
            background: white;
            padding: 16px 20px 10px;
            border-top: 1px solid #e5e7eb;
        }

        #codeservir-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s;
        }

        #codeservir-input-container:focus-within {
          border-color: var(--primary-color, #4F46E5);
          background: white;
        }

        #codeservir-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          padding: 4px 0;
          color: #374151;
        }

        #codeservir-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        #codeservir-send:hover {
          transform: scale(1.05);
        }
        
        #codeservir-send svg {
            width: 18px;
            height: 18px;
            fill: white;
            margin-left: 2px; /* Visual centering */
        }

        /* Branding Footer */
        #codeservir-branding {
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            margin-top: 8px;
            font-weight: 500;
        }
        
        #codeservir-branding a {
            color: var(--primary-color, #4F46E5);
            text-decoration: none;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          #codeservir-chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            bottom: 90px;
            right: 20px;
          }
        }
      </style>

      <button id="codeservir-button" aria-label="Open chat">
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>

      <div id="codeservir-chat-window">
        <!-- Header -->
        <div id="codeservir-header">
           <div class="codeservir-header-content">
               <div class="codeservir-header-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
               </div>
               <div class="codeservir-header-info">
                   <h3 id="codeservir-title">Chat Support</h3>
                   <p>Smart AI Assistant</p>
               </div>
           </div>
           <button id="codeservir-close" aria-label="Close chat">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
           </button>
        </div>

        <!-- Messages -->
        <div id="codeservir-messages">
           <!-- Messages injected here -->
           
           <div class="codeservir-typing">
               <div class="codeservir-typing-bubble">
                <span></span>
                <span></span>
                <span></span>
               </div>
           </div>
        </div>

        <!-- Footer -->
        <div id="codeservir-footer">
            <div id="codeservir-input-container">
                <input 
                  type="text" 
                  id="codeservir-input" 
                  placeholder="Type your message..."
                  autocomplete="off"
                />
                <button id="codeservir-send" aria-label="Send message">
                  <svg viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
            </div>
            <div id="codeservir-branding">
                Powered by CodeServir AI
            </div>
        </div>
      </div>
    `;

    document.body.appendChild(widgetContainer);
  }

  // ... loadConfig and createSession remain same ...

  // Add message to UI
  function addMessage(type, content) {
    const messagesContainer = document.getElementById('codeservir-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `codeservir-message ${type}`;

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `codeservir-avatar ${type === 'user' ? 'user-avatar' : 'bot-avatar'}`;

    if (type === 'bot') {
      avatarDiv.innerHTML = `
                <svg viewBox="0 0 24 24" fill="#4F46E5">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>`;
    } else {
      avatarDiv.innerHTML = `
                <svg viewBox="0 0 24 24" fill="white">
                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>`;
    }

    // Bubble
    const contentDiv = document.createElement('div');
    contentDiv.className = 'codeservir-message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    messagesContainer.insertBefore(messageDiv, messagesContainer.querySelector('.codeservir-typing'));

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    messages.push({ type, content });
  }

  // Show/hide typing indicator
  function showTyping(show) {
    const typing = document.querySelector('.codeservir-typing');
    if (show) {
      typing.classList.add('active');
    } else {
      typing.classList.remove('active');
    }

    const messagesContainer = document.getElementById('codeservir-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Initialize widget
  async function init() {
    console.log('Codeservir Widget Initializing...');
    createWidget();

    // Attach listeners IMMEDIATELY (Don't wait for network)
    const btn = document.getElementById('codeservir-button');
    const closeBtn = document.getElementById('codeservir-close');

    if (btn) {
      btn.addEventListener('click', () => {
        console.log('Launcher Button Clicked');
        toggleChat();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', toggleChat);
    }

    document.getElementById('codeservir-send').addEventListener('click', () => {
      const input = document.getElementById('codeservir-input');
      sendMessage(input.value);
    });

    document.getElementById('codeservir-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage(e.target.value);
      }
    });

    // Now do async work
    await createSession();
    await loadConfig();
  }

  // Toggle chat window
  function toggleChat() {
    console.log('Toggling Chat. Current state:', isOpen);
    isOpen = !isOpen;
    const chatWindow = document.getElementById('codeservir-chat-window');
    const input = document.getElementById('codeservir-input');

    if (isOpen) {
      console.log('Opening chat window...');
      chatWindow.classList.add('open');
      if (input) setTimeout(() => input.focus(), 100);
    } else {
      console.log('Closing chat window...');
      chatWindow.classList.remove('open');
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
