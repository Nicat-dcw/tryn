import { bold, yellow, blue, green, underline, red } from 'colorette';
import DeviceDetector from "node-device-detector";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
class Logger {
  constructor() {
    this.log = this.log.bind(this);
  }

  log(req, res, next) {
    try {
    const start = Date.now();
    const { headers, connection } = req;
    const ip = headers["x-forwarded-for"]
    setTimeout(() => {
      const end = Date.now();
      // [DEPRECATED] res.setHeader("X-Response-Time", `${end - start}`);

      console.log(`${yellow("[TRYN]")} [${blue(req.method)}](${req.url}) ${underline(green(ip))} logged (${end - start}ms)`);
      
    }, 200);
  } catch (err) {
    console.error(`${red('[TRYN]')} An error occurred:`, err);

    res.statusCode = 500;
    res.json({ error: 'Internal Server Error', status: 500 });
  }
  }
/*logDevices(req,res,next) {
   if(!this.logDevices) return;
   try {
    const start = Date.now();
    const { headers, connection } = req;
    const ip = headers["x-forwarded-for"]
    const agent = headers["user-agent"]
    setTimeout(() => {
      const result = detector.detect(agent)
      const end = Date.now();
      // [DEPRECATED] res.setHeader("X-Response-Time", `${end - start}`);

      console.log(`${yellow("[TRYN]")} [${blue(req.method)}](${req.url}) ${underline(green(ip))}[${result.client.name}] logged (${end - start}ms)`);

    }, 200);
  } catch (err) {
    console.error(`${red('[TRYN]')} An error occurred:`, err);

    //res.statusCode = 500;
    res.json({ error: 'Internal Server Error', status: 500 });
   }  
}*/
}

export default Logger;
