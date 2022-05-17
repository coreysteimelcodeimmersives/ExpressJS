var express = require('express');
var router = express.Router();

let favMoviesArr = ['E.T.', 'Sound of Music', 'The Life Aquatic'];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title: 'Users'});
});

router.get('/myname', function(req, res){
  res.send('Corey');
});

router.get('/myfavoritemovies', function(req,res){
  res.json(favMoviesArr);
})

module.exports = router;