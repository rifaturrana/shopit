const User = require("../models/user");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

//Register a user =. /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/smiling-man_nykjej",
      url: "https://res.cloudinary.com/rifaturrana/image/upload/v1655002474/avatars/smiling-man_nykjej.jpg",
    },
  });

  sendToken(user, 200, res);
});

//Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email is enterd by user

  if (!email || !password) {
    return next(new Errorhandler("Please enter email & password", 400));
  }

  // finding user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid email or password", 400));
  }
  sendToken(user, 200, res);
});
