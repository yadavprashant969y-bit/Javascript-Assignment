/* ========================================
   WorkNest – Remote Job Aggregator
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ──────────────────────────────────────
    // 1. Mobile Navigation Toggle
    // ──────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
            });
        });
    }

    // ──────────────────────────────────────
    // 2. Smooth Scrolling
    // ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ──────────────────────────────────────
    // 3. Scroll-Reveal Animation
    // ──────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(function (el) {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // trigger on load

    // ──────────────────────────────────────
    // 4. Multi-Filter Search (Jobs Page)
    // ──────────────────────────────────────
    const applyFiltersBtn = document.getElementById('applyFilters');
    const jobsGrid = document.getElementById('jobsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const activeFiltersEl = document.getElementById('activeFilters');

    if (applyFiltersBtn && jobsGrid) {
        applyFiltersBtn.addEventListener('click', function () {
            filterJobs();
        });

        // Also filter when select/input changes
        const filterCategory = document.getElementById('filterCategory');
        const filterTimezone = document.getElementById('filterTimezone');
        const filterSalaryMin = document.getElementById('filterSalaryMin');
        const filterSalaryMax = document.getElementById('filterSalaryMax');
        const workTypeRadios = document.querySelectorAll('input[name="workType"]');

        if (filterCategory) {
            filterCategory.addEventListener('change', filterJobs);
        }
        if (filterTimezone) {
            filterTimezone.addEventListener('change', filterJobs);
        }
        if (filterSalaryMin) {
            filterSalaryMin.addEventListener('input', filterJobs);
        }
        if (filterSalaryMax) {
            filterSalaryMax.addEventListener('input', filterJobs);
        }
        workTypeRadios.forEach(function (radio) {
            radio.addEventListener('change', filterJobs);
        });
    }

    function filterJobs() {
        const category = document.getElementById('filterCategory').value;
        const timezone = document.getElementById('filterTimezone').value;
        const salaryMin = parseInt(document.getElementById('filterSalaryMin').value) || 0;
        const salaryMax = parseInt(document.getElementById('filterSalaryMax').value) || 999;
        const workType = document.querySelector('input[name="workType"]:checked').value;

        const allCards = jobsGrid.querySelectorAll('.job-card');
        let visibleCount = 0;

        allCards.forEach(function (card) {
            const cardCategory = card.getAttribute('data-category');
            const cardTimezone = card.getAttribute('data-timezone');
            const cardSalaryMin = parseInt(card.getAttribute('data-salary-min')) || 0;
            const cardSalaryMax = parseInt(card.getAttribute('data-salary-max')) || 999;
            const cardType = card.getAttribute('data-type');

            let show = true;

            // Category filter
            if (category && cardCategory !== category) {
                show = false;
            }

            // Timezone filter
            if (timezone) {
                if (timezone === 'any') {
                    if (cardTimezone !== 'any') {
                        show = false;
                    }
                } else if (cardTimezone !== timezone && cardTimezone !== 'any') {
                    show = false;
                }
            }

            // Salary range filter
            if (salaryMin > 0 && cardSalaryMax < salaryMin) {
                show = false;
            }
            if (salaryMax > 0 && salaryMax < 999 && cardSalaryMin > salaryMax) {
                show = false;
            }

            // Work type filter
            if (workType && cardType !== workType) {
                show = false;
            }

            if (show) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.4s ease-out both';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.animation = '';
            }
        });

        // Update results count
        if (resultsCount) {
            resultsCount.innerHTML = 'Showing <strong>' + visibleCount + '</strong> remote job' + (visibleCount !== 1 ? 's' : '');
        }

        // Update active filter tags
        updateActiveFilters(category, timezone, salaryMin, salaryMax, workType);
    }

    function updateActiveFilters(category, timezone, salaryMin, salaryMax, workType) {
        if (!activeFiltersEl) return;
        activeFiltersEl.innerHTML = '';

        if (category) {
            addFilterTag('Category: ' + capitalizeFirst(category), function () {
                document.getElementById('filterCategory').value = '';
                filterJobs();
            });
        }
        if (timezone) {
            addFilterTag('Timezone: ' + capitalizeFirst(timezone), function () {
                document.getElementById('filterTimezone').value = '';
                filterJobs();
            });
        }
        if (salaryMin > 0) {
            addFilterTag('Min: $' + salaryMin + 'K', function () {
                document.getElementById('filterSalaryMin').value = '';
                filterJobs();
            });
        }
        if (salaryMax > 0 && salaryMax < 999) {
            addFilterTag('Max: $' + salaryMax + 'K', function () {
                document.getElementById('filterSalaryMax').value = '';
                filterJobs();
            });
        }
        if (workType) {
            addFilterTag('Type: ' + capitalizeFirst(workType), function () {
                document.querySelector('input[name="workType"][value=""]').checked = true;
                filterJobs();
            });
        }
    }

    function addFilterTag(text, onRemove) {
        const tag = document.createElement('span');
        tag.className = 'active-filter-tag';
        tag.innerHTML = text + ' <button aria-label="Remove filter">&times;</button>';
        tag.querySelector('button').addEventListener('click', onRemove);
        activeFiltersEl.appendChild(tag);
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ──────────────────────────────────────
    // 5. Toast Notification Utility
    // ──────────────────────────────────────
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = message;
        toast.classList.add('show');

        setTimeout(function () {
            toast.classList.remove('show');
        }, 3500);
    }

    // ──────────────────────────────────────
    // 6. Job Application Form (Details Page)
    // ──────────────────────────────────────
    const jobAppForm = document.getElementById('jobApplicationForm');
    if (jobAppForm) {
        jobAppForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('applicantName').value.trim();
            const email = document.getElementById('applicantEmail').value.trim();

            if (!name || !email) {
                showToast('Please fill in all required fields.');
                return;
            }

            showToast('🎉 Application submitted successfully! We\'ll be in touch.');
            jobAppForm.reset();
        });
    }

    // ──────────────────────────────────────
    // 7. Resume Upload Form (Resume Page)
    // ──────────────────────────────────────
    const resumeForm = document.getElementById('resumeUploadForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('resumeName').value.trim();
            const email = document.getElementById('resumeEmail').value.trim();

            if (!name || !email) {
                showToast('Please fill in your name and email.');
                return;
            }

            showToast('🚀 Resume submitted for boost! Check status below.');
            resumeForm.reset();

            // Simulate advancing the status tracker
            advanceBoostStatus();
        });
    }

    // ──────────────────────────────────────
    // 8. Resume Boost Status Updates
    // ──────────────────────────────────────
    function advanceBoostStatus() {
        const steps = document.querySelectorAll('.status-step');
        if (!steps.length) return;

        // Find the current active step
        let activeIndex = -1;
        steps.forEach(function (step, i) {
            if (step.classList.contains('active')) {
                activeIndex = i;
            }
        });

        if (activeIndex < steps.length - 1) {
            // Mark current as completed
            steps[activeIndex].classList.remove('active');
            steps[activeIndex].classList.add('completed');
            steps[activeIndex].querySelector('.step-circle').textContent = '✓';

            // Mark next as active
            const nextStep = steps[activeIndex + 1];
            nextStep.classList.add('active');

            // If it's the last step, mark completed too after a delay
            if (activeIndex + 1 === steps.length - 1) {
                setTimeout(function () {
                    nextStep.classList.remove('active');
                    nextStep.classList.add('completed');
                    nextStep.querySelector('.step-circle').textContent = '✓';
                    showToast('✅ Your boosted resume is ready for download!');
                }, 2500);
            }
        }
    }

    // Premium button interaction
    const premiumBtn = document.getElementById('getPremiumBtn');
    if (premiumBtn) {
        premiumBtn.addEventListener('click', function () {
            showToast('🎉 Premium Boost activated! Upload your resume to get started.');
            premiumBtn.textContent = '✓ Activated';
            premiumBtn.style.opacity = '0.7';
            premiumBtn.style.pointerEvents = 'none';
        });
    }

    // ──────────────────────────────────────
    // 9. Contact Form (Contact Page)
    // ──────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all required fields.');
                return;
            }

            showToast('📨 Message sent successfully! We\'ll reply within 24 hours.');
            contactForm.reset();
        });
    }

    // ──────────────────────────────────────
    // 10. Bookmark Toggle
    // ──────────────────────────────────────
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (this.textContent.includes('☆')) {
                this.textContent = '★';
                this.style.color = 'var(--clr-warning)';
                showToast('⭐ Job saved to bookmarks!');
            } else if (this.textContent.trim() === '★') {
                this.textContent = '☆';
                this.style.color = '';
                showToast('Bookmark removed.');
            }
        });
    });

    // ──────────────────────────────────────
    // 11. Header scroll effect
    // ──────────────────────────────────────
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(11, 15, 26, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            } else {
                header.style.background = 'rgba(11, 15, 26, 0.85)';
                header.style.boxShadow = 'none';
            }
        });
    }

});
