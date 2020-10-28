export default class User {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add(name) {
    return fetch(this.url, {
      body: JSON.stringify(name),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  remove(name) {
    return fetch(`${this.url}/${name}`, {
      method: 'DELETE',
    });
  }
}
