// NextProvider.js

import { Server, Prettier } from '../src/index.js';

const port = 8080; // Specify the desired port number

const prettier = new Prettier();
const NextProvider = new Server({ port, prettier });

export default NextProvider;