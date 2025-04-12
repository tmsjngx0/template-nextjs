import Phaser from 'phaser';

export enum Suit {
  Hearts = 'hearts',
  Clubs = 'clubs',
  Diamonds = 'diamonds',
  Spades = 'spades',
  Special = 'special' // For Jokers or other special cards
}

export enum CardValue {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
  Joker = 'joker',
  Wild = 'wild'
}

export class Card {
  public suit: Suit;
  public value: CardValue;
  public isSpecial: boolean;
  public isSelected: boolean;
  public textureKey: string; // Key for the loaded SVG texture
  public sprite: Phaser.GameObjects.Sprite | null = null; // Phaser sprite representation
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, suit: Suit, value: CardValue, isSpecial: boolean = false) {
    this.scene = scene;
    this.suit = suit;
    this.value = value;
    this.isSpecial = isSpecial || suit === Suit.Special;
    this.isSelected = false;
    // Texture key convention: e.g., 'card_hearts_A', 'card_special_joker'
    this.textureKey = `card_${suit}_${value}`;
  }

  // Renders the card sprite at a given position
  render(x: number, y: number): Phaser.GameObjects.Sprite {
    // Ensure assets/cards/ directory exists and SVGs are loaded in Preloader
    this.sprite = this.scene.add.sprite(x, y, this.textureKey);
    this.sprite.setInteractive(); // Make the sprite interactive
    this.sprite.setData('cardInstance', this); // Link sprite back to card instance
    // Add input listeners later for selection, dragging etc.
    return this.sprite;
  }

  // Selects the card
  select(): void {
    if (this.sprite) {
      this.isSelected = true;
      // Add visual feedback for selection (e.g., tint, scale)
      this.sprite.setTint(0xcccccc); // Example: grey tint
      console.log(`Selected: ${this.value} of ${this.suit}`);
    }
  }

  // Deselects the card
  deselect(): void {
    if (this.sprite) {
      this.isSelected = false;
      // Remove visual feedback
      this.sprite.clearTint();
      console.log(`Deselected: ${this.value} of ${this.suit}`);
    }
  }

  // Highlights the card (e.g., on hover or as a possible match)
  highlight(enable: boolean = true): void {
    if (this.sprite) {
      if (enable) {
        this.sprite.setTint(0xffff00); // Example: yellow tint
      } else {
        // Restore selection tint if selected, otherwise clear tint
        if (this.isSelected) {
          this.sprite.setTint(0xcccccc);
        } else {
          this.sprite.clearTint();
        }
      }
    }
  }

  // Method to get a string representation (for debugging)
  toString(): string {
    return `${this.value} of ${this.suit}`;
  }
}