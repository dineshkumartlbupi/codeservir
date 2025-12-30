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
        #codeservir-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

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
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
          animation: codeservir-float 3s ease-in-out infinite;
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

        #codeservir-chat-window {
          display: none;
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 120px);
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          flex-direction: column;
          overflow: hidden;
        }

        #codeservir-chat-window.open {
          display: flex;
        }

        #codeservir-header {
          background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981));
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #codeservir-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        #codeservir-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 24px;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        #codeservir-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        #codeservir-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f9fafb;
        }

        .codeservir-message {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .codeservir-message.user {
          align-items: flex-end;
        }

        .codeservir-message.bot {
          align-items: flex-start;
        }

        .codeservir-message-content {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .codeservir-message.user .codeservir-message-content {
          background: var(--primary-color, #4F46E5);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .codeservir-message.bot .codeservir-message-content {
          background: white;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .codeservir-typing {
          display: none;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          width: fit-content;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .codeservir-typing.active {
          display: block;
        }

        .codeservir-typing span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          margin: 0 2px;
          animation: typing 1.4s infinite;
        }

        .codeservir-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .codeservir-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        #codeservir-input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
        }

        #codeservir-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        #codeservir-input:focus {
          border-color: var(--primary-color, #4F46E5);
        }

        #codeservir-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary-color, #4F46E5);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        #codeservir-send:hover {
          opacity: 0.9;
        }

        #codeservir-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        #codeservir-send svg {
          width: 20px;
          height: 20px;
          fill: white;
        }

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
        <div id="codeservir-header">
          <h3 id="codeservir-title">Chat</h3>
          <button id="codeservir-close" aria-label="Close chat">&times;</button>
        </div>
        <div id="codeservir-messages">
          <div class="codeservir-typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
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

    const contentDiv = document.createElement('div');
    contentDiv.className = 'codeservir-message-content';
    contentDiv.textContent = content;

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
