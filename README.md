# DeStack

A lightweight Chrome extension that removes the default Substack home feed and helps interrupt the dopamine-loop of infinite scrolling.

## Why this is needed

When Substack first started, it was one of the last bastions where humans could thoughtfully connect with each other without the dopamine-hacking tricks of infinite scroll and short-form content. People who were aware of the danger on other platforms felt relief after closing down their social media accounts, having found a place where true intellectual conversations were being had — something that operated like pen pals.

You got email essays from people you subscribed to, and that was it. No algorithmic feed screaming for your attention. No endless race to consume more. Just thoughtful writing and meaningful exchange.

But as time went on and Substack gained popularity, the operators of the company grew greedy. They introduced video, notes, infinite scroll, messages, and a large set of engagement features that pushed the platform away from its original purpose. The result is something that increasingly resembles what many of us ran away from: a design built to capture attention, keep eyes glued to the screen, and turn conversation into a slot machine.

This project is a small act of resistance.

It aims to restore some of the original calm, intentional, low-noise experience that made Substack valuable in the first place by hiding the home feed that fuels endless scrolling and distraction.

## What it does

- blocks the default Substack home feed at `/` and `/home`
- hides feed containers that trigger infinite-scroll behavior
- leaves the rest of the site untouched

## Install it in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder.

## Project structure

- `manifest.json` — extension manifest
- `content.js` — home-page detection and feed-blocking logic
- `styles.css` — CSS that hides the home feed

## Philosophy

This project is not anti-Substack. It is pro-attention, pro-thought, and pro-human connection.

The goal is not to eliminate all features, but to reclaim a small amount of peace from the platform's most addictive patterns.

## License

This project is licensed under the MIT License.
