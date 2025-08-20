const API_KEY = '$2a$10$qB4L4EbvOZoyE2nwruanfOTWAJpV93/vcvEMnIwIXEayb89oAPcP6';
const BIN_ID = '68a51a47d0ea881f405dc3dc';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let currentUser = null;
let chatData = { users: [] };
let isLoading = false;

function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

async function loadChatData() {
    try {
        showLoading(true);
        
        console.log('Loading data from:', API_URL + '/latest');
        
        const response = await fetch(API_URL + '/latest', {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Load response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Loaded data:', result);
            chatData = result.record || { users: [] };
        } else {
            const errorData = await response.text();
            console.error('Load error:', response.status, errorData);
            chatData = { users: [] };
        }
    } catch (error) {
        console.error('Load error details:', error);
        chatData = { users: [] };
    } finally {
        showLoading(false);
    }
}

async function saveChatData() {
    try {
        showLoading(true);
        
        console.log('Saving data:', chatData);
        console.log('Using API Key:', API_KEY);
        console.log('Using Bin ID:', BIN_ID);
        
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json',
                'X-Bin-Meta': 'false'
            },
            body: JSON.stringify(chatData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const responseData = await response.text();
        console.log('Response data:', responseData);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseData}`);
        }
        
        console.log('Save successful!');
        
    } catch (error) {
        console.error('Save error details:', error);
        alert(`Failed to save message: ${error.message}\n\nPlease check:\n1. API Key is correct\n2. Bin exists and is accessible\n3. Network connection`);
    } finally {
        showLoading(false);
    }
}

function findOrCreateUser(name) {
    let user = chatData.users.find(u => u.name === name);
    if (!user) {
        user = {
            name: name,
            messages: []
        };
        chatData.users.push(user);
    }
    return user;
}

async function joinChat() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (name.length > 20) {
        alert('Name too long (max 20 characters)');
        return;
    }
    
    localStorage.setItem('chatUserName', name);
    
    await loadChatData();
    
    currentUser = findOrCreateUser(name);
    await saveChatData();
    
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    document.getElementById('userWelcome').textContent = `Welcome, ${name}!`;
    
    displayMessages();
    document.getElementById('messageInput').focus();
}

function displayMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';
    
    const allMessages = [];
    
    chatData.users.forEach(user => {
        user.messages.forEach(msgData => {
            const [time, message] = msgData.split(': ', 2);
            allMessages.push({
                user: user.name,
                time: time,
                message: message,
                isOwn: user.name === currentUser.name
            });
        });
    });
    
    allMessages.sort((a, b) => {
        const timeA = a.time.replace('AM', '').replace('PM', '');
        const timeB = b.time.replace('AM', '').replace('PM', '');
        return timeA.localeCompare(timeB);
    });
    
    if (allMessages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <p>Welcome to the private chat room! Start typing to begin the conversation.</p>
            </div>
        `;
        return;
    }
    
    allMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.isOwn ? 'own' : 'other'}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">${msg.user} • ${msg.time}</div>
            <div class="message-bubble">${escapeHtml(msg.message)}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isLoading) return;
    
    const time = getCurrentTime();
    const messageData = `${time}: ${message}`;
    
    currentUser.messages.push(messageData);
    
    input.value = '';
    updateCharCount();
    
    await saveChatData();
    displayMessages();
    
    input.focus();
}

function clearChat() {
    if (!confirm('Are you sure you want to clear all your messages?')) return;
    
    currentUser.messages = [];
    saveChatData();
    displayMessages();
}

function leaveChat() {
    if (confirm('Are you sure you want to leave the chat?')) {
        localStorage.removeItem('chatUserName');
        location.reload();
    }
}

function updateCharCount() {
    const input = document.getElementById('messageInput');
    const counter = document.getElementById('charCount');
    const length = input.value.length;
    counter.textContent = `${length}/500`;
    
    if (length > 450) {
        counter.style.color = '#ff4444';
    } else if (length > 350) {
        counter.style.color = '#ff8800';
    } else {
        counter.style.color = '#666';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function initializeApp() {
    const savedName = localStorage.getItem('chatUserName');
    
    if (savedName) {
        document.getElementById('nameInput').value = savedName;
        setTimeout(() => joinChat(), 100);
    }
    
    document.getElementById('nameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
    
    document.getElementById('messageInput').addEventListener('keypress', handleKeyPress);
    document.getElementById('messageInput').addEventListener('input', updateCharCount);
    
    setInterval(async () => {
        if (currentUser && !isLoading) {
            await loadChatData();
            displayMessages();
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initializeApp);
