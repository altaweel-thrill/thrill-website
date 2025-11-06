const express = require('express');
const ejs = require('ejs');
const path = require('path')
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');



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

app.get('/about',function(req,res){
        res.render("about");
        
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



app.get('*',function(req,res){
    res.render("404");
    
})



app.post("/"  ,function async (req,res){

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const subject = req.body.subject;
    const message = req.body.message;
    



    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 578,
         secure: false,
        auth: {
          user: 'altaweel@thrillagency.net',
          pass: 'fcju clee mnmf llkh'
        }
      });
      
      var mailOptions = {
        from: 'altaweel@thrillagency.net',
        to: 'hello@thrillagency.net',
        subject: 'contact from thrill website',
        text: "Nmae : "+name+"\n"
        +"email : "+email+"\n"
        +"phone : "+phone+"\n"
        +"subject : "+subject+"\n"
        +"message : "+message+"\n"

      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      // res.render("thanks");
      res.redirect('/thanks');

})


async function createAssessment({
  // TODO: Replace the token and reCAPTCHA action variables before running the sample.
  projectID = "thrill-website-1736151402229",
  recaptchaKey = "6LeecK8qAAAAAPPJQDmpQQhwkoHc95rbNRJcq1Ou",
  token = "action-token",
  recaptchaAction = "action-name",
}) {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = ({
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  });

  const [ response ] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}