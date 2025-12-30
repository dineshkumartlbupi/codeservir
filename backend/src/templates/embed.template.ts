export const embedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>CodeServir Chat</title>
    <style>
        :root {
            --primary-color: #4F46E5;
            --secondary-color: #10B981;
            --msg-user-bg: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            --msg-bot-bg: #ffffff;
            --bg-color: #F4F7F9;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            background: var(--bg-color); 
            height: 100vh; 
            overflow: hidden; 
            display: flex; 
            flex-direction: column; 
        }
        
        /* Header */
        #chat-header { 
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); 
            color: white; 
            padding: 15px 20px; 
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
            z-index: 10;
        }
        .header-avatar {
            width: 40px; height: 40px; background: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header-avatar svg { width: 24px; height: 24px; fill: var(--primary-color); }
        .header-info h1 { font-size: 18px; font-weight: 700; margin: 0; }
        .header-info p { font-size: 12px; opacity: 0.9; margin: 0; font-weight: 400; }

        /* Messages */
        #messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; -webkit-overflow-scrolling: touch; }
        
        .message { display: flex; align-items: flex-end; gap: 8px; max-width: 90%; }
        .message.user { align-self: flex-end; flex-direction: row-reverse; }
        .message.bot { align-self: flex-start; }

        /* Avatars */
        .chat-avatar {
            width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2px;
        }
        .chat-avatar.bot { background: white; }
        .chat-avatar.bot svg { width: 20px; height: 20px; fill: var(--primary-color); }
        .chat-avatar.user { background: var(--primary-color); }
        .chat-avatar.user svg { width: 18px; height: 18px; fill: white; }

        /* Bubbles */
        .message-content { 
            padding: 12px 16px; 
            border-radius: 18px; 
            font-size: 15px; 
            line-height: 1.5; 
            word-wrap: break-word; 
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .message.user .message-content { 
            background: var(--msg-user-bg); 
            color: white; 
            border-bottom-right-radius: 4px; 
        }
        .message.bot .message-content { 
            background: var(--msg-bot-bg); 
            color: #333; 
            border-bottom-left-radius: 4px; 
            border: 1px solid rgba(0,0,0,0.05);
        }

        /* Typing */
        .typing { display: none; padding: 15px 20px; background: white; border-radius: 18px; border-bottom-left-radius: 4px; width: fit-content; margin-left: 40px; margin-bottom: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .typing.active { display: block; }
        .typing span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #ccc; margin: 0 2px; animation: typing 1.4s infinite ease-in-out; }
        .typing span:nth-child(1) { animation-delay: 0s; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        /* Input Area */
        #input-container { 
            background: white; 
            padding: 15px 20px; 
            border-top: 1px solid #eee; 
            display: flex; 
            gap: 10px; 
            align-items: center;
        }
        #input-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            background: #f4f6f8;
            border-radius: 24px;
            padding: 5px 5px 5px 20px;
            transition: background 0.2s, box-shadow 0.2s;
        }
        #input-wrapper:focus-within { background: white; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
        #message-input { 
            flex: 1; border: none; background: transparent; 
            font-size: 15px; outline: none; padding: 8px 0; color: #333; 
        }
        #send-button { 
            width: 40px; height: 40px; border-radius: 50%; 
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); 
            border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; 
            transition: transform 0.2s;
        }
        #send-button:hover { transform: scale(1.05); }
        #send-button:disabled { opacity: 0.6; cursor: default; }
        #send-button svg { width: 18px; height: 18px; fill: white; margin-left: 2px; }

        /* Powered By */
        #powered-by {
            text-align: center; font-size: 11px; color: #ccc; padding-bottom: 5px; background: white;
            padding-top: 0; margin-top: -5px;
        }
        #powered-by a { color: #ccc; text-decoration: none; }
        #powered-by a:hover { color: var(--primary-color); }

    </style>
</head>
<body>
    <div id="chat-header">
        <div class="header-avatar">
            <svg viewBox="0 0 24 24"><path d="M12 2C9.25 2 7.02 4.23 7.02 7L7 8C4.24 8 2 10.24 2 13V15C2 17.76 4.24 20 7 20H17C19.76 20 22 17.76 22 15V13C22 10.24 19.76 8 17 8H16.98C16.98 5.23 14.75 3 12 3V2Z M12 4C13.66 4 15 5.34 15 7H9C9 5.34 10.34 4 12 4ZM7 10H17C18.66 10 20 11.34 20 13V15C20 16.66 18.66 18 17 18H7C5.34 18 4 16.66 4 15V13C4 11.34 5.34 10 7 10ZM8.5 13C7.67 13 7 13.67 7 14.5C7 15.33 7.67 16 8.5 16C9.33 16 10 15.33 10 14.5C10 13.67 9.33 13 8.5 13ZM15.5 13C14.67 13 14 13.67 14 14.5C14 15.33 14.67 16 15.5 16C16.33 16 17 15.33 17 14.5C17 13.67 16.33 13 15.5 13Z"/></svg>
        </div>
        <div class="header-info">
            <h1 id="business-name">Chat Support</h1>
            <p>Smart AI Assistant</p>
        </div>
    </div>
    
    <div id="messages">
        <div class="typing"><span></span><span></span><span></span></div>
    </div>

    <div id="input-container">
        <div id="input-wrapper">
            <input type="text" id="message-input" placeholder="Type your message..." autocomplete="off" />
        </div>
        <button id="send-button">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
    </div>
    <div id="powered-by">Powered by <a href="https://www.codeservir.com/" target="_blank">CodeServir.com</a></div>

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
                
                // Avatar
                const avatarIcon = type === 'bot' 
                    ? '<svg viewBox="0 0 24 24"><path d="M12 2C9.25 2 7.02 4.23 7.02 7L7 8C4.24 8 2 10.24 2 13V15C2 17.76 4.24 20 7 20H17C19.76 20 22 17.76 22 15V13C22 10.24 19.76 8 17 8H16.98C16.98 5.23 14.75 3 12 3V2Z M12 4C13.66 4 15 5.34 15 7H9C9 5.34 10.34 4 12 4ZM7 10H17C18.66 10 20 11.34 20 13V15C20 16.66 18.66 18 17 18H7C5.34 18 4 16.66 4 15V13C4 11.34 5.34 10 7 10ZM8.5 13C7.67 13 7 13.67 7 14.5C7 15.33 7.67 16 8.5 16C9.33 16 10 15.33 10 14.5C10 13.67 9.33 13 8.5 13ZM15.5 13C14.67 13 14 13.67 14 14.5C14 15.33 14.67 16 15.5 16C16.33 16 17 15.33 17 14.5C17 13.67 16.33 13 15.5 13Z"/></svg>'
                    : '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                
                const avatarDiv = document.createElement('div');
                avatarDiv.className = \`chat-avatar \${type}\`;
                avatarDiv.innerHTML = avatarIcon;

                // Content
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.textContent = content;

                if (type === 'bot') {
                    messageDiv.appendChild(avatarDiv);
                    messageDiv.appendChild(contentDiv);
                } else {
                    messageDiv.appendChild(avatarDiv);
                    messageDiv.appendChild(contentDiv);
                }
                
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
                
                const btn = document.getElementById('send-button');
                const input = document.getElementById('message-input');

                btn.addEventListener('click', () => sendMessage(input.value));
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage(e.target.value);
                });
            }
            init();
        })();
    </script>
</body>
</html>`;
