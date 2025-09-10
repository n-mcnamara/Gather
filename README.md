# Gather - A Nostr-based Social Gathering App

Gather is a community-first social app that makes it easy to discover, create, and join events in real time. Unlike traditional event platforms, Gather captures the fluid, word-of-mouth nature of how people actually make plans—whether that’s a casual coffee meetup, a last-minute study group, or a local neighborhood gathering.

This project is an open-source implementation of the Gather concept on the decentralized Nostr protocol.

## ⭐ Core Features (Current State)

*   **Map-First UX:** A live, spatial map is the primary interface. Events are displayed as markers on the map, centered on the user's location.
*   **Event Creation:** Users can click anywhere on the map to create a new event. Events can be "Live Now" (lasting 2 hours) or scheduled for a future time (up to 6 hours long).
*   **Event Discovery:** The map displays events from the Nostr network. Users can filter between "Live Now" and "Upcoming" events.
*   **Social Interaction:**
    *   **RSVPs:** Users can attend and un-attend events.
    *   **Attendee Profiles:** The app displays the profiles of users attending an event, including a "Creator" badge.
    *   **Event Chat:** Each event has a dedicated, real-time chat for attendees.
*   **Communities:**
    *   Users can create and join public communities.
    *   Events can be created for specific communities.
    *   The map can be filtered to show only public events or events from the user's joined communities.
*   **Moderation:** Community creators can assign moderators and kick users from communities. Kicked users' content (events and chat messages) is filtered from the community view.
*   **Live Proximity:** A privacy-preserving "check-in" feature allows users to signal their physical presence at an event, providing a real-time count of who is currently there.

## 🚀 Getting Started

### Prerequisites

*   Node.js and npm
*   A modern web browser with a NIP-07 compatible Nostr extension (e.g., Alby, Nos2x).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
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

*   **Events:** NIP-52 (`kind:31923`) for time-based events.
*   **Communities:** `kind:30023` with a `["d", "gather-community"]` tag.
*   **RSVPs:** `kind:31925`.
*   **Community Membership:** `kind:10002` (List) events.
*   **Moderation:** `kind:30024` events.
*   **Proximity Pings:** Ephemeral `kind:40001` events signed with a temporary key.