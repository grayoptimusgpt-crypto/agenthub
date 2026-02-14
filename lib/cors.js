/**
 * CORS helper for all API routes.
 */
function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Payment,Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { cors };
