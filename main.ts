function setUp (enemyImage: Image) {
    tiles.setCurrentTilemap(tilemap`level1`)
    tiles.placeOnRandomTile(playerSprite, assets.tile`playerTile`)
    for (let value of tiles.getTilesByType(assets.tile`enemyTile`)) {
        enemy = sprites.create(assets.image`enemy`, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, value)
        tiles.setTileAt(value, assets.tile`myTile`)
    }
    for (let value2 of tiles.getTilesByType(assets.tile`myTile0`)) {
        collectible = sprites.create(assets.image`coin0`, SpriteKind.Food)
        tiles.placeOnTile(collectible, value2)
        tiles.setTileAt(value2, assets.tile`myTile`)
    }
    for (let value3 of tiles.getTilesByType(assets.tile`playerTile`)) {
        playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
        tiles.placeOnTile(playerSprite, value3)
        tiles.setTileAt(value3, assets.tile`myTile`)
        controller.moveSprite(playerSprite, 100, 0)
        playerSprite.ay = gravity
        playerSprite.setStayInScreen(true)
        scene.cameraFollowSprite(playerSprite)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentjumps < jumpNumber) {
        playerSprite.vy = jumpSpeed
        currentjumps += 1
    }
})
let currentjumps = 0
let collectible: Sprite = null
let enemy: Sprite = null
let playerSprite: Sprite = null
let jumpNumber = 0
let gravity = 0
let jumpSpeed = 0
let list: number[] = []
jumpSpeed = -50
gravity = 100
jumpNumber = 2
setUp(assets.image`enemy`)
game.onUpdate(function () {
    if (playerSprite.isHittingTile(CollisionDirection.Bottom)) {
        currentjumps = 0
    }
})
