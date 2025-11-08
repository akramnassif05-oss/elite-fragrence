// Config
const whatsappNumber = "212696146559"; // without +
const products = [
  { id:'p1', name:'Bvlgari Man In Black', img:'images/bvlgari.jpeg', prices:{'10ml':140,'5ml':85,'3ml':50} },
  { id:'p2', name:'Acqua di Parma Colonia', img:'images/acqua.jpeg', prices:{'10ml':300,'5ml':180,'3ml':100} },
  { id:'p3', name:'Emporio Stronger With You Absolutely', img:'images/you.jpeg', prices:{'10ml':180,'5ml':100,'3ml':70} },
  { id:'p4', name:'Lattafa Assad', img:'images/assad.jpeg', prices:{'10ml':60,'5ml':40} },
  { id:'p5', name:'Hugo Boss Bottled', img:'images/boss2.jpeg', prices:{'10ml':200,'5ml':110,'3ml':80} },
  { id:'p6', name:'Hugo Boss Parfum', img:'images/boss1.jpeg', prices:{'10ml':200,'5ml':110,'3ml':80} },
  { id:'p7', name:'Montblanc Legend Blue', img:'images/montblanc.jpg', prices:{'10ml':180,'5ml':75,'3ml':50} }
];

const packs = [
  { id:'pack1', name:'Mon Blanc + Stronger With You Absolutely', img:'images/pack1.jpg', price:300 },
  { id:'pack2', name:'Acqua di Parma + Bvlgari', img:'images/pack2.jpg', price:300 }
  { id:'pack3', name:'boss parfum+boss bottled', img:'images/pack3.jpg', price:300 }
];

let cart = [];

// Helpers
function formatPrice(v){ return v + ' dh'; }

function createCard(p){
  const div = document.createElement('div');
  div.className='card';
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <div class="price">Sélectionnez une taille</div>
    <div class="sizes">
      <label class="size"><input type="radio" name="${p.id}-size" value="10ml"> 10ml</label>
      <label class="size"><input type="radio" name="${p.id}-size" value="5ml"> 5ml</label>
      <label class="size"><input type="radio" name="${p.id}-size" value="3ml"> 3ml</label>
    </div>
    <div class="display-price" data-id="${p.id}"></div>
    <div class="buttons">
      <a href="#" class="btn add-cart">🛒 Ajouter au panier</a>
      <a href="#" class="btn btn-ghost wa">💬 WhatsApp</a>
    </div>
  `;
  setTimeout(()=>{
    const radios = div.querySelectorAll('input[type=radio]');
    const priceEl = div.querySelector('.display-price');
    radios.forEach(r=>{
      r.addEventListener('change', ()=>{
        const v = r.value;
        priceEl.textContent = formatPrice(p.prices[v]);
      });
    });
    div.querySelector('.add-cart').addEventListener('click',(e)=>{
      e.preventDefault();
      const sel = div.querySelector('input[type=radio]:checked');
      if(!sel){ alert("Choisissez d'abord la taille"); return; }
      const size = sel.value;
      cart.push({id:p.id,name:p.name,size:size,price:p.prices[size],img:p.img});
      updateCartUI();
      document.getElementById('cart').classList.remove('hidden');
    });
    div.querySelector('.wa').addEventListener('click',(e)=>{
      e.preventDefault();
      const sel = div.querySelector('input[type=radio]:checked');
      if(!sel){ alert("Choisissez d'abord la taille"); return; }
      const size = sel.value;
      const price = p.prices[size];
      const text = `Bonjour, je suis intéressé par: ${p.name} - ${size} - ${price} dh (Elite Fragrance)`;
      const url = `https://wa.me/${whatsappNumber}?text=` + encodeURIComponent(text);
      window.open(url,'_blank');
    });
  },50);
  return div;
}

function createPackCard(p){
  const div = document.createElement('div');
  div.className='card';
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <div class="price">${p.price} dh</div>
    <div class="buttons">
      <a href="#" class="btn add-cart">🛒 Ajouter au panier</a>
      <a href="#" class="btn btn-ghost wa">💬 WhatsApp</a>
    </div>
  `;
  div.querySelector('.add-cart').addEventListener('click',(e)=>{
    e.preventDefault();
    cart.push({id:p.id,name:p.name,size:'Pack',price:p.price,img:p.img});
    updateCartUI();
    document.getElementById('cart').classList.remove('hidden');
  });
  div.querySelector('.wa').addEventListener('click',(e)=>{
    e.preventDefault();
    const text = `Bonjour, je suis intéressé par: ${p.name} - ${p.price} dh (Pack Elite Fragrance)`;
    const url = `https://wa.me/${whatsappNumber}?text=` + encodeURIComponent(text);
    window.open(url,'_blank');
  });
  return div;
}

function updateCartUI(){
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((it,idx)=>{
    const el = document.createElement('div');
    el.className='cart-item';
    el.innerHTML = `<img src="${it.img}" alt="" /><div style="flex:1"><div style="font-weight:700">${it.name}</div><div>${it.size} — ${it.price} dh</div></div><div><button data-idx="${idx}" class="remove">Suppr</button></div>`;
    list.appendChild(el);
    total += Number(it.price);
  });
  document.getElementById('cart-total').textContent = total;
  document.querySelectorAll('.remove').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const i = Number(e.currentTarget.dataset.idx);
      cart.splice(i,1);
      updateCartUI();
    });
  });
  const checkout = document.getElementById('checkout-wa');
  if(!checkout) return;
  if(cart.length==0) checkout.href='#';
  else{
    let text = 'Bonjour, je veux commander:%0A';
    cart.forEach(it=>{
      text += `- ${it.name} | ${it.size} | ${it.price} dh%0A`;
    });
    const url = `https://wa.me/${whatsappNumber}?text=` + text;
    checkout.href = url;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const ph = document.getElementById('products-homme');
  products.forEach(p=> ph.appendChild(createCard(p)));
  const pp = document.getElementById('products-packs');
  packs.forEach(p=> pp.appendChild(createPackCard(p)));
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('open-cart').addEventListener('click', ()=> document.getElementById('cart').classList.remove('hidden'));
  document.getElementById('close-cart').addEventListener('click', ()=> document.getElementById('cart').classList.add('hidden'));
});
