let currentjumps = 0
let playerSprite: Sprite = null
let endTile: Sprite = null
let collectible: Sprite = null
let enemy: Sprite = null

let level = 1
let jumpNumber = 2
let gravity = 600
let jumpheight = 48

const enemies = [
    assets.image`enemy1`,
    assets.image`enemy2`,
    assets.image`enemy3`,
]
const keys = [
    assets.image`key1`,
    assets.image`key2`,
    assets.image`key3`,
]

namespace SpriteKind {
    export const key = SpriteKind.create()
}
function randomCollectible() {
    let collectibles = [

        assets.image`getlife`,
        assets.image`getcollectible`,
        assets.image`getcoin`,
        assets.image`chest`

    ]
    return collectibles._pickRandom()

}
function setUp (enemyImage: Image) {
    for (let value of tiles.getTilesByType(assets.tile`enemyTile`)) {
        enemy = sprites.create(enemyImage, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value2 of tiles.getTilesByType(assets.tile`myTile0`)) {
        collectible = sprites.create(randomCollectible(), SpriteKind.Food),
        tiles.placeOnTile(collectible, value2)
        tiles.setTileAt(value2, assets.tile`transparency16`)
    }
    for (let value4 of tiles.getTilesByType(assets.tile`levelTile`)) {
        endTile = sprites.create(findKey(), SpriteKind.key)
        tiles.placeOnTile(endTile, value4)
        tiles.setTileAt(value4, assets.tile`transparency16`)
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
    return keys[level-1]
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
    sprites.destroyAllSpritesOfKind(SpriteKind.key)
    let tilemaps = [
        tilemap`level1`,
        tilemap`level2`,
        tilemap`level3`
    ]

    if (level > 3) {
        return game.gameOver(true)
    }

    let image = enemies[level-1]
    tiles.setCurrentTilemap(tilemaps[level-1])
    setUp(image)
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
