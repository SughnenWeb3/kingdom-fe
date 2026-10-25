import type { AuthService, CategoryService, ListingService, ProviderService, UploadService } from "./contracts";
import type { Category, Listing, Provider, User } from "../types";
const img = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;
const categories: Category[] = [
  ["Fashion Design","fashion-design","Custom clothing, alterations, traditional wear and fashion services.",["fashion designer","fashion designers","tailoring"]],
  ["Photography","photography","Photography and visual storytelling for events and businesses.",["photographer","photographers"]],
  ["Catering","catering","Caterers and food services for events and everyday needs.",["caterer","caterers","food service"]],
  ["Graphic Design","graphic-design","Branding, print and digital graphic design services.",["graphic designer","graphic designers","logo design"]],
  ["Plumbing","plumbing","Professional plumbing and repairs.",["plumber","plumbers","plumbing repair"]],
  ["Hairdressing","hairdressing","Hair care, styling and beauty services.",["hairdresser","hair stylists"]],
  ["Electronics & Gadgets","electronics","Devices, accessories and technology services.",[]],
  ["Home & Living","home-living","Furniture, decor and home essentials.",[]],
  ["Books & Stationery","books-stationery","Books, office and school essentials.",[]],
  ["Beauty & Personal Care","beauty-personal-care","Beauty and personal care products.",[]],
  ["Fashion & Clothing","fashion-clothing","Fashion and clothing items.",[]],
  ["Food & Beverages","food-beverages","Food and beverage services.",[]],
  ["Others","others","Other approved marketplace categories.",[]]
].map(([name,slug,description,aliases],i)=>({id:String(i+1),name:name as string,slug:slug as string,description:description as string,aliases:aliases as string[],icon:["Shirt","Camera","Utensils","Palette","Wrench","Scissors","Smartphone","House","BookOpen","Sparkles","Shirt","Coffee","Ellipsis"][i]}));
const provider: Provider = { id:"p1", name:"Grace Fashion Hub", description:"Thoughtfully selected church wear and everyday fashion for the community.",state:"Rivers",city:"Port Harcourt",categories:["Fashion Design"] };
const providers: Provider[] = [provider,
  {id:"p2",name:"Needle & Thread by Ada",description:"Bespoke dresses, traditional outfits, alterations and event styling.",state:"Lagos",city:"Lekki",categories:["Fashion Design"]},
  {id:"p3",name:"Royal Stitches",description:"Custom church wear, uniforms and expert tailoring for all occasions.",state:"Oyo",city:"Ibadan",categories:["Fashion Design"]},
  {id:"p4",name:"Lens & Light Studios",description:"Event photography, portraits and brand visuals that tell your story.",state:"Lagos",city:"Surulere",categories:["Photography","Graphic Design"]},
  {id:"p5",name:"Good Taste Catering",description:"Fresh, carefully prepared meals for events, offices and celebrations.",state:"Rivers",city:"Port Harcourt",categories:["Catering"]}
];
const listings: Listing[] = [
  ["1","Men's Church Wear","Crisp, comfortable and versatile attire for church and special occasions.","PRODUCT","Fashion Design",25000,"photo-1517841905240-472988babdf9"],
  ["2","Laptop (Dell Inspiron)","Reliable laptop for work, study and everyday productivity.","PRODUCT","Electronics & Gadgets",220000,"photo-1496181133206-80ce9b88a853"],
  ["3","Handmade Beads","Beautiful handmade beadwork for memorable occasions.","PRODUCT","Beauty & Personal Care",8000,"photo-1515562141207-7a88fb7ce338"],
  ["4","Custom Leather Shoes","Made-to-order footwear crafted with care.","PRODUCT","Fashion Design",35000,"photo-1542291026-7eec264c27ff"],
  ["5","Holy Bible","A quality edition for personal study and worship.","PRODUCT","Books & Stationery",12000,"photo-1504052434569-70ad5836ab65"],
  ["6","Premium Handbag","A polished everyday accessory.","PRODUCT","Fashion & Clothing",28000,"photo-1584917865442-de89df76afd3"],
  ["7","Natural Skincare Set","Gentle essentials for your routine.","PRODUCT","Beauty & Personal Care",18000,"photo-1556228720-195a672e8a03"],
  ["8","Catering Service","Fresh meals for gatherings and celebrations.","SERVICE","Food & Beverages",undefined,"photo-1547592180-85f173990554"]
].map(([id,title,description,type,categoryName,price,photo],i)=>({id:String(id),title:String(title),description:String(description),type:type as Listing["type"],status:"ACTIVE" as const,category:categories.find(c=>c.name===categoryName)!,state:i===2?"Oyo":"Rivers",city:i===2?"Ibadan":"Port Harcourt",pricingType:price?"FIXED":"CONTACT_FOR_PRICE",price:price as number|undefined,photos:[img(String(photo))],provider,createdAt:new Date(Date.now()-i*86400000).toISOString()}));
listings.push(
  {id:"9",title:"Custom Ankara Dress",description:"Made-to-measure Ankara dresses for weddings and celebrations.",type:"SERVICE",status:"ACTIVE",category:categories[0],state:"Lagos",city:"Lekki",pricingType:"STARTING_FROM",price:30000,photos:[img("photo-1496747611176-843222e1e57c")],provider:providers[1],createdAt:new Date().toISOString()},
  {id:"10",title:"Professional Alterations",description:"Alterations and restyling for your favourite pieces.",type:"SERVICE",status:"ACTIVE",category:categories[0],state:"Oyo",city:"Ibadan",pricingType:"CONTACT_FOR_PRICE",photos:[img("photo-1485968579580-b6d095142e6e")],provider:providers[2],createdAt:new Date().toISOString()},
  {id:"11",title:"Wedding Photography",description:"Beautiful moments captured with care.",type:"SERVICE",status:"ACTIVE",category:categories[1],state:"Lagos",city:"Surulere",pricingType:"STARTING_FROM",price:150000,photos:[img("photo-1519741497674-611481863552")],provider:providers[3],createdAt:new Date().toISOString()},
  {id:"12",title:"Event Catering",description:"Delicious menus for weddings and community events.",type:"SERVICE",status:"ACTIVE",category:categories[2],state:"Rivers",city:"Port Harcourt",pricingType:"STARTING_FROM",price:120000,photos:[img("photo-1555244162-803834f70033")],provider:providers[4],createdAt:new Date().toISOString()}
);
const wait = <T,>(value:T):Promise<T> => new Promise(resolve=>setTimeout(()=>resolve(value),180));
const getStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const setStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage not available:', e);
  }
};
let currentUser: User | null = getStorage("km-user");
let currentProvider: Provider | null = getStorage("km-provider");
let ownListings: Listing[] = getStorage("km-listings") || [];
const save = () => { setStorage("km-user", currentUser); setStorage("km-provider", currentProvider); setStorage("km-listings", ownListings); };
export const mockAuth: AuthService = { current:()=>wait(currentUser), signIn: async(email)=>{currentUser={id:"u1",name:"Tayo",email,isProvider:!!currentProvider};save();return wait(currentUser)}, register:async(name,email)=>{currentUser={id:"u1",name,email,isProvider:false};save();return wait(currentUser)}, signOut:async()=>{currentUser=null;save();return wait(undefined)} };
export const mockCategories: CategoryService = { all:()=>wait(categories) };
export const mockProviders: ProviderService = { current:()=>wait(currentProvider), get:(id)=>wait(providers.find(x=>x.id===id) || (currentProvider?.id===id ? currentProvider : null)), create:async(draft)=>{currentProvider={id:"my-provider",...draft,profileImage:undefined}; if(currentUser) currentUser={...currentUser,isProvider:true};save();return wait(currentProvider)}, search:async(f)=>wait([...providers,...(currentProvider?[currentProvider]:[])].filter(p=>{const source=[p.name,p.description,...p.categories].join(" ").toLowerCase();return(!f.q||source.includes(f.q.toLowerCase()))&&(!f.category||p.categories.includes(f.category))&&(!f.state||p.state===f.state)&&(!f.city||p.city===f.city)})), byCategory:async(slug,f={})=>{const category=categories.find(x=>x.slug===slug);return mockProviders.search({category:category?.name,state:f.state,city:f.city})}, activeOfferings:(providerId)=>wait([...listings,...ownListings].filter(x=>x.provider.id===providerId&&x.status==="ACTIVE")) };
export const mockListings: ListingService = { search:async(f)=>wait([...listings,...ownListings].filter(x=>(!f.q||[x.title,x.description,x.category.name,x.provider.name].join(" ").toLowerCase().includes(f.q.toLowerCase()))&&(!f.type||x.type===f.type)&&(!f.state||x.state===f.state))),get:async(id)=>wait([...listings,...ownListings].find(x=>x.id===id)||null),mine:()=>wait(ownListings),save:async(draft,id)=>{if(!currentProvider) throw new Error("Create a provider profile first.");const active=ownListings.filter(x=>x.status==="ACTIVE"&&x.id!==id).length;if(!id&&active>=10)throw new Error("You have reached the 10 active listing limit. Deactivate a listing before adding another.");const listing:Listing={id:id||crypto.randomUUID(),...draft,category:categories.find(c=>c.id===draft.categoryId)!,status:"ACTIVE",photos:draft.photos,provider:currentProvider,createdAt:new Date().toISOString()};ownListings=id?ownListings.map(x=>x.id===id?listing:x):[listing,...ownListings];save();return wait(listing)},changeStatus:async(id,status)=>{if(status==="ACTIVE"&&ownListings.filter(x=>x.status==="ACTIVE").length>=10)throw new Error("You have reached the 10 active listing limit.");const listing=ownListings.find(x=>x.id===id);if(!listing)throw new Error("Listing not found");listing.status=status;save();return wait(listing)} };
export const mockUploads: UploadService = { preview: async(files)=>Promise.all(files.map(file=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file)}))) };
