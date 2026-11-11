/* متن‌های هیرو سینمایی (از data/hero.json، فارسی/انگلیسی) و تشخیص اینکه کاربر هنوز داخل هیرو است (کلاس in-hero روی body).
   خودِ پرواز سه‌بعدی در js/flythrough.js است. این فایل باید قبل از flythrough.js لود شود، چون آن فایل المنت‌های متن را موقع شروع می‌خواند. */
(function(){
  'use strict';
  var H=window.HERO, root=document.getElementById('hero');
  if(!H||!root)return;
  var pin=root.querySelector('.hero-pin'), hint=root.querySelector('.hint'), nodes=[];

  H.stages.forEach(function(s,i){
    var el=document.createElement('div');
    el.className='hst s'+(i+1);
    el.setAttribute('data-s',s.start); el.setAttribute('data-e',s.end);
    var inner=el;
    if(s.panel){inner=document.createElement('div');inner.className='pnl';el.appendChild(inner);}
    var small=document.createElement('small'), h2=document.createElement('h2'), p=document.createElement('p');
    inner.appendChild(small);inner.appendChild(h2);inner.appendChild(p);
    pin.appendChild(el);
    nodes.push({s:s,small:small,h2:h2,p:p});
  });

  function text(){
    var l=(typeof L==='string'?L:'fa');
    nodes.forEach(function(n){n.small.textContent=n.s.tag[l];n.h2.textContent=n.s.title[l];n.p.textContent=n.s.text[l];});
    if(hint)hint.textContent=H.hint[l];
    root.setAttribute('aria-label',H.ariaLabel[l]);
  }
  window.isbHeroText=text; text();

  /* داخل هیرو یعنی هنوز بیشتر از ۴۰٪ صفحه هیرو است؛ در این حالت راهنمای دستیار و نوار پیشرفت شهرک ساکت می‌مانند. */
  var raf=0;
  function check(){raf=0;document.body.classList.toggle('in-hero',scrollY<hoff()-innerHeight*0.6);}
  function sched(){if(!raf)raf=requestAnimationFrame(check);}
  addEventListener('scroll',sched,{passive:true});addEventListener('resize',sched,{passive:true});
  check();
})();
