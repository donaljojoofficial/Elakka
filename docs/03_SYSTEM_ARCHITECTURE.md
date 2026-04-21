# System Architecture

## Architecture Type

Offline-first, single-device system

## Layers

* UI: React Native (Expo)
* State: Zustand
* Storage: SQLite
* Security: Secure Store + Biometrics

## Data Flow

User Action → Zustand → SQLite → UI

## Backend

NONE (intentionally avoided)

## Network Dependency

None (except optional backup)
