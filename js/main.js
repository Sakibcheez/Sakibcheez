// Theme handling
(function() {
    var html = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    var stored = localStorage.getItem('theme');
    if (stored) {
        html.setAttribute('data-theme', stored);
        if (toggle) toggle.textContent = stored === 'light' ? '🌙' : '☀️';
    } else {
        // Default to dark
        html.setAttribute('data-theme', 'dark');
        if (toggle) toggle.textContent = '☀️';
    }
    if (toggle) {
        toggle.addEventListener('click', function() {
            var current = html.getAttribute('data-theme') || 'dark';
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            toggle.textContent = next === 'light' ? '🌙' : '☀️';
        });
    }
})();

// Mobile navigation
(function() {
    var nav = document.querySelector('.nav');
    var button = document.querySelector('.nav-toggle');
    if (!nav || !button) return;
    button.addEventListener('click', function() {
        var isOpen = nav.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
    });
    nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && nav.classList.contains('open')) {
            nav.classList.remove('open');
            button.setAttribute('aria-expanded', 'false');
        }
    });
})();

// Smooth scroll enhancement (native is enabled via CSS)
(function() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// Reveal on scroll
(function() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    var revealables = document.querySelectorAll('.section, .card, .project, .chip');
    revealables.forEach(function(el) { el.classList.add('reveal'); observer.observe(el); });
})();

// Current year in footer
(function() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
})();

// Tilt hover effect for cards
(function() {
    var cards = document.querySelectorAll('.tilt');
    if (!cards.length) return;
    var max = 10; // deg
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var px = (e.clientX - rect.left) / rect.width;
            var py = (e.clientY - rect.top) / rect.height;
            var rx = (py - 0.5) * -2 * max;
            var ry = (px - 0.5) * 2 * max;
            card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(0)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
})();

// Parallax in hero
(function() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    window.addEventListener('scroll', function() {
        var y = window.scrollY;
        els.forEach(function(el) {
            var speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
            el.style.transform = 'translateY(' + (y * speed * 0.2).toFixed(2) + 'px)';
        });
    }, { passive: true });
})();

// Chatbot widget
(function() {
    function createEl(tag, attrs, children) {
        var el = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function(k){
            if (k === 'class') el.className = attrs[k];
            else if (k === 'innerHTML') el.innerHTML = attrs[k];
            else el.setAttribute(k, attrs[k]);
        });
        (children || []).forEach(function(c){ el.appendChild(c); });
        return el;
    }

    var profile = {
        name: 'SAKIB AHMED SHISHIR',
        email: 'asakib784@gmail.com',
        phones: ['+8801858252192', '+8801950466202'],
        address: 'Moghubagh, Moghbazar, Dhaka 1217',
        education: [
            { degree: 'B.Sc. in CSE', org: 'North South University', years: '2023–2026', cgpa: '3.61 (98/130)' },
            { degree: 'HSC (Science)', org: 'Notre Dame College, Dhaka', years: '2019–2021', gpa: '5.00' },
            { degree: 'SSC (Science)', org: 'Rajuk Uttara Model College', years: '2017–2019', gpa: '5.00' }
        ],
        skills: ['C', 'C++', 'Java', 'HTML', 'CSS', 'PHP', 'SQL', 'Java Swing', 'Java Networking', 'Data Entry', 'Email Marketing', 'Facebook Marketing', 'Adaptability', 'Event Management', 'Communication', 'Teamwork'],
        socials: {
            facebook: 'https://www.facebook.com/sakib.ahmed.shishir17/',
            github: 'https://github.com/Sakibcheez',
            linkedin: 'https://www.linkedin.com/in/sakib-ahmed-20337624a'
        },
        achievements: ['50% Scholarship Holder'],
        projects: [
            { name: 'Stadium Ticketing Management System', tech: 'C', link: 'https://github.com/Sakibcheez' },
            { name: 'Cafe Shop Management System', tech: 'Java + Swing', link: 'https://github.com/Sakibcheez' },
            { name: 'Traffic Light Controller', tech: 'Digital Logic', link: '' },
            { name: 'Khaboi-Khabo', tech: 'PHP, HTML, CSS, SQL, JS, phpMailer', link: '#' },
            { name: 'Techshop327 – AI PC Assistant Shop', tech: 'PHP, SQL, HTML, JS', link: '' }
        ]
    };

    function linkify(text) {
        return text
            .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
            .replace(/(\b[\w.-]+@[\w.-]+\.[A-Za-z]{2,}\b)/g, '<a href="mailto:$1">$1</a>');
    }

    function answer(q) {
        var text = q.toLowerCase();
        function join(arr){ return arr.filter(Boolean).join(', '); }

        // small talk / greetings
        if (/(^|\b)(hi|hello|hey|hola|assalamu|assalam|salam|hlw)(\b|!|\.)/.test(text)) {
            return 'Hi! I\'m a helper for ' + profile.name + '. Ask me about contact, education, skills, achievements, or projects.';
        }
        if (/(how are you|how's it going|kemon aso|kemôn achen)/.test(text)) {
            return 'I\'m doing great, thanks! How can I help you learn about Sakib?';
        }

        // time/date
        if (/(time|current time|what time)/.test(text)) {
            var now = new Date();
            return 'Current time: ' + now.toLocaleTimeString();
        }
        if (/(date|today\'?s date|what date)/.test(text)) {
            var today = new Date();
            return 'Today\'s date: ' + today.toLocaleDateString();
        }

        // profile
        if (/(name|who are you|your full name)/.test(text)) return 'I am ' + profile.name + '.';
        if (/(email|mail)/.test(text)) return 'Email: ' + profile.email;
        if (/(phone|contact|call|number)/.test(text)) return 'Phone: ' + join(profile.phones);
        if (/(address|location|where)/.test(text)) return 'Address: ' + profile.address;
        if (/education|study|university|cgpa|hsc|ssc/.test(text)) {
            return 'Education: ' + profile.education.map(function(e){
                var base = e.degree + ' – ' + e.org + ' (' + e.years + ')';
                return e.cgpa ? base + ' · CGPA ' + e.cgpa : e.gpa ? base + ' · GPA ' + e.gpa : base;
            }).join(' | ');
        }
        if (/skill|skills|languages/.test(text)) return 'Skills: ' + join(profile.skills);
        if (/social|socials|profiles/.test(text)) {
            return 'Social profiles: Facebook ' + profile.socials.facebook + ' | GitHub ' + profile.socials.github + ' | LinkedIn ' + profile.socials.linkedin;
        }
        if (/facebook/.test(text)) return 'Facebook: ' + profile.socials.facebook;
        if (/github/.test(text)) return 'GitHub: ' + profile.socials.github;
        if (/linkedin|linked in/.test(text)) return 'LinkedIn: ' + profile.socials.linkedin;
        if (/achievement|achievements|award|scholarship/.test(text)) return 'Achievements: ' + join(profile.achievements);
        if (/project|projects|portfolio/.test(text)) return 'Projects: ' + profile.projects.map(function(p){ return p.name + (p.link ? ' (' + p.link + ')' : ''); }).join(' | ');

        // fallback
        return "I can answer: name, contact, time/date, education, skills, achievements, projects, and socials.";
    }

    var btn = createEl('button', { class: 'chatbot-btn', 'aria-label': 'Open chat' , title: 'Ask about Sakib'}, [
        createEl('span', { innerHTML: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8H7l-3 3v-3c0-1.657 0-1.657 0-1.657V12z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })
    ]);
    var panel = createEl('div', { class: 'chatbot-panel', role: 'dialog', 'aria-modal': 'true' });
    var header = createEl('div', { class: 'chatbot-header' }, [
        createEl('div', { class: 'title', innerHTML: 'Ask about <span style="background:linear-gradient(90deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent">Sakib</span>' }),
        createEl('button', { class: 'close', 'aria-label': 'Close' }, [ document.createTextNode('✕') ])
    ]);
    var messages = createEl('div', { class: 'chatbot-messages' });
    var suggestions = createEl('div', { class: 'cb-suggestions' });
    ;['What is your name?','How to contact you?','Show education','List skills','Show projects'].forEach(function(s){
        suggestions.appendChild(createEl('button', { class: 'cb-chip', type: 'button' }, [ document.createTextNode(s) ]));
    });
    var inputWrap = createEl('div', { class: 'chatbot-input' });
    var input = createEl('textarea', { rows: '1', placeholder: 'Ask about Sakib… (Enter to send, Shift+Enter = newline)', 'aria-label': 'Message', style: 'resize:none' });
    var send = createEl('button', { type: 'button' }, [ document.createTextNode('Send') ]);
    inputWrap.appendChild(input); inputWrap.appendChild(send);

    panel.appendChild(header);
    panel.appendChild(messages);
    messages.appendChild(createEl('div', { class: 'cb-msg bot' }, [ document.createTextNode('Hi! I can answer questions about Sakib’s contact, education, skills, achievements, and projects.') ]));
    messages.appendChild(suggestions);
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    function push(role, text, isHTML) {
        var msg = createEl('div', { class: 'cb-msg ' + role });
        if (isHTML) msg.innerHTML = text; else msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function handle(q) {
        if (!q.trim()) return;
        push('user', q);
        var typing = createEl('div', { class: 'cb-typing' }, [ document.createTextNode('Typing…') ]);
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        setTimeout(function(){
            typing.remove();
            var a = answer(q);
            push('bot', linkify(a), true);
        }, 300 + Math.min(1200, q.length * 20));
    }

    btn.addEventListener('click', function(){ panel.classList.toggle('open'); });
    header.querySelector('.close').addEventListener('click', function(){ panel.classList.remove('open'); });
    send.addEventListener('click', function(){ handle(input.value); input.value=''; input.focus(); autoSize(); });
    function autoSize(){ input.style.height = 'auto'; input.style.height = Math.min(140, input.scrollHeight) + 'px'; }
    input.addEventListener('input', autoSize);
    input.addEventListener('keydown', function(e){
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); handle(input.value); input.value=''; autoSize();
        }
    });
    suggestions.addEventListener('click', function(e){ if (e.target.classList.contains('cb-chip')) { handle(e.target.textContent); }});
})();

