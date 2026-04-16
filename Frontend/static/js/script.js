// =======================
// Countdown
// =======================
const timer = setInterval(function() {

    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.querySelector(".countdown-container").innerHTML = "Hoy celebramos";
    }

}, 1000);

// =======================
// PARALLAX FONDO
// =======================

const isMobile = window.matchMedia("(max-width: 767px)").matches;

if (isMobile) {
    const bg = document.getElementById("bg");
    if (bg) bg.style.display = "none";
} else {
    window.addEventListener("scroll", () => {
        const bg = document.getElementById("bg");
        const scrollY = window.scrollY;
        bg.style.transform = `translateY(-${scrollY * 0.2}px)`;
    });
}

// =======================
// FADE IN AL SCROLLEAR
// =======================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// =======================
// TOAST FORMULARIO
// =======================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rsvp-form");
    const toast = document.getElementById("toast");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch("/confirmar", {
            method: "POST",
            body: formData
        });

        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);
        form.reset();
    });
});

// =======================
// BRILLOS
// =======================

window.addEventListener('load', () => {

    const canvas = document.getElementById("sparkles");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const fallers = Array.from({ length: 18 }, () => ({
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * -window.innerHeight,
        size:    Math.random() * 2 + 1.5,
        speed:   Math.random() * 0.6 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        color:   ["rgba(255,220,240,", "rgba(255,255,255,", "rgba(230,200,255,"][Math.floor(Math.random() * 3)],
    }));

    const glimmers = Array.from({ length: 10 }, () => ({
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        size:  Math.random() * 5 + 4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
    }));

    function drawCross(x, y, size, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = `rgba(255, 220, 240, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.lineCap = "round";

        ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x, y + size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x + size, y); ctx.stroke();

        ctx.globalAlpha = opacity * 0.5;
        const d = size * 0.6;
        ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke();

        ctx.globalAlpha = opacity;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fallers.forEach(f => {
            f.y += f.speed;
            if (f.y > canvas.height + 10) {
                f.y = -10;
                f.x = Math.random() * canvas.width;
            }

            const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4);
            grd.addColorStop(0, f.color + f.opacity + ")");
            grd.addColorStop(1, f.color + "0)");

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
        });

        glimmers.forEach(g => {
            g.phase += g.speed;
            const opacity = (Math.sin(g.phase) * 0.5 + 0.5) * 0.7;
            drawCross(g.x, g.y, g.size, opacity);
        });

        requestAnimationFrame(animate);
    }

    animate();

});