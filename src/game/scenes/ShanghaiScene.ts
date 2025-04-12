import Phaser from 'phaser';
import { Card } from '../cards/Card';
import { Deck } from '../cards/Deck';
import { CardManager } from '../cards/CardManager';
import { EventBus } from '../EventBus'; // Use named import

export class ShanghaiScene extends Phaser.Scene {
  private deck: Deck | null = null;
  private cardManager: CardManager | null = null;
  // Add other game state variables here (e.g., score, current hand)

  constructor() {
    super('ShanghaiScene'); // Scene key
  }

  preload(): void {
    // Preload card assets (SVGs)
    // IMPORTANT: Place your card SVG files in the 'public/assets/cards/' directory.
    // The texture keys should follow the convention: 'card_suit_value.svg'
    // Example: 'card_hearts_A.svg', 'card_spades_10.svg', 'card_special_joker.svg'

    // Example loading (replace with actual loop based on suits/values):
    const suits = ['hearts', 'clubs', 'diamonds', 'spades', 'special'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', 'joker', 'wild']; // Add all needed values

    for (const suit of suits) {
      for (const value of values) {
        // Construct the expected texture key and file path
        const key = `card_${suit}_${value}`;
        const path = `assets/cards/card_${suit}_${value}.svg`;
        // Check if the combination is valid (e.g., no 'special_A') before loading
        // This check needs refinement based on actual card set
        if (this.isValidCardCombination(suit, value)) {
           // Use load.svg for SVG files
           this.load.svg(key, path, { width: 100, height: 140 }); // Adjust size as needed
        }
      }
    }

    // Load other assets if needed (background, UI elements)
    // this.load.image('background', 'assets/shanghai_background.png');
  }

  // Helper to check if a suit/value combination is valid before loading
  private isValidCardCombination(suit: string, value: string): boolean {
      if (suit === 'special') {
          return value === 'joker' || value === 'wild'; // Only load joker/wild for special suit
      } else {
          return value !== 'joker' && value !== 'wild'; // Don't load joker/wild for standard suits
      }
  }


  create(): void {
    // Add background image
    // this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');

    // Initialize Deck and CardManager
    this.deck = new Deck(this, true, 2); // Include specials, 2 jokers
    this.cardManager = new CardManager(this);

    // Example: Deal initial cards and render them
    this.dealInitialLayout();

    // Set up UI elements (score display, buttons)

    // Listen for game events (e.g., game over)
    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
        if (scene.scene.key === this.scene.key) {
            console.log('ShanghaiScene is ready.');
            // Perform actions when scene is fully ready
        }
    });

    // Emit scene ready event
    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number): void {
    // Game loop logic (e.g., check win/lose conditions, update timers)
  }

  // Example function to deal and render initial cards
  private dealInitialLayout(): void {
    if (!this.deck || !this.cardManager) return;

    const startX = 150;
    const startY = 200;
    const cardSpacingX = 120;
    const cardSpacingY = 160;
    const cardsPerRow = 7;

    // Example: Deal 14 cards in 2 rows
    for (let i = 0; i < 14; i++) {
      const card = this.deck.draw();
      if (card) {
        const row = Math.floor(i / cardsPerRow);
        const col = i % cardsPerRow;
        const x = startX + col * cardSpacingX;
        const y = startY + row * cardSpacingY;

        const sprite = card.render(x, y); // Render the card
        this.cardManager.addCard(card); // Add card to manager

        // Enable dragging for the card sprite (optional)
        // this.input.setDraggable(sprite);
      } else {
        console.warn('Deck ran out of cards during initial deal.');
        break; // Stop dealing if deck is empty
      }
    }

    // Add drag listeners if needed (using CardManager placeholders for now)
    // this.input.on('dragstart', (pointer, gameObject) => this.cardManager?.handleDragStart(pointer, gameObject));
    // this.input.on('drag', (pointer, gameObject, dragX, dragY) => this.cardManager?.handleDrag(pointer, gameObject, dragX, dragY));
    // this.input.on('dragend', (pointer, gameObject) => this.cardManager?.handleDragEnd(pointer, gameObject));
  }

  // Add other methods for game logic (checking hands, scoring, etc.)
}