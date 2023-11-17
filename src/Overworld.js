class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.image("tilesetImage","tileset.png");
        this.load.tilemapTiledJSON("tilemapJSON","overworld.json");
    }

    create() {
        // velocity constant
        this.VEL = 100

        // tilemap info
        const map = this.add.tilemap("tilemapJSON");
        const tileset = map.addTilesetImage("tileset","tilesetImage"); //looking for the name in Tiled/the .png, then the string in preload

        const bgLayer = map.createLayer("Background", tileset, 0, 0);
        const terrainLayer = map.createLayer("Terrain", tileset, 0, 0);
        const flowerLayer = map.createLayer("Flowers", tileset, 0, 0);
        const treeLayer = map.createLayer("Trees", tileset, 0, 0);

        // add slime
        const slimeSpawn = map.findObject("Spawns", obj => obj.name === "slimeSpawn")
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        this.slime.body.setCollideWorldBounds(true)

        // slime animation
        this.anims.create({
            key: "jiggle",
            frameRate:6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("slime",{
                start: 0,
                end: 1
            })
        });
        this.slime.play("jiggle");

        //camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.slime, false, 0.25, 0.25);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //collisions
        terrainLayer.setCollisionByProperty({
            collides: true //this is what we named the property in Tiled
        });

        treeLayer.setCollisionByProperty({
            collides: true //this is what we named the property in Tiled
        });

        this.physics.add.collider(this.slime, terrainLayer);
        this.physics.add.collider(this.slime, treeLayer);

        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}