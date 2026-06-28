const express = require('express');
const ejs = require('ejs');
const path = require('path')
const crypto = require('crypto');
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const axios = require("axios");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const trustProxy = process.env.TRUST_PROXY || (process.env.NODE_ENV === "production" ? "1" : "");

if (trustProxy) {
  let trustProxySetting = trustProxy;
  if (/^\d+$/.test(trustProxy)) trustProxySetting = Number(trustProxy);
  if (trustProxy === "true" || trustProxy === "false") trustProxySetting = trustProxy === "true";
  app.set("trust proxy", trustProxySetting);
}

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname , '/public')));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false, limit: "20kb", parameterLimit: 20 }))

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log('server started');
});

const CONTACT_FORM_ACTION = "CONTACT_FORM";
const CONTACT_FORM_MIN_AGE_MS = 2000;
const CONTACT_FORM_MAX_AGE_MS = 4 * 60 * 60 * 1000;
const configuredRecaptchaScore = Number(process.env.RECAPTCHA_MIN_SCORE);
const RECAPTCHA_MIN_SCORE =
  Number.isFinite(configuredRecaptchaScore) &&
  configuredRecaptchaScore >= 0 &&
  configuredRecaptchaScore <= 1
    ? configuredRecaptchaScore
    : 0.5;
const RECAPTCHA_ALLOWED_HOSTNAMES = new Set(
  (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "thrillagency.net,www.thrillagency.net,localhost,127.0.0.1")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)
);

function getContactFormSecret() {
  return process.env.CONTACT_FORM_SECRET || process.env.RECAPTCHA_SECRET;
}

function createContactFormToken() {
  const secret = getContactFormSecret();
  if (!secret) return "";

  const issuedAt = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(issuedAt).digest("hex");
  return `${issuedAt}.${signature}`;
}

function isValidContactFormToken(token) {
  const secret = getContactFormSecret();
  if (!secret || typeof token !== "string") return false;

  const [issuedAt, signature, extra] = token.split(".");
  if (extra || !/^\d+$/.test(issuedAt || "") || !/^[a-f0-9]{64}$/.test(signature || "")) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  if (age < CONTACT_FORM_MIN_AGE_MS || age > CONTACT_FORM_MAX_AGE_MS) return false;

  const expectedSignature = crypto.createHmac("sha256", secret).update(issuedAt).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

function normalizeContactFields(body) {
  return {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim().toLowerCase(),
    phone: String(body.phone || "").trim(),
    subject: String(body.subject || "").trim(),
    message: String(body.message || "").trim(),
  };
}

function hasValidContactFields(fields) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+\d\s().-]+$/;
  const phoneDigits = fields.phone.replace(/\D/g, "");

  return (
    fields.name.length >= 2 &&
    fields.name.length <= 100 &&
    fields.email.length <= 254 &&
    emailPattern.test(fields.email) &&
    fields.phone.length <= 30 &&
    phonePattern.test(fields.phone) &&
    phoneDigits.length >= 7 &&
    phoneDigits.length <= 15 &&
    fields.subject.length >= 2 &&
    fields.subject.length <= 150 &&
    fields.message.length >= 10 &&
    fields.message.length <= 5000
  );
}


app.get('/',function(req,res){
res.render("index", { locale: "en" });

});

app.get('/ar',function(req,res){
res.render("index", { locale: "ar" });

});

app.get('/service',function(req,res){
    res.render("service", { locale: "en" });

})

app.get('/ar/service',function(req,res){
    res.render("service", { locale: "ar" });
    
})


app.get('/card',function(req,res){
  res.render("card");
  
})
app.get('/social-media',function(req,res){
  res.render("social-media", { locale: "en" });

})

app.get('/ar/social-media',function(req,res){
  res.render("social-media", { locale: "ar" });
  
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
        res.render("about", { locale: "en" });

})

app.get('/ar/about',function(req,res){
        res.render("about", { locale: "ar" });

})


app.get('/web-and-app',function(req,res){
        res.render("web-and-app", { locale: "en" });

})

app.get('/ar/web-and-app',function(req,res){
        res.render("web-and-app", { locale: "ar" });

})

app.get('/nahj',function(req,res){
        res.render("nahj");

})


app.get('/parkview',function(req,res){
        res.render("parkview");

})


app.get('/contact',function(req,res){
            res.render("contact", { locale: "en", contactFormToken: createContactFormToken() });

})

app.get('/ar/contact',function(req,res){
            res.render("contact", { locale: "ar", contactFormToken: createContactFormToken() });

})

app.get('/portfolio',function(req,res){
            res.render("portfolio", { locale: "en" });

})

app.get('/ar/portfolio',function(req,res){
            res.render("portfolio", { locale: "ar" });

})
app.get('/flowy',function(req,res){
            res.render("flowy");    
})

app.get('/hlayel',function(req,res){
            res.render("hlayel");    
})
app.get('/thanks',function(req,res){
  res.render("thanks", { locale: "en" });
  
})
app.get('/ar/thanks',function(req,res){
  res.render("thanks", { locale: "ar" });

})
app.get('/algarawi',function(req,res){
  res.render("algarawi");
  
})

app.get('/algarawi2',function(req,res){
  res.render("algarawi2");
  
})

app.get('/seapoint',function(req,res){
  res.render("seapoint");

})

app.get('/luini',function(req,res){
  res.render("luini");

})


const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many contact requests. Please try again later.",
});

app.post("/contact", contactLimiter, async (req, res) => {
  const { recaptchaToken, website, locale, contactFormToken } = req.body;
  const fields = normalizeContactFields(req.body);

  if (website) return res.status(400).send("Spam detected");
  if (!isValidContactFormToken(contactFormToken)) {
    return res.status(400).send("Invalid form submission");
  }
  if (!hasValidContactFields(fields)) {
    return res.status(400).send("Invalid form fields");
  }
  if (!recaptchaToken || typeof recaptchaToken !== "string" || recaptchaToken.length > 4096) {
    return res.status(400).send("Captcha failed");
  }

  try {
    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: recaptchaToken,
          remoteip: req.ip,
        },
        timeout: 5000,
      }
    );

    const captcha = verify.data || {};
    const captchaScore = Number(captcha.score);
    const captchaHostname = String(captcha.hostname || "").toLowerCase();
    const challengeTime = Date.parse(captcha.challenge_ts);
    const challengeAge = Date.now() - challengeTime;
    const validChallengeTime =
      Number.isFinite(challengeTime) && challengeAge >= -30000 && challengeAge <= 2 * 60 * 1000;

    if (
      !captcha.success ||
      !Number.isFinite(captchaScore) ||
      captchaScore < RECAPTCHA_MIN_SCORE ||
      captcha.action !== CONTACT_FORM_ACTION ||
      !RECAPTCHA_ALLOWED_HOSTNAMES.has(captchaHostname) ||
      !validChallengeTime
    ) {
      console.warn("Rejected contact captcha", {
        ip: req.ip,
        score: captchaScore,
        action: captcha.action,
        hostname: captchaHostname,
      });
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
Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Subject: ${fields.subject}
Message: ${fields.message}
      `,
    });

    return res.redirect(locale === "ar" ? "/ar/thanks" : "/thanks");
  } catch (err) {
    console.error("Contact form error:", err.message);
    return res.status(500).send("Server error");
  }
});
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://thrillagency.net';

  const pages = [
    '/',
    '/service',
    '/card',
    '/social-media',
    '/privacy-policy',
    '/about',
    '/web-and-app',
    '/contact',
    '/portfolio',
    '/flowy',
    '/hlayel',
    '/algarawi',
    '/seapoint',
    '/luini',
    '/8portions',
    '/hlayell',
    '/nahjroastery',
    '/nubull',
    '/lavish',
    '/park_view',
    '/betula',
    '/luinii',
    '/marissa',
    '/allhazems',
    '/sea_point',
    '/enma',
    '/lubeex',
    '/tireex',
    '/marsa',
    '/meetmoot',
    '/aqed',
    '/gsf',
    '/louga',
    '/bazar',
    '/moheet',
    '/mood-code',
    '/nubul',
    '/ribbon',
    '/mora',
    '/nahj',
    '/parkview'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});


app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: https://thrillagency.net/sitemap.xml`);
});


app.get('*',function(req,res){
    res.render("404");
    
})
