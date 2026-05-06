/* ========================================
   RITESH PORTFOLIO — UPGRADED SCRIPT.JS
   ======================================== */

/* ---- 3D STARFIELD ---- */
(function() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, cx, cy;
    const NUM = 700;
    const BASE_SPEED = 0.3;
    const DEPTH = 1200;

    let stars = [];
    let mouse = { x: 0, y: 0 };

    function resize() {
        W = canvas.width  = window.innerWidth  * (window.devicePixelRatio || 1);
        H = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
        cx = W / 2; cy = H / 2;
        mouse.x = cx; mouse.y = cy;
    }

    function makeStar(init) {
        const r = Math.random();
        return {
            x: (Math.random() - 0.5) * W * 3,
            y: (Math.random() - 0.5) * H * 3,
            z: init ? Math.random() * DEPTH : DEPTH,
            pz: init ? Math.random() * DEPTH : DEPTH,
            color: r < 0.06
                ? 'hsl(' + (195 + Math.random()*30) + ',100%,92%)'
                : r < 0.14
                    ? 'hsl(' + (28 + Math.random()*20) + ',90%,85%)'
                    : 'hsl(' + (210 + Math.random()*50) + ',' + (40+Math.random()*55) + '%,' + (76+Math.random()*22) + '%)',
            size: r < 0.06 ? 1.9 : r < 0.14 ? 1.5 : 0.7 + Math.random() * 0.9,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.015 + Math.random() * 0.04
        };
    }

    function init() {
        resize();
        stars = [];
        for (let i = 0; i < NUM; i++) stars.push(makeStar(true));
    }

    function project(x, y, z) {
        const s = DEPTH / z;
        return { sx: cx + x * s, sy: cy + y * s, scale: s };
    }

    let last = 0;
    function draw(ts) {
        const dt = Math.min((ts - last) / 16, 3);
        last = ts;

        const mx = (mouse.x - cx) / W;
        const my = (mouse.y - cy) / H;
        const tx = mx * 70;
        const ty = my * 70;

        ctx.fillStyle = 'rgba(0,0,2,0.18)';
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.twinkle += s.twinkleSpeed * dt;
            s.pz = s.z;
            s.z -= BASE_SPEED * dt;
            if (s.z <= 1) { stars[i] = makeStar(false); continue; }

            const cur  = project(s.x + tx * (DEPTH/s.z),  s.y + ty * (DEPTH/s.z),  s.z);
            if (cur.sx < -60 || cur.sx > W+60 || cur.sy < -60 || cur.sy > H+60) {
                stars[i] = makeStar(false); continue;
            }

            const sc = cur.scale;
            const r  = Math.max(0.3, s.size * sc * 0.5);
            const alpha = Math.min(1, sc * 0.45) * (0.7 + 0.3 * Math.sin(s.twinkle));
            const col = s.color.replace('hsl', 'hsla').replace(')', ',' + alpha + ')');

            ctx.beginPath();
            ctx.arc(cur.sx, cur.sy, r, 0, Math.PI*2);
            ctx.fillStyle = col;
            ctx.fill();

            if (r > 1.3) {
                const glow = ctx.createRadialGradient(cur.sx, cur.sy, 0, cur.sx, cur.sy, r*5);
                glow.addColorStop(0, s.color.replace('hsl','hsla').replace(')',','+(alpha*0.22)+')'));
                glow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.arc(cur.sx, cur.sy, r*5, 0, Math.PI*2);
                ctx.fillStyle = glow;
                ctx.fill();
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', function(e) {
        const dpr = window.devicePixelRatio || 1;
        mouse.x = e.clientX * dpr;
        mouse.y = e.clientY * dpr;
    });
    window.addEventListener('touchmove', function(e) {
        const dpr = window.devicePixelRatio || 1;
        mouse.x = e.touches[0].clientX * dpr;
        mouse.y = e.touches[0].clientY * dpr;
    }, { passive: true });
    window.addEventListener('resize', function() { resize(); });

    init();
    requestAnimationFrame(draw);
})();


/* ---- JQUERY + PORTFOLIO LOGIC ---- */
$(document).ready(function(){
  // ── Certificate Modal ──
$('#certToggleBtn, #certAllBtn').on('click', function () {
    $('#certModal').addClass('open');
    $('body').css('overflow', 'hidden');
});
$('#certModalClose, #certModalBackdrop').on('click', function () {
    $('#certModal').removeClass('open');
    $('body').css('overflow', '');
});
$(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
        $('#certModal').removeClass('open');
        $('body').css('overflow', '');
    }
});

// ── Contact Form → opens mail client ──
$('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var name    = $('#cf-name').val().trim();
    var email   = $('#cf-email').val().trim();
    var subject = $('#cf-subject').val().trim();
    var message = $('#cf-message').val().trim();

    var mailSubject = encodeURIComponent(subject || 'Message from Portfolio');
    var mailBody    = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message
    );

    window.location.href =
        'mailto:riteshkumar477823@gmail.com' +
        '?subject=' + mailSubject +
        '&body=' + mailBody;
});
  
  
  
  
    // Sticky navbar on scroll
    // Project filter tabs
$('.pf-btn').on('click', function () {
    $('.pf-btn').removeClass('active');
    $(this).addClass('active');

    var filter = $(this).data('filter');

    $('.proj-grid .proj-card').each(function () {
        var cat = $(this).data('cat');
        if (filter === 'all' || cat === filter) {
            $(this).removeClass('proj-hidden');
        } else {
            $(this).addClass('proj-hidden');
        }
    });
});
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // Scroll to top
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });

    // Smooth scroll on nav click
    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
        // Close mobile menu
        $('.navbar .menu').removeClass("active");
        $('.nav-link i').removeClass("active");
    });

    // Mobile menu toggle
    $('.nav-link').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.nav-link i').toggleClass("active");
    });

    // Typed.js — hero
    var typed = new Typed(".typing", {
        strings: ["B.Tech Student", "Freelancer", "AI Engineer", "Gamer", "Editor"],
        typeSpeed: 100,
        backSpeed: 55,
        loop: true
    });

    // Typed.js — about
    var typed2 = new Typed(".typing-2", {
        strings: ["B.Tech Student", "Freelancer", "Gamer", "AI Engineer", "Editor"],
        typeSpeed: 100,
        backSpeed: 55,
        loop: true
    });

    // Owl Carousel
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeout: 2500,
        autoplayHoverPause: true,
        dots: true,
        responsive: {
            0:    { items: 1, nav: false },
            600:  { items: 2, nav: false },
            1000: { items: 3, nav: false }
        }
    });

    // Skill bars animate on scroll (Waypoints)
    if (typeof Waypoint !== 'undefined') {
        var waypoint = new Waypoint({
            element: document.querySelector('.skills'),
            handler: function() {
                // bars animate via CSS already; just a hook for future enhancements
                this.destroy();
            },
            offset: '80%'
        });
    }

    // Active nav link highlight on scroll
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        $('section').each(function() {
            var top    = $(this).offset().top - 80;
            var bottom = top + $(this).outerHeight();
            var id     = $(this).attr('id');
            if (scrollPos >= top && scrollPos < bottom) {
                $('.navbar .menu li a').removeClass('active-link');
                $('.navbar .menu li a[href="#' + id + '"]').addClass('active-link');
            }
        });
    });
});
// Add to script.js
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  document.querySelectorAll('section').forEach((sec, i) => {
    const speed = 0.03 + (i * 0.01);
  });
  
  // Parallax for profile card
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.style.transform = `translateY(${scrollY * 0.05}px) rotateX(${scrollY * 0.01}deg)`;
  }
});
// 3D Tilt Effect
document.querySelectorAll('.services .card, .teams .card, .profile-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  });
  
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});
// Cursor glow effect
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
// Intersection Observer for reveals
const revealElements = document.querySelectorAll('.title, .about-content, .serv-content, .skills-content, .contact-content');

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
