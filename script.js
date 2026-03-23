window.onerror = function(msg, src, line, col, err) {
    console.error(`ERROR: ${msg} at line ${line}:${col}`);
    return false;
};

document.addEventListener('DOMContentLoaded', () => {

    // =====================
    // DROPDOWN
    // =====================
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link-dropdown');

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    // =====================
    // FAQ ACCORDION
    // =====================
    const faqs = document.querySelectorAll('.faq');

    faqs.forEach(faq => {
        const question = faq.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = faq.classList.contains('open');
            faqs.forEach(f => f.classList.remove('open'));
            if (!isOpen) faq.classList.add('open');
        });
    });

    // =====================
    // COUNTRY CODE
    // =====================
    const countrySelect = document.querySelector('.country-select');
    const countryCodeText = document.querySelector('.country-code-text');

    if (countrySelect && countryCodeText) {
        countrySelect.addEventListener('change', () => {
            countryCodeText.textContent = countrySelect.value;
        });
    }

    // =====================
    // STICKY HEADER
    // =====================
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let firstFoldHeight = window.innerHeight;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > firstFoldHeight) {
            if (currentScrollY > lastScrollY) {
                // Scrolling DOWN — hide
                header.classList.add('header--hidden');
                header.classList.remove('header--visible');
            } else {
                // Scrolling UP — show
                header.classList.remove('header--hidden');
                header.classList.add('header--visible');
            }
        } else {
            // Above first fold — reset everything
            header.classList.remove('header--hidden');
            header.classList.remove('header--visible');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener('resize', () => {
        firstFoldHeight = window.innerHeight;
    });

    // =====================
    // IMAGE CAROUSEL
    // =====================
    (function() {
        const track = document.querySelector('.hero-img-track');
        const heroImages = document.querySelectorAll('.hero-img-track .hero-img');
        const thumbs = document.querySelectorAll('.small-img-div .thumb');
        const leftBtn = document.querySelector('.hero-left-button');
        const rightBtn = document.querySelector('.hero-right-button');
        const smallImgDiv = document.querySelector('.small-img-div');

        if (!track || !smallImgDiv) return;

        const THUMB_GAP = 12; // match your CSS gap
        const PARTIAL = 0.75; // 3/4 of thumb visible

        // ✅ Visible thumb count per breakpoint
        function getVisibleThumbs() {
            const w = window.innerWidth;
            if (w <= 360) return 4;
            if (w <= 800) return 6;
            if (w <= 1040) return 4; // 4 full + 3/4 fifth
            if (w <= 1200) return 5; // 5 full
            return 5; // 1440/1600 — 5 full + 3/4 sixth
        }

        function getPartialCount() {
            const w = window.innerWidth;
            if (w <= 360) return 0; // no partial
            if (w <= 800) return 0; // no partial
            if (w <= 1040) return 0.75; // 3/4 of 5th visible
            if (w <= 1200) return 0; // 5 full, no partial
            return 0.75; // 3/4 of 6th visible
        }

        // ✅ Calculate and set smallImgDiv width to show correct thumbs + partial
        function applyThumbWidth() {
            if (thumbs.length === 0) return;

            const thumbW = thumbs[0].offsetWidth; // actual thumb width
            const visible = getVisibleThumbs();
            const partial = getPartialCount();

            // width = (full thumbs * (thumbW + gap)) + (partial * thumbW) - last gap
            const totalWidth = (visible * (thumbW + THUMB_GAP)) +
                (partial * (thumbW + THUMB_GAP)) -
                THUMB_GAP;

            smallImgDiv.style.width = totalWidth + 'px';
            smallImgDiv.style.maxWidth = '100%';
        }

        let currentIndex = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragScrollStart = 0;

        function goToSlide(index) {
            if (index < 0) index = heroImages.length - 1;
            if (index >= heroImages.length) index = 0;

            currentIndex = index;

            // Slide main image
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update active thumbnail
            thumbs.forEach((t, i) => {
                t.classList.toggle('thumb--active', i === currentIndex);
            });

            // Auto scroll thumbnail strip only when active thumb out of view
            const activeThumb = thumbs[currentIndex];
            const thumbDivLeft = smallImgDiv.scrollLeft;
            const thumbDivRight = thumbDivLeft + smallImgDiv.offsetWidth;
            const thumbLeft = activeThumb.offsetLeft;
            const thumbRight = thumbLeft + activeThumb.offsetWidth;

            if (thumbRight > thumbDivRight) {
                smallImgDiv.scrollTo({
                    left: thumbRight - smallImgDiv.offsetWidth,
                    behavior: 'smooth'
                });
            } else if (thumbLeft < thumbDivLeft) {
                smallImgDiv.scrollTo({
                    left: thumbLeft,
                    behavior: 'smooth'
                });
            }
        }

        // Arrow buttons
        if (leftBtn) leftBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (rightBtn) rightBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Thumbnail clicks
        thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => goToSlide(i));
        });

        // Drag thumbnails
        smallImgDiv.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.pageX;
            dragScrollStart = smallImgDiv.scrollLeft;
            smallImgDiv.style.cursor = 'grabbing';
        });

        smallImgDiv.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            smallImgDiv.scrollLeft = dragScrollStart - (e.pageX - dragStartX);
        });

        smallImgDiv.addEventListener('mouseup', () => {
            isDragging = false;
            smallImgDiv.style.cursor = 'grab';
        });

        smallImgDiv.addEventListener('mouseleave', () => {
            isDragging = false;
            smallImgDiv.style.cursor = 'grab';
        });

        // Touch
        smallImgDiv.addEventListener('touchstart', (e) => {
            dragStartX = e.touches[0].pageX;
            dragScrollStart = smallImgDiv.scrollLeft;
        });

        smallImgDiv.addEventListener('touchmove', (e) => {
            smallImgDiv.scrollLeft = dragScrollStart - (e.touches[0].pageX - dragStartX);
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });

        // Recalculate on resize
        window.addEventListener('resize', () => {
            applyThumbWidth();
            goToSlide(currentIndex);
        });

        // Init
        smallImgDiv.style.cursor = 'grab';
        smallImgDiv.style.overflowX = 'auto';
        smallImgDiv.style.overflowY = 'hidden';
        smallImgDiv.style.scrollbarWidth = 'none';

        // Wait for thumbs to render before calculating width
        requestAnimationFrame(() => {
            applyThumbWidth();
        });

    })();


    // =====================
    // APPLICATION SLIDER
    // =====================
    (function() {
        const wrapper = document.querySelector('.application-slider-wrapper');
        const track = document.querySelector('.application-div');
        const leftBtn = document.querySelector('.app-left-button');
        const rightBtn = document.querySelector('.app-right-button');

        if (!track || !leftBtn || !rightBtn) return;

        const GAP = 16;
        const CARD_W = 420;
        const STEP = CARD_W + GAP; // 436px per slide
        const DRAG_THRESHOLD = 50;

        // ✅ Step 1 — Clone all cards for seamless loop
        const originals = [...track.children];
        const total = originals.length;

        // Append clones of ALL original cards at end
        originals.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        // Prepend clones of ALL original cards at start
        [...originals].reverse().forEach(card => {
            track.insertBefore(card.cloneNode(true), track.firstChild);
        });

        // ✅ Step 2 — Start position
        // index 0 = first original card
        // prepended = total clones before originals
        let currentIndex = 0;
        let isAnimating = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartIndex = 0;

        // Half card offset — shows last card as half on left
        const HALF_OFFSET = CARD_W / 2;

        function getTranslate(index) {
            // total prepended clones = total
            // so real index 0 is at position: total
            const pos = (index + total) * STEP - HALF_OFFSET;
            return -pos;
        }

        function setPosition(index, animate) {
            track.style.transition = animate ? 'transform 0.4s ease' : 'none';
            track.style.transform = `translateX(${getTranslate(index)}px)`;
            currentIndex = index;
        }

        // ✅ Step 3 — Seamless loop on transition end
        track.addEventListener('transitionend', () => {
            isAnimating = false;

            if (currentIndex >= total) {
                // Went past last original — jump to first
                setPosition(0, false);
            } else if (currentIndex < 0) {
                // Went before first original — jump to last
                setPosition(total - 1, false);
            }
        });

        // ✅ Step 4 — Navigation
        function next() {
            if (isAnimating) return;
            isAnimating = true;
            setPosition(currentIndex + 1, true);
        }

        function prev() {
            if (isAnimating) return;
            isAnimating = true;
            setPosition(currentIndex - 1, true);
        }

        rightBtn.addEventListener('click', next);
        leftBtn.addEventListener('click', prev);

        // ✅ Step 5 — Mouse drag
        track.addEventListener('mousedown', (e) => {
            if (isAnimating) return;
            isDragging = true;
            dragStartX = e.pageX;
            dragStartIndex = currentIndex;
            track.style.transition = 'none';
            track.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diff = e.pageX - dragStartX;
            const base = getTranslate(dragStartIndex);
            track.style.transform = `translateX(${base + diff}px)`;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('dragging');

            const diff = e.pageX - dragStartX;

            if (diff < -DRAG_THRESHOLD) {
                isAnimating = true;
                setPosition(dragStartIndex + 1, true);
            } else if (diff > DRAG_THRESHOLD) {
                isAnimating = true;
                setPosition(dragStartIndex - 1, true);
            } else {
                setPosition(dragStartIndex, true); // snap back
            }
        });

        // ✅ Step 6 — Touch drag
        track.addEventListener('touchstart', (e) => {
            if (isAnimating) return;
            dragStartX = e.touches[0].pageX;
            dragStartIndex = currentIndex;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const diff = e.touches[0].pageX - dragStartX;
            const base = getTranslate(dragStartIndex);
            track.style.transform = `translateX(${base + diff}px)`;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].pageX - dragStartX;
            if (diff < -DRAG_THRESHOLD) {
                isAnimating = true;
                setPosition(dragStartIndex + 1, true);
            } else if (diff > DRAG_THRESHOLD) {
                isAnimating = true;
                setPosition(dragStartIndex - 1, true);
            } else {
                setPosition(dragStartIndex, true);
            }
        });

        // ✅ Init — no animation, no margin
        track.style.margin = '0';
        setPosition(0, false);

    })();

    (function() {
        const tabs = document.querySelectorAll('.process-tab:not(.mobile-tab-label)');
        const panels = document.querySelectorAll('.process-panel');
        const mobilePrevBtn = document.querySelector('.mobile-prev-btn');
        const mobileNextBtn = document.querySelector('.mobile-next-btn');
        const mobileTabLabel = document.querySelector('.mobile-tab-label');
        const mobileTabCounter = document.querySelector('.mobile-tab-counter');

        const tabNames = [
            'Raw Material', 'Extrusion', 'Cooling', 'Sizing',
            'Quality Control', 'Marking', 'Cutting', 'Packaging'
        ];

        const sliderStates = new Map();
        let activeIndex = 0;

        // ---- SLIDER INIT ----
        function initSlider(panel) {
            const track = panel.querySelector('.process-img-track');
            const leftBtn = panel.querySelector('.process-left-button');
            const rightBtn = panel.querySelector('.process-right-button');

            if (!track || !leftBtn || !rightBtn) return;

            const images = track.querySelectorAll('.process-slider-img');
            const total = images.length;
            const DRAG_THRESHOLD = 50;

            const state = {
                currentIndex: 0,
                isAnimating: false,
                isDragging: false,
                dragStartX: 0,
                dragStartIndex: 0,
            };

            sliderStates.set(panel, state);

            function goTo(index, animate = true) {
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                track.style.transition = animate ? 'transform 0.4s ease' : 'none';
                track.style.transform = `translateX(-${index * 100}%)`;
                state.currentIndex = index;
            }

            track.addEventListener('transitionend', () => { state.isAnimating = false; });

            leftBtn.addEventListener('click', () => {
                if (state.isAnimating) return;
                state.isAnimating = true;
                goTo(state.currentIndex - 1);
            });

            rightBtn.addEventListener('click', () => {
                if (state.isAnimating) return;
                state.isAnimating = true;
                goTo(state.currentIndex + 1);
            });

            track.addEventListener('mousedown', (e) => {
                if (state.isAnimating) return;
                state.isDragging = true;
                state.dragStartX = e.pageX;
                state.dragStartIndex = state.currentIndex;
                track.style.transition = 'none';
                track.classList.add('dragging');

                function onMouseMove(e) {
                    if (!state.isDragging) return;
                    const diff = e.pageX - state.dragStartX;
                    const pct = (diff / track.offsetWidth) * 100;
                    track.style.transform = `translateX(${-(state.dragStartIndex * 100) + pct}%)`;
                }

                function onMouseUp(e) {
                    if (!state.isDragging) return;
                    state.isDragging = false;
                    track.classList.remove('dragging');
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    const diff = e.pageX - state.dragStartX;
                    state.isAnimating = true;
                    if (diff < -DRAG_THRESHOLD) goTo(state.dragStartIndex + 1);
                    else if (diff > DRAG_THRESHOLD) goTo(state.dragStartIndex - 1);
                    else goTo(state.dragStartIndex);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            track.addEventListener('touchstart', (e) => {
                state.dragStartX = e.touches[0].pageX;
                state.dragStartIndex = state.currentIndex;
                track.style.transition = 'none';
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                const diff = e.touches[0].pageX - state.dragStartX;
                const pct = (diff / track.offsetWidth) * 100;
                track.style.transform = `translateX(${-(state.dragStartIndex * 100) + pct}%)`;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].pageX - state.dragStartX;
                state.isAnimating = true;
                if (diff < -DRAG_THRESHOLD) goTo(state.dragStartIndex + 1);
                else if (diff > DRAG_THRESHOLD) goTo(state.dragStartIndex - 1);
                else goTo(state.dragStartIndex);
            });

            goTo(0, false);
        }

        // ---- SWITCH TAB — single function used by both desktop + mobile ----
        function switchTab(index) {
            if (index < 0 || index >= tabNames.length) return;
            activeIndex = index;

            // Update desktop tabs
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.process-tab[data-tab="${index}"]`);
            if (activeTab) activeTab.classList.add('active');

            // Update panels
            const currentPanel = document.querySelector('.process-panel.active');
            const newPanel = document.querySelector(`.process-panel[data-panel="${index}"]`);

            if (!newPanel || currentPanel === newPanel) return;

            // Fade out current
            if (currentPanel) currentPanel.style.opacity = '0';

            setTimeout(() => {
                if (currentPanel) currentPanel.classList.remove('active');
                newPanel.classList.add('active');
                newPanel.style.opacity = '0';
                newPanel.offsetHeight; // force reflow
                newPanel.style.opacity = '1';

                // Reset slider
                const newTrack = newPanel.querySelector('.process-img-track');
                if (newTrack) {
                    newTrack.style.transition = 'none';
                    newTrack.style.transform = 'translateX(0%)';
                }

                const state = sliderStates.get(newPanel);
                if (state) {
                    state.currentIndex = 0;
                    state.isAnimating = false;
                    state.isDragging = false;
                }
            }, 300);

            // Update mobile nav UI
            updateMobileUI(index);
        }

        // ---- UPDATE MOBILE UI ----
        function updateMobileUI(index) {
            if (mobileTabLabel) {
                mobileTabLabel.innerHTML = `Step <span class="mobile-tab-counter">${index + 1}/${tabNames.length}</span> : ${tabNames[index]}`;
            }
            if (mobilePrevBtn) {
                mobilePrevBtn.disabled = index === 0;
                mobilePrevBtn.style.opacity = index === 0 ? '0.3' : '1';
            }
            if (mobileNextBtn) {
                mobileNextBtn.disabled = index === tabNames.length - 1;
                mobileNextBtn.style.opacity = index === tabNames.length - 1 ? '0.3' : '1';
            }
        }

        // ---- DESKTOP TAB CLICKS ----
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const index = parseInt(tab.dataset.tab);
                if (!isNaN(index)) switchTab(index);
            });
        });

        // ---- MOBILE NAV BUTTONS ----
        if (mobilePrevBtn) {
            mobilePrevBtn.addEventListener('click', () => {
                switchTab(activeIndex - 1);
            });
        }

        if (mobileNextBtn) {
            mobileNextBtn.addEventListener('click', () => {
                switchTab(activeIndex + 1);
            });
        }

        // ---- INIT ----
        panels.forEach(panel => initSlider(panel));
        updateMobileUI(0);

    })();


    // =====================
    // RESULTS SLIDER
    // =====================
    (function() {
        const track = document.querySelector('.results-slider-div');
        const wrapper = document.querySelector('.results-slider-wrapper')

        if (!track || !wrapper) return;

        const CARD_W = 420;
        const GAP = 24;
        const STEP = CARD_W + GAP;
        const DRAG_THRESHOLD = 50;
        const AUTOPLAY_DELAY = 3000; // 3 seconds

        // ✅ Clone all cards for infinite loop
        const originals = [...track.children];
        const total = originals.length;

        originals.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });
        [...originals].reverse().forEach(card => {
            track.insertBefore(card.cloneNode(true), track.firstChild);
        });

        let currentIndex = 0;
        let isAnimating = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartIndex = 0;
        let autoplayTimer = null;



        function getTranslate(index) {
            const HALF = CARD_W / 2;
            return -((index + total) * STEP - HALF);
        }

        // ✅ Correct
        function goTo(index, animate = true) {
            track.style.transition = animate ? 'transform 0.4s ease' : 'none';
            track.style.transform = `translateX(${getTranslate(index)}px)`;
            currentIndex = index;
        }
        // ✅ Seamless loop
        track.addEventListener('transitionend', () => {
            isAnimating = false;
            if (currentIndex >= total) {
                goTo(0, false);
            } else if (currentIndex < 0) {
                goTo(total - 1, false);
            }
        });

        // ✅ Autoplay
        function startAutoplay() {
            autoplayTimer = setInterval(() => {
                if (!isAnimating) {
                    isAnimating = true;
                    goTo(currentIndex + 1, true);
                }
            }, AUTOPLAY_DELAY);
        }

        function stopAutoplay() {
            clearInterval(autoplayTimer);
        }

        // ✅ Mouse drag
        track.addEventListener('mousedown', (e) => {
            if (isAnimating) return;
            isDragging = true;
            dragStartX = e.pageX;
            dragStartIndex = currentIndex;
            track.style.transition = 'none';
            track.classList.add('dragging');
            stopAutoplay();

            function onMouseMove(e) {
                if (!isDragging) return;
                const diff = e.pageX - dragStartX;
                track.style.transform =
                    `translateX(${getTranslate(dragStartIndex) + diff}px)`;
            }

            function onMouseUp(e) {
                if (!isDragging) return;
                isDragging = false;
                track.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const diff = e.pageX - dragStartX;
                isAnimating = true;
                if (diff < -DRAG_THRESHOLD) {
                    goTo(dragStartIndex + 1, true);
                } else if (diff > DRAG_THRESHOLD) {
                    goTo(dragStartIndex - 1, true);
                } else {
                    goTo(dragStartIndex, true);
                }
                startAutoplay();
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Pause autoplay on hover
        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);

        // ✅ Touch drag
        track.addEventListener('touchstart', (e) => {
            dragStartX = e.touches[0].pageX;
            dragStartIndex = currentIndex;
            track.style.transition = 'none';
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const diff = e.touches[0].pageX - dragStartX;
            track.style.transform =
                `translateX(${getTranslate(dragStartIndex) + diff}px)`;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].pageX - dragStartX;
            isAnimating = true;
            if (diff < -DRAG_THRESHOLD) {
                goTo(dragStartIndex + 1, true);
            } else if (diff > DRAG_THRESHOLD) {
                goTo(dragStartIndex - 1, true);
            } else {
                goTo(dragStartIndex, true);
            }
            startAutoplay();
        });

        // Init
        track.style.margin = '0';
        goTo(0, false);
        startAutoplay();

    })();


    // =====================
    // COMPANIES SLIDER
    // =====================
    (function() {
        const wrapper = document.querySelector('.companies-slider-wrapper');
        const track = document.querySelector('.companies-div');

        if (!track || !wrapper) return;

        const GAP = 20;
        const AUTOPLAY_SPEED = 2000;
        const DRAG_THRESHOLD = 50;

        // ✅ Step 1 — clone before anything else
        const originals = Array.from(track.children);
        const total = originals.length;

        originals.forEach(el => track.appendChild(el.cloneNode(true)));
        [...originals].reverse().forEach(el => {
            track.insertBefore(el.cloneNode(true), track.firstChild);
        });

        const allCards = Array.from(track.children);

        // ✅ Step 2 — calculate sizes
        function getVisible() {
            const w = window.innerWidth;
            if (w <= 360) return 3;
            if (w <= 800) return 4;
            if (w <= 1200) return 5;
            return 6;
        }

        function getCardW() {
            const vis = getVisible();
            return Math.floor((wrapper.offsetWidth - GAP * (vis - 1)) / vis);
        }

        function getStep() {
            return getCardW() + GAP;
        }

        function applyWidths() {
            const w = getCardW();
            allCards.forEach(c => {
                c.style.width = w + 'px';
                c.style.minWidth = w + 'px';
            });
        }

        // ✅ Step 3 — translate
        // Cards layout: [total clones] [originals] [total clones]
        // index 0 = first original = position total in array
        function translate(index) {
            return -((index + total) * getStep());
        }

        let idx = 0;
        let busy = false;
        let timer = null;

        function go(index, anim) {
            track.style.transition = anim ? 'transform 0.4s ease' : 'none';
            track.style.transform = 'translateX(' + translate(index) + 'px)';
            idx = index;
        }

        // ✅ Step 4 — infinite loop on transition end
        track.addEventListener('transitionend', () => {
            busy = false;
            if (idx >= total) {
                go(0, false);
            } else if (idx < 0) {
                go(total - 1, false);
            }
        });

        // ✅ Step 5 — autoplay
        function play() {
            stop();
            timer = setInterval(() => {
                if (!busy) {
                    busy = true;
                    go(idx + 1, true);
                }
            }, AUTOPLAY_SPEED);
        }

        function stop() {
            clearInterval(timer);
        }

        wrapper.addEventListener('mouseenter', stop);
        wrapper.addEventListener('mouseleave', play);

        // ✅ Step 6 — drag
        let dragging = false;
        let startX = 0;
        let startIdx = 0;

        track.addEventListener('mousedown', (e) => {
            if (busy) return;
            dragging = true;
            startX = e.pageX;
            startIdx = idx;
            track.style.transition = 'none';
            track.classList.add('dragging');
            stop();

            function move(e) {
                if (!dragging) return;
                track.style.transform =
                    'translateX(' + (translate(startIdx) + e.pageX - startX) + 'px)';
            }

            function up(e) {
                if (!dragging) return;
                dragging = false;
                track.classList.remove('dragging');
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                const diff = e.pageX - startX;
                busy = true;
                if (diff < -DRAG_THRESHOLD) go(startIdx + 1, true);
                else if (diff > DRAG_THRESHOLD) go(startIdx - 1, true);
                else go(startIdx, true);
                play();
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        // Touch
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startIdx = idx;
            track.style.transition = 'none';
            stop();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            track.style.transform =
                'translateX(' + (translate(startIdx) + e.touches[0].pageX - startX) + 'px)';
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].pageX - startX;
            busy = true;
            if (diff < -DRAG_THRESHOLD) go(startIdx + 1, true);
            else if (diff > DRAG_THRESHOLD) go(startIdx - 1, true);
            else go(startIdx, true);
            play();
        });

        window.addEventListener('resize', () => {
            stop();
            applyWidths();
            go(idx, false);
            play();
        });

        // ✅ Step 7 — init after paint
        requestAnimationFrame(() => {
            setTimeout(() => {
                applyWidths();
                go(0, false);
                play();
            }, 100);
        });

    })();

});