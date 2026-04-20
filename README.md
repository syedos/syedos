# syedOS

Personal site and open source identity for **syedOS** — roboticist, builder, cofounder of [Meter](https://meter.chat).

**Live:** [syedos.com](https://syedos.com)

## About

The site is styled as a desktop environment. It boots up, presents draggable windows on a dot-grid wallpaper, and shuts down. Each window is a different facet — bio, thesis, links, a working terminal, a music player, and a live GitHub activity widget.

### Windows

| Window | Content |
|--------|---------|
| **identity** | Roboticist and open source architect building the universal protocol for the constitution of robots |
| **role** | Cofounder [@meter_chat](https://x.com/meter_chat) — pay-per-thought AI |
| **thesis** | "Intelligence is a utility. It should be metered like electricity, not sold like software." |
| **background** | Builder philosophy and context |
| **links** | Meter + personal — sites, X, GitHub |
| **terminal** | Interactive commands — `hack the mainframe`, `sudo rm -rf /`, `self-destruct`, `run mcafee antivirus` |
| **music** | 80s greatest hits — Tears for Fears, Bananarama, Don Henley, Simple Minds |
| **github** | Live contribution calendar, streak, and commit stats |

### Easter Eggs

- **Virus mode** — run `mcafee antivirus` in the terminal. Windows multiply, refuse to close, text scrambles, music glitches.
- **Self-destruct** — shakes the screen, then tells you it was kidding.
- **Contact** — click the logo in the taskbar to compose a message.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion

## Dev

```sh
git clone https://github.com/syedos/syedos.git
cd syedos
npm i
npm run dev
```

Runs at `localhost:8080`.
