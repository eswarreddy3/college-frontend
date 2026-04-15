// HTML/CSS course — scenario-based lessons (indexed by lesson order, 1-based)
// Building CareerEzi's web frontend from scratch.
// Pattern mirrors Python/SQL: :::scenario, :::insight, :::tip, :::mistake, :::challenge

const htmlCssContent: Record<number, string> = {

  // ─────────────────────────────────────────────────────────────────────────
  // HTML BASICS — Lessons 1–5
  // ─────────────────────────────────────────────────────────────────────────

  1: `:::scenario
Week 1 at CareerEzi. Your team lead Priya drops a task in your inbox:

"The marketing team needs a landing page by Friday. We have the design — we just need someone to build it. It's HTML/CSS only. Can you handle it?"

You open VS Code. An empty folder stares back at you. Time to write your first web page.
:::

# HTML Document Structure

Every web page is an HTML file — a text document that browsers parse and render as a visual page. HTML (HyperText Markup Language) uses **tags** to describe structure and meaning.

## The Minimal Valid HTML Document

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareerEzi — Get Placed</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Welcome to CareerEzi</h1>
    <p>Your college placement preparation platform.</p>
  </body>
</html>
\`\`\`

Every line has a job. Let's break them down.

## DOCTYPE

\`\`\`html
<!DOCTYPE html>
\`\`\`

This is not a tag — it's a **declaration** that tells the browser: "This is an HTML5 document." Without it, browsers enter "quirks mode" and render things inconsistently. Always put it on line 1.

## The \`<html>\` Element

\`\`\`html
<html lang="en">
\`\`\`

The root of every page. The \`lang="en"\` attribute tells search engines and screen readers the language of the content. Always include it.

## The \`<head>\` — Metadata Zone

The \`<head>\` contains information **about** the page — none of it is rendered directly in the browser window.

| Tag | What it does |
|-----|-------------|
| \`<meta charset="UTF-8">\` | Enables all characters — accents, emoji, ₹ symbols |
| \`<meta name="viewport" ...>\` | Makes the page scale correctly on mobile devices |
| \`<title>\` | Text shown in the browser tab and search results |
| \`<link rel="stylesheet">\` | Attaches an external CSS file |

:::insight
\`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` is the single most important line for mobile responsiveness. Without it, mobile browsers zoom the page out to fit a 980px desktop layout — making everything tiny.
:::

## The \`<body>\` — Visible Content

Everything users **see** goes inside \`<body>\`. Text, images, buttons, forms — all of it.

## Tags, Elements & Attributes

\`\`\`html
<a href="https://careerezi.in" target="_blank">Visit CareerEzi</a>
<!-- ↑tag  ↑attribute="value"              ↑content  ↑closing tag -->
\`\`\`

- **Opening tag**: \`<a href="...">\`
- **Closing tag**: \`</a>\`
- **Attribute**: extra info about the element (always in the opening tag)
- **Void elements**: self-closing, no content — \`<img />\`, \`<br />\`, \`<meta />\`

## Linking CSS and JS

\`\`\`html
<head>
  <!-- CSS: always in <head> so styles load before content -->
  <link rel="stylesheet" href="style.css" />

  <!-- JS: place before </body> so HTML renders first -->
</head>
<body>
  ...
  <script src="app.js" defer></script>
</body>
\`\`\`

:::tip
Use **relative paths** for local files (\`href="style.css"\`) and **absolute URLs** for external resources. Relative paths work regardless of where the project is deployed.
:::

:::challenge
Create an \`index.html\` file with the structure above. Change the \`<title>\` to your name and add a paragraph describing what you want to build. Open it in your browser — you just created a web page.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  2: `:::scenario
The landing page skeleton is up. Priya reviews it and says:

"Good start. But there's no actual content yet — just empty boxes. We need headings, paragraphs, highlighted text. The page needs to *say* something."

You pull up the design mockup. Time to fill it with words.
:::

# Text, Headings & Paragraphs

HTML has a rich set of tags for text. Choosing the right one matters — not just for looks, but for **SEO and accessibility**.

## Headings: \`<h1>\` to \`<h6>\`

Headings create hierarchy. Think of them like a newspaper — one big headline, a few sub-headlines, smaller sections.

\`\`\`html
<h1>CareerEzi — Get Placed at Your Dream Company</h1>
<h2>Why Students Choose CareerEzi</h2>
<h3>Practice with Real Interview Questions</h3>
<h4>Topic-wise MCQs</h4>
\`\`\`

| Tag | Default size | Use for |
|-----|-------------|---------|
| \`<h1>\` | ~32px bold | Page title — one per page |
| \`<h2>\` | ~24px bold | Major sections |
| \`<h3>\` | ~18px bold | Sub-sections |
| \`<h4>\`–\`<h6>\` | Smaller | Nested content |

:::mistake
Don't use headings just to make text bigger. Use them for **document outline**. A screen reader navigates by headings — if you skip from h1 to h4, the structure is broken. Use CSS for visual sizing.
:::

## Paragraphs: \`<p>\`

\`\`\`html
<p>
  CareerEzi helps college students prepare for campus placements with curated
  courses, mock tests, and real company interview questions.
</p>
<p>
  Trusted by 4,200+ students across 17 colleges in India.
</p>
\`\`\`

Each \`<p>\` automatically gets a margin above and below. Browsers collapse whitespace — multiple spaces and newlines inside a tag become a single space.

## Inline Text Formatting

\`\`\`html
<p>
  Our platform uses <strong>AI-powered</strong> recommendations to
  <em>personalize</em> your preparation path.
</p>

<p>
  The company offers a <mark>₹12 LPA</mark> package for top performers.
</p>

<p>
  Use the formula: E = mc<sup>2</sup> or H<sub>2</sub>O
</p>
\`\`\`

| Tag | Meaning | Renders as |
|-----|---------|-----------|
| \`<strong>\` | Important text | **Bold** (semantic) |
| \`<em>\` | Emphasized text | *Italic* (semantic) |
| \`<b>\` | Bold styling only | **Bold** (visual only) |
| \`<i>\` | Italic styling only | *Italic* (visual only) |
| \`<mark>\` | Highlighted | Yellow background |
| \`<sup>\` | Superscript | x² |
| \`<sub>\` | Subscript | H₂O |
| \`<code>\` | Inline code | \`monospace font\` |

:::insight
Prefer \`<strong>\` over \`<b>\` and \`<em>\` over \`<i>\`. They carry **semantic meaning** — search engines and screen readers understand that \`<strong>\` means important. \`<b>\` just changes appearance.
:::

## Block vs Inline Elements

This is one of the most important HTML concepts:

\`\`\`html
<!-- Block elements: take full width, start on a new line -->
<h1>I am a block</h1>
<p>I am also a block — I push the next element below me.</p>

<!-- Inline elements: flow within text, no line break -->
<p>This text has <strong>bold</strong> and <em>italic</em> inline.</p>
\`\`\`

**Block elements**: \`<h1>\`–\`<h6>\`, \`<p>\`, \`<div>\`, \`<ul>\`, \`<table>\`
**Inline elements**: \`<a>\`, \`<strong>\`, \`<em>\`, \`<span>\`, \`<img>\`, \`<code>\`

## \`<span>\` and \`<div>\`: Generic Containers

\`\`\`html
<!-- div: generic block container (for layout) -->
<div class="hero-section">
  <h1>Get Placed at Top Companies</h1>
  <!-- span: generic inline container (for styling a portion of text) -->
  <p>Join <span class="highlight">4,200+</span> students already on CareerEzi</p>
</div>
\`\`\`

## Line Breaks and Dividers

\`\`\`html
<p>Line one.<br />Line two in the same paragraph.</p>

<hr />  <!-- horizontal rule — a visual divider -->
\`\`\`

:::tip
Avoid overusing \`<br />\` to create vertical space. That's CSS's job. Use \`<br />\` only for intentional line breaks within text (like a postal address or poem).
:::

:::challenge
Mark up the CareerEzi landing page hero section: one \`<h1>\` with the main tagline, a \`<p>\` with a short description using \`<strong>\` for emphasis, and a \`<p>\` showing the number of students with the count wrapped in \`<span class="stat">\`.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  3: `:::scenario
The text is in. Now the design calls for navigation links, a logo image, and a video demo section. Priya adds a note:

"Make sure the nav links open in the same tab. The external social media links should open in a new tab. And test the images — they must have alt text."

You nod. Time to connect things together.
:::

# Links, Images & Media

## Hyperlinks: \`<a>\`

The \`<a>\` (anchor) tag creates clickable links.

\`\`\`html
<!-- Internal link (same site) -->
<a href="/dashboard">Go to Dashboard</a>

<!-- External link -->
<a href="https://github.com/careerezi" target="_blank" rel="noopener noreferrer">
  GitHub
</a>

<!-- Link to section on same page -->
<a href="#features">See Features</a>
<section id="features">...</section>

<!-- Email link -->
<a href="mailto:support@careerezi.in">Contact Support</a>

<!-- Phone link (mobile) -->
<a href="tel:+919876543210">Call Us</a>
\`\`\`

:::insight
Always add \`rel="noopener noreferrer"\` when using \`target="_blank"\`. Without it, the opened page can access your page via \`window.opener\` — a security vulnerability called **reverse tabnapping**.
:::

## Link States (CSS preview)

\`\`\`css
a { color: #00D4C8; text-decoration: none; }
a:hover { text-decoration: underline; }
a:visited { color: #8B5CF6; }
\`\`\`

## Images: \`<img>\`

\`\`\`html
<!-- Basic image -->
<img src="logo.png" alt="CareerEzi Logo" />

<!-- With dimensions -->
<img src="hero.jpg" alt="Students celebrating placement" width="800" height="400" />

<!-- Lazy loading (performance) -->
<img src="feature.png" alt="Feature screenshot" loading="lazy" />
\`\`\`

| Attribute | Purpose |
|-----------|---------|
| \`src\` | Path or URL to the image file |
| \`alt\` | Alternative text (accessibility + SEO) |
| \`width\` / \`height\` | Reserve layout space (prevents layout shift) |
| \`loading="lazy"\` | Load image only when near viewport |

:::mistake
Never leave \`alt\` empty on meaningful images. Screen reader users depend on it. For purely decorative images (backgrounds), use \`alt=""\` to tell screen readers to skip it.
:::

## Relative vs Absolute Paths

\`\`\`html
<!-- Relative: relative to current file location -->
<img src="images/logo.png" alt="Logo" />
<img src="../assets/hero.jpg" alt="Hero" />

<!-- Absolute: full URL -->
<img src="https://cdn.careerezi.in/logo.png" alt="Logo" />
\`\`\`

## Responsive Images

\`\`\`html
<!-- srcset: browser picks the best size -->
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="CareerEzi hero banner"
/>

<!-- picture: art direction (different crops at different sizes) -->
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg" />
  <source media="(max-width: 1000px)" srcset="hero-tablet.jpg" />
  <img src="hero-desktop.jpg" alt="CareerEzi hero" />
</picture>
\`\`\`

## Video: \`<video>\`

\`\`\`html
<video width="800" controls autoplay muted loop poster="thumbnail.jpg">
  <source src="demo.mp4" type="video/mp4" />
  <source src="demo.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>
\`\`\`

| Attribute | Effect |
|-----------|--------|
| \`controls\` | Show play/pause/volume UI |
| \`autoplay\` | Start playing immediately |
| \`muted\` | Required for autoplay in most browsers |
| \`loop\` | Repeat when finished |
| \`poster\` | Thumbnail shown before play |

## Audio: \`<audio>\`

\`\`\`html
<audio controls>
  <source src="notification.mp3" type="audio/mpeg" />
</audio>
\`\`\`

## \`<figure>\` and \`<figcaption>\`

\`\`\`html
<figure>
  <img src="leaderboard.png" alt="CareerEzi leaderboard screenshot" />
  <figcaption>Top 10 students from VIT Vellore — March 2026</figcaption>
</figure>
\`\`\`

\`<figure>\` semantically groups media with its caption.

:::challenge
Build a simple profile card: a circular profile image (use \`border-radius: 50%\` via inline style), the person's name as \`<h2>\`, their college as \`<p>\`, and a link to their LinkedIn that opens in a new tab. Make sure all images have meaningful alt text.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  4: `:::scenario
"We need three pages now," Priya says. "The features list, a pricing table, and the login form. These are the most important pages on the site."

You crack your knuckles. Lists, tables, forms — the real HTML workhorse tags.
:::

# Lists, Tables & Forms

## Lists

### Unordered List — \`<ul>\`
Use when order doesn't matter (features, ingredients, nav items).

\`\`\`html
<ul>
  <li>AI-powered mock interviews</li>
  <li>Topic-wise MCQ practice</li>
  <li>Real company interview questions</li>
  <li>Leaderboard & streak tracking</li>
</ul>
\`\`\`

### Ordered List — \`<ol>\`
Use when sequence matters (steps, rankings).

\`\`\`html
<ol>
  <li>Create your account</li>
  <li>Complete the onboarding quiz</li>
  <li>Start your personalized learning path</li>
  <li>Track your progress on the dashboard</li>
</ol>
\`\`\`

### Nested Lists

\`\`\`html
<ul>
  <li>Technical Rounds
    <ul>
      <li>DSA</li>
      <li>System Design</li>
    </ul>
  </li>
  <li>HR Round</li>
</ul>
\`\`\`

## Tables

Use tables for **tabular data** — not for page layout (that's CSS's job).

\`\`\`html
<table>
  <thead>
    <tr>
      <th>Plan</th>
      <th>Price</th>
      <th>Students</th>
      <th>Features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Starter</td>
      <td>Free</td>
      <td>Up to 100</td>
      <td>Basic courses</td>
    </tr>
    <tr>
      <td>Pro</td>
      <td>₹999/mo</td>
      <td>Up to 500</td>
      <td>All courses + mock tests</td>
    </tr>
    <tr>
      <td>Enterprise</td>
      <td>Custom</td>
      <td>Unlimited</td>
      <td>Everything + placement support</td>
    </tr>
  </tbody>
</table>
\`\`\`

**Table structure tags:**

| Tag | Purpose |
|-----|---------|
| \`<table>\` | Container |
| \`<thead>\` | Header row group |
| \`<tbody>\` | Body row group |
| \`<tfoot>\` | Footer row group |
| \`<tr>\` | Table row |
| \`<th>\` | Header cell (bold + centered) |
| \`<td>\` | Data cell |
| \`colspan="2"\` | Cell spans 2 columns |
| \`rowspan="2"\` | Cell spans 2 rows |

## Forms

Forms are how users send data to the server.

\`\`\`html
<form action="/api/auth/login" method="POST">

  <label for="email">Email Address</label>
  <input type="email" id="email" name="email"
         placeholder="you@college.edu" required />

  <label for="password">Password</label>
  <input type="password" id="password" name="password"
         placeholder="Min 8 characters" required minlength="8" />

  <label>
    <input type="checkbox" name="remember" value="1" />
    Remember me for 30 days
  </label>

  <button type="submit">Log In</button>
  <button type="reset">Clear</button>

</form>
\`\`\`

### Input Types

| \`type=\` | Renders as | Validation |
|----------|-----------|------------|
| \`text\` | Text field | None |
| \`email\` | Text field | Must contain @ |
| \`password\` | Masked field | None |
| \`number\` | Number field | Numeric only |
| \`tel\` | Text (mobile shows numpad) | None |
| \`date\` | Date picker | Valid date |
| \`checkbox\` | Checkbox | — |
| \`radio\` | Radio button | — |
| \`file\` | File picker | — |
| \`range\` | Slider | — |
| \`hidden\` | Invisible | — |
| \`submit\` | Submit button | — |

### Radio Buttons (same \`name\` = one group)

\`\`\`html
<fieldset>
  <legend>I am a:</legend>
  <label><input type="radio" name="role" value="student" /> Student</label>
  <label><input type="radio" name="role" value="admin" /> College Admin</label>
</fieldset>
\`\`\`

### Select Dropdown

\`\`\`html
<label for="college">Select College</label>
<select id="college" name="college" required>
  <option value="">-- Choose your college --</option>
  <option value="vit">VIT Vellore</option>
  <option value="srm">SRM Chennai</option>
  <option value="manipal">Manipal</option>
</select>
\`\`\`

### Textarea

\`\`\`html
<textarea name="bio" rows="4" cols="50"
          placeholder="Tell us about yourself..."></textarea>
\`\`\`

:::tip
Always pair \`<label>\` with \`<input>\` using matching \`for\` / \`id\` attributes. This makes the label clickable (activates the input) and is essential for screen reader users.
:::

:::mistake
\`method="GET"\` puts form data in the URL — fine for search, wrong for login/passwords. Always use \`method="POST"\` for sensitive data.
:::

:::challenge
Build the CareerEzi signup form: fields for name, email, college (select dropdown with 4 options), password, a checkbox for "I agree to terms", and a submit button. Add \`required\` to all fields. Test that the browser blocks empty submission.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  5: `:::scenario
"The page works, but it's just divs everywhere," the senior dev Karan says during code review. "When Google crawls this, it can't tell what's a header, what's content, and what's a sidebar. And our accessibility score is terrible."

He opens Chrome DevTools. "Use semantic HTML. Let the markup tell the story."
:::

# Semantic HTML5 Elements

Before HTML5, every layout used \`<div>\` with class names: \`<div class="header">\`, \`<div class="footer">\`. Browsers and search engines had no idea what the content *meant*.

Semantic elements **describe their purpose** in the tag name itself.

## Page-Level Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>

  <header>
    <nav>
      <a href="/">CareerEzi</a>
      <ul>
        <li><a href="/learn">Learn</a></li>
        <li><a href="/practice">Practice</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h1>Get Placed at Your Dream Company</h1>
      <p>AI-powered placement prep for college students.</p>
    </section>

    <section id="features">
      <h2>Why Students Love CareerEzi</h2>

      <article class="feature-card">
        <h3>Practice MCQs</h3>
        <p>3,000+ topic-wise questions with explanations.</p>
      </article>

      <article class="feature-card">
        <h3>Coding Challenges</h3>
        <p>Solve problems in an in-browser Monaco editor.</p>
      </article>
    </section>

    <aside>
      <h2>Did You Know?</h2>
      <p>Students who practice 30 min/day get placed 3x faster.</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 CareerEzi. All rights reserved.</p>
    <address>
      <a href="mailto:support@careerezi.in">support@careerezi.in</a>
    </address>
  </footer>

</body>
</html>
\`\`\`

## Semantic Element Reference

| Element | Use for |
|---------|---------|
| \`<header>\` | Page or section header — logo, nav, hero |
| \`<nav>\` | Primary navigation links |
| \`<main>\` | The dominant content of the page (one per page) |
| \`<section>\` | Thematic grouping, usually has a heading |
| \`<article>\` | Self-contained, independently distributable content |
| \`<aside>\` | Supplementary content (sidebar, callout, tip box) |
| \`<footer>\` | Footer — copyright, links, contact info |
| \`<figure>\` | Self-contained media with optional caption |
| \`<figcaption>\` | Caption for a \`<figure>\` |
| \`<time>\` | Machine-readable date/time |
| \`<address>\` | Contact information for the nearest article/body |
| \`<mark>\` | Highlighted/relevant text |
| \`<details>\`/\`<summary>\` | Collapsible disclosure widget |

## \`<section>\` vs \`<article>\` vs \`<div>\`

\`\`\`html
<!-- section: thematic group (needs a heading, part of a larger page) -->
<section>
  <h2>Student Reviews</h2>
  <!-- content -->
</section>

<!-- article: standalone content (could be shared/syndicated alone) -->
<article>
  <h2>How I Got Placed at Google — by Aarav Shah</h2>
  <p>My preparation journey started with CareerEzi...</p>
</article>

<!-- div: no semantic meaning — use only for styling/layout hooks -->
<div class="flex-container">
  <div class="col">...</div>
</div>
\`\`\`

## \`<time>\` Element

\`\`\`html
<p>Registration closes on
  <time datetime="2026-04-30">April 30, 2026</time>.
</p>

<time datetime="2026-03-16T14:30">March 16, 2026 at 2:30 PM</time>
\`\`\`

The \`datetime\` attribute is machine-readable (ISO 8601). The displayed text can be human-friendly.

## \`<details>\` and \`<summary>\` — Native Accordion

\`\`\`html
<details>
  <summary>What is the refund policy?</summary>
  <p>We offer a full refund within 7 days of purchase, no questions asked.</p>
</details>
\`\`\`

This is a **zero-JavaScript accordion** built into HTML.

:::insight
Semantic HTML directly impacts SEO. Google's crawler assigns more weight to content inside \`<main>\` and \`<article>\` than to content inside generic \`<div>\` elements. A well-structured page can rank higher without any other changes.
:::

:::challenge
Audit your CareerEzi landing page. Replace every \`<div class="header">\` with \`<header>\`, every \`<div class="nav">\` with \`<nav>\`, and so on. Then open Chrome DevTools → Accessibility panel and check the document outline.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  // CSS BASICS — Lessons 6–8
  // ─────────────────────────────────────────────────────────────────────────

  6: `:::scenario
The HTML structure is solid. But everything looks like a 1995 website — plain black text on white. Priya sends the Figma design file.

"Make it look like this," she says. The design shows dark backgrounds, teal accents, clean typography. "Welcome to CSS."
:::

# CSS Selectors & Specificity

CSS (Cascading Style Sheets) controls how HTML looks. The "cascading" part means rules can override each other — and understanding **specificity** tells you which rule wins.

## Three Ways to Add CSS

\`\`\`html
<!-- 1. Inline styles (avoid — hard to maintain) -->
<p style="color: red; font-size: 18px;">Don't do this</p>

<!-- 2. Internal stylesheet (ok for single-page demos) -->
<head>
  <style>
    p { color: blue; }
  </style>
</head>

<!-- 3. External stylesheet (always prefer this) -->
<head>
  <link rel="stylesheet" href="style.css" />
</head>
\`\`\`

External stylesheets are reusable, cacheable, and keep HTML clean.

## Basic Selectors

\`\`\`css
/* Element selector — targets all <p> tags */
p {
  color: #1a1a2e;
  font-size: 16px;
}

/* Class selector — targets class="card" */
.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

/* ID selector — targets id="hero" (unique per page) */
#hero {
  background: #0A0F1E;
  padding: 80px 0;
}

/* Universal selector — targets everything */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
\`\`\`

## Combinator Selectors

\`\`\`css
/* Descendant: any <p> inside .card (any depth) */
.card p { color: #aaa; }

/* Child: only DIRECT <li> children of <ul> */
ul > li { list-style: none; }

/* Adjacent sibling: <p> immediately after <h2> */
h2 + p { font-size: 18px; }

/* General sibling: all <p> after an <h2> */
h2 ~ p { color: #888; }
\`\`\`

## Pseudo-classes

\`\`\`css
/* User interaction */
a:hover       { color: #00D4C8; }
button:focus  { outline: 2px solid #00D4C8; }
input:disabled { opacity: 0.5; }

/* Structural */
li:first-child  { border-top: none; }
li:last-child   { border-bottom: none; }
li:nth-child(2) { background: #1A1F35; }
li:nth-child(odd)  { background: #f9f9f9; }
li:nth-child(3n+1) { color: gold; }

/* Form state */
input:valid   { border-color: green; }
input:invalid { border-color: red; }
input:focus   { border-color: #00D4C8; }
\`\`\`

## Specificity: Who Wins?

When two rules target the same element, **specificity** decides which wins.

| Selector | Specificity score |
|----------|------------------|
| \`*\` | 0-0-0 |
| \`p\`, \`div\` | 0-0-1 |
| \`.class\`, \`:hover\` | 0-1-0 |
| \`#id\` | 1-0-0 |
| Inline \`style=""\` | 1-0-0-0 |
| \`!important\` | Overrides all |

\`\`\`css
p { color: black; }         /* 0-0-1 */
.intro { color: blue; }     /* 0-1-0 — wins over p */
#hero p { color: teal; }    /* 1-0-1 — wins over .intro */
\`\`\`

\`\`\`html
<p id="hero" class="intro">What color am I?</p>
<!-- Answer: teal (#hero p wins with 1-0-1) -->
\`\`\`

:::insight
The **cascade** has three rules in order:
1. **Specificity** — higher score wins
2. **Source order** — later rule wins if specificity is equal
3. **\`!important\`** — nuclear option, avoid when possible

Most CSS bugs come from specificity conflicts. When a style isn't applying, open DevTools and look for the strikethrough rule — something is overriding it.
:::

:::mistake
Using \`!important\` everywhere is a trap. It feels like a fix but creates an arms race — you then need \`!important\` on everything. Solve specificity properly instead.
:::

:::challenge
Write CSS that makes: all \`<a>\` tags teal, only links inside \`<nav>\` white, and the currently active nav link (with class \`active\`) have an underline. Use the cascade correctly — no \`!important\` needed.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  7: `:::scenario
"Why does my button look different in different browsers?" you ask Karan.

He sighs. "You haven't reset the box model. Every browser adds its own default padding and margins. And you're probably mixing up content-box and border-box sizing." He pulls up DevStyles. "The box model is everything in CSS layout."
:::

# Box Model & Spacing

Every HTML element is rendered as a rectangular box. Understanding this box is the key to controlling layout.

## The Box Model

\`\`\`
┌─────────────────────────────┐  ← margin (outside, transparent)
│  ┌───────────────────────┐  │
│  │  border               │  │
│  │  ┌─────────────────┐  │  │
│  │  │  padding        │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
\`\`\`

- **Content** — where text/images live (controlled by \`width\` and \`height\`)
- **Padding** — inner space between content and border (inherits background)
- **Border** — visible edge around padding
- **Margin** — outer space between this element and others (always transparent)

## Padding

\`\`\`css
/* All sides */
.card { padding: 24px; }

/* Vertical | Horizontal */
.card { padding: 16px 24px; }

/* Top | Right | Bottom | Left (clockwise) */
.card { padding: 10px 20px 10px 20px; }

/* Individual sides */
.card {
  padding-top: 16px;
  padding-right: 24px;
  padding-bottom: 16px;
  padding-left: 24px;
}
\`\`\`

## Margin

\`\`\`css
/* Same shorthand as padding */
.section { margin: 40px 0; }  /* 40px top/bottom, 0 left/right */

/* Center a block element horizontally */
.container {
  width: 1200px;
  margin: 0 auto;  /* auto = split remaining space equally */
}
\`\`\`

### Margin Collapse

\`\`\`css
h2 { margin-bottom: 20px; }
p  { margin-top: 16px; }
\`\`\`

When a \`<h2>\` is followed by a \`<p>\`, you might expect 36px gap. But **vertical margins collapse** — you get the *larger* value: 20px.

Horizontal margins never collapse. Neither do flex/grid children.

## Border

\`\`\`css
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

/* Individual sides */
.input {
  border: none;
  border-bottom: 2px solid #00D4C8;
}

/* Rounded corners */
.avatar { border-radius: 50%; }      /* circle */
.btn    { border-radius: 8px; }      /* rounded rect */
.pill   { border-radius: 9999px; }   /* pill */
\`\`\`

## \`box-sizing: border-box\`

This is the most important CSS reset you'll ever write:

\`\`\`css
/* content-box (default): width = content only */
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual rendered width = 200 + 40 + 4 = 244px! */
}

/* border-box: width = content + padding + border */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual rendered width = exactly 200px */
}
\`\`\`

Apply it globally — this is standard in every modern project:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

## \`outline\` vs \`border\`

\`\`\`css
/* border: part of the box model, affects layout */
.btn { border: 2px solid #00D4C8; }

/* outline: drawn OUTSIDE the border, does NOT affect layout */
/* Never remove focus outlines — keyboard users depend on them */
.btn:focus { outline: 2px solid #00D4C8; outline-offset: 2px; }
\`\`\`

:::insight
\`outline\` is the browser's default focus indicator. Many developers write \`outline: none\` to remove the "ugly" focus ring, accidentally breaking keyboard navigation. Always replace it with a custom style — never just remove it.
:::

## \`width\` and \`height\`

\`\`\`css
.hero {
  width: 100%;          /* 100% of parent */
  min-height: 100vh;    /* at least full viewport height */
  max-width: 1200px;    /* never wider than 1200px */
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;    /* crop image to fill without distortion */
}
\`\`\`

:::challenge
Build a CareerEzi stats card: a 300px wide card with 24px padding, a 1px border with border-radius 12px, a heading, a big number, and a label. Use \`box-sizing: border-box\`. Then add \`margin: 0 auto\` to center it on the page.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  8: `:::scenario
"The layout is working but the colors are off," Priya says, comparing the page to the Figma design. "The background needs to be #0A0F1E, the primary color is that teal — #00D4C8 — and the font needs to be DM Sans."

You open the design tokens file. Time to master colors and typography.
:::

# Colors, Typography & Backgrounds

## Color Formats

CSS accepts colors in many formats. Choose based on what the design system uses.

\`\`\`css
/* Named colors (150 standard names) */
color: white;
color: crimson;

/* Hexadecimal — most common in design tools */
color: #00D4C8;       /* teal */
color: #0A0F1E;       /* dark background */
color: #F59E0B;       /* amber accent */

/* Shorthand hex (when each pair repeats) */
color: #fff;          /* = #ffffff */
color: #0af;          /* = #00aaff */

/* RGB */
color: rgb(0, 212, 200);

/* RGBA — with alpha (0=transparent, 1=opaque) */
color: rgba(0, 212, 200, 0.3);  /* 30% opacity teal */
background: rgba(255, 255, 255, 0.05);  /* glass card effect */

/* HSL — Hue(0-360°), Saturation(%), Lightness(%) */
color: hsl(177, 100%, 42%);

/* HSLA */
color: hsla(177, 100%, 42%, 0.5);

/* Modern: space-separated + optional alpha */
color: oklch(0.7 0.15 180);  /* perceptually uniform, CSS Level 4 */
\`\`\`

:::insight
**HSL is the most intuitive for humans.** Want a lighter version of teal? Increase lightness: \`hsl(177, 100%, 60%)\`. Want a transparent version? Use \`hsla(177, 100%, 42%, 0.3)\`. Design systems often define colors in HSL for easy manipulation.
:::

## \`color\` and \`background-color\`

\`\`\`css
body {
  background-color: #0A0F1E;
  color: #ffffff;  /* text color inherits to children */
}

.badge {
  background-color: rgba(0, 212, 200, 0.1);
  color: #00D4C8;
}
\`\`\`

## Gradients

\`\`\`css
/* Linear gradient */
.hero {
  background: linear-gradient(135deg, #0A0F1E 0%, #1A1F35 100%);
}

/* Left to right */
.btn {
  background: linear-gradient(to right, #00D4C8, #8B5CF6);
}

/* Multiple stops */
.rainbow {
  background: linear-gradient(90deg, #f00, #ff0, #0f0, #00f);
}

/* Radial gradient */
.spotlight {
  background: radial-gradient(circle at 30% 50%, #1A1F35, #0A0F1E);
}

/* Gradient on text */
.gradient-text {
  background: linear-gradient(135deg, #00D4C8, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
\`\`\`

## Typography

### \`font-family\`

\`\`\`css
/* System font stack (fast, no download) */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, sans-serif;
}

/* Google Fonts (add <link> in <head> first) */
/* <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet"> */
body {
  font-family: 'DM Sans', sans-serif;
}
\`\`\`

### \`font-size\` Units

\`\`\`css
/* px: absolute — good for borders and fine details */
.caption { font-size: 12px; }

/* rem: relative to root <html> element (best for body text) */
/* If html { font-size: 16px }, then 1rem = 16px */
body  { font-size: 1rem; }     /* 16px */
h2    { font-size: 1.5rem; }   /* 24px */
small { font-size: 0.875rem; } /* 14px */

/* em: relative to PARENT element (use for padding/margin) */
.btn {
  font-size: 1rem;
  padding: 0.75em 1.5em;  /* scales with the button's own font-size */
}

/* % and vw for fluid / responsive type */
h1 { font-size: clamp(1.8rem, 4vw, 3rem); }
\`\`\`

### Text Properties

\`\`\`css
h1 {
  font-size: 3rem;
  font-weight: 700;         /* 100-900, or normal/bold */
  font-style: normal;       /* or italic */
  line-height: 1.2;         /* 1.2× the font-size — unitless is best */
  letter-spacing: -0.02em;  /* tight tracking for headings */
  text-align: center;       /* left | center | right | justify */
  text-transform: uppercase;/* uppercase | lowercase | capitalize */
  text-decoration: none;    /* underline | line-through | none */
}

p {
  font-size: 1rem;
  line-height: 1.7;         /* comfortable reading line-height */
  max-width: 65ch;          /* ch = width of "0" character — ideal measure */
}
\`\`\`

## Background Utilities

\`\`\`css
.hero {
  background-image: url('hero.jpg');
  background-size: cover;     /* cover: fill, may crop | contain: show all */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* parallax scrolling effect */
}

/* Shorthand */
.hero {
  background: url('hero.jpg') center/cover no-repeat #0A0F1E;
}

/* Glass morphism (CareerEzi's card style) */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
\`\`\`

:::challenge
Style the CareerEzi hero section: dark gradient background, white heading with gradient text effect using the teal-to-purple gradient, DM Sans font loaded from Google Fonts, a comfortable \`line-height\` of 1.6 for the body text, and a glass-morphism card in the center.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  // CSS INTERMEDIATE — Lessons 9–12
  // ─────────────────────────────────────────────────────────────────────────

  9: `:::scenario
"The navbar items are stacking vertically," Priya says. "They should be in a horizontal row, with the logo on the left and the links on the right. And the feature cards should be in a 3-column grid."

"Use Flexbox," Karan says from across the desk. "It's the most useful CSS tool you'll ever learn."
:::

# Flexbox Layout

Flexbox is a **one-dimensional** layout system — it lays items in a row OR a column, and gives you fine-grained control over alignment and spacing.

## Turning on Flexbox

\`\`\`css
.navbar {
  display: flex;  /* Makes .navbar a flex container */
               /* All DIRECT children become flex items */
}
\`\`\`

\`\`\`html
<nav class="navbar">
  <a href="/" class="logo">CareerEzi</a>  <!-- flex item 1 -->
  <ul class="nav-links">...</ul>       <!-- flex item 2 -->
  <button>Sign Up</button>             <!-- flex item 3 -->
</nav>
\`\`\`

## Main Axis and Cross Axis

\`\`\`css
/* flex-direction sets the MAIN axis */
.container {
  flex-direction: row;         /* → default: items go left to right */
  flex-direction: row-reverse; /* ← right to left */
  flex-direction: column;      /* ↓ items stack top to bottom */
  flex-direction: column-reverse; /* ↑ bottom to top */
}
\`\`\`

The **cross axis** is perpendicular to the main axis.

## Alignment

\`\`\`css
/* justify-content: align along MAIN axis */
.navbar {
  justify-content: flex-start;     /* items pack to start (default) */
  justify-content: flex-end;       /* items pack to end */
  justify-content: center;         /* items centered */
  justify-content: space-between;  /* even gaps, edges flush */
  justify-content: space-around;   /* even gaps including edges (half at ends) */
  justify-content: space-evenly;   /* perfectly even gaps everywhere */
}

/* align-items: align along CROSS axis */
.navbar {
  align-items: stretch;    /* stretch to fill height (default) */
  align-items: center;     /* vertically centered ← most used */
  align-items: flex-start; /* aligned to start */
  align-items: flex-end;   /* aligned to end */
  align-items: baseline;   /* aligned by text baseline */
}
\`\`\`

## Building the CareerEzi Navbar

\`\`\`css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: rgba(10, 15, 30, 0.95);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 32px;  /* gap: space between flex items (no margins needed) */
}

.nav-links a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-links a:hover { color: #00D4C8; }
\`\`\`

## \`gap\`

\`\`\`css
.card-grid {
  display: flex;
  gap: 24px;         /* equal gap in both directions */
  gap: 16px 24px;    /* row-gap column-gap */
}
\`\`\`

## Flex Item Properties

\`\`\`css
/* flex-grow: how much extra space this item takes */
.logo { flex-grow: 0; }         /* don't grow (default) */
.content { flex-grow: 1; }      /* take all remaining space */

/* flex-shrink: can this item shrink if space is tight? */
.sidebar { flex-shrink: 0; }    /* never shrink — fixed width sidebar */

/* flex-basis: the starting size before grow/shrink */
.item { flex-basis: 200px; }

/* Shorthand: flex: grow shrink basis */
.item { flex: 1 1 0; }          /* "flex: 1" shorthand */
.sidebar { flex: 0 0 280px; }   /* fixed 280px, no grow/shrink */

/* align-self: override align-items for one item */
.cta-button { align-self: center; }

/* order: visual reorder without changing HTML */
.logo { order: -1; }  /* move to front */
\`\`\`

## \`flex-wrap\`

\`\`\`css
/* By default, flex items stay on one line and shrink */
.cards {
  display: flex;
  flex-wrap: wrap;     /* allow items to wrap to next line */
  gap: 24px;
}

/* Each card takes at least 280px, grows to fill space */
.card {
  flex: 1 1 280px;
}
\`\`\`

This creates a **responsive grid** with zero media queries — cards wrap automatically when there's no room.

## Perfect Centering

\`\`\`css
/* Center anything horizontally and vertically */
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
\`\`\`

:::insight
**Flexbox vs Grid:** Use Flexbox for **1D layouts** — navbars, button groups, centering a single item. Use Grid (next lesson) for **2D layouts** — page sections, card grids, dashboard layouts.

The rule of thumb: if you're thinking "row OR column," use Flexbox. If you're thinking "rows AND columns at the same time," use Grid.
:::

:::challenge
Build the CareerEzi navbar with: logo on the left, nav links in the center using \`<ul>\` with \`display: flex; gap: 24px\`, and a "Sign Up" button on the right using \`justify-content: space-between\`. The whole navbar should be vertically centered with \`align-items: center\`.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  10: `:::scenario
"The feature cards look good, but the dashboard layout is complex," Priya says, showing the design. "Left sidebar, main content area, and a right stats panel — all at the same time. Flexbox can't handle this cleanly."

Karan nods. "That's CSS Grid. Two-dimensional layout. Let me show you."
:::

# CSS Grid Layout

CSS Grid is a **two-dimensional** layout system — you control rows AND columns simultaneously. It's purpose-built for page layouts.

## Defining a Grid

\`\`\`css
.dashboard {
  display: grid;

  /* Define 3 columns */
  grid-template-columns: 280px 1fr 320px;
  /* Fixed | Flexible | Fixed */

  /* Define rows */
  grid-template-rows: 64px 1fr;
  /* Header height | Content fills remaining */

  gap: 0;
  min-height: 100vh;
}
\`\`\`

\`\`\`html
<div class="dashboard">
  <header class="topbar">...</header>
  <aside class="sidebar">...</aside>
  <main class="content">...</main>
  <aside class="stats-panel">...</aside>
</div>
\`\`\`

## The \`fr\` Unit

\`fr\` = **fractional unit** of available space (after fixed columns are placed).

\`\`\`css
/* Three equal columns */
grid-template-columns: 1fr 1fr 1fr;

/* Middle column is twice as wide */
grid-template-columns: 1fr 2fr 1fr;

/* Fixed sidebar + flexible content */
grid-template-columns: 280px 1fr;
\`\`\`

## \`repeat()\` Function

\`\`\`css
/* 3 equal columns */
grid-template-columns: repeat(3, 1fr);

/* 12-column grid */
grid-template-columns: repeat(12, 1fr);

/* Auto-responsive: as many columns as fit, min 250px each */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
\`\`\`

That last one is magic — **a responsive grid with zero media queries**:

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

Cards fill the row. When they can't fit, they wrap to the next row automatically.

## Placing Items

\`\`\`css
/* grid-column: start / end (line numbers) */
.header {
  grid-column: 1 / 4;    /* span all 3 columns */
  grid-row: 1 / 2;
}

/* Shorthand: span keyword */
.featured-card {
  grid-column: span 2;   /* take up 2 columns */
}

/* grid-area: row-start / col-start / row-end / col-end */
.sidebar {
  grid-area: 2 / 1 / 3 / 2;
}
\`\`\`

## Named Template Areas

This is the most readable Grid approach for page layouts:

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar content"
    "sidebar footer";
  min-height: 100vh;
}

.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-content { grid-area: content; }
.page-footer  { grid-area: footer; }
\`\`\`

The visual ASCII art in \`grid-template-areas\` mirrors the actual layout.

## Alignment in Grid

\`\`\`css
.grid {
  /* Align all items horizontally within their cell */
  justify-items: start | center | end | stretch;

  /* Align all items vertically within their cell */
  align-items: start | center | end | stretch;

  /* Align the grid itself within the container */
  justify-content: center;
  align-content: center;
}

/* Override alignment for a single item */
.featured {
  justify-self: center;
  align-self: end;
}
\`\`\`

## \`auto-fill\` vs \`auto-fit\`

\`\`\`css
/* auto-fill: creates empty columns if space allows */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit: collapses empty columns — items stretch to fill */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
\`\`\`

For most responsive card grids, use **\`auto-fit\`**.

## Grid vs Flexbox — When to Use Which

| Situation | Use |
|-----------|-----|
| Navbar, button group (1D row) | Flexbox |
| Card grid, dashboard layout (2D) | Grid |
| Centering one item | Flexbox |
| Complex page sections | Grid |
| Unknown number of items | Flexbox with wrap |
| Items must align across rows | Grid |

:::insight
You can (and should) nest Grid and Flexbox. A Grid handles the outer page layout; Flexbox handles the inner card content. They work together perfectly.
:::

:::challenge
Build the CareerEzi dashboard skeleton using Grid: \`grid-template-areas\` with a topbar spanning full width, a 260px sidebar on the left, and a main content area filling the rest. Add a \`gap: 0\` and make sure the layout takes full viewport height.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  11: `:::scenario
"The modal is behind the navbar," you tell Karan. "And the sticky sidebar stops sticking halfway down the page. I don't understand positioning."

"Welcome to the part that breaks everyone's brain," he says. "Pull up a chair. We're going through the entire position system."
:::

# Positioning & Z-index

By default, every element flows naturally in the document. The \`position\` property lets you break out of that flow.

## \`position: static\` (default)

\`\`\`css
div {
  position: static;  /* default — follows normal flow */
  /* top/right/bottom/left have NO effect */
}
\`\`\`

## \`position: relative\`

Moves the element **relative to its normal position**, but keeps its space in the flow. Other elements don't reflow.

\`\`\`css
.badge {
  position: relative;
  top: -4px;   /* 4px above its normal position */
  left: 8px;
}
\`\`\`

Most importantly, \`position: relative\` creates a **positioning context** for absolutely-positioned children.

## \`position: absolute\`

Removes the element from normal flow. Positions it relative to its **nearest positioned ancestor** (an ancestor with any position other than static).

\`\`\`css
.card {
  position: relative;  /* becomes the positioning context */
}

.card .badge {
  position: absolute;
  top: -8px;
  right: -8px;
  /* Positioned relative to .card, not the page */
}
\`\`\`

\`\`\`css
/* Overlay that covers its parent */
.card-overlay {
  position: absolute;
  inset: 0;  /* shorthand for top:0; right:0; bottom:0; left:0 */
  background: rgba(0,0,0,0.5);
  border-radius: inherit;
}
\`\`\`

:::mistake
The most common absolute positioning mistake: forgetting to add \`position: relative\` to the parent. Without it, the element positions relative to the nearest positioned ancestor — often the \`<body>\`, which breaks the layout completely.
:::

## \`position: fixed\`

Positions relative to the **viewport**. Stays in place when scrolling.

\`\`\`css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(12px);
}

/* Add padding to body so content isn't hidden behind fixed navbar */
body { padding-top: 64px; }
\`\`\`

## \`position: sticky\`

Acts like \`relative\` until it hits a scroll threshold, then behaves like \`fixed\`.

\`\`\`css
.sidebar {
  position: sticky;
  top: 80px;  /* sticks 80px from the top when scrolling */
  height: fit-content;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

/* Sticky table headers */
thead th {
  position: sticky;
  top: 0;
  background: #1A1F35;
  z-index: 1;
}
\`\`\`

:::insight
\`position: sticky\` requires the parent to have a defined height and NOT have \`overflow: hidden\` or \`overflow: auto\` — these break stickiness by clipping the scroll context.
:::

## \`z-index\`: Stack Order

When elements overlap, \`z-index\` controls which one appears on top. Higher = in front.

\`\`\`css
/* Typical z-index scale */
.content  { z-index: 0; }
.dropdown { z-index: 10; }
.sidebar  { z-index: 20; }
.modal    { z-index: 100; }
.toast    { z-index: 200; }
.tooltip  { z-index: 300; }
\`\`\`

\`z-index\` only works on **positioned elements** (not \`static\`).

### Stacking Contexts

A new stacking context is created when you combine \`position\` with \`z-index\`, or use \`transform\`, \`opacity < 1\`, or \`filter\`. All children are stacked within that context.

\`\`\`css
/* This creates a new stacking context */
/* Children can't escape above parent's z-index */
.card {
  position: relative;
  z-index: 1;
  transform: translateZ(0); /* also creates stacking context */
}
\`\`\`

## \`overflow\`

\`\`\`css
.container { overflow: visible; }  /* default: content can overflow */
.container { overflow: hidden; }   /* clip overflowing content */
.container { overflow: scroll; }   /* always show scrollbar */
.container { overflow: auto; }     /* scrollbar only when needed */

/* Axis-specific */
.table-wrapper {
  overflow-x: auto;   /* horizontal scroll for wide tables */
  overflow-y: hidden;
}
\`\`\`

## Building a Modal

\`\`\`css
/* Overlay: covers the entire viewport */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* Modal box: centered, doesn't cover full screen */
.modal {
  position: relative;
  background: #1A1F35;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 480px;
}

/* Close button in top-right corner */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}
\`\`\`

:::challenge
Build a CareerEzi notification toast that appears fixed in the bottom-right corner of the viewport (position: fixed, bottom: 24px, right: 24px). Give it a high z-index so it appears above all other content. Add a badge with \`position: absolute\` in the top-right corner of a card component.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  12: `:::scenario
"Open the site on your phone," Priya says. You pull out your phone. Everything is tiny — the desktop layout squeezed into 390px.

"We need this to be mobile-first," she continues. "60% of students will access CareerEzi on their phones. If it doesn't work on mobile, it doesn't work."
:::

# Responsive Design & Media Queries

Responsive design means your layout **adapts** to different screen sizes — from a 320px phone to a 4K monitor.

## The Viewport Meta Tag

First, make sure this is in your \`<head>\`. Without it, mobile browsers render the page at 980px and zoom out:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

## Mobile-First Philosophy

Start with styles for small screens. Use \`min-width\` media queries to add complexity as the screen gets larger.

\`\`\`css
/* Base styles: MOBILE (no media query needed) */
.cards {
  display: grid;
  grid-template-columns: 1fr;   /* 1 column on mobile */
  gap: 16px;
}

/* Tablet: 640px and above */
@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns */
    gap: 20px;
  }
}

/* Desktop: 1024px and above */
@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns */
    gap: 24px;
  }
}
\`\`\`

:::insight
**Mobile-first with \`min-width\`** is the industry standard. The alternative (desktop-first with \`max-width\`) leads to larger CSS files and more override conflicts. Always start small and scale up.
:::

## Common Breakpoints

| Name | Width | Targets |
|------|-------|---------|
| xs | < 480px | Small phones |
| sm | ≥ 640px | Large phones, landscape |
| md | ≥ 768px | Tablets |
| lg | ≥ 1024px | Small laptops |
| xl | ≥ 1280px | Desktops |
| 2xl | ≥ 1536px | Large monitors |

## Media Query Syntax

\`\`\`css
/* Width conditions */
@media (min-width: 768px) { ... }
@media (max-width: 767px) { ... }
@media (min-width: 640px) and (max-width: 1023px) { ... }

/* Device type */
@media print { ... }        /* print preview */
@media screen { ... }       /* screens only */

/* User preferences */
@media (prefers-color-scheme: dark)   { ... }
@media (prefers-reduced-motion: reduce) { ... }

/* Orientation */
@media (orientation: landscape) { ... }
@media (orientation: portrait)  { ... }
\`\`\`

## Fluid Units

Prefer relative units over fixed pixels for scalable layouts:

\`\`\`css
/* % of parent */
.container { width: 90%; max-width: 1200px; margin: 0 auto; }

/* vw / vh: viewport width / height */
.hero { min-height: 100vh; }
.hero-title { font-size: 5vw; }  /* scales with window width */

/* vmin / vmax */
.square { width: 50vmin; height: 50vmin; }

/* clamp(min, preferred, max) — fluid without media queries */
.hero-title {
  font-size: clamp(1.8rem, 5vw, 4rem);
  /* minimum: 1.8rem, ideal: 5vw, maximum: 4rem */
}

.container {
  padding: clamp(16px, 4vw, 64px);
}
\`\`\`

## Responsive Navigation

\`\`\`css
/* Mobile: hamburger menu */
.nav-links {
  display: none;  /* hidden on mobile */
  flex-direction: column;
}

.hamburger { display: block; }

/* Desktop: horizontal nav */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
    flex-direction: row;
    gap: 32px;
  }
  .hamburger { display: none; }
}
\`\`\`

## Responsive Images

\`\`\`css
/* Images never overflow their container */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Fill a container while maintaining aspect ratio */
.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;     /* crop to fill, no distortion */
  object-position: center;
}
\`\`\`

## Responsive Typography

\`\`\`css
:root {
  font-size: 16px;  /* base */
}

/* Scale the root font-size for larger screens */
@media (min-width: 1200px) {
  :root { font-size: 18px; }
  /* Now all rem values scale up proportionally */
}

h1 { font-size: clamp(1.8rem, 4vw + 1rem, 4rem); }
h2 { font-size: clamp(1.4rem, 3vw + 0.5rem, 2.5rem); }
p  { font-size: clamp(0.9rem, 1vw + 0.5rem, 1.1rem); }
\`\`\`

## \`prefers-reduced-motion\`

\`\`\`css
/* Animations on by default */
.card { transition: transform 0.3s ease; }
.card:hover { transform: translateY(-4px); }

/* Disable for users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .card:hover { transform: none; }
}
\`\`\`

:::challenge
Make the CareerEzi landing page fully responsive: stack the hero content vertically on mobile (< 768px), show a 2-column feature grid on tablet, and 3-column on desktop. Use \`clamp()\` for the hero title font size. Add a media query that hides the sidebar on mobile.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  // CSS ADVANCED — Lessons 13–15
  // ─────────────────────────────────────────────────────────────────────────

  13: `:::scenario
"The site looks great," Priya says. "But it feels static. When I hover a button, nothing happens. The modals just pop in with no transition. Compare it to our Figma prototype — everything should feel smooth."

Karan points at your screen. "CSS animations. This is what separates a site that looks built from a site that feels alive."
:::

# CSS Transitions & Animations

## Transitions

A transition smoothly animates a CSS property change from one value to another.

\`\`\`css
/* Syntax: transition: property duration timing-function delay; */
.btn {
  background: #1A1F35;
  color: white;
  transform: translateY(0);

  transition: background 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  background: #00D4C8;
  transform: translateY(-2px);
}
\`\`\`

### Timing Functions

\`\`\`css
transition-timing-function: ease;          /* slow-fast-slow (default) */
transition-timing-function: linear;        /* constant speed */
transition-timing-function: ease-in;       /* slow start */
transition-timing-function: ease-out;      /* slow end */
transition-timing-function: ease-in-out;   /* slow start and end */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); /* bounce */
transition-timing-function: steps(4);      /* 4 discrete steps */
\`\`\`

### Transitioning Multiple Properties

\`\`\`css
.card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 212, 200, 0.15);
  border-color: rgba(0, 212, 200, 0.4);
}

/* transition: all — convenient but triggers on every property change */
/* Use specific properties for performance */
\`\`\`

## \`transform\`

\`transform\` manipulates elements visually without affecting layout:

\`\`\`css
/* Translate (move) */
transform: translateX(20px);       /* move right */
transform: translateY(-10px);      /* move up */
transform: translate(20px, -10px); /* move right and up */

/* Scale */
transform: scale(1.1);      /* 110% size */
transform: scaleX(0);       /* collapse horizontally */

/* Rotate */
transform: rotate(45deg);   /* clockwise */
transform: rotate(-45deg);  /* counter-clockwise */

/* Skew */
transform: skewX(10deg);

/* Multiple transforms */
transform: translateY(-4px) scale(1.02) rotate(1deg);
\`\`\`

## \`@keyframes\` Animations

While transitions handle two states, \`@keyframes\` define multi-step animations:

\`\`\`css
/* Define the animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply it */
.hero-content {
  animation: fadeIn 0.6s ease-out forwards;
  /* name | duration | timing | fill-mode */
}
\`\`\`

### Percentage Keyframes

\`\`\`css
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0, 212, 200, 0.4); }
  70%  { box-shadow: 0 0 0 12px rgba(0, 212, 200, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 212, 200, 0); }
}

.notification-dot {
  animation: pulse 2s infinite;
}
\`\`\`

### Animation Shorthand

\`\`\`css
/* animation: name duration timing delay iteration direction fill-mode */
.modal {
  animation: slideUp 0.3s ease-out 0s 1 normal forwards;
}

/* Multiple animations */
.star {
  animation:
    spin 3s linear infinite,
    glow 1.5s ease-in-out infinite alternate;
}
\`\`\`

### Key Properties

| Property | Values |
|----------|--------|
| \`animation-iteration-count\` | \`1\`, \`3\`, \`infinite\` |
| \`animation-direction\` | \`normal\`, \`reverse\`, \`alternate\`, \`alternate-reverse\` |
| \`animation-fill-mode\` | \`none\`, \`forwards\`, \`backwards\`, \`both\` |
| \`animation-play-state\` | \`running\`, \`paused\` |

## CareerEzi UI Animations

\`\`\`css
/* Staggered card entrance */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.feature-card:nth-child(1) { animation: slideInUp 0.4s ease-out 0.1s both; }
.feature-card:nth-child(2) { animation: slideInUp 0.4s ease-out 0.2s both; }
.feature-card:nth-child(3) { animation: slideInUp 0.4s ease-out 0.3s both; }

/* Skeleton loading shimmer */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg,
    #1A1F35 25%,
    #252a45 50%,
    #1A1F35 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

/* Flame streak on leaderboard */
@keyframes flame {
  0%, 100% { transform: scale(1) rotate(-5deg); }
  50%       { transform: scale(1.2) rotate(5deg); }
}

.streak-icon { animation: flame 0.8s ease-in-out infinite; }
\`\`\`

:::insight
Use \`transform\` and \`opacity\` for animations — the browser can animate these on the **GPU** without triggering layout reflow. Animating \`width\`, \`height\`, \`margin\`, or \`top/left\` causes the browser to recalculate layout on every frame, leading to jank (dropped frames).
:::

:::challenge
Add entrance animations to the CareerEzi hero section: the heading fades in from the top, the subtext fades in from below with a 0.2s delay, and the CTA button scales in with a 0.4s delay. Use \`animation-fill-mode: both\` so elements start invisible. Add a pulsing animation to the "Live" badge.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  14: `:::scenario
"The dark and light theme toggle broke everything," you tell Karan. "I have teal hardcoded in 47 different places. Changing the brand color means updating every single one."

He pulls up the codebase. "CSS custom properties. You should have started with these on day one. One change, site-wide update."
:::

# CSS Custom Properties & Pseudo-elements

## CSS Custom Properties (Variables)

Custom properties store reusable values. Define once, use everywhere.

\`\`\`css
/* Define on :root — accessible everywhere */
:root {
  /* Colors */
  --color-bg: #0A0F1E;
  --color-bg-secondary: #1A1F35;
  --color-primary: #00D4C8;
  --color-accent: #F59E0B;
  --color-text: #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.5);

  /* Typography */
  --font-sans: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;

  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Borders */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --border: 1px solid rgba(255, 255, 255, 0.1);

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(0, 212, 200, 0.3);
}
\`\`\`

### Using Variables

\`\`\`css
/* var(--name, fallback) */
.card {
  background: var(--color-bg-secondary);
  border: var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
  font-family: var(--font-sans);
}

/* With fallback */
color: var(--color-brand, #00D4C8);
\`\`\`

### Dark / Light Theme Toggle

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #1a1a2e;
  --card: #f5f5f5;
}

[data-theme="dark"] {
  --bg: #0A0F1E;
  --text: #ffffff;
  --card: rgba(255,255,255,0.05);
}

/* Switch theme in JS */
/* document.documentElement.setAttribute('data-theme', 'dark') */
\`\`\`

### Component-Level Overrides

\`\`\`css
/* Override for a specific component */
.danger-card {
  --color-primary: #EF4444;  /* local scope */
}

.danger-card .btn {
  background: var(--color-primary);  /* uses the local red */
}
\`\`\`

### Dynamic Values with JS

\`\`\`js
// Read a CSS variable
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary').trim()

// Set a CSS variable
document.documentElement.style.setProperty('--color-primary', '#8B5CF6')
\`\`\`

## Pseudo-elements: \`::before\` and \`::after\`

Pseudo-elements insert generated content **without touching the HTML**.

\`\`\`css
/* Requires content property (even if empty) */
.badge::before {
  content: "🔥 ";  /* literal text or emoji */
}

/* Decorative underline effect */
.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.section-title:hover::after {
  transform: scaleX(1);  /* animated underline on hover */
}
\`\`\`

### Card Glow Effect with \`::before\`

\`\`\`css
.glow-card {
  position: relative;
  overflow: hidden;
}

.glow-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--color-primary), transparent 60%);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.glow-card:hover::before {
  opacity: 1;
}
\`\`\`

## Advanced Selectors

### \`:not()\`

\`\`\`css
/* All buttons EXCEPT disabled ones */
.btn:not(:disabled):hover {
  transform: translateY(-2px);
}

/* All list items except the last */
.nav-item:not(:last-child) {
  border-bottom: 1px solid var(--border);
}
\`\`\`

### \`:is()\` and \`:where()\`

\`\`\`css
/* :is() — match any selector in the list (specificity = highest selector) */
:is(h1, h2, h3, h4) {
  font-family: var(--font-serif);
  line-height: 1.2;
}

/* :where() — same but specificity = 0 (easy to override) */
:where(.card, .modal, .dropdown) {
  border-radius: var(--radius-md);
  border: var(--border);
}
\`\`\`

### Attribute Selectors

\`\`\`css
/* Exact match */
input[type="email"] { /* email inputs only */ }

/* Contains */
a[href*="careerezi"] { color: var(--color-primary); }

/* Starts with */
a[href^="https"] { /* external links */ }

/* Ends with */
a[href$=".pdf"]::after { content: " 📄"; }
\`\`\`

:::challenge
Create a CareerEzi design token system: define at least 10 CSS variables in \`:root\` covering colors, spacing, and border-radius. Build a card component using only \`var()\` references. Add an \`::after\` pseudo-element that creates an animated teal underline on card headings when hovered.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  15: `:::scenario
"We're launching in a week," Priya says. "The page needs to feel premium — deep shadows, smooth gradients, refined details. Look at Stripe's website, look at Linear.app. That level of polish."

You look at the CareerEzi design. The bones are there. Time to make it shine.
:::

# Modern CSS: Shadows, Gradients & Advanced Layout

## \`box-shadow\`

\`\`\`css
/* box-shadow: offset-x offset-y blur spread color */
.card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

/* Multiple shadows (layer them for depth) */
.elevated-card {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.2),
    0 4px 8px rgba(0,0,0,0.15),
    0 12px 24px rgba(0,0,0,0.1);
}

/* Colored glow shadow */
.teal-card {
  box-shadow: 0 0 0 1px rgba(0,212,200,0.2),
              0 0 24px rgba(0,212,200,0.15);
}

/* Inset shadow (inside the element) */
.input:focus {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

/* Remove shadow */
.flat { box-shadow: none; }
\`\`\`

## \`text-shadow\`

\`\`\`css
/* text-shadow: offset-x offset-y blur color */
.hero-title {
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Glowing text */
.glow-text {
  text-shadow: 0 0 10px rgba(0,212,200,0.8),
               0 0 20px rgba(0,212,200,0.5);
}
\`\`\`

## Advanced Gradients

\`\`\`css
/* Linear gradient with multiple stops */
.hero {
  background: linear-gradient(
    135deg,
    #0A0F1E 0%,
    #1A1F35 40%,
    #0f2040 100%
  );
}

/* Conic gradient (pie chart) */
.progress-ring {
  background: conic-gradient(
    #00D4C8 0% 75%,
    #1A1F35 75% 100%
  );
  border-radius: 50%;
}

/* Gradient border trick */
.gradient-border {
  border: 2px solid transparent;
  background:
    linear-gradient(#1A1F35, #1A1F35) padding-box,
    linear-gradient(135deg, #00D4C8, #8B5CF6) border-box;
}
\`\`\`

## CSS \`filter\`

\`\`\`css
/* Apply effects to an element */
.blurred     { filter: blur(8px); }
.dark        { filter: brightness(0.6); }
.bright      { filter: brightness(1.3); }
.grayscale   { filter: grayscale(100%); }
.sepia       { filter: sepia(80%); }
.high-con    { filter: contrast(150%); }

/* Combine multiple filters */
.featured-img {
  filter: brightness(0.85) contrast(1.1) saturate(1.2);
  transition: filter 0.3s ease;
}

.featured-img:hover {
  filter: brightness(1) contrast(1) saturate(1);
}

/* Tint overlay on images */
.team-photo {
  filter: sepia(40%) hue-rotate(160deg);
}
\`\`\`

## \`backdrop-filter\`

\`\`\`css
/* Blur what's BEHIND an element (frosted glass effect) */
.navbar {
  background: rgba(10, 15, 30, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
\`\`\`

## \`aspect-ratio\`

\`\`\`css
/* Reserve space before content loads (prevents layout shift) */
.video-wrapper { aspect-ratio: 16 / 9; }
.card-image    { aspect-ratio: 4 / 3; }
.avatar        { aspect-ratio: 1 / 1; width: 48px; }

/* Combined with object-fit for images */
.thumbnail {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
\`\`\`

## \`clamp()\` for Fluid Layouts

\`\`\`css
/* clamp(minimum, preferred, maximum) */
h1 { font-size: clamp(1.8rem, 4vw, 4rem); }
.container { padding: clamp(16px, 4vw, 80px); }
.card { width: clamp(280px, 30%, 400px); }

/* Fluid spacing scale */
:root {
  --space-sm: clamp(8px, 2vw, 16px);
  --space-md: clamp(16px, 4vw, 32px);
  --space-lg: clamp(32px, 6vw, 64px);
}
\`\`\`

## \`scroll-behavior\` and \`scroll-snap\`

\`\`\`css
/* Smooth anchor scrolling */
html { scroll-behavior: smooth; }

/* Snap scroll (carousels without JS) */
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
}

.carousel-item {
  scroll-snap-align: start;
  flex: 0 0 280px;
}
\`\`\`

## \`object-fit\` and \`object-position\`

\`\`\`css
/* object-fit: control how an image/video fills its container */
.cover   { object-fit: cover; }     /* fill, may crop */
.contain { object-fit: contain; }   /* show all, may letterbox */
.fill    { object-fit: fill; }      /* stretch to fit (distorts) */

/* object-position: where to crop from */
.portrait {
  object-fit: cover;
  object-position: top center;  /* keep face in frame */
}
\`\`\`

## Complete CareerEzi Card Component

\`\`\`css
.careerezi-card {
  /* Layout */
  position: relative;
  overflow: hidden;
  padding: var(--space-6);
  border-radius: var(--radius-lg);

  /* Glassmorphism */
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);

  /* Shadow */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

  /* Transition */
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

/* Gradient border glow on hover */
.careerezi-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(0,212,200,0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.careerezi-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 212, 200, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,212,200,0.15);
}

.careerezi-card:hover::before {
  opacity: 1;
}
\`\`\`

:::insight
The combination of \`backdrop-filter: blur()\`, semi-transparent background, and subtle border is called **glassmorphism** — a popular UI pattern. It works best on dark backgrounds with colorful content behind the glass layer.
:::

:::challenge
Build the final CareerEzi landing page bringing all 15 lessons together: semantic HTML structure, CSS custom properties for all design tokens, a responsive grid layout, a glass-morphism hero section with gradient text, animated feature cards with staggered entrance, a smooth-scrolling nav, and a responsive mobile layout. This is your portfolio piece.
:::`,

}

export default htmlCssContent
