# Fairways Pocket Coach — Expo mobile

This is the **mobile** app. The original root-level App.tsx and index.css are the existing **web design prototype** and are intentionally preserved.

The mobile UI ports the dark Fairways styling from that prototype (background #0b0d0f, accent #63d471, five-tab layout). No Figma design-file ID was available, so this is based on the actual checked-in web UI rather than a pixel-verified Figma handoff.

## Windows / Expo Go (SDK 58)

Install the Node.js LTS release. Open Command Prompt in a Git checkout:

    git clone https://github.com/Zdogplayz/Pocket-Coach.git
    cd Pocket-Coach
    git checkout feature/fairways-expo-mobile
    cd mobile
    npm install
    npx expo install --fix
    npx expo-doctor@latest
    npx expo start --clear

If this branch has been merged to main, use 'git pull' instead of 'git checkout feature/fairways-expo-mobile'.
Scan the QR in Expo Go, and **verify the terminal says its project root is Pocket-Coach/mobile**. Seeing “Welcome to Expo” means you launched a different Expo starter directory; this app shows “FAIRWAYS” and either an onboarding form or the home dashboard.

## Features

- Local onboarding, player identity, handicap and experience.
- Fairways-themed Home, Swing, Stats, Practice, Profile navigation.
- Configurable club bag with stable IDs; removing a club preserves historical swing references.
- 9/18 hole manual scorecards with par-relative statistics calculated from recorded holes.
- Camera or library swing-video capture stored in the app documents directory.
- Local AsyncStorage persistence and in-app erase controls.

**Limitations:** No account/authentication, cloud backup, biomechanical analysis, AI feedback, GPS, or purchases yet. Practice tips are general examples. This repository's original web prototype includes fictional swing ratings; the mobile implementation intentionally does not present them as real analysis.

Expo Go supports the chosen JavaScript and Expo APIs, but full native-device testing is still needed. If SDK 58 resolves incompatible versions, run 'npx expo install --fix' as above.

## Repository structure

- Repo root: Fairways React web prototype (existing)
- mobile/: Expo SDK 58 native mobile app (this branch)

For the exact design-to-code pass, supply a Figma /design/... URL with a selected node. The connected Figma integration can then extract screenshots and design tokens.
