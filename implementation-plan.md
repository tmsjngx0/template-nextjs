# Shanghai Draw Implementation Plan

## File Structure
```mermaid
graph TD
    A[src/game] --> B[cards/]
    B --> C[Card.ts]
    B --> D[Deck.ts]
    B --> E[CardManager.ts]
    A --> F[scenes/]
    F --> G[ShanghaiScene.ts]
    H[public/assets] --> I[cards/]
```

## Class Diagram
```mermaid
classDiagram
    class Card {
        +suit: string
        +value: string
        +isSpecial: boolean
        +isSelected: boolean
        +texture: string
        +sprite: Phaser.GameObjects.Sprite
        +render(x: number, y: number): void
        +select(): void
        +deselect(): void
        +highlight(): void
    }

    class Deck {
        +cards: Card[]
        +specialCards: Card[]
        +shuffle(): void
        +draw(): Card
        +reset(): void
        +generateStandardDeck(): void
    }

    class CardManager {
        +cards: Card[]
        +selectedCards: Card[]
        +handleClick(card: Card): void
        +handleDrag(card: Card): void
        +handleDrop(card: Card): void
        +checkForMatches(): boolean
    }

    CardManager --> Card
    Deck --> Card
```

## Sequence Diagram (Card Interactions)
```mermaid
sequenceDiagram
    participant Player
    participant CardManager
    participant Card
    participant Deck

    Player->>CardManager: Click on card
    CardManager->>Card: Select()
    Card-->>Player: Visual feedback
    Player->>CardManager: Drag card
    CardManager->>Card: Update position
    Player->>CardManager: Drop card
    CardManager->>CardManager: Check for matches
    CardManager->>Deck: Draw new card if needed
```

## Scene Structure
```mermaid
graph TD
    A[ShanghaiScene] --> B[Initialize Deck]
    A --> C[Create Card Layout]
    A --> D[Set Up Card Interactions]
    D --> E[Handle Clicks]
    D --> F[Handle Drag & Drop]
    D --> G[Handle Matches]
    A --> H[Update Game State]
```

## Implementation Steps
1. Create card/ directory with Card.ts, Deck.ts, and CardManager.ts
2. Create ShanghaiScene.ts
3. Add cards/ directory to public/assets for SVG files
4. Implement basic card rendering
5. Add card interaction logic
6. Integrate with existing scene structure