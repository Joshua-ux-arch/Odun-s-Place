import { useState, useEffect, useRef } from "react";
import './App.css'
import emailjs from "@emailjs/browser";






const EMAILJS_SERVICE_ID  = "service_x3w4ywg";   
const EMAILJS_TEMPLATE_ID = "template_sfmvrhm";  
const EMAILJS_PUBLIC_KEY  = "NLmfT8nbqVRQyw5Oi";   


const WA_NUMBER = "2347042519585"; 


const IMGS = {
  hero:      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1800&q=85&fit=crop",
  about1:    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85&fit=crop",
  dish1:     "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=85&fit=crop",
  dish2:     "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=85&fit=crop",
  dish3:     "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=85&fit=crop",
  dish4:     "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=85&fit=crop",
  dish5:     "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&fit=crop",
  dish6:     "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=700&q=85&fit=crop",
  interior1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85&fit=crop",
  interior2: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&q=85&fit=crop",
  interior3: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=700&q=85&fit=crop",
  chef:      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&q=85&fit=crop",
  table:     "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85&fit=crop",
  spices:    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&q=85&fit=crop",
};

const DISHES = [
  { name: "Banga Lamb Rack", price: "₦75,000", tag: "Chef's Signature", img: IMGS.dish1, desc: "Palm nut–marinated rack, charcoal–kissed over open flame" },
  { name: "Jollof Lobster Risotto", price: "₦48,000", tag: "Bestseller", img: IMGS.dish2, desc: "Smoked–tomato Jollof technique with butter–poached lobster" },
  { name: "Pepper Soup Sea Bass", price: "₦42,000", tag: "Light & Bold", img: IMGS.dish3, desc: "Wild sea bass, aromatic Nigerian pepper broth, uziza oil" },
  { name: "Suya Wagyu Board", price: "₦38,000", tag: "Shared Feast", img: IMGS.dish4, desc: "Slow–grilled Wagyu, spiced groundnut crust, pickled onions" },
  { name: "Egusi Crown Beef Rib", price: "₦65,000", tag: "Signature", img: IMGS.dish5, desc: "Prime short rib braised in egusi reduction, plantain crumble" },
  { name: "Zobo Panna Cotta", price: "₦11,000", tag: "Dessert", img: IMGS.dish6, desc: "Hibiscus panna cotta, ginger syrup, kola nut shavings" },
];

const REVIEWS = [
  { name: "Joel I.", city: "Victoria Island", text: "This is the best dining experience I've had in Lagos. Not just the food — the entire thing. The ambience, the service, the plating. Odun's Place is in a league of its own.", stars: 5 },
  { name: "Moses T.", city: "Lekki", text: "That Banga Lamb Rack genuinely made me emotional. I didn't know Nigerian food could hit at this level. Everything about this place is first class.", stars: 5 },
  { name: "Laris I.", city: "Abuja", text: "Flew into Lagos specifically to eat here after a recommendation. Not disappointed at all. The pepper soup sea bass is a masterpiece. Already planning my return.", stars: 5 },
];

const GALLERY = [
  { img: IMGS.interior1, label: "Main Dining Room", cls: "gal-tall" },
  { img: IMGS.dish2, label: "Jollof Lobster", cls: "" },
  { img: IMGS.chef, label: "Chef Odunayo", cls: "" },
  { img: IMGS.interior2, label: "The Lounge", cls: "gal-wide" },
  { img: IMGS.spices, label: "Fresh Spices", cls: "" },
  { img: IMGS.table, label: "Private Dining", cls: "" },
];

/* ── VALIDATION HELPERS ── */
const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const validatePhone = v => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v.trim());
const validateName  = v => v.trim().length >= 2;
const validateDate  = v => { if (!v) return false; return new Date(v) >= new Date(new Date().toDateString()); };

export default function OdunsPlace() {
  const [navSolid, setNavSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", guests: "2", note: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inView, setInView] = useState(new Set());
  const refs = useRef({});

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(r => (r + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setInView(s => new Set([...s, e.target.dataset.id]))),
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const setRef = id => el => { refs.current[id] = el; };
  const vis = id => inView.has(id);

  
  const validate = (data) => {
    const e = {};
    if (!validateName(data.name))   e.name  = "Please enter your full name";
    if (!validateEmail(data.email)) e.email = "Please enter a valid email address";
    if (!validatePhone(data.phone)) e.phone = "Please enter a valid phone number";
    if (!validateDate(data.date))   e.date  = "Please pick a date from today onwards";
    return e;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setErrors(prev => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setErrors(prev => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ name: true, email: true, phone: true, date: true });
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      alert("Reservation email is not configured yet. Please contact support.");
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          phone:      formData.phone,
          date:       formData.date,
          guests:     formData.guests,
          note:       formData.note || "None",
          reply_to:   formData.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", date: "", guests: "2", note: "" });
      setErrors({});
      setTouched({});
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      console.error("EmailJS error:", err);
      const status = err?.status;
      const detail = err?.text || err?.message || "Unknown error";
      let reason = detail;
      if (status === 401) reason = "invalid EmailJS public key";
      if (status === 404) reason = "service ID or template ID not found";
      if (status === 403) reason = "domain/origin is not allowed in EmailJS";
      if (status === 429) reason = "rate limit reached, try again shortly";
      alert(`Could not send reservation (${reason}). Please call us directly on +${WA_NUMBER} or message us on WhatsApp.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

    
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="wa-bubble" aria-label="WhatsApp">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* NAV */}
        <nav className={`nav ${navSolid ? "nav--on" : ""}`}>
          <a href="#top" className="logo">
            <span className="logo-mark">O</span>
            <div className="logo-text-wrap">
              <span className="logo-name">ODUN'S PLACE</span>
              <span className="logo-sub">Fine African Dining</span>
            </div>
          </a>
          <ul className="nav-ul">
            {["Menu","Story","Gallery","Reserve"].map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="nav-a">{l}</a></li>
            ))}
          </ul>
          <a href={`tel:+${WA_NUMBER}`} className="nav-phone">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            +{WA_NUMBER.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}
          </a>
          <button className="burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className={`b1 ${mobileOpen ? "bx1" : ""}`}/>
            <span className={`b2 ${mobileOpen ? "bx2" : ""}`}/>
            <span className={`b3 ${mobileOpen ? "bx3" : ""}`}/>
          </button>
        </nav>

        {mobileOpen && (
          <div className="mob-nav">
            {["Menu","Story","Gallery","Reserve"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="mob-a" onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
            <a href={`tel:+${WA_NUMBER}`} className="mob-phone">📞 +{WA_NUMBER.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</a>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mob-wa">💬 Order on WhatsApp</a>
          </div>
        )}

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="hero" id="top">
          <img src={IMGS.hero} alt="Odun's Place dining" className="hero-img" />
          <div className="hero-scrim" />
          <div className="hero-body">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Badagry · Est. 2013
              <span className="eyebrow-dot" />
            </div>
            <h1 className="hero-h1">
              <span className="h1-thin">Where African Flavour</span>
              <span className="h1-bold">Meets Luxury.</span>
            </h1>
            <p className="hero-p">Authentic Nigerian cuisine. Elevated plating.<br />An experience you will return for.</p>
            <div className="hero-ctas">
              <a href="#reserve" className="cta-orange">Reserve a Table</a>
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="cta-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-bar">
            <div className="hb-item"><span className="hb-num">4.9★</span><span className="hb-lbl">2,400+ Google reviews</span></div>
            <div className="hb-div" />
            <div className="hb-item"><span className="hb-num">12+</span><span className="hb-lbl">Years of mastery</span></div>
            <div className="hb-div" />
            <div className="hb-item"><span className="hb-num">48</span><span className="hb-lbl">Signature dishes</span></div>
            <div className="hb-div" />
            <div className="hb-item"><span className="hb-num">3×</span><span className="hb-lbl">Michelin mentioned</span></div>
          </div>
        </section>

        {/* INTRO TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {[0,1,2].map(i => (
              <span key={i} className="ticker-txt">
                Rooted in culture &nbsp;·&nbsp; Served in style &nbsp;·&nbsp; Authentically African &nbsp;·&nbsp; Globally acclaimed &nbsp;·&nbsp; Lagos finest table &nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════ STORY ══════════════════ */}
        <section className="story" id="story" data-id="story" ref={setRef("story")}>
          <div className={`story-inner ${vis("story") ? "revealed" : ""}`}>
            <div className="story-images">
              <div className="story-img-main">
                <img src={IMGS.about1} alt="Odun's Place dining experience" />
              </div>
              <div className="story-img-float">
                <img src={IMGS.chef} alt="Chef Odunayo" />
                <div className="story-badge">
                  <span className="badge-lbl">EST.</span>
                  <span className="badge-num">2013</span>
                  <span className="badge-city">BADAGRY, LAGOS</span>
                </div>
              </div>
            </div>
            <div className="story-copy">
              <p className="sec-tag">Our Story</p>
              <h2 className="sec-h2">A love letter<br />to African food.</h2>
              <p className="story-p">
                Odun's Place started with a single conviction — that West African cuisine deserved a seat at the
                world's finest tables. Not as fusion. Not as novelty. But exactly as it is: complex, soulful,
                and extraordinary.
              </p>
              <p className="story-p">
                Chef Ibeakanma Biodun spent years studying both the roadside buka 
                before returning home to Lagos to build something the city had never seen before.
              </p>
              <div className="story-stats">
                <div className="ss"><span className="ss-n">48</span><span className="ss-l">Signature dishes</span></div>
                <div className="ss"><span className="ss-n">12+</span><span className="ss-l">Years of mastery</span></div>
                <div className="ss"><span className="ss-n">2,400+</span><span className="ss-l">Five-star reviews</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ MENU ══════════════════ */}
        <section className="menu-sec" id="menu" data-id="menu" ref={setRef("menu")}>
          <div className={`menu-inner ${vis("menu") ? "revealed" : ""}`}>
            <div className="menu-head">
              <p className="sec-tag">Signature Dishes</p>
              <h2 className="sec-h2">The food speaks<br />for itself.</h2>
              <p className="menu-sub">Every dish is a conversation between tradition and technique.</p>
            </div>
            <div className="dishes-grid">
              {DISHES.map((d, i) => (
                <article key={d.name} className="dish">
                  <div className="dish-img-wrap">
                    <img src={d.img} alt={d.name} className="dish-img" loading="lazy" />
                    <span className="dish-tag-badge">{d.tag}</span>
                  </div>
                  <div className="dish-copy">
                    <div className="dish-row">
                      <h3 className="dish-name">{d.name}</h3>
                      <span className="dish-price">{d.price}</span>
                    </div>
                    <p className="dish-desc">{d.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="menu-cta-row">
              <a href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20see%20the%20full%20menu`} target="_blank" rel="noopener noreferrer" className="cta-orange">View Full Menu</a>
            </div>
          </div>
        </section>

        {/* ══════════════════ IMAGE BREAK ══════════════════ */}
        <div className="img-break">
          <img src={IMGS.interior1} alt="Odun's Place interior" className="img-break-photo" />
          <div className="img-break-scrim" />
          <div className="img-break-text">
            <p className="ibt-tag">The Experience</p>
            <h2 className="ibt-quote">"Come for the food.<br/>Stay for the feeling."</h2>
          </div>
        </div>

        {/* ══════════════════ REVIEWS ══════════════════ */}
        <section className="reviews-sec" data-id="reviews" ref={setRef("reviews")}>
          <div className={`reviews-inner ${vis("reviews") ? "revealed" : ""}`}>
            <div className="reviews-left">
              <p className="sec-tag">What People Say</p>
              <h2 className="sec-h2">Loved across<br />Lagos & beyond.</h2>
              <div className="rnav">
                {REVIEWS.map((_, i) => (
                  <button key={i} className={`rnav-btn ${i === activeReview ? "rnav-on" : ""}`} onClick={() => setActiveReview(i)}>0{i + 1}</button>
                ))}
              </div>
            </div>
            <div className="reviews-right">
              {REVIEWS.map((rv, i) => (
                <div key={i} className={`rc ${i === activeReview ? "rc-active" : ""}`}>
                  <div className="rc-stars">{"★".repeat(rv.stars)}</div>
                  <p className="rc-text">{rv.text}</p>
                  <div className="rc-author">
                    <div className="rc-avatar">{rv.name[0]}</div>
                    <div>
                      <p className="rc-name">{rv.name}</p>
                      <p className="rc-city">{rv.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ GALLERY ══════════════════ */}
        <section className="gal-sec" id="gallery" data-id="gallery" ref={setRef("gallery")}>
          <div className={`gal-inner ${vis("gallery") ? "revealed" : ""}`}>
            <div className="gal-head">
              <p className="sec-tag">Inside Odun's Place</p>
              <h2 className="sec-h2">The space. The food.<br />The whole experience.</h2>
            </div>
            <div className="gal-grid">
              {GALLERY.map((g, i) => (
                <div key={i} className={`gal-item ${g.cls}`}>
                  <img src={g.img} alt={g.label} className="gal-img" loading="lazy" />
                  <div className="gal-overlay">
                    <span className="gal-label">{g.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ WHATSAPP CTA ══════════════════ */}
        <section className="wa-sec">
          <img src={IMGS.table} alt="dining table" className="wa-bg-img" />
          <div className="wa-bg-dark" />
          <div className="wa-content">
            <p className="sec-tag" style={{color:"#FF8C33"}}>Don't Wait</p>
            <h2 className="wa-h2">Hungry?<br />Let's serve you now.</h2>
            <p className="wa-p">Order directly on WhatsApp — we'll have everything ready for you.</p>
            <div className="wa-btns">
              <a href={`https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20want%20to%20order%20from%20Odun's%20Place`} target="_blank" rel="noopener noreferrer" className="cta-wa">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </a>
              <a href={`tel:+${WA_NUMBER}`} className="cta-outline">📞 Call Us Now</a>
            </div>
          </div>
        </section>

        {/* ══════════════════ RESERVATION ══════════════════ */}
        <section className="res-sec" id="reserve" data-id="reserve" ref={setRef("reserve")}>
          <div className={`res-inner ${vis("reserve") ? "revealed" : ""}`}>
            <div className="res-left">
              <img src={IMGS.interior3} alt="private dining" className="res-photo" />
              <div className="res-info">
                <p className="sec-tag">Location</p>
                <p className="res-addr">Comforter Road<br />Badagry Expressway, Lagos</p>
                <div className="res-hours">
                  {[["Mon – Thu","9am – 10pm"],["Fri – Sat","9am – 10pm"],["Sunday Brunch","10am – 10pm"]].map(([d,t]) => (
                    <div key={d} className="res-hour-row">
                      <span className="res-day">{d}</span>
                      <span className="res-time">{t}</span>
                    </div>
                  ))}
                </div>
                <a href="https://maps.google.com/?q=Comforter+Road+Badagry+Expressway+Lagos+Nigeria" target="_blank" rel="noopener noreferrer" className="res-map-link">Get directions →</a>
              </div>
            </div>
            <div className="res-right">
              <p className="sec-tag">Book a Table</p>
              <h2 className="sec-h2">Make a<br />reservation.</h2>
              <p className="res-sub">We'll confirm within 2 hours via WhatsApp or phone.</p>
              {submitted && (
                <div className="res-success">
                  <span className="res-success-icon">✓</span>
                  Reservation received! We'll confirm shortly via WhatsApp or email.
                </div>
              )}
              <form className="res-form" onSubmit={handleSubmit} noValidate>

                {/* Row 1 — Name + Email */}
                <div className="res-row">
                  <div className="res-field">
                    <label className="res-label">Full Name</label>
                    <input
                      className={`res-input ${errors.name && touched.name ? "res-input--err" : touched.name && !errors.name ? "res-input--ok" : ""}`}
                      placeholder="Adaeze Okonkwo"
                      value={formData.name}
                      onChange={e => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                    />
                    {errors.name && touched.name && <span className="res-err">{errors.name}</span>}
                    {!errors.name && touched.name && <span className="res-ok">✓ Looks good</span>}
                  </div>
                  <div className="res-field">
                    <label className="res-label">Email Address</label>
                    <input
                      className={`res-input ${errors.email && touched.email ? "res-input--err" : touched.email && !errors.email ? "res-input--ok" : ""}`}
                      type="email"
                      placeholder="adaeze@example.com"
                      value={formData.email}
                      onChange={e => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                    />
                    {errors.email && touched.email && <span className="res-err">{errors.email}</span>}
                    {!errors.email && touched.email && <span className="res-ok">✓ Valid email</span>}
                  </div>
                </div>

                {/* Row 2 — Phone + Date */}
                <div className="res-row">
                  <div className="res-field">
                    <label className="res-label">Phone / WhatsApp</label>
                    <input
                      className={`res-input ${errors.phone && touched.phone ? "res-input--err" : touched.phone && !errors.phone ? "res-input--ok" : ""}`}
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={e => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                    />
                    {errors.phone && touched.phone && <span className="res-err">{errors.phone}</span>}
                    {!errors.phone && touched.phone && <span className="res-ok">✓ Looks good</span>}
                  </div>
                  <div className="res-field">
                    <label className="res-label">Preferred Date</label>
                    <input
                      className={`res-input ${errors.date && touched.date ? "res-input--err" : touched.date && !errors.date ? "res-input--ok" : ""}`}
                      type="date"
                      value={formData.date}
                      onChange={e => handleChange("date", e.target.value)}
                      onBlur={() => handleBlur("date")}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && touched.date && <span className="res-err">{errors.date}</span>}
                    {!errors.date && touched.date && <span className="res-ok">✓ Date confirmed</span>}
                  </div>
                </div>

                {/* Row 3 — Guests + Note */}
                <div className="res-row">
                  <div className="res-field">
                    <label className="res-label">Number of Guests</label>
                    <select className="res-input" value={formData.guests} onChange={e => handleChange("guests", e.target.value)}>
                      {["1","2","3","4","5","6","7","8+"].map(n => <option key={n} value={n}>{n} {n==="1"?"Guest":"Guests"}</option>)}
                    </select>
                  </div>
                  <div className="res-field">
                    <label className="res-label">Special Requests (optional)</label>
                    <input
                      className="res-input"
                      placeholder="Birthday, private room, dietary..."
                      value={formData.note}
                      onChange={e => handleChange("note", e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`res-submit ${loading ? "res-submit--loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="res-spinner-wrap">
                      <span className="res-spinner" />
                      Sending...
                    </span>
                  ) : "Confirm Reservation"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="logo" style={{marginBottom:14, display:"inline-flex"}}>
                <span className="logo-mark">O</span>
                <div className="logo-text-wrap">
                  <span className="logo-name">ODUN'S PLACE</span>
                  <span className="logo-sub">Fine African Dining</span>
                </div>
              </a>
              <p className="footer-blurb">Born in Africa. Crafted for the world.<br />Comforter Road, Badagry Expressway, Lagos.</p>
            </div>
            <div className="footer-col">
              <p className="footer-col-head">Explore</p>
              {["Menu","Our Story","Gallery","Reservations"].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="footer-a">{l}</a>)}
            </div>
            <div className="footer-col">
              <p className="footer-col-head">Visit</p>
              <p className="footer-txt">Comforter Road<br />Badagry Expressway, Lagos</p>
              <a href={`tel:+${WA_NUMBER}`} className="footer-a">+{WA_NUMBER.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</a>
              <a href="mailto:hello@odunsplace.com" className="footer-a">hello@odunsplace.com</a>
            </div>
            <div className="footer-col">
              <p className="footer-col-head">Follow</p>
              {["Instagram","TikTok","Twitter / X","Facebook"].map(s => <a key={s} href="#" className="footer-a">{s}</a>)}
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 Odun's Place. All rights reserved.</p>
            <p className="footer-copy">Privacy Policy · Terms of Use</p>
          </div>
        </footer>

      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

:root {
  --ink:     #0c0703;
  --ink2:    #140a05;
  --orange:  #E8520A;
  --orange2: #FF6B1A;
  --cream:   #F3E8D8;
  --cream2:  rgba(243,232,216,0.72);
  --cream3:  rgba(243,232,216,0.38);
  --serif:   'Cormorant', Georgia, serif;
  --sans:    'Outfit', system-ui, sans-serif;
}

.app { background: var(--ink); color: var(--cream); overflow-x: hidden; }

/* WA BUBBLE */
.wa-bubble {
  position: fixed; bottom: 26px; right: 26px; z-index: 9999;
  width: 50px; height: 50px; border-radius: 50%;
  background: #25D366; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 18px rgba(37,211,102,0.45); transition: transform .2s;
  text-decoration: none;
}
.wa-bubble:hover { transform: scale(1.1); }

/* NAV */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 52px; transition: background .3s, padding .3s, border-color .3s;
  border-bottom: 1px solid transparent;
}
.nav--on {
  background: rgba(12,7,3,0.97); backdrop-filter: blur(16px);
  padding: 14px 52px; border-bottom-color: rgba(232,82,10,0.1);
}
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-mark { font-family: var(--serif); font-size: 40px; font-weight: 700; color: var(--orange); line-height: 1; }
.logo-text-wrap { display: flex; flex-direction: column; gap: 1px; }
.logo-name { font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 5px; color: var(--cream); text-transform: uppercase; }
.logo-sub { font-family: var(--serif); font-size: 11px; font-style: italic; color: var(--cream3); }
.nav-ul { display: flex; list-style: none; gap: 36px; }
.nav-a { font-family: var(--sans); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--cream2); text-decoration: none; transition: color .2s; }
.nav-a:hover { color: var(--orange); }
.nav-phone { display: flex; align-items: center; gap: 7px; font-family: var(--sans); font-size: 12px; color: var(--cream3); text-decoration: none; transition: color .2s; }
.nav-phone:hover { color: var(--orange); }
.burger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
.b1,.b2,.b3 { display: block; width: 24px; height: 1.5px; background: var(--cream); transition: all .3s; transform-origin: center; }
.bx1 { transform: rotate(45deg) translate(4px, 5px); }
.bx2 { opacity: 0; }
.bx3 { transform: rotate(-45deg) translate(4px, -5px); }

/* MOBILE NAV */
.mob-nav { position: fixed; inset: 0; background: rgba(12,7,3,0.99); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; }
.mob-a { font-family: var(--serif); font-size: 36px; font-weight: 600; color: var(--cream); text-decoration: none; letter-spacing: 3px; transition: color .2s; }
.mob-a:hover { color: var(--orange); }
.mob-phone { font-family: var(--sans); font-size: 14px; color: var(--cream3); text-decoration: none; }
.mob-wa { background: var(--orange); color: var(--ink); padding: 14px 32px; font-family: var(--sans); font-size: 13px; font-weight: 600; text-decoration: none; }

/* HERO */
.hero { position: relative; height: 100vh; min-height: 640px; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 35%; }
.hero-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(12,7,3,0.2) 0%, rgba(12,7,3,0.08) 35%, rgba(12,7,3,0.6) 68%, rgba(12,7,3,0.97) 100%);
}
.hero-body { position: relative; z-index: 2; padding: 0 64px 136px; max-width: 820px; }
.hero-eyebrow { display: flex; align-items: center; gap: 10px; font-family: var(--sans); font-size: 11px; letter-spacing: 4px; color: rgba(232,82,10,0.9); text-transform: uppercase; margin-bottom: 18px; }
.eyebrow-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--orange); flex-shrink: 0; }
.hero-h1 { display: flex; flex-direction: column; margin-bottom: 18px; }
.h1-thin { font-family: var(--serif); font-size: clamp(20px, 3vw, 42px); font-weight: 300; font-style: italic; color: var(--cream2); line-height: 1.25; }
.h1-bold { font-family: var(--serif); font-size: clamp(56px, 9vw, 118px); font-weight: 700; color: var(--cream); line-height: 0.9; letter-spacing: -1.5px; }
.hero-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); font-weight: 300; line-height: 1.75; margin-bottom: 36px; max-width: 460px; }
.hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

/* SHARED BUTTONS */
.cta-orange { display: inline-flex; align-items: center; gap: 8px; background: var(--orange); color: var(--ink); padding: 14px 34px; font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-decoration: none; text-transform: uppercase; transition: background .2s, transform .2s; }
.cta-orange:hover { background: var(--orange2); transform: translateY(-1px); }
.cta-outline { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(243,232,216,0.3); color: var(--cream); padding: 14px 28px; font-family: var(--sans); font-size: 12px; font-weight: 400; letter-spacing: 1.5px; text-decoration: none; text-transform: uppercase; transition: border-color .2s, color .2s; }
.cta-outline:hover { border-color: var(--orange); color: var(--orange); }
.cta-wa { display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: #fff; padding: 15px 32px; font-family: var(--sans); font-size: 14px; font-weight: 600; text-decoration: none; transition: opacity .2s, transform .2s; }
.cta-wa:hover { opacity: .9; transform: translateY(-1px); }

/* HERO BAR */
.hero-bar {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  display: flex; align-items: stretch; padding: 0 64px;
  background: rgba(12,7,3,0.88); backdrop-filter: blur(14px);
  border-top: 1px solid rgba(232,82,10,0.12);
}
.hb-item { display: flex; flex-direction: column; gap: 4px; padding: 18px 28px 18px 0; flex: 1; }
.hb-num { font-family: var(--serif); font-size: 27px; font-weight: 600; color: var(--orange); line-height: 1; }
.hb-lbl { font-family: var(--sans); font-size: 11px; color: var(--cream3); letter-spacing: 1px; }
.hb-div { width: 1px; background: rgba(232,82,10,0.12); margin: 14px 28px; }

/* TICKER */
.ticker { background: var(--orange); padding: 14px 0; overflow: hidden; }
.ticker-track { display: flex; white-space: nowrap; animation: tick 22s linear infinite; }
.ticker-txt { font-family: var(--serif); font-size: 17px; font-style: italic; color: var(--ink); }
@keyframes tick { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }

/* SECTION SHARED */
.sec-tag { font-family: var(--sans); font-size: 10px; letter-spacing: 5px; color: var(--orange); text-transform: uppercase; font-weight: 500; margin-bottom: 14px; display: block; }
.sec-h2 { font-family: var(--serif); font-size: clamp(38px, 4.5vw, 60px); font-weight: 700; line-height: 1.08; color: var(--cream); margin-bottom: 22px; }

/* SCROLL REVEAL */
.story-inner, .menu-inner, .reviews-inner, .gal-inner, .res-inner {
  opacity: 0; transform: translateY(26px);
  transition: opacity .8s ease, transform .8s ease;
}
.revealed { opacity: 1 !important; transform: none !important; }

/* STORY */
.story { padding: 120px 64px; background: var(--ink2); }
.story-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; max-width: 1200px; margin: 0 auto; }
.story-images { position: relative; padding-bottom: 48px; }
.story-img-main { aspect-ratio: 4/5; overflow: hidden; }
.story-img-main img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s; }
.story-img-main:hover img { transform: scale(1.03); }
.story-img-float { position: absolute; bottom: 0; right: -24px; width: 44%; aspect-ratio: 1; overflow: hidden; border: 3px solid var(--ink2); }
.story-img-float img { width: 100%; height: 100%; object-fit: cover; display: block; }
.story-badge { position: absolute; inset: 0; background: rgba(12,7,3,0.62); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; }
.badge-lbl { font-family: var(--sans); font-size: 9px; letter-spacing: 4px; color: var(--orange); text-transform: uppercase; }
.badge-num { font-family: var(--serif); font-size: 54px; font-weight: 700; color: var(--cream); line-height: 1; }
.badge-city { font-family: var(--sans); font-size: 9px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; }
.story-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); line-height: 1.9; font-weight: 300; margin-bottom: 18px; }
.story-stats { display: flex; gap: 36px; margin-top: 44px; padding-top: 40px; border-top: 1px solid rgba(232,82,10,0.15); }
.ss { display: flex; flex-direction: column; gap: 6px; }
.ss-n { font-family: var(--serif); font-size: 42px; font-weight: 700; color: var(--orange); line-height: 1; }
.ss-l { font-family: var(--sans); font-size: 11px; color: var(--cream3); letter-spacing: 1.5px; text-transform: uppercase; }

/* MENU */
.menu-sec { padding: 120px 64px; background: var(--ink); }
.menu-inner { max-width: 1200px; margin: 0 auto; }
.menu-head { max-width: 500px; margin-bottom: 56px; }
.menu-sub { font-family: var(--sans); font-size: 15px; color: var(--cream3); font-weight: 300; line-height: 1.7; }
.dishes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.dish { background: var(--ink2); overflow: hidden; cursor: pointer; }
.dish:hover .dish-img { transform: scale(1.04); }
.dish-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.dish-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s; }
.dish-tag-badge { position: absolute; top: 14px; left: 14px; background: var(--orange); color: var(--ink); font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 4px 11px; }
.dish-copy { padding: 20px 22px 26px; }
.dish-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 9px; }
.dish-name { font-family: var(--serif); font-size: 19px; font-weight: 600; color: var(--cream); line-height: 1.2; }
.dish-price { font-family: var(--serif); font-size: 17px; font-weight: 500; color: var(--orange); white-space: nowrap; }
.dish-desc { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.7; font-weight: 300; }
.menu-cta-row { margin-top: 52px; display: flex; justify-content: center; }

/* IMG BREAK */
.img-break { position: relative; height: 500px; overflow: hidden; }
.img-break-photo { width: 100%; height: 100%; object-fit: cover; object-position: center 55%; display: block; }
.img-break-scrim { position: absolute; inset: 0; background: rgba(12,7,3,0.6); }
.img-break-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
.ibt-tag { font-family: var(--sans); font-size: 11px; letter-spacing: 5px; color: var(--orange); text-transform: uppercase; margin-bottom: 18px; }
.ibt-quote { font-family: var(--serif); font-size: clamp(32px, 5vw, 64px); font-style: italic; font-weight: 400; color: var(--cream); line-height: 1.25; }

/* REVIEWS */
.reviews-sec { padding: 120px 64px; background: var(--ink2); }
.reviews-inner { display: grid; grid-template-columns: 1fr 1.7fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
.rnav { display: flex; gap: 10px; margin-top: 32px; }
.rnav-btn { background: none; border: 1px solid rgba(232,82,10,0.22); color: var(--cream3); padding: 9px 16px; font-family: var(--sans); font-size: 12px; letter-spacing: 2px; cursor: pointer; transition: all .25s; }
.rnav-on { background: var(--orange); border-color: var(--orange); color: var(--ink); font-weight: 600; }
.rc { display: none; }
.rc-active { display: block; animation: rcIn .5s ease; }
@keyframes rcIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
.rc-stars { font-size: 18px; color: var(--orange); letter-spacing: 2px; margin-bottom: 20px; }
.rc-text { font-family: var(--serif); font-size: clamp(18px, 2.2vw, 25px); font-style: italic; color: var(--cream); line-height: 1.65; margin-bottom: 30px; }
.rc-author { display: flex; align-items: center; gap: 14px; }
.rc-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--orange); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--ink); flex-shrink: 0; }
.rc-name { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--cream); }
.rc-city { font-family: var(--sans); font-size: 12px; color: var(--cream3); margin-top: 2px; }

/* GALLERY */
.gal-sec { padding: 120px 64px; background: var(--ink); }
.gal-inner { max-width: 1280px; margin: 0 auto; }
.gal-head { margin-bottom: 52px; }
.gal-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 260px 260px; gap: 4px; }
.gal-item { overflow: hidden; position: relative; cursor: pointer; }
.gal-tall { grid-row: span 2; }
.gal-wide { grid-column: span 2; }
.gal-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .55s; }
.gal-item:hover .gal-img { transform: scale(1.05); }
.gal-overlay { position: absolute; inset: 0; background: rgba(12,7,3,0); display: flex; align-items: flex-end; padding: 18px; transition: background .3s; }
.gal-item:hover .gal-overlay { background: rgba(12,7,3,0.48); }
.gal-label { font-family: var(--sans); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--cream); opacity: 0; transform: translateY(8px); transition: opacity .3s, transform .3s; }
.gal-item:hover .gal-label { opacity: 1; transform: none; }

/* WA SECTION */
.wa-sec { position: relative; padding: 110px 64px; overflow: hidden; }
.wa-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.wa-bg-dark { position: absolute; inset: 0; background: rgba(12,7,3,0.88); }
.wa-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; text-align: center; }
.wa-h2 { font-family: var(--serif); font-size: clamp(44px, 6vw, 78px); font-weight: 700; color: var(--cream); line-height: 1.0; margin-bottom: 18px; }
.wa-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); font-weight: 300; line-height: 1.8; margin-bottom: 38px; }
.wa-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* RESERVATION */
.res-sec { padding: 120px 64px; background: var(--ink2); }
.res-inner { display: grid; grid-template-columns: 1fr 1.35fr; gap: 72px; max-width: 1200px; margin: 0 auto; align-items: start; }
.res-photo { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; margin-bottom: 28px; }
.res-info { padding: 28px; border: 1px solid rgba(232,82,10,0.13); background: rgba(232,82,10,0.03); }
.res-addr { font-family: var(--sans); font-size: 14px; color: var(--cream2); line-height: 1.9; font-weight: 300; margin-bottom: 22px; }
.res-hours { margin-bottom: 20px; }
.res-hour-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(232,82,10,0.1); }
.res-day { font-family: var(--sans); font-size: 13px; color: var(--cream3); font-weight: 300; }
.res-time { font-family: var(--sans); font-size: 13px; color: var(--orange); font-weight: 500; }
.res-map-link { font-family: var(--sans); font-size: 12px; color: var(--orange); text-decoration: none; letter-spacing: 1px; transition: opacity .2s; }
.res-map-link:hover { opacity: .7; }
.res-sub { font-family: var(--sans); font-size: 14px; color: var(--cream3); line-height: 1.7; margin-bottom: 32px; font-weight: 300; }
.res-success { background: rgba(232,82,10,0.1); border: 1px solid rgba(232,82,10,0.4); color: var(--orange); padding: 15px 18px; font-family: var(--sans); font-size: 13px; margin-bottom: 22px; }
.res-form { display: flex; flex-direction: column; gap: 18px; }
.res-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.res-field { display: flex; flex-direction: column; gap: 8px; }
.res-label { font-family: var(--sans); font-size: 10px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; }
.res-input { background: rgba(243,232,216,0.04); border: 1px solid rgba(243,232,216,0.1); padding: 13px 15px; color: var(--cream); font-family: var(--sans); font-size: 14px; outline: none; width: 100%; transition: border-color .2s; border-radius: 0; -webkit-appearance: none; }
.res-input:focus { border-color: var(--orange); }
.res-input::placeholder { color: rgba(243,232,216,0.18); }
.res-input option { background: var(--ink2); color: var(--cream); }
.res-textarea { min-height: 96px; resize: vertical; }
.res-submit { background: var(--orange); border: none; color: var(--ink); padding: 16px; font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; cursor: pointer; transition: background .2s, opacity .2s; margin-top: 4px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; }
.res-submit:hover:not(:disabled) { background: var(--orange2); }
.res-submit--loading { opacity: .8; cursor: not-allowed; }
.res-spinner-wrap { display: flex; align-items: center; gap: 10px; }
.res-spinner { width: 16px; height: 16px; border: 2px solid rgba(12,7,3,0.3); border-top-color: var(--ink); border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Inline validation */
.res-input--err { border-color: #e53e3e !important; background: rgba(229,62,62,0.05) !important; }
.res-input--ok  { border-color: #38a169 !important; background: rgba(56,161,105,0.04) !important; }
.res-err { font-family: var(--sans); font-size: 11px; color: #fc8181; margin-top: 5px; display: block; letter-spacing: .3px; }
.res-ok  { font-family: var(--sans); font-size: 11px; color: #68d391; margin-top: 5px; display: block; letter-spacing: .3px; }
.res-success { display: flex; align-items: center; gap: 12px; background: rgba(56,161,105,0.1); border: 1px solid rgba(56,161,105,0.4); color: #68d391; padding: 15px 18px; font-family: var(--sans); font-size: 13px; margin-bottom: 22px; line-height: 1.5; }
.res-success-icon { font-size: 18px; flex-shrink: 0; }

/* FOOTER */
.footer { border-top: 1px solid rgba(232,82,10,0.1); background: var(--ink); }
.footer-top { padding: 68px 64px 52px; display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 44px; max-width: 1280px; margin: 0 auto; }
.footer-blurb { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.8; font-weight: 300; }
.footer-col-head { font-family: var(--sans); font-size: 10px; letter-spacing: 4px; color: var(--orange); text-transform: uppercase; font-weight: 600; margin-bottom: 18px; }
.footer-a { display: block; font-family: var(--sans); font-size: 13px; color: var(--cream3); text-decoration: none; margin-bottom: 10px; transition: color .2s; font-weight: 300; }
.footer-a:hover { color: var(--orange); }
.footer-txt { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.8; margin-bottom: 10px; font-weight: 300; }
.footer-bottom { padding: 20px 64px; border-top: 1px solid rgba(232,82,10,0.07); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; max-width: 1280px; margin: 0 auto; }
.footer-copy { font-family: var(--sans); font-size: 12px; color: rgba(243,232,216,0.2); }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .dishes-grid { grid-template-columns: repeat(2,1fr); }
  .gal-grid { grid-template-columns: repeat(2,1fr); grid-template-rows: auto; }
  .gal-tall, .gal-wide { grid-row: span 1; grid-column: span 1; }
}
@media (max-width: 768px) {
  .nav { padding: 18px 24px; }
  .nav--on { padding: 12px 24px; }
  .nav-ul, .nav-phone { display: none; }
  .burger { display: flex; }
  .hero-body { padding: 0 28px 170px; }
  .hero-bar { padding: 0 24px; }
  .hb-div { display: none; }
  .hb-item { padding: 14px 10px 14px 0; }
  .story, .menu-sec, .reviews-sec, .gal-sec, .wa-sec, .res-sec { padding: 80px 28px; }
  .story-inner { grid-template-columns: 1fr; gap: 52px; }
  .story-img-float { right: 0; }
  .dishes-grid { grid-template-columns: 1fr; }
  .reviews-inner { grid-template-columns: 1fr; gap: 36px; }
  .res-inner { grid-template-columns: 1fr; gap: 36px; }
  .res-row { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; padding: 48px 28px 36px; }
  .footer-bottom { padding: 18px 28px; flex-direction: column; }
  .hero-ctas { flex-direction: column; align-items: flex-start; }
  .wa-btns { flex-direction: column; align-items: center; }
}
@media (max-width: 480px) {
  .gal-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .story-stats { flex-wrap: wrap; gap: 22px; }
  .footer-top { grid-template-columns: 1fr; }
}
`;
