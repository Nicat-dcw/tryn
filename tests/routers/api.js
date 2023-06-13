import { Router } from '../../src/index.js';

const router = new Router();

router.get('/blabla', (req, res) => {
  res.write('Hello world!');
  res.end();
});

export default router;
