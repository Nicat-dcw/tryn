[![npm version](https://img.shields.io/npm/v/tryn.svg)](https://www.npmjs.com/package/tryn)
[![GitHub](https://img.shields.io/github/license/username/repo.svg)](https://github.com/Nicat-dcw/tryn)
# 🚀 Tryn

Tryn is a lightweight and flexible web server module for Node.js. It allows you to quickly build and handle HTTP servers with ease.

## ✨ Features

- 🌐 Handles HTTP requests and routes them to the corresponding handlers.
- 📡 Supports GET, POST, DELETE, PATCH, and PUT methods.
- 🚦 Middleware support for extending the server's functionality.
- 💅 Response formatting using the `Prettier` class.
- 🧩 Easy-to-use API for defining routes and handling requests.
- ⚡ Graceful server shutdown with the `close` method.

## 📦 Installation

You can install Tryn using npm:

```shell
npm install tryn
```

## 🚀 Usage

Here's a basic example of how to use Tryn:

```javascript
import { Server, Prettier } from 'tryn';

const server = new Server({ port: 8080, prettier: new Prettier() });

server.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

server.listen(8080, () => {
  console.log('Tryn server is running on port 8080');
});
```

You can define routes using the server's methods (`get`, `post`, `delete`, `patch`, `put`), and you can also add middleware functions to extend the server's functionality using the `use` method.

## 🤝 Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## ⭐️ GitHub

[![GitHub stars](https://img.shields.io/github/stars/Nicat-dcw/tryn.svg?style=social)](https://github.com/Nicat-dcw/tryn)
---
