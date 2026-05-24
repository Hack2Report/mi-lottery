# MI Lottery Analytics — Desktop App

A Windows desktop application for analyzing Michigan Daily 3 & Daily 4 lottery patterns.

> ⚠️ **Disclaimer:** Lottery draws are random. This app does NOT guarantee winnings.
> For entertainment and statistical exploration only.

---

## Features

- **Overview** — hot/cold digits, top frequency rankings, key stats
- **Frequency** — bar charts and ranked breakdown for digits 0–9
- **Position Heatmap** — which digits appear most in each digit position
- **Sum Analysis** — distribution of digit totals across all draws
- **Smart Picks** — 5 algorithms (weighted, hot, cold, balanced, random) with CSV export
- **History** — filterable draw history table with digit sum column
- **Import CSV** — load your own historical data (drop or browse)

---

## Building the .exe (Windows)

### Requirements

- **Node.js** 18+ — https://nodejs.org (LTS recommended)
- Windows 10/11 x64

### Steps

```cmd
1. Double-click build-windows.bat
   (or run in terminal:)

npm install
npm run build:win
```

The installer will be created in `dist/`:
```
dist/
  MI Lottery Analytics Setup 1.0.0.exe   ← installer
  win-unpacked/                           ← portable version
```

### Running without building

```cmd
npm install
npm start
```

---

## Importing Your Own Data

The app ships with 1,000 seeded demo draws. To use real Michigan Lottery data:

1. Go to **Import CSV** in the sidebar
2. Prepare a `.csv` file with these columns:

```
draw_date,game_type,draw_time,winning_number
2024-01-15,daily3,midday,347
2024-01-15,daily4,evening,5621
```

| Column | Accepted values |
|--------|----------------|
| `draw_date` | YYYY-MM-DD or MM/DD/YYYY |
| `game_type` | `daily3`, `daily4`, `d3`, `d4` |
| `draw_time` | `midday`, `evening`, `mid`, `eve` |
| `winning_number` | 3 or 4 digits (zero-padded automatically) |

3. Drop the file onto the import area or click to browse
4. Switch games with the **Daily 3 / Daily 4** toggle

---

## Smart Picks Algorithms

| Mode | How it works |
|------|-------------|
| **Weighted** | Picks digits proportional to their historical frequency |
| **Hot digits** | Strongly favors most-frequent digits |
| **Cold digits** | Favors least-frequent digits |
| **Balanced** | Prefers digits near the average frequency |
| **Random** | Uniform random pick — no weighting |

Picks can be exported to CSV via **↓ Export CSV** or **File → Export picks as CSV…**

---

## Project Structure

```
mi-lottery-electron/
├── src/
│   ├── main.js        Electron main process (window, menu, IPC)
│   ├── preload.js     Secure bridge to Node APIs
│   └── index.html     Full app UI (self-contained HTML/CSS/JS)
├── assets/
│   └── icon.png       App icon
├── package.json       Dependencies + electron-builder config
├── build-windows.bat  One-click Windows build script
└── README.md
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+E` | Export picks as CSV |
| `Ctrl+R` | Reload app |
| `Ctrl+0` | Reset zoom |
| `Ctrl+=` / `Ctrl+-` | Zoom in / out |
| `F11` | Toggle fullscreen |

---

## License

MIT. For entertainment purposes only.
