const router = require('express').Router();

let User = require('../models/userModel');

router.route('/log').get((req, res) => {
   User.find()
         .then(exercises => res.json(exercises))
         .catch(err => res.status(400).json('Error ' + err))
 });


router.route('/log').get((req,res , next) =>{
  const userId = req.query.userId;
   let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;
  
    const limitOptions = {};
    if (limit) limitOptions.limit = limit;
  
  User.findById(userId)
      .populate({path: 'log', match: {}, select : '-_id', options: limitOptions})
      .exec((error, user) => {
      
        console.error('Testing invalid userId. After looking for the user, before if(error) and if(user).')
        console.error('error: ' + error);
        console.error('user: ' + user);
      
      if(error) return next(error);  // Acá sale el error.
        if (user){
          const dataToShow = {id: user._id, username: user.username, count: user.count};
          if (from) dataToShow.from = from.toDateString();
          if (to) dataToShow.to = to.toDateString();
          dataToShow.log = user.log.filter((ej) => {
            if (from && to) {
              return ej.date >= from && ej.date <= to;
            } else if (from) {
              return ej.date >= from;
           } else if (to) {
             return ej.date <= to;
           } else {
             return true;
           }
          });
          res.json(dataToShow);
        } else {
          next();
        }
    });
})
router.route('/add').post((req, res,next) => {
    
    const userId = req.body.userId;
    const description = req.body.description
    const duration = Number(req.body.duration)
  const date = (req.body.date) ? new Date(req.body.date) : new Date();

       User.findById(userId, (error, user) => {
          if(error) return next(error);
          if(user){ 
      user.count = user.count + 1;
      const newExercise = {description: description, duration: duration, date: date};
      user.log.push(newExercise);
          }
       user.save()
         const dataToShow = { 
            username: user.username,
            _id: user._id,
            description: description,
            duration: duration,
            date: date.toDateString()
          };
          res.json(dataToShow);
       })
  
  

});




router.route('/users').get((req,res)=>{
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error ' + err))
});

router.route('/new-user').post((req,res, next)=>{
    const username = req.body.username;
   if(username){
         const newUser ={username ,  count: 0, log: []};
    User.findOne({username : newUser.username}, (error, data) => {
      if (error) return next(error);
      if (data) {
        res.send("That username is already taken.");
      } else {
        User.create(newUser, (error, user) => {
          if (error) return next(error);
          res.json({username: user.username, id: user._id});
        });
      }
    });
   }else{
     res.send("You need to provide a username.");
   }

  
});




module.exports = router;