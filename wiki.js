/* ===== fictwiki-theme ===== */
(function () {
        var h = document.documentElement,
          DAY = "skin-theme-clientpref-day",
          NIGHT = "skin-theme-clientpref-night",
          KEY = "fictwiki-theme",
          SEL = 'input[name="skin-client-pref-skin-theme-group"]';
        function apply(m) {
          if (m !== "night") m = "day";
          h.classList.remove(DAY, NIGHT);
          h.classList.add(m === "night" ? NIGHT : DAY);
          try {
            localStorage.setItem(KEY, m);
          } catch (e) {}
          var r = document.querySelector(SEL + '[value="' + m + '"]');
          if (r) r.checked = true;
        }
        var s = null;
        try {
          s = localStorage.getItem(KEY);
        } catch (e) {}
        apply(s);
        var rs = document.querySelectorAll(SEL);
        for (var i = 0; i < rs.length; i++)
          (function (r) {
            r.addEventListener("change", function () {
              if (r.checked) apply(r.value);
            });
          })(rs[i]);
      })();

/* ===== fictwiki-redlinks-js ===== */
(function () {
        if (location.protocol === "file:") return;
        function internal(h) {
          if (!h || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(h)) return false;
          if (/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|pdf|mp4|webm|mp3|ogg|json|xml|txt|woff2?|ttf)(?:[?#]|$)/i.test(h)) return false;
          return true;
        }
        function mark(l) {
          for (var k = 0; k < l.length; k++) l[k].classList.add("new");
        }
        function probe(u, l) {
          fetch(u, { method: "HEAD", credentials: "same-origin" }).then(
            function (r) {
              if (r.ok) return;
              if (r.status === 405 || r.status === 403) {
                fetch(u, { credentials: "same-origin" }).then(
                  function (r2) {
                    if (!r2.ok) mark(l);
                  },
                  function () {},
                );
              } else mark(l);
            },
            function () {},
          );
        }
        var map = {},
          as = document.querySelectorAll("a[href]"),
          i,
          h,
          u;
        for (i = 0; i < as.length; i++) {
          h = as[i].getAttribute("href");
          if (!internal(h)) continue;
          u = h.split("#")[0];
          (map[u] = map[u] || []).push(as[i]);
        }
        Object.keys(map).forEach(function (u) {
          probe(u, map[u]);
        });
      })();

/* ===== fictwiki-toc-js ===== */
(function () {
        var ts = document.querySelectorAll(".vector-toc-toggle");
        for (var i = 0; i < ts.length; i++)
          (function (b) {
            var id = b.getAttribute("aria-controls");
            var ul = id && document.getElementById(id);
            if (!ul) return;
            b.addEventListener("click", function () {
              var li = b.closest("li.vector-toc-level-1");
              var open = b.getAttribute("aria-expanded") === "true";
              b.setAttribute("aria-expanded", open ? "false" : "true");
              if (li) {
                if (open) li.classList.remove("vector-toc-list-item-expanded");
                else li.classList.add("vector-toc-list-item-expanded");
              }
            });
          })(ts[i]);
      })();

/* ===== fictwiki-toc-spy ===== */
(function () {
        var list = document.getElementById("mw-panel-toc-list") || document.querySelector("ul.vector-toc-contents");
        if (!list) return;
        var links = list.querySelectorAll('a.vector-toc-link[href^="#"]');
        var items = [];
        for (var i = 0; i < links.length; i++) {
          var id = links[i].getAttribute("href").slice(1);
          if (!id) continue;
          var h = null;
          try {
            h = document.getElementById(decodeURIComponent(id));
          } catch (e) {
            h = document.getElementById(id);
          }
          if (!h) continue;
          var li = links[i].closest("li.vector-toc-list-item");
          if (li) items.push({ li: li, h: h });
        }
        function clear() {
          var act = list.querySelectorAll(".vector-toc-list-item-active,.vector-toc-level-1-active");
          for (var i = 0; i < act.length; i++) {
            act[i].classList.remove("vector-toc-list-item-active");
            act[i].classList.remove("vector-toc-level-1-active");
          }
        }
        function setActive(it) {
          clear();
          var top = it.li.classList.contains("vector-toc-level-1") ? it.li : it.li.closest("li.vector-toc-level-1");
          var open = top && top.classList.contains("vector-toc-list-item-expanded");
          if (top && top !== it.li && !open) {
            top.classList.add("vector-toc-list-item-active");
            top.classList.add("vector-toc-level-1-active");
          } else {
            it.li.classList.add("vector-toc-list-item-active");
            if (top) top.classList.add("vector-toc-level-1-active");
          }
        }
        var tick = false;
        function update() {
          tick = false;
          var best = null;
          for (var i = 0; i < items.length; i++) {
            var t = items[i].h.getBoundingClientRect().top;
            if (t <= 140) best = items[i];
            else break;
          }
          if (!best && items.length) best = items[0];
          if (best) setActive(best);
        }
        function onScroll() {
          if (tick) return;
          tick = true;
          if (window.requestAnimationFrame) window.requestAnimationFrame(update);
          else update();
        }
        list.addEventListener("click", function (e) {
          var t = e.target && e.target.closest ? e.target.closest(".vector-toc-toggle") : null;
          if (t) onScroll();
        });
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      })();

/* ===== fictwiki-img-fallback ===== */
(function () {
    var FB = "./misc/black.jpg";
    document.addEventListener(
      "error",
      function (e) {
        var t = e.target;
        if (t && t.tagName === "IMG" && t.getAttribute("src") !== FB && !t.dataset.fbfb) {
          t.dataset.fbfb = "1";
          t.src = FB;
        }
      },
      true,
    );
  })();
