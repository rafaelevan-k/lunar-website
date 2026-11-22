import type { SiteContent } from "./types";

// Sources: README.md on main (describes 1.1.1), GitHub release notes v1.0.5–v1.1.1,
// docs/PRIVACY.md, LICENSE. Wording follows the README so the site and the repo say the same thing.
export const en = {
  hero: {
    title: "A Dynamic Island for Windows 11",
    lead: "Lunar is a small pill at the top of your screen, with a pair of eyes that blink and glance around while you work. Click it and it opens into everything you reach for all day. Close it and it gets out of your way again.",
    facts: [
      "Free and open source",
      "Windows 11, 64-bit",
      "No administrator rights needed",
      "No account, no telemetry",
    ],
    source: "README.md intro; Install; Your privacy",
  },

  why: [
    {
      title: "It has a personality",
      body: "Instead of another toolbar, Lunar is a pair of eyes that blink, look around and smile when something good happens. It feels alive without ever getting in the way.",
      source: "README.md Why Lunar: It has a personality",
    },
    {
      title: "Invisible in screen shares",
      body: "Every Lunar window is left out of Teams, Zoom and Meet screen sharing, screenshots and recordings. You see your controls, notes and timer; your audience never does.",
      source: "README.md Why Lunar: Invisible in screen shares",
    },
    {
      title: "Focus mode that really focuses",
      body: "Start a Pomodoro session and Lunar turns on Windows Do Not Disturb for you. It turns it off while you pause, and puts everything back as it was when you finish.",
      source: "README.md Why Lunar: Focus mode",
    },
    {
      title: "A recorder in the island",
      body: "Press Record and close the island. It shows live red sound lines, the time, and Pause and Stop. Your recordings are saved as ordinary MP3 files.",
      source: "README.md Why Lunar: A recorder that lives in the island",
    },
    {
      title: "The island shows what's happening",
      body: "While music plays, the closed island shows the track's picture and sound bars that move with what you hear. While you record or focus, it turns into a recorder or a countdown.",
      source: "README.md Why Lunar: The island shows what's happening",
    },
    {
      title: "Pill or Notch",
      body: "Keep the floating pill, or switch to a Notch that sits against the top edge of the screen and opens into a wide panel with the pages as tabs.",
      source: "README.md Why Lunar: Pill or Notch",
    },
    {
      title: "Translate your screen in place",
      body: "Press Ctrl+Alt+T and Lunar reads the text on your screen and shows it in English, Indonesian or Japanese, right over the original. It reads the screen on your PC and sends only the text, with your own free Microsoft Azure key, after you allow it once.",
      source: "README.md Why Lunar: Translate your screen in place",
    },
    {
      title: "Private by design",
      body: "Your files, notes and recordings never leave your PC. There is no Lunar account and no telemetry. Logs never contain file names, note text, audio or what you listen to.",
      source: "README.md Why Lunar: Private by design",
    },
    {
      title: "Light as a feather",
      body: "Sitting idle, Lunar uses about 0.04 % CPU and about 95 MB of private memory, measured over five minutes on a typical laptop.",
      source: "README.md Why Lunar: Light as a feather",
    },
    {
      title: "Keeps itself up to date, safely",
      body: "When a new version comes out, Lunar asks: Install now or Later. It installs only a download whose fingerprint matches the official release. You can turn the check off.",
      source: "README.md Why Lunar: Keeps itself up to date",
    },
    {
      title: "Made for everyone",
      body: "Full keyboard support, screen-reader names, a High Contrast theme and reduced motion. Dark and light themes. English and Bahasa Indonesia.",
      source: "README.md Why Lunar: Made for everyone",
    },
  ],

  pages: [
    {
      id: "system",
      name: "System",
      body: "Clock, volume and mute, screen brightness, Wi-Fi and Bluetooth, and the Translate button. Everything follows changes you make elsewhere, like your keyboard's volume keys.",
      source: "README.md What's inside: System",
    },
    {
      id: "media",
      name: "Media",
      body: "What's playing in any app that supports Windows media controls, with artwork, play and pause, previous, next, seeking, and switching between apps.",
      source: "README.md What's inside: Media",
    },
    {
      id: "pomodoro",
      name: "Pomodoro",
      body: "A focus timer from 1 to 180 minutes with quick presets. Do Not Disturb while it runs, a countdown in the closed island, and a pixel-art egg that hops while you focus and cracks into a sunny-side-up egg at the end.",
      source: "README.md What's inside: Pomodoro",
    },
    {
      id: "converter",
      name: "File converter",
      body: "Convert between PNG, JPG and PDF, or turn pictures into a Word document, entirely offline. Drop in a batch, follow the queue, cancel or retry. Your originals are never touched.",
      source: "README.md What's inside: File converter",
    },
    {
      id: "notes",
      name: "Notes and Records",
      body: "Quick plain-text notes that save as you type, with Undo after a delete. And the voice recorder: pick a microphone or let Windows choose, and get MP3 files in Music\\Lunar Recordings or any folder you like.",
      source: "README.md What's inside: Notes & Records",
    },
    {
      id: "usage",
      name: "Usage",
      body: "Your Claude 5-hour and weekly limits at a glance, with a small notice when a limit resets. Off until you turn it on.",
      source: "README.md What's inside: Usage",
    },
  ],

  whatsNew: {
    version: "1.1.1",
    items: [
      {
        title: "Music in the island",
        body: "The track's picture and live sound bars in the closed island while music or video plays.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "Island style",
        body: "The floating Pill, or a Notch at the top edge that opens into a wide panel with tabs.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "Screen translation",
        body: "Read the active screen and see it in English, Indonesian or Japanese, over the original text. Ctrl+Alt+T; needs your own free Azure Translator key.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "A softer look for Settings",
        body: "A calmer palette for the Settings window and a tidier System page header.",
        source: "README.md New in 1.1.1; release notes v1.1.1 Also",
      },
    ],
  },

  privacy: {
    summary:
      "Everything runs on your PC. Files, notes and recordings are never uploaded. There is no account and no telemetry. The local log records what happened, never what you were doing.",
    waysTitle: "Lunar contacts the internet in only three ways",
    ways: [
      {
        title: "The daily update check",
        body: "Once a day Lunar asks GitHub whether a newer version is out. GitHub sees that someone asked. You can turn it off in Settings → Updates.",
        source: "README.md Your privacy; PRIVACY.md Update check",
      },
      {
        title: "The Usage page",
        body: "Optional, and only after you switch it on.",
        source: "README.md Your privacy; PRIVACY.md Summary",
      },
      {
        title: "Screen translation",
        body: "Only when you ask for a translation. It sends the recognised text, never a picture of your screen, to Microsoft Azure AI Translator with your own key, and only after you allowed it once. Nothing is kept.",
        source: "README.md Your privacy; PRIVACY.md Screen translation",
      },
    ],
    never:
      "Never logged: file names and paths, document contents, note text, recorded audio, Wi-Fi network names, Bluetooth device names, or what you listen to.",
    recordings:
      "Lunar opens your microphone only when you press Record, and Windows shows its own microphone indicator. Please tell people before you record them.",
    thisSite:
      "This website uses no cookies, no analytics and no third-party scripts. It loads nothing from anywhere but itself.",
    source: "README.md Your privacy; PRIVACY.md Summary, What is never logged, Recordings",
  },

  install: {
    steps: [
      "Download Lunar.msi from the latest release.",
      "Run it. It installs for your Windows account only and needs no administrator rights. A short progress bar appears and closes by itself when it's done.",
      "Open Lunar from the Start menu. The eyes appear at the top of your screen.",
    ],
    smartScreen:
      "The installer isn't code-signed yet, so Windows SmartScreen may say “Windows protected your PC”. Choose More info, then Run anyway.",
    verify:
      "To check your download, compare the result of this command with the Lunar.msi.sha256 file on the release page:",
    verifyCommand: "Get-FileHash .\\Lunar.msi",
    updating:
      "Lunar offers new versions itself. From version 1.0.5 or older, install the new Lunar.msi by hand once. Your settings, notes and recordings are always kept.",
    removing:
      "Windows Settings → Apps → Lunar. Lunar asks whether to delete its settings and notes too. Your recordings stay in your own folder.",
    requirements:
      "Windows 11, 64-bit. Nothing else to install, because the .NET runtime is included.",
    source: "README.md Install",
  },

  limits: [
    {
      title: "Windows 11 only",
      body: "Lunar runs on Windows 11, 64-bit. Windows 10 is not supported.",
      source: "README.md Good to know; release notes v1.0.6 Requirements",
    },
    {
      title: "Word to PDF isn't there yet",
      body: "Word documents can be made from pictures, but Word files can't be converted to PDF yet.",
      source: "README.md Good to know",
    },
    {
      title: "Some switches depend on Windows",
      body: "Wi-Fi and Bluetooth switches, seeking and external-monitor brightness depend on Windows, your drivers, the media app and the monitor. Where something isn't allowed, Lunar says so and opens the right Windows setting.",
      source: "README.md Good to know",
    },
    {
      title: "Do Not Disturb uses an undocumented feature",
      body: "Lunar turns on Do Not Disturb through a Windows feature Microsoft doesn't document. If Windows says no, the timer still runs and tells you.",
      source: "README.md Good to know",
    },
    {
      title: "You can't screenshot Lunar either",
      body: "Being invisible to screen capture means your own screenshots leave Lunar out too.",
      source: "README.md Good to know",
    },
    {
      title: "Translation needs your own key",
      body: "Screen translation needs your own Azure Translator key (Microsoft's free tier) and an internet connection. Japanese needs Windows' Japanese language for reading. It is machine translation and can be wrong.",
      source: "README.md Good to know",
    },
    {
      title: "The Usage page may stop working",
      body: "It uses an Anthropic address that isn't officially documented. Lunar is not affiliated with Anthropic.",
      source: "README.md Good to know",
    },
    {
      title: "Tested with one monitor",
      body: "Lunar has been tested on Windows 11 with a single monitor.",
      source: "README.md Good to know",
    },
  ],

  openSource: {
    body: "Lunar is free and open source under the Apache License 2.0. The code, the issues and every release are on GitHub.",
    stack: "Written in C# on .NET 10 with WPF. The installer is a per-user MSI.",
    source: "README.md License; For developers",
  },

  faq: [
    {
      question: "Is Lunar free?",
      answer:
        "Yes. Lunar is free and open source under the Apache License 2.0. There is no account and nothing to buy.",
      source: "README.md License; Your privacy",
    },
    {
      question: "Why does Windows warn me when I install it?",
      answer:
        "The installer isn't code-signed yet, so SmartScreen may show “Windows protected your PC”. Choose More info, then Run anyway. You can check your download against the SHA-256 file on the release page first.",
      source: "README.md Install",
    },
    {
      question: "Does it work on Windows 10?",
      answer: "No. Lunar needs Windows 11, 64-bit.",
      source: "README.md Good to know; release notes v1.0.6 Requirements",
    },
    {
      question: "Why can't I take a screenshot of Lunar?",
      answer:
        "On purpose. Every Lunar window is left out of screen capture, so it stays out of your screen shares and recordings. Your own screenshots leave it out too.",
      source: "README.md Why Lunar; Good to know",
    },
    {
      question: "Does Lunar send my data anywhere?",
      answer:
        "Your files, notes and recordings never leave your PC. Lunar only contacts the internet for the daily update check (which you can turn off), the optional Usage page, and screen translation when you ask for it.",
      source: "README.md Your privacy",
    },
    {
      question: "Does screen translation cost money?",
      answer:
        "Lunar uses your own Microsoft Azure Translator key, which you can get on Microsoft's free tier. The free monthly allowance is set by Microsoft, not by Lunar.",
      source: "README.md Good to know; release notes v1.1.1 Known limits",
    },
    {
      question: "How do I update or remove Lunar?",
      answer:
        "Lunar offers new versions itself and keeps your settings, notes and recordings. To remove it, go to Windows Settings → Apps → Lunar; your recordings stay in your own folder.",
      source: "README.md Install",
    },
    {
      question: "Is Lunar made by Apple or Anthropic?",
      answer:
        "No. “Dynamic Island” describes the idea of a small pill that opens into controls. Lunar is an independent project and is not affiliated with Apple or Anthropic.",
      source: "README.md Good to know (Anthropic); site policy (Apple)",
    },
  ],

  changelog: [
    {
      version: "1.1.1",
      date: "2026-11-18",
      items: [
        "Music in the island: the track's picture and sound bars that move with what you hear.",
        "Island style: Pill, or a Notch against the top edge that opens into a wide panel with tabs.",
        "Screen translation into English, Indonesian or Japanese with Ctrl+Alt+T, using your own free Azure key.",
        "A softer palette for the Settings window and a tidier System page header.",
      ],
      source: "release notes v1.1.1",
    },
    {
      version: "1.0.7",
      date: "2026-11-12",
      items: [
        "The voice recorder works with more microphones, such as some laptop microphone arrays.",
        "A clearer message, with a button to the microphone settings, when Windows refuses a microphone.",
      ],
      source: "release notes v1.0.7",
    },
    {
      version: "1.0.6",
      date: "2026-11-11",
      items: [
        "Pomodoro: a focus timer from 1 to 180 minutes that turns on Do Not Disturb, with a pixel-art egg.",
        "Voice recorder on the Notes page, with MP3 files and live sound lines in the closed island.",
        "Daily update check that offers Install now or Later and checks the download's SHA-256.",
        "Fixes for the eyes, the Media artwork and button outlines.",
      ],
      source: "release notes v1.0.6",
    },
    {
      version: "1.0.5",
      date: "2026-11-07",
      items: [
        "Screen brightness on the System page.",
        "Notes: plain-text notes saved as you type, with Undo after a delete.",
        "Hidden from screen sharing, screenshots and recordings.",
      ],
      source: "release notes v1.0.5",
    },
  ],
} satisfies SiteContent;
