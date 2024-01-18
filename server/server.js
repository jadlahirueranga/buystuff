if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const server = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require("mongoose");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const axios = require('axios');
var cors = require('cors');

server.use(express.json());
server.use(cors());

let db;
mongoose.connect('mongodb+srv://lahiru:lahiru1999@cluster0.9futnla.mongodb.net/buyDB').then((dbConnection) =>
{
  db = dbConnection;
  afterwards();
});


function afterwards()
{


  const profileSchema =
  {
    name: String,
    email: String,
    password: String,
    index: String,
    phone: String,
    isAdmin: Boolean,
    isMod: Boolean,
    notifications: Array,
    status: String,
    picture: String
  };




  const postSchema =
  {
    poster: String,
    posterName: String,
    posterMail: String,
    title: String,
    city: String,
    district: String,
    description: String,
    date: String,
    price: Number,
    status: String,
    images: Array,
    type: String,
    color: String,
    comments: Array
  };



  const reportSchema =
  {
    reporter: String,
    postId: String,
    reason: String,
    date: String,
    status: String
  };

  const messageSchema =
  {
    message: String,
    sender: String,
    senderName: String,
    receiver: String,
    receiverName: String,
    date: String,
    status: String,
    type: String
  };

  const Post = mongoose.model('Post', postSchema);
  const Report = mongoose.model('Report', reportSchema);
  const Profile = mongoose.model('Profile', profileSchema);
  const Message = mongoose.model('Message', messageSchema);

  const initializePassport = require('./passport-config');

  initializePassport(passport,
    async (email) =>
    {
      try {
        const foundProfile = await Profile.findOne({ email: email });
        return foundProfile;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async (id) =>
    {
      try {
        const foundProfile = await Profile.findOne({ _id: id });
        return foundProfile;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );



  server.set('view-engine', 'ejs');
  server.use(express.urlencoded({ extended: false }));
  server.use(flash());
  server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(methodOverride('_method'));
  server.use(express.static(__dirname + '/public'));


  server.post('/login', checkNotAuthenticated, (req, res, next) =>
  {
    passport.authenticate('local', (err, user, info) =>
    {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      req.logIn(user, (err) =>
      {
        if (err) {
          return next(err);
        }

        return res.json({ message: 'Login successful', user });
      });
    })(req, res, next);
  });
  server.post('/imgbb/upload', async (req, res) =>
  {
    try {
      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        req.body,
        {
          params: {
            key: '1ad0dd967a53fdbc085cef85b993a32c',
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error forwarding ImgBB request:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  server.get("/auth", async (req, res) =>
  {
    if (req.isAuthenticated()) {
      console.log("authentication successed");
      const user = await req.user;
      res.json({
        "auth": true,
        "mod": user.isMod,
        "admin": user.isAdmin,
        "user": user
      });
      console.log(user);
      console.log("admin: " + user.isAdmin + "\nmod " + user.isMod);
    }
    else {
      console.log("authentication failed");
      res.json({
        "auth": false,
        "mod": false,
        "admin": false
      });
    }

  });

  server.post('/register', async (req, res) =>
  {
    console.log("Started Registration");
    console.log(req.body);

    const user = await req.user;
    const newUser = await req.body;

    if (req.isAuthenticated()) {
      //only allowing admins to create special accounts
      if (user.isAdmin == false) {
        newUser.admin = false;
        newUser.mod = false;
      }
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      var regexPattern = new RegExp("true");

      const lenghCheckers = [req.body.name, req.body.email, req.body.phone, req.body.profilePic];

      for (i = 0; i > lenghCheckers.length; i++) {
        if (lenghCheckers[i].length > 300 || lenghCheckers[i].length < 4) {
          return res.status(400).json({ error: 'Must have between 3 to 300 characters.' });
        }
      }

      if (req.body.password.length > 100 || req.body.password.length < 8) {
        return res.status(400).json({ error: 'Must have between 8 to 100 characters.' });
      }



      const newProfile = new Profile({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        index: "",
        phone: req.body.phone,
        isAdmin: regexPattern.test(newUser.admin),
        isMod: regexPattern.test(newUser.mod),
        notifications: [],
        status: "active",
        picture: req.body.profilePic
      });
      console.log("New profile \n " + newProfile);

      const similarEmail = await Profile.findOne({ email: newUser.email });



      if (similarEmail !== null) {
        console.log("Email already exists");
        res.status(400).json({ error: 'Email already exists' });
      } else if (newUser.password.length < 8 || newUser.name < 4 || newUser.password.length > 50 || newUser.name > 150) {
        console.log("Invalid length of name or password");
        res.status(400).json({ error: 'Invalid length of name or password' });
      } else {
        newProfile.save();
        res.status(200).json({ message: 'Profile successfully registered' });
      }



      // res.redirect('/login');
    } catch (err) {
      console.log(err);

    }
  });

  //new post
  server.post('/post', checkAuthenticated, async (req, res) =>
  {
    console.log("Started Posting");
    console.log(req.body);

    const user = await req.user;
    const post = await req.body;


    const lenghCheckers = [user.id, user.email, user.name, post.title, post.city, post.district, post.description, post.price, post.type, post.color];

    post.images = post.images.slice(0, 5);

    for (i = 0; i > lenghCheckers.length; i++) {
      if (lenghCheckers[i].length > 300 || lenghCheckers[i].length < 4) {
        return res.status(400).json({ error: 'Must have between 3 to 300 characters.' });
      }
    }


    try {
      const newPost = new Post({
        poster: user._id,
        posterName: user.name,
        posterMail: user.email,
        title: post.title,
        city: post.city,
        district: post.district,
        description: post.description,
        price: post.price,
        date: Date.now(),
        status: "active",
        images: post.images,
        type: post.type,
        color: post.color,
        comments: []
      });

      console.log("Posting \n" + newPost);
      newPost.save();
      res.status(200).json({ message: 'Post successfully submitted' });
    } catch (err) {
      console.log(err);

    }
  });

  server.post('/posts', async (req, res) =>
  {
    console.log(req.body);
    Post.find().then(posts =>
    {
      const pageSize = 5;
      const start = req.body.page * pageSize;

      // posts = posts.slice(start, start + pageSize);
      const filteredArray = posts.filter(post =>
      {
        //Filtering Posts
        return (
          post &&
          (
            (post.title && post.title.includes(req.body.search)) ||
            (post.description && post.description.includes(req.body.search))) &&
          (post.city && post.city.includes(req.body.city)) &&
          (post.district && post.district.includes(req.body.district)) &&
          (post.type && post.type.includes(req.body.type)) &&
          (post.color && post.color.includes(req.body.color)) &&
          (post.color && (((post.color !== req.body.color) && (post.color !== "forumPost")) || ((post.color === req.body.color) && (post.color === "forumPost")))) &&
          (post.status && post.status.includes(req.body.status)) &&
          (post.price &&
            post.price > req.body.minPrice &&
            post.price < req.body.maxPrice)
        );
      });


      console.log("---------------------------" + filteredArray);
      res.json({
        filteredArray
      });
    });
  });

  server.post('/users', checkAdminAuthenticated, async (req, res) =>
  {
    console.log(req.body);
    Profile.find().then(users =>
    {
      const filteredArray = users.filter(user =>
      {
        //Filtering Posts
        return (
          user &&
          ((user.email && user.email.includes(req.body.search)) ||
            (user.phone && user.phone.includes(req.body.search))
          ));
      });
      console.log(filteredArray);
      res.json({
        filteredArray
      });
    });
  });

  server.post('/report', checkAuthenticated, async (req, res) =>
  {
    console.log("Submitting Report");
    console.log(req.body);

    const user = await req.user;
    const report = await req.body;

    if (report.reason.length > 300 || report.reason.length < 4) {
      return res.status(400).json({ error: 'Report is too long. Maximum allowed length is 300 characters.' });
    }

    try {
      const newReport = new Report({
        reporter: user._id,
        postId: report.postId,
        reason: report.reason,
        date: Date.now(),
        status: "pending"
      });

      console.log("Reporting \n" + newReport);
      newReport.save();
      res.status(200).json({ message: 'Successfully Reported' });

    } catch (err) {
      console.log(err);
    }
  });


  server.post('/message', checkAuthenticated, async (req, res) =>
  {
    console.log("Sending Message");
    console.log(req.body);

    const user = await req.user;
    const message = await req.body;
    const receiver = await Profile.findOne({ _id: message.receiver });



    var isSpecial = false;
    if (user.isAdmin || user.isMod) {
      isSpecial = true;
    }

    if (message.message.length > 300 || message.message.length < 1) {
      return res.status(400).json({ error: 'Message is too long. Maximum allowed length is 300 characters.' });
    }

    try {
      const newMessage = new Message({
        sender: user._id,
        senderName: user.name,
        receiver: message.receiver,
        receiverName: receiver.name,
        message: message.message,
        date: Date.now(),
        status: "pending",
        type: isSpecial
      });

      console.log("Sending \n" + newMessage);
      newMessage.save();

      await Profile.updateOne(
        { _id: message.receiver },
        { $push: { notifications: newMessage } }
      );

      res.status(200).json({ message: 'Successfully Sent' });


    } catch (err) {
      console.log(err);

    }
  });

  server.post('/viewmessages', checkAuthenticated, async (req, res) =>
  {
    const message = await req.body;
    const user = await req.user;

    console.log(message + "\n to" + user);

    const receiver = await Profile.findOne({ _id: message.receiver });
    console.log('receiver ' + receiver.email);

    try {
      const messages = await Message.find({
        $or: [
          { sender: user._id, receiver: message.receiver },
          { sender: message.receiver, receiver: user._id }
        ]
      }).exec();

      res.json({
        messages, receiver
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  server.post('/messages', checkAuthenticated, async (req, res) =>
  {
    try {
      const user = await req.user;

      const messages = await Message.find({
        $or: [
          { sender: user._id },
          { receiver: user._id }
        ]
      }).exec();

      await Profile.updateOne(
        { _id: user._id },
        { notifications: [] }
      );

      const uniqueUserIds = Array.from(new Set(messages.map(message => String(message.sender) === String(user._id) ? String(message.receiver) : String(message.sender))));

      var profiles = await Profile.find({ _id: { $in: uniqueUserIds } }).exec();

      profiles.sort((profileA, profileB) =>
      {
        const dateA = getMostRecentMessageDate(user._id, profileA._id, messages);
        const dateB = getMostRecentMessageDate(user._id, profileB._id, messages);

        return dateB - dateA;
      });
      profiles = profiles.slice(0, 100);
      res.json({
        profiles
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.post('/comments', checkAuthenticated, async (req, res) =>
  {
    try {
      const user = await req.user;
      const body = await req.body;

      const post = await Post.find({
        _id: body.receiver,
        type: comment
      }).exec();



      res.json({
        post
      });
    } catch (error) {
      console.error('Error fetching commen ts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.post('/comment', checkAuthenticated, async (req, res) =>
  {
    console.log("Commenting");
    console.log(req.body);

    const user = await req.user;
    const body = await req.body;
    const receiver = await Post.findOne({ _id: body.receiver });


    if (body.comment.length > 300 || body.comment.length < 1) {
      return res.status(400).json({ error: 'Message is too long. Maximum allowed length is 300 characters.' });
    }

    var isSpecial = false;
    if (user.isAdmin || user.isMod) {
      isSpecial = true;
    }

    try {
      const newComment = new Message({
        sender: user._id,
        senderName: user.name,
        receiver: body.receiver,
        receiverName: receiver.postName,
        message: body.comment,
        date: Date.now(),
        status: "pending",
        type: isSpecial
      });


      await Post.updateOne(
        { _id: body.receiver },
        { $push: { comments: newComment } }
      );

      res.status(200).json({ message: 'the comment has been posted' });


    } catch (err) {
      console.log(err);

    }
  });


  function getMostRecentMessageDate(userId, profileId, messages)
  {
    const filteredMessages = messages.filter(message => (String(message.sender) === String(userId) && String(message.receiver) === String(profileId)) || (String(message.sender) === String(profileId) && String(message.receiver) === String(userId)));
    const mostRecentMessage = filteredMessages.reduce((prev, current) => (current.date > prev.date ? current : prev), { date: 0 });
    return mostRecentMessage.date || 0;
  }


  server.post('/reports', checkAdminModAuthenticated, async (req, res) =>
  {
    console.log(req.body);
    Report.find({ status: req.body.status }).then(reports =>
    {
      console.log(reports);
      const filteredArray = reports.filter(report =>
      {
        //Filtering Reports
        return (
          report &&
          ((report.reason && report.reason.includes(req.body.search)))
        );
      });
      console.log(filteredArray);
      res.json({
        filteredArray
      });
    });
  });

  server.post('/setreportstatus', checkAdminAuthenticated, async (req, res) =>
  {
    const id = req.body.id;
    const status = req.body.status;


    try {
      const result = await Report.updateOne({ _id: id }, { $set: { status: status } });

      if (result.nModified === 1) {
        res.send('Status updated successfully');
      } else {
        res.send('No document found or status not updated');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  server.post('/user', checkAuthenticated, async (req, res) =>
  {
    const body = await req.body;
    const askedUser = await req.user;

    console.log(body + "\n to" + askedUser);

    const thisUser = await Profile.findOne({ _id: body.user });
    console.log('receiver ' + thisUser.email);

    res.json({
      thisUser, askedUser
    });

  });

  server.post('/changesetting', checkAuthenticated, async (req, res) =>
  {
    const { user, setting, newValue, checker } = await req.body;
    const thisUser = await req.user;

    if (newValue.length < 8 || newValue.length > 300) {
      res.status(500).send("Number of characters should be between 8 and 300");
    }
    const hashedPassword = await bcrypt.hash(newValue, 10);

    const currentUser = await Profile.findOne({ _id: thisUser._id });

    if (setting === 'password' && typeof currentUser !== 'undefined') {
      bcrypt.compare(checker, currentUser.password, function (err, result)
      {
        if (err || !result) {
          return res.status(401).json({ success: false, message: 'Old password incorrect' });
        }

        currentUser[setting] = hashedPassword;


        currentUser.save();

        res.json({ success: true, message: 'Changed successfully' });
      });
    } else {
      currentUser[setting] = newValue;


      currentUser.save();

      res.json({ success: true, message: 'Changed successfully' });
    }
  });

  server.post('/removepost', checkAdminModAuthenticated, async (req, res) =>
  {
    const id = req.body.id;
    const status = req.body.status;
    console.log('removing post');

    try {
      const result = await Post.updateOne({ _id: id }, { $set: { status: status } });

      if (result.nModified === 1) {
        res.send('Status updated successfully');
        console.log('Post has been removed');
      } else {
        res.send('No document found or status not updated');
        console.log('404');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  server.post('/getpost', checkAuthenticated, async (req, res) =>
  {
    const id = req.body.id;
    const user = await req.user;
    var post;
    try {
      if (user.isAdmin || user.isMod) {
        post = await Post.findOne({ _id: id });
      } else {
        post = await Post.findOne({ _id: id, status: "active" });
      }
      res.json({ post, success: true, message: 'Located successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });



  server.delete('/logout', (req, res) =>
  {
    req.logOut(() =>
    {
      console.log('logging out');
      res.redirect('/login');
    });
  });


  function checkNotAuthenticated(req, res, next)
  {
    console.log("Checking Authentication");
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }

  async function checkAuthenticated(req, res, next)
  {

    if (req.isAuthenticated()) {

      return next();
    }


    res.redirect('/login');
  }

  async function checkAdminModAuthenticated(req, res, next)
  {
    console.log("Checking Admin or Moderator Authentication");
    const user = await req.user;

    if (req.isAuthenticated() && (user.isAdmin || user.isMod)) {
      console.log('success!');
      return next();
    }


    res.redirect('/login');
  }

  async function checkAdminAuthenticated(req, res, next)
  {
    console.log("Checking Admin Authentication");
    const user = await req.user;

    if (req.isAuthenticated() && user.isAdmin) {
      console.log('success!');
      return next();
    }


    res.redirect('/login');
  }


  server.listen(5000, () => { console.log("Server started on port 5000"); });

}





