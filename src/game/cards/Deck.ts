import Phaser from 'phaser';
import { Card, Suit, CardValue } from './Card';

export class Deck {
  private scene: Phaser.Scene;
  private cards: Card[] = [];
  private specialCards: Card[] = []; // For Jokers, Wilds, etc.
  private dealtCards: Card[] = []; // Keep track of cards dealt

  constructor(scene: Phaser.Scene, includeSpecials: boolean = false, numJokers: number = 2) {
    this.scene = scene;
    this.generateStandardDeck();
    if (includeSpecials) {
      this.addSpecialCards(numJokers);
    }
    this.shuffle();
  }

  // Generates a standard 52-card deck
  private generateStandardDeck(): void {
    const suits = [Suit.Hearts, Suit.Clubs, Suit.Diamonds, Suit.Spades];
    const values = [
      CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six,
      CardValue.Seven, CardValue.Eight, CardValue.Nine, CardValue.Ten,
      CardValue.Jack, CardValue.Queen, CardValue.King, CardValue.Ace
    ];

    this.cards = []; // Clear existing cards
    for (const suit of suits) {
      for (const value of values) {
        this.cards.push(new Card(this.scene, suit, value));
      }
    }
    console.log(`Generated standard deck with ${this.cards.length} cards.`);
  }

  // Adds special cards like Jokers
  private addSpecialCards(numJokers: number): void {
    this.specialCards = [];
    for (let i = 0; i < numJokers; i++) {
      const joker = new Card(this.scene, Suit.Special, CardValue.Joker, true);
      this.specialCards.push(joker);
      this.cards.push(joker); // Add jokers to the main deck as well
    }
    // Add other special cards like Wilds if needed
    // const wild = new Card(this.scene, Suit.Special, CardValue.Wild, true);
    // this.specialCards.push(wild);
    // this.cards.push(wild);
    console.log(`Added ${this.specialCards.length} special cards.`);
  }

  // Shuffles the deck using Fisher-Yates algorithm
  shuffle(): void {
    let currentIndex = this.cards.length;
    let randomIndex: number;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.cards[currentIndex], this.cards[randomIndex]] = [
        this.cards[randomIndex], this.cards[currentIndex]];
    }
    console.log('Deck shuffled.');
  }

  // Draws a single card from the top of the deck
  draw(): Card | null {
    if (this.cards.length > 0) {
      const drawnCard = this.cards.pop();
      if (drawnCard) {
        this.dealtCards.push(drawnCard);
        console.log(`Drew card: ${drawnCard.toString()}`);
        return drawnCard;
      }
    }
    console.log('Deck is empty.');
    return null; // Return null if the deck is empty
  }

  // Resets the deck (collects all cards and reshuffles)
  reset(): void {
    // Combine main deck and dealt cards back together
    this.cards = [...this.cards, ...this.dealtCards];
    this.dealtCards = []; // Clear dealt cards list

    // Optionally regenerate standard/special cards if needed, or just reshuffle
    // For now, just reshuffle the existing cards
    this.shuffle();
    console.log(`Deck reset and reshuffled. Total cards: ${this.cards.length}`);
  }

  // Returns the number of cards remaining in the deck
  remainingCards(): number {
    return this.cards.length;
  }
}