# Voltera Energi: Aegis LFP 90

A two-page marketing site for a fictional EV battery company, built with plain HTML, CSS, and JavaScript. There are no frameworks, no build step, and no dependencies.

- **Landing page** with a full-screen slider, product overview, certifications, testing process, call to action, and contact form.
- **Product page** with six advantages and their proof, a comparison chart, full specifications, and an FAQ.

## Project structure

```
.
├── index.html   # Markup for both pages
├── styles.css   # All styling, driven by CSS variables
├── script.js    # Slider, page routing, chart reveal, mobile menu, form validation
└── README.md
```

## Run it locally

Open `index.html` in a browser. To serve it over HTTP instead:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Pages and routing

Both pages live in `index.html` and switch without reloading, using the URL hash.

| URL            | Shows                              |
| -------------- | ---------------------------------- |
| `#/`           | Landing page                       |
| `#/testing`    | Landing page, scrolled to testing  |
| `#/contact`    | Landing page, scrolled to contact  |
| `#/product`    | Product page                       |

## Deploy with GitHub Pages

1. Push these files to a GitHub repository.
2. Open **Settings**, then **Pages**.
3. Set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, then save.
4. The site goes live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Customize

- **Colors and sizing:** edit the variables in `:root` at the top of `styles.css`. Dark mode values are in the `prefers-color-scheme` block right below.
- **Slides:** each slide is a `.slide` element in `index.html`. The slider counts them automatically, so you can add or remove slides, but add a matching `.cell` button in the `.gauge` control.
- **Slide timing:** change `7000` (milliseconds) in `script.js` and `7s` in the `.cell.on i` rule in `styles.css`.
- **Comparison chart:** each bar's length comes from its `--w` value in `index.html`.
- **Fonts:** Public Sans and Schibsted Grotesk load from Google Fonts. Remove the `<link>` tags in the `<head>` to use system fonts only.

## Before you publish

- All figures, certifications, the address, phone number, and email are **sample data**. Replace them with official information.
- The contact form **does not send anything yet**. It validates input and shows a confirmation message. Connect it to a form service or your own backend in the submit handler in `script.js`.

## Accessibility and compatibility

- Keyboard navigable, with visible focus states and labelled controls.
- The slider can be paused, and autoplay and animations stop when the device requests reduced motion.
- Follows the device's light or dark setting.
- Works in current versions of Chrome, Edge, Firefox, and Safari.
