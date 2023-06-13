const { bold, yellow, blue, green, underline } = require('colorette');

class Logger {
  constructor() {
    this.log = this.log.bind(this);
  }

  log(req, res, next) {
    const start = Date.now();
    const { headers, connection } = req;
    const ip = headers["x-forwarded-for"];

    setTimeout(() => {
      const end = Date.now();
      // [DEPRECATED] res.setHeader("X-Response-Time", `${end - start}`);

      console.log(`${yellow("[TRYN]")} [${blue(req.method)}](${req.url}) ${underline(green(ip))} logged (${end - start}ms)`);

    }, 200);
  }
}

module.exports = Logger;