import type { Category, Listing, ListingDraft, Provider, ProviderDraft, User } from "../types";
export interface AuthService { current(): Promise<User | null>; signIn(email: string, password: string): Promise<User>; register(name: string, email: string, password: string): Promise<User>; signOut(): Promise<void> }
export interface ListingService { search(filters: { q?: string; type?: string; state?: string }): Promise<Listing[]>; get(id: string): Promise<Listing | null>; mine(): Promise<Listing[]>; save(draft: ListingDraft, id?: string): Promise<Listing>; changeStatus(id: string, status: Listing["status"]): Promise<Listing> }
export interface ProviderService { current(): Promise<Provider | null>; create(draft: ProviderDraft): Promise<Provider>; get(id: string): Promise<Provider | null>; search(filters: { q?: string; category?: string; state?: string; city?: string }): Promise<Provider[]>; byCategory(slug: string, filters?: { state?: string; city?: string }): Promise<Provider[]>; activeOfferings(providerId: string): Promise<Listing[]> }
export interface CategoryService { all(): Promise<Category[]> }
export interface UploadService { preview(files: File[]): Promise<string[]> }
