# Implementation Plan for Rogue3D Game

This document outlines a step-by-step process for developing the Rogue3D game, a multiplayer co-op defense game with cyclical Peace and Invasion phases. The plan emphasizes clear layers of abstraction, modular code organization, and adherence to best coding practices to ensure a robust, maintainable, and scalable codebase.

## Phase 1: Project Setup and Foundation

1. **Project Initialization**:
   - Set up the Rogue3D game engine environment with the project structure mirroring Unity's `Assets/` folder organization (`Scenes/`, `Scripts/`, `Models/`, `Textures/`, `Components/`).
   - Create root-level files like `index.html` for web deployment and optional `css/` or `js/` folders if needed.
   - Initialize version control (Git) with a `.gitignore` for Rogue Engine-specific build artifacts.

2. **Technology Stack Integration**:
   - Integrate Colyseus (Node.js) for networking. Create a `Networking/` folder for all related scripts.
   - Set up a database (type TBD) for persistence, with schema design in a `Database/` folder.
   - Establish LLM API connectivity (local/outsourced) with fallback logic, managed in an `LLMInterface/` folder.
   - Choose hosting on DigitalOcean, documenting deployment scripts in a `Deployment/` folder.

3. **Core Architectural Principles**:
   - Enforce server authority for state management, votes, and LLM results validation in `Networking/ServerState.ts`.
   - Define TypeScript interfaces for all major systems in an `Interfaces/` folder to ensure clear contracts between modules.
   - Limit file size to <1000 lines, splitting large systems into smaller, focused scripts.

## Phase 2: Core Systems Development

4. **Game Loop and Phase Management**:
   - Implement a `GameLoopManager.ts` to handle cyclical Peace (~10 min) and Invasion (~30 min) phases with configurable timing.
   - Create UI elements for phase countdown timers in `UI/PhaseTimer.ts`.

5. **City Layout Generation**:
   - Develop a `CityLayoutGenerator.ts` module to procedurally or predefined generate the circular city layout (Inner, Middle, Outer Rings, Exterior AI Base).
   - Ensure Iron Dome mechanics (HP, destructible, rebuild via City Money) are abstracted in `CityDefenses/IronDome.ts`.

6. **Player Systems**:
   - Create `PlayerController.ts` for seamless FPS/Third-Person/RTS view switching and input handling (including gamepad support).
   - Implement Hero classes (Tech/Wizard) with initial abilities in a modular `AbilitySystem.ts`, where each ability is a separate class/script.
   - Develop `TroopManagement.ts` for building and managing personal Troops (max 5) with tactical Modes (Attack, Protect, Follow, Hold).

7. **Economy and Voting**:
   - Build `EconomyManager.ts` to handle Personal and City Money distribution (50/50 split), with sub-modules for each type.
   - Implement `VotingSystem.ts` for democratic spending of City Money via LLM proposals and player votes, with non-intrusive UI in `UI/VotingInterface.ts`.

8. **Building and Land Tenure**:
   - Create `BuildingSystem.ts` for personal (modular/presets) and communal building logic, with snapping and placement rules.
   - Implement `LandTenureSystem.ts` for cyclical plot repurchase and Command Post relocation mechanics.

9. **AI and Invasion Systems**:
   - Develop `AIManager.ts` as the central hub for AI logic, with sub-modules:
     - `AIUnitBehavior.ts` for specific unit roles (Wasp, Scuttler, Bulwark) and fallback behaviors.
     - `AIStrategy.ts` for LLM-guided strategy and unit composition.
     - `AISpawnController.ts` for unit purchasing and spawning from AI Base.
   - Implement dynamic difficulty scaling based on player count, total Money, and win/loss multipliers in `AIDifficultyScaler.ts`.

10. **Combat and Contribution**:
    - Build `CombatSystem.ts` for HP-based combat with low-violence feedback.
    - Implement `ContributionTracker.ts` for performance-based Money generation and distribution.
    - Create `KillAnnouncementSystem.ts` for global boss kill notifications and Artifact drops.

11. **UI and Feedback**:
    - Develop UI components for minimap, Fog of War, inventory, HP bars, Money displays, Troop command, building interface, and Iron Dome status in `UI/` folder.
    - Ensure Fog of War resets peripherally in `GameLogic/FogOfWar.ts`.

## Phase 3: Advanced Features and Integration

12. **LLM Integration and Fallbacks**:
    - Integrate LLM for city spending proposals, AI strategy, Assistant Bot tasks, and NPC dialogue in `LLMInterface/LLMController.ts`.
    - Implement availability monitoring and robust fallback logic in `LLMInterface/FallbackLogic.ts`.

13. **Communal Units and Bots**:
    - Implement Communal Combat Units (Interceptor Drone, Warden Bot) logic in `CityDefenses/CommunalUnits.ts`.
    - Develop Assistant Bot logic for maintenance tasks in `CityDefenses/AssistantBots.ts`.

14. **Exploration and Exterior**:
    - Create `ExplorationSystem.ts` for exterior encounters, rewards (Money, Artifacts, Intel), and AI scout logic during Peace phase.

15. **Artifacts and Progression**:
    - Implement `ArtifactSystem.ts` for equipping and customization on Heroes and Troops.
    - Define temporary intra-game progression for Heroes in `PlayerProgression.ts` (TBD details).

16. **Networking and State Sync**:
    - Ensure state synchronization for split-screen, join-in-progress, and leaver Money handling in `Networking/StateSync.ts`.

## Phase 4: Testing and Optimization

17. **Testing**:
    - Write unit tests for each module in a `Tests/` folder, focusing on economy, voting, AI behavior, and combat.
    - Conduct playtesting for phase timing, difficulty scaling, and UI usability.

18. **Optimization**:
    - Optimize rendering for split-screen in `Rendering/SplitScreen.ts`.
    - Profile and optimize database queries and network traffic in `Database/` and `Networking/`.

19. **Documentation**:
    - Document each module's purpose, inputs, and outputs in-code and in a `Docs/` folder.
    - Create a player guide for mechanics and controls in `memorybank/PlayerGuide.md`.

## Phase 5: Deployment and Post-Launch

20. **Deployment**:
    - Deploy to PC client via Electron/Tauri wrapper, with scripts in `Deployment/`.
    - Plan for potential mobile support post-launch.

21. **Post-Launch**:
    - Monitor LLM performance and player feedback for phase timing and difficulty adjustments.
    - Plan updates for new Hero classes, abilities, AI units, and city layouts based on player input.

## Key Principles Throughout Development

- **Modularity**: Each system (e.g., Economy, AI, Voting) must be independent, communicating via well-defined interfaces.
- **Abstraction**: Separate game logic from rendering, input, and networking to allow flexibility and reuse.
- **Best Practices**: Use TypeScript for type safety, follow SOLID principles, and ensure code readability with consistent formatting.
- **File Size**: Keep files under 1000 lines by splitting into sub-modules when necessary.
- **Fallback Logic**: Ensure all LLM-dependent systems have robust manual or predefined alternatives.

This plan ensures a structured approach to developing Rogue3D, maintaining clarity and organization at every step. Adjust timelines and priorities as needed based on development progress and player feedback.
