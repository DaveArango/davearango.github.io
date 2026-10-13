(function(){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* Aparición al desplazarse (reglas, filas, tarjetas) */
  var io = ("IntersectionObserver" in window) && !reduce ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} });
  },{threshold:.15}) : null;
  window.siteReveal = function(){
    document.querySelectorAll(".rv,.rule,.area").forEach(function(el){
      if(el.dataset.seen) return; el.dataset.seen = 1;
      if(io) io.observe(el); else el.classList.add("in");
    });
  };
  siteReveal();

  if(reduce){ document.querySelectorAll("animateMotion").forEach(function(a){ a.parentNode.remove(); }); return; }

  /* Estela de tinta: el cursor deja un trazo que se desvanece, como una trayectoria de seña */
  document.querySelectorAll("[data-trail]").forEach(function(host){
    var c = document.createElement("canvas"); c.className = "trail"; host.insertBefore(c, host.firstChild);
    var ctx = c.getContext("2d"), pts = [], raf = 0, w = 0, h = 0, life = 1500;
    function size(){
      var d = Math.min(devicePixelRatio || 1, 2), r = host.getBoundingClientRect();
      w = r.width; h = r.height; c.width = w*d; c.height = h*d; ctx.setTransform(d,0,0,d,0,0);
    }
    size(); addEventListener("resize", size);
    host.addEventListener("pointermove", function(e){
      var r = host.getBoundingClientRect();
      pts.push({x:e.clientX - r.left, y:e.clientY - r.top, t:performance.now()});
      if(pts.length > 140) pts.shift();
      host.style.setProperty("--px", ((e.clientX - r.left)/r.width - .5).toFixed(3));
      host.style.setProperty("--py", ((e.clientY - r.top)/r.height - .5).toFixed(3));
      if(!raf) raf = requestAnimationFrame(draw);
    });
    function draw(now){
      ctx.clearRect(0,0,w,h);
      pts = pts.filter(function(p){ return now - p.t < life; });
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for(var i = 1; i < pts.length; i++){
        var a = pts[i-1], b = pts[i], k = 1 - (now - b.t)/life;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = "rgba(31,74,68," + (0.75*k).toFixed(3) + ")";
        ctx.lineWidth = .6 + 2.6*k; ctx.stroke();
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    }
  });
})();
