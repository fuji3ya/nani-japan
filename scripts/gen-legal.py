"""Generate the Nani?! Japanese legal/support static site (Cloudflare Pages)."""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "legal"
OUT.mkdir(exist_ok=True)

CSS = (
    ":root{--coral:#FF4D6D;--ink:#15130F;--paper:#FFFDF7;--muted:#8a8475;--line:#e7e3d6;}"
    "*{box-sizing:border-box;}"
    "body{font-family:-apple-system,'SF Pro Text',Inter,'Hiragino Kaku Gothic ProN',sans-serif;"
    "color:var(--ink);background:var(--paper);max-width:720px;margin:0 auto;padding:36px 24px 80px;line-height:1.65;}"
    "h1{font-size:30px;font-weight:900;letter-spacing:-0.5px;margin:0 0 6px;}h1 b{color:var(--coral);}"
    ".updated{color:var(--muted);font-size:14px;font-weight:700;margin:0 0 28px;}"
    "h2{font-size:18px;font-weight:800;margin:30px 0 8px;padding-bottom:5px;border-bottom:2px solid var(--line);}"
    "p,li{font-size:15px;}ul{padding-left:22px;}"
    ".callout{background:#FFF1F4;border-left:4px solid var(--coral);padding:14px 16px;border-radius:10px;margin:16px 0;}"
    ".callout p{margin:0;font-weight:700;}a{color:var(--coral);font-weight:700;}"
    "nav{margin:0 0 24px;font-size:14px;font-weight:800;}nav a{margin-right:14px;}"
    "footer{margin-top:48px;padding-top:22px;border-top:1px solid var(--line);color:var(--muted);font-size:13px;}"
)

NAV = '<nav><a href="/">Nani?!</a><a href="/privacy">Privacy</a><a href="/support">Support</a><a href="/terms">Terms</a></nav>'
FOOT = ('<footer>Nani?! Japanese — Weird Japanese, the words they don\'t teach you.<br>'
        '© 2026 starving-effort. Contact: <a href="mailto:support@starving-effort.com">support@starving-effort.com</a></footer>')


def page(title, body):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title>'
            f'<style>{CSS}</style></head><body>{NAV}{body}{FOOT}</body></html>')


UP = "Last updated: 2026-06-09"

privacy = page("Nani?! Japanese — Privacy Policy", f"""
<h1>Nani<b>?!</b> Japanese — Privacy Policy</h1>
<p class="updated">{UP}</p>
<div class="callout"><p>Short version: we collect nothing. No accounts, no servers, no tracking, no ads. Everything stays on your phone.</p></div>
<h2>1. What we collect</h2>
<p><strong>Nothing.</strong> Nani?! Japanese has no servers and makes no network requests. We do not collect, store, or transmit any personal information.</p>
<h2>2. Where your data lives</h2>
<p>Your learning progress &mdash; which words you've learned, your streak, mastered words, and your settings (daily goal, chosen pack) &mdash; is saved <strong>only in your device's local storage</strong> (Apple's on-device storage). It never leaves your phone and we never see it.</p>
<h2>3. What we do NOT collect</h2>
<ul>
<li>No name, email, phone number, or account.</li>
<li>No location, contacts, photos, microphone, or camera access.</li>
<li>No usage analytics, advertising identifiers, or tracking of any kind.</li>
<li>No third-party SDKs that collect data. The word content is bundled inside the app itself.</li>
</ul>
<h2>4. Third parties</h2>
<p>None. The app does not connect to any external service. If we add optional in-app purchases in the future, they are handled entirely by Apple's App Store &mdash; we never see your name or payment details.</p>
<h2>5. Children</h2>
<p>The app is suitable for a general audience and collects no data from anyone, including children.</p>
<h2>6. Your control</h2>
<p>Because everything is stored locally, deleting the app removes all stored data from your device.</p>
<h2>7. Changes</h2>
<p>If this policy ever changes, we'll update this page and the date above.</p>
<h2>8. Contact</h2>
<p>Questions? Email <a href="mailto:support@starving-effort.com">support@starving-effort.com</a>.</p>
""")

support = page("Nani?! Japanese — Support", f"""
<h1>Nani<b>?!</b> Japanese — Support</h1>
<p class="updated">{UP}</p>
<div class="callout"><p>Need help or have feedback? Email <a href="mailto:support@starving-effort.com">support@starving-effort.com</a> &mdash; we read every message.</p></div>
<h2>What is Nani?! Japanese?</h2>
<p>A fun way to learn the Japanese textbooks won't teach you &mdash; gyaru slang, Kansai dialect, Edo speech, net slang, classical Heian, Okinawan, and the latest youth words. Each word comes with its reading, a real example, who actually says it, and how cringe it'd be to use today.</p>
<h2>Frequently asked</h2>
<ul>
<li><strong>Where is my progress saved?</strong> Entirely on your device. We have no servers and no account system.</li>
<li><strong>Will I lose progress if I delete the app?</strong> Local data is removed when you delete the app. iOS may restore it via your iCloud device backup when you reinstall or switch phones.</li>
<li><strong>Does it work offline?</strong> Yes &mdash; everything works without an internet connection.</li>
<li><strong>How do daily new words work?</strong> Free users learn a set number of new words per day and can review everything they've already learned. Pro removes the limit and unlocks all packs.</li>
<li><strong>How do I review a word again?</strong> Open Collection, pick a pack, and tap any word you've collected to see its meaning and example.</li>
</ul>
<h2>Contact</h2>
<p>Email <a href="mailto:support@starving-effort.com">support@starving-effort.com</a>. We aim to reply within a few days.</p>
""")

terms = page("Nani?! Japanese — Terms of Use", f"""
<h1>Nani<b>?!</b> Japanese — Terms of Use</h1>
<p class="updated">{UP}</p>
<h2>1. Acceptance</h2>
<p>By downloading or using Nani?! Japanese ("the App"), you agree to these Terms. If you do not agree, please do not use the App.</p>
<h2>2. The App</h2>
<p>The App is provided for personal, non-commercial language-learning entertainment. Content is provided "as is" for educational and entertainment purposes; slang meanings and usage notes are best-effort and may evolve over time.</p>
<h2>3. Purchases</h2>
<p>The App may offer an optional Pro subscription or purchase through Apple's App Store. All purchases are processed and managed by Apple. Subscriptions, where offered, auto-renew until cancelled; manage or cancel anytime in your Apple ID settings. Apple's standard <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">EULA</a> applies to licensed content.</p>
<h2>4. Acceptable use</h2>
<p>Don't attempt to reverse-engineer, resell, or redistribute the App or its content except as permitted by law.</p>
<h2>5. Disclaimer</h2>
<p>The App is provided without warranties of any kind. We are not liable for any damages arising from use of the App to the maximum extent permitted by law.</p>
<h2>6. Changes</h2>
<p>We may update these Terms; continued use after changes means you accept them.</p>
<h2>7. Contact</h2>
<p>Email <a href="mailto:support@starving-effort.com">support@starving-effort.com</a>.</p>
""")

index = page("Nani?! Japanese", f"""
<h1>Nani<b>?!</b> Japanese</h1>
<p class="updated">Weird Japanese &mdash; the words they don't teach you.</p>
<p>Gyaru, Kansai, Edo, net slang, classical Heian, Okinawan &amp; the latest youth words &mdash; with readings, real examples, who-says-it and a cringe rating. Learn the Japanese that makes you sound like a real (weird) human.</p>
<p style="margin-top:24px"><a href="/privacy">Privacy Policy</a> &middot; <a href="/support">Support</a> &middot; <a href="/terms">Terms of Use</a></p>
""")

REDIRECTS = "/privacy.html /privacy 301\n/support.html /support 301\n/terms.html /terms 301\n/index.html / 301\n"
HEADERS = (
    "/*\n"
    "  X-Content-Type-Options: nosniff\n"
    "  X-Frame-Options: DENY\n"
    "  Referrer-Policy: strict-origin-when-cross-origin\n"
    "  Permissions-Policy: camera=(), microphone=(), geolocation=()\n"
    "  Strict-Transport-Security: max-age=31536000; includeSubDomains\n"
    "  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'\n"
)

for name, content in [("privacy.html", privacy), ("support.html", support), ("terms.html", terms),
                      ("index.html", index), ("_redirects", REDIRECTS), ("_headers", HEADERS)]:
    (OUT / name).write_text(content, encoding="utf-8")
print("wrote legal site:", sorted(p.name for p in OUT.iterdir()))
