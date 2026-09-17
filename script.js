(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  const year = document.getElementById("year");
  const progressBar = document.getElementById("progress-bar");
  const revealItems = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "#top");
      const topEl = document.getElementById("top");
      if (topEl) topEl.focus({ preventScroll: true });
    });
  }

  const onScroll = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    if (progressBar) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const value = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = `${value}%`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
        navLinks.forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  revealItems.forEach((el, index) => {
    el.style.setProperty("--delay", `${Math.min(index % 5, 4) * 55}ms`);
  });

  if (prefersReducedMotion) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Interactive product showcase stage */
  const filters = document.querySelectorAll(".proj-filter");
  const dataNodes = Array.from(document.querySelectorAll("#proj-data article"));
  const rail = document.getElementById("proj-rail");
  const stageFrame = document.querySelector(".proj-stage__frame");
  const stageImg = document.getElementById("proj-stage-img");
  const stageTags = document.getElementById("proj-stage-tags");
  const stageKicker = document.getElementById("proj-stage-kicker");
  const stageTitle = document.getElementById("proj-stage-title");
  const stageDesc = document.getElementById("proj-stage-desc");
  const stageRole = document.getElementById("proj-stage-role");
  const stageTech = document.getElementById("proj-stage-tech");
  const counter = document.getElementById("proj-counter");
  const prevBtn = document.getElementById("proj-prev");
  const nextBtn = document.getElementById("proj-next");
  const galleryBtn = document.getElementById("proj-gallery-btn");
  const stageHit = document.getElementById("proj-stage-hit");
  const caseStudy = document.getElementById("case-study");
  const caseScroll = document.getElementById("case-study-scroll");
  const caseKicker = document.getElementById("case-kicker");
  const caseTitle = document.getElementById("case-title");
  const caseHeroImg = document.getElementById("case-hero-img");
  const caseStory = document.getElementById("case-story");
  const caseVideoBlock = document.getElementById("case-video-block");
  const caseVideoFrame = document.getElementById("case-video-frame");
  const caseVideo = document.getElementById("case-video");
  const caseVideoPlay = document.getElementById("case-video-play");
  const caseMosaic = document.getElementById("case-mosaic");
  const caseFeatures = document.getElementById("case-features");
  const caseTech = document.getElementById("case-tech");
  const caseTechFacts = document.getElementById("case-tech-facts");
  const caseGithubBlock = document.getElementById("case-github-block");
  const caseGithub = document.getElementById("case-github");
  const caseGithubText = document.getElementById("case-github-text");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  if (filters.length && dataNodes.length && rail && stageImg) {
    const splitPipe = (value) =>
      (value || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

    const projects = dataNodes.map((node, index) => ({
      index,
      category: node.getAttribute("data-category") || "personal",
      img: node.getAttribute("data-img") || "",
      year: node.getAttribute("data-year") || "",
      domain: node.getAttribute("data-domain") || "",
      title: node.getAttribute("data-title") || "Project",
      role: node.getAttribute("data-role") || "",
      tech: splitPipe(node.getAttribute("data-tech")),
      gallery: splitPipe(node.getAttribute("data-gallery")),
      labels: splitPipe(node.getAttribute("data-gallery-labels")),
      video: (node.getAttribute("data-video") || "").trim(),
      cover: (node.getAttribute("data-cover") || "").trim(),
      features: splitPipe(node.getAttribute("data-features")).map((item) => {
        const [title, detail] = item.split("::").map((part) => part.trim());
        return { title: title || item, detail: detail || "" };
      }),
      github: (node.getAttribute("data-github") || "").trim(),
      desc: (node.querySelector("p")?.textContent || "").trim(),
    }));

    const techIconMap = {
      "C#": "devicon-csharp-plain colored",
      "C": "devicon-c-plain colored",
      ".NET 7.0": "devicon-dotnetcore-plain colored",
      ".NET Core": "devicon-dotnetcore-plain colored",
      "ASP.NET Core": "devicon-dotnetcore-plain colored",
      "Angular 16": "devicon-angularjs-plain colored",
      Angular: "devicon-angularjs-plain colored",
      "MS SQL": "devicon-microsoftsqlserver-plain colored",
      Python: "devicon-python-plain colored",
      Unity: "devicon-unity-plain colored",
      ReactJS: "devicon-react-original colored",
      React: "devicon-react-original colored",
      Tailwind: "devicon-tailwindcss-original colored",
      Firebase: "devicon-firebase-plain colored",
      MongoDB: "devicon-mongodb-plain colored",
      "Spring Boot": "devicon-spring-original colored",
      Flutter: "devicon-flutter-plain colored",
      Figma: "devicon-figma-plain colored",
    };

    const techGlyphMap = {
      "AI APIs": "AI",
      CNN: "ML",
      LLM: "AI",
      OpenAI: "AI",
      Atmega32: "HW",
      "Machine Learning": "ML",
    };

    const renderTechChip = (tech) => {
      const span = document.createElement("span");
      span.className = "proj-tech-chip";
      const iconClass = techIconMap[tech];
      const glyph = techGlyphMap[tech];

      if (iconClass) {
        span.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>${tech}`;
      } else if (glyph) {
        span.innerHTML = `<span class="mini-glyph" aria-hidden="true">${glyph}</span>${tech}`;
      } else {
        span.textContent = tech;
      }
      return span;
    };

    let activeFilter = "all";
    let activeIndex = 0;
    let autoTimer = null;
    let resumeTimer = null;
    let caseOpen = false;
    let lightboxOpen = false;
    let lightboxIndex = 0;
    let lastFocus = null;
    let caseRevealObserver = null;
    let videoObserver = null;
    const AUTO_MS = 6500;
    const RESUME_MS = 10000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoBar = document.getElementById("proj-auto-bar");
    const preloaded = new Set();

    const preloadImage = (src) => {
      if (!src || preloaded.has(src)) return;
      preloaded.add(src);
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    };

    const preloadNeighbors = (index) => {
      const visible = visibleIndexes();
      if (!visible.length) return;
      let pos = visible.indexOf(index);
      if (pos < 0) pos = 0;
      const next = visible[(pos + 1) % visible.length];
      const prev = visible[(pos - 1 + visible.length) % visible.length];
      preloadImage(projects[next]?.img);
      preloadImage(projects[prev]?.img);
    };

    const resetAutoBar = () => {
      if (!autoBar) return;
      autoBar.style.transition = "none";
      autoBar.style.width = "0%";
    };

    const runAutoBar = () => {
      if (!autoBar || reduceMotion) return;
      resetAutoBar();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          autoBar.style.transition = `width ${AUTO_MS}ms linear`;
          autoBar.style.width = "100%";
        });
      });
    };

    const visibleIndexes = () =>
      projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => activeFilter === "all" || project.category === activeFilter)
        .map(({ index }) => index);

    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
      resetAutoBar();
    };

    const startAuto = () => {
      if (reduceMotion || caseOpen) return;
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      stopAuto();
      runAutoBar();
      autoTimer = window.setInterval(() => {
        move(1);
        runAutoBar();
      }, AUTO_MS);
    };

    const pauseAutoTemporarily = () => {
      stopAuto();
      if (resumeTimer) window.clearTimeout(resumeTimer);
      if (reduceMotion || caseOpen) return;
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        startAuto();
      }, RESUME_MS);
    };

    const labelFor = (project, index) =>
      project.labels[index] || `Screenshot ${index + 1}`;

    const stopCaseVideo = () => {
      if (!caseVideo) return;
      caseVideo.pause();
      caseVideo.removeAttribute("src");
      caseVideo.load();
      if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
    };

    const tryAutoplayVideo = () => {
      if (!caseVideo || !caseVideo.src || reduceMotion) return;
      caseVideo.muted = true;
      const playPromise = caseVideo.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            if (caseVideoFrame) caseVideoFrame.classList.add("is-playing");
          })
          .catch(() => {
            if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
          });
      }
    };

    const observeCaseReveals = () => {
      if (!caseStudy) return;
      const reveals = caseStudy.querySelectorAll(".case-reveal, .case-mosaic__item");
      reveals.forEach((el) => el.classList.remove("is-in"));

      if (caseRevealObserver) caseRevealObserver.disconnect();

      if (reduceMotion) {
        reveals.forEach((el) => el.classList.add("is-in"));
        return;
      }

      caseRevealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = Number(el.dataset.delay || 0);
            window.setTimeout(() => el.classList.add("is-in"), delay);
            caseRevealObserver.unobserve(el);
          });
        },
        { root: caseScroll, threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );

      reveals.forEach((el) => caseRevealObserver.observe(el));
    };

    const observeVideo = () => {
      if (videoObserver) {
        videoObserver.disconnect();
        videoObserver = null;
      }
      if (!caseVideoBlock || caseVideoBlock.hidden || !caseVideo || reduceMotion) return;

      videoObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) tryAutoplayVideo();
          else if (caseVideo && !caseVideo.paused) {
            caseVideo.pause();
            if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
          }
        },
        { root: caseScroll, threshold: 0.55 }
      );
      videoObserver.observe(caseVideoBlock);
    };

    const renderMosaic = (project) => {
      if (!caseMosaic) return;
      caseMosaic.innerHTML = "";
      const mosaicImages = project.cover ? project.gallery : project.gallery.slice(1);
      const indexOffset = project.cover ? 0 : 1;
      mosaicImages.forEach((src, mosaicIndex) => {
        const imageIndex = mosaicIndex + indexOffset;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "case-mosaic__item";
        btn.dataset.delay = String(mosaicIndex * 90);
        btn.setAttribute("aria-label", `Open ${labelFor(project, imageIndex)}`);
        btn.innerHTML = `
          <img src="${src}" alt="${labelFor(project, imageIndex)}" loading="lazy" decoding="async" />
          <span class="case-mosaic__label">${labelFor(project, imageIndex)}</span>
        `;
        btn.addEventListener("click", () => openLightbox(imageIndex));
        caseMosaic.appendChild(btn);
      });
    };

    const populateCaseStudy = (project) => {
      if (caseKicker) {
        caseKicker.textContent = `${project.category} · ${project.year}${project.domain ? ` · ${project.domain}` : ""}`;
      }
      if (caseTitle) caseTitle.textContent = project.title;
      if (caseStory) caseStory.textContent = project.desc;

      const heroSrc = project.cover || project.gallery[0] || project.img;
      if (caseHeroImg) {
        caseHeroImg.src = heroSrc;
        caseHeroImg.alt = `${project.title} cover`;
      }

      if (caseVideoBlock && caseVideo) {
        if (project.video) {
          caseVideoBlock.hidden = false;
          caseVideo.poster = heroSrc;
          caseVideo.src = project.video;
          caseVideo.muted = true;
          caseVideo.controls = true;
          caseVideo.playsInline = true;
          caseVideo.setAttribute("controlsList", "nodownload");
          caseVideo.setAttribute("disablePictureInPicture", "");
          if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
        } else {
          caseVideoBlock.hidden = true;
          stopCaseVideo();
        }
      }

      renderMosaic(project);

      if (caseFeatures) {
        caseFeatures.innerHTML = "";
        const featureList = project.features.length
          ? project.features
          : [
              { title: "Full-stack implementation", detail: "End-to-end feature delivery across UI and backend." },
              { title: "Responsive interface", detail: "Layouts that stay clear on desktop and mobile." },
              { title: "Production-ready architecture", detail: "Structured for maintainable, scalable growth." },
            ];

        featureList.forEach((feature, index) => {
          const card = document.createElement("article");
          card.className = "case-feature-card";
          card.style.setProperty("--i", String(index));
          card.innerHTML = `
            <span class="case-feature-card__num">${String(index + 1).padStart(2, "0")}</span>
            <div class="case-feature-card__body">
              <h4>${feature.title}</h4>
              ${feature.detail ? `<p>${feature.detail}</p>` : ""}
            </div>
          `;
          caseFeatures.appendChild(card);
        });
      }

      if (caseTech) {
        caseTech.innerHTML = "";
        project.tech.forEach((tech) => caseTech.appendChild(renderTechChip(tech)));
      }

      if (caseTechFacts) {
        caseTechFacts.innerHTML = "";
        const facts = [
          ["Role", project.role ? project.role.replace(/^Role:\s*/i, "") : ""],
          ["Domain", project.domain],
          ["Year", project.year],
          ["Category", project.category],
        ].filter(([, value]) => Boolean(value));

        facts.forEach(([label, value]) => {
          const dt = document.createElement("dt");
          dt.textContent = label;
          const dd = document.createElement("dd");
          dd.textContent = value;
          caseTechFacts.appendChild(dt);
          caseTechFacts.appendChild(dd);
        });
      }

      if (caseGithubBlock && caseGithub) {
        if (project.github) {
          caseGithubBlock.hidden = false;
          caseGithub.href = project.github;
          if (caseGithubText) {
            caseGithubText.textContent = `Browse the ${project.title} repository on GitHub.`;
          }
        } else {
          caseGithubBlock.hidden = true;
          caseGithub.removeAttribute("href");
        }
      }
    };

    const openCaseStudy = () => {
      const project = projects[activeIndex];
      if (!project?.gallery?.length || !caseStudy) return;

      lastFocus = document.activeElement;
      caseOpen = true;
      stopAuto();
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }

      populateCaseStudy(project);
      if (caseScroll) caseScroll.scrollTop = 0;

      caseStudy.hidden = false;
      caseStudy.setAttribute("aria-hidden", "false");
      caseStudy.classList.add("is-open");
      document.body.classList.add("gallery-open");

      window.requestAnimationFrame(() => {
        observeCaseReveals();
        observeVideo();
      });

      const closeBtn = caseStudy.querySelector(".case-study__close");
      if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
      if (!lightbox || !lightboxOpen) return;
      lightboxOpen = false;
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.classList.remove("is-open");
      if (lightboxImg) {
        lightboxImg.removeAttribute("src");
        lightboxImg.alt = "";
      }
    };

    const closeCaseStudy = () => {
      if (!caseStudy || !caseOpen) return;
      closeLightbox();
      caseOpen = false;
      stopCaseVideo();
      if (caseRevealObserver) caseRevealObserver.disconnect();
      if (videoObserver) videoObserver.disconnect();
      caseStudy.classList.remove("is-open");
      caseStudy.hidden = true;
      caseStudy.setAttribute("aria-hidden", "true");
      document.body.classList.remove("gallery-open");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      if (sectionInView && !resumeTimer) startAuto();
    };

    const renderLightbox = () => {
      const project = projects[activeIndex];
      if (!project?.gallery?.length || !lightboxImg) return;
      const src = project.gallery[lightboxIndex];
      lightboxImg.src = src;
      lightboxImg.alt = `${project.title} — ${labelFor(project, lightboxIndex)}`;
      if (lightboxCaption) lightboxCaption.textContent = labelFor(project, lightboxIndex);
      if (lightboxCounter) {
        lightboxCounter.textContent = `${String(lightboxIndex + 1).padStart(2, "0")} / ${String(project.gallery.length).padStart(2, "0")}`;
      }
    };

    const openLightbox = (index) => {
      const project = projects[activeIndex];
      if (!project?.gallery?.length || !lightbox) return;
      lightboxIndex = index;
      lightboxOpen = true;
      renderLightbox();
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.classList.add("is-open");
      const closeBtn = lightbox.querySelector(".lightbox__close");
      if (closeBtn) closeBtn.focus();
    };

    const moveLightbox = (direction) => {
      const project = projects[activeIndex];
      if (!project?.gallery?.length) return;
      lightboxIndex = (lightboxIndex + direction + project.gallery.length) % project.gallery.length;
      renderLightbox();
    };

    const renderRail = () => {
      rail.innerHTML = "";
      projects.forEach((project, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "proj-rail__item";
        btn.dataset.index = String(index);
        btn.dataset.category = project.category;
        if (activeFilter !== "all" && project.category !== activeFilter) {
          btn.classList.add("is-hidden");
        }

        const thumb = project.img
          ? `<img class="proj-rail__thumb" src="${project.img}" alt="" loading="lazy" decoding="async" width="148" height="58" />`
          : `<span class="proj-rail__thumb proj-rail__thumb--ph">Soon</span>`;

        btn.innerHTML = `
          ${thumb}
          <span class="proj-rail__meta">
            <strong>${project.title}</strong>
            <span>${project.category}</span>
          </span>
        `;

        btn.addEventListener("click", () => {
          pauseAutoTemporarily();
          showProject(index);
        });
        rail.appendChild(btn);
      });
    };

    const showProject = (index) => {
      const project = projects[index];
      if (!project) return;
      activeIndex = index;

      if (stageFrame) stageFrame.classList.add("is-switching");
      stageImg.classList.remove("is-live");

      window.setTimeout(() => {
        if (project.img) {
          stageImg.hidden = false;
          stageImg.decoding = "async";
          if (stageImg.getAttribute("src") !== project.img) {
            stageImg.src = project.img;
          }
          stageImg.alt = `${project.title} project preview`;
        } else {
          stageImg.hidden = true;
          stageImg.removeAttribute("src");
          stageImg.alt = "";
        }

        stageKicker.textContent = `${project.category} · ${project.year}`;
        stageTitle.textContent = project.title;
        stageDesc.textContent = project.desc;
        if (project.role) {
          stageRole.hidden = false;
          stageRole.innerHTML = `<span>Role</span> ${project.role.replace(/^Role:\s*/i, "")}`;
        } else {
          stageRole.hidden = true;
          stageRole.textContent = "";
        }

        stageTags.innerHTML = "";
        [project.category, project.year, project.domain]
          .filter(Boolean)
          .forEach((tag) => {
            const span = document.createElement("span");
            span.textContent = tag;
            stageTags.appendChild(span);
          });

        stageTech.innerHTML = "";
        project.tech.forEach((tech) => {
          stageTech.appendChild(renderTechChip(tech));
        });

        if (galleryBtn) {
          const hasGallery = project.gallery.length > 0;
          galleryBtn.hidden = !hasGallery;
          galleryBtn.setAttribute("aria-hidden", String(!hasGallery));
        }

        if (stageHit) {
          const hasGallery = project.gallery.length > 0;
          stageHit.hidden = !hasGallery;
          stageHit.setAttribute("aria-hidden", String(!hasGallery));
        }

        if (stageFrame) {
          stageFrame.classList.toggle("has-gallery", project.gallery.length > 0);
        }

        const visible = visibleIndexes();
        const position = Math.max(0, visible.indexOf(index)) + 1;
        counter.textContent = `${String(position).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;

        rail.querySelectorAll(".proj-rail__item").forEach((item) => {
          item.classList.toggle("is-active", Number(item.dataset.index) === index);
        });

        const activeRailItem = rail.querySelector(".proj-rail__item.is-active");
        if (activeRailItem) {
          const left =
            activeRailItem.offsetLeft - (rail.clientWidth - activeRailItem.clientWidth) / 2;
          rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
        }

        if (stageFrame) stageFrame.classList.remove("is-switching");
        if (project.img) stageImg.classList.add("is-live");
        else stageImg.classList.remove("is-live");
        preloadNeighbors(index);
      }, 120);
    };

    const move = (direction) => {
      const visible = visibleIndexes();
      if (!visible.length) return;
      let pos = visible.indexOf(activeIndex);
      if (pos < 0) pos = 0;
      pos = (pos + direction + visible.length) % visible.length;
      showProject(visible[pos]);
    };

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        pauseAutoTemporarily();
        activeFilter = btn.getAttribute("data-filter") || "all";
        filters.forEach((item) => {
          const active = item === btn;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });

        rail.querySelectorAll(".proj-rail__item").forEach((item) => {
          const category = item.dataset.category;
          const show = activeFilter === "all" || category === activeFilter;
          item.classList.toggle("is-hidden", !show);
        });

        const visible = visibleIndexes();
        showProject(visible[0] ?? 0);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        pauseAutoTemporarily();
        move(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        pauseAutoTemporarily();
        move(1);
      });
    }

    if (galleryBtn) {
      galleryBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        openCaseStudy();
      });
    }

    if (stageHit) {
      stageHit.addEventListener("click", openCaseStudy);
    }

    if (caseStudy) {
      caseStudy.querySelectorAll("[data-case-close]").forEach((el) => {
        el.addEventListener("click", closeCaseStudy);
      });
    }

    // Cover is display-only — no lightbox link

    if (caseVideoPlay && caseVideo) {
      caseVideo.addEventListener("contextmenu", (event) => event.preventDefault());
      caseVideoPlay.addEventListener("click", () => {
        caseVideo.muted = false;
        caseVideo.controls = true;
        caseVideo.setAttribute("controlsList", "nodownload");
        const playPromise = caseVideo.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => {
              if (caseVideoFrame) caseVideoFrame.classList.add("is-playing");
            })
            .catch(() => {
              if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
            });
        }
      });
      caseVideo.addEventListener("play", () => {
        if (caseVideoFrame) caseVideoFrame.classList.add("is-playing");
      });
      caseVideo.addEventListener("pause", () => {
        if (caseVideoFrame && caseVideo.currentTime > 0 && !caseVideo.ended) {
          caseVideoFrame.classList.remove("is-playing");
        }
      });
      caseVideo.addEventListener("ended", () => {
        if (caseVideoFrame) caseVideoFrame.classList.remove("is-playing");
      });
    }

    if (lightbox) {
      lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
        el.addEventListener("click", closeLightbox);
      });
    }
    if (lightboxPrev) lightboxPrev.addEventListener("click", () => moveLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => moveLightbox(1));

    document.addEventListener("keydown", (event) => {
      if (lightboxOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeLightbox();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveLightbox(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          moveLightbox(1);
        }
        return;
      }

      if (caseOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeCaseStudy();
        }
        return;
      }

      const section = document.getElementById("projects");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (event.key === "ArrowLeft") {
        pauseAutoTemporarily();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        pauseAutoTemporarily();
        move(1);
      }
    });

    const stage = document.querySelector(".proj-stage");
    if (stage) {
      stage.addEventListener("mouseenter", stopAuto);
      stage.addEventListener("mouseleave", () => {
        if (!resumeTimer && !caseOpen) startAuto();
      });
      stage.addEventListener("focusin", stopAuto);
      stage.addEventListener("focusout", (event) => {
        if (!stage.contains(event.relatedTarget) && !resumeTimer && !caseOpen) startAuto();
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else if (sectionInView && !caseOpen) startAuto();
    });

    const projectsSection = document.getElementById("projects");
    let sectionInView = false;
    if (projectsSection && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => {
          sectionInView = entry.isIntersecting;
          if (sectionInView) {
            if (!resumeTimer && !caseOpen) startAuto();
          } else {
            stopAuto();
          }
        },
        { threshold: 0.2 }
      );
      io.observe(projectsSection);
    } else {
      sectionInView = true;
      startAuto();
    }

    renderRail();
    showProject(0);
  }

  /* Subtle hero parallax + magnetic buttons */
  if (!prefersReducedMotion) {
    const heroVisual = document.querySelector(".hero__visual");
    const heroPhoto = document.querySelector(".hero__photo");
    if (heroVisual && heroPhoto) {
      heroVisual.addEventListener("mousemove", (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroPhoto.style.transform = `translate(${x * 10}px, ${y * 8}px) scale(1.02)`;
      });
      heroVisual.addEventListener("mouseleave", () => {
        heroPhoto.style.transform = "";
      });
    }

    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (event) => {
        const rect = btn.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Stat count-up */
  const counters = document.querySelectorAll(".hero__stats [data-count]");
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    if (prefersReducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const countIo = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll("[data-count]").forEach(animateCount);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      const statsWrap = document.querySelector(".hero__stats");
      if (statsWrap) countIo.observe(statsWrap);
    } else {
      counters.forEach(animateCount);
    }
  }

  /* Timeline line draw */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    if (prefersReducedMotion) {
      timeline.classList.add("is-drawn");
    } else if ("IntersectionObserver" in window) {
      const lineIo = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-drawn");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );
      lineIo.observe(timeline);
    } else {
      timeline.classList.add("is-drawn");
    }
  }

  /* Hide scroll cue after leaving hero */
  const heroScroll = document.querySelector(".hero__scroll");
  const heroSection = document.querySelector(".hero");
  if (heroScroll && heroSection && "IntersectionObserver" in window) {
    const cueIo = new IntersectionObserver(
      ([entry]) => {
        heroScroll.classList.toggle("is-away", !entry.isIntersecting);
      },
      { threshold: 0.55 }
    );
    cueIo.observe(heroSection);
  }
})();
