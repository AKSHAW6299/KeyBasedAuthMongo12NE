import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey)
    return res.status(401).json({ message: "API key required" });

  const users = await User.find();

  let validUser = null;

  for (const user of users) {
    if (user.api_key_hash && bcrypt.compareSync(apiKey, user.api_key_hash)) {
      validUser = user;
      break;
    }
  }

  if (!validUser)
    return res.status(403).json({ message: "Invalid API key" });

  req.user = validUser;
  next();
};
