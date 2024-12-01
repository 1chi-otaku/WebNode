import jwt from "jsonwebtoken";

class Secure {
  generateAccessToken(data) {
    return jwt.sign(data, process.env.ACCESS_KEY_JWT, { expiresIn: "15m" });
  }

  generateRefreshToken(data) {
    return jwt.sign(data, process.env.REFRESH_KEY_JWT, { expiresIn: "7d" });
  }

  authenticateToken(req, res, next) {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];
    if (token == null) {
      return res.sendStatus(401);
    } else {
      jwt.verify(token, process.env.ACCESS_KEY_JWT, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          req.user = user;
          next();
        }
      });
    }
  }


  refreshAccessToken(req, res) {
    const refreshToken = req.cookies["refresh_token"];
    if (refreshToken == null) {
      return res.sendStatus(401); 
    }
    jwt.verify(refreshToken, process.env.REFRESH_KEY_JWT, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }
      const newAccessToken = this.generateAccessToken({ login: user.login, email: user.email });
      res.json({ accessToken: newAccessToken });
    });
  }
}

export default new Secure();
