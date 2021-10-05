import { DEPTH } from "../utils/utils";

export default class GameMap {
  constructor(
    scene,
    key,
    tileSetName,
    bgLayerName,
    blockedLayerName,
    enviromentLayerName
  ) {
    this.scene = scene; // the scene this map belongs to
    this.key = key; // Tiled JSON file key name
    this.tileSetName = tileSetName; // Tiled Tileset image key name
    this.bgLayerName = bgLayerName; // the name of the layer created in tiled for the map background
    // the name of the layer created in tiled for the blocked areas
    this.blockedLayerName = blockedLayerName;

    this.enviromentLayerName = enviromentLayerName;

    this.createMap();
  }

  createMap() {
    // create the tile map
    this.tilemap = this.scene.make.tilemap({ key: this.key });
    // add the tileset image to our map
    this.tiles = this.tilemap.addTilesetImage(
      this.tileSetName,
      this.tileSetName,
      32,
      32,
      0,
      0
    );

    // create our background
    this.backgroundLayer = this.tilemap.createStaticLayer(
      this.bgLayerName,
      this.tiles,
      0,
      0
    );
    this.backgroundLayer.setScale(2.01);
    console.log(this.backgroundLayer);

    // create blocked layer
    this.blockedLayer = this.tilemap.createStaticLayer(
      this.blockedLayerName,
      this.tiles,
      0,
      0
    );
    this.blockedLayer.setCollisionByExclusion([-1]);
    this.blockedLayer.setScale(2.01);

    // create enviroment layer
    this.enviromentLayer = this.tilemap.createStaticLayer(
      this.enviromentLayerName,
      this.tiles,
      0,
      0
    );
    console.log(this.enviromentLayer);
    this.enviromentLayer.setDepth(DEPTH.ENVIROMENT);
    this.enviromentLayer.setScale(2.01);

    // update the world bounds
    this.scene.physics.world.bounds.width = this.tilemap.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.tilemap.heightInPixels * 2;

    // limit the camera to the size of our map
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels * 2,
      this.tilemap.heightInPixels * 2
    );
  }
}