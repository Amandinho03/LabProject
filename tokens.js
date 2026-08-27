import jwt from "jsonwebtoken";

const createAccessToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" },
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

const sendAccessToken = (req, res, accesstoken) => {
  res
    .status(200)
    .json({ success: true, accesstoken, username: req.body.username });
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};