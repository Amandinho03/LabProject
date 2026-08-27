import pkg from "jsonwebtoken";
const { verify } = pkg;

const isAuth = (req) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login!");

  const token = authorization.split(" ")[1];
  const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
};

const requireAuth = (req, res, next) => {
  try {
    req.user = isAuth(req);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized! Please log in." });
  }
};

export { isAuth, requireAuth };