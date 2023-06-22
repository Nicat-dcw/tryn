class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit; // Maximum number of requests allowed within the interval
    this.interval = interval; // Time interval in milliseconds
    this.requests = new Map(); // Map to track requests with their timestamps
    this.checkRateLimit = this.checkRateLimit.bind(this);
  }

  checkRateLimit(req, res, next) {
    const ip = req.socket.remoteAddress; // Extract IP address from the request
    const currentTime = Date.now();

    // Check if the IP address exists in the requests map
    if (this.requests.has(ip)) {
      const requestsByIP = this.requests.get(ip);

      // Remove requests that are older than the interval
      const recentRequests = requestsByIP.filter((timestamp) => currentTime - timestamp <= this.interval);

      // Check if the number of recent requests exceeds the limit
      if (recentRequests.length >= this.limit) {
        res.statusCode = 429; // Too Many Requests
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});  
        console.log("Requests")
        return res.end('Too many requests. Please try again later.');
      }

      // Update the requests map with the recent requests
      this.requests.set(ip, recentRequests);
    } else {
      // Add IP address to the requests map with the current timestamp
      this.requests.set(ip, [currentTime]);
    }
    
    next(); // Invoke the next middleware function
  }
}

export default RateLimiter;
