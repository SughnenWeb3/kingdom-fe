import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, ChevronRight, CircleHelp, Clock3, ImagePlus, LocateFixed, LockKeyhole, Mail, MapPin, PackagePlus, Phone, Search, ShieldCheck, Store, UsersRound, X } from "lucide-react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { Category, Listing, ListingDraft, ListingStatus, ListingType, Provider, User } from "./types";
import { mockAuth, mockCategories, mockListings, mockProviders, mockUploads } from "./services/mock";

const naira = (value?: number, type?: string) => type === 'CONTACT_FOR_PRICE' ? 'Contact for price' : value ? `₦${value.toLocaleString('en-NG')}` : 'Price on request';

function useTypewriter(text: string, speed = 38, pauseAfter = 1500) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(type, speed);
      } else {
        // finished — pause, then erase and restart
        timer = setTimeout(erase, pauseAfter);
      }
    };

    const erase = () => {
      i--;
      setDisplayed(text.slice(0, i));
      if (i > 0) {
        timer = setTimeout(erase, speed / 2); // erase faster than typing
      } else {
        timer = setTimeout(type, 400); // brief pause before retyping
      }
    };

    timer = setTimeout(type, 300);
    return () => clearTimeout(timer);
  }, [text, speed, pauseAfter]);

  return displayed;
}

function ListingCard({ listing }: { listing: Listing }) {
  if (!listing.category) return null;
  return <Link to={`/listings/${listing.id}`} className="listing-card">
    <img src={listing.photos[0]} alt="" />
    <div className="card-body">
      <span className="tag">{listing.category.name}</span>
      <h3>{listing.title}</h3>
      <strong>{naira(listing.price, listing.pricingType)}</strong>
      <p><Store size={15} />{listing.provider.name}</p>
      <p><MapPin size={15} />{listing.city}, {listing.state}</p>
    </div>
  </Link>;
}

function Feature({ icon: Icon, children }: { icon: typeof UsersRound; children: React.ReactNode }) {
  return <div className="feature"><Icon /><span>{children}</span></div>;
}

export function Home() {
  const displayed = useTypewriter("Discover Skills, Services & Products Within Our Community.");

  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">BUILT FOR OUR CHURCH COMMUNITY</p>
          <h1 className="typewriter">
            {displayed}
            <span className="cursor" aria-hidden="true">|</span>
          </h1>
          <p className="lead">Find skilled professionals, reliable service providers, artisans and product sellers within our church community. Whether you need a service or have something valuable to offer, Kingdom Market brings us closer together.</p>
          <div className="button-row">
            <Link className="btn primary" to="/explore">Explore Marketplace <ArrowRight /></Link>
            <Link className="btn outline" to="/become-a-provider">Become a Provider</Link>
          </div>
          <div className="features">
            <Feature icon={UsersRound}>Community marketplace</Feature>
            <Feature icon={Store}>Products &amp; services in one place</Feature>
            <Feature icon={BadgeCheck}>Built for our church community</Feature>
          </div>
        </div>
        <div className="hero-board">
          <div className="board-head">
            <b>Professional Services</b>
            <b>Skilled Artisans</b>
            <b>Products</b>
          </div>
          <div className="mini-listings">
            <Mini image="photo-1531384441138-2736e62e0919" name="Tayo Adebayo" role="Web Design & Development" />
            <Mini image="photo-1617038220319-276d3cfab638" name="Bukola Ajayi" role="Handcrafted Jewelry" />
            <Mini image="photo-1542291026-7eec264c27ff" name="Chidi Okonkwo" role="Custom Footwear" />
          </div>
        </div>
      </div>
    </section>
    <section className="category-browser">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND PROVIDERS BY PROFESSION</p>
            <h2>Browse provider categories</h2>
          </div>
          <Link to="/explore">Search all <ArrowRight /></Link>
        </div>
        <div className="category-links">
          {[
            ['fashion-design', 'Fashion Design'],
            ['photography', 'Photography'],
            ['catering', 'Catering'],
            ['graphic-design', 'Graphic Design'],
            ['plumbing', 'Plumbing'],
            ['hairdressing', 'Hairdressing']
          ].map(([slug, name]) => <Link key={slug} to={`/categories/${slug}`}><UsersRound /><span>{name}</span><ArrowRight /></Link>)}
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECENTLY ADDED</p>
            <h2>Explore our latest offerings</h2>
          </div>
          <Link to="/explore">View all <ArrowRight /></Link>
        </div>
        <ListingGrid limit={8} />
      </div>
    </section>
  </>;
}

function Mini({ image, name, role }: { image: string; name: string; role: string }) {
  return <div className="mini">
    <img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=300&q=80`} alt="" />
    <b>{name}</b>
    <small>{role}</small>
    <small><MapPin size={12} /> Lagos</small>
  </div>;
}

function ListingGrid({ list, limit }: { list?: Listing[]; limit?: number }) {
  const [items, setItems] = useState<Listing[]>(list || []);
  useEffect(() => { if (!list) mockListings.search({}).then(setItems) }, [list]);
  return <div className="listing-grid">{items.slice(0, limit).map(x => <ListingCard key={x.id} listing={x} />)}</div>;
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [offerings, setOfferings] = useState<Listing[]>([]);
  useEffect(() => {
    mockProviders.activeOfferings(provider.id).then(all => {
      setOfferings(all.filter(x => provider.categories.includes(x.category.name)));
    });
  }, [provider.id, provider.categories]);
  return <article className="provider-card">
    <div className="provider-card-top">
      <div className="avatar">{provider.name[0]}</div>
      <div>
        <h3>{provider.name}</h3>
        <p><MapPin size={14} />{provider.city}, {provider.state}</p>
      </div>
    </div>
    <p className="provider-description">{provider.description}</p>
    <div className="provider-tags">{provider.categories.map(x => <span key={x}>{x}</span>)}</div>
    {offerings.length > 0 && <small className="provider-offering">Offers: {offerings.slice(0, 2).map(x => x.title).join(" · ")}</small>}
    <Link className="provider-link" to={`/providers/${provider.id}`}>View provider profile <ArrowRight /></Link>
  </article>;
}

function CategorySuggestion({ q }: { q: string }) {
  const [matches, setMatches] = useState<Category[]>([]);
  useEffect(() => {
    mockCategories.all().then(all => setMatches(!q ? [] : all.filter(c => [c.name, ...(c.aliases || [])].some(x => x.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(x.toLowerCase())))));
  }, [q]);
  if (!matches.length) return null;
  return <div className="category-suggestions">
    <b>Find providers by category</b>
    {matches.map(c => <Link key={c.id} to={`/categories/${c.slug}`}><UsersRound />{c.name}<ArrowRight /></Link>)}
  </div>;
}

export function Explore({ type }: { type?: ListingType }) {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<Listing[]>([]);
  const q = params.get('q') || '';
  const selected = type || params.get('type') || '';
  const state = params.get('state') || '';

  useEffect(() => {
    mockListings.search({ q, type: selected, state }).then(setItems);
  }, [q, selected, state]);

  const choose = (t: string) => setParams(p => { t ? p.set('type', t) : p.delete('type'); return p });
  const update = (name: string, value: string) => setParams(p => { value ? p.set(name, value) : p.delete(name); return p });

  return <section className="container explore">
    <div className="explore-intro">
      <div>
        <p className="eyebrow">SHOP • SUPPORT • GROW</p>
        <h1>Discover Quality Products and Services from Our Community.</h1>
        <p>Find individual offerings, or discover providers by profession and category.</p>
      </div>
      <div className="assurance">
        <Feature icon={ShieldCheck}>Community-led marketplace</Feature>
        <Feature icon={UsersRound}>Find providers by category</Feature>
        <Feature icon={Store}>Products &amp; services</Feature>
      </div>
    </div>
    <div className="filters">
      <label><Search /><input value={q} onChange={e => update('q', e.target.value)} placeholder="Search listings, providers or professions…" /></label>
      <select value={state} onChange={e => update('state', e.target.value)}>
        <option value="">All locations</option>
        <option>Rivers</option>
        <option>Lagos</option>
        <option>Oyo</option>
      </select>
      <button className="btn outline" onClick={() => setParams({})}>Clear</button>
    </div>
    <CategorySuggestion q={q} />
    <div className="market-layout">
      <aside className="categories">
        <h3>Categories</h3>
        <button className={!selected ? 'selected' : ''} onClick={() => choose('')}>Products & services</button>
        {['PRODUCT', 'SERVICE'].map(t => <button key={t} className={selected === t ? 'selected' : ''} onClick={() => choose(t)}>{t === 'PRODUCT' ? 'Products' : 'Services'}</button>)}
        <hr />
        <Link to="/categories/fashion-design">Fashion Design</Link>
        <Link to="/categories/photography">Photography</Link>
        <Link to="/categories/catering">Catering</Link>
        <Link to="/categories/graphic-design">Graphic Design</Link>
        <Link to="/categories/plumbing">Plumbing</Link>
        <Link to="/categories/hairdressing">Hairdressing</Link>
      </aside>
      <main>
        {items.length ? <ListingGrid list={items} /> : <div className="empty"><PackagePlus /><h2>No listings match your search</h2><p>Try adjusting your filters or search terms.</p></div>}
      </main>
    </div>
  </section>;
}

export function CategoryResults() {
  const { slug = '' } = useParams();
  const [category, setCategory] = useState<Category | null>();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    mockCategories.all().then(all => setCategory(all.find(x => x.slug === slug) || null));
    mockProviders.byCategory(slug, { state, city }).then(setProviders);
  }, [slug, state, city]);

  if (category === undefined) return <Loading />;
  if (!category) return <NotFound />;

  return <section className="container category-page">
    <p className="eyebrow">PROVIDER DISCOVERY</p>
    <div className="category-title">
      <div>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>
      <Link to="/explore" className="btn outline">Explore listings</Link>
    </div>
    <div className="provider-filters">
      <label><MapPin /><select value={state} onChange={e => { setState(e.target.value); setCity(''); }}>
        <option value="">All states</option>
        <option>Lagos</option>
        <option>Oyo</option>
        <option>Rivers</option>
      </select></label>
      <label><MapPin /><select value={city} onChange={e => setCity(e.target.value)}>
        <option value="">All cities</option>
        {state === 'Lagos' && <><option>Lekki</option><option>Surulere</option></>}
        {state === 'Oyo' && <option>Ibadan</option>}
        {state === 'Rivers' && <option>Port Harcourt</option>}
      </select></label>
    </div>
    <div className="results-head">
      <h2>Providers <small>{providers.length} available</small></h2>
    </div>
    {providers.length ? <div className="provider-grid">{providers.map(x => <ProviderCard key={x.id} provider={x} />)}</div> : <div className="empty"><UsersRound /><h3>No providers match these filters</h3><p>Try another state or city.</p></div>}
  </section>;
}

export function ListingDetails({ user }: { user: User | null }) {
  const { id = '' } = useParams();
  const [listing, setListing] = useState<Listing | null>();
  useEffect(() => { mockListings.get(id).then(setListing) }, [id]);
  if (listing === undefined) return <Loading />;
  if (!listing) return <NotFound />;
  return <section className="container detail">
    <div className="gallery"><img src={listing.photos[0]} alt={listing.title} /></div>
    <div className="detail-copy">
      <span className="tag">{listing.type === 'SERVICE' ? 'Service' : 'Product'} · {listing.category.name}</span>
      <h1>{listing.title}</h1>
      <strong className="price">{naira(listing.price, listing.pricingType)}</strong>
      <p className="location"><MapPin /> {listing.city}, {listing.state}</p>
      <hr />
      <h3>About this {listing.type === 'SERVICE' ? 'service' : 'item'}</h3>
      <p>{listing.description}</p>
      {listing.type === 'SERVICE' && <p><b>Service mode:</b> {listing.serviceMode || 'To be agreed with provider'}</p>}
      <div className="provider-box">
        <div className="avatar">{listing.provider.name[0]}</div>
        <div><b>{listing.provider.name}</b><span>Provider</span></div>
        <Link to={`/providers/${listing.provider.id}`}>View profile <ChevronRight /></Link>
      </div>
      {user ? <a className="btn primary contact" href="tel:+2348012345678"><Phone /> View phone & WhatsApp</a> : <Link className="btn primary contact" to={`/sign-in?next=/listings/${id}`}><LockKeyhole /> Sign in to view contact details</Link>}
    </div>
  </section>;
}

export function ProviderProfile({ user }: { user: User | null }) {
  const { id = '' } = useParams();
  const [provider, setProvider] = useState<Provider | null>();
  const [items, setItems] = useState<Listing[]>([]);
  useEffect(() => {
    mockProviders.get(id).then(setProvider);
    mockListings.search({}).then(x => setItems(x.filter(a => a.provider.id === id)));
  }, [id]);
  if (provider === undefined) return <Loading />;
  if (!provider) return <NotFound />;
  return <section className="container profile">
    <div className="profile-hero">
      <div className="big-avatar">{provider.name[0]}</div>
      <div>
        <h1>{provider.name}</h1>
        <p><MapPin /> {provider.city}, {provider.state}</p>
        <p>{provider.description}</p>
        {provider.churchAffiliation && <small>Self-declared church affiliation: {provider.churchAffiliation}</small>}
      </div>
      {user ? <a href="tel:+2348012345678" className="btn primary"><Phone /> Contact provider</a> : <Link to="/sign-in" className="btn outline">Sign in to contact</Link>}
    </div>
    <h2>Listings</h2>
    <ListingGrid list={items} />
  </section>;
}

export function Auth({ mode, onAuth }: { mode: 'sign-in' | 'register'; onAuth: (u: User) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string; email: string; password: string }>();
  const submit = async (data: { name: string; email: string; password: string }) => {
    const user = mode === 'sign-in' ? await mockAuth.signIn(data.email, data.password) : await mockAuth.register(data.name, data.email, data.password);
    onAuth(user);
    const next = searchParams.get('next') || (location.state as any)?.from;
    if (next) {
      navigate(next);
    } else if (user.isProvider) {
      navigate('/dashboard');
    } else {
      navigate('/explore');
    }
  };
  return <section className="auth-page">
    <form className="auth-card" onSubmit={handleSubmit(submit)}>
      <Link to="/" className="auth-brand">✦ Kingdom Market</Link>
      <h1>{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h1>
      <p>{mode === 'sign-in' ? 'Sign in to contact providers or manage your business.' : 'Join the Kingdom Market community.'}</p>
      {mode === 'register' && <label>Full name<input {...register('name', { required: 'Your name is required' })} />{errors.name && <em>{errors.name.message}</em>}</label>}
      <label>Email address<input type="email" {...register('email', { required: 'Your email is required' })} />{errors.email && <em>{errors.email.message}</em>}</label>
      <label>Password<input type="password" {...register('password', { required: 'Your password is required', minLength: { value: 6, message: 'Use at least 6 characters' } })} />{errors.password && <em>{errors.password.message}</em>}</label>
      <button disabled={isSubmitting} className="btn primary wide">{isSubmitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
      <p className="switch">{mode === 'sign-in' ? <>New here? <Link to="/register">Create an account</Link></> : <>Already have an account? <Link to="/sign-in">Sign in</Link></>}</p>
    </form>
  </section>;
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string; description: string; state: string; city: string; phone: string; whatsapp: string; category: string }>();
  const submit = async (data: any) => {
    await mockProviders.create({ ...data, categories: [data.category] });
    onComplete();
    navigate('/dashboard');
  };
  return <section className="onboarding">
    <div className="container onboarding-grid">
      <div className="onboarding-copy">
        <p className="eyebrow">GROW YOUR BUSINESS • SERVE YOUR COMMUNITY</p>
        <h1>List Your Business on Kingdom Market</h1>
        <p>Showcase your products or services to a trusted community. It's free, simple, and helps you reach people who value quality and trust.</p>
        <div className="onboard-features">
          <Feature icon={Clock3}>Reach a targeted audience</Feature>
          <Feature icon={ShieldCheck}>Build trust &amp; credibility</Feature>
          <Feature icon={UsersRound}>Grow your customer base</Feature>
        </div>
        <hr />
        <h3>Who can list?</h3>
        <p>Individuals, small businesses, and church members with legitimate products or services are welcome.</p>
      </div>
      <form className="provider-form" onSubmit={handleSubmit(submit)}>
        <div className="steps"><b><i>1</i>Business Details</b><span><i>2</i>Products/Services</span><span><i>3</i>Media</span><span><i>4</i>Review & Submit</span></div>
        <h2>Business Details</h2>
        <p>Tell us about your business so we can get you listed.</p>
        <label>Business Name *<input placeholder="Enter your business name" {...register('name', { required: 'Business name is required' })} />{errors.name && <em>{errors.name.message}</em>}</label>
        <div className="field-row">
          <label>Business Category *<select {...register('category', { required: true })}><option value="">Select a category</option><option>Fashion & Clothing</option><option>Electronics & Gadgets</option><option>Home & Living</option><option>Beauty & Personal Care</option><option>Food & Beverages</option><option>Services</option></select></label>
          <label>Description *<textarea placeholder="Describe your business" {...register('description', { required: 'Description is required' })} />{errors.description && <em>{errors.description.message}</em>}</label>
        </div>
        <label>State *<select {...register('state', { required: true })}><option value="">Select state</option><option>Lagos</option><option>Rivers</option><option>Oyo</option></select></label>
        <label>City *<input placeholder="Enter city" {...register('city', { required: 'City is required' })} />{errors.city && <em>{errors.city.message}</em>}</label>
        <label>Phone Number *<input placeholder="e.g., 08012345678" {...register('phone', { required: 'Phone number is required' })} />{errors.phone && <em>{errors.phone.message}</em>}</label>
        <label>WhatsApp Number *<input placeholder="e.g., 08012345678" {...register('whatsapp', { required: 'WhatsApp number is required' })} />{errors.whatsapp && <em>{errors.whatsapp.message}</em>}</label>
        <button disabled={isSubmitting} className="btn primary wide">{isSubmitting ? 'Please wait…' : 'Continue'}</button>
      </form>
    </div>
  </section>;
}

export function Account({ user }: { user: User | null }) {
  const [provider, setProvider] = useState<Provider | null>();
  const [items, setItems] = useState<Listing[]>([]);
  useEffect(() => {
    mockProviders.current().then(setProvider);
    mockListings.mine().then(setItems);
  }, []);
  return <section className="container dashboard">
    <aside className="account-nav">
      <b>Account Overview</b>
      <Link to="/dashboard">Overview</Link>
      <Link to="/dashboard/listings">My listings</Link>
      <Link to="/become-a-provider">Provider profile</Link>
      <hr />
      <span>Need help?</span>
      <small>We are here to help you use the marketplace.</small>
    </aside>
    <div className="dashboard-content">
      <div className="welcome">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Here's a quick look at your account and activity.</p>
        </div>
        <span className="secure"><ShieldCheck /> Your account is secure</span>
      </div>
      {provider ? <>
        <div className="dashboard-cards">
          <div className="profile-card">
            <div className="card-title">
              <h2>Provider Profile</h2>
              <Link to="/become-a-provider">Edit profile</Link>
            </div>
            <div className="provider-name">
              <div className="avatar">{provider.name[0]}</div>
              <div><b>{provider.name}</b><span><Mail /> {user?.email}</span><span><MapPin /> {provider.city}, {provider.state}</span></div>
            </div>
            <div className="stats">
              <span><b>{items.filter(x => x.status === 'ACTIVE').length}</b> Active listings</span>
              <span><b>10</b> Listing limit</span>
              <span><b>Active</b> Provider status</span>
            </div>
          </div>
          <div className="grow-card">
            <UsersRound />
            <h2>Grow Together</h2>
            <p>Your business can be found by people in the community.</p>
            <Link className="btn outline" to="/dashboard/listings/new">Add a listing</Link>
          </div>
        </div>
        <div className="dashboard-bottom">
          <div className="activity">
            <div className="card-title">
              <h2>Recent listings</h2>
              <Link to="/dashboard/listings">Manage all <ArrowRight /></Link>
            </div>
            {items.length ? items.slice(0, 4).map(x => <div className="activity-line" key={x.id}><Building2 /><span><b>{x.title}</b><small>{x.status.toLowerCase()} · {x.category.name}</small></span><small>{new Date(x.createdAt).toLocaleDateString()}</small></div>) : <div className="empty"><PackagePlus /><h3>No listings yet</h3><p>Create your first listing to get started.</p></div>}
          </div>
        </div>
      </> : <div className="dashboard-cards">
        <div className="grow-card">
          <UsersRound />
          <h2>Become a Provider</h2>
          <p>List your products and services to reach more customers in our community.</p>
          <Link className="btn primary" to="/become-a-provider">Start now</Link>
        </div>
      </div>}
    </div>
  </section>;
}

export function Listings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  const refresh = () => mockListings.mine().then(setItems);
  useEffect(() => { void refresh() }, []);
  const change = async (id: string, status: ListingStatus) => {
    setError('');
    try {
      await mockListings.changeStatus(id, status);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update listing');
    }
  };
  return <section className="container management">
    <div className="page-title">
      <div>
        <p className="eyebrow">PROVIDER DASHBOARD</p>
        <h1>Manage Listings</h1>
        <p>Keep your offerings current. You can have up to 10 active listings.</p>
      </div>
      <Link className="btn primary" to="/dashboard/listings/new"><PackagePlus /> Create listing</Link>
    </div>
    {error && <p className="error-banner">{error}</p>}
    <div className="manage-list">
      {items.length ? items.map(x => <article key={x.id}>
        <img src={x.photos[0]} alt="" />
        <div>
          <span className="tag">{x.status}</span>
          <h3>{x.title}</h3>
          <p>{x.category.name} · {naira(x.price, x.pricingType)}</p>
        </div>
        <div className="listing-actions">
          <Link to={`/dashboard/listings/${x.id}/edit`}>Edit</Link>
          {x.status === 'ACTIVE' ? <button onClick={() => change(x.id, 'INACTIVE')}>Deactivate</button> : <button onClick={() => change(x.id, 'ACTIVE')}>Activate</button>}
          {x.status === 'ARCHIVED' ? <button onClick={() => change(x.id, 'INACTIVE')}>Restore</button> : <button onClick={() => change(x.id, 'ARCHIVED')}>Archive</button>}
        </div>
      </article>) : <div className="empty"><PackagePlus /><h2>No listings yet</h2><p>Your published listings will appear here.</p><Link className="btn primary" to="/dashboard/listings/new">Create listing</Link></div>}
    </div>
  </section>;
}

export function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<any>({ defaultValues: { type: 'PRODUCT', pricingType: 'FIXED' } });
  const type = watch('type'), pricing = watch('pricingType');
  useEffect(() => {
    mockCategories.all().then(setCategories);
    if (id) mockListings.get(id).then(x => {
      if (x) {
        setValue('title', x.title);
        setValue('description', x.description);
        setValue('type', x.type);
        setValue('categoryId', x.category.id);
        setValue('state', x.state);
        setValue('city', x.city);
        setValue('pricingType', x.pricingType);
        setValue('price', x.price);
        setPreviews(x.photos);
      }
    });
  }, [id, setValue]);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...e.target.files || []];
    if (previews.length + files.length > 5) {
      setMessage('A listing can have a maximum of five images.');
      return;
    }
    setPreviews([...previews, ...await mockUploads.preview(files)]);
  };
  const submit = async (data: any) => {
    try {
      setMessage('');
      await mockListings.save({ ...data, price: data.price ? Number(data.price) : undefined, photos: previews }, id);
      navigate('/dashboard/listings');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to save listing');
    }
  };
  return <section className="container listing-form">
    <div className="page-title">
      <div>
        <p className="eyebrow">PROVIDER DASHBOARD</p>
        <h1>{id ? 'Edit listing' : 'Create a listing'}</h1>
        <p>Share your product or service with the community.</p>
      </div>
    </div>
    <form onSubmit={handleSubmit(submit)}>
      {message && <p className="error-banner">{message}</p>}
      <div className="form-section">
        <h2>Listing details</h2>
        <label>Listing type *<select {...register('type')}><option value="PRODUCT">Product</option><option value="SERVICE">Service</option></select></label>
        <label>Title *<input {...register('title', { required: 'Enter a title' })} placeholder="What are you offering?" />{errors.title && <em>{String(errors.title.message)}</em>}</label>
        <label>Description *<textarea {...register('description', { required: 'Enter a description' })} placeholder="Describe your offering in detail" rows={4} />{errors.description && <em>{String(errors.description.message)}</em>}</label>
        <label>Category *<select {...register('categoryId', { required: 'Select a category' })}><option value="">Select a category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <div className="field-row">
          <label>State *<select {...register('state', { required: true })}><option value="">Select state</option><option>Lagos</option><option>Rivers</option><option>Oyo</option></select></label>
          <label>City *<input {...register('city', { required: 'City is required' })} placeholder="Enter city" />{errors.city && <em>{String(errors.city.message)}</em>}</label>
        </div>
        <label>Pricing type *<select {...register('pricingType')}><option value="FIXED">Fixed price</option><option value="STARTING_FROM">Starting from</option><option value="NEGOTIABLE">Negotiable</option><option value="CONTACT_FOR_PRICE">Contact for price</option></select></label>
        {(pricing === 'FIXED' || pricing === 'STARTING_FROM') && <label>Price (₦) *<input type="number" {...register('price', { required: 'Enter a price' })} placeholder="0.00" />{errors.price && <em>{String(errors.price.message)}</em>}</label>}
        {type === 'SERVICE' && <>
          <label>Service mode *<select {...register('serviceMode')}><option value="IN_PERSON">In-person</option><option value="REMOTE">Remote</option><option value="BOTH">Both</option></select></label>
          <label>Additional service areas (optional)<textarea placeholder="List additional cities where you offer this service" rows={2} /></label>
        </>}
      </div>
      <div className="form-section">
        <h2>Photos</h2>
        <p>Upload up to 5 photos. Maximum 5MB per image.</p>
        <div className="previews">
          {previews.map((src, i) => <div key={i} className="preview"><img src={src} alt="" /><button type="button" onClick={() => setPreviews(previews.filter((_, j) => j !== i))}><X /></button></div>)}
          {previews.length < 5 && <label className="upload"><ImagePlus /><input type="file" accept="image/*" multiple onChange={upload} /></label>}
        </div>
      </div>
      <button disabled={isSubmitting} className="btn primary wide">{isSubmitting ? 'Please wait…' : id ? 'Update listing' : 'Publish listing'}</button>
    </form>
  </section>;
}

export function Loading() { return <div className="page-loading">Loading…</div>; }

export function NotFound() { return <section className="container empty not-found"><CircleHelp /><h1>Page not found</h1><p>The page you are looking for is unavailable.</p><Link className="btn primary" to="/">Return home</Link></section>; }
