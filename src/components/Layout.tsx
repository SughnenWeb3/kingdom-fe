import { Menu, Search, Store, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { User } from "../types";

export const Brand = () => <Link className="brand" to="/"><span className="brand-mark">✦</span><span>Kingdom Market<small>OUR COMMUNITY</small></span></Link>;

export function Header({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/explore', 'Explore Marketplace'], ['/become-a-provider', 'List Your Business'], ['/dashboard', 'My Account']];

  return <header>
    <div className="nav container">
      <Brand />
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'open' : ''}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
      </nav>
      <div className="nav-actions">
        {user ? <>
          <span className="hello">Hi, {user.name}</span>
          <button className="text-btn" onClick={onSignOut}>Sign out</button>
        </> : <Link className="btn outline" to="/sign-in">Sign In</Link>}
        <Link className="btn primary" to={user?.isProvider ? '/dashboard' : '/register'}>{user?.isProvider ? 'Dashboard' : 'Get Started'}</Link>
      </div>
    </div>
  </header>;
}

export function Footer() {
  return <footer>
    <div className="container footer">
      <div>
        <Brand />
        <p>Discover and share products and services within our church community.</p>
      </div>
      <div>
        <b>Kingdom Market</b>
        <Link to="/explore">Explore marketplace</Link>
        <Link to="/become-a-provider">Become a provider</Link>
      </div>
      <div>
        <b>Information</b>
        <a href="#terms">Terms of use</a>
        <a href="#privacy">Privacy policy</a>
      </div>
    </div>
  </footer>;
}

export const SearchIcon = Search;
export const StoreIcon = Store;
