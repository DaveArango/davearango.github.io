(function(){
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");
  var els = document.querySelectorAll(".rv");
  if(reduce || !("IntersectionObserver" in window)){ els.forEach(function(e){e.classList.add("in")}); }
  else{
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} });
    },{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  }
  if(reduce){ document.querySelectorAll("animateMotion").forEach(function(a){a.parentNode.remove()}); }
})();
