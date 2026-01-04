document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const taskList = document.getElementById('task-list');
    const refreshTasks = document.getElementById('refresh-tasks');

    // Initialize WebSocket connection
    const socket = new WebSocket('wss://your-backend-api.com/ws');

    // Handle WebSocket events
    socket.onopen = function(e) {
        console.log('WebSocket connection established');
        addSystemMessage('Connected to JARVIS. You can start giving commands.');
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_response') {
            addMessage(data.message, 'ai');
        } else if (data.type === 'task_update') {
            updateTaskStatus(data.task_id, data.status);
        } else if (data.type === 'system_message') {
            addSystemMessage(data.message);
        }
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.log('WebSocket connection died');
        }
        addSystemMessage('Disconnected from JARVIS. Attempting to reconnect...');
    };

    // Handle sending messages
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            socket.send(JSON.stringify({
                type: 'chat_message',
                message: message
            }));
            userInput.value = '';
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    refreshTasks.addEventListener('click', function() {
        // In a real implementation, this would fetch the latest tasks
        addSystemMessage('Refreshing task list...');
        // Simulate a task update
        setTimeout(() => {
            addTask('Update system packages', 'completed');
            addTask('Install new software', 'pending');
        }, 1000);
    });

    // Message handling functions
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addSystemMessage(message) {
        const systemMessage = document.createElement('div');
        systemMessage.classList.add('message', 'system');
        systemMessage.textContent = `[System] ${message}`;
        chatMessages.appendChild(systemMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTask(title, status) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item', status);

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = title;

        const taskStatus = document.createElement('p');
        taskStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);

        taskElement.appendChild(taskTitle);
        taskElement.appendChild(taskStatus);
        taskList.appendChild(taskElement);
    }

    function updateTaskStatus(taskId, status) {
        // In a real implementation, this would update a specific task
        console.log(`Updating task ${taskId} to ${status} status`);
        addSystemMessage(`Task updated: ${status}`);
    }

    // Initial setup
    addSystemMessage('Welcome to JARVIS. How can I assist you today?');
    addTask('Initial system check', 'completed');
    addTask('Monitoring system performance', 'pending');
})