let gravity = 600;
let walkspeed = 100;
let maxjumps = 2;
let jumpheight = 48;

function MakeEnemies(appearance: Image) {
    for (let v of tiles.getTilesByType(assets.tile`enemyTile`)) {
        let enemy = sprites.create(appearance, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, v)
        tiles.setTileAt(v, assets.tile`transparency16`)
    }
}
function MakeCoins(appearance: Image) {
    for (let v of tiles.getTilesByType(assets.tile`coinTile`)) {
        collectible = sprites.create(appearance, SpriteKind.Food)
        tiles.placeOnTile(collectible, v)
        tiles.setTileAt(v, assets.tile`transparency16`)
    }
}
function InitializeMap() {
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level1`)
    } else if (level == 3) {
        tiles.setCurrentTilemap(tilemap`level1`)
    }
}

function MakePlayer(appearance: Image) {
    info.setLife(3)
    playerSprite = sprites.create(appearance, SpriteKind.Player)
    tiles.placeOnRandomTile(playerSprite, assets.image`playerTile`)

    playerSprite.ay = gravity
    playerSprite.setStayInScreen(true)
    scene.cameraFollowSprite(playerSprite)
    controller.moveSprite(playerSprite, walkspeed, 0)
}

function SetUp () {
    InitializeMap()
    MakePlayer(assets.image`player`)
    MakeEnemies(assets.image`enemy`)
    MakeCoins(assets.image`coin0`)
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentjumps >= maxjumps) {
        return
    }
    playerSprite.vy = 0 - Math.sqrt(2 * (gravity * jumpheight))
    currentjumps += 1
})

scene.onOverlapTile(SpriteKind.Player, assets.tile`levelTile`, function (sprite, location) {
    level += 1
    startLevel()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.confetti, 500)
    info.changeLifeBy(1)
})

function startLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)

    if (level > 3) {
        game.gameOver(true)
        return
    }

    SetUp()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.fire, 500)
    info.changeLifeBy(-1)
})

let currentjumps = 0
let playerSprite: Sprite = null
let endTile: Sprite = null
let collectible: Sprite = null
let enemy: Sprite = null
let level = 0
let list: number[] = []

level = 1
info.setLife(3)
startLevel()

game.onUpdate(function () {
    if (playerSprite.isHittingTile(CollisionDirection.Bottom)) {
        currentjumps = 0
    }
})
