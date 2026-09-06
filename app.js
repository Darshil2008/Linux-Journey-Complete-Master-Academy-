// Linux Journey: Complete Master Interactive Academy & Presentation Suite
document.addEventListener('DOMContentLoaded', () => {
  // Web Audio Synthesis for Interactive Chimes & Clicks
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'flip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  }

  // =========================================================
  // VIEW NAVIGATION TABS
  // =========================================================
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('click');
      const targetId = tab.getAttribute('data-tab');

      navTabs.forEach(t => t.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      tab.classList.add('active');
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });

  // =========================================================
  // COURSE READER (ALL 8 MODULES & 91 LESSONS)
  // =========================================================
  const coursesData = window.LINUX_COURSE_DATA || [];
  let flatLessons = [];
  let currentCourseIdx = 0;
  let currentLessonIdx = 0;

  // Flatten lessons for linear previous/next navigation
  coursesData.forEach((course, cIdx) => {
    course.lessons.forEach((lesson, lIdx) => {
      flatLessons.push({
        cIdx,
        lIdx,
        courseName: course.course_name,
        courseIcon: course.icon,
        ...lesson
      });
    });
  });

  const sidebarModulesList = document.getElementById('sidebarModulesList');
  const readerStage = document.getElementById('readerStage');
  const searchInput = document.getElementById('sidebarSearchInput');

  function renderSidebar(filterText = '') {
    if (!sidebarModulesList) return;
    sidebarModulesList.innerHTML = '';

    coursesData.forEach((course, cIdx) => {
      const filteredLessons = course.lessons.filter(l => {
        if (!filterText) return true;
        const q = filterText.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      });

      if (filterText && filteredLessons.length === 0) return;

      const group = document.createElement('div');
      group.className = `module-group ${cIdx === currentCourseIdx || filterText ? 'open' : ''}`;
      
      group.innerHTML = `
        <button class="module-header-btn" data-cidx="${cIdx}">
          <span>${course.icon} ${course.course_name}</span>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${filteredLessons.length}</span>
        </button>
        <div class="module-lesson-list">
          ${filteredLessons.map(l => {
            const isActive = (cIdx === currentCourseIdx && l.lesson_id === coursesData[currentCourseIdx].lessons[currentLessonIdx]?.lesson_id);
            return `
              <button class="lesson-item-btn ${isActive ? 'active' : ''}" data-lesson-id="${l.lesson_id}" data-cidx="${cIdx}">
                <span>📄</span>
                <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${l.title}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;

      group.querySelector('.module-header-btn').addEventListener('click', () => {
        playSound('click');
        group.classList.toggle('open');
      });

      group.querySelectorAll('.lesson-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          playSound('click');
          const lId = btn.getAttribute('data-lesson-id');
          const targetCourseIdx = parseInt(btn.getAttribute('data-cidx'), 10);
          const lIdx = coursesData[targetCourseIdx].lessons.findIndex(x => x.lesson_id === lId);
          if (lIdx !== -1) {
            currentCourseIdx = targetCourseIdx;
            currentLessonIdx = lIdx;
            renderLesson(currentCourseIdx, currentLessonIdx);
            renderSidebar(searchInput ? searchInput.value : '');
          }
        });
      });

      sidebarModulesList.appendChild(group);
    });
  }

  function formatMarkdownContent(mdText) {
    let formatted = mdText;

    // 1. Convert code blocks with clean copy button (NO inline onclick!)
    formatted = formatted.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.trim();
      return `
        <div class="terminal-block">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot dot-red"></span>
              <span class="terminal-dot dot-yellow"></span>
              <span class="terminal-dot dot-green"></span>
            </div>
            <span class="terminal-title">${lang || 'bash'}</span>
            <button type="button" class="btn-copy">Copy</button>
          </div>
          <div class="terminal-body"><code>${cleanCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></div>
        </div>
      `;
    });

    // 2. Convert headings with visual badge icons
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="reader-subsection-header"><span>🔹</span> $1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="reader-section-header"><span>📌</span> $1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h2 class="reader-section-header"><span>🐧</span> $1</h2>');

    // 3. Convert concept definitions (- **Term**: Def) into colorful bite-sized concept cards
    formatted = formatted.replace(/^\s*[-*]\s+\*\*([^*]+)\*\*:\s*(.*$)/gim, (m, term, desc) => {
      return `
        <div class="concept-card">
          <span class="concept-card-icon">📍</span>
          <div class="concept-card-text"><strong>${term}:</strong> ${desc}</div>
        </div>
      `;
    });

    // 4. Convert bold & italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 5. Convert inline code with clean styling
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:0.88em; color:#0f172a; font-weight:600;">$1</code>');

    // 6. Convert regular bullet lists into comfortable cards
    formatted = formatted.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="lesson-bullet-item"><span class="bullet-icon">✓</span> <span>$1</span></li>');
    formatted = formatted.replace(/(<li class="lesson-bullet-item">[\s\S]*?<\/li>)/g, '<ul class="lesson-bullet-list">$1</ul>');
    formatted = formatted.replace(/<\/ul>\s*<ul class="lesson-bullet-list">/g, '');

    // 7. Paragraph breaks (filter out empty paragraphs and headings)
    const paras = formatted.split(/\n\n+/);
    formatted = paras.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<ul') || p.startsWith('<ol')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return formatted;
  }

  // Delegated Copy Button Handler (100% bug-free, zero attribute leaking)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;
    const block = btn.closest('.terminal-block');
    const codeEl = block ? block.querySelector('code') : null;
    if (codeEl) {
      playSound('click');
      navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      }).catch(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    }
  });

  function renderLesson(cIdx, lIdx) {
    if (!readerStage || !coursesData[cIdx] || !coursesData[cIdx].lessons[lIdx]) return;
    const course = coursesData[cIdx];
    const lesson = course.lessons[lIdx];

    // Find linear index
    const flatIdx = flatLessons.findIndex(x => x.cIdx === cIdx && x.lIdx === lIdx);
    const prevLesson = flatIdx > 0 ? flatLessons[flatIdx - 1] : null;
    const nextLesson = flatIdx < flatLessons.length - 1 ? flatLessons[flatIdx + 1] : null;

    const formattedBody = formatMarkdownContent(lesson.content);

    let quizzesHTML = '';
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      quizzesHTML = `
        <div class="reader-quiz-container">
          <div class="reader-quiz-title">
            <span>🧠</span> Quick Knowledge Check (${lesson.quizzes.length} Questions)
          </div>
          ${lesson.quizzes.map((q, qIndex) => `
            <div style="margin-bottom:22px; padding-bottom:14px; border-bottom: 1px solid var(--border-subtle);">
              <h4 style="font-size:0.96rem; font-weight:700; margin-bottom:10px; color:var(--text-main); line-height:1.4;">
                ${qIndex + 1}. ${q.question}
              </h4>
              <div class="reader-options-grid" id="reader-quiz-${qIndex}">
                ${q.options.map((opt, optIdx) => `
                  <button class="reader-opt-btn" data-correct="${opt.correct}" data-exp="${opt.explanation ? opt.explanation.replace(/"/g, '&quot;') : ''}">
                    <span style="font-weight:700; color:var(--primary);">${String.fromCharCode(65 + optIdx)}.</span> ${opt.text}
                  </button>
                `).join('')}
              </div>
              <div class="reader-quiz-feedback" id="feedback-${qIndex}"></div>
            </div>
          `).join('')}
        </div>
      `;
    }

    readerStage.innerHTML = `
      <div class="reader-header">
        <div class="reader-badge-row">
          <span class="reader-module-badge">${course.icon} ${course.course_name}</span>
          <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Lesson ${lIdx + 1} of ${course.lessons.length}</span>
        </div>
        <h1 class="reader-title">${lesson.title}</h1>
      </div>

      <!-- Penguin Pete's Friendly Lesson Guide -->
      <div class="pete-lesson-banner">
        <div class="pete-avatar">🐧</div>
        <div class="pete-text">
          <h4>Penguin Pete's 10-Second Guide:</h4>
          <p>${lesson.description || 'Welcome! Read through the key points below and test your skills with the quick check.'}</p>
        </div>
      </div>

      <div class="reader-body">
        ${formattedBody}
        ${quizzesHTML}
      </div>

      <div class="reader-nav-bar">
        ${prevLesson ? `
          <button class="btn-action btn-outline" id="prevLessonBtn">
            ◀ Previous: ${prevLesson.title}
          </button>
        ` : '<div></div>'}
        ${nextLesson ? `
          <button class="btn-action btn-primary" id="nextLessonBtn">
            Next: ${nextLesson.title} ▶
          </button>
        ` : '<div></div>'}
      </div>
    `;

    // Hook quiz option clicks in reader
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      lesson.quizzes.forEach((q, qIndex) => {
        const optContainer = document.getElementById(`reader-quiz-${qIndex}`);
        const feedbackElem = document.getElementById(`feedback-${qIndex}`);
        if (!optContainer) return;

        optContainer.querySelectorAll('.reader-opt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const isCorrect = btn.getAttribute('data-correct') === 'true';
            const exp = btn.getAttribute('data-exp');

            optContainer.querySelectorAll('.reader-opt-btn').forEach(b => {
              b.disabled = true;
              if (b.getAttribute('data-correct') === 'true') {
                b.classList.add('correct');
              }
            });

            if (isCorrect) {
              playSound('correct');
              btn.classList.add('correct');
              feedbackElem.className = 'reader-quiz-feedback show feedback-correct';
              feedbackElem.innerHTML = `🎉 <strong>Correct!</strong> ${exp || 'Great job!'}`;
            } else {
              playSound('wrong');
              btn.classList.add('wrong');
              feedbackElem.className = 'reader-quiz-feedback show feedback-wrong';
              feedbackElem.innerHTML = `❌ <strong>Incorrect.</strong> ${exp || 'Check the lesson explanation above.'}`;
            }
          });
        });
      });
    }

    // Previous/Next Buttons
    const prevBtn = document.getElementById('prevLessonBtn');
    if (prevBtn && prevLesson) {
      prevBtn.addEventListener('click', () => {
        playSound('click');
        currentCourseIdx = prevLesson.cIdx;
        currentLessonIdx = prevLesson.lIdx;
        renderLesson(currentCourseIdx, currentLessonIdx);
        renderSidebar(searchInput ? searchInput.value : '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const nextBtn = document.getElementById('nextLessonBtn');
    if (nextBtn && nextLesson) {
      nextBtn.addEventListener('click', () => {
        playSound('click');
        currentCourseIdx = nextLesson.cIdx;
        currentLessonIdx = nextLesson.lIdx;
        renderLesson(currentCourseIdx, currentLessonIdx);
        renderSidebar(searchInput ? searchInput.value : '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSidebar(e.target.value.trim());
    });
  }

  // Initial Reader Load
  renderSidebar();
  renderLesson(0, 0);

  // =========================================================
  // PRESENTATION SLIDES (37 CANVA SLIDES)
  // =========================================================
  const slidesData = [
    {
      id: 1,
      badge: "Mod 1: Welcome",
      badgeColor: "badge-purple",
      title: "Linux Journey: Complete Master Track 🐧",
      subtitle: "The complete foundation covering all 8 core building blocks of Linux.",
      peteSay: "Welcome to the Complete Linux Master course from labex.io/linuxjourney! We cover all 8 modules: Getting Started, Command Line, Text-Fu, Advanced Text-Fu, User Management, Permissions, Processes, and Packages!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>🌱 The Complete Curriculum</h4>
            <p>This comprehensive track is designed to turn absolute beginners into confident terminal users, teaching system architecture, text pipelines, process management, and access controls.</p>
          </div>
          <div class="info-card">
            <h4>🎓 Complete 8 Modules</h4>
            <p>1. Getting Started  •  2. Command Line  •  3. Text-Fu  •  4. Advanced Text-Fu  •  5. Users  •  6. Permissions  •  7. Processes  •  8. Packages.</p>
          </div>
        </div>
      `
    },
    {
      id: 2,
      badge: "Mod 1: Origins",
      badgeColor: "badge-blue",
      title: "1. The Origins: UNIX, GNU & Linux 📜",
      subtitle: "1969 Bell Labs -> 1983 Richard Stallman -> 1991 Linus Torvalds",
      peteSay: "UNIX gave us the design, GNU built the free tools, and 21-year-old Linus Torvalds provided the missing engine: the Linux Kernel!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>1969: UNIX Born</h4>
            <p>Ken Thompson & Dennis Ritchie at Bell Labs created UNIX in C for universal portability.</p>
          </div>
          <div class="info-card">
            <h4>1983: GNU Project</h4>
            <p>Richard Stallman launched GNU for free software. Tools were ready, but Hurd kernel lagged.</p>
          </div>
          <div class="info-card">
            <h4>1991: Linux Kernel</h4>
            <p>Linus Torvalds built the missing kernel engine! GNU Tools + Linux Kernel = Complete OS!</p>
          </div>
        </div>
        <div style="margin-top:14px; background:#eff6ff; padding:10px 16px; border-radius:8px; border-left:4px solid #3b82f6;">
          <strong>Golden Line:</strong> UNIX (1969) ➔ GNU Tools (1983) ➔ Linux Kernel (1991) = Complete GNU/Linux System!
        </div>
      `
    },
    {
      id: 3,
      badge: "Mod 1: Architecture",
      badgeColor: "badge-emerald",
      title: "2. The Kernel & 3 System Layers 🧠",
      subtitle: "The bridge connecting physical hardware to your software.",
      peteSay: "Hardware is the chassis, wheels, and gas tank. The Kernel is the ENGINE and STEERING WHEEL that makes everything work safely!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>⚙️ Kernel Roles:</h4>
            <ul>
              <li><strong>CPU Scheduling:</strong> Allocates CPU time slices to apps.</li>
              <li><strong>Memory Guard:</strong> Keeps apps from colliding in RAM.</li>
              <li><strong>Device Drivers:</strong> Communicates with disks, Wi-Fi, screen.</li>
            </ul>
          </div>
          <div class="info-card">
            <h4>💻 The 3 System Layers:</h4>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div style="background:#fee2e2; padding:6px 10px; border-radius:6px; font-weight:700; font-size:0.8rem; color:#991b1b;">3. User Space (Terminal, Shell, Desktop GUI, Web Browsers)</div>
              <div style="background:#dbeafe; padding:6px 10px; border-radius:6px; font-weight:700; font-size:0.8rem; color:#1e40af;">2. Linux Kernel (Master traffic controller bridge)</div>
              <div style="background:#dcfce7; padding:6px 10px; border-radius:6px; font-weight:700; font-size:0.8rem; color:#166534;">1. Hardware (CPU, RAM, Hard Drives, Network)</div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 4,
      badge: "Mod 1: Distros",
      badgeColor: "badge-amber",
      title: "3. Linux Distros & Release Models 🍦",
      subtitle: "The Kernel is plain ice cream base; a Distro adds toppings!",
      peteSay: "A Distro bundles the Linux Kernel + GNU Tools + Desktop GUI + Package Manager (App Store) into a complete, ready-to-use operating system.",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>📅 Point / Stable Release</h4>
            <p>Updates arrive in planned, thoroughly tested batches (e.g. Debian, Ubuntu LTS). Rock-solid, dependable, and never breaks!</p>
          </div>
          <div class="info-card">
            <h4>🔄 Rolling Release</h4>
            <p>Continuous daily stream of updates (e.g. Arch, openSUSE Tumbleweed). You always have the newest features and latest kernels!</p>
          </div>
        </div>
      `
    },
    {
      id: 5,
      badge: "Mod 1: Distro Showcase",
      badgeColor: "badge-rose",
      title: "4. Major Distros & Cybersecurity 🛡️",
      subtitle: "Debian, Ubuntu, Mint, Fedora, RHEL, Arch, Gentoo, openSUSE, Kali, Tails.",
      peteSay: "Ubuntu and Mint for beginners, Fedora for developers, Debian/RHEL for servers, Arch/Gentoo for DIY hackers, and Kali/Tails for security pros!",
      body: `
        <div class="grid-3">
          <div class="info-card"><strong>Debian 🏛️:</strong> Stability & .deb / APT</div>
          <div class="info-card"><strong>Ubuntu 🧡:</strong> Canonical & 5-year LTS</div>
          <div class="info-card"><strong>Linux Mint 🍃:</strong> Cinnamon desktop for Windows switchers</div>
          <div class="info-card"><strong>Fedora 🔵:</strong> Modern developer lab with RPM / DNF</div>
          <div class="info-card"><strong>RHEL 🔴:</strong> Red Hat 10-year enterprise powerhouse</div>
          <div class="info-card"><strong>Arch Linux 🏹:</strong> DIY rolling release with Pacman</div>
          <div class="info-card"><strong>Gentoo 🧬:</strong> Source-based compilation with USE flags</div>
          <div class="info-card"><strong>openSUSE 🦎:</strong> YaST admin center & Leap/Tumbleweed</div>
          <div class="info-card"><strong>Security 🛡️:</strong> Kali (#1 pentest), Tails (Tor USB)</div>
        </div>
      `
    },
    {
      id: 6,
      badge: "Mod 2: Command Line",
      badgeColor: "badge-cyan",
      title: "5. The Shell & Command Syntax 🐚",
      subtitle: "Interacting directly with the operating system through text.",
      peteSay: "The shell reads what you type, executes it via kernel, and displays the result. '$' means normal user; '#' means root super-user!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>⌨️ Standard Syntax:</h4>
            <pre class="terminal-box"><code>command [options] [arguments]
$ echo "Hello Linux World!"</code></pre>
          </div>
          <div class="info-card">
            <h4>⚡ Golden Rules:</h4>
            <p>Linux is strictly case-sensitive! Up-Arrow recalls past commands. <code>Ctrl-C</code> kills stuck commands.</p>
          </div>
        </div>
      `
    },
    {
      id: 7,
      badge: "Mod 2: Navigation",
      badgeColor: "badge-emerald",
      title: "6. Navigation: pwd, cd, and ls 🧭",
      subtitle: "GPS Pin, Teleporter, and Folder X-Ray Scanner.",
      peteSay: "pwd shows your current path, cd teleports you, and ls scans what is inside!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>pwd 📍</h4>
            <p>Print Working Directory. Outputs full absolute path from root (/):<br><code>$ pwd<br>/home/pete</code></p>
          </div>
          <div class="info-card">
            <h4>cd 🛸</h4>
            <p><code>cd ..</code> (up 1 level)<br><code>cd ~</code> (go home)<br><code>cd -</code> (jump back)<br><code>cd "Folder Name"</code></p>
          </div>
          <div class="info-card">
            <h4>ls 🔍</h4>
            <p><code>ls -a</code> (all dotfiles)<br><code>ls -l</code> (long details)<br><code>ls -lh</code> (human sizes)<br><code>ls -ltr</code> (newest last)</p>
          </div>
        </div>
      `
    },
    {
      id: 8,
      badge: "Mod 2: Files",
      badgeColor: "badge-blue",
      title: "7. File Creation & Inspection: touch & file ✨",
      subtitle: "The Magic File Wand and the Magic Byte Detective.",
      peteSay: "touch makes empty files or updates timestamps. file inspects true internal magic bytes (Linux ignores extensions!).",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>touch [file]</h4>
            <pre class="terminal-box"><code>$ touch notes.txt script.py
$ touch -m existing.txt  # Mod time only</code></pre>
          </div>
          <div class="info-card">
            <h4>file [file]</h4>
            <pre class="terminal-box"><code>$ file fake.gif
fake.gif: ASCII text (Not a real GIF!)
$ file -i index.html
index.html: text/html; charset=utf-8</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 9,
      badge: "Mod 2: Viewing",
      badgeColor: "badge-amber",
      title: "8. Viewing Files: cat, less & history 📖",
      subtitle: "Sticky note reader, storybook viewer, and command time machine.",
      peteSay: "cat for short files, less for big logs (search with '/', quit with 'q'), and history (Ctrl-R) to recall old commands!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>cat 📝</h4>
            <p>Views whole file or joins files. <code>></code> overwrites, <code>>></code> appends.</p>
          </div>
          <div class="info-card">
            <h4>less 📖</h4>
            <p>Paged viewer! Scroll with arrows, <code>/search</code>, and <code>q</code> to quit.</p>
          </div>
          <div class="info-card">
            <h4>history ⏳</h4>
            <p><code>!!</code> repeats last command. <code>Ctrl-R</code> reverse searches past commands.</p>
          </div>
        </div>
      `
    },
    {
      id: 10,
      badge: "Mod 2: Operations",
      badgeColor: "badge-rose",
      title: "9. File Operations: cp, mv, mkdir, and rm 🗑️",
      subtitle: "Copying, moving, directory architecture, and permanent removal.",
      peteSay: "WARNING: Linux has NO Trash Can! rm deletes permanently. Always check your path with pwd first!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>cp & mv</h4>
            <pre class="terminal-box"><code>$ cp -r folder/ backup/   # -r REQUIRED for folders!
$ mv old.txt new.txt     # Renames in place
$ mv file.txt folder/    # Moves file (no -r needed!)</code></pre>
          </div>
          <div class="info-card">
            <h4>mkdir & rm</h4>
            <pre class="terminal-box"><code>$ mkdir -p app/src/components # Nested tree
$ rm -i *.tmp                 # Safe confirmation
$ rm -r folder/               # Deletes folder tree</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 11,
      badge: "Mod 2: Discovery",
      badgeColor: "badge-purple",
      title: "10. Discovery & Help: find, man, whatis, alias, exit 💡",
      subtitle: "Finding files, reading manuals, creating shortcuts, and closing sessions.",
      peteSay: "find searches the tree, man gives you the full manual, whatis gives a 1-line definition, and alias gives commands nicknames!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ find . -name "*.log" -type f -size +10M
$ man ls               # Full manual (1=cmd, 5=formats, 8=admin)
$ whatis cat           # 1-line definition
$ alias ll='ls -la'    # Save in ~/.bashrc
$ exit                 # 0=success, non-zero=error</code></pre>
        </div>
      `
    },
    {
      id: 12,
      badge: "Mod 3: Text-Fu",
      badgeColor: "badge-blue",
      title: "11. Text-Fu: The 3 Standard Streams 🌊",
      subtitle: "stdin (0), stdout (1), and stderr (2).",
      peteSay: "Every Linux program opens three channels: 0 for input (keyboard), 1 for normal output (screen), and 2 for error messages!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>stdin (0) 📥</h4>
            <p>Standard Input. Feeds text into the program from keyboard or file.</p>
          </div>
          <div class="info-card">
            <h4>stdout (1) 📤</h4>
            <p>Standard Output. Prints regular successful output to the terminal.</p>
          </div>
          <div class="info-card">
            <h4>stderr (2) ⚠️</h4>
            <p>Standard Error. Prints error logs separately so they don't taint output.</p>
          </div>
        </div>
      `
    },
    {
      id: 13,
      badge: "Mod 3: Redirection",
      badgeColor: "badge-emerald",
      title: "12. Stream Redirection (<, >, >>, 2>, 2>&1) 🔀",
      subtitle: "Sending output to files and reading input from files.",
      peteSay: "'>' wipes and overwrites, '>>' appends to the bottom, and '2>' catches error messages into a log file!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ echo "First line" > log.txt        # Overwrites completely
$ echo "Second line" >> log.txt      # Safely appends to bottom
$ ls /root 2> error.log              # Redirects errors only
$ ./script.sh > output.log 2>&1      # Combines stdout + stderr!
$ wc -l < notes.txt                  # Feeds notes.txt into stdin</code></pre>
        </div>
      `
    },
    {
      id: 14,
      badge: "Mod 3: Pipes & Tee",
      badgeColor: "badge-cyan",
      title: "13. Pipes (|) and tee (Connecting Tools) 🚰",
      subtitle: "The Unix philosophy: connect small tools together into powerful pipelines.",
      peteSay: "The pipe ('|') takes stdout of the left command and feeds it directly into stdin of the right command! 'tee' writes to disk AND screen at the same time!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code># Connect commands with pipe:
$ ls -l /usr/bin | grep 'zip' | wc -l

# Split with tee (writes to file AND screen):
$ ls -l | tee directory_contents.txt | grep 'pete'</code></pre>
        </div>
      `
    },
    {
      id: 15,
      badge: "Mod 3: Environment",
      badgeColor: "badge-purple",
      title: "14. Environment Variables: env, PATH, export 🌐",
      subtitle: "Global configuration settings accessible to programs.",
      peteSay: "PATH tells Linux where to look for commands! Use 'export' so subshells and background jobs can see your variables.",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ env                  # Print all environment variables
$ echo $HOME           # /home/pete
$ echo $PATH           # /usr/local/bin:/usr/bin:/bin
$ export API_KEY="xyz" # Exports variable to child processes</code></pre>
        </div>
      `
    },
    {
      id: 16,
      badge: "Mod 3: Slicing",
      badgeColor: "badge-amber",
      title: "15. Slicing Text: head, tail, cut, paste ✂️",
      subtitle: "Peek at headers, tail live logs, extract columns, and merge lines.",
      peteSay: "Use 'tail -f' to watch live logs stream in real time! Use 'cut -d \":\" -f 1' to slice usernames out of /etc/passwd.",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>head & tail</h4>
            <pre class="terminal-box"><code>$ head -n 5 /etc/passwd
$ tail -n 10 /var/log/syslog
$ tail -f /var/log/syslog  # Follow mode!</code></pre>
          </div>
          <div class="info-card">
            <h4>cut & paste</h4>
            <pre class="terminal-box"><code>$ cut -d ':' -f 1 /etc/passwd # Column 1
$ paste names.txt scores.txt  # Merge side-by-side</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 17,
      badge: "Mod 3: Metrics",
      badgeColor: "badge-rose",
      title: "16. Text Metrics: nl, wc, expand, join, split 📊",
      subtitle: "Line numbers, word counts, tab expansion, and file chunking.",
      peteSay: "wc counts lines (-l), words (-w), and bytes (-c). split chops gigantic files into manageable chunks of 1000 lines!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ wc -l script.py              # Counts total lines
$ nl file.txt                  # Adds line numbers
$ expand file.txt              # Converts tabs to spaces
$ split -l 1000 big.csv chunk_ # Chops file into chunk_aa, chunk_ab</code></pre>
        </div>
      `
    },
    {
      id: 18,
      badge: "Mod 3: Sorting & Filters",
      badgeColor: "badge-emerald",
      title: "17. sort, tr, and uniq (Data Cleansing) 🧹",
      subtitle: "Alphabetical/numeric sorting, character translation, and deduplication.",
      peteSay: "CRITICAL: uniq ONLY detects ADJACENT duplicates! Always run 'sort' before 'uniq'!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ sort -n numbers.txt          # Numeric sort (1, 2, 10)
$ cat file.txt | tr 'a-z' 'A-Z'# Converts to UPPERCASE
$ sort names.txt | uniq -c     # Counts unique occurrences</code></pre>
        </div>
      `
    },
    {
      id: 19,
      badge: "Mod 3: grep",
      badgeColor: "badge-blue",
      title: "18. grep: The King of Text Search 👑",
      subtitle: "Global Regular Expression Print — search anything in seconds.",
      peteSay: "grep finds matching lines in files or streams. Combine flags: -i (ignore case), -v (invert), -n (line numbers), -r (recursive)!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ grep 'error' /var/log/syslog
$ grep -i 'linux' notes.txt    # Case-insensitive
$ grep -v 'debug' app.log      # Invert (skip debug lines)
$ grep -rn 'TODO' ./src/       # Recursive with line numbers</code></pre>
        </div>
      `
    },
    {
      id: 20,
      badge: "Mod 4: Advanced Text-Fu",
      badgeColor: "badge-purple",
      title: "19. Advanced Text-Fu: Vim vs Emacs ⚔️",
      subtitle: "The legendary terminal editor philosophies.",
      peteSay: "Vim is modal (Normal, Insert, Command). Emacs is modeless and uses chord shortcuts (Ctrl, Alt). Every Linux admin knows how to use Vim!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>🟢 Vim (Modal Efficiency)</h4>
            <p>Every key is a command in Normal Mode. Extremely fast, lightweight, and pre-installed on 99% of servers.</p>
          </div>
          <div class="info-card">
            <h4>🟣 Emacs (The Extensible OS)</h4>
            <p>Extensible Lisp environment. Modeless editing using key combinations (C-x C-f to open, C-x C-s to save).</p>
          </div>
        </div>
      `
    },
    {
      id: 21,
      badge: "Mod 4: Vim",
      badgeColor: "badge-emerald",
      title: "20. Vim Essential Survival Guide 📝",
      subtitle: "Modes, Motion, Editing, and Saving.",
      peteSay: "Vim starts in Normal mode. Press 'i' to type. Press 'Esc' to leave. Save & quit with ':wq'! Force quit without saving with ':q!'!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>Motion (Normal Mode)</h4>
            <p><code>h</code> (left), <code>j</code> (down), <code>k</code> (up), <code>l</code> (right)<br><code>w</code> (next word), <code>b</code> (back word)</p>
          </div>
          <div class="info-card">
            <h4>Editing</h4>
            <p><code>i</code> (insert), <code>x</code> (delete char)<br><code>dd</code> (delete line), <code>yy</code> (copy line)<br><code>p</code> (paste), <code>u</code> (undo)</p>
          </div>
          <div class="info-card">
            <h4>Saving & Quitting</h4>
            <p><code>:w</code> (save)<br><code>:q</code> (quit)<br><code>:wq</code> (save & quit)<br><code>:q!</code> (force quit!)</p>
          </div>
        </div>
      `
    },
    {
      id: 22,
      badge: "Mod 4: Regex",
      badgeColor: "badge-amber",
      title: "21. Regular Expressions (Regex) Mastery 🎯",
      subtitle: "Pattern matching with metacharacters in grep, sed, and editors.",
      peteSay: "'^' matches the start of a line, '$' matches the end, '.' matches any char, and '*' matches 0 or more!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>^Linux        # Matches lines STARTING with 'Linux'
done$         # Matches lines ENDING with 'done'
b.t           # Matches 'bat', 'bet', 'bit', 'bot'
[0-9]+        # Matches 1 or more digits
(cat|dog)     # Matches 'cat' OR 'dog'
$ grep -E '^[0-9]+' data.txt # Extended regex</code></pre>
        </div>
      `
    },
    {
      id: 23,
      badge: "Mod 5: Users & Groups",
      badgeColor: "badge-blue",
      title: "22. User Management: Users, Groups, & UIDs 👥",
      subtitle: "Multi-user security, User IDs, and Group IDs.",
      peteSay: "UID 0 is the root superuser! UIDs 1-999 are system services, and UIDs 1000+ are human users like you and me!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>🆔 UIDs & GIDs:</h4>
            <ul>
              <li><strong>UID 0:</strong> Root Superuser.</li>
              <li><strong>UIDs 1-999:</strong> Daemons & Services (nginx, sshd).</li>
              <li><strong>UIDs 1000+:</strong> Regular human accounts.</li>
            </ul>
          </div>
          <div class="info-card">
            <h4>👥 Groups:</h4>
            <p><strong>Primary Group:</strong> Owns files created by user.<br><strong>Supplementary Groups:</strong> Grants extra rights (e.g. <code>sudo</code>, <code>docker</code>).</p>
          </div>
        </div>
      `
    },
    {
      id: 24,
      badge: "Mod 5: Databases",
      badgeColor: "badge-rose",
      title: "23. System User Files: /etc/passwd, shadow, group 🗄️",
      subtitle: "The 3 critical files that store identities, hashes, and memberships.",
      peteSay: "/etc/passwd stores user profiles (7 fields). /etc/shadow is root-only and stores encrypted password hashes!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code># /etc/passwd (7 colon-separated fields):
pete:x:1001:1001:Penguin Pete:/home/pete:/bin/bash
  1: username     2: password 'x'    3: UID       4: GID
  5: GECOS/name   6: home folder     7: default login shell

# /etc/shadow: Stores salted password hashes (root readable only!)
# /etc/group:  developers:x:1002:pete,alice,bob</code></pre>
        </div>
      `
    },
    {
      id: 25,
      badge: "Mod 5: Root & Sudo",
      badgeColor: "badge-purple",
      title: "24. Root Powers, su, and sudo 🔑",
      subtitle: "Switching users and executing privileged commands.",
      peteSay: "'su -' switches completely to root. 'sudo' runs ONE command as root using YOUR password! Always edit /etc/sudoers with 'visudo'!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>su vs sudo:</h4>
            <p><strong>su - :</strong> Switch User. Needs root's password. Leaves shell as root.<br><strong>sudo cmd :</strong> Runs single cmd as root using user password. Audited!</p>
          </div>
          <div class="info-card">
            <h4>User Administration Tools:</h4>
            <pre class="terminal-box"><code>$ sudo useradd -m -s /bin/bash john
$ sudo passwd john
$ sudo usermod -aG sudo john
$ sudo userdel -r john</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 26,
      badge: "Mod 6: Permissions",
      badgeColor: "badge-cyan",
      title: "25. The Permission Triad (-rwxr-xr--) 🔒",
      subtitle: "Read (4), Write (2), Execute (1) across User, Group, and Others.",
      peteSay: "10 characters tell the whole story! Character 1 is type (- file, d folder). Then 3 for User, 3 for Group, 3 for Others!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>-  r w x  r - x  r - -
^  \___/  \___/  \___/
|  User   Group  Others
Type: '-'=file, 'd'=directory, 'l'=symlink

Math: Read (r)=4  |  Write (w)=2  |  Execute (x)=1
User:   rwx = 4 + 2 + 1 = 7
Group:  r-x = 4 + 0 + 1 = 5
Others: r-- = 4 + 0 + 0 = 4   ➔  Octal Mode: 754</code></pre>
        </div>
      `
    },
    {
      id: 27,
      badge: "Mod 6: chmod & chown",
      badgeColor: "badge-emerald",
      title: "26. Modifying Permissions: chmod & chown 🛠️",
      subtitle: "Numeric octal modes, symbolic syntax, and ownership transfers.",
      peteSay: "chmod 755 makes scripts executable. chmod 644 makes documents readable. chown pete:devs changes owner and group in one command!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>chmod [mode] file</h4>
            <pre class="terminal-box"><code>$ chmod 755 script.sh   # rwxr-xr-x
$ chmod 600 id_rsa      # rw-------
$ chmod u+x test.sh     # Add exec for user
$ chmod g-w notes.txt   # Remove write for group</code></pre>
          </div>
          <div class="info-card">
            <h4>chown & chgrp</h4>
            <pre class="terminal-box"><code>$ sudo chown pete file.txt
$ sudo chown -R pete:devs /var/www/
$ sudo chgrp staff report.pdf</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 28,
      badge: "Mod 6: Special Perms",
      badgeColor: "badge-rose",
      title: "27. umask & Special Bits: SUID, SGID, Sticky 🏷️",
      subtitle: "Default masks, running as owner, group inheritance, and /tmp protection.",
      peteSay: "SUID runs as file owner (like passwd). SGID makes new files inherit the folder's group. Sticky bit (+t) on /tmp stops users from deleting each other's files!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>umask (Default Mask)</h4>
            <p>Files start at 666; Dirs at 777.<br>Default umask 022:<br>Files = 666 - 022 = <strong>644</strong><br>Dirs = 777 - 022 = <strong>755</strong></p>
          </div>
          <div class="info-card">
            <h4>Special Bits:</h4>
            <ul>
              <li><strong>SUID (4000, u+s):</strong> Runs as file owner.</li>
              <li><strong>SGID (2000, g+s):</strong> New files inherit parent group!</li>
              <li><strong>Sticky (1000, +t):</strong> Only owner can delete (on <code>/tmp</code>).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: 29,
      badge: "Mod 7: Processes",
      badgeColor: "badge-blue",
      title: "28. Process Anatomy & Monitoring: ps, top, htop ⚙️",
      subtitle: "PIDs, PPIDs, CPU schedules, and real-time monitoring.",
      peteSay: "A process is an active program in memory. PID 1 (systemd) is the mother of all processes! Use 'ps aux' or 'top' to inspect them.",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>Process Identifiers:</h4>
            <p><strong>PID:</strong> Unique Process ID.<br><strong>PPID:</strong> Parent Process ID.<br><strong>TTY:</strong> Terminal window running it ('?' = background daemon).</p>
          </div>
          <div class="info-card">
            <h4>Monitoring Commands:</h4>
            <pre class="terminal-box"><code>$ ps aux    # All processes for all users
$ top       # Live dynamic dashboard
$ htop      # Interactive scrollable monitor</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 30,
      badge: "Mod 7: Lifecycle",
      badgeColor: "badge-amber",
      title: "29. Creation & Termination: fork, exec, zombies 🧟",
      subtitle: "How processes duplicate, transform, exit, or become orphans.",
      peteSay: "fork() duplicates the parent; exec() replaces memory with the new program! Zombies finished running but wait for their parent to read their exit code.",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>fork() & exec():</h4>
            <p>Bash duplicates itself via <code>fork()</code> to create a child process. The child calls <code>exec()</code> to run the requested binary (e.g. /bin/ls).</p>
          </div>
          <div class="info-card">
            <h4>Zombies & Orphans:</h4>
            <p><strong>Zombie (Z):</strong> Dead process holding a table slot until parent calls <code>wait()</code>.<br><strong>Orphan:</strong> Parent died; adopted by PID 1 (systemd).</p>
          </div>
        </div>
      `
    },
    {
      id: 31,
      badge: "Mod 7: Signals",
      badgeColor: "badge-rose",
      title: "30. Signals & Killing: kill, SIGTERM, SIGKILL 🛑",
      subtitle: "Polite termination vs forceful kernel termination.",
      peteSay: "SIGTERM (15) politely asks the process to clean up and exit. SIGKILL (9) is an immediate hammer by the kernel that cannot be caught!",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code>$ kill -15 1234      # SIGTERM (polite exit)
$ kill -9 1234       # SIGKILL (force kill!)
$ kill -1 1234       # SIGHUP (reload config)
$ killall nginx      # Kills by program name
$ pkill -u pete      # Kills all processes owned by user</code></pre>
        </div>
      `
    },
    {
      id: 32,
      badge: "Mod 7: Jobs & Priority",
      badgeColor: "badge-purple",
      title: "31. Priority (nice) & Job Control (&, fg, bg) ⏳",
      subtitle: "CPU scheduling from -20 to 19, background tasks, and nohup.",
      peteSay: "Append '&' to run in background. 'Ctrl-Z' pauses a job. 'fg' brings it back. 'nohup' keeps it running even after you close the terminal!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>nice & renice:</h4>
            <p>Priority range: <strong>-20</strong> (highest priority / least nice) to <strong>+19</strong> (lowest priority / nicest).<br><code>nice -n 10 ./backup.sh</code></p>
          </div>
          <div class="info-card">
            <h4>Job Control:</h4>
            <pre class="terminal-box"><code>$ ./long_job.sh &   # Run in background
$ jobs              # List terminal jobs
$ fg %1             # Bring job 1 to front
$ nohup ./app.sh &  # Survives terminal close</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 33,
      badge: "Mod 8: Packages",
      badgeColor: "badge-blue",
      title: "32. Software Distribution & Package Formats 📦",
      subtitle: "Pre-compiled binaries, dependency trees, and repositories.",
      peteSay: "Debian and Ubuntu use .deb packages with APT. Red Hat and Fedora use .rpm packages with DNF. Repositories are authenticated app stores!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>Debian Family (.deb)</h4>
            <p>Low-level tool: <code>dpkg</code><br>High-level manager: <code>APT</code> (apt, apt-get)<br>Repositories: <code>/etc/apt/sources.list</code></p>
          </div>
          <div class="info-card">
            <h4>Red Hat Family (.rpm)</h4>
            <p>Low-level tool: <code>rpm</code><br>High-level manager: <code>DNF</code> / <code>YUM</code><br>Repositories: <code>/etc/yum.repos.d/</code></p>
          </div>
        </div>
      `
    },
    {
      id: 34,
      badge: "Mod 8: Package Tools",
      badgeColor: "badge-emerald",
      title: "33. APT & DNF Command Cheatsheet 🛒",
      subtitle: "Installing, updating, upgrading, and removing packages.",
      peteSay: "Low-level tools (dpkg/rpm) install one file but fail on dependencies. High-level tools (apt/dnf) automatically fetch all dependencies!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>Debian / Ubuntu (APT):</h4>
            <pre class="terminal-box"><code>$ sudo apt update       # Refresh repo lists
$ sudo apt upgrade      # Upgrade packages
$ sudo apt install git  # Install package
$ sudo apt remove git   # Remove package</code></pre>
          </div>
          <div class="info-card">
            <h4>RHEL / Fedora (DNF):</h4>
            <pre class="terminal-box"><code>$ sudo dnf check-update # Check updates
$ sudo dnf upgrade      # Upgrade packages
$ sudo dnf install git  # Install package
$ sudo dnf remove git   # Remove package</code></pre>
          </div>
        </div>
      `
    },
    {
      id: 35,
      badge: "Mod 8: Compiling",
      badgeColor: "badge-amber",
      title: "34. Compiling from Source: ./configure, make ⚙️",
      subtitle: "Building software directly from raw C source code.",
      peteSay: "When software isn't in a package repo, remember the classic 3 steps: ./configure (checks system), make (compiles code), sudo make install (copies binaries)!",
      body: `
        <div class="grid-3">
          <div class="info-card">
            <h4>1. ./configure</h4>
            <p>Inspects system libraries, checks CPU, and creates Makefile.</p>
          </div>
          <div class="info-card">
            <h4>2. make</h4>
            <p>Calls the C compiler (gcc) to compile source files into machine code.</p>
          </div>
          <div class="info-card">
            <h4>3. sudo make install</h4>
            <p>Copies executable binaries and manuals into /usr/local/bin.</p>
          </div>
        </div>
      `
    },
    {
      id: 36,
      badge: "Mod 8: Archives",
      badgeColor: "badge-purple",
      title: "35. Compressed Archives with tar 🗜️",
      subtitle: "Tape Archive: packaging and compressing directories.",
      peteSay: "Remember this: 'tar -czvf' to CREATE an archive, and 'tar -xzvf' to eXTRACT it! c=create, x=extract, z=gzip, v=verbose, f=file.",
      body: `
        <div class="info-card">
          <pre class="terminal-box"><code># Create gzip-compressed tar archive:
$ tar -czvf backup.tar.gz /home/pete/projects/

# Extract gzip-compressed tar archive:
$ tar -xzvf backup.tar.gz

# View files inside archive without extracting:
$ tar -tzvf backup.tar.gz</code></pre>
        </div>
      `
    },
    {
      id: 37,
      badge: "Graduation",
      badgeColor: "badge-rose",
      title: "36. Linux Master Graduation Summary 🏆",
      subtitle: "Reviewing all 8 foundational pillars of Linux Journey.",
      peteSay: "Congratulations! You've mastered the entire Linux Master curriculum! You understand the kernel, shell navigation, text streams, Vim, users, permissions, processes, and packages!",
      body: `
        <div class="grid-2">
          <div class="info-card">
            <h4>🌟 Modules 1 to 4:</h4>
            <p>Origins, 3 layers, Distro families, 19 Shell commands, I/O streams (<, >, |), text processing (grep, sort, cut), and Vim modal editing.</p>
          </div>
          <div class="info-card">
            <h4>🌟 Modules 5 to 8:</h4>
            <p>Users (/etc/passwd), Root/sudo, Permissions (chmod 755/644, SUID, Sticky bit), Processes (ps aux, kill -9/-15, jobs), and Package systems.</p>
          </div>
        </div>
      `
    }
  ];

  let currentSlideIdx = 0;
  const slideStage = document.getElementById('slideContentStage');
  const slideCounter = document.getElementById('slideCounter');
  const slideProgressFill = document.getElementById('slideProgressFill');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideSelect = document.getElementById('slideSelectDropdown');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (slideSelect) {
    slideSelect.innerHTML = slidesData.map((s, idx) => `<option value="${idx}">Slide ${idx+1}: ${s.title.replace(/<[^>]*>?/gm, '')}</option>`).join('');
    slideSelect.addEventListener('change', (e) => {
      goToSlide(parseInt(e.target.value, 10));
    });
  }

  function renderSlide(idx) {
    if (!slideStage) return;
    const s = slidesData[idx];
    slideStage.innerHTML = `
      <div class="slide-badge ${s.badgeColor}">${s.badge}</div>
      <h2 class="slide-title">${s.title}</h2>
      <p class="slide-subtitle">${s.subtitle}</p>
      
      <div class="pete-callout">
        <div class="pete-avatar">🐧</div>
        <div class="pete-text">
          <h4>Penguin Pete's Master Note:</h4>
          <p>${s.peteSay}</p>
        </div>
      </div>

      <div class="slide-main-body">
        ${s.body}
      </div>
    `;

    if (slideCounter) slideCounter.textContent = `${idx + 1} / ${slidesData.length}`;
    if (slideProgressFill) {
      const pct = ((idx + 1) / slidesData.length) * 100;
      slideProgressFill.style.width = `${pct}%`;
    }

    if (prevSlideBtn) prevSlideBtn.disabled = (idx === 0);
    if (nextSlideBtn) nextSlideBtn.disabled = (idx === slidesData.length - 1);
    if (slideSelect) slideSelect.value = idx;
  }

  function goToSlide(idx) {
    if (idx >= 0 && idx < slidesData.length) {
      playSound('flip');
      currentSlideIdx = idx;
      renderSlide(currentSlideIdx);
    }
  }

  if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => goToSlide(currentSlideIdx - 1));
  if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => goToSlide(currentSlideIdx + 1));

  document.addEventListener('keydown', (e) => {
    const presView = document.getElementById('tab-presentation');
    if (presView && presView.classList.contains('active')) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (currentSlideIdx < slidesData.length - 1) goToSlide(currentSlideIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlideIdx > 0) goToSlide(currentSlideIdx - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullScreen();
      }
    }
  });

  function toggleFullScreen() {
    const viewport = document.getElementById('slideViewport');
    if (!document.fullscreenElement) {
      viewport.requestFullscreen().catch(err => console.warn('Fullscreen request bypassed:', err));
    } else {
      document.exitFullscreen();
    }
  }
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullScreen);

  renderSlide(0);

  // =========================================================
  // FLASHCARDS (47 COMPREHENSIVE CARDS ACROSS ALL 8 MODULES)
  // =========================================================
  const flashcardsData = [
    { id: 1, cat: "Getting Started", q: "What is the Linux kernel?", a: "The core OS engine that manages CPU, memory, devices, and user application communication." },
    { id: 2, cat: "Getting Started", q: "Who started the Linux kernel and in what year?", a: "Linus Torvalds in 1991 as a personal hobby project in Finland." },
    { id: 3, cat: "Getting Started", q: "What is the difference between Point and Rolling release?", a: "Point release publishes planned stable batches (Debian); Rolling release delivers live continuous daily updates (Arch)." },
    { id: 4, cat: "Getting Started", q: "What package format and manager does Debian use?", a: "The .deb format and APT package manager." },
    { id: 5, cat: "Getting Started", q: "What is RHEL mainly designed for?", a: "Enterprise corporate servers, mission-critical production, and 10-year support." },
    { id: 6, cat: "Getting Started", q: "Which distro is beginner-friendly with the Cinnamon desktop?", a: "Linux Mint (based on Ubuntu LTS)." },
    { id: 7, cat: "Getting Started", q: "What is Tails OS designed for?", a: "USB live boot, routes all traffic through Tor, and leaves zero digital trace upon shutdown." },
    { id: 8, cat: "Command Line", q: "What does pwd stand for and do?", a: "Print Working Directory. Outputs your full absolute path from root (/)." },
    { id: 9, cat: "Command Line", q: "What does 'cd ..' do?", a: "Moves you UP one level into the parent directory." },
    { id: 10, cat: "Command Line", q: "How do you view hidden dotfiles using ls?", a: "Run 'ls -a' (hidden files start with a dot like .bashrc)." },
    { id: 11, cat: "Command Line", q: "Why does Linux use 'file' instead of file extensions?", a: "Linux inspects internal magic byte headers to verify true file format regardless of extension." },
    { id: 12, cat: "Command Line", q: "What flag is required to copy directories with cp?", a: "The recursive flag: 'cp -r' or 'cp -R'." },
    { id: 13, cat: "Command Line", q: "Is there a Trash Bin or Undo for rm in terminal?", a: "No! In Linux terminal, 'rm' permanently deletes files immediately." },
    { id: 14, cat: "Command Line", q: "What does '!!' do in Bash?", a: "Re-executes the most recent command immediately." },
    { id: 15, cat: "Text-Fu", q: "What are the three standard data streams and their file descriptors?", a: "stdin (0), stdout (1), and stderr (2)." },
    { id: 16, cat: "Text-Fu", q: "What is the difference between '>' and '>>'?", a: "'>' overwrites the destination file completely; '>>' safely appends new data to the bottom." },
    { id: 17, cat: "Text-Fu", q: "How do you redirect only error messages into error.log?", a: "Run: command 2> error.log" },
    { id: 18, cat: "Text-Fu", q: "What does a pipe ('|') do?", a: "Connects standard output (stdout) of the left command to standard input (stdin) of the right command." },
    { id: 19, cat: "Text-Fu", q: "What does the 'tee' command do?", a: "Splits output: writes data to a file AND displays it on the screen simultaneously." },
    { id: 20, cat: "Text-Fu", q: "How do you stream a log file live in real time?", a: "Run: tail -f /var/log/syslog" },
    { id: 21, cat: "Text-Fu", q: "How do you extract the first field of /etc/passwd using cut?", a: "Run: cut -d ':' -f 1 /etc/passwd" },
    { id: 22, cat: "Text-Fu", q: "Why must you sort a file before running uniq?", a: "Because 'uniq' only detects ADJACENT duplicate lines." },
    { id: 23, cat: "Text-Fu", q: "What does 'grep -v' do?", a: "Inverts match: displays only lines that DO NOT contain the specified pattern." },
    { id: 24, cat: "Advanced Text-Fu", q: "What are the 3 primary modes in Vim?", a: "Normal Mode (navigation/commands), Insert Mode (typing text), and Command Mode (saving/quitting)." },
    { id: 25, cat: "Advanced Text-Fu", q: "How do you switch from Normal Mode to Insert Mode in Vim?", a: "Press the 'i' key (or 'a' to append, 'o' to open line below)." },
    { id: 26, cat: "Advanced Text-Fu", q: "How do you save and exit Vim?", a: "Press Esc, type ':wq' (or ':x'), and press Enter." },
    { id: 27, cat: "Advanced Text-Fu", q: "In regular expressions, what do '^' and '$' mean?", a: "'^' matches the beginning of a line; '$' matches the end of a line." },
    { id: 28, cat: "Advanced Text-Fu", q: "What does the regex dot ('.') match?", a: "Matches any single character (except a newline)." },
    { id: 29, cat: "User Management", q: "What numeric UID is always assigned to the root superuser?", a: "UID 0." },
    { id: 30, cat: "User Management", q: "What are the 7 fields in /etc/passwd?", a: "username : password_placeholder(x) : UID : GID : GECOS_comment : home_directory : login_shell." },
    { id: 31, cat: "User Management", q: "Where are encrypted password hashes stored in Linux?", a: "In the /etc/shadow file (accessible only by root)." },
    { id: 32, cat: "User Management", q: "What is the difference between su and sudo?", a: "'su' switches to root requiring root's password; 'sudo' runs a single command as root using user's password." },
    { id: 33, cat: "User Management", q: "What command adds a new user with a home directory in one step?", a: "sudo useradd -m -s /bin/bash username" },
    { id: 34, cat: "Permissions", q: "What are the numeric values for Read, Write, and Execute?", a: "Read (r) = 4, Write (w) = 2, Execute (x) = 1." },
    { id: 35, cat: "Permissions", q: "What permissions does chmod 755 grant?", a: "Owner: rwx (7), Group: r-x (5), Others: r-x (5)." },
    { id: 36, cat: "Permissions", q: "What is umask and what does umask 022 result in for new files?", a: "The default permission mask. 666 - 022 = 644 (rw-r--r--) for files." },
    { id: 37, cat: "Permissions", q: "What does the SUID bit do on an executable binary?", a: "Executes the program with the permissions of the file owner (e.g. /usr/bin/passwd)." },
    { id: 38, cat: "Permissions", q: "What is the Sticky Bit (+t) and where is it famously used?", a: "Restricts file deletion to file owners only; famously used on /tmp (drwxrwxrwt)." },
    { id: 39, cat: "Processes", q: "What is PID 1 in modern Linux systems?", a: "The init system (systemd), the parent of all processes." },
    { id: 40, cat: "Processes", q: "What is the difference between SIGTERM (15) and SIGKILL (9)?", a: "SIGTERM politely asks the process to exit cleanly; SIGKILL immediately terminates it via kernel." },
    { id: 41, cat: "Processes", q: "What is a Zombie process (State 'Z')?", a: "A finished process whose parent has not yet called wait() to collect its exit status." },
    { id: 42, cat: "Processes", q: "What priority range does 'nice' use?", a: "From -20 (highest priority / least nice) to +19 (lowest priority / nicest)." },
    { id: 43, cat: "Processes", q: "What command runs a process immune to hangup signals?", a: "nohup command &" },
    { id: 44, cat: "Packages", q: "What package format and tools are used by Debian/Ubuntu vs RHEL/Fedora?", a: "Debian uses .deb with dpkg/APT; RHEL uses .rpm with rpm/DNF." },
    { id: 45, cat: "Packages", q: "What are the 3 classic steps to compile software from source code?", a: "1. ./configure  ➔  2. make  ➔  3. sudo make install" },
    { id: 46, cat: "Packages", q: "What tar command creates a gzip compressed archive?", a: "tar -czvf archive.tar.gz folder/ (c=create, z=gzip, v=verbose, f=file)." },
    { id: 47, cat: "Packages", q: "What tar command extracts an archive?", a: "tar -xzvf archive.tar.gz (x=extract)." }
  ];

  let cardStatus = {};
  let currentTagFilter = 'All';

  const flashcardsGrid = document.getElementById('flashcardsGrid');
  const filterBtns = document.querySelectorAll('.tag-btn');
  const statLearned = document.getElementById('statLearned');
  const statReview = document.getElementById('statReview');

  function renderFlashcards() {
    if (!flashcardsGrid) return;
    flashcardsGrid.innerHTML = '';
    const filtered = flashcardsData.filter(card => {
      if (currentTagFilter === 'All') return true;
      return card.cat === currentTagFilter;
    });

    filtered.forEach(c => {
      const status = cardStatus[c.id] || 'none';

      const wrapper = document.createElement('div');
      wrapper.className = 'flashcard-wrapper';
      wrapper.innerHTML = `
        <div class="flashcard ${status === 'learned' ? 'learned-border' : ''}" id="card-${c.id}">
          <div class="flashcard-face flashcard-front">
            <div class="card-top">
              <span class="card-qnum">Card #${c.id}</span>
              <span class="card-category">📁 ${c.cat}</span>
            </div>
            <div class="card-body">
              <h3>${c.q}</h3>
            </div>
            <div class="card-bottom-hint">
              <span>👆 Click to flip & reveal</span>
              <span>🐧 Pete</span>
            </div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="card-top">
              <span class="card-qnum" style="background:#dcfce7; color:#15803d;">Answer</span>
              <span class="card-category">Card #${c.id}</span>
            </div>
            <div class="card-body">
              <p>${c.a}</p>
            </div>
            <div class="card-bottom-hint">
              <div class="card-actions">
                <button class="card-btn card-btn-success" data-action="learned" data-id="${c.id}">✓ Got It!</button>
                <button class="card-btn card-btn-again" data-action="review" data-id="${c.id}">↻ Repeat</button>
              </div>
              <span style="font-size:0.7rem;">Click to flip back</span>
            </div>
          </div>
        </div>
      `;

      const cardElem = wrapper.querySelector('.flashcard');
      cardElem.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          e.stopPropagation();
          const action = e.target.getAttribute('data-action');
          const id = e.target.getAttribute('data-id');
          cardStatus[id] = action;
          updateCardStats();
          playSound(action === 'learned' ? 'correct' : 'wrong');
          return;
        }
        playSound('flip');
        cardElem.classList.toggle('flipped');
      });

      flashcardsGrid.appendChild(wrapper);
    });

    updateCardStats();
  }

  function updateCardStats() {
    let learnedCount = 0;
    let reviewCount = 0;
    Object.values(cardStatus).forEach(st => {
      if (st === 'learned') learnedCount++;
      if (st === 'review') reviewCount++;
    });
    if (statLearned) statLearned.textContent = `${learnedCount} Mastered`;
    if (statReview) statReview.textContent = `${reviewCount} Needs Practice`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTagFilter = btn.getAttribute('data-cat');
      renderFlashcards();
    });
  });

  const shuffleBtn = document.getElementById('shuffleCardsBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      playSound('click');
      flashcardsData.sort(() => Math.random() - 0.5);
      renderFlashcards();
    });
  }

  renderFlashcards();

  // =========================================================
  // MASTER QUIZ ARENA (20 COMPREHENSIVE QUESTIONS)
  // =========================================================
  const quizQuestions = [
    {
      q: "Who created the Linux kernel in 1991?",
      options: ["Richard Stallman", "Linus Torvalds", "Dennis Ritchie", "Ken Thompson"],
      correct: 1,
      exp: "Linus Torvalds created the Linux kernel in 1991 as a personal student project in Finland!"
    },
    {
      q: "Which file descriptor represents Standard Error (stderr)?",
      options: ["0", "1", "2", "3"],
      correct: 2,
      exp: "File descriptors: 0 = stdin, 1 = stdout, and 2 = stderr."
    },
    {
      q: "What is the difference between '>' and '>>'?",
      options: ["> overwrites the file; >> appends to the end", "> appends; >> overwrites", "> creates a directory; >> creates a file", "There is no difference"],
      correct: 0,
      exp: "'>' wipes and overwrites the destination file, while '>>' safely appends new text to the end."
    },
    {
      q: "What command connects stdout of the left command to stdin of the right command?",
      options: [">", "<", "| (Pipe)", "&"],
      correct: 2,
      exp: "The pipe ('|') takes stdout from the left and feeds it into stdin on the right."
    },
    {
      q: "How do you stream a log file live in real time as new lines are written?",
      options: ["head -f", "tail -f", "cat -f", "less -f"],
      correct: 1,
      exp: "'tail -f' enables follow mode to continuously display new appended lines."
    },
    {
      q: "Why must you run 'sort' before running 'uniq'?",
      options: ["uniq is too slow without sort", "uniq only detects adjacent duplicate lines", "sort deletes blank spaces", "Linux requires commands in pairs"],
      correct: 1,
      exp: "'uniq' only collapses adjacent matching lines, so data must be sorted first."
    },
    {
      q: "Which grep flag ignores uppercase and lowercase differences?",
      options: ["-v", "-i", "-n", "-r"],
      correct: 1,
      exp: "'-i' stands for case-insensitive search."
    },
    {
      q: "How do you save and quit in Vim?",
      options: ["Ctrl-S", ":wq (or :x)", "q!", "Exit"],
      correct: 1,
      exp: "In Vim Command Mode, ':wq' writes (saves) the file and quits."
    },
    {
      q: "In regular expressions, what does '^' represent?",
      options: ["End of a line", "Beginning of a line", "Any number", "A blank space"],
      correct: 1,
      exp: "'^' anchors the match to the beginning of a line."
    },
    {
      q: "What numeric UID is always assigned to the root superuser?",
      options: ["1", "1000", "0", "999"],
      correct: 2,
      exp: "Root is always assigned UID 0 with complete administrative powers."
    },
    {
      q: "Which system file stores salted and encrypted user password hashes?",
      options: ["/etc/passwd", "/etc/shadow", "/etc/group", "/etc/hosts"],
      correct: 1,
      exp: "/etc/shadow is restricted to root and contains encrypted password hashes."
    },
    {
      q: "What numeric value corresponds to permissions 'rwxr-xr-x'?",
      options: ["644", "777", "755", "700"],
      correct: 2,
      exp: "Owner: 4+2+1=7; Group: 4+1=5; Others: 4+1=5 ➔ 755."
    },
    {
      q: "What is the primary function of the SUID bit on an executable file?",
      options: ["Deletes file after execution", "Executes the program with permissions of the file owner", "Encrypts the binary", "Makes it run in background"],
      correct: 1,
      exp: "SUID executes the binary with the privileges of its owner (e.g. passwd running as root)."
    },
    {
      q: "Why does the /tmp directory have the Sticky Bit (+t) set?",
      options: ["To prevent users from deleting files owned by other users", "To make it faster", "To encrypt files", "To hide files"],
      correct: 0,
      exp: "The Sticky Bit ensures that only the file's owner (or root) can delete or rename files in /tmp."
    },
    {
      q: "What signal number corresponds to SIGKILL (immediate forceful termination)?",
      options: ["15", "1", "9", "2"],
      correct: 2,
      exp: "Signal 9 is SIGKILL, which the kernel immediately enforces without allowing cleanup."
    },
    {
      q: "What is a Zombie process in Linux?",
      options: ["A process eating 100% CPU", "A process that finished but whose parent hasn't read its exit status", "A virus program", "A background daemon"],
      correct: 1,
      exp: "A zombie process has terminated execution, but its exit entry remains until the parent calls wait()."
    },
    {
      q: "What is the priority range for process niceness?",
      options: ["0 to 100", "-20 (highest) to +19 (lowest)", "1 to 10", "A to Z"],
      correct: 1,
      exp: "Nice values range from -20 (highest priority / least nice) to +19 (lowest priority / nicest)."
    },
    {
      q: "What high-level package manager is used by Debian and Ubuntu?",
      options: ["DNF", "Pacman", "APT", "Zypper"],
      correct: 2,
      exp: "Debian and Ubuntu use APT (Advanced Package Tool) to resolve and install packages."
    },
    {
      q: "What are the 3 classic steps to compile software from source code?",
      options: ["download, install, run", "./configure, make, sudo make install", "tar, zip, run", "gcc, bin, exe"],
      correct: 1,
      exp: "The classic sequence is ./configure (system check), make (compile), and sudo make install (install)."
    },
    {
      q: "What tar flag extracts an archive?",
      options: ["-c", "-x", "-z", "-v"],
      correct: 1,
      exp: "'-x' stands for extract, while '-c' creates an archive."
    }
  ];

  let currentQuizIdx = 0;
  let quizScore = 0;
  let answered = false;

  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionsList = document.getElementById('quizOptionsList');
  const quizProgressNum = document.getElementById('quizProgressNum');
  const quizScoreBadge = document.getElementById('quizScoreBadge');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNextBtn = document.getElementById('quizNextBtn');

  function renderQuizQuestion() {
    if (!quizQuestionText) return;
    answered = false;
    const item = quizQuestions[currentQuizIdx];
    if (quizProgressNum) quizProgressNum.textContent = `Question ${currentQuizIdx + 1} of ${quizQuestions.length}`;
    if (quizScoreBadge) quizScoreBadge.textContent = `⭐ Score: ${quizScore} / ${quizQuestions.length}`;
    quizQuestionText.textContent = item.q;
    if (quizFeedback) {
      quizFeedback.className = 'quiz-feedback';
      quizFeedback.style.display = 'none';
    }
    if (quizNextBtn) quizNextBtn.style.display = 'none';

    if (quizOptionsList) {
      quizOptionsList.innerHTML = '';
      item.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span style="font-weight:800; color:var(--primary);">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
        btn.addEventListener('click', () => selectAnswer(idx, btn));
        quizOptionsList.appendChild(btn);
      });
    }
  }

  function selectAnswer(chosenIdx, btnElem) {
    if (answered) return;
    answered = true;
    const item = quizQuestions[currentQuizIdx];
    const optionBtns = quizOptionsList.querySelectorAll('.quiz-option-btn');

    optionBtns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === item.correct) {
        b.classList.add('correct');
      }
    });

    if (chosenIdx === item.correct) {
      quizScore++;
      playSound('correct');
      btnElem.classList.add('correct');
      if (quizFeedback) {
        quizFeedback.className = 'quiz-feedback show feedback-correct';
        quizFeedback.innerHTML = `🎉 <strong>Correct!</strong> ${item.exp}`;
      }
    } else {
      playSound('wrong');
      btnElem.classList.add('wrong');
      if (quizFeedback) {
        quizFeedback.className = 'quiz-feedback show feedback-wrong';
        quizFeedback.innerHTML = `❌ <strong>Not quite!</strong> ${item.exp}`;
      }
    }

    if (quizScoreBadge) quizScoreBadge.textContent = `⭐ Score: ${quizScore} / ${quizQuestions.length}`;
    if (quizNextBtn) quizNextBtn.style.display = 'inline-flex';
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      playSound('click');
      if (currentQuizIdx < quizQuestions.length - 1) {
        currentQuizIdx++;
        renderQuizQuestion();
      } else {
        quizQuestionText.innerHTML = `🏆 Linux Master Quiz Completed! You scored <strong>${quizScore} / ${quizQuestions.length}</strong>!`;
        quizOptionsList.innerHTML = `
          <div style="text-align:center; padding: 24px;">
            <p style="font-size:1.2rem; font-weight:700; color:#15803d; margin-bottom:12px;">
              ${quizScore >= 16 ? "🌟 Outstanding! You have mastered the Linux Master level!" : "👍 Great work! Review the flashcards and try again!"}
            </p>
            <button id="restartQuizBtn" class="btn-action btn-primary" style="padding:10px 24px; font-size:1rem;">Restart Quiz 🔄</button>
          </div>
        `;
        if (quizFeedback) quizFeedback.style.display = 'none';
        if (quizNextBtn) quizNextBtn.style.display = 'none';
        document.getElementById('restartQuizBtn').addEventListener('click', () => {
          currentQuizIdx = 0;
          quizScore = 0;
          renderQuizQuestion();
        });
      }
    });
  }

  renderQuizQuestion();
});
