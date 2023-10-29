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
var cors = require('cors');

server.use(express.json());
server.use(cors());

let db;
mongoose.connect('mongodb://127.0.0.1:27017/buyDB').then((dbConnection) =>
{
  db = dbConnection;
  afterwards();
});
//mongod --dbpath "C:\Users\Acer\Desktop\Files\React\App-Node-React\server\data"

function afterwards()
{

  //Layout for profiles
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



  //Layout for Posts
  const postSchema =
  {
    poster: String,
    title: String,
    city: String,
    district: String,
    description: String,
    date: String,
    price: Number,
    status: String,
    images:Array
  };



  const reportSchema =
  {
    reporter: String,
    postId: String,
    reason: String,
    date: String,
    status: String
  };

  const Post = mongoose.model('Post', postSchema);
  const Report = mongoose.model('Report', reportSchema);
  const Profile = mongoose.model('Profile', profileSchema);

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


  server.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/login',
    failureFlash: true
  }));

  server.get("/api", checkAuthenticated, (req, res) =>
  {
    res.json({ "users": ["userOne", "userTwo", "userThree"] });
  });

  server.get("/auth", async (req, res) =>
  {
    if (req.isAuthenticated()) {
      console.log("authentication successed");
      const user = await req.user;
      res.json({
        "auth": true,
        "mod": user.isMod,
        "admin": user.isAdmin
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

      const newProfile = new Profile({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        index: "",
        phone: "none",
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
    console.log("Started Registration");
    console.log(req.body);

    const user = await req.user;
    const post = await req.body;

    try {
      const newPost = new Post({
        poster: user._id,
        title: post.title,
        city: post.city,
        district: post.district,
        description: post.description,
        price: post.price,
        date: Date.now(),
        status: "active",
        images: post.images
      });

      console.log("Posting \n" + newPost);
      newPost.save();
      res.status(200).json({ message: 'Post successfully submitted' });







      // res.redirect('/login');
    } catch (err) {
      console.log(err);

    }
  });

  server.post('/posts', checkAuthenticated, async (req, res) =>
  {
    console.log(req.body);
    Post.find().then(posts =>
    {
      console.log(posts);
      const filteredArray = posts.filter(post =>
      {
        //Filtering Posts
        return (
          post &&
          ((post.title && post.title.includes(req.body.search)) ||
            (post.description && post.description.includes(req.body.search))) &&
          (post.city && post.city.includes(req.body.city)) &&
          (post.district && post.district.includes(req.body.district)) &&
          (post.price &&
            post.price > req.body.minPrice &&
            post.price < req.body.maxPrice)
        );
      });
      console.log(filteredArray);
      res.json({
        filteredArray
      });
    });
  });

  server.post('/users', checkAuthenticated, async (req, res) =>
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


      // res.redirect('/login');
    } catch (err) {
      console.log(err);

    }
  });

  server.post('/reports', checkAuthenticated, async (req, res) =>
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

  server.post('/setreportstatus', checkAuthenticated, async (req, res) => { 
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

  server.delete('/logout', (req, res) =>
  {
    req.logOut(() =>
    {
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
    console.log("Checking Authentication");
    if (req.isAuthenticated()) {
      console.log('success!');
      return next();
    }


    res.redirect('/login');
  }


  server.listen(5000, () => { console.log("Server started on port 5000"); });

}





