export type ListingType = "PRODUCT" | "SERVICE";
export type ListingStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type PricingType = "FIXED" | "STARTING_FROM" | "NEGOTIABLE" | "CONTACT_FOR_PRICE";
export type ServiceMode = "REMOTE" | "IN_PERSON" | "BOTH";
export interface Category { id: string; name: string; slug: string; icon: string; description?: string; aliases?: string[] }
export interface Provider { id: string; name: string; description: string; state: string; city: string; profileImage?: string; categories: string[]; churchAffiliation?: string }
export interface Listing { id: string; title: string; description: string; type: ListingType; status: ListingStatus; category: Category; state: string; city: string; pricingType: PricingType; price?: number; photos: string[]; provider: Provider; serviceMode?: ServiceMode; serviceAreas?: string[]; createdAt: string }
export interface User { id: string; name: string; email: string; isProvider: boolean }
export interface ProviderDraft { name: string; description: string; state: string; city: string; phone: string; whatsapp: string; categories: string[]; churchAffiliation?: string }
export interface ListingDraft { title: string; description: string; type: ListingType; categoryId: string; state: string; city: string; pricingType: PricingType; price?: number; serviceMode?: ServiceMode; serviceAreas?: string[]; photos: string[] }
