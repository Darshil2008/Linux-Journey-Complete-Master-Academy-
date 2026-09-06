# 🐧 Linux Journey: Complete Master Academy & Study Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![PDF](https://img.shields.io/badge/PDF-12%20Pages%20Zero--Void-red.svg)](Linux_Simple_Summary_Flashcards.pdf)
[![Curriculum](https://img.shields.io/badge/Curriculum-8%20Modules%20%7C%2091%20Lessons-success.svg)](https://labex.io/linuxjourney)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen.svg)](#-deploying-to-github-pages-free-hosting)

> **The definitive, beginner-to-advanced Linux mastery kit engineered for learners of all ages.**  
> Guided by **Penguin Pete**, this repository combines a **37-slide Canva-style presentation**, an interactive **91-lesson course reader with 414 quizzes**, **47 3D flip flashcards**, a **20-question mastery quiz** with synthesized audio chimes, and an executive **12-page space-optimized printable PDF**.

---

## 📑 Table of Contents

- [🌟 Features](#-features)
- [🧭 The 8-Module Core Curriculum](#-the-8-module-core-curriculum)
- [🖥️ Interactive Web Academy Overview](#️-interactive-web-academy-overview)
- [📄 12-Page Space-Optimized Master PDF](#-12-page-space-optimized-master-pdf)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🌐 Deploying to GitHub Pages (Free Hosting)](#-deploying-to-github-pages-free-hosting)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [📁 Repository Structure](#-repository-structure)
- [🛠️ Regenerating the PDF](#️-regenerating-the-pdf)
- [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Features

- **🖥️ 37 Canva-Style Presentation Slides**: Rich visual slides loaded with Penguin Pete's kid-friendly metaphors, command recipes, and ASCII system architecture diagrams.
- **📖 91-Lesson Full Course Reader**: Every single lesson from all 8 foundational Linux Journey modules, organized into clean, bite-sized **Concept Cards** with live interactive checkpoints.
- **🎴 47 Interactive 3D Flip Flashcards**: Active recall study cards with flip animations, self-scoring counters (*Mastered* vs *Needs Practice*), category filters, and a shuffle button.
- **🎮 20-Question Master Quiz**: Real-time multiple-choice certification exam with instant feedback, scoring badge, and audio effects.
- **📊 Architectural Reference Matrix**: Comprehensive tables comparing distribution families (Debian, Red Hat, Arch, SUSE), package managers, release models, and exit codes.
- **⚡ 60-Second Exam Blitz**: Pete's 5 Golden Linux Safety Rules and high-yield interview cheat sheets.
- **📄 12-Page Space-Optimized Master PDF**: Printable PDF engineered with **~98% vertical canvas utilization** and zero empty bottom gaps. Features an authentic vector Tux mascot badge.
- **🔊 Pure Web Audio API Sound Effects**: Zero external `.mp3` or `.wav` dependencies! All audio feedback (clicks, card flips, correct/wrong chimes) is synthesized on-the-fly using browser oscillators.
- **📱 Fully Responsive Design**: Built with clean CSS custom properties, smooth typography (Plus Jakarta Sans & JetBrains Mono), and a non-wrapping sticky navbar.

---

## 🧭 The 8-Module Core Curriculum

| # | Module Name | Lessons | Quizzes | Core Topics Covered |
|---|:---|:---:|:---:|:---|
| **1** | **Getting Started** | 11 | 47 | UNIX (1969), GNU (1983), Linux (1991), 3 System Layers, FHS Directory Map, Distro Families (Debian, Ubuntu, Fedora, RHEL, Arch, Mint, openSUSE, Gentoo), Cybersecurity distros (Kali, Parrot), GPL copyleft licensing. |
| **2** | **Command Line** | 19 | 83 | Shell architecture, absolute vs relative paths, `pwd`, `cd`, `ls -la`, `touch`, `file` magic bytes, `cat`, `less`, `head`, `tail`, `cp -r`, `mv`, `rm -rf`, hard vs soft symlinks, terminal navigation hotkeys (`Ctrl-C`, `Ctrl-L`, `Ctrl-A`, `Ctrl-E`). |
| **3** | **Text-Fu** | 16 | 73 | Standard I/O streams (`stdin` 0, `stdout` 1, `stderr` 2), overwrite (`>`) vs append (`>>`), pipes (`|`), `tee` teeing, shell environment variables, `cut`, `paste`, `sort -n`, `uniq -c`, `wc`, `grep -i -v -E`, `sed` stream substitution, `awk` columnar parsing. |
| **4** | **Advanced Text-Fu** | 15 | 68 | Modal text editing, Vim 3 primary modes (Normal, Insert, Command), navigation (`h,j,k,l`, `w`, `b`, `0`, `$`), search & replace (`:%s/old/new/g`), saving (`:wq`), nano, emacs, Regular Expressions (`^`, `$`, `.`, `*`, `+`, `?`, `[0-9]`, `\b`). |
| **5** | **User Management** | 6 | 28 | Multi-user concepts, UID/GID allocation (UID 0 = root), `/etc/passwd` (7 standard colon fields), `/etc/shadow` encrypted hashes, `/etc/group`, `useradd`, `usermod`, `passwd`, switching users (`su -`), `sudo`, and safe `/etc/sudoers` editing via `visudo`. |
| **6** | **Permissions** | 8 | 36 | Linux permission model (`rwx`), symbolic representation (`-rwxr-xr-x`), Octal Math (`r=4, w=2, x=1`), `chmod 755/644`, `chown`, default creation masks (`umask`), Special Permissions: SUID (4000), SGID (2000), and Sticky Bit (1000) on `/tmp`. |
| **7** | **Processes** | 11 | 51 | Process life cycle, PIDs, parent processes (PPID), `ps aux`, `top`, `/proc` virtual filesystem, process states (R, S, D, Z, T), POSIX signals (`kill -15 SIGTERM` vs `kill -9 SIGKILL`), process priority / niceness (`nice` & `renice` -20 to +19), background job control (`&`, `Ctrl-Z`, `jobs`, `bg`, `fg`). |
| **8** | **Packages** | 5 | 28 | Package management ecosystems, low-level packaging (`.deb` / `dpkg` vs `.rpm` / `rpm`), high-level repository resolvers (`apt` vs `dnf`/`yum`), repository mirrors, 3-step source compilation (`./configure`, `make`, `sudo make install`), `tar` compression (`-czvf` / `-xzvf`). |
| **Total** | **All 8 Modules** | **91** | **414** | **100% Comprehensive Linux Foundation** |

---

## 🖥️ Interactive Web Academy Overview

The web academy (`index.html`) is structured into 6 seamlessly switchable tabs:

1. **🖥️ Slides Deck (37 Canva Slides)**  
   - Interactive slide viewer featuring colorful presentation cards, Penguin Pete's wisdom callouts, and keyboard-driven controls.
2. **📖 Course Reader (91 Lessons)**  
   - Browse the full curriculum with a collapsible module accordion and live search filter. Every lesson is reformatted into readable concept cards with interactive quizzes.
3. **🎴 Flashcards (47 Cards)**  
   - 3D perspective flip cards with self-scoring counters (*Mastered* / *Needs Practice*) and module filters.
4. **🎮 Master Quiz (20 Questions)**  
   - Comprehensive test covering all 8 modules. Answers provide detailed explanations and instant score updates.
5. **📊 Reference Tables**  
   - Deep-dive matrices for Linux distribution families, package formats, and exit codes.
6. **⚡ 60s Blitz & Pete's Safety Rules**  
   - Fast-action memorization sheet and Pete's 5 Golden Safety Rules for the terminal.

---

## 📄 12-Page Space-Optimized Master PDF

The included PDF ([`Linux_Simple_Summary_Flashcards.pdf`](Linux_Simple_Summary_Flashcards.pdf)) is a high-density, printable study guide built from scratch using pure Python.

### Highlights:
- **Zero Blank Spaces**: Every page fills continuously from `y = 808 pt` down to `y = 36–46 pt` (right above the 24 pt footer bar).
- **~98% Canvas Utilization**: No empty gaps or orphaned headings.
- **Authentic Vector Logo**: Page 1 features a custom-rendered vector Tux mascot inside a royal blue emblem badge.
- **30 High-Yield Flashcards**: Pages 10 and 11 provide a complete 30-question certification drill.
- **Cheatsheet & Matrix**: Page 12 includes Pete's Golden Safety Rules, standard exit codes, and the 8-module summary table.

---

## 🚀 Quick Start & Installation

### Option 1: Direct in Browser (No installation needed)
Simply clone the repository and open `index.html` in any modern browser:
```bash
git clone https://github.com/YOUR_USERNAME/linux-journey-master.git
cd linux-journey-master
open index.html        # On macOS
# or
xdg-open index.html    # On Linux
# or
start index.html       # On Windows
```

### Option 2: Run via Python Local Server
```bash
cd linux-journey-master
python3 -m http.server 8080
```
Then visit: `http://localhost:8080`

### Option 3: Run via Node.js
```bash
npx serve .
```

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

You can host your own live web academy for free on GitHub Pages in under 2 minutes:

1. **Create a New Repository on GitHub**:
   - Go to [GitHub -> New Repository](https://github.com/new).
   - Name it `linux-journey-master` (or any name you prefer).
   - Leave it public or private.

2. **Push this code to your new repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit of Linux Master Academy and 12-page PDF"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/linux-journey-master.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub -> **Settings** -> **Pages** (in the left sidebar).
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
   - Your live interactive web academy will be published at:  
     `https://YOUR_USERNAME.github.io/linux-journey-master/`

---

## ⌨️ Keyboard Shortcuts

When using the **Slides Deck** tab:

| Key | Action |
|:---:|:---|
| `▶` or `Space` or `PageDown` | Advance to next slide |
| `◀` or `PageUp` | Return to previous slide |
| `F` | Toggle Fullscreen mode |
| `Esc` | Exit Fullscreen |

---

## 📁 Repository Structure

```text
linux-journey-master/
│
├── index.html                           # Main Interactive Canva-style Web Academy
├── styles.css                           # Modern responsive design system (Indigo/Slate)
├── app.js                              # Presentation controller, quiz engine & Web Audio synthesizer
│
├── Linux_Simple_Summary_Flashcards.pdf  # 12-Page high-density space-optimized master PDF
├── generate_pdf.py                     # Standalone Python PDF generator (zero pip dependencies)
│
├── linux_course_data.js                # Curriculum dataset in JS format for browser loading
├── linux_course_all_data.json          # Complete JSON dataset (8 modules, 91 lessons, 414 quizzes)
│
├── README.md                           # Repository documentation and guide
├── .gitignore                          # Clean repository ignore file
└── Archive.zip                         # Ready-to-download offline bundle
```

---

## 🛠️ Regenerating the PDF

You can regenerate or customize the 12-page PDF anytime using standard Python 3 (no external packages or pip installations required):

```bash
python3 generate_pdf.py
```
This will compile `Linux_Simple_Summary_Flashcards.pdf` in seconds with vector graphics and ~98% canvas density.

---

## 🤝 Contributing & License

Contributions, suggestions, and corrections are welcome! Feel free to open an Issue or submit a Pull Request.

- **License**: Released under the [MIT License](LICENSE).
- **Curriculum Reference**: Based on the open curriculum from [Linux Journey](https://labex.io/linuxjourney) on LabEx.
- **Mascot**: Tux created by Larry Ewing using GIMP.

---

<div align="center">
  <sub>Built with ❤️ for Linux students, DevOps engineers, and system administrators worldwide.</sub><br/>
  <sub>🐧 Penguin Pete wishes you happy terminal hacking!</sub>
</div>
