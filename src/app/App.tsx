import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { User } from "../types";
import { mockAuth } from "../services/mock";
import { Header, Footer } from "../components/Layout";
import { Home, Explore, ListingDetails, ProviderProfile, Account, Onboarding, Listings, ListingForm, Auth, CategoryResults, NotFound } from "../pages";

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    mockAuth.current().then(setUser).catch(err => {
      console.error('Auth error:', err);
      setUser(null);
    });
  }, []);

  if (user === undefined) return <div className="page-loading">Loading Kingdom Market…</div>;

  const auth = (el: ReactNode) => <>{user ? el : <Navigate to="/sign-in" replace />}</>;

  return <>
    <Header user={user} onSignOut={async () => { await mockAuth.signOut(); setUser(null); }} />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/products" element={<Explore type="PRODUCT" />} />
        <Route path="/services" element={<Explore type="SERVICE" />} />
        <Route path="/categories/:slug" element={<CategoryResults />} />
        <Route path="/listings/:id" element={<ListingDetails user={user} />} />
        <Route path="/providers/:id" element={<ProviderProfile user={user} />} />
        <Route path="/sign-in" element={<Auth mode="sign-in" onAuth={setUser} />} />
        <Route path="/register" element={<Auth mode="register" onAuth={setUser} />} />
        <Route path="/become-a-provider" element={auth(<Onboarding onComplete={() => mockAuth.current().then(setUser)} />)} />
        <Route path="/dashboard" element={auth(<Account user={user} />)} />
        <Route path="/dashboard/listings" element={auth(<Listings />)} />
        <Route path="/dashboard/listings/new" element={auth(<ListingForm />)} />
        <Route path="/dashboard/listings/:id/edit" element={auth(<ListingForm />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>;
}
