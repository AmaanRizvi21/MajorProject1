class expressErr extends Error {
  constructor(statusCode, message) {
    super(message); // ✅ Ye hona chahiye
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Optional, better debugging
  }
}

module.exports = expressErr;
