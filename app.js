const express = require('express');
const ejs = require('ejs');
const path = require('path')
const { createContactSecurity } = require('./lib/contact-security');
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
const { SITE_URL, pages: seoPages, sitemapPaths, getSeo } = require("./lib/seo");

app.use((req, res, next) => {
  const hostname = (req.get("host") || "").toLowerCase().replace(/:\d+$/, "");
  const isSiteDomain = hostname === "thrillagency.net" || hostname === "www.thrillagency.net";

  if (isSiteDomain && (hostname !== "thrillagency.net" || !req.secure)) {
    // Preserve form submissions when redirecting requests other than GET/HEAD.
    const status = req.method === "GET" || req.method === "HEAD" ? 301 : 308;
    return res.redirect(status, SITE_URL + req.originalUrl);
  }

  next();
});

app.use((req, res, next) => {
  const normalizedPath = (req.path.replace(/\/+$/, "") || "/").toLowerCase();
  const candidate = getSeo(normalizedPath);
  const knownPage = seoPages[normalizedPath] ||
    (candidate.arabic && seoPages[normalizedPath.slice(3) || "/"]?.arTitle);
  if (knownPage && req.path !== normalizedPath) {
    const query = req.originalUrl.slice(req.path.length);
    return res.redirect(req.method === "GET" || req.method === "HEAD" ? 301 : 308, normalizedPath + query);
  }
  res.locals.seo = getSeo(req.path);
  next();
});
app.use(express.static(path.join(__dirname , '/public')));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false, limit: "20kb", parameterLimit: 20 }))

var port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, function() {
    console.log('server started');
  });
}

const CONTACT_FORM_ACTION = "CONTACT_FORM";
const configuredRecaptchaScore = process.env.RECAPTCHA_MIN_SCORE?.trim()
  ? Number(process.env.RECAPTCHA_MIN_SCORE) : NaN;
const RECAPTCHA_MIN_SCORE =
  Number.isFinite(configuredRecaptchaScore) &&
  configuredRecaptchaScore >= 0 &&
  configuredRecaptchaScore <= 1
    ? configuredRecaptchaScore
    : 0.7;
const RECAPTCHA_ALLOWED_HOSTNAMES = new Set(
  (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "thrillagency.net,www.thrillagency.net,localhost,127.0.0.1")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)
);

const contactSecurity = createContactSecurity({
  secret: process.env.CONTACT_FORM_SECRET || process.env.RECAPTCHA_SECRET,
});
const createContactFormToken = contactSecurity.issueToken;
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || "6LdZxNYsAAAAAFet6g0axs3w1JAcgaDY-vahAlLh";

const contactErrors = {
  spam: ["Unable to accept this request.", "تعذّر قبول هذا الطلب."],
  token: ["The form expired or was already sent. Please try again.", "انتهت صلاحية الفورم أو تم إرساله سابقاً. حاول مرة أخرى."],
  fields: ["Please check the name, email, phone, subject and message.", "تحقق من الاسم والبريد ورقم الهاتف والموضوع والرسالة."],
  captcha: ["We could not verify your request. Please try again.", "تعذّر التحقق من طلبك. حاول مرة أخرى."],
  duplicate: ["This message was already submitted. Please wait before sending it again.", "تم إرسال هذه الرسالة سابقاً. انتظر قبل إرسالها مجدداً."],
  limit: ["Too many requests. Please try again later.", "تم تجاوز عدد الطلبات المسموح. حاول لاحقاً."],
  unavailable: ["Sending is temporarily unavailable. Please try again later or contact us by email.", "الإرسال غير متاح مؤقتاً. حاول لاحقاً أو تواصل معنا عبر البريد."],
};
function contactError(req, res, status, code) {
  const message = contactErrors[code][req.body?.locale === "ar" ? 1 : 0];
  res.set('Cache-Control', 'no-store');
  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(status).json({ error: message, contactFormToken: createContactFormToken() });
  }
  return res.status(status).send(message);
}
function renderContact(req, res, locale) {
  res.set('Cache-Control', 'no-store');
  res.render("contact", { locale, contactFormToken: createContactFormToken(), recaptchaSiteKey: RECAPTCHA_SITE_KEY });
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

app.get('/etlaq', function(req, res) {
  res.render("etlaq", { locale: "en" });
});

app.get('/ar/etlaq', function(req, res) {
  res.render("etlaq", { locale: "ar" });
});

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
            renderContact(req, res, "en");

})

app.get('/ar/contact',function(req,res){
            renderContact(req, res, "ar");

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
  handler: (req, res) => contactError(req, res, 429, "limit"),
});

app.post("/contact", contactLimiter, async (req, res) => {
  const { recaptchaToken, website, locale, contactFormToken } = req.body;
  const fields = normalizeContactFields(req.body);

  if (website) return contactError(req, res, 400, "spam");
  if (!contactSecurity.isValidToken(contactFormToken)) {
    return contactError(req, res, 400, "token");
  }
  if (!hasValidContactFields(fields)) {
    return contactError(req, res, 400, "fields");
  }
  if (!recaptchaToken || typeof recaptchaToken !== "string" || recaptchaToken.length > 4096) {
    return contactError(req, res, 400, "captcha");
  }

  if (!process.env.RECAPTCHA_SECRET || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return contactError(req, res, 503, "unavailable");
  }

  let reservation;
  try {
    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET, response: recaptchaToken, remoteip: req.ip }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 5000 }
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
      return contactError(req, res, 400, "captcha");
    }

    reservation = contactSecurity.reserve(contactFormToken, fields);
    if (reservation.error) {
      const reason = reservation.error === "duplicate" ? "duplicate" : reservation.error === "invalid-token" ? "token" : "limit";
      return contactError(req, res, reason === "token" ? 400 : 429, reason);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "hello@thrillagency.net",
      replyTo: fields.email,
      subject: "Contact Form - Thrill",
      text: `
Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Subject: ${fields.subject}
Message: ${fields.message}
      `,
    });

    const redirect = locale === "ar" ? "/ar/thanks" : "/thanks";
    if (req.accepts(['html', 'json']) === 'json') return res.json({ redirect });
    return res.redirect(303, redirect);
  } catch (err) {
    if (reservation?.rollback) reservation.rollback();
    console.error("Contact form error:", err.code || "CONTACT_SEND_FAILED");
    return contactError(req, res, 503, "unavailable");
  }
});
app.get('/sitemap.xml', (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPaths.map(page => {
  const { alternates } = getSeo(page);
  const languages = alternates ? Object.entries({ ...alternates, "x-default": alternates.en })
    .map(([language, href]) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${href}" />`).join("\n") : "";
  return `  <url>
    <loc>${SITE_URL}${page}</loc>${languages ? "\n" + languages : ""}
  </url>`;
}).join("\n")}
</urlset>`;
  res.type('application/xml').send(sitemap);
});


app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: https://thrillagency.net/sitemap.xml`);
});


app.get('*',function(req,res){
    res.locals.seo.noindex = true;
    res.locals.seo.alternates = null;
    res.status(404).render("404");
    
})

module.exports = app;
