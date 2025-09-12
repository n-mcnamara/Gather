# Gather - A Nostr-based Social Gathering App

Gather is a community-first social app that makes it easy to discover, create, and join events in real time. Unlike traditional event platforms, Gather captures the fluid, word-of-mouth nature of how people actually make plans—whether that’s a casual coffee meetup, a last-minute study group, or a local neighborhood gathering.

This project is an open-source implementation of the Gather concept on the decentralized Nostr protocol, optimized for both desktop and mobile web.

## ⭐ Core Features

*   **Map-First UX:** A live, spatial map is the primary interface. Events are displayed as markers on the map, centered on the user's location.
*   **Multi-Platform Login:** Flexible and secure login options:
    *   **Desktop:** NIP-07 browser extensions (Alby, Nos2x, etc.).
    *   **Mobile:** NIP-46 Nostr Connect for mobile signing apps (e.g., Amethyst, Damus).
    *   Direct login with an `nsec` private key (with security warnings).
*   **Geo-Relay System for Enhanced Discovery:**
    *   **Dynamic Publishing:** Events are published to the user's default relays *and* the relay geographically closest to the event's location.
    *   **Dynamic Subscriptions:** As the user pans the map, the app dynamically connects to the closest relays to fetch location-specific events, improving speed and relevance.
*   **Event Creation & Discovery:**
    *   Click anywhere on the map to create a new event.
    *   Filter between "Live Now" and "Upcoming" events.
*   **Communities:**
    *   Create and join public communities.
    *   Create events for specific communities.
    *   Filter the map to show only public events or events from your joined communities.
*   **Social Interaction:**
    *   **RSVPs:** Attend and un-attend events.
    *   **Attendee Profiles:** View the profiles of users attending an event.
    *   **Event Chat:** Each event has a dedicated, real-time chat for attendees.
*   **Live Proximity:** A privacy-preserving "check-in" feature allows users to signal their physical presence at an event, providing a real-time count of who is currently there.

## 🚀 Getting Started

### Prerequisites

*   Node.js and npm
*   A modern web browser. For logging in, you can use:
    *   A NIP-07 compatible Nostr extension (e.g., Alby).
    *   A mobile Nostr signing app (e.g., Amethyst, Damus).
    *   Your `nsec` private key.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/n-mcnamara/Gather.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd gather-app
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

1.  Start the Vite development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

##  Nostr Implementation Details

*   **Events:** `kind:31923`
*   **Communities:** `kind:30023` with a `["d", "gather-community"]` tag.
*   **RSVPs:** `kind:31925`.
*   **Community Membership:** `kind:10002` (List) events.
*   **Proximity Pings:** Ephemeral `kind:40001` events signed with a temporary key.
