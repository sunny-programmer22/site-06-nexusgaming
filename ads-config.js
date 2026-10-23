/**
 * NexusGaming - HilltopAds Unified Integration Engine
 * Configuration & Placement Handlers for All HilltopAds Zones:
 * 
 * Zone 1: Popunder / OnClick (Interstitial & Full-Page Clicks)
 * Zone 2: In-Page Push (IPP) MultiTag (Floating Cyber Notifications)
 * Zone 3: MultiTag Banners (728x90 Top Leaderboard & 300x250 Sidebar)
 * Zone 4: Video Slider MultiTag (Corner Sticky Cyber Video Ad)
 * Zone 5: Direct Link / SmartLink (Download Mod & Join Tournament CTAs)
 * Zone 6: Video VAST (Integrated Preroll for Gameplay Video Player)
 * 
 * Instructions:
 * Replace placeholder Zone IDs and script URLs with your official HilltopAds credentials
 * from your HilltopAds Publisher Dashboard (https://hilltopads.com).
 */

const HILLTOP_CONFIG = {
    debug: true, // Set to false in production

    // =========================================================================
    // ZONE 1: POPUNDER / ONCLICK
    // =========================================================================
    zone1_popunder: {
        enabled: true,
        zoneId: "HT_ZONE_POPUNDER_1001",
        scriptUrl: "https://native.propellerclick.com/1?z=1001_POPUNDER_PLACEHOLDER", // Replace with your HilltopAds script URL
        frequencyCapHours: 1, // Max 1 popunder per user per hour
        fallbackSmartLink: "https://go.nexusgaming.net/sl/popunder-bonus?utm_source=hilltop&zone=1"
    },

    // =========================================================================
    // ZONE 2: IN-PAGE PUSH (IPP) MULTITAG
    // =========================================================================
    zone2_ipp: {
        enabled: true,
        zoneId: "HT_ZONE_IPP_2002",
        scriptUrl: "https://ipp.hilltopads.net/tag?zone=2002_IPP_PLACEHOLDER", // Replace with your HilltopAds IPP script
        displayDelayMs: 2500, // Show notification after 2.5s of page exploration
        autoHideSeconds: 16,
        data: {
            title: "⚡ Exclusive Mod Dropped: RTX 5090 Ultra Shaders",
            body: "Cyberpunk & GTA V HD Photorealism pack 2026 is now live. Free download mirror ready!",
            icon: "🎮",
            badge: "COMMUNITY HOT",
            ctaText: "Get Mod Mirror",
            targetUrl: "https://go.nexusgaming.net/sl/ipp-mods?utm_source=hilltop&zone=2"
        }
    },

    // =========================================================================
    // ZONE 3: MULTITAG BANNERS (728x90 Top & 300x250 Sidebar)
    // =========================================================================
    zone3_banners: {
        enabled: true,
        topLeaderboard: {
            zoneId: "HT_ZONE_BANNER_728x90_3003",
            scriptUrl: "https://banner.hilltopads.net/multi?zone=3003_LEADERBOARD",
            containerId: "ad-slot-zone3-top-leaderboard",
            width: 728,
            height: 90
        },
        sidebarRectangle: {
            zoneId: "HT_ZONE_BANNER_300x250_3004",
            scriptUrl: "https://banner.hilltopads.net/multi?zone=3004_SIDEBAR_RECT",
            containerId: "ad-slot-zone3-sidebar-300x250",
            width: 300,
            height: 250
        }
    },

    // =========================================================================
    // ZONE 4: VIDEO SLIDER MULTITAG
    // =========================================================================
    zone4_videoSlider: {
        enabled: true,
        zoneId: "HT_ZONE_VIDEOSLIDER_4005",
        scriptUrl: "https://slider.hilltopads.net/video-slider?zone=4005_SLIDER",
        containerId: "ad-slot-zone4-video-slider",
        autoShowDelayMs: 4000,
        clickUrl: "https://go.nexusgaming.net/sl/video-slider-sponsor?utm_source=hilltop&zone=4"
    },

    // =========================================================================
    // ZONE 5: DIRECT LINK / SMARTLINK
    // =========================================================================
    zone5_directLink: {
        enabled: true,
        defaultUrl: "https://go.nexusgaming.net/sl/download-vault?utm_source=hilltop&zone=5_smartlink",
        tournamentUrl: "https://go.nexusgaming.net/sl/esports-bracket?utm_source=hilltop&zone=5_tournaments",
        modDownloadUrl: "https://go.nexusgaming.net/sl/fast-mod-cdn?utm_source=hilltop&zone=5_mods",
        showDownloadModal: true,
        modalDelayMs: 1400 // Brief cyber verification HUD before redirecting to SmartLink
    },

    // =========================================================================
    // ZONE 6: VIDEO VAST PREROLL
    // =========================================================================
    zone6_vast: {
        enabled: true,
        zoneId: "HT_ZONE_VAST_6006",
        vastTagUrl: "https://vast.hilltopads.net/vast.xml?zone=6006_VAST_GAMING",
        skipOffsetSeconds: 5,
        totalAdDuration: 15,
        clickThroughUrl: "https://go.nexusgaming.net/sl/vast-ad-click?utm_source=hilltop&zone=6_vast"
    }
};

/**
 * Logger helper
 */
function logAd(zoneName, message, data = null) {
    if (!HILLTOP_CONFIG.debug) return;
    const badgeStyle = 'background: #7928ca; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
    const textStyle = 'color: #00f0ff; font-weight: normal;';
    if (data) {
        console.log(`%c[HilltopAds ${zoneName}]%c ${message}`, badgeStyle, textStyle, data);
    } else {
        console.log(`%c[HilltopAds ${zoneName}]%c ${message}`, badgeStyle, textStyle);
    }
}

/**
 * ============================================================================
 * ZONE 1: POPUNDER / ONCLICK IMPLEMENTATION
 * ============================================================================
 */
function initZone1Popunder() {
    const cfg = HILLTOP_CONFIG.zone1_popunder;
    if (!cfg.enabled) return;

    logAd('Zone 1', 'Initializing Popunder / OnClick Listener...');

    // If publisher inserted live script tag, inject it
    if (cfg.scriptUrl && !cfg.scriptUrl.includes('PLACEHOLDER')) {
        const s = document.createElement('script');
        s.src = cfg.scriptUrl;
        s.async = true;
        s.setAttribute('data-zone', cfg.zoneId);
        document.head.appendChild(s);
        logAd('Zone 1', 'Injected live HilltopAds Popunder script');
    } else {
        // Fallback robust OnClick / Popunder handler with frequency capping
        const STORAGE_KEY = 'ht_popunder_last_fired';
        
        const canTriggerPopunder = () => {
            const last = localStorage.getItem(STORAGE_KEY);
            if (!last) return true;
            const elapsed = Date.now() - parseInt(last, 10);
            return elapsed > (cfg.frequencyCapHours * 60 * 60 * 1000);
        };

        const triggerPopunder = (e) => {
            // Avoid breaking internal interactive clicks on video player or form elements
            if (e.target.closest('#gameplay-video-player') || e.target.closest('input') || e.target.closest('textarea')) {
                return;
            }

            if (!canTriggerPopunder()) return;

            logAd('Zone 1', 'Triggering Popunder OnClick handler');
            localStorage.setItem(STORAGE_KEY, Date.now().toString());

            // Hilltop SmartLink Popunder window opener
            const popUrl = cfg.fallbackSmartLink;
            try {
                const popWin = window.open(popUrl, '_blank');
                if (popWin) {
                    popWin.blur();
                    window.focus();
                }
            } catch (err) {
                logAd('Zone 1', 'Popunder blocked by browser or failed', err);
            }

            // Remove listener after first qualified click per session
            document.removeEventListener('click', triggerPopunder, true);
        };

        // Attach to document body click
        setTimeout(() => {
            document.addEventListener('click', triggerPopunder, { once: false, capture: true });
        }, 1000);
    }
}

/**
 * ============================================================================
 * ZONE 2: IN-PAGE PUSH (IPP) MULTITAG IMPLEMENTATION
 * ============================================================================
 */
function initZone2InPagePush() {
    const cfg = HILLTOP_CONFIG.zone2_ipp;
    if (!cfg.enabled) return;

    logAd('Zone 2', 'Initializing In-Page Push (IPP) MultiTag...');

    // Check if live script provided
    if (cfg.scriptUrl && !cfg.scriptUrl.includes('PLACEHOLDER')) {
        const s = document.createElement('script');
        s.src = cfg.scriptUrl;
        s.async = true;
        document.body.appendChild(s);
        logAd('Zone 2', 'Injected live HilltopAds IPP script');
        return;
    }

    // Dynamic Cyber In-Page Push Widget
    setTimeout(() => {
        let container = document.getElementById('ad-slot-zone2-ipp');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ad-slot-zone2-ipp';
            container.className = 'cyber-ipp-container';
            document.body.appendChild(container);
        }

        container.innerHTML = `
            <div class="cyber-ipp-card" id="ipp-card-element">
                <div class="cyber-ipp-header">
                    <span class="cyber-ipp-badge">${cfg.data.badge}</span>
                    <button class="cyber-ipp-close" id="ipp-close-btn" title="Dismiss notification">&times;</button>
                </div>
                <div class="cyber-ipp-body">
                    <div class="cyber-ipp-icon">${cfg.data.icon}</div>
                    <div class="cyber-ipp-content">
                        <h4 class="cyber-ipp-title">${cfg.data.title}</h4>
                        <p class="cyber-ipp-desc">${cfg.data.body}</p>
                    </div>
                </div>
                <div class="cyber-ipp-actions">
                    <span class="cyber-ipp-sponsor">HilltopAds Partner MultiTag</span>
                    <a href="${cfg.data.targetUrl}" target="_blank" rel="noopener noreferrer" class="cyber-ipp-btn" id="ipp-action-btn">
                        ${cfg.data.ctaText} &rarr;
                    </a>
                </div>
            </div>
        `;

        // Entrance animation
        requestAnimationFrame(() => {
            const card = document.getElementById('ipp-card-element');
            if (card) card.classList.add('ipp-visible');
        });

        // Close button handler
        const closeBtn = document.getElementById('ipp-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dismissIPP();
            });
        }

        // Action click
        const actionBtn = document.getElementById('ipp-action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                logAd('Zone 2', 'IPP Clicked - navigating to SmartLink');
                setTimeout(dismissIPP, 200);
            });
        }

        // Auto hide timer
        if (cfg.autoHideSeconds > 0) {
            setTimeout(dismissIPP, cfg.autoHideSeconds * 1000);
        }

        function dismissIPP() {
            const card = document.getElementById('ipp-card-element');
            if (card) {
                card.classList.remove('ipp-visible');
                card.classList.add('ipp-hiding');
                setTimeout(() => {
                    if (container && container.parentNode) {
                        container.innerHTML = '';
                    }
                }, 400);
            }
        }
    }, cfg.displayDelayMs);
}

/**
 * ============================================================================
 * ZONE 3: MULTITAG BANNERS (728x90 Top & 300x250 Sidebar)
 * ============================================================================
 */
function initZone3Banners() {
    const cfg = HILLTOP_CONFIG.zone3_banners;
    if (!cfg.enabled) return;

    logAd('Zone 3', 'Initializing MultiTag Banners (728x90 & 300x250)...');

    // 1. Leaderboard 728x90
    const topSlot = document.getElementById(cfg.topLeaderboard.containerId);
    if (topSlot) {
        if (cfg.topLeaderboard.scriptUrl && !cfg.topLeaderboard.scriptUrl.includes('PLACEHOLDER')) {
            const s = document.createElement('script');
            s.src = cfg.topLeaderboard.scriptUrl;
            s.async = true;
            topSlot.appendChild(s);
            logAd('Zone 3', 'Loaded live 728x90 Top Banner script');
        } else {
            // High-aesthetic cyber placeholder banner
            topSlot.innerHTML = `
                <div class="cyber-banner-inner banner-728x90">
                    <div class="banner-tag">SPONSORED ADVERTISEMENT • HILLTOPADS ZONE 3 MULTITAG (728x90)</div>
                    <div class="banner-content">
                        <div class="banner-icon">⚡</div>
                        <div class="banner-text">
                            <span class="banner-headline">ULTRA-LOW LATENCY CLOUD GAMING RIGS</span>
                            <span class="banner-subline">Play Next-Gen Ray Tracing Titles Anywhere at 240 FPS • Instant Free Trial</span>
                        </div>
                        <a href="${HILLTOP_CONFIG.zone5_directLink.defaultUrl}" target="_blank" rel="noopener noreferrer" class="banner-cta-btn">
                            CLAIM ACCESS &rarr;
                        </a>
                    </div>
                    <div class="banner-glow-line"></div>
                </div>
            `;
        }
    }

    // 2. Sidebar 300x250
    const sideSlot = document.getElementById(cfg.sidebarRectangle.containerId);
    if (sideSlot) {
        if (cfg.sidebarRectangle.scriptUrl && !cfg.sidebarRectangle.scriptUrl.includes('PLACEHOLDER')) {
            const s = document.createElement('script');
            s.src = cfg.sidebarRectangle.scriptUrl;
            s.async = true;
            sideSlot.appendChild(s);
            logAd('Zone 3', 'Loaded live 300x250 Sidebar Banner script');
        } else {
            sideSlot.innerHTML = `
                <div class="cyber-banner-inner banner-300x250">
                    <div class="banner-tag">HILLTOPADS ZONE 3 (300x250 MULTITAG)</div>
                    <div class="banner-300-body">
                        <div class="banner-badge">PRO GAMER GEAR 2026</div>
                        <div class="banner-300-art">
                            <span class="gear-icon">🎧</span>
                            <span class="gear-pulse"></span>
                        </div>
                        <h4 class="banner-300-title">Quantum V9 Wireless 7.1 Headset</h4>
                        <p class="banner-300-desc">Spatial Audio Engine, 1ms 2.4GHz Wireless & AI Mic Denoise.</p>
                        <a href="${HILLTOP_CONFIG.zone5_directLink.defaultUrl}" target="_blank" rel="noopener noreferrer" class="banner-300-cta">
                            SHOP PRO DEALS &rarr;
                        </a>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * ============================================================================
 * ZONE 4: VIDEO SLIDER MULTITAG
 * ============================================================================
 */
function initZone4VideoSlider() {
    const cfg = HILLTOP_CONFIG.zone4_videoSlider;
    if (!cfg.enabled) return;

    logAd('Zone 4', 'Setting up Video Slider MultiTag widget...');

    setTimeout(() => {
        let container = document.getElementById(cfg.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = cfg.containerId;
            container.className = 'cyber-video-slider';
            document.body.appendChild(container);
        }

        // Live script integration or fallback cyber slider
        if (cfg.scriptUrl && !cfg.scriptUrl.includes('PLACEHOLDER')) {
            const s = document.createElement('script');
            s.src = cfg.scriptUrl;
            s.async = true;
            container.appendChild(s);
            logAd('Zone 4', 'Injected live HilltopAds Video Slider script');
            return;
        }

        container.innerHTML = `
            <div class="video-slider-box" id="slider-box-card">
                <div class="slider-header">
                    <span class="slider-badge"><span class="live-dot"></span> AD • HILLTOPADS VIDEO SLIDER</span>
                    <div class="slider-ctrls">
                        <button class="slider-min-btn" id="slider-min-btn" title="Minimize">−</button>
                        <button class="slider-close-btn" id="slider-close-btn" title="Close">&times;</button>
                    </div>
                </div>
                <div class="slider-video-wrapper" id="slider-media-body">
                    <div class="slider-video-poster">
                        <div class="slider-play-indicator">▶</div>
                        <div class="slider-video-title">Next-Gen Mech Warfare Tournament</div>
                        <div class="slider-sponsor-tag">Sponsor Spotlight</div>
                    </div>
                    <div class="slider-overlay-action">
                        <a href="${cfg.clickUrl}" target="_blank" rel="noopener noreferrer" class="slider-cta-btn">
                            Watch Trailer & Play Free &rarr;
                        </a>
                    </div>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            const box = document.getElementById('slider-box-card');
            if (box) box.classList.add('slider-active');
        });

        // Close button
        const closeBtn = document.getElementById('slider-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const box = document.getElementById('slider-box-card');
                if (box) {
                    box.classList.remove('slider-active');
                    setTimeout(() => container.remove(), 300);
                }
            });
        }

        // Minimize toggle
        const minBtn = document.getElementById('slider-min-btn');
        if (minBtn) {
            minBtn.addEventListener('click', () => {
                const box = document.getElementById('slider-box-card');
                if (box) {
                    box.classList.toggle('slider-minimized');
                    minBtn.textContent = box.classList.contains('slider-minimized') ? '+' : '−';
                }
            });
        }
    }, cfg.autoShowDelayMs);
}

/**
 * ============================================================================
 * ZONE 5: DIRECT LINK / SMARTLINK IMPLEMENTATION
 * Attached to "Download Game Mod", "Join Tournament" and custom CTAs
 * ============================================================================
 */
function initZone5SmartLink() {
    const cfg = HILLTOP_CONFIG.zone5_directLink;
    if (!cfg.enabled) return;

    logAd('Zone 5', 'Binding Direct Link / SmartLink to high-converting CTAs...');

    // 1. Download Mod Buttons
    const modButtons = document.querySelectorAll('.btn-download-mod, [data-ad-action="download-mod"]');
    modButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modTitle = btn.getAttribute('data-mod-title') || 'Featured Mod';
            const modVersion = btn.getAttribute('data-mod-version') || 'v2.4';
            handleDirectLinkAction({
                type: 'mod',
                title: modTitle,
                version: modVersion,
                url: cfg.modDownloadUrl || cfg.defaultUrl
            });
        });
    });

    // 2. Join Tournament Buttons
    const tourneyButtons = document.querySelectorAll('.btn-join-tournament, [data-ad-action="join-tournament"]');
    tourneyButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tourneyTitle = btn.getAttribute('data-tourney-name') || 'Apex Championship';
            const prize = btn.getAttribute('data-tourney-prize') || '$10,000';
            handleDirectLinkAction({
                type: 'tournament',
                title: tourneyTitle,
                prize: prize,
                url: cfg.tournamentUrl || cfg.defaultUrl
            });
        });
    });

    // Helper Modal & SmartLink Gateway
    function handleDirectLinkAction(data) {
        logAd('Zone 5', `Direct Link triggered for [${data.type}]: ${data.title}`);

        if (!cfg.showDownloadModal) {
            // Direct jump
            window.open(data.url, '_blank', 'noopener,noreferrer');
            return;
        }

        // Show High-Tech Cyber Verification Modal
        let modal = document.getElementById('nexus-smartlink-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'nexus-smartlink-modal';
            modal.className = 'cyber-modal-overlay';
            document.body.appendChild(modal);
        }

        const isMod = data.type === 'mod';
        const headline = isMod ? 'INITIALIZING HIGH-SPEED MOD MIRROR' : 'VERIFYING TOURNAMENT BRACKET SEAT';
        const subtext = isMod 
            ? `Preparing secure high-bandwidth CDN download package for <strong>${data.title} (${data.version})</strong>...`
            : `Connecting to official tournament ladder portal for <strong>${data.title}</strong> (${data.prize} Pool)...`;

        modal.innerHTML = `
            <div class="cyber-modal-dialog">
                <div class="cyber-modal-scanner"></div>
                <div class="cyber-modal-head">
                    <span class="cyber-modal-status"><span class="live-dot"></span> SECURE GATEWAY ENCRYPTED</span>
                    <span class="cyber-modal-zone">HILLTOPADS ZONE 5 SMARTLINK</span>
                </div>
                <h3 class="cyber-modal-title">${headline}</h3>
                <p class="cyber-modal-desc">${subtext}</p>
                <div class="cyber-modal-progress">
                    <div class="cyber-progress-bar" id="modal-progress-fill"></div>
                </div>
                <div class="cyber-modal-meta">
                    <span>STATUS: <span id="modal-status-text">Allocating high-speed mirror node...</span></span>
                    <span class="pulse-clock">2026 NEXUS PROTOCOL</span>
                </div>
                <div class="cyber-modal-footer">
                    <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="btn-proceed-directlink" id="btn-modal-proceed">
                        ${isMod ? 'Proceed to Download Mirror' : 'Proceed to Registration Arena'} &rarr;
                    </a>
                </div>
            </div>
        `;

        modal.classList.add('modal-active');

        // Animate progress
        const fill = document.getElementById('modal-progress-fill');
        const statusText = document.getElementById('modal-status-text');

        setTimeout(() => {
            if (fill) fill.style.width = '70%';
            if (statusText) statusText.textContent = 'Bypassing queues... Hilltop CDN link ready!';
        }, 500);

        setTimeout(() => {
            if (fill) fill.style.width = '100%';
            if (statusText) statusText.textContent = 'Redirecting to SmartLink destination...';
        }, 1100);

        // Open SmartLink in new tab automatically after delay
        setTimeout(() => {
            window.open(data.url, '_blank', 'noopener,noreferrer');
            setTimeout(() => {
                modal.classList.remove('modal-active');
            }, 600);
        }, cfg.modalDelayMs);

        // Modal backdrop click closes modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal-active');
            }
        });
    }
}

/**
 * ============================================================================
 * ZONE 6: VIDEO VAST PREROLL IMPLEMENTATION
 * Integrated with HTML5 Gameplay Highlights Player
 * ============================================================================
 */
function initZone6VideoVAST() {
    const cfg = HILLTOP_CONFIG.zone6_vast;
    if (!cfg.enabled) return;

    logAd('Zone 6', 'Hooking into Gameplay Highlights Video Player for VAST Preroll...');

    const playerContainer = document.getElementById('nexus-video-player-container');
    const video = document.getElementById('gameplay-video-player');
    const playBtn = document.getElementById('btn-video-play-pause');
    const vastOverlay = document.getElementById('vast-ad-overlay');
    const vastTimer = document.getElementById('vast-timer-count');
    const vastSkipBtn = document.getElementById('vast-skip-button');
    const vastLearnMore = document.getElementById('vast-learn-more');

    if (!playerContainer || !video || !vastOverlay) {
        logAd('Zone 6', 'Video player elements not found in DOM, skipping VAST bind');
        return;
    }

    let adPlayed = false;
    let adInterval = null;
    let currentAdSeconds = cfg.totalAdDuration;
    let skipOffset = cfg.skipOffsetSeconds;

    function startVastPreroll() {
        if (adPlayed) {
            playActualVideo();
            return;
        }

        logAd('Zone 6', 'Firing HilltopAds VAST Preroll Ad sequence...');
        vastOverlay.classList.remove('vast-hidden');
        vastOverlay.classList.add('vast-showing');

        // Pause main game video
        video.pause();

        currentAdSeconds = cfg.totalAdDuration;
        skipOffset = cfg.skipOffsetSeconds;
        updateVastTimerDisplay();

        // Count down
        adInterval = setInterval(() => {
            currentAdSeconds--;
            skipOffset--;

            updateVastTimerDisplay();

            if (currentAdSeconds <= 0) {
                finishVastAd();
            }
        }, 1000);
    }

    function updateVastTimerDisplay() {
        if (vastTimer) {
            vastTimer.textContent = `${currentAdSeconds}s`;
        }

        if (vastSkipBtn) {
            if (skipOffset > 0) {
                vastSkipBtn.disabled = true;
                vastSkipBtn.textContent = `Skip in ${skipOffset}s`;
                vastSkipBtn.classList.remove('skip-ready');
            } else {
                vastSkipBtn.disabled = false;
                vastSkipBtn.textContent = `Skip Ad ⏭`;
                vastSkipBtn.classList.add('skip-ready');
            }
        }
    }

    function finishVastAd() {
        if (adInterval) clearInterval(adInterval);
        adPlayed = true;
        logAd('Zone 6', 'VAST Preroll concluded. Resuming gameplay highlight clip.');

        vastOverlay.classList.remove('vast-showing');
        vastOverlay.classList.add('vast-hidden');

        playActualVideo();
    }

    function playActualVideo() {
        video.play().then(() => {
            if (playBtn) playBtn.innerHTML = '❚❚';
        }).catch(err => {
            logAd('Zone 6', 'Autoplay prevented by browser, waiting for user trigger', err);
            if (playBtn) playBtn.innerHTML = '▶';
        });
    }

    // Bind Skip Ad
    if (vastSkipBtn) {
        vastSkipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (skipOffset <= 0) {
                logAd('Zone 6', 'User skipped VAST ad');
                finishVastAd();
            }
        });
    }

    // Bind Learn More / Clickthrough
    if (vastLearnMore) {
        vastLearnMore.href = cfg.clickThroughUrl;
        vastLearnMore.addEventListener('click', () => {
            logAd('Zone 6', 'VAST Preroll Clickthrough triggered');
        });
    }

    // Video play trigger initiates VAST preroll first
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!adPlayed) {
                startVastPreroll();
            } else {
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '❚❚';
                } else {
                    video.pause();
                    playBtn.innerHTML = '▶';
                }
            }
        });
    }

    // Also trigger if user clicks on the video player directly
    video.addEventListener('click', () => {
        if (!adPlayed) {
            startVastPreroll();
        }
    });

    // Optional: Auto-start VAST preroll preview when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !adPlayed) {
                logAd('Zone 6', 'Video player entered viewport - readying VAST preroll ad');
                // We let user press play or auto-load
            }
        });
    }, { threshold: 0.5 });
    observer.observe(playerContainer);
}

/**
 * ============================================================================
 * MAIN INITIALIZATION ON DOM READY
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    logAd('System', 'NexusGaming Ad Engine Initialized. HilltopAds Multi-Zone Active.');

    // Initialize all 6 HilltopAds Zones
    initZone1Popunder();
    initZone2InPagePush();
    initZone3Banners();
    initZone4VideoSlider();
    initZone5SmartLink();
    initZone6VideoVAST();
});

// Export configuration for global runtime inspection
window.NexusHilltopAds = {
    config: HILLTOP_CONFIG,
    initZone1Popunder,
    initZone2InPagePush,
    initZone3Banners,
    initZone4VideoSlider,
    initZone5SmartLink,
    initZone6VideoVAST
};
