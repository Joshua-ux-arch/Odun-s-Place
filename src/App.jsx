import { useState, useEffect, useRef } from "react";
import './App.css'
import emailjs from "@emailjs/browser";
import realExterior from "./oduns-exterior.jpeg";
import realInterior from "./oduns-interior.jpeg";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

// ── Firebase (reads menu live from admin panel) ──
const _fbApp = initializeApp({
  apiKey: "AIzaSyDPok0kq7klqcJG1z6A0oE9RZkpLdPTTto",
  authDomain: "oduns-7f07a.firebaseapp.com",
  projectId: "oduns-7f07a",
  storageBucket: "oduns-7f07a.firebasestorage.app",
  messagingSenderId: "159165548435",
  appId: "1:159165548435:web:638cfeb13c965f08118a66"
});
const _db      = getFirestore(_fbApp);
const _menuDoc = doc(_db, "restaurant", "menu");

const EMAILJS_SERVICE_ID  = "service_x3w4ywg";
const EMAILJS_TEMPLATE_ID = "template_sfmvrhm";
const EMAILJS_PUBLIC_KEY  = "NLmfT8nbqVRQyw5Oi";
const WA_NUMBER           = "2347042519585";
const PAYSTACK_KEY        = "pk_test_0310453f93633db322a862f9e8493b9749503e46";
const DELIVERY_FEE        = 2000;
const fmt = n => "₦" + n.toLocaleString("en-NG");



const IMGS = {
  hero:     "https://images.unsplash.com/photo-1544025162-d76694265947?w=1800&q=85&fit=crop",
  about1:   "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85&fit=crop",
  dish1:    "https://images.unsplash.com/photo-1567337710282-00832b415979?w=700&q=85&fit=crop",
  dish2:    "https://images.unsplash.com/photo-1512058533999-fc02d56e63ac?w=700&q=85&fit=crop",
  dish3:    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&fit=crop",
  dish4:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=85&fit=crop",
  dish5:    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=85&fit=crop",
  dish6:    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&q=85&fit=crop",
  interior: realInterior,
  exterior: realExterior,
  chef:     "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&q=85&fit=crop",
  table:    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85&fit=crop",
  spices:   "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&q=85&fit=crop",
};

const MENU = {
  food: {
    label: "Food", emoji: "🍽️",
    items: [
      { id:101, name:"Party Jollof Rice",      amount:12500, tag:"Bestseller",  img:IMGS.dish1, desc:"Smoky firewood jollof, slow-cooked with seasoned grilled chicken & fried plantain" },
      { id:102, name:"Fried Rice & Chicken",   amount:11000, tag:"Classic",     img:IMGS.dish4, desc:"Fluffy Nigerian fried rice loaded with vegetables, liver & crispy fried chicken" },
      { id:103, name:"White Rice & Stew",      amount:8500,  tag:"Comfort",     img:IMGS.dish1, desc:"Steamed long-grain rice with rich tomato beef stew & side salad" },
      { id:104, name:"Ofada Rice & Ayamase",   amount:13500, tag:"Local Fav",   img:IMGS.dish2, desc:"Local ofada rice with spicy ayamase green pepper stew" },
      { id:105, name:"Beans & Plantain",       amount:6500,  tag:"Vegan",       img:IMGS.dish5, desc:"Seasoned brown beans with palm oil, crayfish & ripe fried plantain" },
      { id:106, name:"Moi Moi (3 wraps)",      amount:5000,  tag:"Steamed",     img:IMGS.dish5, desc:"Steamed bean pudding with egg, fish & crayfish in banana leaves" },
      { id:107, name:"Beef Suya Platter",      amount:15000, tag:"Must Try",    img:IMGS.dish3, desc:"Thinly sliced beef in yaji spice, charcoal-grilled with onions & tomatoes" },
      { id:108, name:"Pepper Soup (Goat)",     amount:14000, tag:"Spicy",       img:IMGS.dish5, desc:"Aromatic goat meat in a fiery clear broth with utazi & uziza" },
      { id:109, name:"Pepper Soup (Catfish)",  amount:16000, tag:"Spicy",       img:IMGS.dish2, desc:"Fresh catfish in a bold fragrant pepper soup broth" },
      { id:110, name:"Asun (Spicy Goat)",      amount:13000, tag:"Smoky",       img:IMGS.dish3, desc:"Smoked spicy goat meat, fire-roasted & tossed with peppers & onions" },
    ]
  },
  swallow: {
    label: "Swallow & Soups", emoji: "🫙",
    items: [
      { id:201, name:"Pounded Yam & Egusi",      amount:18000, tag:"Signature",    img:IMGS.dish2, desc:"Hand-pounded yam with rich egusi soup, assorted meat & stockfish" },
      { id:202, name:"Pounded Yam & Ogbono",     amount:18000, tag:"Draw Soup",    img:IMGS.dish2, desc:"Pounded yam with ogbono draw soup, beef, tripe & smoked fish" },
      { id:203, name:"Pounded Yam & Ofe Onugbu", amount:18500, tag:"Igbo Special", img:IMGS.dish2, desc:"Pounded yam with bitter leaf soup, goat meat & stockfish" },
      { id:204, name:"Pounded Yam & Oha Soup",   amount:19000, tag:"Seasonal",     img:IMGS.dish2, desc:"Pounded yam with oha leaf soup, assorted meats & cocoyam" },
      { id:205, name:"Eba & Egusi Soup",          amount:15000, tag:"Classic",      img:IMGS.dish2, desc:"Golden garri eba with chunky egusi soup & assorted meat" },
      { id:206, name:"Eba & Ogbono Soup",         amount:15000, tag:"Draw Soup",    img:IMGS.dish2, desc:"Firm eba with rich ogbono soup, goat meat & smoked fish" },
      { id:207, name:"Fufu & Egusi Soup",         amount:16000, tag:"Soft",         img:IMGS.dish2, desc:"Stretchy fufu with deeply flavoured egusi soup & assorted meat" },
      { id:208, name:"Fufu & Okra Soup",          amount:16000, tag:"Fresh",        img:IMGS.dish2, desc:"Smooth fufu with fresh okra soup, assorted meat & periwinkle" },
      { id:209, name:"Amala & Ewedu",             amount:14000, tag:"Yoruba Fav",   img:IMGS.dish2, desc:"Dark yam amala with ewedu draw soup & gbegiri" },
      { id:210, name:"Amala & Abula",             amount:15500, tag:"Premium",      img:IMGS.dish2, desc:"Amala with ewedu, gbegiri & rich buka stew with assorted meat" },
      { id:211, name:"Semolina & Veg Soup",       amount:14500, tag:"Fresh",        img:IMGS.dish5, desc:"Smooth semolina with mixed vegetable soup & assorted protein" },
      { id:212, name:"Wheat & Oha Soup",          amount:16000, tag:"Healthy",      img:IMGS.dish5, desc:"Whole wheat swallow with oha leaf soup & assorted meats" },
    ]
  },
  snacks: {
    label: "Snacks", emoji: "🍟",
    items: [
      { id:301, name:"Puff Puff (10 pcs)",    amount:3500,  tag:"Fried",      img:IMGS.dish6, desc:"Hot golden puff puff dusted with cinnamon sugar" },
      { id:302, name:"Chin Chin (Pack)",       amount:2500,  tag:"Crunchy",    img:IMGS.dish6, desc:"Crispy fried chin chin, sweet & lightly spiced" },
      { id:303, name:"Spring Rolls (6 pcs)",   amount:5000,  tag:"Crispy",     img:IMGS.dish6, desc:"Crispy rolls stuffed with spiced minced meat & vegetables" },
      { id:304, name:"Samosa (6 pcs)",         amount:5000,  tag:"Crispy",     img:IMGS.dish6, desc:"Flaky pastry pockets filled with seasoned chicken & potatoes" },
      { id:305, name:"Scotch Eggs (2 pcs)",    amount:4500,  tag:"Classic",    img:IMGS.dish6, desc:"Boiled eggs wrapped in seasoned minced meat, deep fried golden" },
      { id:306, name:"Gizdodo",                amount:6500,  tag:"Fan Fav",    img:IMGS.dish3, desc:"Fried gizzard & plantain tossed in spicy pepper sauce" },
      { id:307, name:"Peppered Gizzard",       amount:7000,  tag:"Spicy",      img:IMGS.dish3, desc:"Tender gizzard slow-cooked in thick peppered tomato sauce" },
      { id:308, name:"Small Chops Platter",    amount:12000, tag:"Party Pack", img:IMGS.dish6, desc:"Assorted: puff puff, spring rolls, samosa, gizzard & fish roll" },
      { id:309, name:"Meatpie (2 pcs)",        amount:3000,  tag:"Baked",      img:IMGS.dish6, desc:"Flaky shortcrust pastry filled with minced meat & carrots" },
      { id:310, name:"Fish Roll (2 pcs)",      amount:3000,  tag:"Classic",    img:IMGS.dish6, desc:"Crispy pastry rolls filled with spiced mackerel fish" },
    ]
  },
  drinks: {
    label: "Drinks", emoji: "🥤",
    items: [
      { id:401, name:"Zobo (Chilled)",         amount:2000, tag:"Signature",   img:IMGS.dish6, desc:"House-made hibiscus zobo with ginger, cloves & fruit slices" },
      { id:402, name:"Kunu (Spiced)",          amount:2000, tag:"Traditional", img:IMGS.dish6, desc:"Creamy spiced millet & ginger kunu, lightly sweetened" },
      { id:403, name:"Chapman",                amount:3500, tag:"Classic",     img:IMGS.dish6, desc:"Nigerian Chapman — Fanta, Sprite, grenadine, cucumber & bitters" },
      { id:404, name:"Watermelon Juice",       amount:3000, tag:"Fresh",       img:IMGS.dish6, desc:"Freshly blended watermelon juice, no added sugar" },
      { id:405, name:"Pineapple Juice",        amount:3000, tag:"Fresh",       img:IMGS.dish6, desc:"Cold-pressed pineapple juice with a hint of ginger" },
      { id:406, name:"Yoghurt Smoothie",       amount:3500, tag:"Healthy",     img:IMGS.dish6, desc:"Blended smoothie with yoghurt, banana, strawberry & honey" },
      { id:407, name:"Soft Drink (Bottle)",    amount:700,  tag:"Cold",        img:IMGS.dish6, desc:"Coke, Fanta, Sprite, Pepsi — ice cold" },
      { id:408, name:"Malta Guinness",         amount:800,  tag:"Cold",        img:IMGS.dish6, desc:"Ice cold Malta Guinness — sweet, rich & malty" },
      { id:409, name:"Water (500ml)",          amount:300,  tag:"Still",       img:IMGS.dish6, desc:"Chilled table water" },
      { id:410, name:"Water (1.5L)",           amount:600,  tag:"Still",       img:IMGS.dish6, desc:"Large chilled table water" },
    ]
  },
};

const REVIEWS = [
  { name:"Joel I.",   city:"Victoria Island", stars:5, text:"This is the best dining experience I've had in Lagos. The ambience, the service, the food. Odun's Place is in a league of its own." },
  { name:"Moses T.",  city:"Lekki",           stars:5, text:"That Egusi Soup genuinely made me emotional. I didn't know Nigerian food could hit at this level. First class." },
  { name:"Laris I.",  city:"Abuja",           stars:5, text:"Flew into Lagos specifically to eat here. The pepper soup is a masterpiece. Already planning my return." },
];

const GALLERY = [
  { img:realInterior, label:"Inside Odun's Place", cls:"gal-tall" },
  { img:IMGS.dish2,   label:"Egusi Soup",           cls:"" },
  { img:IMGS.chef,    label:"Chef Odunayo",          cls:"" },
  { img:realExterior, label:"Our Restaurant",        cls:"gal-wide" },
  { img:IMGS.spices,  label:"Fresh Spices",          cls:"" },
  { img:IMGS.table,   label:"Private Dining",        cls:"" },
];

const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const validatePhone = v => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v.trim());
const validateName  = v => v.trim().length >= 2;
const validateDate  = v => { if (!v) return false; return new Date(v) >= new Date(new Date().toDateString()); };

export default function App() {
  /* ── UI state ── */
  const [menuTab,    setMenuTab]    = useState("food");
  const [liveMenu,   setLiveMenu]   = useState(MENU);
  const [navSolid,   setNavSolid]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [inView, setInView] = useState(new Set());
  const refs = useRef({});

  /* ── Reservation form state ── */
  const [formData,  setFormData]  = useState({ name:"", email:"", phone:"", date:"", guests:"2", note:"" });
  const [errors,    setErrors]    = useState({});
  const [touched,   setTouched]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [sendError, setSendError] = useState("");

  /* ── Cart & checkout state ── */
  const [cart,          setCart]          = useState([]);
  const [cartOpen,      setCartOpen]      = useState(false);
  const [checkoutStep,  setCheckoutStep]  = useState(0);
  const [deliveryType,  setDeliveryType]  = useState("pickup");
  const [deliveryAddr,  setDeliveryAddr]  = useState("");
  const [payMethod,     setPayMethod]     = useState("transfer");
  const [orderLoading,  setOrderLoading]  = useState(false);
  const [orderName,     setOrderName]     = useState("");
  const [orderPhone,    setOrderPhone]    = useState("");
  const [orderEmail,    setOrderEmail]    = useState("");
  const [paystackReady, setPaystackReady] = useState(typeof window !== 'undefined' && typeof window.PaystackPop !== 'undefined');

  /* ── Cart helpers ── */
  const addToCart = (dish) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === dish.id);
      if (exists) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: dish.id, name: dish.name, amount: dish.amount, qty: 1 }];
    });
    setCartOpen(true);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );
  const cartCount   = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal    = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const total       = subtotal + deliveryFee;

  /* ── Order helpers ── */
  const buildSummary = (paystackRef) => {
    const items = cart.map(i => i.qty + "x " + i.name + " (" + fmt(i.amount * i.qty) + ")").join(", ");
    const dtype = deliveryType === "delivery" ? "Delivery to: " + deliveryAddr : "Pickup";
    const pay   = paystackRef ? "PAID via Paystack Ref:" + paystackRef : payMethod;
    return "Name:" + orderName + " | Phone:" + orderPhone + " | " + dtype + " | Payment:" + pay + " | " + items + " | TOTAL:" + fmt(total);
  };

  const sendConfirmation = async (summary) => {
    const msg = encodeURIComponent("NEW ORDER - Odun's Place | " + summary);
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + msg, "_blank");
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: orderName, from_email: orderEmail || "order@oduns.place",
        phone: orderPhone, date: "Order", guests: "N/A",
        note: summary, reply_to: orderEmail || "order@oduns.place",
      });
    } catch (_) {}
  };

  const placeOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim()) return;
    setOrderLoading(true);
    await sendConfirmation(buildSummary(null));
    setOrderLoading(false);
    setCart([]);
    setCartOpen(false);
    setCheckoutStep(3);
  };

  const paystackPay = () => {
    // Validate fields first
    if (!orderName.trim()) { alert("Please enter your name in Step 1."); return; }
    if (!orderPhone.trim()) { alert("Please enter your phone number in Step 1."); return; }
    if (!orderEmail.trim()) { alert("Please enter your email in Step 1 — required for online payment."); return; }
    if (deliveryType === "delivery" && !deliveryAddr.trim()) { alert("Please enter your delivery address."); return; }

    // Check Paystack is loaded
    if (typeof window.PaystackPop === "undefined") {
      alert("Payment gateway not ready. Please wait a moment and try again.");
      return;
    }

    // Use InlineJs — called synchronously inside a click handler (browser requires this)
    try {
      const popup = new window.PaystackPop();
      popup.newTransaction({
        key: PAYSTACK_KEY,
        email: orderEmail.trim(),
        amount: total * 100,
        currency: "NGN",
        ref: "ODP_" + Date.now(),
        firstName: orderName.split(" ")[0] || orderName,
        lastName: orderName.split(" ").slice(1).join(" ") || "-",
        phone: orderPhone.trim(),
        onSuccess: (transaction) => {
          sendConfirmation(buildSummary(transaction.reference));
          setCart([]);
          setCartOpen(false);
          setCheckoutStep(3);
        },
        onCancel: () => {},
      });
    } catch (err) {
      // Fallback to older setup() API if newTransaction not available
      try {
        const handler = window.PaystackPop.setup({
          key: PAYSTACK_KEY,
          email: orderEmail.trim(),
          amount: total * 100,
          currency: "NGN",
          ref: "ODP_" + Date.now(),
          callback: (response) => {
            sendConfirmation(buildSummary(response.reference));
            setCart([]);
            setCartOpen(false);
            setCheckoutStep(3);
          },
          onClose: () => {},
        });
        handler.openIframe();
      } catch (err2) {
        alert("Could not open payment. Please try Bank Transfer or contact us on WhatsApp.");
      }
    }
  };

  /* ── Effects ── */
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    // Eagerly load Paystack so it's ready before user reaches checkout
    if (typeof window.PaystackPop === "undefined" && !document.querySelector('script[src*="paystack"]')) {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v1/inline.js";
      s.async = true;
      s.onload = () => setPaystackReady(true);
      document.head.appendChild(s);
    } else if (typeof window.PaystackPop !== "undefined") {
      setPaystackReady(true);
    } else {
      // Script tag exists but not loaded yet — wait for it
      const poll = setInterval(() => {
        if (typeof window.PaystackPop !== "undefined") {
          setPaystackReady(true);
          clearInterval(poll);
        }
      }, 200);
      setTimeout(() => clearInterval(poll), 10000);
    }
    // Pre-load Paystack script in background so it is ready when user clicks
    if (!document.querySelector('script[src*="paystack"]')) {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v1/inline.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Live menu from Firebase — updates instantly when admin makes changes ──
  useEffect(() => {
    const unsub = onSnapshot(_menuDoc,
      snap => {
        if (!snap.exists()) return;
        const data = snap.data();
        // Build merged menu: Firebase is the source of truth for name/price/available
        // Local MENU provides img and desc fallbacks for items without them
        const merged = {};
        Object.keys(MENU).forEach(cat => {
          const localMap = Object.fromEntries(MENU[cat].items.map(i => [i.id, i]));
          const fbItems  = data[cat]?.items ?? [];
          merged[cat] = {
            ...MENU[cat],
            // Use EXACTLY what Firebase has — if admin deleted it, it's gone
            items: fbItems.map(fi => ({
              img:  localMap[fi.id]?.img  || "",   // fallback to local img if no custom photo
              desc: localMap[fi.id]?.desc || "",   // fallback to local desc
              ...fi,                                // Firebase values win (name, price, available, img if uploaded)
            })),
          };
        });
        setLiveMenu(merged);
      },
      err => console.warn("Firebase menu read failed, using default:", err)
    );
    return unsub;
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
  const vis    = id => inView.has(id);

  /* ── Reservation form helpers ── */
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
    if (touched[field]) setErrors(prev => ({ ...prev, [field]: validate(updated)[field] }));
  };
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validate(formData)[field] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError("");
    setTouched({ name:true, email:true, phone:true, date:true });
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name, from_email: formData.email,
        phone: formData.phone, date: formData.date,
        guests: formData.guests, note: formData.note || "None",
        reply_to: formData.email,
      });
      setSubmitted(true);
      setFormData({ name:"", email:"", phone:"", date:"", guests:"2", note:"" });
      setErrors({}); setTouched({});
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      const code = err?.status;
      let msg = "Could not send reservation.";
      if (code === 401 || code === 403) msg = "Email config error. Contact us directly.";
      if (code === 404) msg = "Template not found. Contact us directly.";
      if (code === 429) msg = "Too many requests. Please try again.";
      setSendError(msg + " WhatsApp: +" + WA_NUMBER);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* WHATSAPP BUBBLE */}
        <a href={"https://wa.me/" + WA_NUMBER} target="_blank" rel="noopener noreferrer" className="wa-bubble" aria-label="WhatsApp">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>

        {/* NAV */}
        <nav className={"nav" + (navSolid ? " nav--on" : "")}>
          <a href="#top" className="logo">
            <span className="logo-mark">O</span>
            <div className="logo-text-wrap">
              <span className="logo-name">ODUN'S PLACE</span>
              <span className="logo-sub">Fine African Dining</span>
            </div>
          </a>
          <ul className="nav-ul">
            {["Menu","Story","Gallery","Reserve"].map(l => (
              <li key={l}><a href={"#" + l.toLowerCase()} className="nav-a">{l}</a></li>
            ))}
          </ul>
          <a href={"tel:+" + WA_NUMBER} className="nav-phone">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.22 1.05 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +234 704 251 9585
          </a>
          <button className="cart-nav-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className={"b1" + (mobileOpen ? " bx1" : "")} />
            <span className={"b2" + (mobileOpen ? " bx2" : "")} />
            <span className={"b3" + (mobileOpen ? " bx3" : "")} />
          </button>
        </nav>

        {/* MOBILE NAV */}
        {mobileOpen && (
          <div className="mob-nav">
            {["Menu","Story","Gallery","Reserve"].map(l => (
              <a key={l} href={"#" + l.toLowerCase()} className="mob-a" onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
            <a href={"tel:+" + WA_NUMBER} className="mob-phone">+234 704 251 9585</a>
            <a href={"https://wa.me/" + WA_NUMBER} target="_blank" rel="noopener noreferrer" className="mob-wa">WhatsApp Us</a>
          </div>
        )}

        {/* HERO */}
        <section className="hero" id="top">
          <img src={IMGS.hero} alt="Odun's Place" className="hero-img" />
          <div className="hero-scrim" />
          <div className="hero-body">
            <div className="hero-eyebrow"><span className="eyebrow-dot" />Lagos, Badagry Expressway</div>
            <h1 className="hero-h1">
              <span className="h1-thin">Where tradition meets</span>
              <span className="h1-bold">Excellence.</span>
            </h1>
            <p className="hero-p">Authentic West African cuisine crafted with passion. Every dish tells a story — from our kitchen to your table.</p>
            <div className="hero-ctas">
              <a href="#menu" className="cta-orange">Explore Menu</a>
              <a href="#reserve" className="cta-outline">Reserve a Table</a>
            </div>
          </div>
          <div className="hero-bar">
            <div className="hb-item"><span className="hb-num">48</span><span className="hb-lbl">Signature Dishes</span></div>
            <div className="hb-div" />
            <div className="hb-item"><span className="hb-num">12+</span><span className="hb-lbl">Years of Mastery</span></div>
            <div className="hb-div" />
            <div className="hb-item"><span className="hb-num">2,400+</span><span className="hb-lbl">Five-Star Reviews</span></div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {[0,1,2].map(i => (
              <span key={i} className="ticker-txt">Rooted in culture &nbsp;·&nbsp; Served in style &nbsp;·&nbsp; Authentically African &nbsp;·&nbsp; Globally acclaimed &nbsp;·&nbsp; Lagos finest table &nbsp;·&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>

        {/* STORY */}
        <section className="story" id="story" data-id="story" ref={setRef("story")}>
          <div className={"story-inner" + (vis("story") ? " revealed" : "")}>
            <div className="story-images">
              <div className="story-img-main"><img src={IMGS.about1} alt="Odun's Place dining" /></div>
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
              <p className="story-p">Odun's Place started with a single conviction — that West African cuisine deserved a seat at the world's finest tables. Not as fusion. Not as novelty. But exactly as it is: complex, soulful, and extraordinary.</p>
              <p className="story-p">Chef Ibeakanma Biodun spent years studying both the roadside buka before returning home to Lagos to build something the city had never seen before.</p>
              <div className="story-stats">
                <div className="ss"><span className="ss-n">48</span><span className="ss-l">Signature dishes</span></div>
                <div className="ss"><span className="ss-n">12+</span><span className="ss-l">Years of mastery</span></div>
                <div className="ss"><span className="ss-n">2,400+</span><span className="ss-l">Five-star reviews</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section className="menu-sec" id="menu" data-id="menu" ref={setRef("menu")}>
          <div className={"menu-inner" + (vis("menu") ? " revealed" : "")}>
            <div className="menu-head">
              <p className="sec-tag">Our Full Menu</p>
              <h2 className="sec-h2">Every craving.<br />Sorted.</h2>
              <p className="menu-sub">Authentic Nigerian cuisine made fresh daily — dine in, pick up, or get it delivered.</p>
            </div>
            <div className="menu-tabs">
              {Object.entries(MENU).map(([key, cat]) => (
                <button key={key} className={"menu-tab" + (menuTab === key ? " menu-tab--on" : "")} onClick={() => setMenuTab(key)}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <div className="dishes-grid">
              {liveMenu[menuTab].items.map(d => (
                <article key={d.id} className={"dish" + (d.available === false ? " dish--unavail" : "")}>
                  <div className="dish-img-wrap">
                    <img src={d.img || IMGS.dish1} alt={d.name} className="dish-img" loading="lazy" />
                    <span className="dish-tag-badge">{d.tag || "Special"}</span>
                    {d.available === false && <div className="dish-unavail-overlay">Unavailable Today</div>}
                  </div>
                  <div className="dish-copy">
                    <div className="dish-row">
                      <h3 className="dish-name">{d.name}</h3>
                      <span className="dish-price">{fmt(d.amount)}</span>
                    </div>
                    <p className="dish-desc">{d.desc || ""}</p>
                    {d.available === false
                      ? <button className="add-to-cart-btn add-to-cart-btn--disabled" disabled>Unavailable Today</button>
                      : <button className="add-to-cart-btn" onClick={() => addToCart(d)}><span className="atc-plus">+</span> Add to Order</button>
                    }
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE BREAK */}
        <div className="img-break">
          <img src={IMGS.exterior} alt="Odun's Place exterior" className="img-break-photo" style={{objectPosition:"center center"}} />
          <div className="img-break-scrim" />
          <div className="img-break-text">
            <p className="ibt-tag">The Experience</p>
            <h2 className="ibt-quote">"Come for the food.<br/>Stay for the feeling."</h2>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="reviews-sec" data-id="reviews" ref={setRef("reviews")}>
          <div className={"reviews-inner" + (vis("reviews") ? " revealed" : "")}>
            <div className="reviews-left">
              <p className="sec-tag">Guest Reviews</p>
              <h2 className="sec-h2">They came.<br />They tasted.<br />They came back.</h2>
              <div className="rnav">
                {REVIEWS.map((r, i) => (
                  <button key={i} className={"rnav-btn" + (activeReview === i ? " rnav-on" : "")} onClick={() => setActiveReview(i)}>{r.name}</button>
                ))}
              </div>
            </div>
            <div className="reviews-right">
              {REVIEWS.map((r, i) => (
                <div key={i} className={"rc" + (activeReview === i ? " rc-active" : "")}>
                  <div className="rc-stars">{"★".repeat(r.stars)}</div>
                  <p className="rc-text">"{r.text}"</p>
                  <div className="rc-author">
                    <div className="rc-avatar">{r.name[0]}</div>
                    <div><p className="rc-name">{r.name}</p><p className="rc-city">{r.city}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="gal-sec" id="gallery" data-id="gallery" ref={setRef("gallery")}>
          <div className={"gal-inner" + (vis("gallery") ? " revealed" : "")}>
            <div className="gal-head">
              <p className="sec-tag">Gallery</p>
              <h2 className="sec-h2">See it before<br />you taste it.</h2>
            </div>
            <div className="gal-grid">
              {GALLERY.map((g, i) => (
                <div key={i} className={"gal-item " + g.cls}>
                  <img src={g.img} alt={g.label} className="gal-img" loading="lazy" />
                  <div className="gal-overlay"><span className="gal-label">{g.label}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHATSAPP CTA */}
        <section className="wa-sec">
          <img src={IMGS.interior} alt="Odun's Place" className="wa-bg-img" />
          <div className="wa-bg-dark" />
          <div className="wa-content">
            <h2 className="wa-h2">Let's talk<br />food.</h2>
            <p className="wa-p">Have a question? Want to plan a special event? We're one message away.</p>
            <div className="wa-btns">
              <a href={"https://wa.me/" + WA_NUMBER + "?text=Hi%20Odun's%20Place%2C%20I'd%20like%20to%20enquire%20about..."} target="_blank" rel="noopener noreferrer" className="cta-wa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <a href="#reserve" className="cta-outline">Reserve a Table</a>
            </div>
          </div>
        </section>

        {/* RESERVATION */}
        <section className="res-sec" id="reserve" data-id="reserve" ref={setRef("reserve")}>
          <div className={"res-inner" + (vis("reserve") ? " revealed" : "")}>
            <div className="res-left">
              <img src={IMGS.interior} alt="Odun's Place interior" className="res-photo" />
              <div className="res-info">
                <p className="sec-tag">Find Us</p>
                <p className="res-addr">Comforter Road, Badagry Expressway<br />Lagos, Nigeria</p>
                <div className="res-hours">
                  {[["Mon – Thu","12:00 – 22:00"],["Fri – Sat","12:00 – 23:00"],["Sunday","13:00 – 21:00"]].map(([d,t]) => (
                    <div key={d} className="res-hour-row"><span className="res-day">{d}</span><span className="res-time">{t}</span></div>
                  ))}
                </div>
                <a href="https://maps.google.com/?q=Badagry+Expressway+Lagos" target="_blank" rel="noopener noreferrer" className="res-map-link">→ GET DIRECTIONS</a>
              </div>
            </div>
            <div className="res-right">
              <p className="sec-tag">Reservations</p>
              <h2 className="sec-h2">Book your<br />table.</h2>
              <p className="res-sub">Reserve your table and we'll have everything ready before you arrive.</p>
              {submitted && (
                <div className="res-success"><span className="res-success-icon">✓</span><span>Reservation confirmed! We'll be in touch shortly.</span></div>
              )}
              {sendError && (
                <div className="res-error"><span>⚠</span><span>{sendError}</span></div>
              )}
              <div className="res-form">
                <div className="res-row">
                  <div className="res-field">
                    <label className="res-label">Full Name</label>
                    <input className={"res-input" + (errors.name ? " res-input--err" : touched.name && !errors.name ? " res-input--ok" : "")} placeholder="Adaeze Okonkwo" value={formData.name} onChange={e => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")} />
                    {errors.name && <span className="res-err">{errors.name}</span>}
                  </div>
                  <div className="res-field">
                    <label className="res-label">Email</label>
                    <input className={"res-input" + (errors.email ? " res-input--err" : touched.email && !errors.email ? " res-input--ok" : "")} placeholder="adaeze@email.com" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} />
                    {errors.email && <span className="res-err">{errors.email}</span>}
                  </div>
                </div>
                <div className="res-row">
                  <div className="res-field">
                    <label className="res-label">Phone</label>
                    <input className={"res-input" + (errors.phone ? " res-input--err" : touched.phone && !errors.phone ? " res-input--ok" : "")} placeholder="+234 800 000 0000" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} onBlur={() => handleBlur("phone")} />
                    {errors.phone && <span className="res-err">{errors.phone}</span>}
                  </div>
                  <div className="res-field">
                    <label className="res-label">Date</label>
                    <input className={"res-input" + (errors.date ? " res-input--err" : touched.date && !errors.date ? " res-input--ok" : "")} type="date" value={formData.date} onChange={e => handleChange("date", e.target.value)} onBlur={() => handleBlur("date")} />
                    {errors.date && <span className="res-err">{errors.date}</span>}
                  </div>
                </div>
                <div className="res-field">
                  <label className="res-label">Number of Guests</label>
                  <select className="res-input" value={formData.guests} onChange={e => handleChange("guests", e.target.value)}>
                    {["1","2","3","4","5","6","7","8","9","10+"].map(n => <option key={n} value={n}>{n} {n === "1" ? "Guest" : "Guests"}</option>)}
                  </select>
                </div>
                <div className="res-field">
                  <label className="res-label">Special Requests</label>
                  <textarea className="res-input" style={{height:"90px",resize:"vertical"}} placeholder="Dietary requirements, occasion, seating preference..." value={formData.note} onChange={e => handleChange("note", e.target.value)} />
                </div>
                <button className={"res-submit" + (loading ? " res-submit--loading" : "")} onClick={handleSubmit} disabled={loading}>
                  {loading ? <span className="res-spinner-wrap"><span className="res-spinner"/>Sending...</span> : "Confirm Reservation →"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top">
            <div>
              <div className="logo" style={{marginBottom:"16px"}}>
                <span className="logo-mark">O</span>
                <div className="logo-text-wrap">
                  <span className="logo-name">ODUN'S PLACE</span>
                  <span className="logo-sub">Fine African Dining</span>
                </div>
              </div>
              <p className="footer-blurb">Authentic West African cuisine on Badagry Expressway, Lagos. Where tradition meets excellence, one dish at a time.</p>
            </div>
            <div>
              <p className="footer-col-head">Navigate</p>
              {["#menu","#story","#gallery","#reserve"].map((h,i) => (
                <a key={h} href={h} className="footer-a">{["Menu","Our Story","Gallery","Reserve"][i]}</a>
              ))}
            </div>
            <div>
              <p className="footer-col-head">Hours</p>
              {[["Mon–Thu","12:00 – 22:00"],["Fri–Sat","12:00 – 23:00"],["Sunday","13:00 – 21:00"]].map(([d,t]) => (
                <p key={d} className="footer-txt">{d}: {t}</p>
              ))}
            </div>
            <div>
              <p className="footer-col-head">Contact</p>
              <a href={"tel:+" + WA_NUMBER} className="footer-a">+234 704 251 9585</a>
              <a href={"https://wa.me/" + WA_NUMBER} target="_blank" rel="noopener noreferrer" className="footer-a">WhatsApp</a>
              <p className="footer-txt">Comforter Road<br />Badagry Expressway, Lagos</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© {new Date().getFullYear()} Odun's Place. All rights reserved.</span>
            <span className="footer-copy">Badagry Expressway, Lagos, Nigeria</span>
          </div>
        </footer>

        {/* CART DRAWER */}
        {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)} />}
        <div className={"cart-drawer" + (cartOpen ? " cart-drawer--open" : "")}>
          <div className="cd-head">
            <h3 className="cd-title">Your Order</h3>
            <button className="cd-close" onClick={() => setCartOpen(false)}>✕</button>
          </div>
          {cart.length === 0 ? (
            <div className="cd-empty">
              <p>Your cart is empty.</p>
              <p style={{fontSize:"12px",marginTop:"8px",color:"rgba(243,232,216,0.3)"}}>Add dishes from the menu above</p>
            </div>
          ) : (
            <>
              <div className="cd-items">
                {cart.map(item => (
                  <div key={item.id} className="cd-item">
                    <div className="cd-item-info">
                      <p className="cd-item-name">{item.name}</p>
                      <p className="cd-item-price">{fmt(item.amount * item.qty)}</p>
                    </div>
                    <div className="cd-item-controls">
                      <button className="cd-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="cd-qty">{item.qty}</span>
                      <button className="cd-qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      <button className="cd-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cd-footer">
                <div className="cd-subtotal-row">
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <button className="cd-checkout-btn" onClick={() => { setCartOpen(false); setCheckoutStep(1); }}>
                  Proceed to Checkout →
                </button>
              </div>
            </>
          )}
        </div>

        {/* CHECKOUT MODAL */}
        {checkoutStep > 0 && checkoutStep < 3 && (
          <div className="ck-backdrop" onClick={e => e.target === e.currentTarget && setCheckoutStep(0)}>
            <div className="ck-modal">
              <div className="ck-steps">
                {["Details","Delivery & Pay"].map((s,i) => (
                  <div key={s} className={"ck-step" + (checkoutStep >= i+1 ? " ck-step--on" : "")}>
                    <span className="ck-step-dot">{i+1}</span>
                    <span className="ck-step-lbl">{s}</span>
                  </div>
                ))}
              </div>

              {checkoutStep === 1 && (
                <div className="ck-body">
                  <h3 className="ck-heading">Your Details</h3>
                  <p className="ck-sub">So we know who to contact about your order.</p>
                  <div className="ck-fields">
                    <div className="ck-field">
                      <label className="ck-label">Full Name *</label>
                      <input className="ck-input" placeholder="Adaeze Okonkwo" value={orderName} onChange={e => setOrderName(e.target.value)} />
                    </div>
                    <div className="ck-field">
                      <label className="ck-label">Phone / WhatsApp *</label>
                      <input className="ck-input" placeholder="+234 800 000 0000" value={orderPhone} onChange={e => setOrderPhone(e.target.value)} />
                    </div>
                    <div className="ck-field">
                      <label className="ck-label">Email (required for online payment)</label>
                      <input className="ck-input" placeholder="adaeze@email.com" value={orderEmail} onChange={e => setOrderEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="ck-actions">
                    <button className="ck-back" onClick={() => { setCheckoutStep(0); setCartOpen(true); }}>← Back</button>
                    <button className="ck-next" disabled={!orderName.trim() || !orderPhone.trim()} onClick={() => setCheckoutStep(2)}>Continue →</button>
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="ck-body">
                  <h3 className="ck-heading">Delivery & Payment</h3>
                  <p className="ck-section-lbl">How to receive your order?</p>
                  <div className="ck-toggle-row">
                    <button className={"ck-toggle" + (deliveryType === "pickup" ? " ck-toggle--on" : "")} onClick={() => setDeliveryType("pickup")}>🏠 Pickup</button>
                    <button className={"ck-toggle" + (deliveryType === "delivery" ? " ck-toggle--on" : "")} onClick={() => setDeliveryType("delivery")}>🛵 Delivery</button>
                  </div>
                  {deliveryType === "delivery" && (
                    <div className="ck-field" style={{marginTop:"12px"}}>
                      <label className="ck-label">Delivery Address *</label>
                      <input className="ck-input" placeholder="House number, street, area, Lagos" value={deliveryAddr} onChange={e => setDeliveryAddr(e.target.value)} />
                      <p className="ck-delivery-note">Delivery fee: <strong>{fmt(DELIVERY_FEE)}</strong> (flat rate, Lagos)</p>
                    </div>
                  )}
                  <p className="ck-section-lbl" style={{marginTop:"24px"}}>Payment Method</p>
                  <div className="ck-pay-options">
                    {[
                      { id:"paystack", icon:"🔒", label:"Pay Online (Card / Transfer)", sub:"Secure Paystack payment — instant confirmation" },
                      { id:"transfer", icon:"🏦", label:"Bank Transfer",                sub:"Pay to our account, send proof via WhatsApp" },
                      { id:"card",     icon:"💳", label:"POS on Delivery",             sub:"Card machine brought to your door" },
                      { id:"cash",     icon:"💵", label:"Cash on Delivery",            sub:"Pay cash when your order arrives" },
                    ].map(p => (
                      <button key={p.id} className={"ck-pay-opt" + (payMethod === p.id ? " ck-pay-opt--on" : "")} onClick={() => setPayMethod(p.id)}>
                        <span className="cpo-icon">{p.icon}</span>
                        <div><p className="cpo-label">{p.label}</p><p className="cpo-sub">{p.sub}</p></div>
                        {payMethod === p.id && <span className="cpo-check">✓</span>}
                      </button>
                    ))}
                  </div>
                  <div className="ck-summary">
                    <div className="ck-sum-title">Order Summary</div>
                    {cart.map(i => (
                      <div key={i.id} className="ck-sum-row"><span>{i.qty}× {i.name}</span><span>{fmt(i.amount * i.qty)}</span></div>
                    ))}
                    <div className="ck-sum-row"><span>Delivery</span><span>{deliveryType === "delivery" ? fmt(DELIVERY_FEE) : "Free (Pickup)"}</span></div>
                    <div className="ck-sum-total"><span>TOTAL</span><span>{fmt(total)}</span></div>
                  </div>
                  {payMethod === "transfer" && (
                    <div className="ck-bank-details">
                      <p className="ck-bank-title">Bank Transfer Details</p>
                      <p className="ck-bank-row"><span>Bank:</span><strong>GTBank</strong></p>
                      <p className="ck-bank-row"><span>Account Name:</span><strong>Odun's Place Restaurant</strong></p>
                      <p className="ck-bank-row"><span>Account No:</span><strong>0123456789</strong></p>
                      <p className="ck-bank-note">Send proof of payment via WhatsApp after placing order.</p>
                    </div>
                  )}
                  <div className="ck-actions">
                    <button className="ck-back" onClick={() => setCheckoutStep(1)}>← Back</button>
                    {payMethod === "paystack" ? (
                      <button className="ck-place ck-place--paystack" onClick={paystackPay}>
                        🔒 Pay {fmt(total)} Securely
                      </button>
                    ) : (
                      <button className="ck-place" disabled={orderLoading || (deliveryType === "delivery" && !deliveryAddr.trim())} onClick={placeOrder}>
                        {orderLoading ? <span className="res-spinner-wrap"><span className="res-spinner"/>Placing...</span> : ("Place Order · " + fmt(total))}
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDER SUCCESS */}
        {checkoutStep === 3 && (
          <div className="ck-backdrop" onClick={() => setCheckoutStep(0)}>
            <div className="ck-modal ck-success-modal" onClick={e => e.stopPropagation()}>
              <div className="ck-success-icon">🍽️</div>
              <h3 className="ck-success-title">Order Placed!</h3>
              <p className="ck-success-msg">Your order has been sent to us on WhatsApp. We'll confirm and give you an ETA shortly.</p>
              <button className="ck-next" style={{marginTop:"28px",width:"100%"}} onClick={() => setCheckoutStep(0)}>Done</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
:root {
  --ink: #0c0703; --ink2: #140a05; --orange: #E8520A; --orange2: #FF6B1A;
  --cream: #F3E8D8; --cream2: rgba(243,232,216,0.72); --cream3: rgba(243,232,216,0.38);
  --serif: 'Cormorant', Georgia, serif; --sans: 'Outfit', system-ui, sans-serif;
}
.app { background: var(--ink); color: var(--cream); overflow-x: hidden; }
.wa-bubble { position: fixed; bottom: 26px; right: 26px; z-index: 9999; width: 50px; height: 50px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(37,211,102,0.45); transition: transform .2s; text-decoration: none; }
.wa-bubble:hover { transform: scale(1.1); }
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 22px 52px; transition: background .3s, padding .3s, border-color .3s; border-bottom: 1px solid transparent; gap: 16px; }
.nav--on { background: rgba(12,7,3,0.97); backdrop-filter: blur(16px); padding: 14px 52px; border-bottom-color: rgba(232,82,10,0.1); }
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
.cart-nav-btn { position: relative; background: none; border: 1px solid rgba(232,82,10,0.3); color: var(--cream2); padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: border-color .2s, color .2s; }
.cart-nav-btn:hover { border-color: var(--orange); color: var(--orange); }
.cart-badge { position: absolute; top: -6px; right: -6px; background: var(--orange); color: var(--ink); font-family: var(--sans); font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.burger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
.b1,.b2,.b3 { display: block; width: 24px; height: 1.5px; background: var(--cream); transition: all .3s; transform-origin: center; }
.bx1 { transform: rotate(45deg) translate(4px,5px); } .bx2 { opacity: 0; } .bx3 { transform: rotate(-45deg) translate(4px,-5px); }
.mob-nav { position: fixed; inset: 0; background: rgba(12,7,3,0.99); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; }
.mob-a { font-family: var(--serif); font-size: 36px; font-weight: 600; color: var(--cream); text-decoration: none; letter-spacing: 3px; transition: color .2s; }
.mob-a:hover { color: var(--orange); }
.mob-phone { font-family: var(--sans); font-size: 14px; color: var(--cream3); text-decoration: none; }
.mob-wa { background: var(--orange); color: var(--ink); padding: 14px 32px; font-family: var(--sans); font-size: 13px; font-weight: 600; text-decoration: none; }
.hero { position: relative; height: 100vh; min-height: 640px; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 35%; }
.hero-scrim { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(12,7,3,0.2) 0%, rgba(12,7,3,0.08) 35%, rgba(12,7,3,0.6) 68%, rgba(12,7,3,0.97) 100%); }
.hero-body { position: relative; z-index: 2; padding: 0 64px 136px; max-width: 820px; }
.hero-eyebrow { display: flex; align-items: center; gap: 10px; font-family: var(--sans); font-size: 11px; letter-spacing: 4px; color: rgba(232,82,10,0.9); text-transform: uppercase; margin-bottom: 18px; }
.eyebrow-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--orange); flex-shrink: 0; }
.hero-h1 { display: flex; flex-direction: column; margin-bottom: 18px; }
.h1-thin { font-family: var(--serif); font-size: clamp(20px,3vw,42px); font-weight: 300; font-style: italic; color: var(--cream2); line-height: 1.25; }
.h1-bold { font-family: var(--serif); font-size: clamp(56px,9vw,118px); font-weight: 700; color: var(--cream); line-height: 0.9; letter-spacing: -1.5px; }
.hero-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); font-weight: 300; line-height: 1.75; margin-bottom: 36px; max-width: 460px; }
.hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.cta-orange { display: inline-flex; align-items: center; gap: 8px; background: var(--orange); color: var(--ink); padding: 14px 34px; font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-decoration: none; text-transform: uppercase; transition: background .2s, transform .2s; }
.cta-orange:hover { background: var(--orange2); transform: translateY(-1px); }
.cta-outline { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(243,232,216,0.3); color: var(--cream); padding: 14px 28px; font-family: var(--sans); font-size: 12px; font-weight: 400; letter-spacing: 1.5px; text-decoration: none; text-transform: uppercase; transition: border-color .2s, color .2s; }
.cta-outline:hover { border-color: var(--orange); color: var(--orange); }
.cta-wa { display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: #fff; padding: 15px 32px; font-family: var(--sans); font-size: 14px; font-weight: 600; text-decoration: none; transition: opacity .2s, transform .2s; }
.cta-wa:hover { opacity: .9; transform: translateY(-1px); }
.hero-bar { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; display: flex; align-items: stretch; padding: 0 64px; background: rgba(12,7,3,0.88); backdrop-filter: blur(14px); border-top: 1px solid rgba(232,82,10,0.12); }
.hb-item { display: flex; flex-direction: column; gap: 4px; padding: 18px 28px 18px 0; flex: 1; }
.hb-num { font-family: var(--serif); font-size: 27px; font-weight: 600; color: var(--orange); line-height: 1; }
.hb-lbl { font-family: var(--sans); font-size: 11px; color: var(--cream3); letter-spacing: 1px; }
.hb-div { width: 1px; background: rgba(232,82,10,0.12); margin: 14px 28px; }
.ticker { background: var(--orange); padding: 14px 0; overflow: hidden; }
.ticker-track { display: flex; white-space: nowrap; animation: tick 22s linear infinite; }
.ticker-txt { font-family: var(--serif); font-size: 17px; font-style: italic; color: var(--ink); }
@keyframes tick { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }
.sec-tag { font-family: var(--sans); font-size: 10px; letter-spacing: 5px; color: var(--orange); text-transform: uppercase; font-weight: 500; margin-bottom: 14px; display: block; }
.sec-h2 { font-family: var(--serif); font-size: clamp(38px,4.5vw,60px); font-weight: 700; line-height: 1.08; color: var(--cream); margin-bottom: 22px; }
.story-inner, .menu-inner, .reviews-inner, .gal-inner, .res-inner { opacity: 0; transform: translateY(26px); transition: opacity .8s ease, transform .8s ease; }
.revealed { opacity: 1 !important; transform: none !important; }
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
.badge-num { font-family: var(--serif); font-size: 44px; font-weight: 700; color: var(--cream); line-height: 1; }
.badge-city { font-family: var(--sans); font-size: 8px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; }
.story-copy { max-width: 520px; }
.story-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); line-height: 1.85; font-weight: 300; margin-bottom: 18px; }
.story-stats { display: flex; gap: 40px; margin-top: 36px; }
.ss { display: flex; flex-direction: column; gap: 4px; }
.ss-n { font-family: var(--serif); font-size: 38px; font-weight: 700; color: var(--orange); line-height: 1; }
.ss-l { font-family: var(--sans); font-size: 11px; color: var(--cream3); letter-spacing: 1px; }
.menu-sec { padding: 120px 64px; background: var(--ink); }
.menu-inner { max-width: 1280px; margin: 0 auto; }
.menu-head { margin-bottom: 40px; }
.menu-sub { font-family: var(--sans); font-size: 15px; color: var(--cream3); font-weight: 300; max-width: 480px; }
.menu-tabs { display: flex; gap: 0; flex-wrap: wrap; margin-bottom: 44px; border-bottom: 1px solid rgba(232,82,10,0.15); }
.menu-tab { background: none; border: none; border-bottom: 2px solid transparent; color: var(--cream3); font-family: var(--sans); font-size: 13px; font-weight: 500; letter-spacing: 1px; padding: 12px 22px; cursor: pointer; transition: color .2s, border-color .2s; margin-bottom: -1px; white-space: nowrap; }
.menu-tab:hover { color: var(--cream); }
.menu-tab--on { color: var(--orange); border-bottom-color: var(--orange); font-weight: 700; }
.dishes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.dish { background: var(--ink2); display: flex; flex-direction: column; transition: transform .3s; }
.dish:hover { transform: translateY(-4px); }
.dish-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.dish-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s; }
.dish:hover .dish-img { transform: scale(1.04); }
.dish-tag-badge { position: absolute; top: 14px; left: 14px; background: var(--orange); color: var(--ink); font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 4px 11px; }
.dish-copy { padding: 20px 22px 26px; flex: 1; display: flex; flex-direction: column; }
.dish-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 9px; }
.dish-name { font-family: var(--serif); font-size: 19px; font-weight: 600; color: var(--cream); line-height: 1.2; }
.dish-price { font-family: var(--serif); font-size: 17px; font-weight: 500; color: var(--orange); white-space: nowrap; }
.dish-desc { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.7; font-weight: 300; flex: 1; }
.add-to-cart-btn { margin-top: 14px; width: 100%; background: transparent; border: 1px solid rgba(232,82,10,0.35); color: var(--orange); font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 10px 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .2s, color .2s, border-color .2s; }
.add-to-cart-btn:hover { background: var(--orange); color: var(--ink); border-color: var(--orange); }
.add-to-cart-btn--disabled { opacity: 0.5; cursor: not-allowed; border-color: rgba(243,232,216,0.1); color: var(--cream3); }
.add-to-cart-btn--disabled:hover { background: transparent; color: var(--cream3); border-color: rgba(243,232,216,0.1); }
.dish--unavail { opacity: 0.55; }
.dish-unavail-overlay { position: absolute; inset: 0; background: rgba(12,7,3,0.7); display: flex; align-items: center; justify-content: center; font-family: var(--sans); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(243,232,216,0.6); }
.atc-plus { font-size: 16px; font-weight: 300; line-height: 1; }
.img-break { position: relative; height: 500px; overflow: hidden; }
.img-break-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.img-break-scrim { position: absolute; inset: 0; background: rgba(12,7,3,0.6); }
.img-break-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
.ibt-tag { font-family: var(--sans); font-size: 11px; letter-spacing: 5px; color: var(--orange); text-transform: uppercase; margin-bottom: 18px; }
.ibt-quote { font-family: var(--serif); font-size: clamp(32px,5vw,64px); font-style: italic; font-weight: 400; color: var(--cream); line-height: 1.25; }
.reviews-sec { padding: 120px 64px; background: var(--ink2); }
.reviews-inner { display: grid; grid-template-columns: 1fr 1.7fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
.rnav { display: flex; gap: 10px; margin-top: 32px; flex-wrap: wrap; }
.rnav-btn { background: none; border: 1px solid rgba(232,82,10,0.22); color: var(--cream3); padding: 9px 16px; font-family: var(--sans); font-size: 12px; letter-spacing: 2px; cursor: pointer; transition: all .25s; }
.rnav-on { background: var(--orange); border-color: var(--orange); color: var(--ink); font-weight: 600; }
.rc { display: none; } .rc-active { display: block; animation: rcIn .5s ease; }
@keyframes rcIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
.rc-stars { font-size: 18px; color: var(--orange); letter-spacing: 2px; margin-bottom: 20px; }
.rc-text { font-family: var(--serif); font-size: clamp(18px,2.2vw,25px); font-style: italic; color: var(--cream); line-height: 1.65; margin-bottom: 30px; }
.rc-author { display: flex; align-items: center; gap: 14px; }
.rc-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--orange); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--ink); flex-shrink: 0; }
.rc-name { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--cream); }
.rc-city { font-family: var(--sans); font-size: 12px; color: var(--cream3); margin-top: 2px; }
.gal-sec { padding: 120px 64px; background: var(--ink); }
.gal-inner { max-width: 1280px; margin: 0 auto; }
.gal-head { margin-bottom: 52px; }
.gal-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-template-rows: 260px 260px; gap: 4px; }
.gal-item { overflow: hidden; position: relative; cursor: pointer; }
.gal-tall { grid-row: span 2; } .gal-wide { grid-column: span 2; }
.gal-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .55s; }
.gal-item:hover .gal-img { transform: scale(1.05); }
.gal-overlay { position: absolute; inset: 0; background: rgba(12,7,3,0); display: flex; align-items: flex-end; padding: 18px; transition: background .3s; }
.gal-item:hover .gal-overlay { background: rgba(12,7,3,0.48); }
.gal-label { font-family: var(--sans); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--cream); opacity: 0; transform: translateY(8px); transition: opacity .3s, transform .3s; }
.gal-item:hover .gal-label { opacity: 1; transform: none; }
.wa-sec { position: relative; padding: 110px 64px; overflow: hidden; }
.wa-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.wa-bg-dark { position: absolute; inset: 0; background: rgba(12,7,3,0.88); }
.wa-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; text-align: center; }
.wa-h2 { font-family: var(--serif); font-size: clamp(44px,6vw,78px); font-weight: 700; color: var(--cream); line-height: 1.0; margin-bottom: 18px; }
.wa-p { font-family: var(--sans); font-size: 15px; color: var(--cream2); font-weight: 300; line-height: 1.8; margin-bottom: 38px; }
.wa-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
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
.res-form { display: flex; flex-direction: column; gap: 18px; }
.res-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.res-field { display: flex; flex-direction: column; gap: 8px; }
.res-label { font-family: var(--sans); font-size: 10px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; }
.res-input { background: rgba(243,232,216,0.04); border: 1px solid rgba(243,232,216,0.1); padding: 13px 15px; color: var(--cream); font-family: var(--sans); font-size: 14px; outline: none; width: 100%; transition: border-color .2s; border-radius: 0; -webkit-appearance: none; }
.res-input:focus { border-color: var(--orange); }
.res-input::placeholder { color: rgba(243,232,216,0.18); }
.res-input option { background: var(--ink2); color: var(--cream); }
.res-submit { background: var(--orange); border: none; color: var(--ink); padding: 16px; font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; cursor: pointer; transition: background .2s, opacity .2s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; }
.res-submit:hover:not(:disabled) { background: var(--orange2); }
.res-submit--loading { opacity: .8; cursor: not-allowed; }
.res-spinner-wrap { display: flex; align-items: center; gap: 10px; }
.res-spinner { width: 16px; height: 16px; border: 2px solid rgba(12,7,3,0.3); border-top-color: var(--ink); border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.res-input--err { border-color: #e53e3e !important; background: rgba(229,62,62,0.05) !important; }
.res-input--ok { border-color: #38a169 !important; background: rgba(56,161,105,0.04) !important; }
.res-err { font-family: var(--sans); font-size: 11px; color: #fc8181; margin-top: 5px; display: block; letter-spacing: .3px; }
.res-success { display: flex; align-items: center; gap: 12px; background: rgba(56,161,105,0.1); border: 1px solid rgba(56,161,105,0.4); color: #68d391; padding: 15px 18px; font-family: var(--sans); font-size: 13px; margin-bottom: 22px; line-height: 1.5; }
.res-success-icon { font-size: 18px; flex-shrink: 0; }
.res-error { display: flex; align-items: flex-start; gap: 10px; background: rgba(229,62,62,0.08); border: 1px solid rgba(229,62,62,0.35); color: #fc8181; padding: 15px 18px; font-family: var(--sans); font-size: 13px; margin-bottom: 22px; line-height: 1.6; }
.footer { border-top: 1px solid rgba(232,82,10,0.1); background: var(--ink); }
.footer-top { padding: 68px 64px 52px; display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 44px; max-width: 1280px; margin: 0 auto; }
.footer-blurb { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.8; font-weight: 300; }
.footer-col-head { font-family: var(--sans); font-size: 10px; letter-spacing: 4px; color: var(--orange); text-transform: uppercase; font-weight: 600; margin-bottom: 18px; }
.footer-a { display: block; font-family: var(--sans); font-size: 13px; color: var(--cream3); text-decoration: none; margin-bottom: 10px; transition: color .2s; font-weight: 300; }
.footer-a:hover { color: var(--orange); }
.footer-txt { font-family: var(--sans); font-size: 13px; color: var(--cream3); line-height: 1.8; margin-bottom: 10px; font-weight: 300; }
.footer-bottom { padding: 20px 64px; border-top: 1px solid rgba(232,82,10,0.07); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; max-width: 1280px; margin: 0 auto; }
.footer-copy { font-family: var(--sans); font-size: 12px; color: rgba(243,232,216,0.2); }
.cart-overlay { position: fixed; inset: 0; background: rgba(12,7,3,0.7); z-index: 1100; backdrop-filter: blur(4px); }
.cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 420px; max-width: 100vw; background: #1a0f08; border-left: 1px solid rgba(232,82,10,0.15); z-index: 1200; display: flex; flex-direction: column; transform: translateX(100%); transition: transform .35s cubic-bezier(.4,0,.2,1); }
.cart-drawer--open { transform: translateX(0); }
.cd-head { display: flex; justify-content: space-between; align-items: center; padding: 22px 24px; border-bottom: 1px solid rgba(232,82,10,0.1); }
.cd-title { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--cream); }
.cd-close { background: none; border: none; color: var(--cream3); font-size: 18px; cursor: pointer; padding: 4px 8px; transition: color .2s; }
.cd-close:hover { color: var(--orange); }
.cd-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; color: var(--cream3); font-family: var(--sans); font-size: 15px; }
.cd-items { flex: 1; overflow-y: auto; padding: 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.cd-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px; border: 1px solid rgba(232,82,10,0.1); background: rgba(232,82,10,0.03); }
.cd-item-info { flex: 1; min-width: 0; }
.cd-item-name { font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--cream); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cd-item-price { font-family: var(--serif); font-size: 15px; color: var(--orange); font-weight: 600; }
.cd-item-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.cd-qty-btn { background: rgba(232,82,10,0.12); border: none; color: var(--cream); width: 26px; height: 26px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
.cd-qty-btn:hover { background: var(--orange); color: var(--ink); }
.cd-qty { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--cream); min-width: 18px; text-align: center; }
.cd-remove { background: none; border: none; color: rgba(243,232,216,0.3); font-size: 12px; cursor: pointer; padding: 4px; transition: color .2s; margin-left: 4px; }
.cd-remove:hover { color: #fc8181; }
.cd-footer { padding: 20px 24px; border-top: 1px solid rgba(232,82,10,0.12); }
.cd-subtotal-row { display: flex; justify-content: space-between; font-family: var(--sans); font-size: 14px; color: var(--cream2); margin-bottom: 16px; }
.cd-checkout-btn { width: 100%; background: var(--orange); border: none; color: var(--ink); font-family: var(--sans); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 15px; cursor: pointer; transition: background .2s; }
.cd-checkout-btn:hover { background: var(--orange2); }
.ck-backdrop { position: fixed; inset: 0; background: rgba(12,7,3,0.88); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(6px); }
.ck-modal { background: #1a0f08; border: 1px solid rgba(232,82,10,0.2); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; }
.ck-steps { display: flex; border-bottom: 1px solid rgba(232,82,10,0.1); }
.ck-step { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 10px; font-family: var(--sans); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--cream3); transition: color .3s; }
.ck-step--on { color: var(--orange); }
.ck-step-dot { width: 22px; height: 22px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.ck-step-lbl { font-size: 11px; }
.ck-body { padding: 28px 32px 32px; }
.ck-heading { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--cream); margin-bottom: 6px; }
.ck-sub { font-family: var(--sans); font-size: 13px; color: var(--cream3); margin-bottom: 24px; }
.ck-fields { display: flex; flex-direction: column; gap: 16px; }
.ck-field { display: flex; flex-direction: column; gap: 7px; }
.ck-label { font-family: var(--sans); font-size: 10px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; }
.ck-input { background: rgba(243,232,216,0.04); border: 1px solid rgba(243,232,216,0.1); padding: 12px 14px; color: var(--cream); font-family: var(--sans); font-size: 14px; outline: none; width: 100%; transition: border-color .2s; border-radius: 0; }
.ck-input:focus { border-color: var(--orange); }
.ck-input::placeholder { color: rgba(243,232,216,0.2); }
.ck-section-lbl { font-family: var(--sans); font-size: 11px; letter-spacing: 3px; color: var(--cream3); text-transform: uppercase; margin-bottom: 12px; }
.ck-toggle-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ck-toggle { background: rgba(243,232,216,0.04); border: 1px solid rgba(243,232,216,0.1); color: var(--cream2); font-family: var(--sans); font-size: 13px; padding: 14px 10px; cursor: pointer; transition: all .2s; text-align: center; }
.ck-toggle--on { background: rgba(232,82,10,0.12); border-color: var(--orange); color: var(--orange); font-weight: 600; }
.ck-delivery-note { font-family: var(--sans); font-size: 12px; color: rgba(232,82,10,0.7); margin-top: 8px; }
.ck-pay-options { display: flex; flex-direction: column; gap: 10px; }
.ck-pay-opt { display: flex; align-items: center; gap: 14px; background: rgba(243,232,216,0.03); border: 1px solid rgba(243,232,216,0.08); padding: 14px 16px; cursor: pointer; transition: all .2s; text-align: left; width: 100%; position: relative; }
.ck-pay-opt--on { border-color: var(--orange); background: rgba(232,82,10,0.07); }
.cpo-icon { font-size: 22px; flex-shrink: 0; }
.cpo-label { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--cream); margin-bottom: 2px; }
.cpo-sub { font-family: var(--sans); font-size: 12px; color: var(--cream3); }
.cpo-check { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--orange); font-size: 16px; font-weight: 700; }
.ck-summary { margin-top: 20px; border: 1px solid rgba(232,82,10,0.12); padding: 18px; }
.ck-sum-title { font-family: var(--sans); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--orange); margin-bottom: 12px; }
.ck-sum-row { display: flex; justify-content: space-between; font-family: var(--sans); font-size: 13px; color: var(--cream3); padding: 6px 0; border-bottom: 1px solid rgba(243,232,216,0.05); }
.ck-sum-total { display: flex; justify-content: space-between; font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--cream); padding-top: 12px; margin-top: 4px; }
.ck-bank-details { margin-top: 16px; background: rgba(232,82,10,0.06); border: 1px solid rgba(232,82,10,0.2); padding: 16px 18px; }
.ck-bank-title { font-family: var(--sans); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--orange); margin-bottom: 12px; }
.ck-bank-row { font-family: var(--sans); font-size: 13px; color: var(--cream2); margin-bottom: 6px; display: flex; gap: 8px; }
.ck-bank-row span:first-child { color: var(--cream3); min-width: 110px; }
.ck-bank-note { font-family: var(--sans); font-size: 12px; color: rgba(232,82,10,0.7); margin-top: 10px; }
.ck-actions { display: flex; gap: 12px; margin-top: 28px; }
.ck-back { background: none; border: 1px solid rgba(243,232,216,0.12); color: var(--cream3); font-family: var(--sans); font-size: 12px; padding: 13px 20px; cursor: pointer; transition: all .2s; }
.ck-back:hover { border-color: var(--cream3); color: var(--cream); }
.ck-next { flex: 1; background: var(--orange); border: none; color: var(--ink); font-family: var(--sans); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 14px; cursor: pointer; transition: background .2s; }
.ck-next:hover:not(:disabled) { background: var(--orange2); }
.ck-next:disabled { opacity: .45; cursor: not-allowed; }
.ck-place { flex: 1; background: var(--orange); border: none; color: var(--ink); font-family: var(--sans); font-size: 13px; font-weight: 700; letter-spacing: 1px; padding: 14px 10px; cursor: pointer; transition: background .2s; display: flex; align-items: center; justify-content: center; }
.ck-place:hover:not(:disabled) { background: var(--orange2); }
.ck-place:disabled { opacity: .45; cursor: not-allowed; }
.ck-place--paystack { background: #0ba34f; }
.ck-place--paystack:hover:not(:disabled) { background: #089942; }
.ck-success-modal { text-align: center; padding: 52px 40px; }
.ck-success-icon { font-size: 52px; margin-bottom: 18px; }
.ck-success-title { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--cream); margin-bottom: 14px; }
.ck-success-msg { font-family: var(--sans); font-size: 15px; color: var(--cream2); line-height: 1.7; }
@media (max-width: 1024px) { .dishes-grid { grid-template-columns: repeat(2,1fr); } .gal-grid { grid-template-columns: repeat(2,1fr); grid-template-rows: auto; } .gal-tall, .gal-wide { grid-row: span 1; grid-column: span 1; } }
@media (max-width: 768px) {
  .nav { padding: 18px 24px; } .nav--on { padding: 12px 24px; } .nav-ul, .nav-phone { display: none; } .burger { display: flex; }
  .hero-body { padding: 0 28px 170px; } .hero-bar { padding: 0 24px; } .hb-div { display: none; } .hb-item { padding: 14px 10px 14px 0; }
  .story, .menu-sec, .reviews-sec, .gal-sec, .wa-sec, .res-sec { padding: 80px 28px; }
  .story-inner { grid-template-columns: 1fr; gap: 52px; } .story-img-float { right: 0; }
  .dishes-grid { grid-template-columns: 1fr; } .reviews-inner { grid-template-columns: 1fr; gap: 36px; }
  .res-inner { grid-template-columns: 1fr; gap: 36px; } .res-row { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; padding: 48px 28px 36px; } .footer-bottom { padding: 18px 28px; flex-direction: column; }
  .hero-ctas { flex-direction: column; align-items: flex-start; } .wa-btns { flex-direction: column; align-items: center; }
  .cart-drawer { width: 100vw; } .ck-modal { max-height: 100vh; } .ck-body { padding: 20px 20px 28px; } .ck-toggle-row { grid-template-columns: 1fr; }
  .menu-tab { padding: 10px 14px; font-size: 12px; }
}
@media (max-width: 480px) { .gal-grid { grid-template-columns: 1fr; } .story-stats { flex-wrap: wrap; gap: 22px; } .footer-top { grid-template-columns: 1fr; } }
`;