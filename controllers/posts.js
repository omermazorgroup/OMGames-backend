const Post = require('../models/post');
const User = require('../models/user');
exports.createPost = (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  let imagePath = ""

  if(req.file === undefined){
    imagePath = url + "/images/" + "no-hfgimage.png";
  }
  else {
    imagePath = url + "/images/" + req.file.filename;

  }
  const post = new Post({
    now: req.body.now,
    turbo: req.body.turbo,
    title: req.body.title,
    content: req.body.content,
     imagePath: imagePath, //url + "/images/" + req.file.filename,
    creator: 'Omer'
    //req.userData.userId

  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        _id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    })
  })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: 'Omer'
    //req.userData.userId
  });
  Post.updateOne({_id: req.params.id,creator:req.userData.userId}, post).then(result => {
    if (result.n > 0){
    res.status(200).json({message: "Update succesful!"});
    } else {
      res.status(401).json({ message: "Not autorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();;
  let fetchedPosts;
  if (pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments();
    })
    .then(count => {
    res.status(200).json({
      message: 'Posts fetched succesfuly',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failded!"
    });
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.n){
    res.status(200).json({message: "Post deleted!"});
    }else{
      res.status(401).json({message: "Not autorization!"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  })

}

exports.addScore = (req, res, next) => {
   User.findById(req.userData.userId).then((user) => {
    if (user.score > req.body.score) {
      return res.status(200).json({});
     }
     user.score = req.body.score;
     user.save().then(updateUser => {
      res.status(201).json({
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Updating a user failed!'
      })
    })
  })

}
