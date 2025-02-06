function setUp (enemyImage: Image) {
    for (let value of tiles.getTilesByType(assets.tile`enemyTile`)) {
        enemy = sprites.create(assets.image`enemy`, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value2 of tiles.getTilesByType(assets.tile`myTile0`)) {
        collectible = sprites.create(assets.image`coin0`, SpriteKind.Food)
        tiles.placeOnTile(collectible, value2)
        tiles.setTileAt(value2, assets.tile`transparency16`)
    }
    for (let value3 of tiles.getTilesByType(assets.tile`playerTile`)) {
        playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
        tiles.placeOnTile(playerSprite, value3)
        tiles.setTileAt(value3, assets.tile`transparency16`)
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
scene.onOverlapTile(SpriteKind.Player, assets.tile`levelTile`, function (sprite, location) {
    level += 1
    startLevel()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.confetti, 500)
    info.changeScoreBy(1)
})
function startLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy`)
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy`)
    } else if (level == 3) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy`)
    } else {
        game.gameOver(true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.fire, 500)
    info.changeScoreBy(-1)
})
let currentjumps = 0
let playerSprite: Sprite = null
let collectible: Sprite = null
let enemy: Sprite = null
let level = 0
let jumpNumber = 0
let gravity = 0
let jumpSpeed = 0
let list: number[] = []
jumpSpeed = -75
gravity = 100
jumpNumber = 2
level = 1
startLevel()
game.onUpdate(function () {
    if (playerSprite.isHittingTile(CollisionDirection.Bottom)) {
        currentjumps = 0
    }
})
