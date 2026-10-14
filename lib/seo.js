// Page metadata and sitemap share this catalog so language variants stay aligned.
const SITE_URL = 'https://thrillagency.net';
const DEFAULT_IMAGE = '/assets/imgs/logo/site-logo-white-2.png';
const pages = {
  "/": {
    "title": "Thrill Agency | Creative Marketing & Branding in Al Khobar",
    "description": "Thrill Agency in Al Khobar creates brand identities, social media content, media productions, websites and apps for businesses in Saudi Arabia.",
    "arTitle": "وكالة ثريل | التسويق الإبداعي وتصميم الهوية في الخبر",
    "arDescription": "وكالة ثريل في الخبر تقدم تصميم الهوية البصرية ومحتوى التواصل الاجتماعي والإنتاج الإعلامي وتطوير المواقع والتطبيقات للشركات في السعودية."
  },
  "/about": {
    "title": "About Our Creative Agency | Thrill Agency",
    "description": "Meet Thrill Agency: explore our story, team, mission and approach to creative marketing, visual design and digital projects.",
    "arTitle": "من نحن | وكالة ثريل الإبداعية",
    "arDescription": "تعرّف على قصة وكالة ثريل وفريقنا ورسالتنا ورؤيتنا في التسويق الإبداعي وتصميم الهوية البصرية وتنفيذ المشاريع الرقمية."
  },
  "/service": {
    "title": "Branding, Marketing & Digital Services | Thrill Agency",
    "description": "Explore Thrill Agency services: brand identity, social media management, media production, website and app development, and digital marketing.",
    "arTitle": "خدمات الهوية البصرية والتسويق والحلول الرقمية | ثريل",
    "arDescription": "اكتشف خدمات ثريل في تصميم الهوية البصرية وإدارة التواصل الاجتماعي والإنتاج الإعلامي وتطوير المواقع والتطبيقات والتسويق الرقمي."
  },
  "/portfolio": {
    "title": "Branding & Visual Identity Portfolio | Thrill Agency",
    "description": "Browse brand identity projects by Thrill Agency, including logos, visual systems, packaging and brand applications for our clients.",
    "arTitle": "أعمال تصميم الهوية البصرية والعلامات التجارية | ثريل",
    "arDescription": "تصفح مشاريع الهوية البصرية والعلامات التجارية من وكالة ثريل، بما يشمل الشعارات والأنظمة البصرية والتغليف وتطبيقات الهوية لعملائنا."
  },
  "/social-media": {
    "title": "Social Media Content Portfolio | Thrill Agency",
    "description": "Discover social media work by Thrill Agency: branded posts, carousel designs and videos created for clients across different sectors.",
    "arTitle": "أعمال محتوى وتصميم التواصل الاجتماعي | وكالة ثريل",
    "arDescription": "اكتشف أعمال ثريل في محتوى التواصل الاجتماعي: بوستات وتصاميم كاروسيل وفيديوهات صنعت لعملائنا في قطاعات متنوعة."
  },
  "/web-and-app": {
    "title": "Website & App Development Portfolio | Thrill Agency",
    "description": "Explore website and application projects by Thrill Agency, including work for Silica, Flowy, ETE Ready Mix, Etarex and Aqed.",
    "arTitle": "أعمال تصميم وتطوير المواقع والتطبيقات | وكالة ثريل",
    "arDescription": "تعرّف على مشاريع تصميم وتطوير المواقع والتطبيقات من وكالة ثريل، ومنها أعمال سيليكا وفلوي وإي تي إي وإيتاركس وعقد."
  },
  "/contact": {
    "title": "Contact Thrill Agency | Start Your Creative Project",
    "description": "Contact Thrill Agency to discuss branding, social media, media production or a digital project. Find our office details and send a project enquiry.",
    "arTitle": "تواصل مع وكالة ثريل | ابدأ مشروعك الإبداعي",
    "arDescription": "تواصل مع ثريل لمناقشة مشروعك في الهوية البصرية أو التواصل الاجتماعي أو الإنتاج الإعلامي أو الحلول الرقمية. اطّلع على بيانات مكاتبنا وأرسل طلبك."
  },
  "/etlaq": {
    "title": "ETLAQ Social Media Posts & Videos | Thrill Agency",
    "description": "Explore ETLAQ social media content by Thrill Agency: campaign designs, carousel posts and videos for the application development platform.",
    "arTitle": "أعمال إطلاق في التواصل الاجتماعي | وكالة ثريل",
    "arDescription": "تصفح أعمال وكالة ثريل لمنصة إطلاق، بما يشمل تصاميم الحملات وبوستات التواصل الاجتماعي والكاروسيل والفيديوهات لمنصة تطوير التطبيقات.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/etlaq/ai-year.png"
  },
  "/privacy-policy": {
    "title": "Privacy Policy | Thrill Agency",
    "description": "Read how Thrill Agency handles information submitted through its website, including contact details, cookies and privacy enquiries."
  },
  "/thanks": {
    "title": "Thank You for Contacting Us | Thrill Agency",
    "description": "Your enquiry has been sent to Thrill Agency. Thank you for sharing your creative project with our team.",
    "arTitle": "شكراً لتواصلك معنا | وكالة ثريل",
    "arDescription": "تم إرسال طلبك إلى وكالة ثريل. شكراً لمشاركتنا تفاصيل مشروعك الإبداعي.",
    "noindex": true
  },
  "/card": {
    "title": "Contact Card | Thrill Agency",
    "description": "Thrill Agency contact card.",
    "noindex": true
  },
  "/8portions": {
    "title": "8portions Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for 8portions by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/8portions/1.jpg"
  },
  "/algarawi": {
    "title": "Algarawi Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Algarawi by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/allhazems": {
    "title": "Alhazems Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Alhazems by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/alhazems/1.png"
  },
  "/aqed": {
    "title": "Aqed Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Aqed by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/bazar": {
    "title": "Bazar Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Bazar by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/bazar/1.gif"
  },
  "/betula": {
    "title": "Betula Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Betula by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/betula/1.png"
  },
  "/enma": {
    "title": "ENMA BAY Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for ENMA BAY by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media"
  },
  "/flowy": {
    "title": "Flowy Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Flowy by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/flowy/1.png"
  },
  "/gsf": {
    "title": "GSF Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for GSF by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/hlayel": {
    "title": "Hlayel Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Hlayel by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/hlayell": {
    "title": "Hlayel Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Hlayel by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media"
  },
  "/lavish": {
    "title": "Lavish Catering Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Lavish Catering by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/lavish/1.jpg"
  },
  "/louga": {
    "title": "Louga Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Louga by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/louga/1.gif"
  },
  "/lubeex": {
    "title": "LubeEX Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for LubeEX by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/lubeex/1.jpg"
  },
  "/luini": {
    "title": "Luini Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Luini by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/luinii": {
    "title": "Luini Bakery Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Luini Bakery by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/luinii/1.png"
  },
  "/marissa": {
    "title": "Marissa Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Marissa by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/marissa/1.png"
  },
  "/marsa": {
    "title": "Marsa Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Marsa by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/marsa/1.png"
  },
  "/meetmoot": {
    "title": "Meet Moot Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Meet Moot by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/meetmoot/1.jpg"
  },
  "/moheet": {
    "title": "Moheet Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Moheet by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/moheet/1.gif"
  },
  "/mood-code": {
    "title": "Mood Code Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Mood Code by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/mood-code/1.gif"
  },
  "/mora": {
    "title": "Mora Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Mora by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/nahj": {
    "title": "Nahj Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Nahj by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/nahjroastery": {
    "title": "Nahj Roastery Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Nahj Roastery by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/nahjj/1.png"
  },
  "/nubul": {
    "title": "Nubul Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Nubul by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/nubul/1.gif"
  },
  "/nubull": {
    "title": "Nubul Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Nubul by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/nubull/1.jpg"
  },
  "/park_view": {
    "title": "PARK VIEW Residence Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for PARK VIEW Residence by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/arweqah/post 1/1.png"
  },
  "/parkview": {
    "title": "Parkview Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Parkview by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio",
    "image": "/assets/imgs/portfolio/parkview/1.png"
  },
  "/ribbon": {
    "title": "Ribbon Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Ribbon by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/sea_point": {
    "title": "Sea Point Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for Sea Point by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/sea_point/1.jpg"
  },
  "/seapoint": {
    "title": "Sea Point Brand Identity | Thrill Agency",
    "description": "Explore the visual identity and brand design project for Sea Point by Thrill Agency. View the brand presentation and design applications.",
    "parent": "/portfolio"
  },
  "/tireex": {
    "title": "TireEX Social Media Content | Thrill Agency",
    "description": "Explore social media designs, posts and videos for TireEX by Thrill Agency. View our creative content portfolio for this client.",
    "parent": "/social-media",
    "image": "/assets/imgs/portfolio/tireex/1.png"
  }
};

const translatedPages = Object.keys(pages).filter(path => pages[path].arTitle && !pages[path].noindex);
const arabicPath = path => path === '/' ? '/ar' : '/ar' + path;
const sitemapPaths = Object.keys(pages).filter(path => !pages[path].noindex)
  .flatMap(path => pages[path].arTitle ? [path, arabicPath(path)] : [path]);

function getSeo(requestPath) {
  const pagePath = requestPath.replace(/\/+$/, '') || '/';
  const arabic = pagePath === '/ar' || pagePath.startsWith('/ar/');
  const englishPath = arabic ? pagePath.slice(3) || '/' : pagePath;
  const page = pages[englishPath];
  const found = page && (!arabic || page.arTitle);
  const title = found ? (arabic ? page.arTitle : page.title) : 'Page Not Found | Thrill Agency';
  const description = found ? (arabic ? page.arDescription : page.description) : 'The requested page could not be found. Explore Thrill Agency services and creative projects.';
  const noindex = !found || Boolean(page.noindex);
  const url = SITE_URL + pagePath;
  const alternates = found && page.arTitle && !noindex
    ? { en: SITE_URL + englishPath, ar: SITE_URL + arabicPath(englishPath) } : null;
  const image = SITE_URL + (found && page.image || DEFAULT_IMAGE);
  const siteName = arabic ? 'وكالة ثريل' : 'Thrill Agency';
  const graph = [];

  if (!noindex) {
    const organizationId = SITE_URL + '/#organization';
    const websiteId = SITE_URL + '/#website';
    graph.push({
      '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description,
      inLanguage: arabic ? 'ar' : 'en', isPartOf: { '@id': websiteId },
      about: { '@id': organizationId }
    });
    if (englishPath === '/') {
      graph.push({ '@type': 'WebSite', '@id': websiteId, url: SITE_URL + '/',
        name: 'Thrill Agency', alternateName: 'وكالة ثريل',
        inLanguage: ['en', 'ar'], publisher: { '@id': organizationId } });
      graph.push({ '@type': 'Organization', '@id': organizationId,
        name: 'Thrill Agency', alternateName: 'وكالة ثريل', url: SITE_URL + '/',
        logo: SITE_URL + DEFAULT_IMAGE, email: 'hello@thrillagency.net',
        sameAs: ['https://www.linkedin.com/company/thrill-creative-agency/',
          'https://www.instagram.com/lets_thrill/', 'https://www.tiktok.com/@thrill_family',
          'https://x.com/lets_thrill'] });
    } else {
      const crumbs = [{ name: arabic ? 'الرئيسية' : 'Home', item: SITE_URL + (arabic ? '/ar' : '/') }];
      if (page.parent) {
        const parent = pages[page.parent];
        crumbs.push({ name: (arabic ? parent.arTitle : parent.title).split(' | ')[0],
          item: SITE_URL + (arabic ? arabicPath(page.parent) : page.parent) });
      }
      crumbs.push({ name: title.split(' | ')[0], item: url });
      graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
        itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })) });
      graph[0].breadcrumb = { '@id': url + '#breadcrumb' };
    }
  }

  return { url, arabic, title, description, image, siteName, noindex, alternates,
    structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

module.exports = { SITE_URL, pages, translatedPages, sitemapPaths, getSeo };
