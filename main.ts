let currentjumps = 0
let playerSprite: Sprite = null
let endTile: Sprite = null
let collectible: Sprite = null
let enemy: Sprite = null

let level = 1
let jumpNumber = 2
let gravity = 600
let jumpheight = 48

const collectibles = [
        sprites.create(assets.image`getlife`, SpriteKind.Food),
        sprites.create(assets.image`getcollectible`, SpriteKind.Food),
        sprites.create(assets.image`getcoin`, SpriteKind.Food),
        sprites.create(assets.image`hi`, SpriteKind.Food)
]

namespace SpriteKind {
    export const key = SpriteKind.create()
}
function randomCollectible () {
    return collectibles._pickRandom()
}
function setUp (enemyImage: Image) {
    for (let value of tiles.getTilesByType(assets.tile`enemyTile`)) {
        enemy = sprites.create(enemyImage, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value2 of tiles.getTilesByType(assets.tile`myTile0`)) {
        collectible = randomCollectible()
        tiles.placeOnTile(collectible, value2)
        tiles.setTileAt(value2, assets.tile`transparency16`)
    }
    for (let value2 of tiles.getTilesByType(assets.tile`levelTile`)) {
        endTile = sprites.create(findKey(), SpriteKind.key)
        tiles.placeOnTile(endTile, value2)
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
        playerSprite.vy = -Math.sqrt(2 * (gravity * jumpheight))
        currentjumps += 1
    }
})
function findKey () {
    if (level == 1) {
        return assets.image`key1`
    } else if (level == 2) {
        return assets.image`key2`
    } else {
        return assets.image`key3`
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.confetti, 500)
    info.changeLifeBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.key, function (sprite, otherSprite) {
    level += 1
    startLevel()
})
function startLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy1`)
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy2`)
    } else if (level == 3) {
        tiles.setCurrentTilemap(tilemap`level1`)
        setUp(assets.image`enemy3`)
    } else {
        game.gameOver(true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.fire, 500)
    info.changeLifeBy(-1)
})


info.setLife(3)
startLevel()
game.onUpdate(function () {
    if (playerSprite.isHittingTile(CollisionDirection.Bottom)) {
        currentjumps = 0
    }
})
