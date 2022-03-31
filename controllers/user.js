const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require('nodemailer');

var random;

exports.getUsernames = (req, res, next) => {
  const usersQuery = User.find();
  let fetchUsernames = [];
  usersQuery.then(documents => {
    documents.forEach(user => {
      fetchUsernames.push(user.fullname)
    })
    res.status(200).json({
      usernames: fetchUsernames
    });
  })
}

exports.checkEmail = async (req, res, next) => {
  let user = await User.findOne({email: req.body.email})
  if(user) {
    return res.status(201).json({
      isEmailExist: true
    })
  }
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smpt.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: "omermazorgroup@gmail.com",
      pass: 'sdeuchbhqwuzorxv'
    }
  });
  random = Math.floor(Math.random() * 100000);
  let info = await transporter.sendMail({
    from: 'omermazorgroup@gmail.com', // sender address
    to: `${req.body.email}`, // list of receivers
    subject: "your code from OMGames ", // Subject line
    text: "your code is 2334", // plain text body
    html: `<div style='background-color:yellow;'> <b>Your code is:${random}</b> </7div>`, // html body
  });
  transporter.sendMail(info, (error, info) => {
    if (error){
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  })
  return res.status(201).json({
    email: req.body.email,
    isEmailExist: false
  })
}

exports.onVerify = async (req, res, next) => {
  console.log(random);
  if(random !== req.body.random) {
    return res.status(200).json({
      isVerify: false
    })
  }
  return res.status(200).json({
    isVerify: true
  })
}


exports.createUser = async (req, res, next) => {
  try {
    console.log(req.body.email);
  let isEmailExist = await User.findOne({email: req.body.email})
  if(isEmailExist) {
    return res.status(401).json({
      message: "Email is already exist!"
    });
  }
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      address: req.body.address
    });

    user.save().then((result) => {
     return res.status(201).json({
        message: 'User created!',
        result: result,
        isSignup: true
      });
    }).catch(err => {
      return res.status(500).json({
          message: "User name or email already exits!"

      });
    });
  }).catch(e => {
    console.log(e);
  })
  }
catch(err) {
 console.log(err);
}

}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email}).then((user) => {
    if(!user){
      return res.status(401).json({
        message: "Auth failed!"
      });
    }
    fetchedUser = user;
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid  Password!"
      });
    };
    if(user && isMatch){
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "secret_this_should_be_longer",
    {expiresIn: "1h" });
    fetchedUser.email = undefined;
    fetchedUser.password = undefined;
     return res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      user: fetchedUser
    })
  }

   })


  })



}

exports.getUsers = (req, res, next) => {
  const usersQuery = User.find();
  let fetchUsers = [];
  usersQuery.then(documents => {
    documents.forEach(user => {
      user.email = undefined;
      user.password = undefined;
      fetchUsers.push(user)
    })
    res.status(200).json({
      users: fetchUsers
    });
  })
}

exports.getAuthUser = async (req, res, next) => {
  const userQuery = await User.findById(req.params.id);
  let fetchUser =userQuery;
      fetchUser.email = undefined;
      fetchUser.password = undefined;
    res.status(200).json({
      user:fetchUser
    });

}

exports.editUser = (req, res, next) => {
  User.findById(req.userData.userId).then((user) => {
    user.address = req.body.address;
    user.save().then((result) => {
      return res.status(201).json({

       });
     }).catch(err => {
       return res.status(500).json({
       });
     });
  })
}
