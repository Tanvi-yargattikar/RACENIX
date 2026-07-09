import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Play,
  ArrowRight,
  Gauge,
  Trophy,
  Users,
  Zap,
  Cpu,
  RefreshCw,
  MapPin,
  ChevronRight,
  Activity,
  Wind,
  CircleDot,
  Volume2,
  Maximize2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Custom helper to join classnames
function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// --------------------------------------------------
// DATA STRUCTURES
// --------------------------------------------------

const TEAMS = [
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    principal: 'Frédéric Vasseur',
    championships: 16,
    color: '#E10600',
    bgGlow: 'rgba(225, 6, 0, 0.25)',
    carImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600',
    desc: 'The oldest and most successful active team in Formula One history, representing the absolute passion and heritage of racing.',
    soundWaveColor: 'from-[#E10600] to-[#FF3B30]'
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG Petronas',
    principal: 'Toto Wolff',
    championships: 8,
    color: '#00A19B',
    bgGlow: 'rgba(0, 161, 155, 0.25)',
    carImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
    desc: 'A modern engineering powerhouse, defining efficiency, aerodynamics, and absolute mechanical precision throughout the hybrid era.',
    soundWaveColor: 'from-[#00A19B] to-[#76FF03]'
  },
  {
    id: 'redbull',
    name: 'Oracle Red Bull Racing',
    principal: 'Christian Horner',
    championships: 6,
    color: '#0C2340',
    bgGlow: 'rgba(12, 35, 64, 0.4)',
    carImage: 'https://images.unsplash.com/photo-1560958089-b8a1929ced61?auto=format&fit=crop&q=80&w=600',
    desc: 'Renowned for radical aerodynamic innovations and high-risk strategies that challenge the motorsport establishment.',
    soundWaveColor: 'from-[#001A9C] to-[#FFCC00]'
  },
  {
    id: 'mclaren',
    name: 'McLaren Racing',
    principal: 'Andrea Stella',
    championships: 8,
    color: '#FF8700',
    bgGlow: 'rgba(255, 135, 0, 0.25)',
    carImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=600',
    desc: 'The iconic Papaya brand, merging high-tech development with legacy performance to climb back to the top of the grid.',
    soundWaveColor: 'from-[#FF8700] to-[#FFFFFF]'
  },
  {
    id: 'aston',
    name: 'Aston Martin Aramco',
    principal: 'Mike Krack',
    championships: 0,
    color: '#006643',
    bgGlow: 'rgba(0, 102, 67, 0.25)',
    carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
    desc: 'Fusing British elegance with massive corporate and engineering investments, driving toward world championship contention.',
    soundWaveColor: 'from-[#006643] to-[#C4D600]'
  }
];

const DRIVERS = [
  {
    number: '44',
    name: 'Lewis Hamilton',
    team: 'Ferrari',
    championships: 7,
    nationality: 'GBR',
    flag: '🇬🇧',
    wins: 105,
    podiums: 201,
    poles: 104,
    image: 'https://images.unsplash.com/photo-1552519155-bb978f2c2756?auto=format&fit=crop&q=80&w=600',
    borderGlow: 'rgba(225, 6, 0, 0.4)'
  },
  {
    number: '1',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    championships: 3,
    nationality: 'NED',
    flag: '🇳🇱',
    wins: 62,
    podiums: 111,
    poles: 40,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600',
    borderGlow: 'rgba(0, 26, 156, 0.4)'
  },
  {
    number: '16',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    championships: 0,
    nationality: 'MON',
    flag: '🇲🇨',
    wins: 8,
    podiums: 41,
    poles: 26,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
    borderGlow: 'rgba(225, 6, 0, 0.4)'
  },
  {
    number: '4',
    name: 'Lando Norris',
    team: 'McLaren',
    championships: 0,
    nationality: 'GBR',
    flag: '🇬🇧',
    wins: 3,
    podiums: 25,
    poles: 8,
    image: 'https://images.unsplash.com/photo-1617469167446-8043b44674ad?auto=format&fit=crop&q=80&w=600',
    borderGlow: 'rgba(255, 135, 0, 0.4)'
  },
  {
    number: '14',
    name: 'Fernando Alonso',
    team: 'Aston Martin',
    championships: 2,
    nationality: 'ESP',
    flag: '🇪🇸',
    wins: 32,
    podiums: 106,
    poles: 22,
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
    borderGlow: 'rgba(0, 102, 67, 0.4)'
  }
];

const CIRCUITS = [
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    location: 'Monte Carlo',
    lapRecord: '1:12.909 (Lewis Hamilton, 2021)',
    length: '3.337 km',
    turns: 19,
    description: 'The ultimate test of driver concentration. A tight, historic street circuit where precision is absolute and the margins are zero.',
    svgPath: 'M 50,80 C 40,80 30,75 25,65 C 20,55 25,45 35,40 C 45,35 60,35 70,40 C 80,45 85,55 80,65 C 75,75 60,80 50,80 Z M 35,40 C 35,30 45,20 60,20 C 75,20 85,30 80,45'
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'United Kingdom',
    lapRecord: '1:27.097 (Max Verstappen, 2020)',
    length: '5.891 km',
    turns: 18,
    description: 'The home of British motorsport. Extremely fast and flowing corners like Copse, Maggots, and Becketts test extreme aerodynamic downforce.',
    svgPath: 'M 10,50 L 30,20 L 60,20 L 80,30 L 90,60 L 70,80 L 40,75 L 30,90 Z'
  },
  {
    id: 'suzuka',
    name: 'Suzuka International Circuit',
    location: 'Japan',
    lapRecord: '1:30.983 (Lewis Hamilton, 2019)',
    length: '5.807 km',
    turns: 18,
    description: 'F1\'s only figure-eight circuit. Highly technical, featuring the rapid Degner curves, the challenging spoon corner, and the legendary 130R.',
    svgPath: 'M 10,70 Q 25,20 50,50 Q 75,80 90,30 C 80,10 60,10 50,30 C 40,50 20,50 10,70 Z'
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Belgium',
    lapRecord: '1:46.286 (Valtteri Bottas, 2018)',
    length: '7.004 km',
    turns: 19,
    description: 'Nestled in the Ardennes forest, featuring the iconic Eau Rouge and Raidillon rise. Loved by drivers for its immense elevation changes.',
    svgPath: 'M 10,30 L 40,20 L 70,40 L 90,35 L 85,75 L 60,80 L 30,60 L 15,70 Z'
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Italy',
    lapRecord: '1:21.046 (Rubens Barrichello, 2004)',
    length: '5.793 km',
    turns: 11,
    description: 'The Temple of Speed. Teams run ultra-low downforce wings to maximize top speeds down the massive straights and through the famous Curva Grande.',
    svgPath: 'M 10,50 C 10,20 90,10 90,40 C 90,70 60,80 50,80 C 40,80 10,70 10,50 Z'
  }
];

export default function F1Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive state
  const [selectedCircuit, setSelectedCircuit] = useState(CIRCUITS[0]);
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const [isEnginePlaying, setIsEnginePlaying] = useState(false);
  const [activeTechMetric, setActiveTechMetric] = useState('aero');

  // Stats display triggered by state to simulate count up
  const [statsCounters, setStatsCounters] = useState({ speed: 0, drivers: 0, teams: 0, rounds: 0 });

  // GSAP animation controllers
  useGSAP(
    () => {
      // 1. Hero Reveal Animations
      const heroTl = gsap.timeline();
      heroTl.fromTo(
        '.hero-title-word',
        { opacity: 0, y: 100, rotateX: -30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.15, ease: 'power4.out' }
      );
      heroTl.fromTo(
        '.hero-fade-in',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
      heroTl.fromTo(
        '.hero-speed-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, stagger: 0.1, ease: 'power2.out' },
        '-=1.2'
      );

      // 2. Scroll triggered Stat Counts for About Section
      ScrollTrigger.create({
        trigger: '#about-section',
        start: 'top 70%',
        onEnter: () => {
          // Animate our local numbers
          gsap.to({ val: 0 }, {
            val: 355,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setStatsCounters(prev => ({ ...prev, speed: Math.floor(this.targets()[0].val) }));
            }
          });
          gsap.to({ val: 0 }, {
            val: 20,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              setStatsCounters(prev => ({ ...prev, drivers: Math.floor(this.targets()[0].val) }));
            }
          });
          gsap.to({ val: 0 }, {
            val: 10,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              setStatsCounters(prev => ({ ...prev, teams: Math.floor(this.targets()[0].val) }));
            }
          });
          gsap.to({ val: 0 }, {
            val: 24,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setStatsCounters(prev => ({ ...prev, rounds: Math.floor(this.targets()[0].val) }));
            }
          });
        }
      });

      // Parallax effect on about backgrounds
      gsap.fromTo(
        '.about-parallax-img',
        { y: -50 },
        {
          y: 50,
          scrollTrigger: {
            trigger: '#about-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      // 3. Teams grid animations
      gsap.fromTo(
        '.team-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#teams-section',
            start: 'top 75%'
          }
        }
      );

      // 4. Staggered Entrance Animation for Drivers (All screen sizes, scroll naturally)
      gsap.fromTo(
        '.driver-card',
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#drivers-section',
            start: 'top 75%'
          }
        }
      );

      // 5. Timeline scrubbing indicators
      gsap.fromTo(
        '.timeline-progress-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#timeline-section',
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: true
          }
        }
      );

      // 6. Technology interactive glow and SVG paths
      gsap.fromTo(
        '.tech-glow-panel',
        { opacity: 0.3, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: 'sine.inOut'
        }
      );

      // 7. Circuits reveal
      gsap.fromTo(
        '.circuit-nav-btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '#circuits-section',
            start: 'top 80%'
          }
        }
      );
    },
    { scope: containerRef }
  );

  // Sound generator toggle helper
  const toggleEngineAudio = () => {
    setIsEnginePlaying(!isEnginePlaying);
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#050505] text-white font-sans antialiased overflow-x-hidden relative selection:bg-[#E10600] selection:text-white"
    >
      {/* BACKGROUND NOISE & SPEED LINES GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,6,0,0.07),rgba(255,255,255,0))] pointer-events-none z-1" />
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* HEADER HUD */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black tracking-tighter text-[#E10600] flex items-center gap-1 font-mono">
            F1<span className="text-white text-base font-light tracking-[0.2em] ml-2">CHRONICLES</span>
          </div>
          <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest uppercase">
            Live Telemetry Node
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase text-white/70">
          <a href="#about-section" className="hover:text-white transition-colors">Origins</a>
          <a href="#teams-section" className="hover:text-white transition-colors">Constructors</a>
          <a href="#drivers-section" className="hover:text-white transition-colors">Drivers</a>
          <a href="#timeline-section" className="hover:text-white transition-colors">Timeline</a>
          <a href="#circuits-section" className="hover:text-white transition-colors">Grand Prix</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleEngineAudio}
            className={cx(
              "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2",
              isEnginePlaying 
                ? "bg-[#E10600] border-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]" 
                : "bg-transparent border-white/20 text-white/80 hover:border-white hover:text-white"
            )}
          >
            <Volume2 className={cx("w-3.5 h-3.5", isEnginePlaying && "animate-bounce")} />
            <span>{isEnginePlaying ? 'V10 Engine ON' : 'Ignite Engine'}</span>
          </button>
        </div>
      </header>

      {/* SOUND EFFECTS DRIVER (SYNTHESIZED WEB AUDIO FOR MAXIMUM HIGH TECH PRESTIGE) */}
      {isEnginePlaying && <EngineSoundGenerator />}

      {/* ==========================================
          1. HERO SECTION: Speed Redefined
          ========================================== */}
      <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-black py-20 px-[5vw] z-10">
        {/* Cinematic Backdrop Video/Parallax Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover opacity-35 object-center scale-105 animate-[pulse_8s_infinite_alternate]"
            alt="Formula 1 High Speed Capture"
          />
        </div>

        {/* Speed lines */}
        <div className="absolute right-0 top-1/4 w-[35vw] h-[2px] bg-gradient-to-r from-transparent via-[#E10600]/80 to-transparent origin-left hero-speed-line z-10" />
        <div className="absolute right-10 top-1/3 w-[25vw] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent origin-left hero-speed-line z-10" />
        <div className="absolute right-20 top-1/2 w-[40vw] h-[3px] bg-gradient-to-r from-transparent via-[#E10600]/50 to-transparent origin-left hero-speed-line z-10" />

        <div className="relative z-20 max-w-[90ch] mt-10">
          <div className="hero-fade-in inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E10600]/10 border border-[#E10600]/30 text-[#E10600] text-xs font-black tracking-[0.25em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
            Formula 1 Championship Hub
          </div>

          <h1 className="text-[clamp(3.5rem,8vw,9rem)] leading-[0.9] font-black uppercase tracking-tight flex flex-col font-mono text-left select-none">
            <span className="hero-title-word overflow-hidden inline-block text-white">SPEED</span>
            <span className="hero-title-word overflow-hidden inline-block text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.3)]">REDEFINED</span>
          </h1>

          <p className="hero-fade-in mt-8 text-[clamp(1.1rem,1.8vw,1.8rem)] font-light leading-relaxed text-white/80 max-w-[45ch]">
            Experience the thrill, precision, and engineering dominance behind the fastest sports category in human history.
          </p>

          <div className="hero-fade-in mt-10 flex flex-wrap gap-4">
            <a
              href="#about-section"
              className="px-8 py-4 bg-[#E10600] hover:bg-[#c90500] text-white font-bold uppercase tracking-wider rounded border border-[#E10600] transition-all hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(225,6,0,0.6)] flex items-center gap-2 group"
            >
              <span>Explore The Grid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
            <a
              href="#circuits-section"
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold uppercase tracking-wider rounded border border-white/20 hover:border-white transition-all flex items-center gap-2"
            >
              <span>Watch Telemetry</span>
            </a>
          </div>
        </div>

        {/* Speed Data Strip bottom */}
        <div className="absolute bottom-10 left-[5vw] right-[5vw] z-20 flex flex-wrap justify-between items-center gap-6 py-4 border-t border-white/10 text-xs font-mono tracking-widest text-white/40">
          <div className="flex gap-8">
            <span>RPM: 15,200 MAX</span>
            <span>CHASSIS: CARBON FIBER MONOCOQUE</span>
            <span>ENGINES: 1.6L V6 TURBO HYBRID</span>
          </div>
          <div className="flex gap-4 items-center text-[#E10600] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
            <span>GRID SYNCHRONIZATION: ONLINE</span>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. ABOUT FORMULA 1: The Pinnacle of Motorsport
          ========================================== */}
      <section
        id="about-section"
        className="relative py-32 px-[5vw] bg-[#090909] border-t border-white/5 overflow-hidden z-10"
      >
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover object-center about-parallax-img"
            alt="F1 Track curve"
          />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E10600]">
              <CircleDot className="w-4 h-4" />
              <span>THE SUPREME CATEGORY</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight font-mono leading-none">
              THE PINNACLE OF<br /><span className="text-white/60">MOTORSPORT</span>
            </h2>
            <div className="w-20 h-1 bg-[#E10600]" />
            <p className="text-lg leading-relaxed text-white/70 font-light">
              Formula One is not simply a race of cars. It is the ultimate manifestation of human ambition, aerodynamic engineering, strategy execution, and reflex speed. 
            </p>
            <p className="text-base leading-relaxed text-white/60 font-light">
              Ten constructors field two drivers each, racing around highly complex permanent racetracks and high-speed temporary street courses at over 300 km/h. Powered by highly advanced hybrid turbo engines and regulated by active drag reduction system (DRS) aerodynamics, these systems are pushed to absolute extremes.
            </p>
          </div>

          {/* Stats Display grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 p-6 rounded relative overflow-hidden group hover:border-[#E10600]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.1),transparent)] pointer-events-none" />
              <Gauge className="w-6 h-6 text-[#E10600] mb-4" />
              <div className="text-4xl font-black font-mono tracking-tight text-white mb-1">
                {statsCounters.speed === 0 ? '350+' : `${statsCounters.speed}`} <span className="text-xs text-[#E10600]">KM/H</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Top Racing Pace</div>
            </div>

            <div className="bg-black/40 border border-white/5 p-6 rounded relative overflow-hidden group hover:border-[#E10600]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.1),transparent)] pointer-events-none" />
              <Users className="w-6 h-6 text-[#E10600] mb-4" />
              <div className="text-4xl font-black font-mono tracking-tight text-white mb-1">
                {statsCounters.drivers === 0 ? '20' : `${statsCounters.drivers}`}
              </div>
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Elite World Drivers</div>
            </div>

            <div className="bg-black/40 border border-white/5 p-6 rounded relative overflow-hidden group hover:border-[#E10600]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.1),transparent)] pointer-events-none" />
              <Trophy className="w-6 h-6 text-[#E10600] mb-4" />
              <div className="text-4xl font-black font-mono tracking-tight text-white mb-1">
                {statsCounters.teams === 0 ? '10' : `${statsCounters.teams}`}
              </div>
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Constructors teams</div>
            </div>

            <div className="bg-black/40 border border-white/5 p-6 rounded relative overflow-hidden group hover:border-[#E10600]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.1),transparent)] pointer-events-none" />
              <Activity className="w-6 h-6 text-[#E10600] mb-4" />
              <div className="text-4xl font-black font-mono tracking-tight text-white mb-1">
                {statsCounters.rounds === 0 ? '24' : `${statsCounters.rounds}`}
              </div>
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">Global Circuits</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. LEGENDARY TEAMS
          ========================================== */}
      <section id="teams-section" className="py-32 px-[5vw] bg-black border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto mb-16 text-center md:text-left">
          <span className="text-[#E10600] text-xs font-bold uppercase tracking-[0.25em] block mb-3">World Class Constructors</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono">
            LEGENDARY TEAMS
          </h2>
          <div className="w-20 h-1 bg-[#E10600] mt-4 mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              className="team-card bg-[#111] border border-white/5 rounded-lg overflow-hidden relative group transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between"
              style={{
                boxShadow: `0 0 0px transparent`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 10px 30px ${team.bgGlow}`;
                e.currentTarget.style.borderColor = team.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              {/* Image & overlay */}
              <div className="relative h-44 overflow-hidden bg-black">
                <img
                  src={team.carImage}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={`${team.name} Car`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div
                  className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: team.color }}
                />
              </div>

              {/* Contents */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black font-mono tracking-tight text-white group-hover:text-[#E10600] transition-colors uppercase leading-none">
                    {team.name}
                  </h3>
                  <p className="text-xs text-white/50 font-mono mt-1 mb-4">Principal: {team.principal}</p>
                  <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-3">
                    {team.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-white">
                    <Trophy className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>{team.championships} Titles</span>
                  </div>
                  
                  {/* Dynamic sound wave micro-animation */}
                  <div className="flex items-end gap-0.5 h-4">
                    <div className={cx("w-[2px] h-2 bg-gradient-to-t rounded-full group-hover:animate-[bounce_0.8s_infinite]", team.soundWaveColor)} />
                    <div className={cx("w-[2px] h-3 bg-gradient-to-t rounded-full group-hover:animate-[bounce_0.6s_infinite_0.1s]", team.soundWaveColor)} />
                    <div className={cx("w-[2px] h-1.5 bg-gradient-to-t rounded-full group-hover:animate-[bounce_0.7s_infinite_0.2s]", team.soundWaveColor)} />
                    <div className={cx("w-[2px] h-3.5 bg-gradient-to-t rounded-full group-hover:animate-[bounce_0.5s_infinite_0.15s]", team.soundWaveColor)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. FAMOUS DRIVERS SECTION
          ========================================== */}
      <section
        id="drivers-section"
        className="py-32 bg-[#090909] border-t border-white/5 overflow-hidden relative z-10"
      >
        <div className="px-[5vw] mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
          <div>
            <span className="text-[#E10600] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Precision Controls</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono">
              ELITE RACERS
            </h2>
            <div className="w-20 h-1 bg-[#E10600] mt-4" />
          </div>
          <p className="text-white/60 font-light max-w-[40ch] text-sm leading-relaxed">
            Meet the 20 exceptional athletes who operate these terrestrial rockets. Operating under immense G-forces, they execute split-second maneuvers.
          </p>
        </div>

        {/* Drivers wrapper with responsive grid layout */}
        <div className="drivers-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 px-[5vw] max-w-7xl mx-auto overflow-y-visible">
          {DRIVERS.map((driver) => (
            <div
              key={driver.number}
              className="driver-card w-full bg-black border border-white/5 rounded-xl overflow-hidden relative group transition-all duration-300 hover:border-white/20"
              style={{
                boxShadow: `0 0 0px transparent`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 10px 40px ${driver.borderGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              {/* Driver Image */}
              <img
                src={driver.image}
                className="w-full h-[360px] sm:h-[400px] xl:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
                alt={driver.name}
              />

              {/* Driver massive background number */}
              <div className="absolute top-4 right-4 text-9xl font-black font-mono tracking-tighter opacity-15 text-white select-none">
                {driver.number}
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{driver.flag}</span>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#E10600] bg-[#E10600]/10 border border-[#E10600]/30 px-2.5 py-0.5 rounded uppercase">
                    {driver.team}
                  </span>
                </div>

                <h3 className="text-2xl font-black font-mono uppercase tracking-tight text-white leading-none">
                  {driver.name}
                </h3>
                <p className="text-[10px] text-white/50 tracking-widest uppercase font-mono mt-1 mb-4">Driver No. {driver.number}</p>

                {/* Micro statistics display */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center font-mono">
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{driver.championships}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Titles</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{driver.wins}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Wins</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{driver.podiums}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Podiums</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. RACE WEEKEND EXPERIENCE
          ========================================== */}
      <section id="timeline-section" className="py-32 px-[5vw] bg-black border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Header left */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <span className="text-[#E10600] text-xs font-bold uppercase tracking-[0.25em] block">CHAMPIONSHIP ANATOMY</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono leading-none">
              THE RACE WEEKEND
            </h2>
            <div className="w-20 h-1 bg-[#E10600]" />
            <p className="text-white/70 font-light leading-relaxed">
              Formula One racing is a highly structured multi-day strategic tournament. Every millisecond of track time counts, from testing tyre compounds to setting pole position.
            </p>

            {/* Quick interactive Selector */}
            <div className="flex flex-col gap-2 mt-8 font-mono">
              {['01 — PRACTICE SESSIONS', '02 — QUALIFYING PACE', '03 — GRID RACE DAY', '04 — PODIUM CELEBRATION'].map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTimelineStep(idx)}
                  className={cx(
                    "text-left py-3 px-4 border-l-2 transition-all text-xs font-bold tracking-wider",
                    activeTimelineStep === idx
                      ? "border-[#E10600] bg-white/5 text-white font-black"
                      : "border-white/10 hover:border-white/30 text-white/50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive timeline contents right */}
          <div className="lg:col-span-7 relative pl-8 md:pl-16">
            
            {/* Background vertical progress bar */}
            <div className="absolute left-4 top-0 w-[2px] h-full bg-white/10">
              <div className="w-full h-full bg-[#E10600] scale-y-0 origin-top timeline-progress-line" />
            </div>

            <div className="space-y-16">
              {/* Step 1: Practice */}
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[62px] top-6 w-5 h-5 rounded-full bg-black border-4 border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.8)] z-10" />
                <div 
                  className={cx(
                    "transition-all duration-500 p-6 rounded-xl border",
                    activeTimelineStep === 0 
                      ? "opacity-100 scale-100 bg-white/[0.03] border-[#E10600]/30 shadow-[0_0_20px_rgba(225,6,0,0.08)]" 
                      : "opacity-65 scale-[0.99] border-transparent hover:opacity-85"
                  )}
                >
                  <h3 className="text-2xl font-black font-mono uppercase tracking-tight text-white mb-4">
                    01 — Practice (FP1, FP2, FP3)
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed mb-6">
                    Spread over Friday and Saturday morning, teams deploy cars onto the track to clean the racing line, calibrate balance sensors, and measure rubber degradation.
                  </p>
                  <div className="bg-[#111]/60 border border-white/5 rounded p-6 font-mono text-xs text-white/50 space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Session Duration</span>
                      <span>3 x 60 Minutes</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Primary Focus</span>
                      <span>Tyre degradation & data logging</span>
                    </div>
                    <div>
                      <span className="text-white font-bold block mb-2">Weekend Compounds:</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-500 border border-red-500/30">SOFT (C5)</span>
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">MEDIUM (C4)</span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/20">HARD (C3)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Qualifying */}
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[62px] top-6 w-5 h-5 rounded-full bg-black border-4 border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.8)] z-10" />
                <div 
                  className={cx(
                    "transition-all duration-500 p-6 rounded-xl border",
                    activeTimelineStep === 1 
                      ? "opacity-100 scale-100 bg-white/[0.03] border-[#E10600]/30 shadow-[0_0_20px_rgba(225,6,0,0.08)]" 
                      : "opacity-65 scale-[0.99] border-transparent hover:opacity-85"
                  )}
                >
                  <h3 className="text-2xl font-black font-mono uppercase tracking-tight text-white mb-4">
                    02 — Qualifying Knockouts (Q1, Q2, Q3)
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed mb-6">
                    The ultimate single-lap shootout. Speed is optimized with empty fuel loads. The slowest cars are discarded in three progressive sessions until the final 10 battle for the crucial pole position.
                  </p>
                  <div className="bg-[#111]/60 border border-white/5 rounded p-6 font-mono text-xs text-white/50 space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Knockout Q1</span>
                      <span>Slowest 5 drivers eliminated (18 Mins)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Knockout Q2</span>
                      <span>Slowest 5 drivers eliminated (15 Mins)</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-white font-bold">Final Shootout Q3</span>
                      <span>Top 10 battle for Pole Position (12 Mins)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Race Day */}
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[62px] top-6 w-5 h-5 rounded-full bg-black border-4 border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.8)] z-10" />
                <div 
                  className={cx(
                    "transition-all duration-500 p-6 rounded-xl border",
                    activeTimelineStep === 2 
                      ? "opacity-100 scale-100 bg-white/[0.03] border-[#E10600]/30 shadow-[0_0_20px_rgba(225,6,0,0.08)]" 
                      : "opacity-65 scale-[0.99] border-transparent hover:opacity-85"
                  )}
                >
                  <h3 className="text-2xl font-black font-mono uppercase tracking-tight text-white mb-4">
                    03 — Grid Race Day
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed mb-6">
                    Lights out, and away we go! A 305km strategic chess match featuring high-speed overtaking, live dynamic pitstop execution, and tyre life management.
                  </p>
                  <div className="bg-[#111]/60 border border-white/5 rounded p-6 font-mono text-xs text-white/50 space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Mandatory Pitstop</span>
                      <span>At least 1 change of compound required</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white font-bold">Full Race Distance</span>
                      <span>305 km + 1 Lap</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Championship Points</span>
                      <span>Awarded down to 10th Place (25 points for 1st)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Celebration */}
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[62px] top-6 w-5 h-5 rounded-full bg-black border-4 border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.8)] z-10" />
                <div 
                  className={cx(
                    "transition-all duration-500 p-6 rounded-xl border",
                    activeTimelineStep === 3 
                      ? "opacity-100 scale-100 bg-white/[0.03] border-[#E10600]/30 shadow-[0_0_20px_rgba(225,6,0,0.08)]" 
                      : "opacity-65 scale-[0.99] border-transparent hover:opacity-85"
                  )}
                >
                  <h3 className="text-2xl font-black font-mono uppercase tracking-tight text-white mb-4">
                    04 — Podium Celebration
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed mb-6">
                    The crowning achievement of motorsport. The top three finishing drivers and the winning team's engineer celebrate on the podium under historical national anthems.
                  </p>
                  <div className="bg-[#111]/60 border border-white/5 rounded p-6 font-mono text-xs text-white/50 space-y-2">
                    <span className="text-white font-bold block mb-2">Rewards:</span>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Constructors trophy awarded to representative engineer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-slate-300" />
                      <span>Top 3 drivers awarded championship cups</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TECHNOLOGY & INNOVATION
          ========================================== */}
      <section className="py-32 px-[5vw] bg-[#090909] border-t border-white/5 overflow-hidden relative z-10">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <span className="text-[#E10600] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Futuristic HUD Panel</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono">
            TECHNOLOGY & INNOVATION
          </h2>
          <div className="w-20 h-1 bg-[#E10600] mt-4 mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* HUD Sidebar Selector Left */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {[
                { id: 'aero', title: 'Aerodynamics & Wings', icon: Wind, text: 'Advanced wind-tunnel tested vortex structures. Rear and front wings compress airflow to generate tons of physical downward load.' },
                { id: 'hybrid', title: 'MGU Hybrid Core', icon: Cpu, text: 'Integrated MGU-K and MGU-H kinetic heat recovery loops extracting over 1000 total horsepower from internal turbo engines.' },
                { id: 'drs', title: 'DRS Dynamic Flaps', icon: Zap, text: 'Active Drag Reduction flap on rear wing. Opens on key straights to decrease aerodynamic drag and boost top speed by 10-12 km/h.' },
                { id: 'pit', title: 'Precision Pitstop Core', icon: RefreshCw, text: 'Perfect sub-2 second wheel replacement mechanics. Requires 20 mechanics working in flawless physical synchronization.' }
              ].map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setActiveTechMetric(tech.id)}
                  className={cx(
                    "w-full text-left p-5 rounded-lg border transition-all relative overflow-hidden flex items-start gap-4",
                    activeTechMetric === tech.id
                      ? "bg-black border-[#E10600] shadow-[0_0_15px_rgba(225,6,0,0.15)] text-white"
                      : "bg-black/30 border-white/5 hover:border-white/20 text-white/60"
                  )}
                >
                  <tech.icon className={cx("w-5 h-5 mt-0.5", activeTechMetric === tech.id ? "text-[#E10600]" : "text-white/40")} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide font-mono">{tech.title}</h4>
                    {activeTechMetric === tech.id && (
                      <p className="text-xs font-light text-white/70 leading-relaxed mt-2 animate-in fade-in duration-300">
                        {tech.text}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick static metrics data */}
            <div className="bg-[#111]/30 border border-white/5 rounded-lg p-5 font-mono text-xs text-white/50 space-y-2">
              <span className="text-[#E10600] font-bold block mb-1">METER READING LOGS</span>
              <div>ENG ENERGY STATUS: <span className="text-white">STORED H2O (98.4%)</span></div>
              <div>TIRE RADIAL TEMP: <span className="text-white">104.5 °C (OPTIMAL)</span></div>
              <div>G-FORCE RATING: <span className="text-white">5.8 G CORNER MAX</span></div>
            </div>
          </div>

          {/* Interactive telemetry SVG chart center/right */}
          <div className="lg:col-span-8 bg-black border border-white/5 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden tech-glow-panel">
            {/* Futuristic HUD grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.05),transparent)] pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#E10600]">
                  Live Throttle vs Speed Telemetry Chart
                </h3>
              </div>
              <span className="text-[10px] font-mono text-white/30">MONITOR NODE: V3-AERO</span>
            </div>

            {/* Simulated interactive telemetry chart using custom anim SVG */}
            <div className="flex-grow flex items-center justify-center min-h-[300px] relative z-10 border border-white/5 rounded bg-black/60 p-4">
              <svg className="w-full h-full max-h-[320px] overflow-visible" viewBox="0 0 600 300">
                {/* Chart Grid Lines */}
                <line x1="50" y1="50" x2="550" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                <line x1="50" y1="125" x2="550" y2="125" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                <line x1="50" y1="275" x2="550" y2="275" stroke="rgba(255,255,255,0.1)" />

                <line x1="150" y1="50" x2="150" y2="275" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                <line x1="280" y1="50" x2="280" y2="275" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                <line x1="420" y1="50" x2="420" y2="275" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

                {/* Plot 1: SPEED (Red curve) */}
                <path
                  d="M 50,220 C 120,200 180,80 250,90 C 320,100 380,240 450,220 C 500,200 520,60 550,50"
                  fill="transparent"
                  stroke="#E10600"
                  strokeWidth="3.5"
                  className="animate-[dash_6s_linear_infinite]"
                  style={{
                    strokeDasharray: '1000',
                    strokeDashoffset: '0'
                  }}
                />

                {/* Plot 2: THROTTLE (Cyan curve) */}
                <path
                  d="M 50,270 C 100,270 140,50 200,50 C 260,50 280,270 350,270 C 420,270 460,50 550,50"
                  fill="transparent"
                  stroke="#00A19B"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />

                {/* Plot Dot Indicator */}
                <circle cx="250" cy="90" r="5" fill="#E10600" className="animate-ping" />
                <circle cx="250" cy="90" r="3" fill="#E10600" />

                {/* Legend axes */}
                <text x="55" y="45" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">SPEED: 320 KM/H</text>
                <text x="255" y="85" fill="#E10600" fontSize="9" fontFamily="monospace" fontWeight="bold">APEX POINT (5.2G)</text>
                <text x="55" y="292" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">STEERING DELTA: -2.4°</text>
              </svg>
            </div>

            {/* Bottom active panels info */}
            <div className="mt-6 flex justify-between items-center gap-4 relative z-10 font-mono text-xs">
              <div className="flex gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E10600]" />
                  <span className="text-white/70">SPEED (RED)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A19B]" />
                  <span className="text-white/70">THROTTLE % (CYAN)</span>
                </div>
              </div>
              <button 
                onClick={() => alert("Simulated High Speed telemetry synced successfully!")}
                className="px-3 py-1 bg-white/5 hover:bg-[#E10600] border border-white/10 hover:border-[#E10600] rounded text-white transition-all uppercase tracking-wider text-[10px] font-bold"
              >
                Sync Nodes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. GLOBAL CIRCUITS
          ========================================== */}
      <section id="circuits-section" className="py-32 px-[5vw] bg-black border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <span className="text-[#E10600] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Championship Map</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono">
            GLOBAL CIRCUITS
          </h2>
          <div className="w-20 h-1 bg-[#E10600] mt-4 mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Circuit selection button panel left */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <span className="font-mono text-xs text-[#E10600] font-bold tracking-widest mb-2 block uppercase">Select Grand Prix Location</span>
            
            {CIRCUITS.map((circuit) => (
              <button
                key={circuit.id}
                onClick={() => setSelectedCircuit(circuit)}
                className={cx(
                  "circuit-nav-btn text-left p-4 border rounded transition-all duration-300 flex items-center justify-between",
                  selectedCircuit.id === circuit.id
                    ? "bg-white/5 border-[#E10600] text-white"
                    : "bg-transparent border-white/5 hover:border-white/20 text-white/50"
                )}
              >
                <div>
                  <h4 className="font-black font-mono tracking-tight uppercase leading-none">{circuit.name}</h4>
                  <span className="text-[10px] text-white/40 tracking-wider font-mono mt-1 block">{circuit.location}</span>
                </div>
                <ChevronRight className={cx("w-4 h-4 transition-transform", selectedCircuit.id === circuit.id ? "translate-x-1 text-[#E10600]" : "text-white/20")} />
              </button>
            ))}
          </div>

          {/* Interactive display panel right */}
          <div className="lg:col-span-7 bg-[#111]/30 border border-white/5 p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Visual background track elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.03),transparent)] pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-6">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-[#E10600] bg-[#E10600]/15 px-2 py-0.5 rounded border border-[#E10600]/30 mb-3 uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>Grand Prix Circuit</span>
                </span>
                <h3 className="text-3xl font-black font-mono uppercase tracking-tight text-white leading-none">
                  {selectedCircuit.name}
                </h3>
                <p className="text-xs text-white/50 tracking-wider font-mono mt-1">{selectedCircuit.location}</p>
              </div>
            </div>

            {/* Display of animated Track SVG line */}
            <div className="relative z-10 flex-grow flex items-center justify-center my-8 min-h-[220px]">
              <svg className="w-full max-w-[280px] h-[220px] text-white/30" viewBox="0 0 100 100">
                <path
                  d={selectedCircuit.svgPath}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d={selectedCircuit.svgPath}
                  fill="transparent"
                  stroke="#E10600"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-[dash_5s_linear_infinite]"
                  style={{
                    strokeDasharray: '300',
                    strokeDashoffset: '0',
                    filter: 'drop-shadow(0px 0px 5px rgba(225, 6, 0, 0.8))'
                  }}
                />
              </svg>
              <div className="absolute bottom-2 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                Active Map Track Synchronization
              </div>
            </div>

            {/* Track specifications footer */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 font-mono text-xs">
              <div>
                <span className="text-white/40 block uppercase tracking-widest mb-1">Lap Record</span>
                <span className="text-white font-bold block">{selectedCircuit.lapRecord}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase tracking-widest mb-1">Track Distance</span>
                <span className="text-white font-bold block">{selectedCircuit.length}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase tracking-widest mb-1">Apex Corners</span>
                <span className="text-white font-bold block">{selectedCircuit.turns} Turns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FINAL CTA: Join The Race
          ========================================== */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden bg-black py-20 px-[5vw] z-10">
        
        {/* Background fast motion particle layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.05),transparent)] z-10" />
        <div className="absolute inset-0 z-5">
          <img
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-20 object-center filter grayscale blur-sm"
            alt="Accelerating racing visuals"
          />
        </div>

        {/* Speed perspective guides */}
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-[#E10600]/30 to-transparent rotate-12 origin-top" />
        <div className="absolute right-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-[#E10600]/30 to-transparent -rotate-12 origin-top" />

        <div className="relative z-20 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E10600]/10 border border-[#E10600]/30 text-[#E10600] text-xs font-black tracking-[0.25em] uppercase mb-4 mx-auto">
            <span>GET IN THE COCKPIT</span>
          </div>

          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black leading-none uppercase tracking-tight font-mono text-white">
            FEEL THE<br /><span className="text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.4)]">ADRENALINE</span>
          </h2>

          <p className="text-white/70 max-w-[50ch] mx-auto text-[clamp(1rem,1.5vw,1.4rem)] font-light leading-relaxed">
            There is no substitution for horsepower, G-forces, and split-second strategic mastery. Enter the legendary world of Formula 1.
          </p>

          <div className="pt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => alert("Access granted! Watch Live node synchronization complete.")}
              className="px-8 py-4 bg-[#E10600] hover:bg-[#c90500] text-white font-bold uppercase tracking-wider rounded border border-[#E10600] transition-all hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(225,6,0,0.6)] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Live GP</span>
            </button>
            <a
              href="#teams-section"
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold uppercase tracking-wider rounded border border-white/20 hover:border-white transition-all"
            >
              <span>Explore Teams</span>
            </a>
            <a
              href="#circuits-section"
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold uppercase tracking-wider rounded border border-white/20 hover:border-white transition-all"
            >
              <span>Upcoming Races</span>
            </a>
          </div>
        </div>

        {/* Dashboard specifications bottom strip */}
        <div className="absolute bottom-10 left-[5vw] right-[5vw] z-20 flex justify-between items-center text-[10px] font-mono text-white/30 border-t border-white/5 pt-6 w-[90vw]">
          <span>© 2026 F1 CHRONICLES INC. ALL RIGHTS RESERVED.</span>
          <span>SYSTEM ACCELERATOR V2.05-GRID</span>
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------
// SYNTHESIZED AUDIO CONTROLLER FOR MAXIMUM WOW-FACTOR
// --------------------------------------------------
function EngineSoundGenerator() {
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let filter: BiquadFilterNode | null = null;
    let gainNode: GainNode | null = null;
    let isDestroyed = false;

    try {
      // Create synthesis nodes
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      audioCtx = new AudioCtxClass();

      // V10 Engine Sound Synthesis (A combination of Sawtooth oscillator and low-pass filter modulated by frequency)
      oscillator = audioCtx.createOscillator();
      filter = audioCtx.createBiquadFilter();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(65, audioCtx.currentTime); // Deep idle rumble base freq

      // Filter to emulate exhaust muffler warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

      // Deep rumble volume
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

      // Connect nodes
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();

      // Set up random RPM throttle revving loop
      const revLoop = () => {
        if (isDestroyed || !audioCtx || !oscillator || !filter) return;
        
        const now = audioCtx.currentTime;
        const targetFreq = 50 + Math.random() * 160; // Rev frequency oscillation
        const duration = 0.5 + Math.random() * 1.5; // Rev timing

        oscillator.frequency.exponentialRampToValueAtTime(targetFreq, now + duration);
        filter.frequency.exponentialRampToValueAtTime(targetFreq * 2.5, now + duration);
        
        setTimeout(revLoop, duration * 1000);
      };

      revLoop();
    } catch (err) {
      console.warn("Web Audio API is blocked or not supported on this device:", err);
    }

    return () => {
      isDestroyed = true;
      try {
        if (oscillator) {
          oscillator.stop();
          oscillator.disconnect();
        }
        if (filter) filter.disconnect();
        if (gainNode) gainNode.disconnect();
        if (audioCtx) audioCtx.close();
      } catch (e) {
        // Safe tear down
      }
    };
  }, []);

  return null;
}
