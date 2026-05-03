const express = require('express');
const ejs = require('ejs');
const path = require('path')
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname , '/public')));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log('server started');
});


app.get('/',function(req,res){
res.render("index");

});

app.get('/service',function(req,res){
    res.render("service");
    
})


app.get('/card',function(req,res){
  res.render("card");
  
})
app.get('/social-media',function(req,res){
  res.render("social-media");
  
})
app.get('/privacy-policy',function(req,res){
  res.render("privacy-policy");
  
})





app.get('/8portions',function(req,res){
  res.render("8portions");
  
})
app.get('/hlayell',function(req,res){
  res.render("hlayell");
  
})

app.get('/nahjroastery',function(req,res){
  res.render("nahjroastery");
  
}) //done

app.get('/nubull',function(req,res){
  res.render("nubull");
  
})

app.get('/lavish',function(req,res){
  res.render("lavish");
  
})

app.get('/park_view',function(req,res){
  res.render("park_view");
  
})
  
app.get('/betula',function(req,res){
  res.render("betula");
  
})

app.get('/luinii',function(req,res){
  res.render("luinii");
  
})

app.get('/marissa',function(req,res){
  res.render("marissa");
  
})

app.get('/allhazems',function(req,res){
  res.render("allhazems");
  
})

app.get('/sea_point',function(req,res){
  res.render("sea_point");
  
})

app.get('/enma',function(req,res){
  res.render("enma");
  
})

app.get('/lubeex',function(req,res){
  res.render("lubeex");
  
})
app.get('/tireex',function(req,res){
  res.render("tireex");
  
})
app.get('/marsa',function(req,res){
  res.render("marsa");
  
})

app.get('/meetmoot',function(req,res){
  res.render("meetmoot");
  
})





app.get('/aqed',function(req,res){
  res.render("aqed");
  
})

app.get('/gsf',function(req,res){
  res.render("gsf");

})

app.get('/louga',function(req,res){
  res.render("louga");

})

app.get('/bazar',function(req,res){
  res.render("bazar");

})
app.get('/moheet',function(req,res){
  res.render("moheet");

})

app.get('/mood-code',function(req,res){
  res.render("mood-code");

})

app.get('/nubul',function(req,res){
  res.render("nubul");

})



app.get('/ribbon',function(req,res){
  res.render("ribbon");

})

app.get('/mora',function(req,res){
  res.render("mora");

})

app.get('/about',function(req,res){
        res.render("about");
        
})


app.get('/web-and-app',function(req,res){
        res.render("web-and-app");

})

app.get('/nahj',function(req,res){
        res.render("nahj");

})


app.get('/parkview',function(req,res){
        res.render("parkview");

})


app.get('/contact',function(req,res){
            res.render("contact");
            
})

app.get('/portfolio',function(req,res){
            res.render("portfolio");
            
})
app.get('/flowy',function(req,res){
            res.render("flowy");    
})

app.get('/hlayel',function(req,res){
            res.render("hlayel");    
})
app.get('/thanks',function(req,res){
  res.render("thanks");
  
})
app.get('/algarawi',function(req,res){
  res.render("algarawi");
  
})

app.get('/seapoint',function(req,res){
  res.render("seapoint");

})

app.get('/luini',function(req,res){
  res.render("luini");

})




const axios = require("axios");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.post("/contact", limiter, async (req, res) => {
  const { name, email, phone, subject, message, recaptchaToken, website } = req.body;

  if (website) return res.status(400).send("Spam detected");
  if (!recaptchaToken) return res.status(400).send("No captcha");

  try {
    console.log("recaptchaToken:", recaptchaToken);
console.log("token length:", recaptchaToken?.length);
console.log("secret exists:", !!process.env.RECAPTCHA_SECRET);
    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    console.log("captcha:", verify.data);

    if (!verify.data.success || verify.data.score < 0.3) {
      return res.status(400).send("Captcha failed");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "hello@thrillagency.net",
      subject: "Contact Form - Thrill",
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}
      `,
    });

    return res.redirect("/thanks");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});





app.get('*',function(req,res){
    res.render("404");
    
})