// set variables
let currentjumps = 0
let playerSprite: Sprite = null
let endTile: Sprite = null
let collectible: Sprite = null
let enemy: Sprite = null
let num = 1
let level = 1
let jumpNumber = 2
let gravity = 600
let jumpheight = 48
let attacklength = 350
let attackcooldown = 100

// set up music
music.play(music.createSong(assets.song`mySong`), music.PlaybackMode.LoopingInBackground)

// arrays with enemy and key images
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

// create new spritekinds
namespace SpriteKind {
    export const key = SpriteKind.create();
    export const PlayerSword = SpriteKind.create();
}

// get a random collectible from an array 
function randomCollectible() {
    let collectibles = [

        assets.image`getlife`,
        assets.image`getcollectible`,
        assets.image`getcoin`,
        assets.image`chest`

    ]
    return collectibles._pickRandom()

}

// make placeholders and set up each sprite with its properties
function setUp(enemyImage: Image) {
    for (let value of tiles.getTilesByType(assets.tile`enemyTile`)) {
        enemy = sprites.create(enemyImage, SpriteKind.Enemy)
        tiles.placeOnTile(enemy, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        enemy.vx = 50
        enemy.setBounceOnWall(true)

    }
    for (let value2 of tiles.getTilesByType(assets.tile`foodTile`)) {
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
        // player input and program output
        controller.moveSprite(playerSprite, 100, 0)
        playerSprite.ay = gravity
        playerSprite.setStayInScreen(true)
        scene.cameraFollowSprite(playerSprite)
    }
}

// control jumping
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentjumps < jumpNumber) {
        playerSprite.vy = -Math.sqrt(2 * (gravity * jumpheight))
        currentjumps += 1
    }
})
// find the correct key for the level
function findKey() {
    return keys[level - 1]
}
// get life when overlap food
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.confetti, 500)
    info.changeLifeBy(1)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
})
// change levels when reach end tile w/ key
sprites.onOverlap(SpriteKind.Player, SpriteKind.key, function (sprite, otherSprite) {
    level += 1
    startLevel()
    music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.UntilDone)
})
// start level with correct sprites and tilemap, win when game over
function startLevel() {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.key)
    // tilemaps and arrays
    let tilemaps = [
        tilemap`level1`,
        tilemap`level2`,
        tilemap`level3`
    ]

    if (level > 3) {
        return game.gameOver(true)
    }

    let image = enemies[level - 1]
    tiles.setCurrentTilemap(tilemaps[level - 1])
    setUp(image)
}
// lose life when run into enemies
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.fire, 500)
    info.changeLifeBy(-1)
    music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.UntilDone)
})

//set up game
scene.setBackgroundImage(assets.image`cloudyBackground`)

info.setLife(3)
startLevel()

// function with return values and parameters
function getOverlappingByKind(sprite: Sprite, kind: number) {
    // use protected engine method to efficiently get overlapping sprites
    const map = (game.currentScene().physicsEngine as any).map as sprites.SpriteMap;
    return map.neighbors(sprite).filter(s => s.kind() === kind).filter(s => s.overlapsWith(sprite));
}

// allow sword attack when press b button
let Attacking = false
let CanAttack = true
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Attacking || !CanAttack) { return }

    Attacking = true;
    CanAttack = false;
    setTimeout(() => {
        Attacking = false
        pause(attackcooldown) // we can just pause here bc this is a coroutine
        CanAttack = true
    }, attacklength)

    pause(100)
    let sword = sprites.create(img`
        3 3
        3 3
    `, SpriteKind.PlayerSword)

    sword.changeScale(16, ScaleAnchor.Middle)

    sword.x = playerSprite.x + FacingDirection * 20
    sword.y = playerSprite.y

    const hitEnemies = getOverlappingByKind(sword, SpriteKind.Enemy)
    sword.destroy()

    for (const sprite of hitEnemies) {
        sprites.destroy(sprite, effects.fire, 100)
    }


})


const AnimationMap = {
    "SetType": "position",

    "grounded": {
        "left": {
            "moving": assets.animation`playerWalkLeft`,
            "idle": assets.animation`playerIdleLeft`,
        },
        "right": {
            "moving": assets.animation`playerWalkRight`,
            "idle": assets.animation`playerIdleRight`,
        }
    },
    "attacking": {
        "left": assets.animation`playerAttackLeft`,
        "right": assets.animation`playerAttackRight`,
    },
    "falling": { // TODO: make falling animations
        "left": assets.animation`playerWalkLeft`,
        "right": assets.animation`playerWalkRight`,
    },
}

let CurrentLoopingAnimation: Image[] = assets.animation`playerIdleRight`
let CurrentLoopSpeed = 100
let CurrentAnimation: Image[] = []
function playAnimation(anim: Image[], speed: number, loop: boolean) {
    if (anim == CurrentLoopingAnimation || anim == CurrentAnimation) { return }

    if (loop) {
        CurrentLoopingAnimation = anim
        CurrentLoopSpeed = speed
    }

    //if (CurrentAnimation.length != 0) {return}

    animation.runImageAnimation(playerSprite, anim, speed, loop)
    if (loop) { return }
    CurrentAnimation = anim

    // setTimeout is used because pause() will literally yield the game update since i can't make this function async

    setTimeout(() => {
        CurrentAnimation = []
        animation.runImageAnimation(playerSprite, CurrentLoopingAnimation, CurrentLoopSpeed, true)
    }, speed * anim.length)
}

let FacingDirection = 1;
function updateAnimation() {
    if (VelocityDirection != 0) { FacingDirection = VelocityDirection }

    let grounded = playerSprite.isHittingTile(CollisionDirection.Bottom)

    let anims: any = AnimationMap[Attacking ? "attacking" : (grounded ? "grounded" : "falling")] // ternary chain go
    let anim: any = anims[FacingDirection == 1 ? "right" : "left"]

    if (!Array.isArray(anim)) {
        anim = anim[VelocityDirection == 0 ? "idle" : "moving"]
    }
    playAnimation(anim, 100, !Attacking)
}

let VelocityDirection = 0
let Grounded = true
let LastAttacking = false
game.onUpdate(function () {
    // conditional statements
    if (!playerSprite) { return }

    let grounded = playerSprite.isHittingTile(CollisionDirection.Bottom)
    if (grounded) {
        currentjumps = 0
    }

    let vd = Math.sign(playerSprite.vx)
    if (vd == VelocityDirection && grounded == Grounded && LastAttacking == Attacking) { return }
    VelocityDirection = vd
    Grounded = grounded
    LastAttacking = Attacking

    updateAnimation()
})