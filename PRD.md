# Kingdom Market
## Frontend Product Requirements Document (PRD)

**Document:** Frontend PRD  
**Version:** 1.0  
**Status:** MVP specification  
**Product:** Kingdom Market  
**Platform:** Responsive web application  
**Currency:** Nigerian Naira (NGN)

## 1. Product Overview

Kingdom Market is an open marketplace where people can discover products and services, create provider profiles, and publish their own offerings.

Anyone can browse the marketplace without an account. Users must sign in to publish listings, become providers, or access providers’ phone and WhatsApp contact details.

The marketplace supports an optional, self-declared church affiliation. This affiliation is not verified by the platform and must not be presented as verified.

Kingdom Market facilitates discovery. Contact, negotiation, payment, and fulfilment happen outside the platform.

## 2. Product Goals

The frontend must:

1. Make it easy to discover products and services.
2. Help visitors understand what Kingdom Market offers.
3. Allow users to register, sign in, and become providers.
4. Make publishing and managing listings straightforward.
5. Protect provider contact details from unauthenticated visitors.
6. Provide a responsive, accessible experience across mobile, tablet, and desktop.
7. Make image uploads reliable through Cloudinary.
8. Keep the interface simple enough for users with varying levels of technical experience.

## 3. Target Users

### 3.1 Visitors
People browsing the marketplace without an account.

They can:
- View the homepage.
- Search and filter offerings.
- Browse products and services.
- View listing details and public provider profiles.
- See provider locations and listing prices where applicable.
- See a sign-in prompt when attempting to access restricted contact information.

### 3.2 Registered Customers
Users with an account who want to discover offerings and contact providers.

They can:
- Do everything visitors can do.
- View provider phone and WhatsApp details.
- Become a provider through onboarding.

### 3.3 Providers
Registered users who publish and manage offerings.

They can:
- Create and edit a provider profile.
- Publish products and services.
- Upload listing images.
- Manage up to 10 active listings combined.
- Activate, deactivate, archive, and restore eligible listings.
- Edit their public business information.
- Submit phone-number change requests for manual review.
- Suggest new categories for review.

A single account can act as both a customer and a provider.

## 4. Information Architecture

### Primary navigation

- Home
- Explore
- Products
- Services
- Become a Provider / My Dashboard
- Sign In or Account Menu

The navigation must adapt to the user's authentication and provider status.

### Footer

Include:
- About Kingdom Market
- How It Works
- Contact or Support information, if supplied
- Privacy Policy
- Terms of Use

Legal and support pages must use approved content. Do not invent contact details or legal claims.

## 5. Required Pages

### 5.1 Homepage

The homepage must include:

- A clear hero section explaining the marketplace.
- A prominent search field.
- Primary actions to explore products and services.
- A category discovery section with links to category provider discovery pages.
- A recently added offerings section.
- A rotating “Popular Offerings” section.
- A clear call to action for people who want to sell or offer services.
- A footer with essential links.

“Popular Offerings” is an editorial or rotating collection in the MVP. It must not imply measured popularity, sales, ratings, or verified performance.

### 5.2 Explore Marketplace

Display products and services together by default.

Required controls:
- Search input.
- All, Products, and Services filters.
- State and optional city filters.
- Clear filters action.
- Newest-first sorting.
- Responsive listing grid.
- Loading, empty, and error states.

Search must cover listing title, description, category, and provider/business name.

When a search term matches a category name or its profession aliases, display category suggestions that link to the category's provider discovery page.

Provider search should be distinguishable from listing search results. Use tabs or separate result types (All, Providers, Products and Services) to avoid confusion.

No price filter is required for the MVP.

### 5.2.1 Category Provider Discovery

Each category page (`/categories/:slug`) must display:

- Category name and description.
- Total number of matching providers.
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

Categories should support profession aliases for search matching. For example:
- Category: "Fashion Design"
- Aliases: ["fashion designer", "fashion designers", "tailoring"]
- Search for "fashion designer" → displays Fashion Design category suggestion

### 5.3 Listing Details

Each listing details page must display:

- Listing title.
- Image gallery.
- Description.
- Category.
- Price or pricing information, where applicable.
- Product or service type.
- Provider/business name.
- Provider profile image, where available.
- Primary location.
- Relevant service areas and delivery mode for services.
- A contact action.
- A link to the provider's public profile.

The interface must not invent product delivery, stock availability, guarantees, ratings, reviews, or checkout functionality.

### 5.4 Provider Public Profile

Display:
- Provider/business name.
- Profile image or logo.
- Description.
- State and city.
- Categories offered.
- Public listings.
- Optional, self-declared church affiliation.
- Contact details only to authenticated users.

Do not display church affiliation as verified.

### 5.5 Registration and Sign In

Support:
- Email and password registration.
- Email and password sign-in.
- Google sign-in.
- Logout.
- Clear validation and error messages.
- Navigation back to the originally requested page after successful authentication, where appropriate.

Email verification and password recovery are excluded from this MVP. Do not show non-functional links for these features.

### 5.6 Provider Onboarding

Any authenticated user can select “Become a Provider.”

Collect the required information:

- Provider/business name.
- Profile photo or logo.
- Short description.
- State and city.
- Phone number.
- WhatsApp number.
- At least one predefined category.

Optional:
- Self-declared church affiliation.
- Operating hours.
- Social links.

Onboarding must:
- Validate required fields.
- Support image upload.
- Clearly identify optional fields.
- Explain the purpose of contact details.
- Prevent duplicate provider-profile creation.
- Navigate to the provider dashboard after successful completion.

### 5.7 Provider Dashboard

Display:
- Provider profile summary.
- Active listing count and maximum of 10.
- Listing management actions.
- Phone-change request status, if one exists.
- Category suggestion status where available.
- A clear action to create a listing.

Provide listing views or filters for Active, Inactive, and Archived listings.

### 5.8 Create and Edit Listing

Support both products and services.

Common fields:
- Title.
- Description.
- Category.
- State and city.
- Up to five photos.
- Pricing information where applicable.

Products:
- Use the listing's primary location.
- Do not introduce service-area fields.

Services:
- Primary location.
- Additional service areas where applicable.
- Service mode: Remote, In-person, or Both.

Pricing options:
- Fixed price.
- Starting from.
- Negotiable.
- Contact for price.

The interface must display the appropriate price input based on the selected pricing option.

Rules:
- Maximum 10 active listings per provider across products and services.
- Maximum five images per listing.
- NGN is the only supported currency.
- Providers must choose from predefined categories.
- Providers can submit a category suggestion when their desired category is unavailable.
- The server is authoritative for all limits and validation.

### 5.9 Listing Management

Providers can:
- Edit active and inactive listings.
- Deactivate active listings.
- Reactivate inactive listings.
- Archive listings.
- Restore archived listings where permitted.

Inactive and archived listings must not appear in public marketplace results.

Activating or restoring a listing must respect the active-listing limit. If the limit is reached, explain the issue and guide the provider to deactivate another listing.

### 5.10 Phone Change Requests

Changing a provider's phone number requires manual review.

The frontend must:
- Allow a provider to submit a new number.
- Show that the request is pending.
- Continue displaying the existing approved number until a decision is made.
- Display the decision when the request is approved or rejected.
- Prevent confusing or duplicate pending requests.

The manual review occurs outside the application in the MVP. Do not create an admin dashboard.

### 5.11 Category Suggestions

Signed-in users can submit a suggestion for a missing category.

The frontend must:
- Collect the suggested category name.
- Submit it to the API.
- Confirm submission.
- Display its status when available.

Submitting a suggestion does not immediately create a new marketplace category.

## 6. Authentication and Restricted Actions

Guests may browse public content.

Authentication is required to:
- Access phone and WhatsApp contact information.
- Create or manage a provider profile.
- Publish or manage listings.
- Submit category suggestions.

If a guest selects a restricted action, display a clear sign-in prompt. After sign-in, return them to the relevant listing or action where possible.

Hiding a contact button is not a security boundary. The backend must independently enforce contact-detail access.

## 7. User Experience Requirements

### Responsive design
- Mobile-first layout.
- No horizontal overflow at common screen widths.
- Navigation and forms usable on touch devices.
- Listing cards adapt to available space.
- Image galleries remain usable on mobile.

### Accessibility
- Semantic HTML.
- Keyboard-accessible navigation and dialogs.
- Visible focus indicators.
- Proper labels for form controls.
- Accessible validation and error messages.
- Suitable image alt text.
- Adequate contrast and usable text sizes.

### Feedback
Every major asynchronous action must have:
- Loading feedback.
- Success feedback.
- Error feedback.
- Prevention of accidental duplicate submissions where appropriate.

### Design direction
The visual design should be clean, modern, trustworthy, and marketplace-oriented. Prioritise clarity, whitespace, readable typography, consistent spacing, and clear calls to action over excessive decoration.

## 8. Explicit MVP Exclusions

The frontend must not implement:
- In-app checkout or payment processing.
- Orders or transaction management.
- In-app messaging.
- Ratings or reviews.
- Favourites or wishlists.
- Price filtering.
- An admin dashboard.
- Account self-deletion or deactivation.
- Email verification.
- Password recovery.
- Automated verification of church affiliation.
- Verified-provider badges.
- Analytics-driven popularity claims.
- Inventory management unless added to a future scope.

## 9. Acceptance Criteria

The frontend is ready for MVP release when:

1. Guests can browse and search public listings.
2. All, Products, and Services filters work correctly.
3. State and city filtering works as supported by the API.
4. Listing detail pages display the correct listing and provider data.
5. Guests cannot retrieve protected contact information through the frontend.
6. Signed-in users can access provider contact details.
7. Registration, login, Google sign-in, and logout work with the backend.
8. Users can complete provider onboarding.
9. Providers can create and edit products and services.
10. Cloudinary uploads support a maximum of five images per listing.
11. The UI enforces the active-listing limit while handling server-side rejection correctly.
12. Listing activation, deactivation, archiving, and restoration work as permitted.
13. Phone changes display the correct pending and final statuses.
14. Category suggestions can be submitted.
15. Loading, empty, validation, network, and server-error states are handled.
16. The application works on mobile, tablet, and desktop.
17. No critical accessibility, security, or functionality defects remain.

## 10. Product Dependencies

The frontend depends on:
- An operational Express.js API.
- Defined authentication and session behaviour.
- API endpoints and response schemas.
- Predefined categories.
- Cloudinary configuration and signed-upload endpoints.
- Approved branding and visual assets.
- Privacy policy and terms content before public release.

## 11. MVP Success Measures

Potential product-level measures include:
- Number of users who complete registration.
- Number of users who complete provider onboarding.
- Number of active listings published.
- Search-to-listing-detail engagement.
- Number of authenticated contact-detail requests.
- Listing creation completion rate.
- Image upload failure rate.

These measures may require backend analytics or event tracking. They are not a requirement to build a dedicated analytics dashboard in the MVP.
