(function () {
  var $ = function (s) {
      return document.querySelector(s);
    },
    $$ = function (s) {
      return Array.prototype.slice.call(document.querySelectorAll(s));
    };
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* battery pack illustration: cells lit by charge level */
  $$("svg[data-pack]").forEach(function (sv) {
    var lv = parseFloat(sv.dataset.pack),
      cols = 10,
      rows = 5,
      h =
        '<rect x="10" y="10" width="396" height="218" rx="16" fill="none" stroke="#86A3AB" stroke-width="3"/><rect x="408" y="88" width="14" height="62" rx="4" fill="#86A3AB"/>';
    for (var c = 0; c < cols; c++)
      for (var r = 0; r < rows; r++) {
        h +=
          '<rect x="' +
          (26 + c * 37) +
          '" y="' +
          (26 + r * 38) +
          '" width="29" height="30" rx="4" fill="' +
          (c < Math.round(cols * lv) ? "#F2B134" : "rgba(255,255,255,.13)") +
          '"/>';
      }
    h +=
      '<text x="10" y="266" fill="#EAF2F1" font-family="Schibsted Grotesk,sans-serif" font-weight="700" font-size="17">Aegis LFP 90</text><text x="406" y="266" text-anchor="end" fill="#B9CDD1" font-family="Public Sans,sans-serif" font-size="15">Charged ' +
      Math.round(lv * 100) +
      "%</text>";
    sv.innerHTML = h;
  });

  /* slider */
  var sl = $$(".slide"),
    ce = $$(".cell"),
    hero = $("#hero"),
    cur = 0,
    tm,
    paused = false;
  function go(n) {
    cur = (n + sl.length) % sl.length;
    sl.forEach(function (s, i) {
      s.classList.toggle("on", i === cur);
      s.setAttribute("aria-hidden", i !== cur);
    });
    ce.forEach(function (c, i) {
      c.classList.remove("on", "done");
      void c.offsetWidth;
      if (i < cur) c.classList.add("done");
      if (i === cur) c.classList.add("on");
      c.setAttribute("aria-selected", i === cur);
    });
    $("#cnt").textContent = "Slide " + (cur + 1) + " of " + sl.length;
    clearTimeout(tm);
    if (!paused && !rm)
      tm = setTimeout(function () {
        go(cur + 1);
      }, 7000);
  }
  ce.forEach(function (c, i) {
    c.onclick = function () {
      go(i);
    };
  });
  $("#pv").onclick = function () {
    go(cur - 1);
  };
  $("#nx").onclick = function () {
    go(cur + 1);
  };
  var pb = $("#ps");
  pb.onclick = function () {
    paused = !paused;
    hero.classList.toggle("p", paused);
    pb.textContent = paused ? "Play" : "Pause";
    pb.setAttribute("aria-pressed", paused);
    if (paused) clearTimeout(tm);
    else go(cur);
  };
  hero.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });
  var x0 = null;
  hero.addEventListener(
    "touchstart",
    function (e) {
      x0 = e.touches[0].clientX;
    },
    { passive: true },
  );
  hero.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1));
    x0 = null;
  });
  if (rm) {
    paused = true;
    pb.hidden = true;
  }

  /* hash-based router */
  var T = {
    home: "Voltera Energi | Aegis LFP 90 electric vehicle battery",
    product: "Aegis LFP 90 | Advantages and specifications | Voltera",
  };
  function route() {
    var h = location.hash.replace(/^#\/?/, ""),
      p = h === "product";
    $("#home").hidden = p;
    $("#product").hidden = !p;
    document.title = p ? T.product : T.home;
    $$("nav a[data-r]").forEach(function (a) {
      a.removeAttribute("aria-current");
    });
    var act = $('nav a[data-r="' + (p ? "product" : "home") + '"]');
    if (h === "" || p) act.setAttribute("aria-current", "page");
    $("#nv").classList.remove("o");
    $("#mt").setAttribute("aria-expanded", "false");
    var tg = !p && h && document.getElementById(h);
    if (tg)
      setTimeout(function () {
        tg.scrollIntoView();
      }, 30);
    else window.scrollTo({ top: 0, behavior: "instant" });
    if (!p) go(0);
    else {
      clearTimeout(tm);
      reveal();
    }
  }
  window.addEventListener("hashchange", route);

  /* comparison bars: fill when visible */
  var io;
  function reveal() {
    var c = $("#cmp");
    if (!c) return;
    c.classList.remove("in");
    if (!("IntersectionObserver" in window)) {
      c.classList.add("in");
      return;
    }
    io && io.disconnect();
    io = new IntersectionObserver(
      function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) {
            c.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(c);
  }
  $$("[data-sc]").forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
      document.getElementById(a.dataset.sc).scrollIntoView();
    };
  });

  /* mobile menu */
  $("#mt").onclick = function () {
    var o = $("#nv").classList.toggle("o");
    this.setAttribute("aria-expanded", o);
  };

  /* contact form */
  $("#fm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    function chk(id, eid, bad, msg) {
      var el = $(id);
      el.setAttribute("aria-invalid", bad);
      $(eid).textContent = bad ? msg : "";
      if (bad && ok) {
        el.focus();
        ok = false;
      }
    }
    chk("#nm", "#e-nm", !$("#nm").value.trim(), "Enter your name.");
    chk(
      "#em",
      "#e-em",
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#em").value),
      "Enter a valid email, for example name@company.com.",
    );
    chk(
      "#ps2",
      "#e-ps",
      $("#ps2").value.trim().length < 10,
      "Describe your needs in at least 10 characters.",
    );
    if (!ok) return;
    var o = $("#ok");
    o.hidden = false;
    o.textContent =
      "Thank you, " +
      $("#nm").value.trim() +
      ". We have received your message and our technical team will reply to " +
      $("#em").value.trim() +
      " within 24 business hours.";
    this.reset();
  });

  route();
  if (!location.hash) go(0);
})();
