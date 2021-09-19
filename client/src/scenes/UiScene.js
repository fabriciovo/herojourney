import * as Phaser from "phaser";
import InventoryWindow from "../classes/window/InventoryWindow";
import ItemDescriptionWindow from "../classes/window/ItemDescriptionWindow";
import PlayerWindow from "../classes/window/PlayerWindow";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("Ui");
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get("Game");
    this.showInventory = false;
    this.showPlayerStats = false;
  }

  create() {
    this.setupUiElements();
    this.setupEvents();

    // handle game resize
    this.scale.on("resize", this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  setupUiElements() {
    // create the score text game object
    this.scoreText = this.add.text(35, 8, "Coins: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    // create coin icon
    this.coinIcon = this.add.image(15, 15, "items", 3);

    // create playerStats modal
    this.playerStatsWindow = new PlayerWindow(this, {
      windowWidth: this.scale.width / 5 ,
      windowHeight: this.scale.height * 0.3,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    // create inventory modal
    this.inventoryWindow = new InventoryWindow(this, {
      windowWidth: this.scale.width / 4 - 300,
      windowHeight: this.scale.height * 0.3,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    this.descriptionWindow = new ItemDescriptionWindow(this, {
      x: this.gameScene.input.x,
      y: this.gameScene.input.y,
      windowWidth: 360,
      windowHeight: 120,
      borderAlpha: 1,
      windowAlpha: 1,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    //create equiped weapons icons

    this.actionA = this.add.image(50, this.scale.height - 50, "actionA");
    this.actionB = this.add.image(150, this.scale.height - 50, "actionB");

    this.potionA = this.add.image(50, this.scale.height - 150, "potionA");
    this.potionB = this.add.image(150, this.scale.height - 150, "potionB");

    this.actionA.setScale(3);
    this.actionB.setScale(3);
    this.potionA.setScale(3);
    this.potionB.setScale(3);

    // create playerStats button
    this.playerStatsButton = this.add
      .image(this.scale.width / 2 - 90, this.scale.height - 50, "playerstats")
      .setScale(0.1)
      .setInteractive();

    this.playerStatsButton.on("pointerdown", () => {
      console.log("playerStatsButton", this.gameScene.player)
      this.togglePlayerStats(this.gameScene.player);
    });

    // create inventory button
    this.inventoryButton = this.add
      .image(
        this.scale.width / 2 - 20,
        this.scale.height - 50,
        "inventoryButton"
      )
      .setScale(0.1)
      .setInteractive();

    this.inventoryButton.on("pointerdown", () => {
      console.log("inventoryButton", this.gameScene.player)

      this.toggleInventory(this.gameScene.player);
    });

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (
        !gameObjects.includes(this.inventoryWindow.rect) &&
        !gameObjects.includes(this.inventoryButton) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[0].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[1].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[2].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[3].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[4].item) &&
        !gameObjects.includes(this.inventoryWindow.discardButton) &&
        !gameObjects.includes(this.inventoryWindow.equipButton)
      ) {
        this.gameScene.dialogWindow.rect.setInteractive();
        this.inventoryWindow.hideWindow();
        this.showInventory = false;
      }
    });
  }

  setupEvents() {
    // listen for the updateScore event from the game scene
    this.gameScene.events.on("updateScore", (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });

    this.gameScene.events.on("showInventory", (playerObject, mainPlayer) => {
      this.toggleInventory(playerObject, mainPlayer);
    });
  }

  resize(gameSize) {
    if (this.inventoryWindow) this.inventoryWindow.resize(gameSize);
    if (this.playerStatsWindow) this.playerStatsWindow.resize(gameSize);
    if (this.descriptionWindow) this.descriptionWindow.resize(gameSize);


    if (gameSize.width < 560) {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    } else if (gameSize.width <= 560) {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    } else {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    }
  }

  toggleInventory(playerObject) {
    this.showInventory = !this.showInventory;
    if (this.showInventory) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.inventoryWindow.showWindow(playerObject);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.inventoryWindow.hideWindow();
    }
  }

  togglePlayerStats(playerObject) {
    this.showPlayerStats = !this.showPlayerStats;
    if (this.showPlayerStats) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.playerStatsWindow.showWindow(playerObject);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.playerStatsWindow.hideWindow();
    }
  }
}
