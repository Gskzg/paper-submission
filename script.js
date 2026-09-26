/* ============================================================
   Anonymous project page — vanilla JS, no dependencies.
   1) 缺失图片/视频自动变成带文件名的虚线占位框，不会出现裂图
   2) 场景 tab 切换（支持键盘左右方向键）
   3) 点击图片打开灯箱
   4) 复制 BibTeX
   5) 顶部导航高亮当前章节
   ============================================================ */

(function () {
    "use strict";

    /* ---------- 1. 缺失素材 → 占位框 ---------- */

    function markMissing(el) {
        var frame = el.closest(".frame");
        if (frame) {
            frame.classList.add("is-missing");
        }
    }

    document.querySelectorAll("img[data-ph]").forEach(function (img) {
        img.addEventListener("error", function () {
            markMissing(img);
        });

        // 脚本执行前可能已经加载失败（例如缓存过的 404）
        if (img.complete && img.naturalWidth === 0) {
            markMissing(img);
        }
    });

    document.querySelectorAll("video[data-ph]").forEach(function (video) {
        var source = video.querySelector("source");

        function checkSource() {
            if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
                markMissing(video);
            }
        }

        video.addEventListener("error", function () {
            markMissing(video);
        });

        if (source) {
            source.addEventListener("error", function () {
                markMissing(video);
            });
        }

        video.addEventListener("loadedmetadata", function () {
            var frame = video.closest(".frame");
            if (frame) {
                frame.classList.remove("is-missing");
            }
        });

        window.setTimeout(checkSource, 300);
    });

    /* ---------- 2. 场景 tab ---------- */

    document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
        var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));

        function activate(index, focus) {
            buttons.forEach(function (button, i) {
                var panel = document.getElementById(button.getAttribute("aria-controls"));
                var active = i === index;

                button.classList.toggle("is-active", active);
                button.setAttribute("aria-selected", active ? "true" : "false");
                button.tabIndex = active ? 0 : -1;

                if (panel) {
                    panel.classList.toggle("is-active", active);
                }
            });

            if (focus) {
                buttons[index].focus();
            }
        }

        buttons.forEach(function (button, i) {
            button.addEventListener("click", function () {
                activate(i, false);
            });

            button.addEventListener("keydown", function (event) {
                var step = 0;

                if (event.key === "ArrowRight") {
                    step = 1;
                } else if (event.key === "ArrowLeft") {
                    step = -1;
                } else if (event.key === "Home") {
                    event.preventDefault();
                    activate(0, true);
                    return;
                } else if (event.key === "End") {
                    event.preventDefault();
                    activate(buttons.length - 1, true);
                    return;
                } else {
                    return;
                }

                event.preventDefault();
                activate((i + step + buttons.length) % buttons.length, true);
            });
        });
    });

    /* ---------- 3. 灯箱 ---------- */

    var lightbox = document.querySelector("[data-lightbox]");

    if (lightbox) {
        var lightboxImg = lightbox.querySelector(".lightbox__img");
        var lightboxCaption = lightbox.querySelector(".lightbox__caption");
        var closeButton = lightbox.querySelector(".lightbox__close");
        var lastFocus = null;

        function closeLightbox() {
            lightbox.hidden = true;
            lightboxImg.removeAttribute("src");
            document.body.style.overflow = "";

            if (lastFocus) {
                lastFocus.focus();
            }
        }

        function openLightbox(img) {
            var frame = img.closest(".frame");
            var label = frame ? frame.querySelector("figcaption") : null;

            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || "";
            lightboxCaption.textContent = label ? label.textContent.trim() : (img.alt || "");

            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
            lastFocus = img;
            closeButton.focus();
        }

        document.querySelectorAll(".frame img").forEach(function (img) {
            img.addEventListener("click", function () {
                var frame = img.closest(".frame");
                if (frame && frame.classList.contains("is-missing")) {
                    return;
                }
                openLightbox(img);
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox || event.target === lightboxImg) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }

    /* ---------- 4. 复制 BibTeX ---------- */

    document.querySelectorAll("[data-copy]").forEach(function (button) {
        button.addEventListener("click", function () {
            var target = document.querySelector(button.getAttribute("data-copy"));
            var status = button.parentElement.querySelector(".copy-status");

            if (!target) {
                return;
            }

            var text = target.innerText;

            function report(message) {
                if (status) {
                    status.textContent = message;
                    window.setTimeout(function () {
                        status.textContent = "";
                    }, 2400);
                }
            }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(
                    function () {
                        report("Copied to clipboard.");
                    },
                    function () {
                        report("Copy failed — select the block and press Cmd/Ctrl+C.");
                    }
                );
                return;
            }

            var area = document.createElement("textarea");
            area.value = text;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();

            try {
                document.execCommand("copy");
                report("Copied to clipboard.");
            } catch (error) {
                report("Copy failed — select the block and press Cmd/Ctrl+C.");
            }

            document.body.removeChild(area);
        });
    });

    /* ---------- 5. 导航高亮 ---------- */

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".topnav__links a"));
    var sections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    navLinks.forEach(function (link) {
                        link.classList.toggle(
                            "is-current",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                });
            },
            { rootMargin: "-70px 0px -70% 0px", threshold: 0 }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });

        // 回到页面顶部时清掉高亮，避免停留在上一次的章节
        window.addEventListener("scroll", function () {
            if (window.scrollY < 120) {
                navLinks.forEach(function (link) {
                    link.classList.remove("is-current");
                });
            }
        }, { passive: true });
    }
})();
