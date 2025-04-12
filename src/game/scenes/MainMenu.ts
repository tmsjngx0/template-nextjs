import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Add text to start Shanghai Draw
        const shanghaiButton = this.add.text(512, 520, 'Play Shanghai Draw', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffff00', // Different color
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive(); // Make it interactive

        shanghaiButton.on('pointerdown', () => {
            this.scene.start('ShanghaiScene'); // Start Shanghai scene on click
        });

        // Add text/button for the original game (optional, if changeScene isn't used elsewhere)
        const originalGameButton = this.add.text(512, 570, 'Play Original Game', {
             fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
             stroke: '#000000', strokeThickness: 6,
             align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        originalGameButton.on('pointerdown', () => {
            this.changeScene(); // Call existing method to start 'Game' scene
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
