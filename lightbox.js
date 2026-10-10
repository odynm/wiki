/* fictwiki-lightbox: click any article image for fullscreen view */
(function () {
  function closeBox() {
    var box = document.querySelector(".fictwiki-lightbox");
    if (box) box.remove();
  }
  function pick(img) {
    // only content images: skip flags, icons and tiny thumbs
    if (!img) return null;
    if (img.closest(".flagicon")) return null;
    var w = img.naturalWidth || img.width || 0;
    if (w > 0 && w < 60) return null;
    if (!img.closest("#mw-content-text")) return null;
    return img;
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeBox();
  });
  document.addEventListener(
    "click",
    function (e) {
      var box = e.target && e.target.closest ? e.target.closest(".fictwiki-lightbox") : null;
      if (box) {
        if (e.target.closest(".fictwiki-lightbox-close") || e.target === box) closeBox();
        return;
      }
      var t = e.target && e.target.closest ? e.target.closest("img") : null;
      var img = pick(t);
      if (!img) return;
      if (e.preventDefault) e.preventDefault();
      closeBox();
      var overlay = document.createElement("div");
      overlay.className = "fictwiki-lightbox";
      var full = document.createElement("img");
      full.src = img.currentSrc || img.src;
      full.alt = img.alt || "";
      try {
        var cs = window.getComputedStyle(img);
        if (cs && cs.filter && cs.filter !== "none") full.style.filter = cs.filter;
      } catch (err) {}
      if (img.style && img.style.filter) full.style.filter = img.style.filter;
      var x = document.createElement("div");
      x.className = "fictwiki-lightbox-close";
      x.textContent = "×";
      x.setAttribute("role", "button");
      x.setAttribute("aria-label", "Close");
      overlay.appendChild(full);
      overlay.appendChild(x);
      document.body.appendChild(overlay);
    },
    true
  );
})();
