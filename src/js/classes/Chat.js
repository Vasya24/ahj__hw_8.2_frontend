import ChatWidget from './ChatWidget';
import User from './User';

export default class Chat {
  constructor() {
    this.user = new User('https://qa-netology-chat.herokuapp.com/contacts');
    this.form = document.forms.login;
    this.input = document.getElementById('login_input');
    this.error = document.querySelector('.tooltip');
    this.button = document.getElementById('login_button');
  }

  login() {
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const login = this.input.value;
      if (login) {
        const response = await this.user.load();
        const contacts = await response.json();
        if (contacts.findIndex((el) => el.name === login) === -1) {
          await this.user.add({ name: login });
          this.chatWidget = new ChatWidget(login);
          document.querySelector('.chat').classList.add('chat-active');
          this.chatWidget.init();
          this.input.value = '';
          this.form.classList.remove('login-form-active');
        } else {
          this.error.classList.add('tooltip-active');
          this.error.innerText = 'Данный логин уже существует.';
        }
      } else {
        this.error.classList.add('tooltip-active');
        this.error.innerText = 'Введите ваш логин, пожалуйста';
      }
    });
    this.input.addEventListener('input', () => {
      this.error.classList.remove('tooltip-active');
    });
  }
}
