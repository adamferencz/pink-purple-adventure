/**
 * ============================================================================
 * PINK & PURPLE ADVENTURE 🌸💜
 * Kompletní 2D plošinovka s AI přítelkyní a okurkovými power-upy
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API bez externích souborů) ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.bgmPlaying = false;
      this.bgmOscs = [];
      this.bgmTimer = null;
      this.bgmStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      if (!this.enabled && this.bgmPlaying) {
        this.stopBGM();
      } else if (this.enabled && !this.bgmPlaying) {
        this.startBGM();
      }
      return this.enabled;
    }

    playJump() {
      if (!this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }

    playCoin() {
      if (!this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987, t);
      osc.frequency.setValueAtTime(1318, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }

    playStomp() {
      if (!this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    playPowerup() {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    }

    playHurt() {
      if (!this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(70, t + 0.25);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }

    playAffectionChime() {
      if (!this.enabled || !this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const t = this.ctx.currentTime + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    }

    playWin() {
      if (!this.enabled || !this.ctx) return;
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.4 },
        { f: 880.0, d: 0.2 },
        { f: 1046.5, d: 0.6 }
      ];
      let offset = 0;
      melody.forEach(item => {
        const t = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + item.d);
        offset += item.d * 0.85;
      });
    }

    startBGM() {
      if (!this.enabled || !this.ctx || this.bgmPlaying) return;
      this.bgmPlaying = true;
      const bassline = [130.81, 164.81, 196.00, 220.00, 174.61, 196.00, 220.00, 246.94];
      const melody = [523.25, 0, 659.25, 783.99, 659.25, 0, 880.00, 783.99];

      this.bgmTimer = setInterval(() => {
        if (!this.bgmPlaying || !this.enabled || !this.ctx) return;
        const t = this.ctx.currentTime;
        const bFreq = bassline[this.bgmStep % bassline.length];
        const mFreq = melody[this.bgmStep % melody.length];

        // Bass
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bFreq, t);
        bGain.gain.setValueAtTime(0.08, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(t);
        bOsc.stop(t + 0.22);

        // Melody note
        if (mFreq > 0) {
          const mOsc = this.ctx.createOscillator();
          const mGain = this.ctx.createGain();
          mOsc.type = 'sine';
          mOsc.frequency.setValueAtTime(mFreq, t);
          mGain.gain.setValueAtTime(0.05, t);
          mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          mOsc.connect(mGain);
          mGain.connect(this.ctx.destination);
          mOsc.start(t);
          mOsc.stop(t + 0.2);
        }

        this.bgmStep++;
      }, 240);
    }

    stopBGM() {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  // --- PARTICLE SYSTEM ---
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.floatingTexts = [];
    }

    emit(x, y, color, count = 8, speed = 2.5, shape = 'circle') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = (0.5 + Math.random()) * speed;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 0.5,
          color,
          size: 2 + Math.random() * 4,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.03,
          shape
        });
      }
    }

    emitHearts(x, y, count = 5) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 10 - 5),
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1.5 - Math.random() * 1.5,
          color: '#ff4b91',
          size: 10 + Math.random() * 6,
          life: 1.0,
          decay: 0.015,
          shape: 'heart'
        });
      }
    }

    addText(text, x, y, color = '#ffd700') {
      this.floatingTexts.push({
        text,
        x,
        y,
        vy: -1.2,
        alpha: 1.0,
        color
      });
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.shape !== 'heart') {
          p.vy += 0.08; // jemná gravitace
        }
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.018;
        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    draw(ctx, camX, camY) {
      ctx.save();
      // Particles
      for (const p of this.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          ctx.font = `${Math.floor(p.size)}px sans-serif`;
          ctx.fillText('💖', p.x - camX, p.y - camY);
        } else if (p.shape === 'star') {
          ctx.font = `${Math.floor(p.size * 2)}px sans-serif`;
          ctx.fillText('✨', p.x - camX, p.y - camY);
        } else {
          ctx.beginPath();
          ctx.arc(p.x - camX, p.y - camY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Floating Texts
      for (const ft of this.floatingTexts) {
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 15px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#2e0249';
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x - camX, ft.y - camY);
        ctx.fillText(ft.text, ft.x - camX, ft.y - camY);
      }
      ctx.restore();
    }
  }

  // --- DEFINICE ÚROVNÍ (3 KOMPLETNÍ HRATELNÉ MAPY) ---
  const LEVEL_DATA = [
    // Úroveň 1: Neonová Louka (úvod do hry, mince, 1 nepřítel, Lili, zelená okurka, cíl)
    {
      name: "1. Neonová louka",
      theme: "meadow",
      width: 2400,
      height: 600,
      spawn: { x: 80, y: 380 },
      platforms: [
        // Hlavní země
        { x: 0, y: 480, w: 700, h: 120, type: 'solid' },
        { x: 820, y: 480, w: 800, h: 120, type: 'solid' },
        { x: 1720, y: 480, w: 700, h: 120, type: 'solid' },

        // Vyvýšené platformy
        { x: 260, y: 370, w: 140, h: 24, type: 'solid' },
        { x: 440, y: 290, w: 160, h: 24, type: 'solid' },
        
        // Překážka nad mezerou
        { x: 720, y: 380, w: 90, h: 24, type: 'solid' },

        // Cesta v druhé části
        { x: 960, y: 380, w: 130, h: 24, type: 'solid' },
        { x: 1160, y: 310, w: 140, h: 24, type: 'solid' },
        { x: 1370, y: 240, w: 150, h: 24, type: 'solid' },

        // Platforma pro Lili
        { x: 1040, y: 480, w: 0, h: 0 }, // pozice marker

        // Závěrečný most
        { x: 1600, y: 390, w: 110, h: 24, type: 'solid' },
        { x: 1880, y: 380, w: 140, h: 24, type: 'solid' },
        { x: 2080, y: 310, w: 160, h: 24, type: 'solid' }
      ],
      coins: [
        { x: 290, y: 320 }, { x: 330, y: 320 },
        { x: 480, y: 240 }, { x: 520, y: 240 }, { x: 560, y: 240 },
        { x: 760, y: 330 },
        { x: 1000, y: 330 }, { x: 1040, y: 330 },
        { x: 1210, y: 260 }, { x: 1420, y: 190 },
        { x: 1930, y: 330 }, { x: 2130, y: 260 }, { x: 2170, y: 260 }
      ],
      pickles: [
        { x: 500, y: 230, type: 'green' } // Zelená okurka: Super Skok
      ],
      enemies: [
        { x: 1200, y: 440, minX: 1100, maxX: 1450, speed: 1.2 },
        { x: 1850, y: 440, minX: 1780, maxX: 2000, speed: 1.4 }
      ],
      npc: { x: 920, y: 436 },
      goal: { x: 2280, y: 410 }
    },

    // Úroveň 2: Křišťálové Jeskyně (plovoucí ostrůvky, pohyblivé plošiny, zlatá okurka)
    {
      name: "2. Křišťálové jeskyně",
      theme: "cavern",
      width: 2800,
      height: 600,
      spawn: { x: 80, y: 380 },
      platforms: [
        { x: 0, y: 480, w: 450, h: 120, type: 'solid' },
        { x: 520, y: 420, w: 120, h: 24, type: 'solid' },
        { x: 720, y: 350, w: 130, h: 24, type: 'solid' },
        
        // Pohyblivá plošina
        { x: 920, y: 320, w: 110, h: 24, type: 'moving', minX: 900, maxX: 1150, vx: 1.5, vy: 0 },

        { x: 1220, y: 380, w: 320, h: 120, type: 'solid' },
        
        // Jeskynní sloupy
        { x: 1600, y: 440, w: 100, h: 24, type: 'solid' },
        { x: 1770, y: 370, w: 100, h: 24, type: 'solid' },
        { x: 1940, y: 300, w: 110, h: 24, type: 'solid' },
        
        // Vertikální plošina
        { x: 2120, y: 360, w: 110, h: 24, type: 'moving', minY: 240, maxY: 420, vx: 0, vy: 1.2 },

        { x: 2300, y: 480, w: 500, h: 120, type: 'solid' }
      ],
      coins: [
        { x: 560, y: 370 }, { x: 760, y: 300 },
        { x: 1280, y: 330 }, { x: 1340, y: 330 }, { x: 1400, y: 330 },
        { x: 1640, y: 390 }, { x: 1810, y: 320 }, { x: 1980, y: 250 },
        { x: 2400, y: 430 }, { x: 2460, y: 430 }, { x: 2520, y: 430 }
      ],
      pickles: [
        { x: 760, y: 290, type: 'gold' } // Zlatá okurka: Nezranitelnost
      ],
      enemies: [
        { x: 280, y: 440, minX: 200, maxX: 420, speed: 1.4 },
        { x: 1350, y: 340, minX: 1240, maxX: 1500, speed: 1.6 },
        { x: 2450, y: 440, minX: 2350, maxX: 2600, speed: 1.8 }
      ],
      npc: { x: 1460, y: 336 },
      goal: { x: 2680, y: 410 }
    },

    // Úroveň 3: Růžová Citadela (velké výzvy, růžová turbo okurka, strážci, vítězný portál)
    {
      name: "3. Růžová citadela",
      theme: "citadel",
      width: 3200,
      height: 600,
      spawn: { x: 80, y: 400 },
      platforms: [
        { x: 0, y: 480, w: 400, h: 120, type: 'solid' },
        { x: 470, y: 410, w: 100, h: 24, type: 'solid' },
        { x: 640, y: 330, w: 120, h: 24, type: 'solid' },

        // Série vyžadující rychlost
        { x: 830, y: 330, w: 250, h: 24, type: 'solid' },
        { x: 1150, y: 330, w: 110, h: 24, type: 'solid' },
        
        { x: 1340, y: 440, w: 350, h: 120, type: 'solid' },

        // Výstup na věž
        { x: 1750, y: 380, w: 100, h: 24, type: 'solid' },
        { x: 1910, y: 300, w: 100, h: 24, type: 'solid' },
        { x: 2080, y: 220, w: 120, h: 24, type: 'solid' },
        { x: 2260, y: 220, w: 120, h: 24, type: 'moving', minX: 2250, maxX: 2450, vx: 2.0, vy: 0 },
        { x: 2540, y: 280, w: 140, h: 24, type: 'solid' },

        // Závěrečné nádvoří citadely
        { x: 2740, y: 460, w: 460, h: 140, type: 'solid' }
      ],
      coins: [
        { x: 510, y: 360 }, { x: 680, y: 280 },
        { x: 890, y: 280 }, { x: 940, y: 280 }, { x: 990, y: 280 },
        { x: 1400, y: 390 }, { x: 1460, y: 390 }, { x: 1520, y: 390 },
        { x: 1790, y: 330 }, { x: 1950, y: 250 }, { x: 2130, y: 170 },
        { x: 2590, y: 230 }, { x: 2850, y: 400 }, { x: 2920, y: 400 }, { x: 2990, y: 400 }
      ],
      pickles: [
        { x: 860, y: 280, type: 'pink' }, // Růžová okurka: Super Rychlost
        { x: 2120, y: 170, type: 'green' } // Zelená okurka pro velký finální skok
      ],
      enemies: [
        { x: 950, y: 290, minX: 840, maxX: 1060, speed: 1.8 },
        { x: 1480, y: 400, minX: 1360, maxX: 1650, speed: 2.2 },
        { x: 2880, y: 420, minX: 2780, maxX: 3050, speed: 2.0 }
      ],
      npc: { x: 1400, y: 396 },
      goal: { x: 3100, y: 390 }
    }
  ];

  // --- DIALOGOVÝ SYSTÉM AI PŘÍTELKYNĚ LILI ---
  const LILI_DIALOGS = {
    // 0 - 24: Neznámí
    strangers: [
      "Ahojky! Jsem Lili. Tady v růžovém světě je plno nebezpečí, dej na sebe pozor! 🌸",
      "Koukám, že sbíráš mince! Ty se mi moc líbí... kdybys nějaké postrádal, víš komu je dát. 😉",
      "Slyšela jsem, že ty kouzelné okurky dávají neuvěřitelnou sílu! Už jsi nějakou ochutnal?",
      "Cesta do cíle je ještě dlouhá, skákej opatrně!"
    ],
    // 25 - 49: Kamarádi
    friends: [
      "Ahoj dobrodruhu! Jsem moc ráda, že jsi se za mnou zase zastavil. Jak ti jde skákání? 💜",
      "Ty mince, co jsi mi dal, krásně svítí! Jsi moc hodný kamarád.",
      "Věděl jsi, že když skočíš příšerce přímo na hlavičku, hned se promění na hvězdičky? Vyzkoušej to!",
      "Věřím ti, tuhle úroveň zvládneš levou zadní!"
    ],
    // 50 - 79: Dobří přátelé
    goodFriends: [
      "Moje srdíčko plesá, pokaždé když tě vidím! Jsi ten nejstatečnější hrdina v celém Pink království! ✨",
      "Mám pro tebe tajný tip: Zlatá okurka tě udělá zcela nezranitelným. Žádná obluda ti neublíží!",
      "Spolu jsme ten nejlepší tým! Až hru dokončíš, oslavíme to jahodovým dortem! 🍰",
      "Daroval jsi mi tolik mincí... opravdu si toho vážím. Znamenáš pro mě hodně! 💕"
    ],
    // 80 - 100: Láska / Maximální náklonnost
    soulmates: [
      "Miláčku! Moje náklonnost k tobě je na maximu! 💖 Jsi můj vysněný hrdina!",
      "Tady máš můj kouzelný Růžový štít 🛡️! Ochrání tě před dalším zásahem. Nikdy tě nenechám padnout!",
      "S tebou projdu jakoukoliv překážku! Pojďme dobýt celou citadelu společně! 👑",
      "Děkuji za všechno, co pro mě děláš. Jsi to nejlepší, co mě v tomhle virtuálním světě potkalo! 🌸"
    ],
    // Reakce na dary
    giftResponses: {
      small: [
        "Díky za 10 mincí! Každá maličkost od tebe mě potěší. 😊",
        "Jé, 10 mincí! Koupím si za ně růžovou mašli! 🎀"
      ],
      medium: [
        "Jéé, 25 mincí! To je od tebe strašně milé, hned mám lepší den! 💖",
        "Páni, 25 mincí! Jsi štědrý společník! Děkuji! ✨"
      ],
      large: [
        "WOW! Celých 50 mincí?! Ty jsi hotový princ! Zbožňuji tě! 👑💗",
        "Neuvěřitelné! 50 mincí! Tvoje štědrost nezná mezí, Lili je šťastná! 🥰"
      ]
    }
  };

  // --- HLAVNÍ HERNÍ ENGINE ---
  class Game {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.sound = new SoundManager();
      this.particles = new ParticleSystem();

      // Herní rozměry (virtuální rozlišení s automatickým škálováním)
      this.width = 960;
      this.height = 540;

      // Stav hry: 'menu', 'playing', 'dialog', 'pause', 'gameover', 'win'
      this.state = 'menu';

      // Herní data hráče
      this.score = 0;
      this.coins = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.hasShield = false; // štít získávaný od Lili
      this.liliAffection = 0; // 0 až 100

      // Úroveň
      this.currentLevelIndex = 0;
      this.level = null;

      // Hráč
      this.player = {
        x: 100,
        y: 350,
        w: 32,
        h: 44,
        vx: 0,
        vy: 0,
        speed: 5.2,
        jumpForce: -13.2,
        isGrounded: false,
        coyoteTimer: 0,
        jumpBufferTimer: 0,
        facing: 1, // 1 = vpravo, -1 = vlevo
        invulnerableTimer: 0,
        safeX: 100,
        safeY: 350,
        walkAnim: 0
      };

      // Aktivní Power-up
      this.powerup = {
        type: null, // 'green', 'gold', 'pink'
        name: '',
        duration: 0,
        maxDuration: 0
      };

      // Kamera
      this.camera = { x: 0, y: 0 };

      // Klávesové vstupy
      this.keys = {
        left: false,
        right: false,
        jump: false,
        interact: false
      };

      // Časovač smyčky
      this.lastTime = 0;

      // Načíst nejvyšší skóre
      this.highScore = parseInt(localStorage.getItem('pink_adventure_highscore') || '0', 10);

      this.initDOM();
      this.bindInputs();
      this.renderAvatar();
    }

    initDOM() {
      // Elementy HUD
      this.hudLives = document.getElementById('hud-lives');
      this.hudCoins = document.getElementById('hud-coins');
      this.hudScore = document.getElementById('hud-score');
      this.hudLevel = document.getElementById('hud-level');
      this.hudPowerup = document.getElementById('hud-powerup');
      this.powerupIcon = document.getElementById('powerup-icon');
      this.powerupName = document.getElementById('powerup-name');
      this.powerupProgress = document.getElementById('powerup-progress');
      this.powerupSeconds = document.getElementById('powerup-seconds');
      this.interactPrompt = document.getElementById('interact-prompt');

      // Modální okna
      this.screenMenu = document.getElementById('screen-menu');
      this.screenInstructions = document.getElementById('screen-instructions');
      this.screenDialog = document.getElementById('screen-dialog');
      this.screenPause = document.getElementById('screen-pause');
      this.screenGameOver = document.getElementById('screen-game-over');
      this.screenWin = document.getElementById('screen-win');

      // Tlačítka menu a dialogu
      document.getElementById('menu-best-score').textContent = this.highScore;

      document.getElementById('btn-start').addEventListener('click', () => {
        this.sound.init();
        this.startNewGame();
      });

      document.getElementById('btn-instructions').addEventListener('click', () => {
        this.screenMenu.classList.add('hidden');
        this.screenInstructions.classList.remove('hidden');
      });

      document.getElementById('btn-instructions-back').addEventListener('click', () => {
        this.screenInstructions.classList.add('hidden');
        this.screenMenu.classList.remove('hidden');
      });

      document.getElementById('btn-audio').addEventListener('click', (e) => {
        const isEnabled = this.sound.toggle();
        e.target.textContent = isEnabled ? '🔊' : '🔇';
      });

      document.getElementById('btn-pause').addEventListener('click', () => {
        if (this.state === 'playing') this.pauseGame();
        else if (this.state === 'pause') this.resumeGame();
      });

      document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
      document.getElementById('btn-restart-level').addEventListener('click', () => {
        this.resumeGame();
        this.loadLevel(this.currentLevelIndex);
      });
      document.getElementById('btn-pause-menu').addEventListener('click', () => this.returnToMenu());

      document.getElementById('btn-retry').addEventListener('click', () => this.startNewGame());
      document.getElementById('btn-gameover-menu').addEventListener('click', () => this.returnToMenu());

      document.getElementById('btn-play-again').addEventListener('click', () => this.startNewGame());

      // Dialog Lili
      document.getElementById('btn-dialog-close').addEventListener('click', () => this.closeDialog());
      document.getElementById('btn-dialog-close-x').addEventListener('click', () => this.closeDialog());

      document.getElementById('btn-talk').addEventListener('click', () => this.talkToLili());
      document.getElementById('btn-gift-10').addEventListener('click', () => this.giftCoinsToLili(10, 5));
      document.getElementById('btn-gift-25').addEventListener('click', () => this.giftCoinsToLili(25, 15));
      document.getElementById('btn-gift-50').addEventListener('click', () => this.giftCoinsToLili(50, 35));
    }

    bindInputs() {
      // Klávesnice
      window.addEventListener('keydown', (e) => {
        this.sound.init();
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          this.keys.jump = true;
          this.player.jumpBufferTimer = 8;
        }
        if (e.code === 'KeyE') {
          if (this.state === 'dialog') {
            this.closeDialog();
          } else if (this.state === 'playing') {
            this.tryInteract();
          }
        }
        if (e.code === 'Escape') {
          if (this.state === 'dialog') {
            this.closeDialog();
          } else if (this.state === 'playing') {
            this.pauseGame();
          } else if (this.state === 'pause') {
            this.resumeGame();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.jump = false;
      });

      // Mobilní dotyková tlačítka (Multi-touch bez prodlevy)
      const bindTouchBtn = (elemId, onStart, onEnd) => {
        const btn = document.getElementById(elemId);
        if (!btn) return;
        const startHandler = (e) => {
          e.preventDefault();
          this.sound.init();
          onStart();
        };
        const endHandler = (e) => {
          e.preventDefault();
          onEnd();
        };
        btn.addEventListener('touchstart', startHandler, { passive: false });
        btn.addEventListener('touchend', endHandler, { passive: false });
        btn.addEventListener('touchcancel', endHandler, { passive: false });
        btn.addEventListener('mousedown', startHandler);
        btn.addEventListener('mouseup', endHandler);
        btn.addEventListener('mouseleave', endHandler);
      };

      bindTouchBtn('touch-left', () => { this.keys.left = true; }, () => { this.keys.left = false; });
      bindTouchBtn('touch-right', () => { this.keys.right = true; }, () => { this.keys.right = false; });
      bindTouchBtn('touch-jump', () => {
        this.keys.jump = true;
        this.player.jumpBufferTimer = 8;
      }, () => {
        this.keys.jump = false;
      });
      bindTouchBtn('touch-interact', () => {
        if (this.state === 'dialog') this.closeDialog();
        else this.tryInteract();
      }, () => {});
    }

    startNewGame() {
      this.score = 0;
      this.coins = 0;
      this.lives = 3;
      this.hasShield = false;
      this.liliAffection = 0;
      this.currentLevelIndex = 0;
      this.resetPowerup();
      this.loadLevel(0);
      this.hideAllModals();
      this.state = 'playing';
      this.sound.startBGM();
      this.updateHUD();
    }

    loadLevel(index) {
      this.currentLevelIndex = index;
      const tmpl = LEVEL_DATA[index];

      // Hluboká kopie objektů v úrovni
      this.level = {
        name: tmpl.name,
        theme: tmpl.theme,
        width: tmpl.width,
        height: tmpl.height,
        platforms: tmpl.platforms.map(p => ({ ...p, origX: p.x, origY: p.y })),
        coins: tmpl.coins.map(c => ({ ...c, collected: false })),
        pickles: tmpl.pickles.map(p => ({ ...p, collected: false })),
        enemies: tmpl.enemies.map(e => ({ ...e, alive: true, vx: e.speed, w: 32, h: 28, y: e.y, squishAnim: 0 })),
        npc: { ...tmpl.npc, w: 34, h: 48 },
        goal: { ...tmpl.goal, w: 46, h: 64, reached: false }
      };

      // Reset hráče do výchozí pozice úrovně
      this.player.x = tmpl.spawn.x;
      this.player.y = tmpl.spawn.y;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.safeX = tmpl.spawn.x;
      this.player.safeY = tmpl.spawn.y;
      this.player.invulnerableTimer = 0;
      this.player.isGrounded = true;

      this.hudLevel.textContent = `LEVEL ${index + 1}`;
      this.updateHUD();
    }

    hideAllModals() {
      this.screenMenu.classList.add('hidden');
      this.screenInstructions.classList.add('hidden');
      this.screenDialog.classList.add('hidden');
      this.screenPause.classList.add('hidden');
      this.screenGameOver.classList.add('hidden');
      this.screenWin.classList.add('hidden');
    }

    pauseGame() {
      if (this.state !== 'playing') return;
      this.state = 'pause';
      this.screenPause.classList.remove('hidden');
    }

    resumeGame() {
      if (this.state !== 'pause') return;
      this.screenPause.classList.add('hidden');
      this.state = 'playing';
    }

    returnToMenu() {
      this.state = 'menu';
      this.sound.stopBGM();
      this.hideAllModals();
      this.screenMenu.classList.remove('hidden');
      document.getElementById('menu-best-score').textContent = this.highScore;
    }

    gameOver() {
      this.state = 'gameover';
      this.sound.stopBGM();
      this.sound.playHurt();
      this.checkHighScore();
      document.getElementById('gameover-score').textContent = this.score;
      document.getElementById('gameover-coins').textContent = this.coins;
      this.screenGameOver.classList.remove('hidden');
    }

    gameWin() {
      this.state = 'win';
      this.sound.stopBGM();
      this.sound.playWin();
      this.checkHighScore();

      document.getElementById('win-final-score').textContent = this.score;
      document.getElementById('win-final-coins').textContent = this.coins;
      document.getElementById('win-affection-val').textContent = `${this.liliAffection}%`;

      let relation = "Neznámí";
      let quote = '"Díky za pomoc při překonání těchto překážek!"';
      if (this.liliAffection >= 80) {
        relation = "Spřízněné duše 💖👑";
        quote = '"Jsi můj absolutní hrdina a láska mého života! Tento svět patří nám dvěma! 🌸"';
      } else if (this.liliAffection >= 50) {
        relation = "Nejlepší přátelé 💕";
        quote = '"Byl to neskutečný zážitek! Jsem moc pyšná na to, co jsi dokázal!"';
      } else if (this.liliAffection >= 25) {
        relation = "Dobří kamarádi 💜";
        quote = '"Skvělá práce! Ráda jsem tě poznala a těším se na další dobrodružství!"';
      }

      document.getElementById('win-relationship').textContent = relation;
      document.getElementById('win-lili-quote').textContent = quote;

      // Konfety
      for (let i = 0; i < 40; i++) {
        this.particles.emit(
          this.width / 2 + (Math.random() * 400 - 200),
          this.height / 2,
          ['#ff2a85', '#7928ca', '#ffd700', '#4ade80'][Math.floor(Math.random() * 4)],
          1,
          5,
          'star'
        );
      }

      this.screenWin.classList.remove('hidden');
    }

    checkHighScore() {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('pink_adventure_highscore', this.highScore.toString());
      }
    }

    // --- AI PŘÍTELKYNĚ DIALOGOVÝ MODAL ---
    tryInteract() {
      if (!this.level || !this.level.npc) return;
      const dx = (this.player.x + this.player.w / 2) - (this.level.npc.x + this.level.npc.w / 2);
      const dy = (this.player.y + this.player.h / 2) - (this.level.npc.y + this.level.npc.h / 2);
      const dist = Math.hypot(dx, dy);

      if (dist < 80) {
        this.openDialog();
      }
    }

    openDialog() {
      this.state = 'dialog';
      this.screenDialog.classList.remove('hidden');
      this.sound.playAffectionChime();
      this.updateDialogUI();

      // Výchozí hláška podle náklonnosti
      const pool = this.getDialogPool();
      const randomText = pool[Math.floor(Math.random() * pool.length)];
      document.getElementById('dialog-text').textContent = randomText;
    }

    closeDialog() {
      this.screenDialog.classList.add('hidden');
      this.state = 'playing';
    }

    getDialogPool() {
      if (this.liliAffection >= 80) return LILI_DIALOGS.soulmates;
      if (this.liliAffection >= 50) return LILI_DIALOGS.goodFriends;
      if (this.liliAffection >= 25) return LILI_DIALOGS.friends;
      return LILI_DIALOGS.strangers;
    }

    talkToLili() {
      const pool = this.getDialogPool();
      const randomText = pool[Math.floor(Math.random() * pool.length)];
      document.getElementById('dialog-text').textContent = randomText;
      this.sound.playAffectionChime();
      this.particles.emitHearts(this.level.npc.x + 15, this.level.npc.y - 10, 3);
    }

    giftCoinsToLili(cost, affectionGain) {
      if (this.coins < cost) {
        document.getElementById('dialog-text').textContent = `Nemáš dost mincí! Potřebuješ ${cost} 🪙, ale máš jen ${this.coins} 🪙.`;
        return;
      }

      this.coins -= cost;
      const oldAffection = this.liliAffection;
      this.liliAffection = Math.min(100, this.liliAffection + affectionGain);
      this.sound.playAffectionChime();

      // Získání štítu při dosažení 80+ náklonnosti
      if (oldAffection < 80 && this.liliAffection >= 80) {
        this.hasShield = true;
        this.particles.addText("ZÍSKÁN RŮŽOVÝ ŠTÍT! 🛡️", this.player.x, this.player.y - 20, '#ff75c3');
      }

      // Reakce Lili
      let resGroup = LILI_DIALOGS.giftResponses.small;
      if (cost === 25) resGroup = LILI_DIALOGS.giftResponses.medium;
      if (cost === 50) resGroup = LILI_DIALOGS.giftResponses.large;
      const res = resGroup[Math.floor(Math.random() * resGroup.length)];

      document.getElementById('dialog-text').textContent = res;
      this.particles.emitHearts(this.level.npc.x + 15, this.level.npc.y - 10, 8);
      this.updateHUD();
      this.updateDialogUI();
    }

    updateDialogUI() {
      document.getElementById('dialog-user-coins').textContent = this.coins;
      document.getElementById('affection-val').textContent = `${this.liliAffection} / 100 ❤️`;
      document.getElementById('affection-progress').style.width = `${this.liliAffection}%`;

      let status = "Neznámí";
      if (this.liliAffection >= 80) status = "Spřízněné duše 💖";
      else if (this.liliAffection >= 50) status = "Nejlepší přátelé 💕";
      else if (this.liliAffection >= 25) status = "Kamarádi 🌸";
      document.getElementById('affection-status').textContent = status;

      // Stav tlačítek podle mincí
      document.getElementById('btn-gift-10').disabled = this.coins < 10 || this.liliAffection >= 100;
      document.getElementById('btn-gift-25').disabled = this.coins < 25 || this.liliAffection >= 100;
      document.getElementById('btn-gift-50').disabled = this.coins < 50 || this.liliAffection >= 100;
    }

    // --- POWER-UPY (OKURKY) ---
    activatePowerup(type) {
      this.sound.playPowerup();
      this.score += 25;
      this.particles.addText("+25 b", this.player.x, this.player.y - 15, '#4ade80');

      if (type === 'green') {
        this.powerup = {
          type: 'green',
          name: 'SUPER SKOK',
          icon: '🥒',
          color: '#4ade80',
          duration: 10,
          maxDuration: 10
        };
        this.player.jumpForce = -17.5;
        this.particles.addText("SUPER SKOK! 🥒", this.player.x, this.player.y - 35, '#4ade80');
      } else if (type === 'gold') {
        this.powerup = {
          type: 'gold',
          name: 'NEZRANITELNOST',
          icon: '✨',
          color: '#facc15',
          duration: 8,
          maxDuration: 8
        };
        this.player.invulnerableTimer = 8;
        this.particles.addText("NEZRANITELNOST! 👑", this.player.x, this.player.y - 35, '#facc15');
      } else if (type === 'pink') {
        this.powerup = {
          type: 'pink',
          name: 'SUPER RYCHLOST',
          icon: '⚡',
          color: '#f472b6',
          duration: 10,
          maxDuration: 10
        };
        this.player.speed = 8.5;
        this.particles.addText("TURBO RYCHLOST! 💨", this.player.x, this.player.y - 35, '#f472b6');
      }

      this.hudPowerup.classList.remove('hidden');
      this.powerupIcon.textContent = this.powerup.icon;
      this.powerupName.textContent = this.powerup.name;
      this.hudPowerup.style.borderColor = this.powerup.color;
      this.updateHUD();
    }

    resetPowerup() {
      this.powerup.type = null;
      this.player.speed = 5.2;
      this.player.jumpForce = -13.2;
      this.hudPowerup.classList.add('hidden');
    }

    updatePowerup(dt) {
      if (!this.powerup.type) return;
      this.powerup.duration -= dt;

      if (this.powerup.duration <= 0) {
        this.resetPowerup();
      } else {
        const pct = Math.max(0, (this.powerup.duration / this.powerup.maxDuration) * 100);
        this.powerupProgress.style.width = `${pct}%`;
        this.powerupProgress.style.backgroundColor = this.powerup.color;
        this.powerupSeconds.textContent = `${Math.ceil(this.powerup.duration)}s`;
      }
    }

    // --- DAMAGE A RESPAWN ---
    takeDamage() {
      // Pokud má hráč nezranitelnost ze zlaté okurky
      if (this.powerup.type === 'gold' || this.player.invulnerableTimer > 0) return;

      // Pokud má hráč růžový štít od Lili
      if (this.hasShield) {
        this.hasShield = false;
        this.player.invulnerableTimer = 1.5;
        this.sound.playAffectionChime();
        this.particles.emit(this.player.x, this.player.y, '#ff4b91', 15, 4);
        this.particles.addText("ŠTÍT ABSORBOVAL RÁNU! 🛡️", this.player.x, this.player.y - 20, '#ff9ebb');
        return;
      }

      this.lives--;
      this.sound.playHurt();
      this.player.invulnerableTimer = 1.8;
      this.particles.emit(this.player.x, this.player.y, '#ff0055', 12, 3);
      this.updateHUD();

      if (this.lives <= 0) {
        this.gameOver();
      }
    }

    respawnAtSafePoint() {
      this.lives--;
      this.sound.playHurt();
      this.particles.emit(this.player.x, this.player.y, '#ff007f', 16, 4);
      this.updateHUD();

      if (this.lives <= 0) {
        this.gameOver();
      } else {
        this.player.x = this.player.safeX;
        this.player.y = this.player.safeY;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.invulnerableTimer = 1.8;
      }
    }

    updateHUD() {
      this.hudLives.textContent = `${'❤️'.repeat(Math.max(0, this.lives))}${this.hasShield ? ' 🛡️' : ''}`;
      this.hudCoins.textContent = this.coins;
      this.hudScore.textContent = this.score;
    }

    // --- FYZIKA A POHYB ---
    update(dt) {
      if (this.state !== 'playing' || !this.level) return;

      this.updatePowerup(dt);
      this.particles.update();

      const p = this.player;

      // Časovač nezranitelnosti
      if (p.invulnerableTimer > 0) {
        p.invulnerableTimer -= dt;
      }

      // Horizontální zrychlení a tření
      const targetVx = (this.keys.right ? p.speed : 0) - (this.keys.left ? p.speed : 0);
      p.vx += (targetVx - p.vx) * 0.25;

      if (Math.abs(p.vx) > 0.1) {
        p.facing = p.vx > 0 ? 1 : -1;
        p.walkAnim += Math.abs(p.vx) * 0.2;
      }

      // Gravitace
      p.vy += 0.62;
      if (p.vy > 13) p.vy = 13;

      // Coyote time & Jump buffer
      if (p.isGrounded) {
        p.coyoteTimer = 6;
      } else if (p.coyoteTimer > 0) {
        p.coyoteTimer--;
      }

      if (p.jumpBufferTimer > 0) {
        p.jumpBufferTimer--;
      }

      // Skok
      if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
        p.vy = p.jumpForce;
        p.jumpBufferTimer = 0;
        p.coyoteTimer = 0;
        p.isGrounded = false;
        this.sound.playJump();
        this.particles.emit(p.x + p.w / 2, p.y + p.h, '#ff75c3', 5, 1.8);
      }

      // Pohyblivé plošiny - update
      for (const plat of this.level.platforms) {
        if (plat.type === 'moving') {
          if (plat.vx) {
            plat.x += plat.vx;
            if (plat.x < plat.minX || plat.x > plat.maxX) plat.vx *= -1;
          }
          if (plat.vy) {
            plat.y += plat.vy;
            if (plat.y < plat.minY || plat.y > plat.maxY) plat.vy *= -1;
          }
        }
      }

      // Horizontální pohyb a kolize
      p.x += p.vx;
      this.checkHorizontalCollisions(p);

      // Vertikální pohyb a kolize
      p.y += p.vy;
      p.isGrounded = false;
      this.checkVerticalCollisions(p);

      // Záchyt bezpečné pozice pro respawn
      if (p.isGrounded && p.y < this.level.height - 100) {
        p.safeX = p.x;
        p.safeY = p.y - 5;
      }

      // Pád do propasti
      if (p.y > this.level.height + 60) {
        this.respawnAtSafePoint();
      }

      // Hranice mapy vlevo a vpravo
      if (p.x < 0) p.x = 0;
      if (p.x > this.level.width - p.w) p.x = this.level.width - p.w;

      // Efekt stopy při super rychlosti
      if (this.powerup.type === 'pink' && Math.abs(p.vx) > 3) {
        if (Math.random() < 0.4) {
          this.particles.emit(p.x + p.w / 2, p.y + p.h / 2, '#f472b6', 1, 0.5);
        }
      }

      // Zlaté jiskry při nezranitelnosti
      if (this.powerup.type === 'gold' && Math.random() < 0.3) {
        this.particles.emit(p.x + p.w / 2, p.y + p.h / 2, '#facc15', 1, 1, 'star');
      }

      // Sbírání mincí
      for (const coin of this.level.coins) {
        if (!coin.collected && this.checkOverlap(p.x, p.y, p.w, p.h, coin.x - 12, coin.y - 12, 24, 24)) {
          coin.collected = true;
          this.coins++;
          this.score += 10;
          this.sound.playCoin();
          this.particles.emit(coin.x, coin.y, '#ffd700', 8, 2.5, 'star');
          this.particles.addText("+10", coin.x, coin.y - 10, '#ffd700');
          this.updateHUD();
        }
      }

      // Sbírání okurek
      for (const pickle of this.level.pickles) {
        if (!pickle.collected && this.checkOverlap(p.x, p.y, p.w, p.h, pickle.x - 12, pickle.y - 18, 24, 36)) {
          pickle.collected = true;
          this.activatePowerup(pickle.type);
        }
      }

      // Nepřátelé - pohyb a kolize
      for (const enemy of this.level.enemies) {
        if (!enemy.alive) continue;

        // Pohyb hlídkujícího nepřítele
        enemy.x += enemy.vx;
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
          enemy.vx *= -1;
        }

        // Detekce kolize s hráčem
        if (this.checkOverlap(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
          // Skok na hlavu (hráč padá shora)
          const hitFromAbove = p.vy > 0 && (p.y + p.h - p.vy) <= (enemy.y + 14);

          if (hitFromAbove || this.powerup.type === 'gold') {
            // Nepřítel poražen!
            enemy.alive = false;
            p.vy = -10.5; // odraz hráče nahoru
            this.score += 50;
            this.sound.playStomp();
            this.particles.emit(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#9d4edd', 14, 3.5);
            this.particles.addText("+50 b", enemy.x + 10, enemy.y - 15, '#c77dff');
            this.updateHUD();
          } else {
            // Zranění hráče ze strany
            this.takeDamage();
          }
        }
      }

      // Cíl (portál / vlajka na konci úrovně)
      const goal = this.level.goal;
      if (!goal.reached && this.checkOverlap(p.x, p.y, p.w, p.h, goal.x, goal.y, goal.w, goal.h)) {
        goal.reached = true;
        this.score += 200;
        this.sound.playWin();
        this.particles.emit(goal.x + 23, goal.y + 32, '#ff75c3', 25, 4, 'star');
        this.particles.addText("ÚROVEŇ DOKONČENA! +200", goal.x, goal.y - 20, '#ffd700');
        this.updateHUD();

        setTimeout(() => {
          if (this.currentLevelIndex + 1 < LEVEL_DATA.length) {
            this.loadLevel(this.currentLevelIndex + 1);
          } else {
            this.gameWin();
          }
        }, 1200);
      }

      // Detekce blízkosti k Lili (zobrazení [E] bubliny)
      if (this.level.npc) {
        const dx = (p.x + p.w / 2) - (this.level.npc.x + this.level.npc.w / 2);
        const dy = (p.y + p.h / 2) - (this.level.npc.y + this.level.npc.h / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < 80) {
          this.interactPrompt.classList.remove('hidden');
        } else {
          this.interactPrompt.classList.add('hidden');
        }
      }

      // Plynulá kamera sledující hráče
      const targetCamX = p.x - this.width * 0.4;
      this.camera.x += (targetCamX - this.camera.x) * 0.1;
      this.camera.x = Math.max(0, Math.min(this.camera.x, this.level.width - this.width));
    }

    checkHorizontalCollisions(p) {
      for (const plat of this.level.platforms) {
        if (plat.type === 'solid') {
          if (this.checkOverlap(p.x, p.y, p.w, p.h, plat.x, plat.y, plat.w, plat.h)) {
            if (p.vx > 0) {
              p.x = plat.x - p.w;
              p.vx = 0;
            } else if (p.vx < 0) {
              p.x = plat.x + plat.w;
              p.vx = 0;
            }
          }
        }
      }
    }

    checkVerticalCollisions(p) {
      for (const plat of this.level.platforms) {
        if (plat.w <= 0 || plat.h <= 0) continue;
        if (this.checkOverlap(p.x, p.y, p.w, p.h, plat.x, plat.y, plat.w, plat.h)) {
          if (p.vy > 0) {
            // Dopad na platformu
            p.y = plat.y - p.h;
            p.vy = 0;
            p.isGrounded = true;

            // Pokud je plošina pohyblivá, unáší hráče
            if (plat.type === 'moving' && plat.vx) {
              p.x += plat.vx;
            }
          } else if (p.vy < 0 && plat.type === 'solid') {
            // Náraz do stropu
            p.y = plat.y + plat.h;
            p.vy = 0;
          }
        }
      }
    }

    checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }

    // --- VYKRESLOVÁNÍ (CANVAS 2D ART) ---
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      if (!this.level) return;

      const camX = this.camera.x;
      const camY = 0;

      // 1. Parallax pozadí (hvězdy, neonové hory, fialové gradienty)
      this.drawParallaxBackground(ctx, camX);

      // 2. Platformy
      this.drawPlatforms(ctx, camX, camY);

      // 3. Cíl (Portál)
      this.drawGoal(ctx, camX, camY);

      // 4. Mince & Okurky
      this.drawCollectibles(ctx, camX, camY);

      // 5. AI Přítelkyně Lili
      this.drawGirlfriend(ctx, camX, camY);

      // 6. Nepřátelé
      this.drawEnemies(ctx, camX, camY);

      // 7. Hráč
      this.drawPlayer(ctx, camX, camY);

      // 8. Částice a plovoucí texty
      this.particles.draw(ctx, camX, camY);
    }

    drawParallaxBackground(ctx, camX) {
      // Základní gradient oblohy
      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#110521');
      grad.addColorStop(0.6, '#280c44');
      grad.addColorStop(1, '#4a126d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Hvězdy a třpytky (vrstva 1)
      ctx.fillStyle = '#ffcbf2';
      for (let i = 0; i < 35; i++) {
        const starX = ((i * 87) - camX * 0.05) % this.width;
        const x = starX < 0 ? starX + this.width : starX;
        const y = (i * 31) % (this.height * 0.65);
        const sz = (i % 3) + 1;
        ctx.fillRect(x, y, sz, sz);
      }

      // Neonový měsíc / zářící těleso
      ctx.save();
      const moonX = this.width * 0.8 - camX * 0.02;
      const moonGrad = ctx.createRadialGradient(moonX, 90, 10, moonX, 90, 50);
      moonGrad.addColorStop(0, '#ff9ebb');
      moonGrad.addColorStop(0.7, '#ff2a85');
      moonGrad.addColorStop(1, 'rgba(255, 42, 133, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, 90, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vzdálené neonové hory (vrstva 2)
      ctx.fillStyle = 'rgba(60, 16, 95, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      for (let x = 0; x <= this.width; x += 120) {
        const mountainX = x - (camX * 0.15) % 120;
        const heightOffset = Math.sin((x + camX * 0.1) * 0.008) * 60 + 180;
        ctx.lineTo(mountainX, this.height - heightOffset);
      }
      ctx.lineTo(this.width, this.height);
      ctx.fill();

      // Bližší fialové kopce (vrstva 3)
      ctx.fillStyle = 'rgba(87, 24, 138, 0.75)';
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      for (let x = 0; x <= this.width; x += 80) {
        const hillX = x - (camX * 0.3) % 80;
        const hOffset = Math.sin((x + camX * 0.2) * 0.012) * 40 + 90;
        ctx.lineTo(hillX, this.height - hOffset);
      }
      ctx.lineTo(this.width, this.height);
      ctx.fill();
    }

    drawPlatforms(ctx, camX, camY) {
      for (const p of this.level.platforms) {
        if (p.w <= 0 || p.h <= 0) continue;
        const x = p.x - camX;
        const y = p.y - camY;

        // Pokud je plošina mimo obrazovku, nekreslit
        if (x + p.w < -20 || x > this.width + 20) continue;

        ctx.save();

        if (p.type === 'moving') {
          // Pohyblivá plošina - křišťálový vzhled s neonovým lemem
          ctx.fillStyle = '#6a1b9a';
          ctx.strokeStyle = '#e040fb';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#e040fb';
          ctx.shadowBlur = 10;
          this.drawRoundedRect(ctx, x, y, p.w, p.h, 8);
          ctx.fill();
          ctx.stroke();

          // Žlutá křidélka / šipky pohybu
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(x + p.w / 2 - 8, y + p.h / 2 - 2, 16, 4);
        } else {
          // Pevná platforma: Fialové tělo + neonově růžový travnatý/krystalický povrch
          const platGrad = ctx.createLinearGradient(x, y, x, y + p.h);
          platGrad.addColorStop(0, '#4a1572');
          platGrad.addColorStop(1, '#230738');
          ctx.fillStyle = platGrad;
          ctx.fillRect(x, y, p.w, p.h);

          // Neonově růžový zářivý horní okraj
          ctx.fillStyle = '#ff2a85';
          ctx.fillRect(x, y, p.w, 6);

          // Krystalové fazety na povrchu
          ctx.fillStyle = '#ff75c3';
          for (let cx = x + 10; cx < x + p.w - 10; cx += 30) {
            ctx.beginPath();
            ctx.moveTo(cx, y);
            ctx.lineTo(cx + 6, y + 10);
            ctx.lineTo(cx + 12, y);
            ctx.fill();
          }

          // Obvodový rám
          ctx.strokeStyle = 'rgba(255, 117, 195, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, p.w, p.h);
        }
        ctx.restore();
      }
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    drawGoal(ctx, camX, camY) {
      const g = this.level.goal;
      const x = g.x - camX;
      const y = g.y - camY;

      ctx.save();
      // Pulzující neonový portál
      const time = Date.now() * 0.004;
      const radius = 24 + Math.sin(time) * 4;

      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 20;

      // Portálová brána
      ctx.strokeStyle = '#c77dff';
      ctx.lineWidth = 6;
      ctx.strokeRect(x + 5, y + 8, g.w - 10, g.h - 8);

      // Portálový vír
      const pGrad = ctx.createRadialGradient(x + g.w / 2, y + g.h / 2, 2, x + g.w / 2, y + g.h / 2, radius);
      pGrad.addColorStop(0, '#ffffff');
      pGrad.addColorStop(0.4, '#ff75c3');
      pGrad.addColorStop(0.8, '#7928ca');
      pGrad.addColorStop(1, 'rgba(121, 40, 202, 0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(x + g.w / 2, y + g.h / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Nápis CÍL / PORTÁL
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORTÁL ✨', x + g.w / 2, y - 6);

      ctx.restore();
    }

    drawCollectibles(ctx, camX, camY) {
      const time = Date.now() * 0.005;

      // 1. Mince
      for (const coin of this.level.coins) {
        if (coin.collected) continue;
        const x = coin.x - camX;
        const y = coin.y - camY + Math.sin(time + coin.x) * 4;

        if (x < -20 || x > this.width + 20) continue;

        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;

        // Otáčení mince (efekt šířky)
        const scaleX = Math.cos(time * 1.5 + coin.x * 0.1);
        ctx.translate(x, y);
        ctx.scale(Math.abs(scaleX) * 0.8 + 0.2, 1);

        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillRect(-2, -5, 4, 10);

        ctx.restore();
      }

      // 2. Okurky (Power-upy)
      for (const pickle of this.level.pickles) {
        if (pickle.collected) continue;
        const x = pickle.x - camX;
        const y = pickle.y - camY + Math.sin(time * 1.2) * 5;

        if (x < -20 || x > this.width + 20) continue;

        ctx.save();
        let glowColor = '#4ade80';
        let mainColor = '#22c55e';
        let detailColor = '#15803d';

        if (pickle.type === 'gold') {
          glowColor = '#facc15';
          mainColor = '#eab308';
          detailColor = '#ca8a04';
        } else if (pickle.type === 'pink') {
          glowColor = '#f472b6';
          mainColor = '#ec4899';
          detailColor = '#be185d';
        }

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;

        // Vykreslení těla okurky
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.ellipse(x, y, 9, 18, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Okurkové bradavice / tečky
        ctx.fillStyle = detailColor;
        ctx.beginPath();
        ctx.arc(x - 3, y - 6, 2, 0, Math.PI * 2);
        ctx.arc(x + 3, y, 2, 0, Math.PI * 2);
        ctx.arc(x - 2, y + 8, 2, 0, Math.PI * 2);
        ctx.fill();

        // Stopka
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(x - 2, y - 22, 4, 6);

        // Zářící štítek
        ctx.font = '10px Fredoka, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(pickle.type === 'gold' ? 'ZLATÁ' : pickle.type === 'pink' ? 'TURBO' : 'SKOK', x, y - 24);

        ctx.restore();
      }
    }

    drawGirlfriend(ctx, camX, camY) {
      if (!this.level.npc) return;
      const npc = this.level.npc;
      const x = npc.x - camX;
      const y = npc.y - camY;

      if (x < -40 || x > this.width + 40) return;

      const time = Date.now() * 0.004;

      ctx.save();
      // Jemné pohupování
      const bob = Math.sin(time) * 2;

      // Srdíčko nad hlavou
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💖', x + npc.w / 2, y - 18 + Math.sin(time * 1.5) * 4);

      // Jméno a status
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.fillStyle = '#ffb3c6';
      ctx.strokeStyle = '#2e0249';
      ctx.lineWidth = 3;
      ctx.strokeText('Lili 🌸', x + npc.w / 2, y - 6);
      ctx.fillText('Lili 🌸', x + npc.w / 2, y - 6);

      // Tělo / šaty (fialovo-růžové)
      ctx.fillStyle = '#b5179e';
      ctx.beginPath();
      ctx.moveTo(x + 6, y + npc.h);
      ctx.lineTo(x + npc.w - 6, y + npc.h);
      ctx.lineTo(x + npc.w - 9, y + 22 + bob);
      ctx.lineTo(x + 9, y + 22 + bob);
      ctx.closePath();
      ctx.fill();

      // Hlava / tvář
      ctx.fillStyle = '#fed7e2';
      ctx.beginPath();
      ctx.arc(x + npc.w / 2, y + 16 + bob, 11, 0, Math.PI * 2);
      ctx.fill();

      // Vlasy (levandulově fialové s mašlí)
      ctx.fillStyle = '#9d4edd';
      ctx.beginPath();
      ctx.arc(x + npc.w / 2, y + 13 + bob, 12, Math.PI, Math.PI * 2);
      ctx.fill();
      // Copy po stranách
      ctx.beginPath();
      ctx.arc(x + 4, y + 20 + bob, 6, 0, Math.PI * 2);
      ctx.arc(x + npc.w - 4, y + 20 + bob, 6, 0, Math.PI * 2);
      ctx.fill();

      // Květina / mašle ve vlasech
      ctx.fillStyle = '#ff2a85';
      ctx.beginPath();
      ctx.arc(x + npc.w - 4, y + 10 + bob, 4, 0, Math.PI * 2);
      ctx.fill();

      // Oči a úsměv
      ctx.fillStyle = '#2e0249';
      ctx.fillRect(x + npc.w / 2 - 4, y + 15 + bob, 2.5, 3.5);
      ctx.fillRect(x + npc.w / 2 + 2, y + 15 + bob, 2.5, 3.5);

      // Ruměnec
      ctx.fillStyle = 'rgba(255, 42, 133, 0.6)';
      ctx.beginPath();
      ctx.arc(x + npc.w / 2 - 6, y + 19 + bob, 2.5, 0, Math.PI * 2);
      ctx.arc(x + npc.w / 2 + 6, y + 19 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    drawEnemies(ctx, camX, camY) {
      const time = Date.now() * 0.006;

      for (const enemy of this.level.enemies) {
        if (!enemy.alive) continue;
        const x = enemy.x - camX;
        const y = enemy.y - camY;

        if (x < -40 || x > this.width + 40) continue;

        ctx.save();

        // Pohupování a mačkání
        const squash = Math.sin(time * 2 + enemy.x) * 2;

        // Fialový slizoun / monstrum
        ctx.fillStyle = '#7b2cbf';
        ctx.shadowColor = '#9d4edd';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(x + enemy.w / 2, y + enemy.h / 2 + squash / 2, enemy.w / 2, enemy.h / 2 - squash / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Jedno velké kyklopské oko
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + enemy.w / 2, y + 10, 7, 0, Math.PI * 2);
        ctx.fill();

        // Zornička hledící ve směru chůze
        const lookOffset = enemy.vx > 0 ? 2 : -2;
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(x + enemy.w / 2 + lookOffset, y + 10, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Rohy / tykadla
        ctx.fillStyle = '#ff75c3';
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 4);
        ctx.lineTo(x + 2, y - 5);
        ctx.lineTo(x + 9, y + 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + enemy.w - 6, y + 4);
        ctx.lineTo(x + enemy.w - 2, y - 5);
        ctx.lineTo(x + enemy.w - 9, y + 2);
        ctx.fill();

        ctx.restore();
      }
    }

    drawPlayer(ctx, camX, camY) {
      const p = this.player;
      const x = p.x - camX;
      const y = p.y - camY;

      // Blikání při nezranitelnosti po zranění
      if (p.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0 && this.powerup.type !== 'gold') {
        return;
      }

      ctx.save();

      // Pokud má hráč Zlatou okurku -> záře
      if (this.powerup.type === 'gold') {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
      }

      // Chodící animace nohou
      const legOffset = Math.sin(p.walkAnim) * 5;

      // Nohy
      ctx.fillStyle = '#570a57';
      ctx.fillRect(x + 7 + legOffset, y + p.h - 8, 7, 8);
      ctx.fillRect(x + p.w - 14 - legOffset, y + p.h - 8, 7, 8);

      // Tělo (Růžový hrdina)
      const bodyGrad = ctx.createLinearGradient(x, y, x, y + p.h);
      bodyGrad.addColorStop(0, '#ff75c3');
      bodyGrad.addColorStop(1, '#ff007f');
      ctx.fillStyle = bodyGrad;
      this.drawRoundedRect(ctx, x + 4, y + 12, p.w - 8, p.h - 18, 6);
      ctx.fill();

      // Hlava
      ctx.fillStyle = '#fed7e2';
      ctx.beginPath();
      ctx.arc(x + p.w / 2, y + 12, 12, 0, Math.PI * 2);
      ctx.fill();

      // Čepice / kapuce (Neonově růžová)
      ctx.fillStyle = '#ff2a85';
      ctx.beginPath();
      ctx.arc(x + p.w / 2, y + 10, 12.5, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();

      // Oči
      const eyeDir = p.facing === 1 ? 2 : -2;
      ctx.fillStyle = '#2e0249';
      ctx.beginPath();
      ctx.arc(x + p.w / 2 + eyeDir - 3, y + 13, 2.5, 0, Math.PI * 2);
      ctx.arc(x + p.w / 2 + eyeDir + 3, y + 13, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Zářící aura štítu od Lili
      if (this.hasShield) {
        ctx.strokeStyle = '#ff75c3';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff2a85';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x + p.w / 2, y + p.h / 2, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    renderAvatar() {
      // Vykreslení malého portrétu Lili do dialogu
      const avatarCanvas = document.getElementById('npc-avatar-canvas');
      if (!avatarCanvas) return;
      const actx = avatarCanvas.getContext('2d');
      actx.clearRect(0, 0, 70, 70);

      // Pozadí
      actx.fillStyle = '#391259';
      actx.fillRect(0, 0, 70, 70);

      // Hlava
      actx.fillStyle = '#fed7e2';
      actx.beginPath();
      actx.arc(35, 36, 20, 0, Math.PI * 2);
      actx.fill();

      // Vlasy
      actx.fillStyle = '#9d4edd';
      actx.beginPath();
      actx.arc(35, 30, 22, Math.PI * 0.8, Math.PI * 2.2);
      actx.fill();
      actx.beginPath();
      actx.arc(17, 44, 9, 0, Math.PI * 2);
      actx.arc(53, 44, 9, 0, Math.PI * 2);
      actx.fill();

      // Oči
      actx.fillStyle = '#2e0249';
      actx.beginPath();
      actx.arc(28, 36, 3, 0, Math.PI * 2);
      actx.arc(42, 36, 3, 0, Math.PI * 2);
      actx.fill();

      // Květina
      actx.fillStyle = '#ff2a85';
      actx.beginPath();
      actx.arc(49, 24, 6, 0, Math.PI * 2);
      actx.fill();

      // Ruměnec
      actx.fillStyle = 'rgba(255, 42, 133, 0.5)';
      actx.beginPath();
      actx.arc(25, 42, 4, 0, Math.PI * 2);
      actx.arc(45, 42, 4, 0, Math.PI * 2);
      actx.fill();
    }

    // --- HLAVNÍ SMYČKA HRY (requestAnimationFrame) ---
    startLoop() {
      const loop = (timestamp) => {
        if (!this.lastTime) this.lastTime = timestamp;
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Omezení maximálního dt proti skokům po minimalizaci okna
        if (dt > 0.1) dt = 0.1;

        this.update(dt);
        this.render();

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // Spuštění po načtení stránky
  window.addEventListener('load', () => {
    const game = new Game();
    game.startLoop();
  });
})();
