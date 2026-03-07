// @ts-nocheck
// ═══════════════════════════════════════════════════════════
// PECKISH v7 — Full app with Supabase backend
//
// SETUP (in StackBlitz terminal):
//   npm install @supabase/supabase-js
//
// Then fill in your credentials below:
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── YOUR SUPABASE CREDENTIALS ─────────────────────────────
const SUPABASE_URL = 'https://dkusjegqmyahztgzlwkf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EPOzLF9sY-IvpBcLaWmFBg_0RvVsiZb'; // from Project Settings → API
// ───────────────────────────────────────────────────────────

const CONFIGURED = !SUPABASE_URL.startsWith('YOUR');
const sb = CONFIGURED ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ═══ FONTS ═══
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`;

// ═══ CSS ═══
const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#EAE6E0;font-family:'DM Sans',sans-serif;color:#1A1816;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{display:none;}
.app{max-width:430px;margin:0 auto;min-height:100dvh;background:#EAE6E0;display:flex;flex-direction:column;}
.screen{flex:1;overflow-y:auto;padding-bottom:74px;animation:fadeUp .22s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}

/* NAV */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #DDD9D3;display:flex;z-index:200;padding-bottom:env(safe-area-inset-bottom,0px);}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 0 8px;cursor:pointer;gap:3px;color:#B0A89E;transition:color .18s;font-size:10px;font-weight:500;letter-spacing:.03em;user-select:none;}
.ni.on{color:#1A1816;}
.ni svg{width:20px;height:20px;stroke-width:1.6;}

/* DISTANCE BADGE */
.dist-pill{position:absolute;top:10px;right:10px;background:#B8644A;color:#fff;border-radius:20px;font-size:11px;font-weight:700;padding:4px 11px;display:flex;align-items:center;gap:4px;}
.dist-pill-inline{display:inline-flex;align-items:center;gap:4px;background:#F5E6DF;color:#8A3A20;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;}

/* STATUS BADGES */
.s-open{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#2A6A2A;}
.s-open::before{content:'';width:7px;height:7px;border-radius:50%;background:#3A9A3A;flex-shrink:0;}
.s-soon{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#8A5A00;}
.s-soon::before{content:'';width:7px;height:7px;border-radius:50%;background:#C8880A;flex-shrink:0;animation:pulse 1.5s infinite;}
.s-closed{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:#9E9590;}
.s-closed::before{content:'';width:7px;height:7px;border-radius:50%;background:#C0BCB8;flex-shrink:0;}
.card-status-pill{position:absolute;bottom:10px;left:10px;border-radius:7px;font-size:11px;font-weight:600;padding:3px 10px;backdrop-filter:blur(6px);}
.card-status-open{background:rgba(42,106,42,.82);color:#E0F0E0;}
.card-status-soon{background:rgba(138,90,0,.82);color:#FDECC8;}
.card-status-closed{background:rgba(26,24,22,.72);color:#E8E4DE;}

/* INPUTS */
.inp{width:100%;background:#fff;border:1.5px solid #DDD9D3;border-radius:10px;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1A1816;outline:none;transition:border .15s;}
.inp:focus{border-color:#5A5550;}
.inp::placeholder{color:#C0BCB6;}
textarea.inp{resize:vertical;min-height:90px;line-height:1.6;}
.inp-label{font-size:11px;font-weight:600;color:#6B6560;margin-bottom:5px;display:block;letter-spacing:.04em;text-transform:uppercase;}
.inp-group{margin-bottom:16px;}
.sbar{background:#fff;border:1.5px solid #DDD9D3;border-radius:12px;display:flex;align-items:center;padding:11px 14px;gap:10px;transition:border .15s;}
.sbar:focus-within{border-color:#5A5550;}
.sbar input{border:none;outline:none;flex:1;font-family:'DM Sans',sans-serif;font-size:14px;color:#1A1816;background:transparent;min-width:0;}
.sbar input::placeholder{color:#C0BCB6;}
.inp-error{font-size:12px;color:#B83A20;margin-top:5px;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:12px 22px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .15s;letter-spacing:.02em;white-space:nowrap;}
.btn:active{transform:scale(.97);}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-dark{background:#1A1816;color:#fff;}
.btn-outline{background:transparent;border:1.5px solid #1A1816;color:#1A1816;}
.btn-ghost{background:#F0EDE8;color:#6B6560;}
.btn-danger{background:#FEF0EE;color:#B83A20;}
.btn-full{width:100%;}
.btn-sm{padding:7px 14px;font-size:12px;border-radius:8px;}

/* CHIPS */
.chips{display:flex;gap:7px;overflow-x:auto;padding:0 16px 2px;scrollbar-width:none;}
.chip{white-space:nowrap;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid #D0CCC6;background:#fff;color:#6B6560;transition:all .15s;flex-shrink:0;}
.chip.on{background:#1A1816;color:#fff;border-color:#1A1816;}

/* CARDS */
.card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,.06);cursor:pointer;transition:transform .15s;}
.card:active{transform:scale(.985);}
.card-img{position:relative;width:100%;height:200px;overflow:hidden;background:#F0EDE8;}
.card-img img{width:100%;height:100%;object-fit:cover;display:block;}
.card-body{padding:14px 15px 16px;}
.card-name{font-family:'Cormorant Garamond',serif;font-size:22px;line-height:1.2;font-weight:600;color:#1A1816;}
.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;}
.tag{background:#F0EDE8;color:#6B6560;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:500;}
.card-addr{font-size:12px;color:#A09890;margin-top:8px;display:flex;gap:5px;align-items:flex-start;line-height:1.4;}
.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:10px;}
.weekly-bar{position:absolute;top:10px;left:10px;background:#1A1816;color:#fff;border-radius:6px;font-size:10px;font-weight:700;padding:3px 9px;letter-spacing:.05em;text-transform:uppercase;}

/* FOOD CATEGORIES */
.food-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;}
.food-cat{position:relative;height:110px;border-radius:14px;overflow:hidden;cursor:pointer;border:none;padding:0;transition:transform .15s;}
.food-cat:active{transform:scale(.96);}
.food-cat img{width:100%;height:100%;object-fit:cover;display:block;}
.food-cat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,24,22,.78),rgba(26,24,22,.1));display:flex;align-items:flex-end;padding:12px;}
.food-cat-label{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#fff;line-height:1.2;}
.food-cat.on{outline:2.5px solid #1A1816;outline-offset:2px;}

/* HERO */
.hero-full{position:relative;height:460px;overflow:hidden;flex-shrink:0;}
.hero-full img{width:100%;height:100%;object-fit:cover;display:block;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(26,24,22,.05) 0%,rgba(26,24,22,.5) 50%,rgba(26,24,22,.92) 100%);}
.hero-content{position:absolute;bottom:0;left:0;right:0;padding:28px 20px 26px;}
.hero-logo{font-family:'Cormorant Garamond',serif;font-size:52px;color:#fff;font-weight:600;letter-spacing:-.5px;line-height:1;}
.hero-tag{font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.16em;text-transform:uppercase;margin-top:5px;}
.hero-loc{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;color:rgba(255,255,255,.85);background:rgba(255,255,255,.14);padding:6px 14px;border-radius:20px;backdrop-filter:blur(8px);}

/* LANDING BUTTONS */
.landing-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:20px 16px 0;}
.lbtn{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;border:none;padding:0;transition:transform .15s;}
.lbtn:active{transform:scale(.97);}
.lbtn img{width:100%;height:100%;object-fit:cover;display:block;}
.lbtn-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:14px;}
.lbtn-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#fff;line-height:1.15;}
.lbtn-sub{font-size:10.5px;color:rgba(255,255,255,.72);margin-top:3px;}
.lbtn-sm{height:130px;}
.lbtn-wide{grid-column:1/-1;height:110px;}

/* SECTION HEADER */
.sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 16px 10px;}
.sec-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;}
.cards-list{padding:6px 16px;display:flex;flex-direction:column;gap:14px;}

/* DETAIL */
.detail-hero{position:relative;height:260px;overflow:hidden;background:#F0EDE8;}
.detail-hero img{width:100%;height:100%;object-fit:cover;display:block;}
.detail-hdr{position:sticky;top:0;z-index:30;padding:12px 16px;background:rgba(234,230,224,.95);backdrop-filter:blur(14px);display:flex;align-items:center;gap:10px;}
.back-btn{background:#fff;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 5px rgba(0,0,0,.1);flex-shrink:0;}
.biz-card{background:#fff;margin:0 16px;border-radius:16px;padding:18px 16px;box-shadow:0 2px 12px rgba(0,0,0,.07);margin-top:-32px;position:relative;z-index:10;}
.biz-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1.2;}
.biz-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center;}
.biz-dot{width:3px;height:3px;border-radius:50%;background:#D0CCC6;flex-shrink:0;}
.map-btns{display:flex;gap:8px;margin-top:14px;}
.map-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid;transition:all .15s;}
.map-btn:active{transform:scale(.97);}
.map-gmaps{background:#EEF3FE;color:#1A5CC8;border-color:#C8D8FA;}
.map-waze{background:#EBF5EB;color:#1A6A2A;border-color:#B8DEB8;}
.wa-btn{background:#1A1816;color:#fff;width:100%;padding:15px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;margin-top:16px;}
.ptabs{display:flex;background:#fff;border-bottom:1px solid #EAE6E0;position:sticky;top:60px;z-index:20;}
.ptab{flex:1;padding:13px 4px;text-align:center;font-size:12.5px;font-weight:600;color:#9E9590;cursor:pointer;border-bottom:2.5px solid transparent;transition:all .18s;}
.ptab.on{color:#1A1816;border-bottom-color:#1A1816;}
.tab-content{padding:20px 16px;}
.info-row{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:1px solid #F0EDE8;}
.info-row:last-child{border-bottom:none;}
.info-icon{width:36px;height:36px;border-radius:10px;background:#F5F2EE;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.info-label{font-size:10.5px;color:#9E9590;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;}
.info-val{font-size:14px;color:#1A1816;line-height:1.5;}
.gallery-strip{display:flex;overflow-x:auto;gap:8px;padding:16px 16px 0;scrollbar-width:none;}
.gallery-strip img{height:180px;width:260px;object-fit:cover;border-radius:12px;flex-shrink:0;}
.menu-cat-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;margin:20px 0 10px;padding-bottom:8px;border-bottom:1.5px solid #EAE6E0;}
.mitem{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F5F2EE;}
.mitem:last-child{border-bottom:none;}
.mname{font-size:14px;color:#1A1816;line-height:1.3;}
.mprice{font-size:14px;font-weight:700;color:#3A3530;white-space:nowrap;margin-left:12px;}
.sold{font-size:10px;background:#EAE6E1;color:#9A9390;padding:2px 7px;border-radius:10px;margin-left:6px;}
.rating-hero-box{background:#F5EDE8;border-radius:14px;padding:20px;margin-bottom:16px;display:flex;gap:20px;align-items:center;}
.rating-num-big{font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:600;color:#B8644A;line-height:1;}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.bar-track{flex:1;height:5px;background:#E8E0DA;border-radius:3px;overflow:hidden;}
.bar-fill{height:100%;background:#B8644A;border-radius:3px;}
.ritem{background:#fff;border-radius:12px;padding:16px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.pcard{background:#fff;border-radius:14px;overflow:hidden;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.pcard-img{width:100%;height:160px;object-fit:cover;display:block;}
.pcard-body{padding:14px 15px 16px;}
.pbadge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.06em;padding:3px 9px;border-radius:5px;margin-bottom:8px;text-transform:uppercase;}
.badge-ev{background:#EAF2EA;color:#1A5A1A;}
.badge-pr{background:#F5EAE0;color:#7A3A1A;}
.badge-up{background:#E8EDF5;color:#1A3A6A;}
.pcard-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;line-height:1.25;margin-bottom:6px;}
.review-form-wrap{background:#F7F4F0;border-radius:14px;padding:18px;margin-bottom:16px;}
.star-picker{display:flex;gap:8px;margin:10px 0 14px;}
.star-pick-btn{background:none;border:none;cursor:pointer;font-size:30px;padding:2px;transition:transform .1s;line-height:1;}
.star-pick-btn:hover{transform:scale(1.15);}

/* FORM */
.form-screen{padding:16px 16px 28px;}
.tab-bar{display:flex;gap:4px;background:#fff;padding:4px;border-radius:12px;margin-bottom:18px;}
.tab-btn{flex:1;padding:8px 4px;border:none;border-radius:9px;background:transparent;color:#9E9590;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;}
.tab-btn.on{background:#1A1816;color:#fff;}
.cuisine-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.ctag{padding:7px 13px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid #D0CCC6;background:#fff;color:#6B6560;transition:all .12s;}
.ctag.on{background:#1A1816;color:#fff;border-color:#1A1816;}
.menu-mgmt-item{background:#fff;border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
.toggle{width:44px;height:24px;border-radius:12px;background:#DDD9D3;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.toggle.on{background:#1A1816;}
.toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.18);}
.toggle.on::after{transform:translateX(20px);}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;background:#fff;border-radius:10px;margin-bottom:8px;}
.price-row{display:flex;align-items:center;gap:8px;}
.rm{font-size:14px;font-weight:600;color:#6B6560;}
.photo-preview{position:relative;border-radius:10px;overflow:hidden;height:140px;margin-bottom:8px;}
.photo-preview img{width:100%;height:100%;object-fit:cover;display:block;}
.photo-remove{position:absolute;top:7px;right:7px;background:rgba(26,24,22,.7);border:none;border-radius:6px;color:#fff;padding:3px 8px;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;}

/* AUTH */
.auth-screen{min-height:100dvh;display:flex;flex-direction:column;background:#EAE6E0;}
.auth-hero{position:relative;overflow:hidden;}
.auth-hero img{width:100%;height:100%;object-fit:cover;display:block;}
.auth-hero-ov{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(26,24,22,0) 30%,rgba(26,24,22,.88));}
.auth-hero-txt{position:absolute;bottom:26px;left:24px;}
.auth-body{flex:1;padding:28px 24px 36px;overflow-y:auto;}
.google-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;background:#fff;border:1.5px solid #DDD9D3;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;color:#1A1816;transition:all .15s;}
.google-btn:hover{border-color:#5A5550;}
.divider{display:flex;align-items:center;gap:10px;margin:14px 0;color:#B8B2AC;font-size:12px;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:#DDD9D3;}
.auth-toggle{text-align:center;margin-top:18px;font-size:13px;color:#9E9590;}
.auth-toggle span{color:#1A1816;font-weight:600;cursor:pointer;text-decoration:underline;}

/* PROFILE */
.prof-screen{padding:24px 16px 20px;}
.prof-av{width:70px;height:70px;border-radius:50%;background:#DDD9D3;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:28px;color:#6B6560;flex-shrink:0;}
.prof-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #EAE6E1;cursor:pointer;}

/* MISC */
.no-res{text-align:center;color:#A09890;font-size:14px;padding:40px 20px;line-height:1.7;}
.empty-card{text-align:center;padding:28px 20px;background:#fff;border-radius:14px;}
.loading-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100dvh;background:#EAE6E0;gap:12px;}
`;

// ═══ CONSTANTS ═══
const CUISINES_LIST = [
  'Malay',
  'Chinese',
  'Indian',
  'Mamak',
  'Japanese',
  'Korean',
  'Western',
  'Italian',
  'Thai',
  'Vietnamese',
  'Seafood',
  'BBQ',
  'Vegetarian',
  'Halal',
  'Beer Restaurant',
  'Hawker/Street Food',
  'Cafe',
  'Bakery',
  'Fast Food',
  'Fusion',
];
const CUISINE_FILTERS = [
  'All',
  'Malay',
  'Chinese',
  'Indian',
  'Mamak',
  'Japanese',
  'Korean',
  'Western',
  'Cafe',
  'Hawker/Street Food',
  'Seafood',
];

const FOOD_CATS = [
  {
    label: 'Noodles',
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
    kw: ['noodle', 'mee', 'ramen', 'laksa', 'pasta', 'maggi', 'kway teow'],
  },
  {
    label: 'Rice',
    img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
    kw: ['rice', 'nasi', 'biryani', 'claypot', 'bibimbap'],
  },
  {
    label: 'Seafood',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    kw: ['seafood', 'prawn', 'crab', 'fish', 'squid', 'sashimi', 'salmon'],
  },
  {
    label: 'Roti & Bread',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
    kw: ['roti', 'bread', 'toast', 'flatbread', 'naan'],
  },
  {
    label: 'Sushi',
    img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80',
    kw: ['sushi', 'sashimi', 'maki', 'japanese', 'temaki'],
  },
  {
    label: 'Coffee',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    kw: [
      'coffee',
      'latte',
      'espresso',
      'flat white',
      'cold brew',
      'cappuccino',
    ],
  },
  {
    label: 'Chicken',
    img: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80',
    kw: ['chicken', 'ayam', 'fried chicken', 'grilled chicken', 'katsu'],
  },
  {
    label: 'Brunch',
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80',
    kw: ['brunch', 'eggs', 'toast', 'benedict', 'pancake', 'waffle', 'avocado'],
  },
  {
    label: 'Korean',
    img: 'https://images.unsplash.com/photo-1582814116069-01c4c48cef4c?w=400&q=80',
    kw: ['korean', 'bibimbap', 'kimchi', 'tteokbokki', 'galbi', 'doenjang'],
  },
  {
    label: 'Soup',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    kw: ['soup', 'broth', 'stew', 'laksa', 'curry', 'ramen', 'jjigae'],
  },
  {
    label: 'Desserts',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    kw: [
      'dessert',
      'cake',
      'ice cream',
      'sweet',
      'pudding',
      'cendol',
      'ais kacang',
    ],
  },
  {
    label: 'BBQ',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    kw: ['bbq', 'grill', 'grilled', 'satay', 'yakitori', 'galbi'],
  },
];

const SAMPLE_COORDS = [
  { lat: 3.159, lng: 101.712 },
  { lat: 3.142, lng: 101.696 },
  { lat: 3.118, lng: 101.678 },
  { lat: 3.135, lng: 101.662 },
  { lat: 3.172, lng: 101.658 },
];

// ═══ UTILS ═══
let _id = 500;
const uid = () => `u${_id++}`;
const distNum = (a, b, c, d) => {
  const R = 6371,
    x =
      Math.sin(((c - a) * Math.PI) / 360) ** 2 +
      Math.cos((a * Math.PI) / 180) *
        Math.cos((c * Math.PI) / 180) *
        Math.sin(((d - b) * Math.PI) / 360) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};
const fmtDist = (n) =>
  n < 1 ? `${Math.round(n * 1000)} m` : `${n.toFixed(1)} km`;
const avgRating = (rs) => {
  if (!rs?.length) return 0;
  return (
    Math.round((rs.reduce((s, r) => s + (r.rating || 0), 0) / rs.length) * 10) /
    10
  );
};

// ── AUTO STATUS ───────────────────────────────────────────────
const parseTimeMins = (str) => {
  const m = str?.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]),
    min = parseInt(m[2]);
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + min;
};

const computeStatus = (hoursStr) => {
  if (!hoursStr) return 'open';
  if (/24\s*hour/i.test(hoursStr) || /always/i.test(hoursStr)) return 'open';
  const parts = hoursStr.split('–');
  if (parts.length < 2) return 'open';
  const openM = parseTimeMins(parts[0]);
  const closeM = parseTimeMins(parts[1]);
  if (openM === null || closeM === null) return 'open';
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  // Handle midnight crossing (e.g. 10PM – 2AM)
  const isOpen =
    closeM < openM
      ? nowM >= openM || nowM < closeM
      : nowM >= openM && nowM < closeM;
  if (isOpen) return 'open';
  // Opening Soon: within 30 mins before opening
  const minsUntilOpen = openM > nowM ? openM - nowM : 1440 - nowM + openM;
  if (minsUntilOpen <= 30) return 'opening_soon';
  return 'closed';
};

// ═══ SAMPLE DATA ═══
const SAMPLE = [
  {
    id: 's1',
    owner_id: 'demo',
    name: 'Warung Pak Ali',
    cuisines: ['Malay', 'Halal', 'Hawker/Street Food'],
    address: 'Jalan Ampang, Kuala Lumpur',
    phone: '60123456789',
    description:
      'A beloved neighbourhood warung serving authentic home-style Malay cooking since 1987. Every dish made from scratch with recipes passed down through three generations.',
    hours: '7:00 AM – 10:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    ],
    menu: [
      {
        id: 'mc1',
        category: 'Rice Dishes',
        items: [
          {
            id: 'mi1',
            name: 'Nasi Lemak Ayam',
            price: '8.50',
            soldOut: false,
            food_tags: ['rice', 'chicken'],
          },
          {
            id: 'mi2',
            name: 'Nasi Goreng Kampung',
            price: '7.00',
            soldOut: false,
            food_tags: ['rice', 'noodles'],
          },
          {
            id: 'mi3',
            name: 'Nasi Kerabu',
            price: '9.00',
            soldOut: false,
            food_tags: ['rice'],
          },
        ],
      },
      {
        id: 'mc2',
        category: 'Drinks',
        items: [
          {
            id: 'mi4',
            name: 'Teh Tarik',
            price: '2.50',
            soldOut: false,
            food_tags: ['drinks', 'tea'],
          },
          {
            id: 'mi5',
            name: 'Milo Ais',
            price: '3.00',
            soldOut: false,
            food_tags: ['drinks'],
          },
        ],
      },
    ],
    posts: [
      {
        id: 'p1',
        type: 'Promotion',
        title: 'Weekend Special',
        body: 'Free teh tarik with every nasi lemak order this weekend.',
        photo:
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      },
      {
        id: 'p2',
        type: 'Event',
        title: 'Merdeka Feast',
        body: 'Special Merdeka Day feast with traditional dishes.',
        photo: '',
      },
    ],
    reviewsList: [
      {
        id: 'r1',
        author: 'Hafiz R.',
        rating: 5,
        text: 'Best nasi lemak in KL. The sambal is perfect.',
        date: '2 days ago',
      },
      {
        id: 'r2',
        author: 'Mei Ling',
        rating: 4,
        text: 'Very authentic and affordable. Will return.',
        date: '1 week ago',
      },
      {
        id: 'r3',
        author: 'Kumar S.',
        rating: 5,
        text: 'Feels like eating at home.',
        date: '2 weeks ago',
      },
    ],
  },
  {
    id: 's2',
    owner_id: 'demo',
    name: 'Dragon Palace',
    cuisines: ['Chinese', 'Seafood'],
    address: 'Petaling Street, Kuala Lumpur',
    phone: '60198765432',
    description:
      'Modern Chinese restaurant specialising in fresh seafood and traditional Cantonese dishes. Family-run for over 30 years.',
    hours: '11:00 AM – 11:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    ],
    menu: [
      {
        id: 'mc3',
        category: 'Seafood',
        items: [
          {
            id: 'mi6',
            name: 'Steamed Garlic Prawns',
            price: '28.00',
            soldOut: false,
            food_tags: ['seafood', 'prawn'],
          },
          {
            id: 'mi7',
            name: 'Butter Crab',
            price: '55.00',
            soldOut: false,
            food_tags: ['seafood', 'crab'],
          },
        ],
      },
      {
        id: 'mc4',
        category: 'Mains',
        items: [
          {
            id: 'mi8',
            name: 'Char Kway Teow',
            price: '12.00',
            soldOut: false,
            food_tags: ['noodle', 'fried noodles'],
          },
          {
            id: 'mi9',
            name: 'Claypot Chicken Rice',
            price: '16.00',
            soldOut: false,
            food_tags: ['rice', 'chicken'],
          },
        ],
      },
    ],
    posts: [
      {
        id: 'p3',
        type: 'Event',
        title: 'CNY Reunion Dinner',
        body: 'Book your table for a traditional reunion dinner.',
        photo: '',
      },
    ],
    reviewsList: [
      {
        id: 'r4',
        author: 'Alan T.',
        rating: 5,
        text: 'The butter crab is divine. Worth every ringgit.',
        date: '3 days ago',
      },
      {
        id: 'r5',
        author: 'Priya N.',
        rating: 4,
        text: 'Great ambience and generous portions.',
        date: '1 week ago',
      },
      {
        id: 'r6',
        author: 'James W.',
        rating: 3,
        text: 'Food was good but service was slow.',
        date: '2 weeks ago',
      },
    ],
  },
  {
    id: 's3',
    owner_id: 'demo',
    name: 'Mamak Corner',
    cuisines: ['Mamak', 'Indian', 'Halal'],
    address: 'Bangsar, Kuala Lumpur',
    phone: '60112233445',
    description:
      'The real 24-hour mamak. Roti canai, mee goreng, teh tarik — all day, all night.',
    hours: 'Open 24 Hours',
    photos: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80',
    ],
    menu: [
      {
        id: 'mc5',
        category: 'Roti & Bread',
        items: [
          {
            id: 'mi10',
            name: 'Roti Canai',
            price: '2.00',
            soldOut: false,
            food_tags: ['roti', 'bread', 'flatbread'],
          },
          {
            id: 'mi11',
            name: 'Roti Tissue',
            price: '6.00',
            soldOut: false,
            food_tags: ['roti', 'dessert'],
          },
        ],
      },
      {
        id: 'mc6',
        category: 'Noodles & Rice',
        items: [
          {
            id: 'mi12',
            name: 'Mee Goreng Mamak',
            price: '8.00',
            soldOut: false,
            food_tags: ['noodle', 'mee goreng'],
          },
          {
            id: 'mi13',
            name: 'Maggi Goreng',
            price: '7.00',
            soldOut: false,
            food_tags: ['noodle', 'maggi'],
          },
        ],
      },
      {
        id: 'mc7',
        category: 'Drinks',
        items: [
          {
            id: 'mi14',
            name: 'Teh Tarik',
            price: '2.00',
            soldOut: false,
            food_tags: ['drinks', 'tea'],
          },
        ],
      },
    ],
    posts: [
      {
        id: 'p4',
        type: 'Promotion',
        title: 'Football Night',
        body: 'Spend RM 20 during any live match, get free roti canai.',
        photo:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      },
    ],
    reviewsList: [
      {
        id: 'r7',
        author: 'Razif A.',
        rating: 5,
        text: 'Open 24 hours and never disappoints.',
        date: '1 day ago',
      },
      {
        id: 'r8',
        author: 'Siew Leng',
        rating: 4,
        text: 'Classic mamak. Teh tarik is always on point.',
        date: '5 days ago',
      },
    ],
  },
  {
    id: 's4',
    owner_id: 'demo',
    name: 'The Stone Cafe',
    cuisines: ['Cafe', 'Western', 'Fusion'],
    address: 'Damansara Heights, Kuala Lumpur',
    phone: '60187654321',
    description:
      'Nordic-inspired cafe in Damansara. Specialty coffee, seasonal brunch, and calm vibes.',
    hours: '9:00 AM – 6:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    ],
    menu: [
      {
        id: 'mc8',
        category: 'Brunch',
        items: [
          {
            id: 'mi15',
            name: 'Eggs Benedict',
            price: '22.00',
            soldOut: false,
            food_tags: ['brunch', 'eggs', 'western'],
          },
          {
            id: 'mi16',
            name: 'Smashed Avocado Toast',
            price: '18.00',
            soldOut: false,
            food_tags: ['brunch', 'toast', 'avocado'],
          },
        ],
      },
      {
        id: 'mc9',
        category: 'Coffee & Drinks',
        items: [
          {
            id: 'mi17',
            name: 'Flat White',
            price: '13.00',
            soldOut: false,
            food_tags: ['coffee', 'drinks'],
          },
          {
            id: 'mi18',
            name: 'Cold Brew',
            price: '14.00',
            soldOut: false,
            food_tags: ['coffee', 'drinks'],
          },
        ],
      },
    ],
    posts: [
      {
        id: 'p5',
        type: 'Event',
        title: 'Sunday Jazz Brunch',
        body: 'Live acoustic jazz every Sunday 10 AM to 1 PM.',
        photo:
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
      },
    ],
    reviewsList: [
      {
        id: 'r9',
        author: 'Sophia L.',
        rating: 5,
        text: 'Flat white is perfection. Best cafe in KL.',
        date: '4 days ago',
      },
      {
        id: 'r10',
        author: 'Farid M.',
        rating: 4,
        text: 'Lovely space for working. Great eggs benedict.',
        date: '2 weeks ago',
      },
    ],
  },
  {
    id: 's5',
    owner_id: 'demo',
    name: 'Sakura Bites',
    cuisines: ['Japanese', 'Korean'],
    address: 'Mont Kiara, Kuala Lumpur',
    phone: '60165432198',
    description:
      'Intimate Japanese-Korean fusion kitchen. Every dish crafted with imported ingredients.',
    hours: '12:00 PM – 10:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    ],
    menu: [
      {
        id: 'mc10',
        category: 'Japanese',
        items: [
          {
            id: 'mi19',
            name: 'Salmon Sashimi',
            price: '32.00',
            soldOut: false,
            food_tags: ['sushi', 'sashimi', 'seafood', 'japanese'],
          },
          {
            id: 'mi20',
            name: 'Tonkotsu Ramen',
            price: '26.00',
            soldOut: false,
            food_tags: ['noodle', 'ramen', 'soup', 'japanese'],
          },
        ],
      },
      {
        id: 'mc11',
        category: 'Korean',
        items: [
          {
            id: 'mi21',
            name: 'Bibimbap',
            price: '22.00',
            soldOut: false,
            food_tags: ['rice', 'korean'],
          },
          {
            id: 'mi22',
            name: 'Korean Fried Chicken',
            price: '28.00',
            soldOut: false,
            food_tags: ['chicken', 'korean', 'fried chicken'],
          },
        ],
      },
    ],
    posts: [
      {
        id: 'p6',
        type: 'Promotion',
        title: 'Friday Omakase',
        body: 'Five-course omakase at RM 120 every Friday evening.',
        photo:
          'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
      },
    ],
    reviewsList: [
      {
        id: 'r11',
        author: 'Yuki T.',
        rating: 5,
        text: 'Best Japanese in KL. Sashimi so fresh.',
        date: '2 days ago',
      },
      {
        id: 'r12',
        author: 'Min-Ji K.',
        rating: 5,
        text: 'Korean fried chicken is outstanding.',
        date: '1 week ago',
      },
      {
        id: 'r13',
        author: 'Aaron C.',
        rating: 4,
        text: 'Slightly pricey but worth every ringgit.',
        date: '2 weeks ago',
      },
    ],
  },
];

// ═══ SUPABASE DATA LAYER ═══
const processRestaurant = (r, userLoc) => {
  const coord =
    userLoc && r.lat && r.lng
      ? { dist: distNum(userLoc.lat, userLoc.lng, r.lat, r.lng) }
      : null;
  const menu = (r.menu_categories || []).map((cat) => ({
    id: cat.id,
    category: cat.name,
    items: (cat.menu_items || []).map((i) => ({
      id: i.id,
      name: i.name,
      price: String(i.price),
      soldOut: i.sold_out,
      food_tags: i.food_tags || [],
    })),
  }));
  const reviewsList = (r.reviews || []).map((rv) => ({
    id: rv.id,
    rating: rv.rating,
    text: rv.body,
    author: rv.profiles?.nickname || 'Anonymous',
    date: new Date(rv.created_at).toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric',
    }),
  }));
  const posts = (r.posts || []).map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    body: p.body,
    photo: p.photo || '',
  }));
  return {
    ...r,
    menu,
    reviewsList,
    posts,
    distance: coord ? fmtDist(coord.dist) : null,
    _distNum: coord ? coord.dist : 999,
  };
};

const loadRestaurantsFromSB = async (userLoc) => {
  const { data, error } = await sb
    .from('restaurants')
    .select(
      `
    *, menu_categories(*, menu_items(*)), posts(*),
    reviews(*, profiles(nickname))
  `
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || [])
    .map((r) => processRestaurant(r, userLoc))
    .sort((a, b) => a._distNum - b._distNum);
};

const loadRestaurantsFromSample = (userLoc) => {
  const fallbackDist = [0.8, 2.1, 1.4, 3.7, 5.2];
  return SAMPLE.map((r, i) => {
    const c = SAMPLE_COORDS[i];
    if (userLoc && c) {
      const d = distNum(userLoc.lat, userLoc.lng, c.lat, c.lng);
      return { ...r, distance: fmtDist(d), _distNum: d };
    }
    return {
      ...r,
      distance: `${fallbackDist[i]} km`,
      _distNum: fallbackDist[i],
    };
  }).sort((a, b) => a._distNum - b._distNum);
};

// ═══ ICONS ═══
const Ic = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Food: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  Lucky: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Back: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5m7-7-7 7 7 7" />
    </svg>
  ),
  Pin: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91A16 16 0 0015.1 17.92l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Map: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  Search: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  WA: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 2C6.495 2 2 6.495 2 12.05c0 1.868.49 3.623 1.348 5.147L2 22l4.896-1.322A10.006 10.006 0 0012.05 22C17.605 22 22 17.505 22 11.95 22 6.395 17.605 2 12.05 2zm0 18.158a8.11 8.11 0 01-4.158-1.146l-.298-.178-3.09.835.848-3.016-.195-.31A8.118 8.118 0 013.892 12.05c0-4.505 3.662-8.167 8.158-8.167 4.495 0 8.157 3.662 8.157 8.167 0 4.494-3.662 8.108-8.157 8.108z" />
    </svg>
  ),
  Chevron: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C0BCB8"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
};

// ═══ STARS ═══
const Stars = ({ rating, size = 14 }) => {
  const full = Math.floor(rating),
    half = rating - full >= 0.3;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color:
              i <= full
                ? '#C8A84A'
                : i === full + 1 && half
                ? '#C8A84A'
                : '#DDD9D3',
            lineHeight: 1,
          }}
        >
          {i <= full ? '★' : i === full + 1 && half ? '⯨' : '☆'}
        </span>
      ))}
    </span>
  );
};

const RatingRow = ({ reviews, size = 13 }) => {
  const avg = avgRating(reviews),
    n = reviews?.length || 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: size,
        fontWeight: 700,
      }}
    >
      <Stars rating={avg} size={size} />
      <span>{n > 0 ? avg.toFixed(1) : '—'}</span>
      <span style={{ color: '#A09890', fontWeight: 400, fontSize: size - 1 }}>
        ({n} {n === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

// ═══ SORT: open first, opening_soon second, closed last ═══
const statusPriority = (h) => {
  const s = computeStatus(h);
  return s === 'open' ? 0 : s === 'opening_soon' ? 1 : 2;
};
const sortByStatus = (arr) =>
  [...arr].sort((a, b) => statusPriority(a.hours) - statusPriority(b.hours));

// ═══ STATUS BADGE ═══
const StatusBadge = ({ hoursStr }) => {
  const status = computeStatus(hoursStr);
  if (status === 'open') return <span className="s-open">Open now</span>;
  if (status === 'opening_soon')
    return <span className="s-soon">Opening soon</span>;
  return <span className="s-closed">Closed</span>;
};

// ═══ RESTAURANT CARD ═══
const RCard = ({ r, onClick, topWeek }) => {
  const status = computeStatus(r.hours);
  const isClosed = status === 'closed';
  const statusClass = {
    open: 'card-status-open',
    opening_soon: 'card-status-soon',
    closed: 'card-status-closed',
  }[status];
  const statusLabel = {
    open: 'Open now',
    opening_soon: 'Opening soon',
    closed: 'Closed',
  }[status];
  return (
    <div
      className="card"
      onClick={() => onClick(r)}
      style={{ opacity: isClosed ? 0.7 : 1 }}
    >
      <div className="card-img">
        <img
          src={r.photos[0]}
          alt={r.name}
          loading="lazy"
          style={{
            filter: isClosed ? 'grayscale(1)' : 'none',
            transition: 'filter .2s',
          }}
        />
        {r.distance && (
          <span className="dist-pill">
            <Ic.Pin />
            {r.distance}
          </span>
        )}
        {topWeek && <span className="weekly-bar">Top This Week</span>}
        <span className={`card-status-pill ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className="card-body">
        <div className="card-name">{r.name}</div>
        <div className="tag-row">
          {r.cuisines.map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <div className="card-addr">
          <Ic.Pin />
          <span>{r.address}</span>
        </div>
        <div className="card-foot">
          <RatingRow reviews={r.reviewsList} size={13} />
          <span style={{ fontSize: 11, color: '#A09890' }}>{r.hours}</span>
        </div>
      </div>
    </div>
  );
};

// ═══ DETAIL — GOOGLE BUSINESS PROFILE STYLE ═══
const Detail = ({ r, onBack, user, onUpdateRestaurant }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRvForm, setShowRvForm] = useState(false);
  const [rvRating, setRvRating] = useState(0);
  const [rvHover, setRvHover] = useState(0);
  const [rvText, setRvText] = useState('');
  const avg = avgRating(r.reviewsList);
  const status = computeStatus(r.hours);
  const badgeClass = {
    Event: 'badge-ev',
    Promotion: 'badge-pr',
    Update: 'badge-up',
  };

  const submitReview = async () => {
    if (!rvRating || !rvText.trim())
      return alert('Please select a rating and write your review.');
    const nr = {
      id: uid(),
      author: user?.nickname || 'Anonymous',
      rating: rvRating,
      text: rvText.trim(),
      date: 'Just now',
    };
    if (sb && !r.id.startsWith('s')) {
      await sb
        .from('reviews')
        .insert({
          restaurant_id: r.id,
          user_id: user.sbId,
          rating: rvRating,
          body: rvText.trim(),
        });
    }
    onUpdateRestaurant({ ...r, reviewsList: [nr, ...(r.reviewsList || [])] });
    setRvRating(0);
    setRvText('');
    setShowRvForm(false);
  };
  const openGMaps = () =>
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        r.name + ', ' + r.address
      )}`,
      '_blank'
    );
  const openWaze = () =>
    window.open(
      `https://waze.com/ul?q=${encodeURIComponent(
        r.name + ', ' + r.address
      )}&navigate=yes`,
      '_blank'
    );

  return (
    <div className="screen" style={{ paddingBottom: 28 }}>
      <div className="detail-hdr">
        <button className="back-btn" onClick={onBack}>
          <Ic.Back />
        </button>
        <span
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 19,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 600,
          }}
        >
          {r.name}
        </span>
      </div>

      <div className="detail-hero">
        <img src={r.photos[0]} alt={r.name} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom,rgba(0,0,0,0) 40%,rgba(0,0,0,.5) 100%)',
          }}
        />
      </div>

      <div className="biz-card">
        <div className="biz-name">{r.name}</div>
        <div className="biz-meta">
          <RatingRow reviews={r.reviewsList} size={13} />
          <span className="biz-dot" />
          {r.distance && (
            <span className="dist-pill-inline">
              <Ic.Pin />
              {r.distance}
            </span>
          )}
          <span className="biz-dot" />
          <StatusBadge hoursStr={r.hours} />
        </div>
        <div className="tag-row" style={{ marginTop: 10 }}>
          {r.cuisines.map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <div className="map-btns">
          <button className="map-btn map-gmaps" onClick={openGMaps}>
            <Ic.Map />
            Google Maps
          </button>
          <button className="map-btn map-waze" onClick={openWaze}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1A6A2A">
              <path d="M20.54 7.28C19.6 3.67 16.29 1 12.35 1 7.7 1 3.93 4.7 3.93 9.27c0 1.16.24 2.26.67 3.25C3.08 13.16 2 14.77 2 16.6c0 2.66 2.17 4.82 4.85 4.82.45 0 .89-.06 1.3-.17.92.45 1.95.75 3.03.75h.06c1.52 0 2.93-.48 4.08-1.29.24.03.48.04.72.04 2.68 0 4.85-2.16 4.85-4.82 0-.93-.27-1.8-.73-2.53.64-1.08 1-2.33 1-3.65 0-.57-.07-1.13-.22-1.67z" />
            </svg>
            Waze
          </button>
        </div>
        {r.phone && (
          <button
            className="wa-btn"
            onClick={() =>
              window.open(`https://wa.me/${r.phone.replace(/\D/g, '')}`)
            }
          >
            <Ic.WA /> Contact via WhatsApp
          </button>
        )}
      </div>

      <div className="ptabs">
        {['overview', 'menu', 'reviews', 'posts'].map((t) => (
          <div
            key={t}
            className={`ptab${activeTab === t ? ' on' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <p
            style={{
              fontSize: 14,
              color: '#5A5550',
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            {r.description}
          </p>
          {r.photos.length > 1 && (
            <div
              style={{ marginBottom: 20, marginLeft: -16, marginRight: -16 }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.07em',
                  textTransform: 'uppercase',
                  color: '#9E9590',
                  marginBottom: 10,
                  paddingLeft: 16,
                }}
              >
                Photos
              </div>
              <div className="gallery-strip">
                {r.photos.map((p, i) => (
                  <img key={i} src={p} alt={`photo ${i + 1}`} />
                ))}
              </div>
            </div>
          )}
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '4px 16px',
            }}
          >
            <div className="info-row">
              <div className="info-icon">
                <Ic.Clock />
              </div>
              <div>
                <div className="info-label">Hours</div>
                <div className="info-val">{r.hours}</div>
                <div style={{ marginTop: 4 }}>
                  <StatusBadge hoursStr={r.hours} />
                </div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">
                <Ic.Pin />
              </div>
              <div>
                <div className="info-label">Address</div>
                <div className="info-val">{r.address}</div>
                {r.distance && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#B8644A',
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    {r.distance} away
                  </div>
                )}
              </div>
            </div>
            {r.phone && (
              <div className="info-row">
                <div className="info-icon">
                  <Ic.Phone />
                </div>
                <div>
                  <div className="info-label">Phone</div>
                  <div className="info-val">+{r.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MENU */}
      {activeTab === 'menu' && (
        <div className="tab-content">
          {r.menu?.length > 0 ? (
            r.menu.map((cat) => (
              <div key={cat.id || cat.category}>
                <div className="menu-cat-title">{cat.category}</div>
                {cat.items.map((item) => (
                  <div className="mitem" key={item.id || item.name}>
                    <span className="mname">
                      {item.name}
                      {item.soldOut && <span className="sold">Sold Out</span>}
                    </span>
                    <span className="mprice">
                      RM {parseFloat(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="no-res">No menu items added yet.</div>
          )}
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="tab-content">
          {r.reviewsList?.length > 0 && (
            <div className="rating-hero-box">
              <div>
                <div className="rating-num-big">{avg.toFixed(1)}</div>
                <Stars rating={avg} size={18} />
                <div style={{ fontSize: 12, color: '#9E9590', marginTop: 5 }}>
                  {r.reviewsList.length} reviews
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((s) => {
                  const cnt = r.reviewsList.filter(
                    (rv) => rv.rating === s
                  ).length;
                  const pct = r.reviewsList.length
                    ? Math.round((cnt / r.reviewsList.length) * 100)
                    : 0;
                  return (
                    <div className="bar-row" key={s}>
                      <span
                        style={{ fontSize: 11, color: '#9E9590', width: 8 }}
                      >
                        {s}
                      </span>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: '#9E9590',
                          width: 14,
                          textAlign: 'right',
                        }}
                      >
                        {cnt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!showRvForm ? (
            <button
              className="btn btn-outline btn-full"
              style={{ marginBottom: 16 }}
              onClick={() =>
                user && !user.isGuest
                  ? setShowRvForm(true)
                  : alert('Please sign in to leave a review.')
              }
            >
              Write a Review
            </button>
          ) : (
            <div className="review-form-wrap">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Your Rating
              </div>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className="star-pick-btn"
                    onMouseEnter={() => setRvHover(s)}
                    onMouseLeave={() => setRvHover(0)}
                    onClick={() => setRvRating(s)}
                    style={{
                      color: (rvHover || rvRating) >= s ? '#C8A84A' : '#DDD9D3',
                    }}
                  >
                    ★
                  </button>
                ))}
                {rvRating > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      color: '#9E9590',
                      alignSelf: 'center',
                      marginLeft: 4,
                    }}
                  >
                    {
                      ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'][
                        rvRating
                      ]
                    }
                  </span>
                )}
              </div>
              <textarea
                className="inp"
                placeholder="Share your experience..."
                value={rvText}
                onChange={(e) => setRvText(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-dark btn-sm" onClick={submitReview}>
                  Post Review
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowRvForm(false);
                    setRvRating(0);
                    setRvText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {r.reviewsList?.length > 0 ? (
            r.reviewsList.map((rv, i) => (
              <div className="ritem" key={rv.id || i}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {rv.author}
                  </span>
                  <span style={{ fontSize: 11, color: '#B0A89E' }}>
                    {rv.date}
                  </span>
                </div>
                <Stars rating={rv.rating} size={13} />
                <div
                  style={{
                    fontSize: 14,
                    color: '#4A4540',
                    lineHeight: 1.65,
                    marginTop: 8,
                  }}
                >
                  {rv.text}
                </div>
              </div>
            ))
          ) : (
            <div className="no-res">No reviews yet. Be the first.</div>
          )}
        </div>
      )}

      {/* POSTS */}
      {activeTab === 'posts' && (
        <div className="tab-content">
          {r.posts?.length > 0 ? (
            r.posts.map((p, i) => (
              <div className="pcard" key={p.id || i}>
                {p.photo && <img src={p.photo} alt="" className="pcard-img" />}
                <div className="pcard-body">
                  <span
                    className={`pbadge ${badgeClass[p.type] || 'badge-up'}`}
                  >
                    {p.type}
                  </span>
                  <div className="pcard-title">{p.title}</div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: '#5A5550',
                      lineHeight: 1.65,
                    }}
                  >
                    {p.body}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-res">No posts published yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══ FIND FOOD SCREEN ═══
const FindFoodScreen = ({ restaurants, onRestaurant, onGoLucky }) => {
  const [q, setQ] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const searchByKeywords = (kws) => {
    return restaurants.filter((r) => {
      const menuMatch = r.menu?.some((cat) =>
        cat.items?.some((item) => {
          const name = (item.name || '').toLowerCase();
          const tags = (item.food_tags || []).join(' ').toLowerCase();
          return kws.some((k) => name.includes(k) || tags.includes(k));
        })
      );
      const cuisineMatch = r.cuisines?.some((c) =>
        kws.some((k) => c.toLowerCase().includes(k))
      );
      const nameMatch = kws.some((k) => r.name.toLowerCase().includes(k));
      return menuMatch || cuisineMatch || nameMatch;
    });
  };

  const qKws = q.toLowerCase().split(' ').filter(Boolean);
  const catKws = selectedCat?.kw || [];
  const results =
    q.length > 1
      ? searchByKeywords(qKws)
      : selectedCat
      ? searchByKeywords(catKws)
      : [];

  const showGrid = !q && !selectedCat;

  return (
    <div className="screen form-screen">
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 30,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        Find Food
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#9E9590',
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        What are you craving right now?
      </div>

      <div className="sbar" style={{ marginBottom: 12 }}>
        <Ic.Search />
        <input
          placeholder="Noodles, burgers, sushi..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelectedCat(null);
          }}
        />
        {q && (
          <button
            onClick={() => setQ('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9E9590',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            x
          </button>
        )}
      </div>

      <button
        className="btn btn-ghost btn-full"
        style={{ marginBottom: 4, fontSize: 13 }}
        onClick={onGoLucky}
      >
        Not sure? Try Feelin Lucky
      </button>

      {showGrid && (
        <>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.07em',
              textTransform: 'uppercase',
              color: '#9E9590',
              margin: '20px 0 10px',
            }}
          >
            Browse by Category
          </div>
          <div className="food-grid">
            {FOOD_CATS.map((cat) => (
              <button
                key={cat.label}
                className={`food-cat${
                  selectedCat?.label === cat.label ? ' on' : ''
                }`}
                onClick={() => setSelectedCat(cat)}
              >
                <img src={cat.img} alt={cat.label} />
                <div className="food-cat-overlay">
                  <div className="food-cat-label">{cat.label}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {(q.length > 1 || selectedCat) && (
        <>
          <div className="sec-hdr" style={{ padding: '20px 0 10px' }}>
            <div>
              <div className="sec-title">
                {selectedCat ? selectedCat.label : `"${q}"`}
              </div>
              <div style={{ fontSize: 11, color: '#9E9590', marginTop: 2 }}>
                {results.length > 0
                  ? `${results.length} restaurants serving this`
                  : 'No restaurants found'}
              </div>
            </div>
            {selectedCat && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: '5px 10px', fontSize: 11 }}
                onClick={() => setSelectedCat(null)}
              >
                Clear
              </button>
            )}
          </div>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {results.map((r) => (
                <RCard key={r.id} r={r} onClick={onRestaurant} />
              ))}
            </div>
          ) : (
            <div className="no-res">
              Nothing matched. Try a different keyword or
              <br />
              <span
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
                onClick={onGoLucky}
              >
                try Feelin Lucky
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ═══ LUCKY SCREEN ═══
const LuckyScreen = ({ restaurants, onRestaurant, onGoFindFood }) => {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [key, setKey] = useState(0);
  const frames = ['—', '/', '—', '\\'];
  const [fi, setFi] = useState(0);

  const spin = () => {
    setSpinning(true);
    setResult(null);
    let t = 0;
    const iv = setInterval(() => {
      setFi((f) => (f + 1) % frames.length);
      t++;
      if (t > 14) clearInterval(iv);
    }, 80);
    setTimeout(() => {
      const near = restaurants.filter(
        (r) => (r._distNum || 99) <= 15 && computeStatus(r.hours) !== 'closed'
      );
      const fallback = restaurants.filter((r) => (r._distNum || 99) <= 15);
      const pool = near.length ? near : fallback;
      if (!pool.length) {
        setSpinning(false);
        setResult('empty');
        return;
      }
      setResult(pool[Math.floor(Math.random() * pool.length)]);
      setKey((k) => k + 1);
      setSpinning(false);
    }, 1000);
  };

  return (
    <div className="screen">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '50px 24px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 38,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Feelin Lucky?
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#9E9590',
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Let us pick one restaurant near you.
        </div>

        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1.5px solid #DDD9D3',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 36,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 46,
            color: spinning ? '#B8644A' : '#C0BCB6',
            fontWeight: 600,
          }}
        >
          {spinning ? frames[fi] : '?'}
        </div>

        <button
          className="btn btn-dark"
          style={{
            borderRadius: 50,
            padding: '15px 52px',
            fontSize: 16,
            letterSpacing: '.04em',
          }}
          onClick={spin}
          disabled={spinning}
        >
          {spinning
            ? 'Picking...'
            : result && result !== 'empty'
            ? 'Spin Again'
            : 'Spin'}
        </button>

        <button
          className="btn btn-ghost"
          style={{ marginTop: 12, fontSize: 13 }}
          onClick={onGoFindFood}
        >
          Know what you want? Find Food
        </button>

        {result === 'empty' && (
          <div className="no-res" style={{ marginTop: 24 }}>
            No restaurants within 15 km yet.
          </div>
        )}
        {result && result !== 'empty' && (
          <div
            style={{
              width: '100%',
              marginTop: 32,
              animation: 'popIn .35s cubic-bezier(.175,.885,.32,1.275)',
            }}
            key={key}
          >
            <RCard r={result} onClick={onRestaurant} />
          </div>
        )}
      </div>
    </div>
  );
};

// ═══ HOME SCREEN ═══
const HomeScreen = ({ restaurants, onRestaurant, locLabel }) => {
  const [mode, setMode] = useState('all');
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const listRef = useRef(null);

  const nearby = sortByStatus(
    restaurants.filter((r) => (r._distNum || 99) <= 15)
  );
  const explore = sortByStatus(
    restaurants.filter((r) => (r._distNum || 99) > 15)
  );
  // Weekly top: open restaurants ranked by rating, then closed ranked by rating below
  const weekly = [
    ...restaurants
      .filter((r) => computeStatus(r.hours) !== 'closed')
      .sort((a, b) => avgRating(b.reviewsList) - avgRating(a.reviewsList)),
    ...restaurants
      .filter((r) => computeStatus(r.hours) === 'closed')
      .sort((a, b) => avgRating(b.reviewsList) - avgRating(a.reviewsList)),
  ].slice(0, 3);

  const filtered = sortByStatus(
    restaurants.filter((r) => {
      const mc = cuisine === 'All' || r.cuisines.includes(cuisine);
      const mq =
        !q ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q.toLowerCase()));
      return mc && mq;
    })
  );

  const scrollToList = () =>
    setTimeout(
      () =>
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      80
    );
  const setSection = (m) => {
    setMode(m);
    setQ('');
    setCuisine('All');
    scrollToList();
  };
  const displayList =
    mode === 'nearby'
      ? nearby
      : mode === 'explore'
      ? explore
      : mode === 'weekly'
      ? weekly
      : filtered;

  return (
    <div className="screen">
      <div className="hero-full">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
          alt="Food"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logo">Peckish</div>
          <div className="hero-tag">Discover food nearby</div>
          {locLabel && (
            <div className="hero-loc">
              <Ic.Pin />
              {locLabel}
            </div>
          )}
        </div>
      </div>

      <div className="landing-btns">
        <button className="lbtn lbtn-sm" onClick={() => setSection('nearby')}>
          <img
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75"
            alt=""
          />
          <div
            className="lbtn-overlay"
            style={{
              background:
                'linear-gradient(to top,rgba(26,24,22,.85),rgba(26,24,22,.15))',
            }}
          >
            <div className="lbtn-title">Nearby</div>
            <div className="lbtn-sub">
              Within 15 km &middot; {nearby.length} places
            </div>
          </div>
        </button>
        <button className="lbtn lbtn-sm" onClick={() => setSection('explore')}>
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=75"
            alt=""
          />
          <div
            className="lbtn-overlay"
            style={{
              background:
                'linear-gradient(to top,rgba(44,37,32,.85),rgba(44,37,32,.15))',
            }}
          >
            <div className="lbtn-title">Explore</div>
            <div className="lbtn-sub">
              Beyond 15 km &middot; {explore.length} places
            </div>
          </div>
        </button>
        <button className="lbtn lbtn-wide" onClick={() => setSection('weekly')}>
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75"
            alt=""
          />
          <div
            className="lbtn-overlay"
            style={{
              background:
                'linear-gradient(to top,rgba(58,42,26,.88),rgba(58,42,26,.15))',
            }}
          >
            <div className="lbtn-title" style={{ fontSize: 22 }}>
              Weekly Top Reviews
            </div>
            <div className="lbtn-sub">Best rated restaurants this week</div>
          </div>
        </button>
      </div>

      <div style={{ padding: '16px 16px 6px' }}>
        <div className="sbar">
          <Ic.Search />
          <input
            placeholder="Search restaurant or cuisine..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setMode('all');
            }}
          />
          {q && (
            <button
              onClick={() => setQ('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9E9590',
                fontSize: 16,
              }}
            >
              x
            </button>
          )}
        </div>
      </div>
      <div className="chips">
        {CUISINE_FILTERS.map((c) => (
          <div
            key={c}
            className={`chip${cuisine === c ? ' on' : ''}`}
            onClick={() => {
              setCuisine(c);
              setMode('all');
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="sec-hdr" ref={listRef}>
        <div>
          <div className="sec-title">
            {mode === 'nearby'
              ? 'Nearby'
              : mode === 'explore'
              ? 'Explore'
              : mode === 'weekly'
              ? 'Weekly Top Reviews'
              : 'All Restaurants'}
          </div>
          <div style={{ fontSize: 11, color: '#9E9590', marginTop: 2 }}>
            {mode === 'nearby'
              ? 'Within 15 km of you'
              : mode === 'explore'
              ? 'Beyond 15 km'
              : mode === 'weekly'
              ? 'Ranked by review rating'
              : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#9E9590' }}>
            {displayList.length} places
          </span>
          {mode !== 'all' && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '5px 10px', fontSize: 11 }}
              onClick={() => setMode('all')}
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <div className="cards-list">
        {displayList.length === 0 ? (
          <div className="no-res">No restaurants found.</div>
        ) : (
          displayList.map((r) => (
            <RCard
              key={r.id}
              r={r}
              onClick={onRestaurant}
              topWeek={mode === 'weekly'}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ═══ AUTH SCREENS ═══
const AuthScreen = ({ onAuth, onGuest }) => {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !password)
      return setError('Please enter your email and password.');
    if (mode === 'signup' && !nickname.trim())
      return setError('Please enter a nickname.');
    if (mode === 'signup' && !phone.trim())
      return setError('Please enter your phone number.');
    if (password.length < 6)
      return setError('Password must be at least 6 characters.');
    setLoading(true);
    setError('');
    try {
      if (!CONFIGURED) {
        // Demo mode — simulate login
        localStorage.setItem(
          'peckish_demo_user',
          JSON.stringify({
            id: 'demo_' + Date.now(),
            nickname: nickname || email.split('@')[0],
            phone,
            isGuest: false,
          })
        );
        onAuth({
          id: 'demo',
          nickname: nickname || email.split('@')[0],
          phone,
          isGuest: false,
        });
        return;
      }
      if (mode === 'signup') {
        const { data, error: err } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: nickname.trim() } },
        });
        if (err) throw err;
        if (data?.user) {
          await sb
            .from('profiles')
            .upsert({
              id: data.user.id,
              nickname: nickname.trim(),
              phone: phone.trim(),
            });
          onAuth({
            id: data.user.id,
            sbId: data.user.id,
            nickname: nickname.trim(),
            phone: phone.trim(),
            isGuest: false,
          });
        }
      } else {
        const { data, error: err } = await sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        const { data: profile } = await sb
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        onAuth({
          id: data.user.id,
          sbId: data.user.id,
          nickname: profile?.nickname || email.split('@')[0],
          phone: profile?.phone || '',
          isGuest: false,
        });
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!CONFIGURED)
      return alert('Please configure Supabase to use Google sign-in.');
    await sb.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero" style={{ height: '48vh' }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85"
          alt="Food"
        />
        <div className="auth-hero-ov" />
        <div className="auth-hero-txt">
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 52,
              color: '#fff',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-.5px',
            }}
          >
            Peckish
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,.6)',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            Discover food nearby
          </div>
        </div>
      </div>

      <div className="auth-body">
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </div>
        <div style={{ fontSize: 13, color: '#9E9590', marginBottom: 22 }}>
          {mode === 'login'
            ? 'Your session will be remembered automatically.'
            : 'Sign up to discover food and write reviews.'}
        </div>

        {mode === 'signup' && (
          <div className="inp-group">
            <label className="inp-label">Nickname</label>
            <input
              className="inp"
              placeholder="What should we call you?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        )}
        <div className="inp-group">
          <label className="inp-label">Email</label>
          <input
            className="inp"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inp-group">
          <label className="inp-label">Password</label>
          <input
            className="inp"
            type="password"
            placeholder={
              mode === 'signup' ? 'Min 6 characters' : 'Your password'
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode === 'signup' && (
          <div className="inp-group">
            <label className="inp-label">Phone Number</label>
            <input
              className="inp"
              placeholder="e.g. 60123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}
        {error && (
          <div className="inp-error" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-dark btn-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : mode === 'login'
            ? 'Sign In'
            : 'Create Account'}
        </button>

        <div className="divider">or</div>
        <button className="google-btn" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        <div className="divider">or</div>
        <button className="btn btn-ghost btn-full" onClick={onGuest}>
          Browse as Guest
        </button>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <span
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                Create one
              </span>
            </>
          ) : (
            <>
              Already have one?{' '}
              <span
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Sign in
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══ PROFILE SCREEN ═══
const ProfileScreen = ({
  user,
  restaurants,
  onAddRestaurant,
  onEditRestaurant,
  onDeleteRestaurant,
  onLogout,
}) => {
  const mine = restaurants.filter(
    (r) => r.owner_id === user.id || r.owner === user.id
  );
  return (
    <div className="screen prof-screen">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 28,
        }}
      >
        <div className="prof-av">
          {user.nickname?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {user.nickname}
          </div>
          <div style={{ fontSize: 13, color: '#9E9590', marginTop: 2 }}>
            {user.phone || 'No phone added'}
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#B8B2AC',
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {user.isGuest
              ? 'Guest Account'
              : CONFIGURED
              ? 'Signed in'
              : 'Demo Mode — add Supabase credentials'}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: user.isGuest
                  ? '#C0BCB8'
                  : CONFIGURED
                  ? '#3A9A3A'
                  : '#C8880A',
                display: 'inline-block',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          My Restaurants
        </div>
        {mine.length === 0 ? (
          <div className="empty-card">
            <div
              style={{
                fontSize: 14,
                color: '#6B6560',
                marginBottom: 16,
                lineHeight: 1.7,
              }}
            >
              You have not listed a restaurant yet.
            </div>
            <button className="btn btn-dark btn-sm" onClick={onAddRestaurant}>
              <Ic.Plus /> List My Restaurant
            </button>
          </div>
        ) : (
          <>
            {mine.map((r) => (
              <div
                key={r.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '13px 14px',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 17,
                      fontWeight: 600,
                    }}
                  >
                    {r.name}
                  </div>
                  <StatusBadge hoursStr={r.hours} />
                </div>
                <div style={{ fontSize: 12, color: '#A09890', marginTop: 4 }}>
                  {r.address}
                </div>
                <div className="tag-row" style={{ marginTop: 6 }}>
                  {r.cuisines.slice(0, 3).map((c) => (
                    <span key={c} className="tag">
                      {c}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onEditRestaurant(r)}
                  >
                    <Ic.Edit /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete "${r.name}"?`))
                        onDeleteRestaurant(r.id);
                    }}
                  >
                    <Ic.Trash /> Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline btn-full"
              style={{ marginTop: 4 }}
              onClick={onAddRestaurant}
            >
              <Ic.Plus /> List Another
            </button>
          </>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Settings
        </div>
        {[
          'Edit Profile',
          'Notifications',
          'Help & Support',
          'Privacy Policy',
        ].map((item) => (
          <div className="prof-row" key={item}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span>
            <Ic.Chevron />
          </div>
        ))}
      </div>
      <button
        className="btn btn-ghost btn-full"
        onClick={onLogout}
        style={{ color: '#B83A20' }}
      >
        Sign Out
      </button>
    </div>
  );
};

// ═══ RESTAURANT FORM ═══
const RestaurantForm = ({ existing, onSave, onCancel, user }) => {
  const def = {
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisines: [],
    hours: '',
    photos: [],
    menu: [],
    posts: [],
    reviewsList: [],
  };
  const [form, setForm] = useState(existing || def);
  const [menu, setMenu] = useState(existing?.menu || []);
  const [posts, setPosts] = useState(existing?.posts || []);
  const [tab, setTab] = useState('info');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPF, setShowPF] = useState(false);
  const [postForm, setPostForm] = useState({
    type: 'Update',
    title: '',
    body: '',
    photo: '',
  });
  const [showIF, setShowIF] = useState(null);
  const [catName, setCatName] = useState('');
  const [showCF, setShowCF] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    soldOut: false,
    food_tags: [],
  });

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleC = (c) =>
    upd(
      'cuisines',
      form.cuisines.includes(c)
        ? form.cuisines.filter((x) => x !== c)
        : [...form.cuisines, c]
    );

  const addCat = () => {
    if (!catName.trim()) return;
    setMenu([...menu, { id: uid(), category: catName.trim(), items: [] }]);
    setCatName('');
    setShowCF(false);
  };
  const delCat = (cid) => setMenu(menu.filter((c) => c.id !== cid));
  const addItem = (cid) => {
    if (!itemForm.name.trim() || !itemForm.price) return;
    setMenu(
      menu.map((c) =>
        c.id === cid
          ? { ...c, items: [...c.items, { id: uid(), ...itemForm }] }
          : c
      )
    );
    setItemForm({ name: '', price: '', soldOut: false, food_tags: [] });
    setShowIF(null);
  };
  const delItem = (cid, iid) =>
    setMenu(
      menu.map((c) =>
        c.id === cid ? { ...c, items: c.items.filter((i) => i.id !== iid) } : c
      )
    );
  const toggleSO = (cid, iid) =>
    setMenu(
      menu.map((c) =>
        c.id === cid
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === iid ? { ...i, soldOut: !i.soldOut } : i
              ),
            }
          : c
      )
    );

  const save = () => {
    if (!form.name.trim() || !form.address.trim())
      return alert('Name and address are required.');
    onSave({
      ...form,
      id: existing?.id || uid(),
      owner_id: user.id,
      owner: user.id,
      menu,
      posts,
      reviewsList: existing?.reviewsList || [],
    });
  };

  return (
    <div className="screen form-screen">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button className="back-btn" onClick={onCancel}>
          <Ic.Back />
        </button>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {existing ? 'Edit Restaurant' : 'List Your Restaurant'}
        </div>
      </div>
      <div className="tab-bar">
        {['info', 'photos', 'menu', 'posts'].map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? ' on' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div>
          <div className="inp-group">
            <label className="inp-label">Restaurant Name</label>
            <input
              className="inp"
              placeholder="e.g. Warung Pak Ali"
              value={form.name}
              onChange={(e) => upd('name', e.target.value)}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">Description</label>
            <textarea
              className="inp"
              placeholder="What makes your place special?"
              value={form.description}
              onChange={(e) => upd('description', e.target.value)}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">Address</label>
            <input
              className="inp"
              placeholder="e.g. 12, Jalan Ampang, KL"
              value={form.address}
              onChange={(e) => upd('address', e.target.value)}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">WhatsApp Number</label>
            <input
              className="inp"
              placeholder="60123456789"
              value={form.phone}
              onChange={(e) => upd('phone', e.target.value)}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">Business Hours</label>
            <input
              className="inp"
              placeholder="e.g. 9:00 AM – 10:00 PM"
              value={form.hours}
              onChange={(e) => upd('hours', e.target.value)}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">Cuisine Types</label>
            <div className="cuisine-grid">
              {CUISINES_LIST.map((c) => (
                <div
                  key={c}
                  className={`ctag${form.cuisines.includes(c) ? ' on' : ''}`}
                  onClick={() => toggleC(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'photos' && (
        <div>
          <div className="inp-group">
            <label className="inp-label">Add Photo URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="inp"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-dark btn-sm"
                onClick={() => {
                  if (photoUrl.trim()) {
                    upd('photos', [...form.photos, photoUrl.trim()]);
                    setPhotoUrl('');
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
          {form.photos.map((p, i) => (
            <div className="photo-preview" key={i}>
              <img src={p} alt="" />
              <button
                className="photo-remove"
                onClick={() =>
                  upd(
                    'photos',
                    form.photos.filter((_, j) => j !== i)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'menu' && (
        <div>
          {menu.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {cat.category}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowIF(cat.id)}
                  >
                    Add Dish
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => delCat(cat.id)}
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
              {cat.items.map((item) => (
                <div className="menu-mgmt-item" key={item.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{ fontSize: 13, color: '#6B6560', marginTop: 2 }}
                    >
                      RM {parseFloat(item.price || 0).toFixed(2)}
                      {item.soldOut && (
                        <span className="sold" style={{ marginLeft: 6 }}>
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '5px 9px', fontSize: 11 }}
                      onClick={() => toggleSO(cat.id, item.id)}
                    >
                      {item.soldOut ? 'Available' : 'Sold Out'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '5px 9px' }}
                      onClick={() => delItem(cat.id, item.id)}
                    >
                      <Ic.Trash />
                    </button>
                  </div>
                </div>
              ))}
              {showIF === cat.id && (
                <div
                  style={{
                    background: '#F7F4F0',
                    borderRadius: 10,
                    padding: 14,
                    marginTop: 6,
                  }}
                >
                  <div className="inp-group">
                    <label className="inp-label">Dish Name</label>
                    <input
                      className="inp"
                      placeholder="e.g. Nasi Lemak Ayam"
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Price (RM)</label>
                    <div className="price-row">
                      <span className="rm">RM</span>
                      <input
                        className="inp"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.50"
                        value={itemForm.price}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, price: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => addItem(cat.id)}
                    >
                      Add Dish
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowIF(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {showCF ? (
            <div
              style={{ background: '#F7F4F0', borderRadius: 10, padding: 14 }}
            >
              <div className="inp-group">
                <label className="inp-label">Category Name</label>
                <input
                  className="inp"
                  placeholder="e.g. Rice Dishes, Drinks"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-dark btn-sm" onClick={addCat}>
                  Add
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowCF(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-full"
              style={{ marginTop: 4 }}
              onClick={() => setShowCF(true)}
            >
              <Ic.Plus /> Add Menu Category
            </button>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div>
          {posts.map((p, i) => (
            <div
              className="pcard"
              key={p.id || i}
              style={{ position: 'relative' }}
            >
              {p.photo && <img src={p.photo} alt="" className="pcard-img" />}
              <div className="pcard-body">
                <span
                  className={`pbadge ${
                    {
                      Event: 'badge-ev',
                      Promotion: 'badge-pr',
                      Update: 'badge-up',
                    }[p.type] || 'badge-up'
                  }`}
                >
                  {p.type}
                </span>
                <div className="pcard-title">{p.title}</div>
                <div style={{ fontSize: 13, color: '#5A5550' }}>{p.body}</div>
              </div>
              <button
                onClick={() => setPosts(posts.filter((x) => x.id !== p.id))}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#B83A20',
                }}
              >
                <Ic.Trash />
              </button>
            </div>
          ))}
          {showPF ? (
            <div
              style={{ background: '#F7F4F0', borderRadius: 12, padding: 16 }}
            >
              <div className="inp-group">
                <label className="inp-label">Type</label>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  {['Event', 'Promotion', 'Update'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setPostForm({ ...postForm, type: t })}
                      style={{
                        flex: 1,
                        padding: '9px 4px',
                        border: '1.5px solid',
                        borderColor:
                          postForm.type === t ? '#1A1816' : '#DDD9D3',
                        borderRadius: 8,
                        background: postForm.type === t ? '#1A1816' : '#fff',
                        color: postForm.type === t ? '#fff' : '#6B6560',
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="inp-group">
                <label className="inp-label">Title</label>
                <input
                  className="inp"
                  placeholder="Post title"
                  value={postForm.title}
                  onChange={(e) =>
                    setPostForm({ ...postForm, title: e.target.value })
                  }
                />
              </div>
              <div className="inp-group">
                <label className="inp-label">Details</label>
                <textarea
                  className="inp"
                  placeholder="What would you like to share?"
                  value={postForm.body}
                  onChange={(e) =>
                    setPostForm({ ...postForm, body: e.target.value })
                  }
                />
              </div>
              <div className="inp-group">
                <label className="inp-label">Photo URL (optional)</label>
                <input
                  className="inp"
                  placeholder="https://..."
                  value={postForm.photo}
                  onChange={(e) =>
                    setPostForm({ ...postForm, photo: e.target.value })
                  }
                />
              </div>
              {postForm.photo && (
                <div className="photo-preview" style={{ marginBottom: 12 }}>
                  <img src={postForm.photo} alt="" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    if (!postForm.title.trim()) return;
                    setPosts([...posts, { id: uid(), ...postForm }]);
                    setPostForm({
                      type: 'Update',
                      title: '',
                      body: '',
                      photo: '',
                    });
                    setShowPF(false);
                  }}
                >
                  Add Post
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPF(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-full"
              onClick={() => setShowPF(true)}
            >
              <Ic.Plus /> Add Post
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-dark btn-full" onClick={save}>
          Save Restaurant
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [appState, setAppState] = useState('loading'); // loading | auth | app
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [tab, setTab] = useState('home');
  const [detail, setDetail] = useState(null);
  const [formTarget, setFormTarget] = useState(null);
  const [locLabel, setLocLabel] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [now, setNow] = useState(new Date());

  // Auto-update time every 60s for status changes
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(iv);
  }, []);

  // Fix service worker cookie issues — unregister all stale SWs
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    }
  }, []);

  // On mount: restore session + get location
  useEffect(() => {
    const init = async () => {
      // 1. Try restore session
      if (CONFIGURED && sb) {
        const {
          data: { session },
        } = await sb.auth.getSession();
        if (session) {
          const { data: profile } = await sb
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser({
            id: session.user.id,
            sbId: session.user.id,
            nickname: profile?.nickname || session.user.email.split('@')[0],
            phone: profile?.phone || '',
            isGuest: false,
          });
          setAppState('app');
        } else {
          setAppState('auth');
        }
        // Listen for auth changes
        sb.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setAppState('auth');
          }
        });
      } else {
        // Demo mode: check localStorage
        const stored = localStorage.getItem('peckish_demo_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
            setAppState('app');
          } catch {
            setAppState('auth');
          }
        } else {
          setAppState('auth');
        }
      }

      // 2. Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            setUserLoc({ lat, lng });
            try {
              const r = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const d = await r.json();
              setLocLabel(
                d.address?.suburb ||
                  d.address?.city_district ||
                  d.address?.city ||
                  'Your location'
              );
            } catch {
              setLocLabel('Your location');
            }
            loadRests({ lat, lng });
          },
          () => {
            setLocLabel('Location unavailable');
            loadRests(null);
          }
        );
      } else {
        loadRests(null);
      }
    };
    init();
  }, []);

  const loadRests = async (loc) => {
    if (CONFIGURED && sb) {
      try {
        const data = await loadRestaurantsFromSB(loc);
        setRestaurants(data);
        return;
      } catch (e) {
        console.warn('Supabase load failed, using sample data', e);
      }
    }
    setRestaurants(loadRestaurantsFromSample(loc));
  };

  const handleAuth = (u) => {
    setUser(u);
    setAppState('app');
    if (!CONFIGURED)
      localStorage.setItem('peckish_demo_user', JSON.stringify(u));
  };
  const handleGuest = () => {
    const g = { id: 'guest', nickname: 'Guest', phone: '', isGuest: true };
    setUser(g);
    setAppState('app');
  };
  const handleLogout = async () => {
    if (CONFIGURED && sb) await sb.auth.signOut();
    localStorage.removeItem('peckish_demo_user');
    setUser(null);
    setAppState('auth');
    setTab('home');
    setDetail(null);
  };

  const saveRestaurant = (r) => {
    setRestaurants((prev) =>
      prev.find((x) => x.id === r.id)
        ? prev.map((x) => (x.id === r.id ? r : x))
        : [{ ...r, distance: '0.1 km', _distNum: 0.1 }, ...prev]
    );
    if (detail?.id === r.id) setDetail(r);
    setFormTarget(null);
  };
  const updateRestaurant = (r) => {
    setRestaurants((prev) => prev.map((x) => (x.id === r.id ? r : x)));
    setDetail(r);
  };
  const deleteRestaurant = (id) =>
    setRestaurants((prev) => prev.filter((r) => r.id !== id));

  const navItems = [
    { id: 'home', label: 'Home', Icon: Ic.Home },
    { id: 'findfood', label: 'Find Food', Icon: Ic.Food },
    { id: 'lucky', label: 'Lucky', Icon: Ic.Lucky },
    { id: 'profile', label: 'Profile', Icon: Ic.User },
  ];

  // ── RENDER ──
  if (appState === 'loading')
    return (
      <>
        <style>
          {FONTS}
          {CSS}
        </style>
        <div className="app">
          <div className="loading-screen">
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 52,
                fontWeight: 600,
                color: '#1A1816',
                letterSpacing: '-.5px',
              }}
            >
              Peckish
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#B8B2AC',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}
            >
              Finding food near you
            </div>
          </div>
        </div>
      </>
    );

  if (appState === 'auth')
    return (
      <>
        <style>
          {FONTS}
          {CSS}
        </style>
        <div className="app">
          <AuthScreen onAuth={handleAuth} onGuest={handleGuest} />
        </div>
      </>
    );

  if (formTarget)
    return (
      <>
        <style>
          {FONTS}
          {CSS}
        </style>
        <div className="app">
          <RestaurantForm
            existing={formTarget === 'new' ? null : formTarget}
            user={user}
            onSave={saveRestaurant}
            onCancel={() => setFormTarget(null)}
          />
        </div>
      </>
    );

  if (detail)
    return (
      <>
        <style>
          {FONTS}
          {CSS}
        </style>
        <div className="app">
          <Detail
            r={detail}
            onBack={() => setDetail(null)}
            user={user}
            onUpdateRestaurant={updateRestaurant}
          />
        </div>
      </>
    );

  return (
    <>
      <style>
        {FONTS}
        {CSS}
      </style>
      <div className="app">
        {tab === 'home' && (
          <HomeScreen
            restaurants={restaurants}
            onRestaurant={setDetail}
            locLabel={locLabel}
          />
        )}
        {tab === 'findfood' && (
          <FindFoodScreen
            restaurants={restaurants}
            onRestaurant={setDetail}
            onGoLucky={() => setTab('lucky')}
          />
        )}
        {tab === 'lucky' && (
          <LuckyScreen
            restaurants={restaurants}
            onRestaurant={setDetail}
            onGoFindFood={() => setTab('findfood')}
          />
        )}
        {tab === 'profile' &&
          (user?.isGuest ? (
            <div className="screen prof-screen">
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 26,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Account
              </div>
              <div className="empty-card">
                <div
                  style={{
                    fontSize: 14,
                    color: '#6B6560',
                    marginBottom: 16,
                    lineHeight: 1.7,
                  }}
                >
                  Sign in to list your restaurant and write reviews.
                </div>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    setUser(null);
                    setAppState('auth');
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            <ProfileScreen
              user={user}
              restaurants={restaurants}
              onAddRestaurant={() => setFormTarget('new')}
              onEditRestaurant={(r) => setFormTarget(r)}
              onDeleteRestaurant={deleteRestaurant}
              onLogout={handleLogout}
            />
          ))}
        <nav className="bnav">
          {navItems.map(({ id, label, Icon }) => (
            <div
              key={id}
              className={`ni${tab === id ? ' on' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon />
              {label}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
