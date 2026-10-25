# Kingdom Market — UI Replication Instructions

You are the frontend implementation engineer for Kingdom Market.

Your task is to reproduce the UI shown in the supplied design-reference images as accurately as possible using the existing project stack.

## 1. Source of truth

The supplied UI screenshots are the primary visual specification.

Treat them as the source of truth for:
- Page layout and section order.
- Element positioning and alignment.
- Widths, heights, spacing, and padding.
- Typography, font sizes, weights, and line heights.
- Colours, backgrounds, borders, and shadows.
- Border radii.
- Image dimensions, crops, and aspect ratios.
- Navigation, buttons, forms, cards, and other interface elements.
- Responsive behaviour, where mobile references are supplied.

Do not redesign, reinterpret, modernise, simplify, or replace the supplied design with your own preferred design.

Do not invent new sections or decorative elements that are absent from the references.

If a detail cannot be determined from an image, make the smallest reasonable assumption and keep it consistent with the rest of the design.

## 2. Inspect before coding

Before implementing anything:

1. Inspect the existing project structure, package.json, installed dependencies, and current implementation.
2. Inspect every supplied design-reference image.
3. Identify the pages, reusable components, layout patterns, spacing rules, typography, colours, and image treatments.
4. Identify any missing information or conflicting references.
5. Create a short implementation plan.
6. Establish reusable design tokens based on the references.

Do not replace the existing application structure or dependencies without a clear technical reason.

## 3. Visual fidelity

Prioritise visual accuracy over personal design preferences.

Match the reference images closely at the same viewport dimensions whenever those dimensions are known.

Pay particular attention to:
- The overall page width and alignment.
- Header height and navigation spacing.
- The vertical position of the hero and other major sections.
- Text wrapping and content widths.
- Card dimensions and grid gaps.
- Image aspect ratios and object positioning.
- Button sizes and placement.
- Section spacing and page length.
- Typography hierarchy.
- The amount of whitespace.

Avoid arbitrary spacing values when a shared token or reusable layout rule can reproduce the design more consistently.

Do not substitute unrelated stock imagery for supplied assets.

## 4. Asset handling

Inspect the available project assets before creating replacements.

Use the exact supplied logos, illustrations, icons, and images wherever applicable.

If a required asset is missing, identify it instead of silently substituting an unrelated asset.

For marketplace listing images, use the agreed image-loading and Cloudinary integration strategy. Do not expose private Cloudinary credentials in frontend code.

## 5. Implementation requirements

Use the existing project stack. Where applicable, use React, TypeScript, Vite, and Tailwind CSS v4.

Build reusable components for repeated interface elements without changing their visual appearance.

Keep the implementation organised and maintainable.

Use real semantic HTML, accessible form labels, keyboard-accessible controls, and visible focus states. Accessibility improvements must preserve the intended visual design.

Do not use a single screenshot as a full-page background, and do not create a static image masquerading as an interactive website. Implement the actual interface in code.

## 6. Functional behaviour

The UI must remain consistent with the Kingdom Market product requirements.

Implement the intended interactions for navigation, search, filters, authentication, listing cards, provider actions, forms, and listing management where applicable.

Do not invent functionality that is outside the agreed MVP.

Do not use fake buttons or decorative controls that appear interactive but do nothing.

Where an API is not ready, isolate the integration behind a clearly defined service layer and use temporary development fixtures only when necessary. Do not present fixture data as production data.

## 7. Responsive behaviour

Use the supplied mobile references as authoritative specifications for mobile layouts.

Where mobile references are unavailable, adapt the desktop design carefully to smaller screens without changing the overall visual identity.

Prevent horizontal overflow and ensure that navigation, forms, cards, and actions remain usable on touch devices.

## 8. Visual verification is mandatory

After implementation:

1. Start the application.
2. Open each implemented page in a browser.
3. Use the same viewport dimensions as the corresponding reference image.
4. Capture screenshots of the rendered application.
5. Compare the screenshots against the original references.
6. Identify visible differences in spacing, alignment, typography, colours, image crops, dimensions, and section positioning.
7. Fix the largest discrepancies first.
8. Repeat the comparison until the result is as close to the reference as practical.

Do not declare a page complete simply because it renders without errors.

If browser automation or screenshot comparison is unavailable, state that limitation clearly instead of claiming visual verification was completed.

## 9. Working procedure

Implement one page at a time.

For each page:
- Identify the reference image.
- Implement the page.
- Run the application.
- Compare the rendered output with the reference.
- Correct visual differences.
- Check responsiveness.
- Verify interactions.
- Report completion and any remaining differences.

Start by analysing all the reference images and the existing project. Then present the implementation plan before making major structural changes.

The final goal is a functioning Kingdom Market frontend that closely reproduces the supplied designs, not a new design inspired by them.