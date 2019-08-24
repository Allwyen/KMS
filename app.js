const Express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Mongoose = require('mongoose');

var app = new Express();

app.set('view engine','ejs'); 

app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose.connect("mongodb://localhost:27017/kms");
Mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-ucvz5.mongodb.net/KMS?retryWrites=true&w=majority");

const UserModel= Mongoose.model("user",{
  kemail:String,
  kname:String,
  kmob:String,
  kdob:String,
  kpass:String,
  kcpass:String,
  kaddress:String,
  kunit:String,
  kdist:String,
  kpin:String,
  kstatus:{
    type:String,
    default:"0"
  }
});

const WorkModel= Mongoose.model("work",{
  kemail:String,
  kwdesc:String,
  kwplace:String,
  kwsalary:String,
  kwstatus:{
    type:String,
    default:"0"
  }
});


app.get('/',(req,res)=>{
  res.render('login')
});

app.get('/loginAPI',(req,res)=>{
  var item1 = req.query.kemail;
  var item2 = req.query.kpass;
  var result = UserModel.find({$and:[{kemail:item1},{kpass:item2}]},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
      
  })
})

const APIurl1 = "http://kudumbasreems.herokuapp.com/loginAPI"

app.post('/kmslogin',(req,res)=>{
  var item1 = req.body.kemail;
  var item2 = req.body.kpass;

  request(APIurl1+"/?kemail="+item1+"&&kpass="+item2,(error,response,body)=>{
      var data = JSON.parse(body);
      const userdata = data;

      console.log(data);
      if(data.length>0){

          if(item1==data[0].kemail && item2==data[0].kpass)
          {
              //res.send(data.euname);
              if(item1=="admin@gmail.com" && item2=="admin123")
              {
                res.render('adminhome');
              }
              else
              {
                if(data[0].kstatus != "1")
                {
                  res.send("<script>alert('Admin not approved to LogIn')</script><script>window.location.href='/'</script>");
                }
                else
                {
                  res.render('userhome',{data:data[0]});
                }
               
              }
          }


      }
      else{
          res.send("<script>alert('Username/Password does not match')</script><script>window.location.href='/'</script>");
          
      }


  });
});

app.get('/register',(req,res)=>{
    res.render('register')
});

app.post('/kmsregister',(req,res)=>{
  //var items=req.body;
  //res.render('read',{item:items});

  var user = new UserModel(req.body);
  var result = user.save((error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send("<script>alert('User Successfully Registered')</script><script>window.location.href='/register'</script>");
      }
  });

});

app.get('/adminhome',(req,res)=>{
    res.render('adminhome');
});

app.get('/viewall',(req,res)=>{
  var result = UserModel.find((error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
  });
});

const APIurl2 = "http://kudumbasreems.herokuapp.com/viewall";

app.get('/viewmember',(req,res)=>{
  request(APIurl2,(error,response,body)=>{
      var data = JSON.parse(body);
      res.render('viewmember',{data:data});
  });
  
});

app.get('/searchmember',(req,res)=>{
    res.render('searchmember');
});;

app.get('/membersingle',(req,res)=>{
  var item = req.query.q;
  var result = UserModel.findOne({kname:item},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
  });
});

const APIurl3 = "http://kudumbasreems.herokuapp.com/membersingle";

app.post('/memberone',(req,res)=>{
  const x= req.body.kname;
  request(APIurl3+"/?q="+x,(error,response,body)=>{
      var data = JSON.parse(body);
      //console.log(book);
      res.render('membersingle',{data:data});
  });
});

app.get('/assigntask',(req,res)=>{
  request(APIurl2,(error,response,body)=>{
    var data = JSON.parse(body);
    res.render('assigntask',{data:data});
  });
});

app.post('/assignmember',(req,res)=>{
  //var items=req.body;
  //res.render('read',{item:items});

  var work = new WorkModel(req.body);
  var result = work.save((error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send("<script>alert('Work assigned successfully!!')</script><script>window.location.href='/assigntask'</script>");
      }
  });

});

app.get('/workall',(req,res)=>{
  var result = WorkModel.find((error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
  });
});

const APIUrl4 = "http://kudumbasreems.herokuapp.com/workall";

app.get('/viewtask',(req,res)=>{
  request(APIUrl4,(error,response,body)=>{
      var data = JSON.parse(body);
      res.render('viewtask',{data:data});
  });
  
});

app.get('/setstatus',(req,res)=>{
  var item = req.query.q;
  if(req.query.r== "0")
  {
    var result = UserModel.updateOne({kemail:item},{$set:{kstatus:"1"}},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
    });
  }
  else
  {
    var result = UserModel.updateOne({kemail:item},{$set:{kstatus:"0"}},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
    });
  }
  
});

const APIUrl5 = "http://kudumbasreems.herokuapp.com/setstatus";

app.get('/memberstatus/:kemail/:kstatus',(req,res)=>{
  const x= req.params.kemail;
  const y= req.params.kstatus;
  request(APIUrl5+"/?q="+x+"&&r="+y,(error,response,body)=>{

      res.send("<script>window.location.href='/viewmember'</script>");
  });
});

app.get('/taskall',(req,res)=>{
  var result = WorkModel.find((error,data)=>{
    if(error)
    {
      throw error;
      res.send(error);
    }
    else
    {
      res.send(data);
    }
  });
});

const APIUrl6 = "http://kudumbasreems.herokuapp.com/taskall"

app.get('/viewtask',(req,res)=>{
  request(APIUrl6,(error,response,body)=>{
    var data = JSON.parse(body);
    res.render('viewtask',{data:data});
  });
});

// User Section

app.get('/checkuser',(req,res)=>{
  var item = req.query.q;
  var result = UserModel.findOne({kemail:item},(error,data)=>{
    if(error)
    {
      throw error;
      res.send(error);
    }
    else
    {
      res.send(data);
    }
  });
});

const APIUrl7 = "http://kudumbasreems.herokuapp.com/checkuser";

app.get('/userhome/:kemail',(req,res)=>{
  const x = req.params.kemail;
  request(APIUrl7+"/?q="+x,(error,response,body)=>{
    var data = JSON.parse(body);
    res.render('userhome',{data:data});
  });
  
});

app.get('/checktask',(req,res)=>{
  var item = req.query.q;
  var result = WorkModel.find({kemail:item},(error,data)=>{
    if(error)
    {
      throw error;
      res.send(error);
    }
    else
    {
      res.send(data);
    }
  });
});

const APIUrl8 = "http://kudumbasreems.herokuapp.com/checktask";


app.get('/usertask/:kemail',(req,res)=>{
  const x = req.params.kemail;
  request(APIUrl8+"/?q="+x,(error,response,body)=>{
    var data = JSON.parse(body);
    console.log(data);
    res.render('usertask',{data:data});
  });
  
});

app.get('/taskstatus',(req,res)=>{
  var item = req.query.q;
  if(req.query.r== "0")
  {
    var result = WorkModel.update({_id:item},{$set:{kwstatus:"1"}},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
    });
  }
  else
  {
    var result = WorkModel.update({_id:item},{$set:{kwstatus:"0"}},(error,data)=>{
      if(error)
      {
          throw error;
          res.send(error);
      }
      else
      {
          res.send(data);
      }
    });
  }
  
});

const APIUrl9 = "http://kudumbasreems.herokuapp.com/taskstatus";

app.get('/usertaskall/:id/:kwstatus',(req,res)=>{
  const x= req.params.id;
  const y= req.params.kwstatus;
  request(APIUrl9+"/?q="+x+"&&r="+y,(error,response,body)=>{
      res.send("<script>alert('Task Completed')</script>");
  });
});


app.listen(process.env.PORT || 4000,()=>{
  console.log("Server running on port::4000...");
});