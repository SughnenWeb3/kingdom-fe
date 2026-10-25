# Kingdom Market
## Frontend Technical Requirements Document (TRD)

**Document:** Frontend TRD  
**Version:** 1.0  
**Status:** Proposed implementation specification  
**Application type:** Responsive single-page web application

## 1. Technical Overview

The Kingdom Market frontend will be a React single-page application written in TypeScript.

It will communicate with an Express.js REST API. The backend will handle authentication, authorisation, business rules, database operations, and Cloudinary upload authorisation.

The browser must never connect directly to PostgreSQL or receive private Cloudinary API credentials.

## 2. Proposed Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| UI framework | React | Component-based user interface |
| Language | TypeScript | Type safety |
| Build tool | Vite | Development server and production builds |
| Styling | Tailwind CSS v4 | Responsive styling and design consistency |
| Routing | React Router | Client-side navigation |
| Server state | TanStack Query | API requests, caching, invalidation, loading and error states |
| Forms | React Hook Form | Form state and submission handling |
| Schema validation | Zod | Client-side form validation |
| HTTP client | Fetch API or a small typed wrapper | Communicate with the REST API |
| Icons | Lucide React | Consistent interface icons |
| Image storage | Cloudinary | Image upload, optimisation and delivery |
| Testing | Vitest, React Testing Library, Playwright | Unit, component and end-to-end testing |

These are proposed implementation choices. Keep the project internally consistent if an equivalent tool is selected before implementation.

## 3. Application Architecture

Use a feature-based frontend architecture.

Organise code by product capability rather than placing all components, API calls, and business logic into large global folders.

Suggested directory structure:

```text
kingdom-market-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── marketplace/
│   │   ├── listings/
│   │   ├── providers/
│   │   ├── dashboard/
│   │   ├── categories/
│   │   └── uploads/
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── query-client.ts
│   │   ├── env.ts
│   │   └── utils.ts
│   ├── types/
│   ├── styles/
│   │   └── index.css
│   └── main.tsx
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Each feature should contain its own components, API functions, types, validation schemas, and hooks where appropriate.

## 4. Routing Requirements

Recommended route structure:

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Homepage |
| `/explore` | Public | Marketplace discovery |
| `/products` | Public | Product discovery |
| `/services` | Public | Service discovery |
| `/categories/:slug` | Public | Category provider discovery |
| `/listings/:listingId` | Public | Listing details |
| `/providers/:providerId` | Public | Provider profile |
| `/sign-in` | Public | Sign-in |
| `/register` | Public | Registration |
| `/auth/callback` | Public | Google authentication callback, if required by the flow |
| `/become-a-provider` | Authenticated | Provider onboarding |
| `/dashboard` | Provider | Provider overview |
| `/dashboard/profile` | Provider | Edit provider profile |
| `/dashboard/listings` | Provider | Manage listings |
| `/dashboard/listings/new` | Provider | Create listing |
| `/dashboard/listings/:listingId/edit` | Provider | Edit listing |
| `/dashboard/categories/suggest` | Authenticated | Suggest a category |
| `*` | Public | Not-found page |

Route guards improve navigation and user experience but are not substitutes for backend authorisation.

## 5. API Integration

The frontend must use a single configurable API base URL.

Example environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The production value must be configured through the deployment environment.

### API client responsibilities

The shared API client must:
- Set the expected JSON headers where appropriate.
- Send cookies when the session-based authentication architecture requires them.
- Handle JSON and non-JSON responses safely.
- Normalise API errors.
- Support request cancellation where appropriate.
- Avoid logging passwords, session identifiers, tokens, or private contact details.
- Handle expired or invalid sessions without infinite retry loops.

If using cookie-based sessions across origins, configure `credentials: "include"` and align backend CORS, cookie, and CSRF settings with the deployment domains.

### Expected API groups

The frontend should integrate with the following backend capabilities. Exact paths and payloads must be confirmed against the final backend API contract.

**Authentication**
- Register.
- Login.
- Google authentication.
- Logout.
- Current-user/session lookup.

**Marketplace**
- List and search listings.
- Filter by listing type and location.
- Retrieve listing details.
- Retrieve public provider profiles.
- Retrieve protected provider contact information for authenticated users.

**Provider**
- Create and update provider profiles.
- Retrieve the current provider profile.
- Submit phone-change requests.
- Retrieve request status.

**Listings**
- Create and edit listings.
- Retrieve the provider's listings.
- Activate and deactivate listings.
- Archive and restore listings.
- Manage listing photos.

**Categories**
- Retrieve predefined categories.
- Submit category suggestions.
- Retrieve suggestion status where supported.

**Uploads**
- Request signed Cloudinary upload parameters.
- Upload images directly to Cloudinary.
- Register successful uploads with the backend.
- Remove images through an authorised backend operation.

Do not assume that an endpoint exists until it has been implemented and documented by the backend team.

## 5.1 Category-Based Provider Discovery

The marketplace must support two distinct discovery experiences:

### A. Product and Service Search
Users search for individual offerings by listing title, description, category, or provider/business name. This displays listing cards.

### B. Provider Discovery by Category
Users search for a profession or category to discover all providers who offer that type of service. This displays provider cards and leads to provider profiles.

### Required Provider Discovery Features

**Homepage Category Discovery**
- Display a category browser or category cards section.
- Each category shows the category name, icon, and a link to its provider discovery page.
- Selecting a category navigates to `/categories/:slug`.

**Provider Search**
- Search input on the Explore page accepts profession terms (e.g., "fashion designer", "photographer").
- When a search term matches a category name or its aliases, display category suggestions.
- Category suggestions link directly to the category's provider discovery page.
- Provider search results should be distinct from listing search results, using tabs or separate result types (All, Providers, Products and Services).

**Category Results Page** (`/categories/:slug`)
- Display category name and description.
- Show total number of matching providers.
- Provider grid with cards showing:
  - Provider/business name
  - Profile image or logo (or avatar initial)
  - Location (state and city)
  - Short provider description
  - Categories the provider belongs to
  - A selection of the provider's active offerings (2-3 listings)
  - Clear action to view the full provider profile
- Location filters:
  - State dropdown (all states or specific state)
  - City dropdown (filtered by selected state)
- Empty state when no providers match the filters
- Link back to explore listings

**Provider Profile Page** (`/providers/:providerId`)
- Provider/business name
- Profile image or logo (or avatar initial)
- Description
- State and city
- Categories the provider belongs to
- Active products and services published by that provider
- Optional, self-declared church affiliation (not presented as verified)
- Contact actions (phone and WhatsApp) for signed-in users only
- Sign-in prompt for guests attempting to access contact details

**Service Contracts**
```ts
export interface ProviderService {
  current(): Promise<Provider | null>;
  create(draft: ProviderDraft): Promise<Provider>;
  get(id: string): Promise<Provider | null>;
  search(filters: {
    q?: string;
    category?: string;
    state?: string;
    city?: string;
  }): Promise<Provider[]>;
  byCategory(slug: string, filters?: {
    state?: string;
    city?: string;
  }): Promise<Provider[]>;
  activeOfferings(providerId: string): Promise<Listing[]>;
}
```

**Category Aliases**
Categories should support search aliases to match common profession terms. For example:
- Category: "Fashion Design"
- Aliases: ["fashion designer", "fashion designers", "tailoring"]
- Search for "fashion designer" → matches Fashion Design category

**Mock Data Requirements**
The mock implementation must include:
- Multiple providers within the same category (minimum 3 per category)
- Providers across different states and cities
- Providers with multiple active listings
- Categories with meaningful descriptions and profession aliases
- Realistic provider profiles with varied offerings

**Distinguishing Provider Search from Listing Search**
The Explore page must clearly distinguish between:
- Listing results (individual products and services)
- Provider results (providers who offer a category of service)
- Use tabs, separate sections, or result type labels to avoid confusion

## 6. Data Contracts and TypeScript Models

Define shared frontend interfaces for the API response shapes.

Illustrative types:

```ts
export type ListingType = "PRODUCT" | "SERVICE";

export type ListingStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED";

export type PricingType =
  | "FIXED"
  | "STARTING_FROM"
  | "NEGOTIABLE"
  | "CONTACT_FOR_PRICE";

export type ServiceMode =
  | "REMOTE"
  | "IN_PERSON"
  | "BOTH";

export interface ListingPhoto {
  id: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  aliases?: string[];
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  state: string;
  city: string;
  profileImage?: string;
  categories: string[];
  churchAffiliation?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  category: {
    id: string;
    name: string;
  };
  state: string;
  city: string;
  pricingType: PricingType;
  price?: number | null;
  currency: "NGN";
  photos: ListingPhoto[];
  provider: {
    id: string;
    name: string;
    profileImageUrl?: string | null;
  };
  serviceMode?: ServiceMode | null;
  serviceAreas?: Array<{
    state: string;
    city?: string | null;
  }>;
}
```

These types are illustrative, not a replacement for the actual API contract. Update field names and nullability to match backend responses.

Never assume a missing field is an empty string or a valid zero. Handle absent and null values deliberately.

## 7. State Management

### Server state

Use TanStack Query for:
- Listings and search results.
- Listing details.
- Public provider profiles.
- Provider search and category-based discovery.
- Provider active offerings.
- Current user and provider profile.
- Provider dashboard data.
- Categories and suggestion status.
- Phone-change request status.

Use query invalidation after successful mutations so affected views refresh correctly.

### Local UI state

Use React state for:
- Open menus and dialogs.
- Selected images and upload progress.
- Temporary filters before submission, if needed.
- Form interaction state.
- Gallery selection.

### Authentication state

Load the current session from the backend when the application starts.

Represent the user as:
- Loading.
- Authenticated.
- Unauthenticated.
- Session lookup failed.

Do not treat a failed session lookup as proof that a user is authenticated.

## 8. Search, Filtering, and Pagination

The frontend must support:

**Listing Search**
- Search text.
- All, Products, and Services.
- State.
- Optional city.
- Newest-first sorting.

**Provider Search**
- Search by provider name, description, category, or profession.
- Filter by category slug.
- Filter by state and city.
- Category alias matching (e.g., "fashion designer" matches Fashion Design category)

Use URL search parameters for shareable discovery state where practical.

Example:

```text
/explore?type=SERVICE&state=Plateau&city=Jos&q=tailoring
```

The backend remains responsible for authoritative search, filtering, and result ordering.

If pagination is supported by the API, use server-driven pagination or infinite loading. Do not fetch the entire marketplace into browser memory just to filter it locally.

The UI must distinguish between:
- No listings exist.
- No listings match the filters.
- A request is still loading.
- The API request failed.

## 9. Forms and Validation

Use React Hook Form with Zod for client-side form validation.

Client-side validation must provide quick feedback but cannot replace backend validation.

### Provider profile form
Validate required fields, contact number formats, location, category selection, and image constraints.

### Listing form
Validate:
- Required title and description.
- Listing type.
- Category.
- State and city.
- Pricing option.
- Price when required by the selected pricing option.
- Service mode and service areas for services.
- Maximum of five photos.

The frontend should adapt the form fields to the selected listing type and pricing option.

### Server errors
Map server validation errors to relevant fields where possible. Display general errors when the backend returns an error that cannot be associated with a single field.

## 10. Cloudinary Image Upload Architecture

### Selected approach

Use **signed direct uploads from the browser to Cloudinary**.

Multer is not required in this upload flow because the image binary does not pass through Express.js.

### Upload sequence

1. The user selects an image.
2. The frontend checks basic file type and size constraints.
3. The frontend requests upload authorisation from the Express API.
4. The backend verifies the authenticated user, provider ownership, listing permissions, and relevant image limits.
5. The backend returns a short-lived upload signature and the permitted upload parameters.
6. The frontend uploads the file directly to Cloudinary.
7. Cloudinary returns the upload result.
8. The frontend submits the result or permitted identifier to the backend.
9. The backend verifies the Cloudinary resource and ownership context before saving its metadata through Prisma.
10. The frontend displays the saved image.

### Image security requirements

- Never expose `CLOUDINARY_API_SECRET` to the browser.
- The browser must not choose arbitrary public IDs or trusted folder paths.
- Signatures must be generated by the backend.
- The backend must enforce permitted resource types, folder paths, and upload limits.
- The backend must not blindly trust the returned URL or public ID supplied by the client.
- Verify uploaded resources against Cloudinary using a trusted server-side mechanism.
- Ensure only the listing or provider owner can add or remove images.
- Validate file size and image format on the server-controlled upload flow.
- Handle abandoned uploads and database-save failures through cleanup or reconciliation.
- Do not permit a client to associate an image belonging to another provider with its own listing.

### Cloudinary environment variables

Backend only:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The frontend may use a public cloud name only if required by the upload integration. No private Cloudinary secret may use a `VITE_` prefix.

### Image constraints

- Provider profile: one current profile image or logo.
- Listing: maximum five photos.
- Accepted formats: define and enforce an agreed allowlist, such as JPEG, PNG, and WebP.
- Maximum file size: configure a shared limit between frontend and backend before implementation.
- Use Cloudinary transformations for responsive, optimised delivery.

### Image deletion

When a provider removes a saved image:
1. The frontend requests deletion through the API.
2. The backend checks ownership.
3. The backend removes the Cloudinary resource.
4. The backend updates or deletes the corresponding database record consistently.

The frontend must not call Cloudinary's authenticated deletion API directly.

## 11. Authentication and Frontend Security

### Session handling

The frontend should use the agreed server-side session architecture with secure cookies.

- Do not store session secrets in localStorage or sessionStorage.
- Use HTTPS in production.
- Support HttpOnly, Secure, and appropriate SameSite cookie settings.
- Ensure the backend rotates the session on login.
- Ensure logout revokes the server-side session.
- Follow the backend's CSRF protection strategy for state-changing requests.
- Do not assume that hiding a page or button protects an API resource.

### Google sign-in

Use the backend-defined Google OAuth/OpenID Connect flow.

The backend must validate identity tokens, issuer, audience, expiry, and relevant authentication state. The frontend must not treat an unverified client-side Google profile as an authenticated Kingdom Market session.

### Contact details

The frontend must request protected contact details only when the user attempts to view them and is authenticated.

Do not embed private provider phone numbers or WhatsApp numbers in public listing payloads, HTML, page metadata, or client-side constants.

### Other security requirements

- Avoid rendering untrusted listing descriptions as raw HTML.
- Validate external URLs before making them clickable.
- Do not place secrets in frontend environment variables.
- Avoid exposing sensitive API responses in logs.
- Keep dependencies updated.
- Use a restrictive Content Security Policy compatible with the application and Cloudinary.
- Ensure backend CORS and cookie settings match the deployed frontend origin.

## 12. Error Handling

The UI must support:
- Network failures.
- API validation errors.
- Unauthenticated responses.
- Forbidden responses.
- Not-found responses.
- Rate limits.
- Server errors.
- Cloudinary upload failures.
- Failed database registration after an upload.
- Active-listing limit errors.
- Session expiry.

Provide clear recovery actions where possible, such as retrying an upload, signing in again, or removing an image.

Do not show raw stack traces or database errors to users.

## 13. UI Component Requirements

Build reusable components such as:

- `AppHeader`
- `MobileNavigation`
- `AppFooter`
- `SearchBar`
- `SearchTabs` (for distinguishing provider vs listing results)
- `ListingCard`
- `ListingGrid`
- `ListingFilters`
- `CategoryCard`
- `CategorySuggestion`
- `CategoryFilter`
- `PriceDisplay`
- `LocationLabel`
- `ImageGallery`
- `ImageUploader`
- `ProviderCard`
- `ProviderGrid`
- `ProviderContactActions`
- `AuthGuard`
- `FormField`
- `SelectField`
- `FileUploadProgress`
- `ConfirmDialog`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `Toast` or equivalent notification component

Keep reusable components presentational where practical. Business rules and API interactions should live in feature hooks or service modules.

## 14. Performance Requirements

- Use production code splitting and lazy loading for suitable routes.
- Optimise listing images through Cloudinary transformations.
- Use responsive image dimensions and appropriate loading behaviour.
- Lazy-load below-the-fold images.
- Avoid unnecessary repeated API calls.
- Use query caching and invalidation appropriately.
- Avoid loading the entire provider dashboard or listing history on public pages.
- Prevent layout shifts by reserving image space.
- Test the experience on slower mobile connections.

## 15. Accessibility Requirements

- Use semantic landmarks and heading hierarchy.
- Ensure all interactive elements work with a keyboard.
- Use labels and helpful error messages on forms.
- Make dialogs accessible and manage focus correctly.
- Use sufficient contrast and visible focus states.
- Provide alt text for meaningful images.
- Respect reduced-motion preferences.
- Ensure upload progress and form feedback can be announced to assistive technologies.

## 16. Testing Strategy

### Unit tests
Test:
- Pricing display rules.
- Form validation.
- Listing-limit messaging.
- Filter parameter generation.
- Image constraint helpers.
- API error normalisation.

### Component tests
Test:
- Authentication-dependent contact actions.
- Listing cards and details.
- Listing creation forms.
- Provider onboarding.
- Upload progress and error states.
- Dashboard listing actions.

### Integration tests
Test:
- API client and cookie configuration.
- Login/logout session transitions.
- Search and filter requests.
- Listing mutations and query invalidation.
- Cloudinary upload registration flow.
- Phone-change status display.

### End-to-end tests
Test:
1. A guest browses listings.
2. A guest is prompted to sign in to view contact details.
3. A user registers or signs in.
4. A user becomes a provider.
5. A provider creates a listing and uploads photos.
6. A provider edits, deactivates, and reactivates a listing.
7. The frontend handles the active-listing cap.
8. A provider submits a phone-change request.
9. A signed-in user suggests a category.
10. A provider cannot manage another provider's listing.

Run automated tests in CI before production deployment.

## 17. Development and Environment Configuration

Required frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Do not add database connection strings, session secrets, Google client secrets, or the Cloudinary API secret to the frontend environment.

Use separate configuration for local development, testing, staging, and production.

## 18. Deployment Requirements

The frontend must:
- Build using the production Vite build command.
- Deploy to a static hosting platform or suitable web host.
- Support SPA route fallback so direct navigation to nested routes works.
- Use HTTPS in production.
- Connect only to the configured production API.
- Use environment-specific API URLs.
- Work with backend CORS and cookie configuration.
- Avoid exposing private environment variables in the generated bundle.

Before release, verify:
- All production routes load directly.
- Google sign-in works on the deployed domain.
- Session cookies behave correctly.
- Cloudinary uploads work under the production security policy.
- Images load efficiently on mobile.
- Error reporting does not disclose sensitive data.

## 19. Implementation Phases

### Phase 1 — Foundation
- Create React and TypeScript project.
- Configure Vite and Tailwind CSS v4.
- Add routing and shared layout.
- Establish API client and query client.
- Define design tokens and reusable UI components.

### Phase 2 — Public Marketplace
- Build homepage with category discovery section.
- Build listing cards and discovery page.
- Implement provider search and category suggestions.
- Build category results page with provider cards and location filters.
- Build provider profile pages with active offerings.
- Implement search and filters for listings.
- Build listing details.
- Add loading, empty, and error states.

### Phase 3 — Authentication
- Build registration and login.
- Integrate Google sign-in.
- Implement session lookup and logout.
- Add protected navigation and contact access.

### Phase 4 — Provider Features
- Build provider onboarding.
- Build profile editing.
- Build provider dashboard.
- Build product and service listing forms.
- Add listing lifecycle actions.

### Phase 5 — Cloudinary
- Integrate signed direct uploads.
- Display image previews and progress.
- Register images through the API.
- Support image deletion and cleanup errors.
- Enforce upload limits in the interface and handle backend rejection.

### Phase 6 — Completion and Release
- Add category suggestions and phone-change request status.
- Run responsive and accessibility checks.
- Complete automated tests.
- Verify security and production configuration.
- Deploy and test the production application.

## 20. Definition of Done

A frontend feature is complete when:
- It meets its agreed product requirements.
- It integrates with the documented backend contract.
- It has loading, empty, success, and error states where relevant.
- It is responsive and keyboard accessible.
- It validates user input without relying on client validation for security.
- It passes the relevant automated tests.
- It does not expose secrets or protected data.
- It has been reviewed on desktop and mobile.
- Any required API dependencies and deployment settings are documented.

## 21. Open Technical Decisions

Confirm these before implementation is considered final:

1. Exact API routes, request payloads, and response schemas.
2. Frontend and backend deployment domains.
3. Cookie and CSRF strategy for the production deployment.
4. Google OAuth redirect and callback flow.
5. Maximum image file size and final accepted formats.
6. Whether pagination uses numbered pages or infinite loading.
7. Final visual identity, logos, typography, and colour tokens.
8. Approved privacy policy, terms, and support details.
9. Whether listing descriptions support plain text only or a limited formatting model.
10. Whether provider profile image changes require the same review process as phone-number changes.

**End of document.**