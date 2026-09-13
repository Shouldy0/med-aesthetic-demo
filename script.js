/* MED Aesthetic Clinic UK — UNOFFICIAL DEMO — script.js */
/* NOTE TO REPLACE: swap placeholder data with real clinic info before any official use. */

// ---- Services (placeholder data — confirm real menu/prices with the clinic) ----
const services = [
  { icon:"✨", name:"Signature Facial", desc:"A tailored facial for your skin type — cleanse, exfoliate, treat and hydrate.", price:"£65", note:"from, placeholder" },
  { icon:"💧", name:"Hydration Facial", desc:"Deep moisture boost for dry, dull or stressed skin.", price:"£50", note:"from, placeholder" },
  { icon:"🌟", name:"Skin Brightening", desc:"Targeted treatment for uneven tone and tired-looking skin.", price:"£70", note:"from, placeholder" },
  { icon:"🌿", name:"Advanced Facial", desc:"With extraction and a professional-grade finish.", price:"£85", note:"from, placeholder" }
];

const reviews = [
  { stars:"★★★★★", text:"Overall, the experience was excellent. The staff were very friendly and attentive, and the service was highly professional. I was very satisfied with the care I received and would definitely recommend them.", name:"Margarita", source:"Treatwell" },
  { stars:"★★★★★", text:"Great experience today. Very relaxing and knowledgeable about how to help my skin issues.", name:"Evie", source:"Treatwell" },
  { stars:"★★★★★", text:"An outstanding clinic with topquality equipment. I felt confident, safe, and exceptionally well cared for by a highly professional team 💚", name:"Angela", source:"Treatwell" }
];

function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }

function renderServices(){
  const wrap=document.getElementById('serviceCards');
  if(!wrap) return;
  wrap.innerHTML='';
  services.forEach(s=>{
    wrap.appendChild(el(`
      <article class="service-card">
        <div class="ic">${s.icon}</div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="price">${s.price} <small>${s.note}</small><span class="placeholder-badge">placeholder</span></div>
      </article>
    `));
  });
}

function renderReviews(){
  const wrap=document.getElementById('reviewCards');
  if(!wrap) return;
  wrap.innerHTML='';
  reviews.forEach(r=>{
    wrap.appendChild(el(`
      <article class="review-card">
        <div class="stars" aria-label="${r.stars} out of 5">${r.stars}</div>
        <blockquote>“${r.text}”</blockquote>
        <cite>— ${r.name} · ${r.source}</cite>
      </article>
    `));
  });
}

// ---- Mobile nav ----
const toggle=document.querySelector('.nav-toggle');
const header=document.querySelector('.site-header');
toggle.addEventListener('click',()=>header.classList.toggle('nav-open'));

// ---- Booking form (demo: just validates + friendly message) ----
const form=document.getElementById('bookingForm');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('fName').value.trim();
  const phone=document.getElementById('fPhone').value.trim();
  if(!name||!phone){
    alert('Please add your name and phone number so the clinic can reach you.');
    return;
  }
  const ok=el('<div class="form-ok">✅ Demo: request captured. Replace this handler with the clinic\'s real email or booking tool before going live.</div>');
  form.replaceWith(ok);
});

renderServices();
renderReviews();