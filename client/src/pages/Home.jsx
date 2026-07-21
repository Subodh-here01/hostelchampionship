import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SPORTS_LIST = [
  { id: 'cricket', name: 'Cricket', emoji: '🏏', matches: 8, status: 'Ongoing', desc: 'Settle it on the pitch. 11 players, one goal: total block domination.' },
  { id: 'tt', name: 'TT', emoji: '🏓', matches: 6, status: 'Ongoing', desc: 'Fast reflexes, spin-heavy rallies, and table-top dominance.' },
  { id: 'badminton', name: 'Badminton', emoji: '🏸', matches: 12, status: 'Completed', desc: 'Speed, stamina, and smashes. Indoor court shuttle battle.' },
  { id: 'chess', name: 'Chess', emoji: '♟️', matches: 10, status: 'Completed', desc: 'Strategy and intellect. 64 squares of silent hostel warfare.' },
  { id: 'carrom', name: 'Carrom', emoji: '🟤', matches: 8, status: 'Upcoming', desc: 'Fingers, powder, and coins. A classic common room battle.' },
  { id: 'bgmi', name: 'BGMI', emoji: '🎮', matches: 15, status: 'Ongoing', desc: 'Squad up, land safe, and conquer the virtual battleground lobby.' }
];

const Home = () => {
  const canvasRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });

  // 1. Particle Network Effect (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#E8C547' : '#E84747'; // Gold or red nodes
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const count = Math.min(65, Math.floor((width * height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color === '#E8C547'
              ? `rgba(232, 197, 71, ${alpha})`
              : `rgba(232, 71, 71, ${alpha})`;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Countdown Timer
  useEffect(() => {
    const targetDate = new Date("2026-11-15T06:30:00+05:30").getTime();

    const updateClock = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Hover 3D Tilt Card effect handler
  const handleTilt = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleTiltReset = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <div className="relative min-h-screen bg-base pt-[70px]">

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display font-bold uppercase tracking-[6px] text-accent text-sm md:text-base mb-6 border-b border-accent/20 pb-2 inline-block"
          >
            ORGANIZED BY TEAM ELITE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-8xl font-black uppercase tracking-tight text-text-bright leading-none mb-6"
          >
            WHO <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(232,197,71,0.2)]">RULES</span> THE<br />HOSTEL?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-muted text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          >
            <strong className="text-text-bright">10 Hostel blocks</strong>. <strong className="text-text-bright">6 Arena sports</strong>. <strong className="text-text-bright">One undisputed champion</strong>. Prepare for battle.
          </motion.p>

          {/* Countdown Clock */}
          {timeLeft ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center gap-3 md:gap-5 mb-14"
            >
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds }
              ].map((timeBox, idx) => (
                <div
                  key={idx}
                  className="bg-card/75 border border-border/60 border-b-2 border-b-accent rounded-sm px-4 py-3 min-w-[70px] md:min-w-[90px] text-center shadow-2xl backdrop-blur-md hover:border-b-accent-red transition-all duration-300"
                >
                  <div className="font-score text-2xl md:text-3xl font-black text-text-bright">
                    {String(timeBox.val).padStart(2, '0')}
                  </div>
                  <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted mt-1">
                    {timeBox.label}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="font-display font-extrabold text-accent text-2xl mb-12 tracking-widest animate-pulse">
              CHAMPIONSHIP HORN HAS BLOWN
            </div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/leaderboard" className="font-display uppercase font-bold text-sm tracking-wider bg-accent hover:bg-accent/90 text-base px-8 py-3.5 rounded shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5">
              <i className="fa-solid fa-trophy mr-2"></i> View Standings
            </Link>
            <Link to="/schedule" className="font-display uppercase font-bold text-sm tracking-wider bg-transparent border border-text-bright/40 text-text-bright hover:bg-muted hover:border-text-bright px-8 py-3.5 rounded transition-all duration-300 hover:-translate-y-0.5">
              <i className="fa-solid fa-calendar-days mr-2"></i> Match Schedule
            </Link>
          </motion.div>

        </div>
      </section>

      {/* SPORTS SHOWCASE */}
      <section className="py-24 border-t border-border/40 bg-card/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
              THE BATTLEGROUNDS
            </span>
            <h2 className="font-display text-4xl font-extrabold uppercase text-text-bright">
              THE 6 arena <span className="text-accent-red">sports</span>
            </h2>
          </div>

          {/* Slider list */}
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin select-none">
            {SPORTS_LIST.map((sport) => (
              <div
                key={sport.id}
                onMouseMove={(e) => handleTilt(e, e.currentTarget)}
                onMouseLeave={(e) => handleTiltReset(e.currentTarget)}
                className="flex-shrink-0 w-[290px] bg-card border border-border/80 border-l-4 border-l-accent p-6 rounded flex flex-col gap-4 shadow-lg transition-all duration-300 cursor-grab hover:border-accent-red/40"
              >
                <div className="text-5xl mt-2 select-none filter drop-shadow-md">{sport.emoji}</div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-text-bright mt-2">
                  {sport.name}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed min-h-[60px]">
                  {sport.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* VENUE & LOCATION SECTION */}
      <section className="py-20 border-t border-border/40 bg-[#0A0A0E] relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            TOURNAMENT ARENA
          </span>
          <h2 className="font-display text-4xl font-extrabold uppercase text-text-bright mb-6">
            OUR CHAMPIONSHIP <span className="text-accent-red">VENUE</span>
          </h2>
          <p className="text-text-muted text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            All major outdoor clashes, track events, and group-stage matches are hosted live at the prestigious <strong>MSRIT College Ground</strong>. Indoor sports are played in the respective sports complex.
          </p>
          <div className="bg-card border border-border/80 p-6 rounded-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
            <div className="text-left">
              <h4 className="font-display font-bold uppercase text-text-bright text-base mb-1">
                MSRIT College Ground
              </h4>
              <p className="text-xs text-text-muted">
                MSR Nagar, Bangalore, Karnataka 560054
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/WiLe36VFuUZhKQVX6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto font-display uppercase font-bold text-xs tracking-wider bg-accent hover:bg-accent/90 text-base px-6 py-3 rounded shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-map-location-dot"></i> View on Google Maps
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
