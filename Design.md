---
name: Enterprise Workforce System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#001624'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c42'
  on-tertiary-container: '#0099d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-number:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers an operational command center for enterprise workforce scheduling, time tracking, and attendance compliance. The target audience comprises operations directors, HR administrators, line managers, and deskless or office employees who require instantaneous status clarity and zero friction during shifts.

The aesthetic blends **Modern Corporate** structure with **Precision Data Utility**:
- **Tone & Mood:** Authoritative, calm, impeccably organized, and audit-ready.
- **Visual Discipline:** Uncluttered slate canvasses, pure white metric containers, hairline architectural dividing lines, and decisive semantic signalling that eliminates ambiguity.
- **Interaction Ethos:** High scanability over decoration; dense yet legible information hierarchies tailored for high-volume shift management, real-time geofence confirmations, and rapid approvals.

## Colors

The palette balances administrative neutrality with strict semantic discipline:

- **Core System Values:**
  - `Primary / Navy Dark`: `#1E293B` (Anchors navigation sidebars, dominant headers, high-emphasis typography, and primary executive actions).
  - `Secondary / Cobalt Blue`: `#3B82F6` (Interactive links, active navigation items, active selection rings, and high-priority primary buttons).
  - `Tertiary / Sky Blue`: `#0EA5E9` (Telemetry states, geofence radius markers, active webcam verification flags, and live monitoring pings).
  - `Neutral / Slate Slate`: `#64748B` (Secondary text, table column headers, and structural icon elements).

- **Surfaces & Borders:**
  - `Canvas Background`: `#F8FAFC`
  - `Subtle Background / Table Zebra / Wells`: `#F1F5F9`
  - `Card / Modal / Surface`: `#FFFFFF`
  - `Border Subtle`: `#E2E8F0`
  - `Border Strong`: `#CBD5E1`

- **Operational Status Indicators (Functional Semantics):**
  - **Success / Valid / Punch In:** Emerald (`#10B981`) text/accents with `#ECFDF5` background tints.
  - **Warning / Pending / Overtime Request:** Amber (`#F59E0B`) text/accents with `#FFFBEB` background tints.
  - **Destructive / Invalid / Punch Out / Alert:** Rose (`#EF4444`) text/accents with `#FEF2F2` background tints.
  - **Informational / Geolocation:** Sky (`#0EA5E9`) text/accents with `#F0F9FF` background tints.

## Typography

Typography relies entirely on **Inter** to maximize screen legibility, tabular figure alignment, and crisp rendering across density scales.

- **Tabular Figures:** Always apply OpenType tabular numerals (`font-feature-settings: "tnum" 1`) across times, durations, dates, GPS coordinates, and metric KPIs to eliminate horizontal jitter when values refresh.
- **Hierarchy Rules:**
  - `Display` & `Headline-LG`: Reserved for top-level operational rollups and dashboard greetings.
  - `Headline-MD` & `Headline-SM`: Primary table card titles, sheet headers, and modal group headers.
  - `Body-MD` & `Body-SM`: Base data display, user table cells, employee meta info, and system logs.
  - `Label-MD` & `Label-SM`: All caps or title-cased status pills, table column headers, and role tags (`font-weight: 600`).

## Layout & Spacing

The layout operates on a standard 8pt spatial grid (with 4pt micro-steps for compact data cells).

- **Grid & Breakpoints:**
  - **Desktop (≥1280px):** 12-column layout with 240px fixed left navigation, `1.5rem` (`gutter-lg`) gutters, and `2rem` (`margin-lg`) canvas padding.
  - **Tablet (768px - 1279px):** Collapsible 64px icon-only navigation, fluid grid with `1rem` (`gutter`) gutters, and `1.5rem` (`margin-md`) margins.
  - **Mobile (<768px):** Single column stacked flow, bottom navigation or sheet drawer, `1rem` (`margin`) outer edge margin, and horizontal scrolling for dense data tables.

- **Layout Density:**
  - Attendance dashboards utilize tight component padding (`space-xs` and `space-sm`) inside tables and audit logs to maximize above-the-fold telemetry, shifting to `space-lg` and `space-xl` for container padding and separation of high-level overview cards.

## Elevation & Depth

This design system favors clean, low-elevation structures to support high-density utility:

- **Level 0 (Base Canvas):** `#F8FAFC`. Completely flat.
- **Level 1 (Card & Dashboard Panels):** `#FFFFFF` surface bounded by a continuous 1px `#E2E8F0` border. Ambient shadow is ultra-subtle: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover States, Popovers, Dropdowns):** `#FFFFFF` surface with `#E2E8F0` border and elevated shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Overtime Sign-off Drawers):** `#FFFFFF` surface with deep ambient attenuation: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. Backdrops use `#0F172A` with 40% opacity.
- **Elevation through Tint:** Subtle nested modules (e.g., employee audit log entries, shift calculation callouts) use a `#F1F5F9` background fill without borders rather than adding stacking height.

## Shapes

The design system employs a **Soft** shape language (`roundedness: 1`):

- **Micro Components (0.25rem / 4px):** Form inputs, checkboxes, status chips, breadcrumb tags, and inline badges.
- **Standard Containers (0.5rem / 8px):** Cards, modal windows, table container panels, and dropdown menus (`rounded-lg`).
- **Surface Overlays (0.75rem / 12px):** Slide-out sheets, top summary banners (`rounded-xl`).
- **Exceptions:**
  - Round badges (e.g., camera recording indicators, online status dots) and user profile avatars use fully circular borders (`rounded-full` / 9999px).
  - Role indicator chips maintain a controlled 4px radius rather than a pill form to reinforce enterprise authority.

## Components

### Buttons
- **Primary:** `#1E293B` background, `#FFFFFF` text, 4px corner radius, bold font. Hover transforms to `#334155`. Focus displays a 2px `#3B82F6` ring with a 2px offset.
- **Secondary / Action:** `#FFFFFF` background with 1px border `#E2E8F0`, `#1E293B` text. Hover transitions to `#F8FAFC` and border `#CBD5E1`.
- **Destructive:** `#EF4444` background with `#FFFFFF` text, transitioning to `#DC2626` on hover.
- **Punch Action Buttons (Special):**
  - **Punch In:** `#10B981` background, `#FFFFFF` text, enhanced click target (`h-12` minimum), subtle icon prefix.
  - **Punch Out:** `#EF4444` background, `#FFFFFF` text, matching dimensions.

### Status Badges & Chips
Composed of a 4px rounded corner box, `11px` uppercase tracking font, paired with an optional 6px filled status circle:
- **Completed / Valid:** `#ECFDF5` background, `#065F46` text, `#10B981` indicator dot.
- **Pending / Pending OT:** `#FFFBEB` background, `#92400E` text, `#F59E0B` indicator dot.
- **Rejected / Invalid / Absent:** `#FEF2F2` background, `#991B1B` text, `#EF4444` indicator dot.
- **Telemetry Active (GPS / Photo Validated):** `#F0F9FF` background, `#075985` text, `#0EA5E9` pulse dot.

### Role Indicators
- **Admin:** Deep Indigo badge (`#1E293B` background, `#FFFFFF` text, font size `11px`, weight `600`).
- **Manager:** Cobalt Blue subtle (`#EFF6FF` background, `#1D4ED8` border/text).
- **Employee:** Slate subtle (`#F1F5F9` background, `#475569` text).

### Data Tables
- **Header:** Sticky `#F8FAFC` background, `12px` uppercase text `#64748B`, bottom 1px border `#E2E8F0`.
- **Row:** Baseline height `48px`, background `#FFFFFF`, bottom border 1px `#F1F5F9`. Hover state switches to `#F8FAFC`.
- **Selected Row:** Accent wash `#EFF6FF` with a 2px vertical indicator bar in `#3B82F6` on the leading cell edge.
- **Alignment:** Aligns text columns left, numeric/time/status columns right or centered.

### Form Inputs & Checkboxes
- **Input Fields:** `#FFFFFF` background, `#E2E8F0` border, 4px radius, `14px` text (`#1E293B`). Placeholder `#94A3B8`. Active focus rings shift border to `#3B82F6` with an outer halo of `0 0 0 3px rgba(59, 130, 246, 0.15)`.
- **Checkboxes:** Custom 16x16px boxes with `#E2E8F0` border; when checked, filled with `#3B82F6` exhibiting a white checkmark.

### Dashboard Metric Cards
- White `#FFFFFF` card with 1px `#E2E8F0` border, `1rem` padding, containing:
  - Header with muted uppercase metric title (`#64748B`, `12px`).
  - Large tabular number (`#1E293B`, `28px`, `font-weight: 700`).
  - Footer with delta badge indicating percentage increase/decrease in attendance adherence.