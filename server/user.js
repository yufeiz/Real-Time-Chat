const express =require('express')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const utils = require('utility')
const _filter = {'pwd':0, '__v':0}
Router.get('/list', function(req,res) {
  const type = req.query.type
  // User.remove({}, function(e,d) {})
  User.find({type}, function(err, doc) {
    return res.json({code:0, data:doc})
  })
})

Router.post('/update', function(req, res) {
  const userid = req.cookies.userid
  if(!userid) {
    return json.dump({code:1})
  }
  const body = req.body
  User.findByIdAndUpdate(userid, body, function(err, doc) {
    const data = Object.assign({},{
      user:doc.user,
      type:doc.type
    }, body)
    return res.json({code:0, data})
  })
})
Router.post('/login', function(req,res) {
  const user = req.body.user
  const pwd = req.body.pwd
  User.findOne({user,pwd:md5Pwd(pwd)},{'pwd':0}, function(err,doc) {
    if(!doc) {
      return res.json({code:1, msg:'invalid password or accout'})
    }
    res.cookie('userid', doc._id)
    return res.json({code:0, data:doc})
  })
})
Router.get('/info', function (req, res) {
  const userid = req.cookies.userid
  if(!userid) {
    return res.json({code:1})
  }
  User.findOne({_id: userid}, _filter, function(err,doc) {
    if(err) {
      return res.json({code:1, msg:'backend broken'})
    }
    return res.json({code:0, data:doc})
  })
})
Router.post('/register', function(req, res) {
  const user = req.body.user
  const pwd = req.body.pwd
  const type = req.body.type
  //

  // const {user, pwd, type} = req.body
  User.findOne({user:user}, function(err, doc) {
    if(doc) {
      return res.json({code:1, msg:'account repeat'})
    }

    // const userModel = new User({user,pwd:md5Pwd(pwd),type})
    // userModel.save(function(e, d) {
    //   if(e) {
    //     return res.json({code:1, msg:'backend wrong'})
    //   }
    //   const {user, type, _id} = d
    //   res.cookie('userid', _id)
    //   return res.json({code:0, data:{user, type, _id}})
    // })
    User.create({user,pwd:md5Pwd(pwd),type}, function(e,d) {
      if(e) {
        return res.json({code:1, msg:'backend wrong'})
      }
      const user = d.user
      const  _id = d._id
      const type = d.type
      res.cookie('userid', _id)
      return res.json({code:0, data:{user, type, _id}})
    })
  })
})

function md5Pwd(pwd) {
  const salt = 'imooc_is_good_3957x8yza6!#IUHJh~~'
  return utils.md5(utils.md5(pwd+salt))
}

module.exports = Router
