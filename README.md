# syedOS

A desktop-environment personal site. Boots up like an operating system, presents everything as draggable windows on a dot-grid wallpaper.

**Live:** [syedos.com](https://syedos.com)

## What's Inside

The site simulates a full OS lifecycle — boot sequence, desktop session, shutdown, and sleep screen (click to wake).

### Windows

| Window | What it does |
|--------|-------------|
| **identity** | Bio — roboticist and open source architect |
| **role** | Cofounder [@meter_chat](https://x.com/meter_chat) — pay-per-thought AI |
| **thesis** | "Intelligence is a utility. It should be metered like electricity, not sold like software." |
| **background** | Builder context and philosophy |
| **links** | Meter and personal links (sites, X, GitHub) |
| **terminal** | Interactive terminal with joke commands — `hack the mainframe`, `sudo rm -rf /`, `self-destruct`, `run mcafee antivirus` |
| **music** | Built-in music player — 80s greatest hits (Tears for Fears, Bananarama, Don Henley, Simple Minds) |
| **github** | Live GitHub contribution calendar, streak counter, and commit stats |

### Easter Eggs

- **Virus mode**: Run `mcafee antivirus` in the terminal. Windows start multiplying, refusing to close, and opening random ones instead. Text scrambles across the entire UI. Music playback glitches.
- **Self-destruct**: Shakes the whole screen, then tells you it was kidding.
- **Contact form**: Click the syedOS logo in the taskbar to compose a message (Web3Forms).

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **GitHub data:** react-github-calendar + GitHub Contributions API
- **Contact:** Web3Forms
- **Music:** HTML5 Audio with custom player UI

## Development

```sh
git clone https://github.com/syedos/syedos.git
cd syedos
npm i
npm run dev
```

Runs at `http://localhost:8080`.

## Build

```sh
npm run build
npm run preview
```

## Structure

```
src/
├── components/
│   ├── BootSequence.tsx      # OS boot/shutdown animation
│   ├── Desktop.tsx           # Main desktop with icons, windows, wallpaper
│   ├── DraggableWindow.tsx   # Window chrome with drag, minimize, close
│   ├── Terminal.tsx           # Interactive terminal with typewriter output
│   ├── MusicPlayer.tsx       # Audio player with track list
│   ├── GitHubWidget.tsx      # Live GitHub stats + contribution calendar
│   ├── ContactWindow.tsx     # Email compose form
│   ├── SleepScreen.tsx       # Sleep/wake screen
│   ├── ScrambleText.tsx      # Text scramble effect (virus mode)
│   ├── Taskbar.tsx           # Bottom taskbar with window pills + now playing
│   └── DesktopIcon.tsx       # Desktop shortcut icons
├── hooks/
│   ├── useWindowManager.ts   # Window state (open, close, minimize, z-index, position)
│   ├── useMusicPlayer.ts     # Audio playback state + virus glitch behavior
│   └── useTextScramble.ts    # Character scramble animation
└── pages/
    └── Index.tsx             # Phase state machine (boot → desktop → shutdown → sleep)
```
