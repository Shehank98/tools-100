// Curated seed content so the site has real, unique data from day one
// (needed for AdSense approval, no lorem ipsum, no placeholders).
// URLs point at well-known free online tools. Loaded automatically on the
// first boot with an empty database (see server.js auto-seed).

export const categories = [
  { name: 'PDF Tools',         sort_order: 1,  description: 'Convert, compress, merge, split, sign and edit PDF files online for free.' },
  { name: 'Image Tools',       sort_order: 2,  description: 'Compress, resize, crop, convert and edit images right in your browser.' },
  { name: 'Converters',        sort_order: 3,  description: 'Convert files, units, currencies and time zones between hundreds of formats.' },
  { name: 'Text Tools',        sort_order: 4,  description: 'Count words, compare text, change case and clean up your writing.' },
  { name: 'Calculators',       sort_order: 5,  description: 'Free calculators for math, finance, health, dates and everyday problems.' },
  { name: 'Developer Tools',   sort_order: 6,  description: 'Format JSON, test regex, encode data and dozens of other coding helpers.' },
  { name: 'SEO & Marketing',   sort_order: 7,  description: 'Research keywords, audit pages and grow your organic traffic.' },
  { name: 'Security & Privacy',sort_order: 8,  description: 'Check breaches, generate passwords, scan links and keep your data safe.' },
  { name: 'Productivity',      sort_order: 9,  description: 'Shorten links, generate QR codes, take notes and get more done.' },
  { name: 'Color & Design',    sort_order: 10, description: 'Build color palettes, pick fonts and find free design assets.' },
  { name: 'Video & Audio',     sort_order: 11, description: 'Trim, convert, compress and record video and audio online.' },
  { name: 'AI Tools',          sort_order: 12, description: 'Chat assistants, image generators and AI writing helpers.' },
  { name: 'Writing & Grammar', sort_order: 13, description: 'Fix grammar, paraphrase, check plagiarism and improve your writing.' },
  { name: 'Education & Study',  sort_order: 14, description: 'Solve math, make flashcards, cite sources and learn anything.' },
  { name: 'Finance & Money',   sort_order: 15, description: 'Convert currency, plan loans, track crypto and create invoices.' },
];

// category = the category `name` above.
export const tools = [
  // ── PDF Tools ──
  { name: 'PDF to JPG Converter', category: 'PDF Tools', url: 'https://www.ilovepdf.com/pdf_to_jpg', featured: true, tags: ['pdf', 'jpg', 'image', 'convert'], description: 'Convert each page of a PDF into a high-quality JPG image, or extract all embedded images. Free and no signup.' },
  { name: 'Compress PDF', category: 'PDF Tools', url: 'https://smallpdf.com/compress-pdf', featured: true, tags: ['pdf', 'compress', 'reduce size'], description: 'Shrink the file size of a PDF while keeping it readable, perfect for email attachments and upload limits.' },
  { name: 'Merge PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/merge_pdf', tags: ['pdf', 'merge', 'combine'], description: 'Combine multiple PDF files into a single document in the exact order you want. Drag, drop and download.' },
  { name: 'Split PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/split_pdf', tags: ['pdf', 'split', 'pages'], description: 'Separate one PDF into several files or extract specific pages into a new document.' },
  { name: 'PDF to Word', category: 'PDF Tools', url: 'https://www.pdf2go.com/pdf-to-word', tags: ['pdf', 'word', 'docx', 'convert'], description: 'Turn a PDF into an editable Microsoft Word document while preserving layout, text and images.' },
  { name: 'Word to PDF', category: 'PDF Tools', url: 'https://smallpdf.com/word-to-pdf', tags: ['word', 'pdf', 'convert'], description: 'Convert Word documents to polished PDF files that look the same on every device.' },
  { name: 'JPG to PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/jpg_to_pdf', tags: ['jpg', 'pdf', 'image', 'convert'], description: 'Combine JPG and PNG images into a single PDF with adjustable orientation and margins.' },
  { name: 'Edit PDF', category: 'PDF Tools', url: 'https://www.sejda.com/pdf-editor', tags: ['pdf', 'edit', 'annotate'], description: 'Add text, shapes, images, links and annotations to a PDF and rearrange pages, no software needed.' },
  { name: 'Sign PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/sign-pdf', tags: ['pdf', 'sign', 'signature'], description: 'Add your electronic signature to a PDF and request signatures from other people.' },
  { name: 'Unlock PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/unlock_pdf', tags: ['pdf', 'unlock', 'password'], description: 'Remove password protection from a PDF you own so it opens without a prompt.' },
  { name: 'Protect PDF', category: 'PDF Tools', url: 'https://www.ilovepdf.com/protect-pdf', tags: ['pdf', 'protect', 'password'], description: 'Add a password and encryption to a PDF to keep its contents private.' },
  { name: 'PDF to Excel', category: 'PDF Tools', url: 'https://smallpdf.com/pdf-to-excel', tags: ['pdf', 'excel', 'convert'], description: 'Pull tables out of a PDF into an editable Excel spreadsheet.' },
  { name: 'PDF OCR', category: 'PDF Tools', url: 'https://www.onlineocr.net', tags: ['pdf', 'ocr', 'scan', 'text'], description: 'Turn scanned PDFs and images into searchable, selectable text with optical character recognition.' },

  // ── Image Tools ──
  { name: 'Image Compressor', category: 'Image Tools', url: 'https://tinypng.com', featured: true, tags: ['image', 'compress', 'png', 'jpg', 'optimize'], description: 'Smart lossy compression for PNG and JPG images that cuts file size with almost no visible quality loss.' },
  { name: 'Background Remover', category: 'Image Tools', url: 'https://www.remove.bg', featured: true, tags: ['image', 'background', 'remove', 'transparent', 'ai'], description: 'Automatically remove the background from any photo in seconds and download a clean transparent PNG.' },
  { name: 'Image Optimizer', category: 'Image Tools', url: 'https://squoosh.app', tags: ['image', 'optimize', 'webp', 'avif'], description: 'Compare formats and quality side by side, then export smaller WebP, AVIF or JPEG files in your browser.' },
  { name: 'Online Photo Editor', category: 'Image Tools', url: 'https://www.photopea.com', tags: ['image', 'editor', 'photoshop', 'psd'], description: 'A free, full-featured photo editor that opens PSD files and works much like Photoshop.' },
  { name: 'Resize Image', category: 'Image Tools', url: 'https://www.iloveimg.com/resize-image', tags: ['image', 'resize', 'dimensions'], description: 'Change the width and height of images in bulk by pixels or percentage while keeping the aspect ratio.' },
  { name: 'Crop Image', category: 'Image Tools', url: 'https://www.iloveimg.com/crop-image', tags: ['image', 'crop', 'edit'], description: 'Cut images to the exact size or aspect ratio you need with a simple visual cropper.' },
  { name: 'Compress JPEG', category: 'Image Tools', url: 'https://compressjpeg.com', tags: ['jpeg', 'compress', 'image'], description: 'Reduce JPEG file size in bulk with a quality slider and instant preview.' },
  { name: 'GIF Maker', category: 'Image Tools', url: 'https://ezgif.com', tags: ['gif', 'animation', 'image'], description: 'Create, resize, crop and optimise animated GIFs, and convert video clips to GIF.' },
  { name: 'Favicon Generator', category: 'Image Tools', url: 'https://favicon.io', tags: ['favicon', 'icon', 'website'], description: 'Generate a favicon for your website from text, an emoji or an uploaded image.' },
  { name: 'Meme Generator', category: 'Image Tools', url: 'https://imgflip.com/memegenerator', tags: ['meme', 'image', 'fun'], description: 'Add captions to popular templates or your own image to make a meme in seconds.' },
  { name: 'Color Picker from Image', category: 'Image Tools', url: 'https://imagecolorpicker.com', tags: ['color', 'picker', 'hex', 'image'], description: 'Upload an image and grab the exact hex, RGB or HSL value of any pixel.' },
  { name: 'Watermark Images', category: 'Image Tools', url: 'https://watermarkly.com', tags: ['watermark', 'image', 'batch'], description: 'Add a text or logo watermark to photos in bulk to protect your work.' },
  { name: 'HEIC to JPG', category: 'Image Tools', url: 'https://heictojpg.com', tags: ['heic', 'jpg', 'convert', 'iphone'], description: 'Convert iPhone HEIC photos to widely supported JPG images.' },

  // ── Converters ──
  { name: 'File Converter', category: 'Converters', url: 'https://cloudconvert.com', featured: true, tags: ['convert', 'file', 'format'], description: 'Convert between 200+ formats: documents, images, audio, video, ebooks and more, from one tool.' },
  { name: 'Any File Converter', category: 'Converters', url: 'https://convertio.co', tags: ['convert', 'file', 'format'], description: 'Drag any file in and pick the format you need. Hundreds of conversions, no install.' },
  { name: 'FreeConvert', category: 'Converters', url: 'https://www.freeconvert.com', tags: ['convert', 'video', 'image', 'file'], description: 'Free online converter for video, image, audio, document and archive files with size options.' },
  { name: 'Zamzar', category: 'Converters', url: 'https://www.zamzar.com', tags: ['convert', 'file', 'document'], description: 'A long-running online converter supporting a huge range of document and media formats.' },
  { name: 'Unit Converter', category: 'Converters', url: 'https://www.unitconverters.net', tags: ['unit', 'convert', 'measurement', 'metric'], description: 'Convert length, weight, temperature, area, speed, data and dozens of other units instantly.' },
  { name: 'Currency Converter', category: 'Converters', url: 'https://www.xe.com/currencyconverter/', tags: ['currency', 'money', 'exchange rate'], description: 'Convert between world currencies using live mid-market exchange rates with charts.' },
  { name: 'Time Zone Converter', category: 'Converters', url: 'https://www.timeanddate.com/worldclock/converter.html', tags: ['time', 'timezone', 'convert', 'meeting'], description: 'Compare times across cities and time zones to schedule calls and meetings.' },
  { name: 'Unix Timestamp Converter', category: 'Converters', url: 'https://www.epochconverter.com', tags: ['timestamp', 'unix', 'epoch', 'convert'], description: 'Convert between Unix epoch timestamps and human-readable dates in any time zone.' },
  { name: 'Online Convert', category: 'Converters', url: 'https://www.online-convert.com', tags: ['convert', 'audio', 'video', 'document'], description: 'A large collection of free format converters for audio, video, image and document files.' },

  // ── Text Tools ──
  { name: 'Word Counter', category: 'Text Tools', url: 'https://wordcounter.net', featured: true, tags: ['text', 'word count', 'character count', 'writing'], description: 'Count words and characters as you type, plus reading time, keyword density and sentence stats.' },
  { name: 'Text Diff Checker', category: 'Text Tools', url: 'https://www.diffchecker.com', tags: ['text', 'diff', 'compare'], description: 'Paste two blocks of text and instantly highlight every added, removed and changed line.' },
  { name: 'Case Converter', category: 'Text Tools', url: 'https://convertcase.net', tags: ['text', 'uppercase', 'lowercase', 'title case'], description: 'Switch text between UPPERCASE, lowercase, Title Case, Sentence case and more with one click.' },
  { name: 'Character Counter', category: 'Text Tools', url: 'https://charactercountonline.com', tags: ['text', 'character count', 'letters'], description: 'Count characters, words, sentences and paragraphs, with and without spaces.' },
  { name: 'Lorem Ipsum Generator', category: 'Text Tools', url: 'https://www.lipsum.com', tags: ['text', 'placeholder', 'lorem ipsum', 'dummy text'], description: 'Generate classic Lorem Ipsum placeholder text by paragraphs, words or bytes for mockups.' },
  { name: 'Remove Duplicate Lines', category: 'Text Tools', url: 'https://www.textfixer.com/tools/remove-duplicate-lines.php', tags: ['text', 'duplicate', 'clean', 'list'], description: 'Clean up a list by removing duplicate lines and optionally sorting the result.' },
  { name: 'Online Notepad', category: 'Text Tools', url: 'https://anotepad.com', tags: ['notes', 'notepad', 'text'], description: 'Write and auto-save quick notes in the browser without installing anything.' },
  { name: 'Markdown Editor', category: 'Text Tools', url: 'https://dillinger.io', tags: ['markdown', 'editor', 'writing'], description: 'Write Markdown with a live side-by-side preview and export to HTML or PDF.' },
  { name: 'Text to Speech', category: 'Text Tools', url: 'https://ttsmaker.com', tags: ['text to speech', 'tts', 'audio', 'voice'], description: 'Turn written text into natural-sounding speech and download the audio file.' },
  { name: 'Speech to Text', category: 'Text Tools', url: 'https://speechnotes.co', tags: ['speech to text', 'dictation', 'transcribe'], description: 'Dictate with your voice and get accurate typed text you can copy or export.' },

  // ── Calculators ──
  { name: 'All-Purpose Calculator', category: 'Calculators', url: 'https://www.calculator.net', featured: true, tags: ['calculator', 'math', 'finance', 'health'], description: 'Hundreds of free calculators for finance, fitness, math, health and everyday questions.' },
  { name: 'Omni Calculator', category: 'Calculators', url: 'https://www.omnicalculator.com', tags: ['calculator', 'science', 'everyday'], description: 'Over 3,000 well-explained calculators covering physics, finance, health and daily life.' },
  { name: 'Percentage Calculator', category: 'Calculators', url: 'https://www.calculator.net/percent-calculator.html', tags: ['calculator', 'percentage', 'percent'], description: 'Work out percentages, percentage change and "X is what percent of Y" without a formula.' },
  { name: 'Graphing Calculator', category: 'Calculators', url: 'https://www.desmos.com/calculator', tags: ['calculator', 'graph', 'math', 'functions'], description: 'Plot functions, add sliders and explore math visually with a fast online graphing calculator.' },
  { name: 'Scientific Calculator', category: 'Calculators', url: 'https://www.rapidtables.com/calc/math/Scientific_Calculator.html', tags: ['calculator', 'scientific', 'math'], description: 'A full scientific calculator with trigonometry, logarithms, powers and memory.' },
  { name: 'Age Calculator', category: 'Calculators', url: 'https://www.calculator.net/age-calculator.html', tags: ['calculator', 'age', 'date'], description: 'Find your exact age in years, months and days from your date of birth.' },
  { name: 'BMI Calculator', category: 'Calculators', url: 'https://www.calculator.net/bmi-calculator.html', tags: ['calculator', 'bmi', 'health', 'weight'], description: 'Calculate your Body Mass Index and see where it falls on the healthy range.' },
  { name: 'Date Duration Calculator', category: 'Calculators', url: 'https://www.timeanddate.com/date/duration.html', tags: ['calculator', 'date', 'days between'], description: 'Count the number of days, weeks and months between any two dates.' },
  { name: 'Loan Calculator', category: 'Calculators', url: 'https://www.calculator.net/loan-calculator.html', tags: ['calculator', 'loan', 'finance', 'payment'], description: 'Estimate monthly payments, total interest and payoff time for any loan.' },
  { name: 'Tip Calculator', category: 'Calculators', url: 'https://www.calculator.net/tip-calculator.html', tags: ['calculator', 'tip', 'bill', 'split'], description: 'Work out the tip and split a restaurant bill between any number of people.' },

  // ── Developer Tools ──
  { name: 'JSON Formatter', category: 'Developer Tools', url: 'https://jsonformatter.org', featured: true, tags: ['json', 'format', 'validate', 'developer'], description: 'Beautify, validate and minify JSON and spot syntax errors with a clear tree view.' },
  { name: 'Regex Tester', category: 'Developer Tools', url: 'https://regex101.com', tags: ['regex', 'regular expression', 'test'], description: 'Build and debug regular expressions with live match highlighting and token explanations.' },
  { name: 'Base64 Encode / Decode', category: 'Developer Tools', url: 'https://www.base64encode.org', tags: ['base64', 'encode', 'decode'], description: 'Encode text or files to Base64 and decode Base64 back to plain text in the browser.' },
  { name: 'Code Beautifier', category: 'Developer Tools', url: 'https://codebeautify.org', tags: ['code', 'format', 'beautify'], description: 'Format and validate JSON, XML, HTML, CSS, SQL and more, plus many developer utilities.' },
  { name: 'Online Code Playground', category: 'Developer Tools', url: 'https://codepen.io', tags: ['code', 'html', 'css', 'javascript', 'playground'], description: 'Write and run HTML, CSS and JavaScript together and share the result with a link.' },
  { name: 'JSFiddle', category: 'Developer Tools', url: 'https://jsfiddle.net', tags: ['code', 'javascript', 'playground'], description: 'A classic front-end playground for quickly testing and sharing HTML, CSS and JS snippets.' },
  { name: 'URL Encoder / Decoder', category: 'Developer Tools', url: 'https://www.urlencoder.org', tags: ['url', 'encode', 'decode'], description: 'Percent-encode and decode URLs and query strings safely.' },
  { name: 'UUID Generator', category: 'Developer Tools', url: 'https://www.uuidgenerator.net', tags: ['uuid', 'guid', 'generator'], description: 'Generate random version 4 UUIDs one at a time or in bulk.' },
  { name: 'JWT Debugger', category: 'Developer Tools', url: 'https://jwt.io', tags: ['jwt', 'token', 'auth', 'decode'], description: 'Decode, verify and inspect JSON Web Tokens and their claims.' },
  { name: 'Cron Expression Helper', category: 'Developer Tools', url: 'https://crontab.guru', tags: ['cron', 'schedule', 'developer'], description: 'Write and understand cron schedule expressions with a live plain-English preview.' },
  { name: 'Can I Use', category: 'Developer Tools', url: 'https://caniuse.com', tags: ['browser', 'support', 'css', 'html'], description: 'Check which browsers support a given HTML, CSS or JavaScript feature.' },
  { name: 'SQL Formatter', category: 'Developer Tools', url: 'https://sqlformat.org', tags: ['sql', 'format', 'database'], description: 'Beautify and reformat messy SQL queries so they are easy to read.' },

  // ── SEO & Marketing ──
  { name: 'Keyword Research', category: 'SEO & Marketing', url: 'https://neilpatel.com/ubersuggest/', featured: true, tags: ['seo', 'keywords', 'research', 'traffic'], description: 'Find keyword ideas, search volume and competition data to plan content that ranks.' },
  { name: 'Question Research', category: 'SEO & Marketing', url: 'https://answerthepublic.com', tags: ['seo', 'questions', 'content ideas'], description: 'Discover the real questions people ask around any topic to fuel your content.' },
  { name: 'Google Trends', category: 'SEO & Marketing', url: 'https://trends.google.com', tags: ['seo', 'trends', 'search interest'], description: 'Compare how search interest for topics rises and falls over time and by region.' },
  { name: 'Meta Tags Preview', category: 'SEO & Marketing', url: 'https://metatags.io', tags: ['seo', 'meta tags', 'open graph', 'preview'], description: 'Generate and preview how your page looks when shared on Google, Twitter and Facebook.' },
  { name: 'PageSpeed Insights', category: 'SEO & Marketing', url: 'https://pagespeed.web.dev', tags: ['seo', 'speed', 'core web vitals', 'performance'], description: 'Measure your page performance and Core Web Vitals with clear fixes to improve them.' },
  { name: 'Google Search Console', category: 'SEO & Marketing', url: 'https://search.google.com/search-console', tags: ['seo', 'google', 'indexing'], description: 'Monitor how Google crawls and indexes your site, submit sitemaps and track performance.' },
  { name: 'Rich Results Test', category: 'SEO & Marketing', url: 'https://search.google.com/test/rich-results', tags: ['seo', 'structured data', 'schema'], description: 'Check whether your page is eligible for rich results and validate its structured data.' },
  { name: 'Schema Markup Validator', category: 'SEO & Marketing', url: 'https://validator.schema.org', tags: ['seo', 'schema', 'structured data'], description: 'Validate Schema.org structured data on any page or pasted code snippet.' },
  { name: 'GTmetrix', category: 'SEO & Marketing', url: 'https://gtmetrix.com', tags: ['seo', 'speed', 'performance', 'audit'], description: 'Analyse page load performance with waterfall charts and prioritised recommendations.' },

  // ── Security & Privacy ──
  { name: 'Password Generator', category: 'Security & Privacy', url: 'https://bitwarden.com/password-generator/', featured: true, tags: ['password', 'generator', 'security', 'random'], description: 'Create strong, random passwords and passphrases with adjustable length and rules.' },
  { name: 'Have I Been Pwned', category: 'Security & Privacy', url: 'https://haveibeenpwned.com', tags: ['security', 'breach', 'email', 'privacy'], description: 'Check whether your email address or password has appeared in a known data breach.' },
  { name: 'VirusTotal', category: 'Security & Privacy', url: 'https://www.virustotal.com', tags: ['security', 'malware', 'scan', 'url'], description: 'Scan a file or URL with dozens of antivirus engines to check it for malware.' },
  { name: 'URL Scanner', category: 'Security & Privacy', url: 'https://urlscan.io', tags: ['security', 'url', 'scan', 'phishing'], description: 'See what a website actually loads and whether it looks malicious before you visit it.' },
  { name: 'SSL Server Test', category: 'Security & Privacy', url: 'https://www.ssllabs.com/ssltest/', tags: ['security', 'ssl', 'https', 'certificate'], description: 'Deep analysis of a website SSL/TLS configuration with an easy A to F grade.' },
  { name: 'Temporary Email', category: 'Security & Privacy', url: 'https://temp-mail.org', tags: ['email', 'temporary', 'privacy', 'spam'], description: 'Get a disposable inbox to sign up for things without giving your real email.' },
  { name: 'What Is My IP', category: 'Security & Privacy', url: 'https://whatismyipaddress.com', tags: ['ip', 'network', 'location'], description: 'See your public IP address, approximate location and connection details.' },
  { name: 'DNS Checker', category: 'Security & Privacy', url: 'https://dnschecker.org', tags: ['dns', 'propagation', 'network'], description: 'Check DNS records and see how a domain resolves from servers around the world.' },

  // ── Productivity ──
  { name: 'URL Shortener', category: 'Productivity', url: 'https://tinyurl.com', featured: true, tags: ['url', 'shortener', 'link'], description: 'Turn long, ugly links into short, shareable URLs you can paste anywhere.' },
  { name: 'QR Code Generator', category: 'Productivity', url: 'https://www.qr-code-generator.com', tags: ['qr code', 'generator', 'link'], description: 'Create QR codes for links, text, Wi-Fi and contact details and download them as images.' },
  { name: 'Pomodoro Timer', category: 'Productivity', url: 'https://pomofocus.io', tags: ['timer', 'pomodoro', 'focus'], description: 'A clean Pomodoro timer to structure focused work sessions and breaks.' },
  { name: 'Online Stopwatch', category: 'Productivity', url: 'https://www.online-stopwatch.com', tags: ['stopwatch', 'timer', 'countdown'], description: 'A simple full-screen stopwatch and countdown timer for any task.' },
  { name: 'World Clock', category: 'Productivity', url: 'https://www.timeanddate.com/worldclock/', tags: ['clock', 'time', 'timezone'], description: 'See the current time in cities across the world at a glance.' },
  { name: 'Random Name Picker', category: 'Productivity', url: 'https://wheelofnames.com', tags: ['random', 'picker', 'wheel'], description: 'Spin a wheel to pick a random winner from a list of names or options.' },
  { name: 'Random Number Generator', category: 'Productivity', url: 'https://www.random.org', tags: ['random', 'number', 'draw'], description: 'Generate true random numbers, lists and draws for giveaways and games.' },
  { name: 'Screen Recorder', category: 'Productivity', url: 'https://www.loom.com', tags: ['screen', 'record', 'video'], description: 'Record your screen and camera and instantly share a link, great for quick demos.' },
  { name: 'Typing Speed Test', category: 'Productivity', url: 'https://10fastfingers.com', tags: ['typing', 'test', 'speed', 'wpm'], description: 'Measure your typing speed and accuracy in words per minute and practise to improve.' },

  // ── Color & Design ──
  { name: 'Color Palette Generator', category: 'Color & Design', url: 'https://coolors.co', featured: true, tags: ['color', 'palette', 'design', 'hex'], description: 'Generate beautiful color schemes in seconds, lock the ones you like and export them.' },
  { name: 'Adobe Color Wheel', category: 'Color & Design', url: 'https://color.adobe.com', tags: ['color', 'wheel', 'palette'], description: 'Build harmonious color palettes with a color wheel and extract themes from images.' },
  { name: 'Color Hunt', category: 'Color & Design', url: 'https://colorhunt.co', tags: ['color', 'palette', 'inspiration'], description: 'Browse thousands of hand-picked color palettes for your next design.' },
  { name: 'Contrast Checker', category: 'Color & Design', url: 'https://webaim.org/resources/contrastchecker/', tags: ['color', 'contrast', 'accessibility'], description: 'Check whether text and background colors meet WCAG accessibility contrast ratios.' },
  { name: 'CSS Gradient Generator', category: 'Color & Design', url: 'https://cssgradient.io', tags: ['css', 'gradient', 'color', 'design'], description: 'Design CSS gradients visually and copy the code straight into your stylesheet.' },
  { name: 'Google Fonts', category: 'Color & Design', url: 'https://fonts.google.com', tags: ['fonts', 'typography', 'free'], description: 'Browse and pair hundreds of free, open-source web fonts and grab the embed code.' },
  { name: 'Free Stock Photos', category: 'Color & Design', url: 'https://unsplash.com', tags: ['images', 'stock photos', 'free'], description: 'Download high-resolution photos free for personal and commercial projects.' },
  { name: 'Free Icons', category: 'Color & Design', url: 'https://www.flaticon.com', tags: ['icons', 'design', 'free'], description: 'Millions of free vector icons and stickers in many styles and formats.' },
  { name: 'Online Design Studio', category: 'Color & Design', url: 'https://www.canva.com', tags: ['design', 'graphics', 'templates', 'social media'], description: 'Design social posts, presentations and posters from thousands of drag-and-drop templates.' },
  { name: 'Whiteboard', category: 'Color & Design', url: 'https://excalidraw.com', tags: ['whiteboard', 'diagram', 'sketch'], description: 'A virtual hand-drawn style whiteboard for sketching diagrams and wireframes.' },

  // ── Video & Audio ──
  { name: 'Video Editor', category: 'Video & Audio', url: 'https://www.kapwing.com', featured: true, tags: ['video', 'editor', 'subtitles'], description: 'Trim, caption, resize and edit video online with a simple timeline editor.' },
  { name: 'Video Converter', category: 'Video & Audio', url: 'https://www.freeconvert.com/video-converter', tags: ['video', 'convert', 'mp4'], description: 'Convert video between MP4, MOV, AVI, WebM and more with quality and size controls.' },
  { name: 'Video Compressor', category: 'Video & Audio', url: 'https://www.freeconvert.com/video-compressor', tags: ['video', 'compress', 'reduce size'], description: 'Make video files smaller for email and upload while keeping decent quality.' },
  { name: 'Audio Converter', category: 'Video & Audio', url: 'https://online-audio-converter.com', tags: ['audio', 'convert', 'mp3'], description: 'Convert audio to MP3, WAV, M4A, FLAC and other formats with bitrate options.' },
  { name: 'Audio Trimmer', category: 'Video & Audio', url: 'https://audiotrimmer.com', tags: ['audio', 'trim', 'cut', 'ringtone'], description: 'Cut and trim audio clips online to make ringtones or shorten tracks.' },
  { name: 'Vocal Remover', category: 'Video & Audio', url: 'https://vocalremover.org', tags: ['audio', 'vocals', 'karaoke', 'ai'], description: 'Split a song into separate vocal and instrumental tracks using AI.' },
  { name: 'Online Voice Recorder', category: 'Video & Audio', url: 'https://online-voice-recorder.com', tags: ['audio', 'record', 'microphone'], description: 'Record audio from your microphone right in the browser and download it.' },
  { name: 'Video to GIF', category: 'Video & Audio', url: 'https://ezgif.com/video-to-gif', tags: ['video', 'gif', 'convert'], description: 'Turn a short video clip into an optimised animated GIF.' },

  // ── AI Tools ──
  { name: 'ChatGPT', category: 'AI Tools', url: 'https://chatgpt.com', featured: true, tags: ['ai', 'chatbot', 'assistant', 'writing'], description: 'Ask questions, draft text, brainstorm and get help with almost anything from OpenAI.' },
  { name: 'Claude', category: 'AI Tools', url: 'https://claude.ai', featured: true, tags: ['ai', 'chatbot', 'assistant', 'writing'], description: 'A helpful AI assistant from Anthropic for writing, analysis, coding and long documents.' },
  { name: 'Google Gemini', category: 'AI Tools', url: 'https://gemini.google.com', tags: ['ai', 'chatbot', 'assistant', 'google'], description: 'Google multimodal AI assistant for questions, writing and image understanding.' },
  { name: 'Perplexity', category: 'AI Tools', url: 'https://www.perplexity.ai', tags: ['ai', 'search', 'answers', 'research'], description: 'An AI answer engine that responds with sources and citations for research.' },
  { name: 'Hugging Face', category: 'AI Tools', url: 'https://huggingface.co', tags: ['ai', 'models', 'machine learning'], description: 'Explore and try thousands of open AI models, datasets and demos.' },
  { name: 'Ideogram', category: 'AI Tools', url: 'https://ideogram.ai', tags: ['ai', 'image generator', 'text'], description: 'Generate images from text prompts, with strong support for readable text in images.' },
  { name: 'ElevenLabs', category: 'AI Tools', url: 'https://elevenlabs.io', tags: ['ai', 'voice', 'text to speech'], description: 'Create realistic AI voices and voiceovers from text in many languages.' },
  { name: 'Leonardo AI', category: 'AI Tools', url: 'https://leonardo.ai', tags: ['ai', 'image generator', 'art'], description: 'Generate art, game assets and illustrations from text prompts.' },

  // ── Writing & Grammar ──
  { name: 'Grammar Checker', category: 'Writing & Grammar', url: 'https://www.grammarly.com', featured: true, tags: ['grammar', 'spelling', 'writing'], description: 'Catch grammar, spelling and punctuation mistakes and get clarity suggestions as you write.' },
  { name: 'Paraphrasing Tool', category: 'Writing & Grammar', url: 'https://quillbot.com', tags: ['paraphrase', 'rewrite', 'writing'], description: 'Rewrite and rephrase sentences in different tones while keeping the meaning.' },
  { name: 'Hemingway Editor', category: 'Writing & Grammar', url: 'https://hemingwayapp.com', tags: ['writing', 'readability', 'editing'], description: 'Highlight hard-to-read sentences and passive voice to make your writing clearer.' },
  { name: 'Plagiarism Checker', category: 'Writing & Grammar', url: 'https://smallseotools.com/plagiarism-checker/', tags: ['plagiarism', 'check', 'writing'], description: 'Compare your text against the web to find copied or unoriginal passages.' },
  { name: 'Thesaurus', category: 'Writing & Grammar', url: 'https://www.thesaurus.com', tags: ['synonyms', 'words', 'writing'], description: 'Find synonyms and antonyms to make your writing more varied and precise.' },
  { name: 'Dictionary', category: 'Writing & Grammar', url: 'https://www.dictionary.com', tags: ['definition', 'words', 'meaning'], description: 'Look up definitions, pronunciations and word origins in a trusted dictionary.' },
  { name: 'Rhyme Finder', category: 'Writing & Grammar', url: 'https://www.rhymezone.com', tags: ['rhymes', 'lyrics', 'poetry'], description: 'Find rhymes, near-rhymes and related words for songwriting and poetry.' },

  // ── Education & Study ──
  { name: 'Wolfram Alpha', category: 'Education & Study', url: 'https://www.wolframalpha.com', featured: true, tags: ['math', 'answers', 'compute', 'study'], description: 'A computational answer engine for math, science, statistics and factual queries.' },
  { name: 'Math Solver', category: 'Education & Study', url: 'https://www.symbolab.com', tags: ['math', 'solver', 'steps', 'algebra'], description: 'Solve algebra, calculus and other math problems with step-by-step explanations.' },
  { name: 'Photomath', category: 'Education & Study', url: 'https://photomath.com', tags: ['math', 'solver', 'homework'], description: 'Scan a math problem and get worked solutions and explanations.' },
  { name: 'GeoGebra', category: 'Education & Study', url: 'https://www.geogebra.org', tags: ['math', 'geometry', 'graphing'], description: 'Interactive math tools for geometry, algebra, graphing, statistics and calculus.' },
  { name: 'Flashcards', category: 'Education & Study', url: 'https://quizlet.com', tags: ['study', 'flashcards', 'learn'], description: 'Create and study flashcards, practice tests and study games for any subject.' },
  { name: 'Khan Academy', category: 'Education & Study', url: 'https://www.khanacademy.org', tags: ['learn', 'courses', 'math', 'free'], description: 'Free lessons and practice across math, science, economics and more.' },
  { name: 'Citation Generator', category: 'Education & Study', url: 'https://www.citationmachine.net', tags: ['citation', 'references', 'apa', 'mla'], description: 'Create properly formatted citations and bibliographies in APA, MLA and other styles.' },
  { name: 'Google Scholar', category: 'Education & Study', url: 'https://scholar.google.com', tags: ['research', 'papers', 'academic'], description: 'Search scholarly articles, papers and citations across disciplines.' },

  // ── Finance & Money ──
  { name: 'Invoice Generator', category: 'Finance & Money', url: 'https://invoice-generator.com', featured: true, tags: ['invoice', 'billing', 'business'], description: 'Create and download professional invoices as PDF in minutes, no signup.' },
  { name: 'Compound Interest Calculator', category: 'Finance & Money', url: 'https://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php', tags: ['finance', 'interest', 'savings'], description: 'See how savings and investments grow over time with compound interest.' },
  { name: 'Mortgage Calculator', category: 'Finance & Money', url: 'https://www.calculator.net/mortgage-calculator.html', tags: ['finance', 'mortgage', 'home loan'], description: 'Estimate monthly mortgage payments, taxes, insurance and total interest.' },
  { name: 'Investment Calculator', category: 'Finance & Money', url: 'https://www.calculator.net/investment-calculator.html', tags: ['finance', 'investment', 'returns'], description: 'Project the future value of an investment with contributions and return rate.' },
  { name: 'Crypto Prices', category: 'Finance & Money', url: 'https://coinmarketcap.com', tags: ['crypto', 'bitcoin', 'prices'], description: 'Track live cryptocurrency prices, market caps and charts.' },
  { name: 'Stock Screener', category: 'Finance & Money', url: 'https://finviz.com', tags: ['stocks', 'screener', 'market'], description: 'Filter and scan stocks with a fast screener, heat maps and charts.' },
  { name: 'Currency Rates', category: 'Finance & Money', url: 'https://www.oanda.com/currency-converter/', tags: ['currency', 'exchange', 'rates'], description: 'Convert currencies and view exchange rate history from a trusted source.' },
  { name: 'Inflation Calculator', category: 'Finance & Money', url: 'https://www.calculator.net/inflation-calculator.html', tags: ['finance', 'inflation', 'money'], description: 'See how the buying power of money changes over time with inflation.' },
];
