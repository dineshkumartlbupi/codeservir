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
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'codeservir-widget';
    widgetContainer.innerHTML = `
      <style>
        :root {
            --widget-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            --widget-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            --msg-user-bg: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
            --msg-bot-bg: #ffffff;
        }

        #codeservir-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: var(--widget-font);
        }

        /* --- Floating Launcher Button --- */
        #codeservir-button {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
          animation: codeservir-float 3s ease-in-out infinite;
        }

        @keyframes codeservir-float {
          0% { transform: translateY(0px) scale(1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
          50% { transform: translateY(-5px) scale(1.02); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25); }
          100% { transform: translateY(0px) scale(1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
        }

        #codeservir-button:hover {
          animation-play-state: paused;
          transform: scale(1.1);
        }

        #codeservir-button svg {
          width: 32px;
          height: 32px;
          fill: white;
        }

        /* --- Chat Window --- */
        #codeservir-chat-window {
          display: none;
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 380px;
          height: 650px;
          max-height: calc(100vh - 120px);
          background: #F4F7F9; /* Light greyish blue background */
          border-radius: 20px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: opacity 0.3s, transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        #codeservir-chat-window.open {
          display: flex;
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* --- Header --- */
        #codeservir-header {
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .cs-header-avatar {
          width: 45px;
          height: 45px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .cs-header-avatar svg {
            width: 28px;
            height: 28px;
            fill: var(--primary-color, #4F46E5);
        }

        .cs-header-info {
          flex: 1;
        }

        .cs-header-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .cs-header-subtitle {
          margin: 0;
          font-size: 13px;
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
          font-size: 20px;
          transition: background 0.2s;
        }

        #codeservir-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* --- Messages Area --- */
        #codeservir-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
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

        /* Avatars in Chat */
        .cs-chat-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-bottom: 5px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cs-chat-avatar.bot {
            background: white;
        }
        .cs-chat-avatar.bot svg {
            width: 20px;
            height: 20px;
            fill: var(--primary-color, #4F46E5);
        }

        .cs-chat-avatar.user {
            background: var(--primary-color, #4F46E5);
        }
        .cs-chat-avatar.user svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        /* Bubbles */
        .codeservir-message-content {
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          position: relative;
        }

        .codeservir-message.user .codeservir-message-content {
          background: var(--msg-user-bg);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .codeservir-message.bot .codeservir-message-content {
          background: var(--msg-bot-bg);
          color: #333;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        /* --- Input Area --- */
        #codeservir-input-wrapper {
            background: white;
            padding: 15px 20px 10px;
            border-top: 1px solid #eee;
        }

        #codeservir-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f4f6f8;
          padding: 5px 5px 5px 20px;
          border-radius: 30px;
          border: 1px solid transparent;
          transition: border-color 0.2s, background 0.2s;
        }

        #codeservir-input-container:focus-within {
          background: white;
          border-color: var(--primary-color, #4F46E5);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        #codeservir-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          color: #333;
          padding: 8px 0;
        }
        
        #codeservir-input::placeholder {
            color: #999;
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

        #codeservir-powered {
            text-align: center;
            font-size: 11px;
            color: #ccc;
            margin-top: 8px;
            font-weight: 500;
        }
        
        #codeservir-powered a {
            color: #ccc;
            text-decoration: none;
            transition: color 0.2s;
        }
        
        #codeservir-powered a:hover {
            color: var(--primary-color, #4F46E5);
        }

        /* Typing Dots */
        .codeservir-typing {
          display: none;
          padding: 15px 20px;
          background: white;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          width: fit-content;
          margin-left: 40px; /* Align with bubbles */
          margin-bottom: 10px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .codeservir-typing.active {
          display: block;
        }

        .codeservir-typing span {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ccc;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }
        .codeservir-typing span:nth-child(1) { animation-delay: 0s; }
        .codeservir-typing span:nth-child(2) { animation-delay: 0.2s; }
        .codeservir-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 480px) {
          #codeservir-chat-window {
            width: calc(100vw - 40px);
            max-height: 80vh;
            bottom: 90px;
            right: 20px;
          }
        }
      </style>

      <button id="codeservir-button" aria-label="Open chat">
        <svg viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.025.14.246.195.539.141.819l-.59 3.033 2.924-.764c.256-.067.525-.038.766.07C7.942 21.368 9.904 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
        </svg>
      </button>

      <div id="codeservir-chat-window">
        <div id="codeservir-header">
            <div class="cs-header-avatar">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73A2 2 0 0 1 12 2zM8 13.5A1.5 1.5 0 1 0 8 10.5 1.5 1.5 0 0 0 8 13.5zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                </svg>
            </div>
            <div class="cs-header-info">
                <h3 id="codeservir-title" class="cs-header-title">Chat Support</h3>
                <p class="cs-header-subtitle">Smart AI Assistant</p>
            </div>
            <button id="codeservir-close" aria-label="Close chat">&times;</button>
        </div>

        <div id="codeservir-messages">
          <div class="codeservir-typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="codeservir-input-wrapper">
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
            <div id="codeservir-powered">
                Powered by <a href="#" target="_blank">CodeServir</a>
            </div>
        </div>
      </div>
    `;

    document.body.appendChild(widgetContainer);
  }

  // Load chatbot configuration
  async function loadConfig() {
    try {
      const response = await fetch(`${API_URL}/api/chatbot/${chatbotId}/config`);
      const data = await response.json();

      if (data.success) {
        config = data.config;

        // Apply custom colors
        const root = document.documentElement;
        root.style.setProperty('--primary-color', config.primaryColor);
        root.style.setProperty('--secondary-color', config.secondaryColor);

        // Set title
        document.getElementById('codeservir-title').textContent = config.businessName;

        // Add greeting message
        addMessage('bot', config.greeting);
      }
    } catch (error) {
      console.error('Failed to load chatbot config:', error);
    }
  }

  // Create new session
  async function createSession() {
    try {
      const response = await fetch(`${API_URL}/api/chat/session`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        sessionId = data.sessionId;
        localStorage.setItem(`codeservir_session_${chatbotId}`, sessionId);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  // Send message
  async function sendMessage(message) {
    if (!message.trim()) return;

    // Add user message to UI
    addMessage('user', message);

    // Clear input
    document.getElementById('codeservir-input').value = '';

    // Show typing indicator
    showTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          sessionId,
          message,
        }),
      });

      const data = await response.json();

      showTyping(false);

      if (data.success) {
        addMessage('bot', data.response);
      } else if (data.error === 'LIMIT_EXCEEDED') {
        addMessage('bot', data.message);
      } else {
        addMessage('bot', 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      showTyping(false);
      console.error('Failed to send message:', error);
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
  }

  // Add message to UI
  function addMessage(type, content) {
    const messagesContainer = document.getElementById('codeservir-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `codeservir-message ${type}`;

    // Icons
    const botIcon = `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73A2 2 0 0 1 12 2zM8 13.5A1.5 1.5 0 1 0 8 10.5 1.5 1.5 0 0 0 8 13.5zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`;
    const userIcon = `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

    // Create Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `cs-chat-avatar ${type}`;
    avatarDiv.innerHTML = type === 'bot' ? botIcon : userIcon;

    // Create Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'codeservir-message-content';
    contentDiv.textContent = content;

    // Assemble based on type
    if (type === 'bot') {
      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);
    } else {
      // User: Avatar first in code (row-reversed in CSS)
      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);
    }

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

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById('codeservir-chat-window');

    if (isOpen) {
      chatWindow.classList.add('open');
      document.getElementById('codeservir-input').focus();
    } else {
      chatWindow.classList.remove('open');
    }
  }

  // Initialize widget
  async function init() {
    createWidget();

    // Load session from localStorage
    sessionId = localStorage.getItem(`codeservir_session_${chatbotId}`);
    if (!sessionId) {
      await createSession();
    }

    await loadConfig();

    // Event listeners
    document.getElementById('codeservir-button').addEventListener('click', toggleChat);
    document.getElementById('codeservir-close').addEventListener('click', toggleChat);

    document.getElementById('codeservir-send').addEventListener('click', () => {
      const input = document.getElementById('codeservir-input');
      sendMessage(input.value);
    });

    document.getElementById('codeservir-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage(e.target.value);
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
