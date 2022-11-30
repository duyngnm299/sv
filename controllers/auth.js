const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("config");
const User = require("../models/User");

let refreshTokens = [];
const authController = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  signInController: async (req, res) => {
    if (req.body.googleAccessToken) {
      // gogole-auth
      const { googleAccessToken } = req.body;
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo/", {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            Accept: "application / json",
          },
        })
        .then(async (response) => {
          const memberCode = Math.floor(100000 + Math.random() * 900000);
          const fullName =
            response.data.family_name + " " + response.data.given_name;
          const username = response.data.email;
          const email = response.data.email;
          const profilePicture =
            response.data.picture ||
            "https://scontent-hkg4-2.xx.fbcdn.net/v/t39.30808-6/248794374_1491385281237517_7930428664753935404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=5lauKy6zDsMAX9wvFT6&tn=VeXMx7MBEtEDqia-&_nc_ht=scontent-hkg4-2.xx&oh=00_AT9zAmle7fzxSbIGPvrXOsjlUnIraF6SkS8peSiVHZ7rAA&oe=63302978";
          const typeAccount = "google";
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            const user = await User.create({
              email,
              fullName,
              username,
              profilePicture,
              typeAccount,
              memberCode: "TPT" + memberCode,
            });
            console.log(user);
            const refreshToken = authController.generateRefreshToken(user);
            const accessToken = jwt.sign(
              {
                email: user.email,
                id: user._id,
              },
              config.get("JWT_SECRET"),
              { expiresIn: "30d" }
            );
            return res.status(200).json({ user, accessToken, refreshToken });
          } else {
            const refreshToken =
              authController.generateRefreshToken(existingUser);
            // Lưu refreshToken vào mảng
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: false,
              path: "/",
              sameSite: "strict",
            });
            // access token
            const accessToken = jwt.sign(
              {
                email: existingUser.email,
                id: existingUser._id,
              },
              config.get("JWT_SECRET"),
              { expiresIn: "30d" }
            );
            return res
              .status(200)
              .json({ user: existingUser, accessToken, refreshToken });
          }
        });
      // .catch((error) => {
      //   return res.json({ error });
      // });
    } else {
      if (req.body.username === "") {
        return res.status(400).json({ message: "Invalid username!" });
      }
      if (req.body.password === "") {
        return res.status(400).json({ message: "Invalid password!" });
      }
      try {
        const username = req.body.username;
        const password = req.body.password;

        const alreadyExistUser = await User.findOne({
          username: username,
        });

        if (!alreadyExistUser) {
          return res.status(400).json({ message: "User don't exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          alreadyExistUser.password
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Incorrect password!" });
        }

        if (alreadyExistUser && isPasswordCorrect) {
          const accessToken =
            authController.generateAccessToken(alreadyExistUser);
          const refreshToken =
            authController.generateRefreshToken(alreadyExistUser);
          // Lưu refreshToken vào mảng
          refreshTokens.push(refreshToken);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res
            .status(200)
            .json({ user: alreadyExistUser, refreshToken, accessToken });
        }
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
  },

  signUpController: async (req, res) => {
    // if (req.body.googleAccessToken) {
    //   const { googleAccessToken } = req.body;
    //   axios
    //     .get("https://www.googleapis.com/oauth2/v3/userinfo", {
    //       headers: {
    //         Authorization: `Bearer ${googleAccessToken}`,
    //         Accept: "application / json",
    //       },
    //     })
    //     .then(async (response) => {
    //       const memberCode = Math.floor(100000 + Math.random() * 900000);
    //       const fullName =
    //         response.data.given_name + " " + response.data.family_name;
    //       const username = response.data.email;
    //       const email = response.data.email;
    //       const picture =
    //         response.data.picture ||
    //         "https://scontent-hkg4-2.xx.fbcdn.net/v/t39.30808-6/248794374_1491385281237517_7930428664753935404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=5lauKy6zDsMAX9wvFT6&tn=VeXMx7MBEtEDqia-&_nc_ht=scontent-hkg4-2.xx&oh=00_AT9zAmle7fzxSbIGPvrXOsjlUnIraF6SkS8peSiVHZ7rAA&oe=63302978";

    //       const existingUser = await User.findOne({ email });
    //       if (existingUser) {
    //         const refreshToken =
    //           authController.generateRefreshToken(existingUser);
    //         // Lưu refreshToken vào mảng
    //         refreshTokens.push(refreshToken);
    //         res.cookie("refreshToken", refreshToken, {
    //           httpOnly: true,
    //           secure: false,
    //           path: "/",
    //           sameSite: "strict",
    //         });
    //         // access token
    //         const accessToken = jwt.sign(
    //           {
    //             email: existingUser.email,
    //             id: existingUser._id,
    //           },
    //           config.get("JWT_SECRET"),
    //           { expiresIn: "30d" }
    //         );

    //         return res
    //           .status(200)
    //           .json({ user: existingUser, accessToken, refreshToken });
    //       } else {
    //         const user = await User.create({
    //           email,
    //           fullName,
    //           username,
    //           profilePicture: picture,
    //           memberCode: "TPT" + memberCode,
    //         });
    //         const refreshToken = this.generateRefreshToken(existingUser);
    //         const accessToken = jwt.sign(
    //           {
    //             email: existingUser.email,
    //             id: existingUser._id,
    //           },
    //           config.get("JWT_SECRET"),
    //           { expiresIn: "30d" }
    //         );

    //         return res.status(200).json({ user, accessToken, refreshToken });
    //       }
    //     })
    //     .catch((err) => {
    //       return err;
    //     });
    // } else {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      const hashPassword = await bcrypt.hash(password, 12);
      const existingEmail = await User.findOne({ email });
      const existingUsername = await User.findOne({ username });
      const memberCode = Math.floor(100000 + Math.random() * 900000);
      if (existingUsername) {
        return res.status(400).json("Username existed!");
      } else if (existingEmail) {
        return res.status(400).json("Email existed!");
      } else if (!password || password.length < 8) {
        return res.status(400).json("Invalid password!");
      } else if (password !== confirmPassword) {
        return res.status(400).json("Incorrect password!");
      }

      const user = await User.create({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        memberCode: "TPT" + memberCode,
      });

      res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
    // }
  },

  requestRefreshToken: async (req, res) => {
    // Lấy refreshToken từ user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json("You are not authenticated!");

    // Nếu mảng không chứa refresh token cũ thì báo lỗi
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid!");
    }
    // Verify refreshToken. Nếu lỗi thì báo lỗi, nếu không lỗi thì sau khi accessToken hết hạn (30s),
    // thì sẽ dùng refreshToken cũ để tạo accessToken và refreshToken mới.

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      // Lọc mảng để xóa refreshToken cũ
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // Create new refreshToken, accessToken
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      // Thêm newRefreshToken vào mảng
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out!");
  },
};

module.exports = authController;
