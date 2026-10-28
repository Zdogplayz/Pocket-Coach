# Fairways Pocket Coach — Expo mobile

This is the **mobile** app. The original root-level App.tsx and index.css are the existing **web design prototype** and are intentionally preserved.

The mobile UI is adapted from the connected Figma Make project: https://www.figma.com/make/dCBmeO7y9T6FnEEWZf0dAH/Design-Fairways-Mobile-App . The Figma Make export is a React/Vite web app, not React Native; this folder ports the same design language (background #0b0d0f, accent #63d471, dark green cards, Fairways logo, coach module and five-tab layout) to Expo. The photo hero references the same Unsplash image as the Make source and requires internet access. This is an incremental implementation, not yet an exact pixel-for-pixel clone of every Make screen.

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

The Figma Make source contains a demo with fictional swing/AI scores. The native app intentionally omits those sample measurements and keeps the underlying Phase 1 data model truthful. Next steps: finish design QA on an iPhone, add account/auth model, and build validated swing pose measurement before coaching outcomes.
