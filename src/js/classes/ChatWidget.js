/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import User from './User';

export default class ChatWidget {
  constructor(name) {
    this.url = 'wss://qa-netology-chat.herokuapp.com/ws';
    this.user = new User('https://qa-netology-chat.herokuapp.com/contacts');
    this.currentUser = name;
    this.messages = document.getElementById('messages-list');
    this.input = document.getElementById('chat_input');
  }

  init() {
    this.server();
    this.drawUsers();
    this.action();
  }

  action() {
    this.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && this.input.value) {
        this.sendMessage(this.input.value);
        this.input.value = '';
      }
    });
    window.addEventListener('beforeunload', () => {
      this.ws.close();
      this.user.remove(this.currentUser);
      this.drawUsers();
    });
  }

  server() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('open', () => {
      console.log('connected');
    });
    this.ws.addEventListener('message', (event) => {
      this.drawMessage(event.data);
    });
    this.ws.addEventListener('close', (event) => {
      console.log('connection closed', event);
    });
    this.ws.addEventListener('error', () => {
      console.log('error');
    });
  }

  async drawUsers() {
    const response = await this.user.load();
    const contacts = await response.json();
    const users = document.getElementById('users');
    users.innerHTML = '';
    for (const contact of contacts) {
      const user = document.createElement('div');
      user.className = `user ${this.currentUser === contact.name ? 'current-user' : ''}`;
      user.innerHTML = `
        <span class="user-icon"></span><span class="user-name">${contact.name}</span>
      `;
      users.appendChild(user);
    }
  }

  drawMessage(data) {
    const { type } = JSON.parse(data);

    if (type === 'message') {
      const { name, text, date } = JSON.parse(data);
      const message = document.createElement('div');
      message.className = `message ${this.currentUser === name ? 'current-user' : ''}`;
      message.innerHTML = `
        <div class="message-header">
          <span class="user-login">${name}</span><span class="date">${date}</span>
        </div>
        <p class="message-content">${text}</p>
      `;
      this.messages.appendChild(message);
      this.messages.scrollTo(0, message.offsetTop);
    } else {
      this.drawUsers();
    }
  }

  sendMessage(text) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        name: this.currentUser,
        text,
        date: this.createDate(),
      }));
    } else {
      this.ws = new WebSocket(this.url);
    }
  }

  createDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
  }
}
