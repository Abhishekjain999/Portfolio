/**
 * Main Interactive Application Controller
 * Abhishek Jain - Developer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. THEME SWITCHER ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('aj_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('aj_portfolio_theme', newTheme);

      // Dispatch custom event for canvas particles color adjustment
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // --- 2. MOBILE NAVIGATION MENU ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. SCROLL SPY FOR NAVIGATION ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  });

  // --- 4. TERMINAL TYPING EFFECT ---
  const typedTextEl = document.getElementById('typedText');
  if (typedTextEl) {
    const phrases = [
      'npm run build:future',
      'node server.js --env=production',
      'git commit -m "Engineered with AI"',
      'java -jar solution.jar --optimized',
      'docker-compose up -d',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function typeLoop() {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        typingDelay = 45;
      } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        typingDelay = 110;
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        isDeleting = true;
        typingDelay = 1800; // Pause at end of phrase
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingDelay = 400; // Pause before new phrase
      }

      setTimeout(typeLoop, typingDelay);
    }

    setTimeout(typeLoop, 800);
  }

  // --- 5. ANIMATED NUMBER COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUpObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach((stat) => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 1600;
            const steps = 50;
            const increment = target / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
              step++;
              current += increment;
              if (step >= steps) {
                current = target;
                clearInterval(timer);
              }
              const displayVal = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
              stat.textContent = `${prefix}${displayVal}${suffix ? ' ' + suffix : ''}`;
            }, duration / steps);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStatsRow = document.querySelector('.hero-stats-row');
  if (heroStatsRow) {
    countUpObserver.observe(heroStatsRow);
  }

  // --- 6. SKILLS FILTER TABS ---
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 7. 3D CARD TILT EFFECT ---
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (window.innerWidth > 992) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // --- 8. PROJECT MODAL DEEP-DIVE ---
  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  const projectData = {
    jobconnect: {
  title: 'JobConnect',
  category: 'Full-Stack Job & Recruitment Platform',
  description:
    'A full-stack job and recruitment platform designed to connect candidates with opportunities through job discovery, application workflows, and real-time notifications.',
  architecture: [
    'Frontend: React.js application providing responsive interfaces for job discovery, applications, and user interactions.',
    'Backend: Node.js and Express.js REST API handling authentication, jobs, applications, and platform workflows.',
    'Database: MongoDB for persistent storage of users, jobs, applications, and related platform data.',
    'Real-Time Layer: Socket.IO for real-time notifications and event-driven communication between users and the platform.',
  ],
  features: [
    'Job discovery and application management workflow.',
    'Real-time notifications powered by Socket.IO.',
    'RESTful APIs for users, jobs, and application-related operations.',
    'Responsive interface designed for a smooth candidate experience.',
  ],
  tags: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Socket.IO',
    'REST APIs',
  ],
  repo: 'https://github.com/Abhishekjain999',
},
skillswap: {
  title: 'SkillSwap',
  category: 'Peer-to-Peer Skill Exchange Platform',
  description:
    'A peer-to-peer skill exchange platform where users teach what they know in exchange for learning skills they want, powered by intelligent matching and an integrated real-time learning environment.',
  architecture: [
    'Frontend: React.js application providing onboarding, skill discovery, exchange requests, dashboards, and real-time learning interfaces.',
    'Backend: Node.js and Express.js REST API handling authentication, users, skills, matching, exchanges, contracts, sessions, notifications, and reviews.',
    'Database: MongoDB with Mongoose for users, skills, exchange requests, learning contracts, sessions, messages, notifications, reports, and reviews.',
    'Real-Time Layer: Socket.IO for chat, notifications, presence, WebRTC signaling, and collaborative application events.',
    'Communication Layer: WebRTC for peer-to-peer video, audio, and browser screen sharing during learning sessions.',
    'Collaborative Coding: Monaco Editor with Socket.IO-based synchronization for shared coding sessions.',
    'Security: JWT-based authentication with bcrypt password hashing and protected API routes.',
  ],
  features: [
    'Smart matching based on skills users can teach and skills they want to learn.',
    'Skill exchange requests with accept, reject, and counter-offer workflows.',
    'Learning contracts with defined goals and session progress.',
    'Real-time video and audio using WebRTC.',
    'Browser screen sharing for live teaching and demonstrations.',
    'Real-time chat and notifications powered by Socket.IO.',
    'Collaborative Monaco code editor for pair programming and teaching.',
    'Session management, progress tracking, and learning outcomes.',
    'Ratings and reputation system for completed exchanges.',
    'Admin tools for platform management and user safety.',
  ],
  tags: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Socket.IO',
    'WebRTC',
    'Monaco Editor',
    'JWT',
    'bcrypt',
  ],
  repo: 'https://github.com/AbhishekJain999/SkillSwap',
},

devcollab: {
  title: 'DevCollab',
  category: 'Real-Time Collaborative Coding Platform',
  description:
    'A real-time collaborative coding platform that enables developers to work together in shared coding environments with synchronized editors, multi-user collaboration, and integrated code execution.',
  architecture: [
    'Frontend: React 18 application with an interactive collaborative coding interface.',
    'Editor: Monaco Editor integration providing an IDE-style code editing experience.',
    'Real-Time Layer: Socket.IO synchronizes coding activity and editor changes between connected users.',
    'Backend: Node.js and Express.js services managing sessions, authentication, and collaboration workflows.',
    'Database: MongoDB for persistent storage of users and collaborative session-related data.',
    'Security: JWT-based authentication with bcrypt for secure password handling.',
  ],
  features: [
    'Real-time multi-user collaborative coding sessions.',
    'Synchronized Monaco Editor for shared code editing.',
    'Multi-language code execution environment.',
    'JWT authentication and secure user management.',
    'Socket.IO-based real-time communication.',
  ],
  tags: [
    'React 18',
    'Node.js',
    'Socket.IO',
    'Monaco Editor',
    'MongoDB',
    'JWT',
    'bcrypt',
  ],
  repo: 'https://github.com/Abhishekjain999',
},
    blog: {
      title: 'Full-Stack Blog Application',
      category: 'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
      description:
        'A comprehensive blogging platform engineered from scratch using the MERN stack with modern responsive design, JWT authentication, and structured content management.',
      architecture: [
        'Frontend: React.js SPA with modular components, React Router, and dynamic state management.',
        'Backend: Express.js server adhering to MVC (Model-View-Controller) architecture with clean separation of routes, controllers, and services.',
        'Database: MongoDB with Mongoose ORM for efficient relational-like references between users and blog posts.',
        'Security: Password hashing using bcrypt, JSON Web Token (JWT) authorization, and input validation.',
      ],
      features: [
        'User Registration, Login, and Session management with secure cookies/JWT.',
        'Full CRUD operations: Create, read, update, and delete blog articles with rich formatting.',
        'Author dashboard to track published posts and engagement.',
        'Optimized RESTful API endpoints for pagination and search.',
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Auth', 'MVC Architecture', 'Git'],
      repo: 'https://github.com/Abhishekjain999',
    },
    ecommerce: {
      title: 'Full-Stack E-Commerce Platform',
      category: 'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
      description:
        'A high-performance digital shopping platform featuring real-time product browsing, flexible filtering, shopping cart state persistence, and inventory tracking.',
      architecture: [
        'Frontend: React.js with responsive product grid, instant live filter bars, and modal cart drawer.',
        'Backend: RESTful API built on Node.js and Express.js to handle catalog queries, cart calculations, and order workflows.',
        'Database: MongoDB collections modeled for Products, Categories, Users, and Orders with ACID-compliant transactions.',
        'Version Control: Git feature-branch workflow ensuring clean, testable commits.',
      ],
      features: [
        'Dynamic multi-criteria search and category filtering with instant UI updates.',
        'Persistent cart state with quantity adjustments and price calculations.',
        'Order placement flow with user authentication and order history tracking.',
        'Admin inventory management with CRUD for adding and modifying items.',
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'E-Commerce', 'Git Version Control'],
      repo: 'https://github.com/Abhishekjain999',
    },
    speech: {
      title: 'Innovative Speech Therapy System',
      category: 'Assistive Healthcare Technology • 2nd Prize ECS Exhibition Winner',
      description:
        'An award-winning assistive technology application designed to support individuals undergoing speech rehabilitation with structured exercises and immediate interactive feedback.',
      architecture: [
        'Engineered to showcase practical application of technology in assisting speech rehabilitation.',
        'Evaluated and awarded 2nd Prize in the ECS Exhibition judged by external examiners.',
        'Designed with an accessible, patient-friendly user interface and structured therapy modules.',
      ],
      features: [
        'Interactive speech therapy routines tailored for patient rehabilitation.',
        'Clear visual and audible cues to guide users through phonetic articulation exercises.',
        'Commended by academic jury and external examiners for high social impact.',
      ],
      tags: ['AI & Machine Learning', 'Speech Rehabilitation', 'Healthcare Tech', 'Award Winner (2nd Prize)'],
      repo: 'https://github.com/Abhishekjain999',
    },
  };

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="project-category-badge" style="margin-bottom: 12px;">${data.category}</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 12px; color: var(--text-white);">${data.title}</h2>
        <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">${data.description}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px; font-size: 1.1rem;"><i class="fa-solid fa-sitemap"></i> System Architecture</h4>
        <ul style="padding-left: 20px; color: var(--text-primary); font-size: 0.95rem; line-height: 1.7;">
          ${data.architecture.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--primary); margin-bottom: 10px; font-size: 1.1rem;"><i class="fa-solid fa-list-check"></i> Key Capabilities</h4>
        <ul style="padding-left: 20px; color: var(--text-primary); font-size: 0.95rem; line-height: 1.7;">
          ${data.features.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 28px;">
        <h4 style="color: var(--text-muted); margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase;"><i class="fa-solid fa-tags"></i> Technologies Used</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
        <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-md btn-primary" style="flex: 1;">
          <i class="fa-brands fa-github"></i> View GitHub Repository
        </a>
      </div>
    `;

    projectModal.classList.add('show');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  viewDetailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projKey = btn.getAttribute('data-project');
      openProjectModal(projKey);
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      projectModal.classList.remove('show');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('show');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // --- 9. RESUME MODAL & PRINTING ---
  const resumeModal = document.getElementById('resumeModal');
  const resumePreviewBtn = document.getElementById('resumePreviewBtn');
  const resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (resumePreviewBtn && resumeModal) {
    resumePreviewBtn.addEventListener('click', () => {
      resumeModal.classList.add('show');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (resumeModalCloseBtn && resumeModal) {
    resumeModalCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('show');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('show');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 10. COPY-TO-CLIPBOARD WITH TOASTS ---
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast(`Copied to clipboard: ${textToCopy}`, 'success');
          })
          .catch(() => {
            showToast('Unable to copy to clipboard', 'info');
          });
      }
    });
  });

  // --- 11. CONTACT FORM SIMULATION ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all required fields.', 'info');
        return;
      }

      // Show spinner state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-flex';
      submitBtn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        btnText.style.display = 'inline-flex';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;

        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
      }, 1200);
    });
  }

  // --- 12. TOAST NOTIFICATION HELPER ---
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }

  // --- 13. CURRENT YEAR HELPER ---
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
