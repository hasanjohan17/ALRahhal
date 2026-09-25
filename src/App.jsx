import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from './supabase'

const mockProducts = [
  { id: 1, name: 'حاسوب محمول', type: 'إلكترونيات', price: 184000, color: 'أسود', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85', badge: 'الأكثر طلبًا', tone: 'dark' },
  { id: 2, name: 'مصباح طاولة خشبي', type: 'منزل', price: 149000, color: 'خشبي', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85', badge: 'وصل حديثًا', tone: 'sand' },
  { id: 3, name: 'ساعة يد كلاسيكية', type: 'إكسسوارات', price: 196000, color: 'فضي', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85', tone: 'silver' },
  { id: 4, name: 'مجموعة عناية يومية', type: 'عناية شخصية', price: 173000, color: 'وردي', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85', badge: 'مميز', tone: 'rose' },
  { id: 5, name: 'حقيبة أنيقة', type: 'أزياء', price: 235000, color: 'زيتي', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85', tone: 'olive' },
  { id: 6, name: 'عطر ', type: 'مستلزمات', price: 128000, color: 'أزرق', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85', tone: 'blue' },
]

const categories = ['الكل', 'إلكترونيات', 'منزل', 'إكسسوارات', 'عناية شخصية', 'أزياء', 'مستلزمات']
const formatPrice = (price) => new Intl.NumberFormat('ar-SY').format(price)
const whatsappLink = 'https://www.whatsapp.com/'

function App() {
  const [products, setProducts] = useState(mockProducts)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchProducts().then((remoteProducts) => {
      if (remoteProducts?.length) setProducts(remoteProducts)
    }).catch(() => {})
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'الكل' || product.type === activeCategory
    const matchesSearch = `${product.name} ${product.color}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, products, query])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
    setToast('أضيف المنتج إلى حقيبتك')
    setTimeout(() => setToast(''), 2200)
  }

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function changeQuantity(id, amount) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }

  function submitOrder(event) {
    event.preventDefault()
    setOrderOpen(false)
    setCartOpen(false)
    setCart([])
    setToast('تم استلام طلبك، سنتواصل معك قريبًا')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="app-shell">
      <div className="announcement"><span>شحن للطلبات داخل سوريا</span><span className="announcement-dot">●</span><span>الدفع عند الاستلام</span></div>
      <header className="site-header">
        <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة"><i className="fa-solid fa-bars" aria-hidden="true"></i></button>
        <nav className="main-nav"><a className="active" href="#new">الجديد</a><a href="#collection">المجموعة</a><a href="#story">قصتنا</a></nav>
        <a className="brand" href="#top" aria-label="الرحال الرئيسية"><span className="brand-mark">ر</span><span className="brand-copy"><strong>الرحال</strong><small>Rahhal</small></span></a>
        <div className="header-actions"><button className="icon-button search-trigger" aria-label="البحث" onClick={() => document.querySelector('.search-input')?.focus()}>⌕</button><button className="bag-button" onClick={() => setCartOpen(true)}><span>حقيبتي</span><span className="bag-count">{cartCount}</span></button></div>
      </header>

      <main id="top">
        <section className="hero" id="new">
          <div className="hero-copy"><p className="eyebrow">Rahhal</p><h1>كل ما<br /><em>تحتاجه.</em></h1><p className="hero-description">منتجات مختارة للاستخدام اليومي، مع توصيل موثوق إلى جميع المحافظات السورية.</p><a className="text-link" href="#collection">تصفح المنتجات <span>←</span></a></div>
          <div className="hero-object"><div className="hero-image-wrap"><img src={products[0]?.image} alt="منتج من الرحال" /><div className="hero-stamp">اختيار<br />مميز</div></div><div className="hero-note"><span>01</span><span>منتج مميز</span></div></div>
          <div className="hero-side"><span className="vertical-text">RAHHAL / SHOP</span><span className="scroll-line"></span><span className="vertical-text">مرّر للتصفح</span></div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading"><div><p className="eyebrow">منتجات المتجر</p><h2>تصفح <em>الآن</em></h2></div><p className="section-intro">مجموعة متنوعة من المنتجات،<br />اختر منها ما يناسبك.</p></div>
          <div className="toolbar"><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="search-box"><span>⌕</span><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن منتج..." /></label></div>
          <div className="product-grid">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} onAdd={() => addToCart(product)} onDetails={() => setSelectedProduct(product)} />)}</div>
          {visibleProducts.length === 0 && <div className="empty-state">لا توجد نتائج بهذه الكلمات. جرّب بحثًا مختلفًا.</div>}
        </section>

        <section className="manifesto" id="story"><div className="manifesto-number">02</div><div className="manifesto-copy"><p className="eyebrow">عن الرحال</p><h2>اختيار<br /><em>أسهل.</em></h2></div><div className="manifesto-text"><p>نجمع لك منتجات متنوعة في مكان واحد، مع معلومات واضحة وتجربة طلب بسيطة وتوصيل داخل سوريا.</p><a className="text-link light" href="#collection">تصفح المنتجات <span>←</span></a></div></section>
        <section className="service-strip" id="services"><div><span className="service-icon">↺</span><strong>استبدال سهل</strong><p>خلال 7 أيام من الاستلام</p></div><div><span className="service-icon">⌁</span><strong>توصيل موثوق</strong><p>إلى جميع المحافظات السورية</p></div><div><span className="service-icon">◌</span><strong>دفع عند الاستلام</strong><p>بكل راحة وأمان</p></div></section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">ر</span><span>Rahhal</span></div><p>متجر متنوع، أقرب إليك.</p><div className="footer-links"><a href="#collection">المتجر</a><a href="#story">عن الرحال</a><button className="footer-contact-link" onClick={() => setContactOpen(true)}>تواصل معنا</button></div><small>© 2026 Rahhal</small></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><h2>حقيبتك <span>({cartCount})</span></h2><button onClick={() => setCartOpen(false)} aria-label="إغلاق">×</button></div>{cart.length === 0 ? <div className="cart-empty"><div>⌁</div><p>حقيبتك فارغة حاليًا.</p><button className="dark-button" onClick={() => setCartOpen(false)}>تصفح المنتجات</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{formatPrice(item.price)} ل.س</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}>+</button></div></div></div>)}</div><div className="cart-footer"><div><span>المجموع</span><strong>{formatPrice(cartTotal)} ل.س</strong></div><button className="dark-button" onClick={() => setOrderOpen(true)}>إتمام الطلب <span>←</span></button></div></>}</aside></div>}
      {orderOpen && <div className="order-backdrop" onClick={() => setOrderOpen(false)}><form className="order-modal" onSubmit={submitOrder} onClick={(event) => event.stopPropagation()}><div className="drawer-header"><h2>تفاصيل التوصيل</h2><button type="button" onClick={() => setOrderOpen(false)} aria-label="إغلاق">×</button></div><p className="order-caption">سنراجع طلبك ونتواصل معك لتأكيد الموعد.</p><label>الاسم الكامل<input required placeholder="مثال: رامي محمد" /></label><label>رقم الهاتف<input required type="tel" placeholder="09xx xxx xxx" /></label><div className="form-row"><label>المحافظة<select required defaultValue=""><option value="" disabled>اختر المحافظة</option><option>دمشق</option><option>ريف دمشق</option><option>حلب</option><option>حمص</option><option>اللاذقية</option><option>طرطوس</option><option>حماة</option><option>إدلب</option></select></label><label>المنطقة<input required placeholder="المنطقة" /></label></div><label>العنوان بالتفصيل<textarea required rows="2" placeholder="الشارع، البناء، الطابق"></textarea></label><div className="payment-note"><span>◉</span><div><strong>الدفع عند الاستلام</strong><small>متاح داخل سوريا</small></div></div><button className="dark-button order-submit" type="submit">تأكيد الطلب <span>{formatPrice(cartTotal)} ل.س</span></button></form></div>}
      {selectedProduct && <div className="product-detail-backdrop" onClick={() => setSelectedProduct(null)}><section className="product-detail-modal" onClick={(event) => event.stopPropagation()}><button className="product-detail-close" onClick={() => setSelectedProduct(null)} aria-label="إغلاق">×</button><div className="product-detail-image"><img src={selectedProduct.image} alt={selectedProduct.name} /></div><div className="product-detail-content"><p className="eyebrow">{selectedProduct.type}</p><h2>{selectedProduct.name}</h2><p className="product-detail-color">اللون: {selectedProduct.color}</p><p className="product-detail-description">منتج مختار بعناية من الرحال. تفاصيل واضحة وجودة مناسبة للاستخدام اليومي.</p><div className="product-detail-price"><strong>{formatPrice(selectedProduct.price)}</strong><span>ل.س</span></div><button className="dark-button product-detail-add" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }}><i className="fa-solid fa-bag-shopping" aria-hidden="true"></i> أضف إلى الحقيبة</button></div></section></div>}
      {contactOpen && <div className="contact-backdrop" onClick={() => setContactOpen(false)}><section className="contact-modal" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><h2>تواصل معنا</h2><button onClick={() => setContactOpen(false)} aria-label="إغلاق">×</button></div><p>اختر المنصة المناسبة للتواصل معنا.</p><div className="contact-options"><a className="contact-option whatsapp" href={whatsappLink} target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i><span><strong>واتساب</strong><small>الصفحة الرئيسية</small></span><i className="fa-solid fa-arrow-left" aria-hidden="true"></i></a><a className="contact-option facebook" href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i><span><strong>فيسبوك</strong><small>الصفحة الرئيسية</small></span><i className="fa-solid fa-arrow-left" aria-hidden="true"></i></a><a className="contact-option instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram" aria-hidden="true"></i><span><strong>إنستغرام</strong><small>الصفحة الرئيسية</small></span><i className="fa-solid fa-arrow-left" aria-hidden="true"></i></a></div></section></div>}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}><aside className="site-sidebar" onClick={(event) => event.stopPropagation()}><div className="sidebar-head"><div className="sidebar-title"><span className="brand-mark">ر</span><span><strong>الرحال</strong><small>Rahhal</small></span></div><button onClick={() => setSidebarOpen(false)} aria-label="إغلاق القائمة">×</button></div><nav className="sidebar-nav"><button className={`sidebar-section-trigger ${sectionsOpen ? 'open' : ''}`} onClick={() => setSectionsOpen((current) => !current)}><span><i className="fa-solid fa-layer-group" aria-hidden="true"></i>الأقسام</span><i className="fa-solid fa-chevron-down" aria-hidden="true"></i></button>{sectionsOpen && <div className="sidebar-sections">{categories.map((category) => <button key={category} onClick={() => { setActiveCategory(category); setSidebarOpen(false); document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' }) }}>{category}</button>)}</div>}<a href="#services" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-sparkles" aria-hidden="true"></i>خدماتنا</a><a href="#story" onClick={() => setSidebarOpen(false)}><i className="fa-regular fa-circle-question" aria-hidden="true"></i>من نحن</a><button onClick={() => { setSidebarOpen(false); setContactOpen(true) }}><i className="fa-regular fa-comments" aria-hidden="true"></i>تواصل معنا</button></nav><div className="sidebar-socials"><span>تابعنا</span><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="فيسبوك"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="إنستغرام"><i className="fa-brands fa-instagram" aria-hidden="true"></i></a><a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="واتساب"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></a></div></aside></div>}
      {toast && <div className="toast">✓ {toast}</div>}
      <div className="floating-contact"><button className="floating-contact-toggle" onClick={() => setContactOpen(true)} aria-label="اتصل بنا"><i className="fa-solid fa-headset" aria-hidden="true"></i><span>اتصل بنا</span></button><a className="floating-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="تواصل معنا عبر واتساب"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></a></div>
      <button className="floating-bag" onClick={() => setCartOpen(true)} aria-label="فتح الحقيبة"><i className="fa-solid fa-bag-shopping" aria-hidden="true"></i><span>الحقيبة</span><b>{cartCount}</b></button>
    </div>
  )
}

function ProductCard({ product, index, favorite, onFavorite, onAdd, onDetails }) {
  return <article className={`product-card ${product.tone}`} style={{ '--delay': `${index * 80}ms` }} onClick={onDetails} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onDetails() }} tabIndex="0" role="button" aria-label={`عرض تفاصيل ${product.name}`}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><span className="click-hint"><i className="fa-regular fa-eye" aria-hidden="true"></i> عرض التفاصيل</span>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite ${favorite ? 'liked' : ''}`} onClick={(event) => { event.stopPropagation(); onFavorite() }} aria-label="إضافة للمفضلة">{favorite ? '♥' : '♡'}</button><button className="quick-add" onClick={(event) => { event.stopPropagation(); onAdd() }}>+ <span>أضف للحقيبة</span></button></div><div className="product-meta"><div><h3>{product.name}</h3><p>{product.color}</p></div><strong>{formatPrice(product.price)} <small>ل.س</small></strong></div></article>
}

export default App
