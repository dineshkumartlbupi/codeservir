export const embedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>CodeServir Chat</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f9fafb; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        #chat-header { background: linear-gradient(135deg, var(--primary-color, #4F46E5), var(--secondary-color, #10B981)); color: white; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
        #chat-header h1 { font-size: 20px; font-weight: 600; }
        #messages { flex: 1; overflow-y: auto; padding: 20px; -webkit-overflow-scrolling: touch; }
        .message { margin-bottom: 16px; display: flex; flex-direction: column; }
        .message.user { align-items: flex-end; }
        .message.bot { align-items: flex-start; }
        .message-content { max-width: 80%; padding: 12px 16px; border-radius: 12px; font-size: 15px; line-height: 1.5; word-wrap: break-word; }
        .message.user .message-content { background: var(--primary-color, #4F46E5); color: white; border-bottom-right-radius: 4px; }
        .message.bot .message-content { background: white; color: #1f2937; border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
        .typing { display: none; padding: 12px 16px; background: white; border-radius: 12px; width: fit-content; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
        .typing.active { display: block; }
        .typing span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; margin: 0 2px; animation: typing 1.4s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
        #input-container { padding: 16px; background: white; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05); }
        #message-input { flex: 1; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 24px; font-size: 15px; outline: none; }
        #message-input:focus { border-color: var(--primary-color, #4F46E5); }
        #send-button { width: 44px; height: 44px; border-radius: 50%; background: var(--primary-color, #4F46E5); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        #send-button:active { opacity: 0.8; }
        #send-button:disabled { opacity: 0.5; }
        #send-button svg { width: 20px; height: 20px; fill: white; }
    </style>
</head>
<body>
    <div id="chat-header">
        <h1 id="business-name">Chat</h1>
    </div>
    <div id="messages">
        <div class="typing"><span></span><span></span><span></span></div>
    </div>
    <div id="input-container">
        <input type="text" id="message-input" placeholder="Type your message..." autocomplete="off" />
        <button id="send-button">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
    </div>
    <script>
        (function () {
            const chatbotId = window.location.pathname.split('/').pop();
            const API_URL = window.location.origin;
            let sessionId = null;
            let config = null;

            async function loadConfig() {
                try {
                    const response = await fetch(\`\${API_URL}/api/chatbot/\${chatbotId}/config\`);
                    const data = await response.json();
                    if (data.success) {
                        config = data.config;
                        document.documentElement.style.setProperty('--primary-color', config.primaryColor);
                        document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
                        document.getElementById('business-name').textContent = config.businessName;
                        addMessage('bot', config.greeting);
                    }
                } catch (error) { console.error('Failed to load config:', error); }
            }

            async function createSession() {
                try {
                    const response = await fetch(\`\${API_URL}/api/chat/session\`, { method: 'POST' });
                    const data = await response.json();
                    if (data.success) {
                        sessionId = data.sessionId;
                        localStorage.setItem(\`codeservir_session_\${chatbotId}\`, sessionId);
                    }
                } catch (error) { console.error('Failed to create session:', error); }
            }

            async function sendMessage(message) {
                if (!message.trim()) return;
                addMessage('user', message);
                document.getElementById('message-input').value = '';
                showTyping(true);
                try {
                    const response = await fetch(\`\${API_URL}/api/chat\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chatbotId, sessionId, message }),
                    });
                    const data = await response.json();
                    showTyping(false);
                    if (data.success) { addMessage('bot', data.response); }
                    else if (data.error === 'LIMIT_EXCEEDED') { addMessage('bot', data.message); }
                    else { addMessage('bot', 'Sorry, I encountered an error. Please try again.'); }
                } catch (error) {
                    showTyping(false);
                    console.error('Failed to send message:', error);
                    addMessage('bot', 'Sorry, I encountered an error. Please try again.');
                }
            }

            function addMessage(type, content) {
                const messagesContainer = document.getElementById('messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${type}\`;
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.textContent = content;
                messageDiv.appendChild(contentDiv);
                messagesContainer.insertBefore(messageDiv, messagesContainer.querySelector('.typing'));
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            function showTyping(show) {
                const typing = document.querySelector('.typing');
                if (show) typing.classList.add('active');
                else typing.classList.remove('active');
                const messagesContainer = document.getElementById('messages');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            async function init() {
                sessionId = localStorage.getItem(\`codeservir_session_\${chatbotId}\`);
                if (!sessionId) await createSession();
                await loadConfig();
                document.getElementById('send-button').addEventListener('click', () => {
                    const input = document.getElementById('message-input');
                    sendMessage(input.value);
                });
                document.getElementById('message-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage(e.target.value);
                });
            }
            init();
        })();
    </script>
</body>
</html>`;
