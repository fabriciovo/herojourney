import * as Phaser from "phaser";
import InventoryWindow from "../classes/window/InventoryWindow";
import ItemDescriptionWindow from "../classes/window/ItemDescriptionWindow";
import PlayerWindow from "../classes/window/PlayerWindow";
import PopupWindow from "../classes/window/popupWindow";
import ShopWindow from "../classes/window/ShopWindow";
import {
  iconsetPotionsTypes,
  iconsetSlotsTypes,
  iconsetWeaponTypes,
} from "../utils/utils";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("Ui");
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get("Game");
    this.showInventory = false;
    this.showPlayerStats = false;
    this.showShopWindow = false;
  }

  create() {
    this.setupUiElements();
    this.setupEvents();

    // handle game resize
    this.scale.on("resize", this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  update() {
    if (this.showShopWindow) {
      this.shopWindow.showWindow(this.gameScene.player);
    } else {
      this.shopWindow.hideWindow();
    }
  }

  setupUiElements() {
    //create Popup window
    this.shopWindow = new ShopWindow(this, {
      x: this.scale.width / 2 - 174,
      y: this.scale.height / 2 - 200,
      windowWidth: 360,
      windowHeight: 220,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    //create Popup window
    this.popup = new PopupWindow(this, {
      x: this.scale.width / 2 - 174,
      y: this.scale.height / 2 - 200,
      windowWidth: 360,
      windowHeight: 120,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    // create playerStats window
    this.playerStatsWindow = new PlayerWindow(this, {
      windowWidth: this.scale.width / 5,
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
      x: this.gameScene.input.mousePointer.x,
      y: this.gameScene.input.mousePointer.y,
      windowWidth: 360,
      windowHeight: 120,
      borderAlpha: 1,
      windowAlpha: 1,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    //Create equiped weapons text
    this.actionAText = this.add
      .text(60, this.scale.height - 50, "Z", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(4);

    this.actionBText = this.add
      .text(160, this.scale.height - 50, "X", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(4);

    this.potionAText = this.add
      .text(50, this.scale.height - 190, "C", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(4);

    this.potionACountText = this.add
      .text(80, this.scale.height - 135, "0", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(4);

    // create playerStats button
    this.playerStatsButton = this.add
      .image(this.scale.width / 2 - 90, this.scale.height - 50, "playerstats")
      .setScale(0.1)
      .setInteractive({ cursor: "pointer" });

    this.playerStatsButton.on("pointerdown", () => {
      console.log("playerStatsButton", this.gameScene.player);
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
      .setInteractive({ cursor: "pointer" });

    this.inventoryButton.on("pointerdown", () => {
      console.log("inventoryButton", this.gameScene.player);

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
        !gameObjects.includes(this.inventoryWindow.equipButton) &&
        !gameObjects.includes(this.playerStatsWindow.rect) &&
        !gameObjects.includes(this.playerStatsWindow.removeItemButton) &&
        !gameObjects.includes(this.playerStatsButton) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[0].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[1].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[2].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[3].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[4].item)
      ) {
        this.gameScene.dialogWindow.rect.setInteractive();
        this.inventoryWindow.hideWindow();
        this.showInventory = false;

        this.playerStatsWindow.hideWindow();
        this.showPlayerStats = false;

        this.popup.hideWindow();
      }
    });
  }

  setupEvents() {
    this.gameScene.events.on("showInventory", (playerObject) => {
      this.toggleInventory(playerObject);
    });
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

  toggleShop(playerObject, active) {
    this.showShopWindow = active;
    if (this.showShopWindow) {
      console.log("this.shopWindow adsdasdsasda");

      this.shopWindow.showWindow(playerObject);
    } else {
      console.log("this.shopWindow");
      this.shopWindow.hideWindow();
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

  createPlayersStatsUi(playerObject) {
    //Create Bars
    this.createPlayerExpBar(playerObject);
    this.createPlayerHealthBar(playerObject);

    //Create texts
    this.levelText = this.add
      .text(
        400,
        this.scale.height / 24 - 40,
        `Level: ${playerObject.level} - XP: ${playerObject.exp} /  ${playerObject.maxExp}`,
        {
          fontSize: "26px",
          fill: "#fff",
        }
      )
      .setDepth(4);

    this.healtText = this.add
      .text(
        40,
        this.scale.height / 24 - 40,
        `Health: ${playerObject.health} /  ${playerObject.maxHealth}`,
        {
          fontSize: "26px",
          fill: "#fff",
        }
      )
      .setDepth(4);

    this.potionACountText.setText(`${playerObject.potions}`);

    //create equiped slots icons

    this.slotA = this.add.image(
      50,
      this.scale.height - 50,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    this.slotB = this.add.image(
      150,
      this.scale.height - 50,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    //create equiped weapons icons

    this.slotC = this.add.image(
      50,
      this.scale.height - 150,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    this.actionA = this.add.image(
      55,
      this.scale.height - 55,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD
    );
    this.actionB = this.add.image(
      150,
      this.scale.height - 50,
      "iconset",
      iconsetWeaponTypes.BOW
    );

    this.potionA = this.add.image(
      50,
      this.scale.height - 150,
      "iconset",
      iconsetPotionsTypes.HEALTH_POTION
    );

    this.actionA.setScale(2.5);
    this.actionB.setScale(2.5);
    this.potionA.setScale(2.5);

    this.actionA.setOrigin(0.5);
    this.actionB.setOrigin(0.5);
    this.potionA.setOrigin(0.5);

    this.slotA.setScale(3);
    this.slotB.setScale(3);
    this.slotC.setScale(3);
  }

  updatePlayerStatsUi(playerObject) {
    this.levelText.setText(
      `Level: ${playerObject.level} - XP: ${playerObject.exp} /  ${playerObject.maxExp}`
    );
    this.healtText.setText(
      `Health: ${playerObject.health} /  ${playerObject.maxHealth}`
    );
  }

  createPlayerExpBar(playerObject) {
    this.expBar = this.add.graphics();
    this.expBar.clear();
    this.expBar.fillStyle(0xffffff, 1);
    this.expBar.fillRect(40, this.scale.height / 14, 300, 12);
    this.expBar.fillGradientStyle(0x0000ff, 0xffffff, 4);
    this.expBar.fillRect(
      40,
      this.scale.height / 14,
      300 * (playerObject.exp / playerObject.maxExp),
      12
    );
  }

  updatePlayerExpBar(playerObject) {
    this.expBar.clear();
    this.expBar.fillStyle(0xffffff, 1);
    this.expBar.fillRect(40, this.scale.height / 14, 300, 12);
    this.expBar.fillGradientStyle(0x0000ff, 0xffffff, 4);
    this.expBar.fillRect(
      40,
      this.scale.height / 14,
      300 * (playerObject.exp / playerObject.maxExp),
      12
    );
  }

  createPlayerHealthBar(playerObject) {
    this.healthBar = this.add.graphics();
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(40, this.scale.height / 24, 300, 12);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(
      40,
      this.scale.height / 24,
      300 * (playerObject.health / playerObject.maxHealth),
      12
    );
  }

  updatePlayerHealthBar(playerObject) {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(40, this.scale.height / 24, 300, 12);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(
      40,
      this.scale.height / 24,
      300 * (playerObject.health / playerObject.maxHealth),
      12
    );
  }

  updatePlayerBars() {}

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
}
