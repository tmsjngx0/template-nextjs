import Phaser from 'phaser';
import { Card } from './Card';

export class CardManager {
  private scene: Phaser.Scene;
  private cards: Card[] = []; // All cards currently managed (e.g., in hand, on board)
  private selectedCards: Card[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Listen for pointer down events globally or on specific card sprites
    this.scene.input.on('gameobjectdown', this.handleGameObjectDown, this);
    // Add listeners for drag events later if needed
    // this.scene.input.on('dragstart', ...);
    // this.scene.input.on('drag', ...);
    // this.scene.input.on('dragend', ...);
  }

  // Add a card to be managed
  addCard(card: Card): void {
    if (card.sprite) {
      this.cards.push(card);
      // Ensure the sprite is interactive
      card.sprite.setInteractive();
    } else {
      console.warn('Attempted to add a card without a rendered sprite.');
    }
  }

  // Remove a card from management
  removeCard(cardToRemove: Card): void {
    this.cards = this.cards.filter(card => card !== cardToRemove);
    this.selectedCards = this.selectedCards.filter(card => card !== cardToRemove);
    if (cardToRemove.sprite) {
      cardToRemove.sprite.destroy(); // Remove sprite from scene
    }
  }

  // Handle clicks (pointer down) on game objects
  private handleGameObjectDown(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
    // Check if the clicked object is a card sprite managed by this manager
    const cardInstance = gameObject.getData('cardInstance') as Card;
    if (cardInstance && this.cards.includes(cardInstance)) {
      this.handleClick(cardInstance);
    }
  }

  // Logic for handling a click on a specific card
  private handleClick(card: Card): void {
    if (card.isSelected) {
      card.deselect();
      this.selectedCards = this.selectedCards.filter(selected => selected !== card);
    } else {
      // Implement selection logic (e.g., allow multiple selections or only one)
      // For now, allow multiple selections
      card.select();
      this.selectedCards.push(card);
    }
    console.log('Selected cards:', this.selectedCards.map(c => c.toString()));
    // Potentially check for matches immediately after selection
    // this.checkForMatches();
  }

  // Placeholder for drag handling start
  private handleDragStart(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
    // Ensure it's a Sprite before accessing sprite properties
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      const cardInstance = gameObject.getData('cardInstance') as Card;
      if (cardInstance && this.cards.includes(cardInstance)) {
        // Bring card to top visually
        this.scene.children.bringToTop(gameObject);
        // Add visual feedback for dragging (e.g., slight scale up)
        gameObject.setScale(1.1);
      }
    }
  }

  // Placeholder for drag handling
  private handleDrag(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number): void {
    // Ensure it's a Sprite before accessing sprite properties
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      const cardInstance = gameObject.getData('cardInstance') as Card;
      if (cardInstance && this.cards.includes(cardInstance)) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    }
  }

  // Placeholder for drag handling end
  private handleDragEnd(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
    // Ensure it's a Sprite before accessing sprite properties
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      const cardInstance = gameObject.getData('cardInstance') as Card;
      if (cardInstance && this.cards.includes(cardInstance)) {
        // Reset scale
        gameObject.setScale(1.0);
        // Handle drop logic (e.g., snap to grid, check for valid drop zone)
        // this.handleDrop(cardInstance, gameObject.x, gameObject.y);
      }
    }
  }

  // Placeholder for checking matches (specific to Shanghai Draw rules)
  checkForMatches(): boolean {
    // Implement game-specific logic to check if selected cards form a valid poker hand or Mahjong pair/set
    console.log('Checking for matches with selected cards:', this.selectedCards.map(c => c.toString()));
    // Example: Check if two selected cards are identical (simple Mahjong rule)
    if (this.selectedCards.length === 2) {
      const [card1, card2] = this.selectedCards;
      if (card1.suit === card2.suit && card1.value === card2.value) {
        console.log('Match found!');
        // Remove matched cards
        this.removeCard(card1);
        this.removeCard(card2);
        return true;
      }
    }
    return false;
  }

  // Cleans up listeners when the manager is no longer needed
  destroy(): void {
    this.scene.input.off('gameobjectdown', this.handleGameObjectDown, this);
    // Remove other listeners if added
    // this.scene.input.off('dragstart', ...);
    // this.scene.input.off('drag', ...);
    // this.scene.input.off('dragend', ...);
    this.cards.forEach(card => card.sprite?.destroy());
    this.cards = [];
    this.selectedCards = [];
  }
}