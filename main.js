'use strict'
const game = new Phaser.Game(1800, 900, Phaser.AUTO,'game-canvas', { preload, create, update })

// Assets
var bg
var player
var bullet
var enemy

// Groups
var bullets
var enemies

// Text
var helpText
var scoreText
var winText
var gameOverText
var time

// Keys
let wKey
let sKey
let spaceBar

// Text Syles
var textStyle = { font: 'Arial Black', fontSize:  17, fill: '#b8b8b8' }
var scoreStyle = { font: 'Arial Black', fontSize: 19, fill: '#ffffff'}
var winStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}
var gameOverStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}
var timeStyle = { font: 'Arial Black', fontSize: 32, fill: '#ffffff'}

// Parametres
    // Float and Int
    var movementSpd = 5
    var bulletTime = 0
    var points = 0
    var sec = 0
    var min = 0
    var counter = 0

    // Bool
    var CanMove = true
    var GameOver = false
    var Win = false
//-----------------------------------------------------------------------------------------------------------------

// Other
var enemyTween


function preload() 
{
    game.load.image("bg", "bg.1.jpg") // Loading Background
    game.load.image("plr", "ship_2.png") // Loading Player
    game.load.image("enemy", "aleanspceship.png") // Loading Enemy
    game.load.image("bullet", "bullet.png") // Loading Projectile
}

function create() 
{
    //      Background
    bg = game.add.image(0, 0, "bg")
    bg.scale.setTo(.5, .5)
    
    //     Player
    addingPlayer() 


    //     Bullet Group
        bulletGroup()
    
    
    //Enemy Group
        enemyGroup()
        createEnemies()
    /* --------------------------------- */

    //    Other
        // Keyboard Inputs
        keyInputs()

        // Text
        createTxt()
    /* ----------------- */
}

//-----------------------------------------------------------------------------------------------------------------
function update() 
{
    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this)

    if (CanMove)
    {
        // Press W Key to move up
        if (wKey.isDown)
        {  player.y -= movementSpd  }

        // Press D Key to move down
        else if (sKey.isDown)
        {  player.y += movementSpd;  }

        // Press Space to Fire ()
        if (spaceBar.isDown) 
        {  fireBullet()  }
    }

    getTime()

    if (!GameOver)
    {  winTxtPopup()  }
    else if (GameOver && !Win)
    {  gameOverTxtPopup()  }

}

// Adding Player
function addingPlayer()
{
    player = game.add.sprite(350, 200, "plr")
    player.scale.setTo(.5, .5)
    player.anchor.setTo(.5)
    player.angle = 90
    game.physics.enable(player, Phaser.Physics.ARCADE)
}


                                        /*Bullet Group and Fireing function */

    // Bullet Group
    function bulletGroup()
    {
        bullets = game.add.group()
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE
        bullets.createMultiple(30, "bullet")

        bullets.setAll("anchor.x", 1)
        bullets.setAll("anchor.y", 1)
        
        bullets.setAll("angle", 90)
        
        bullets.setAll("outOfBoundsKill", true)
        bullets.setAll("checkWorldBounds", true)    
    }

    // Fireing Bullets function
    function fireBullet()
    {
        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false)

            if (bullet)
            {
                bullet.reset(player.x + 30, player.y)
                bullet.body.velocity.x = 700
                bulletTime = game.time.now + 200
            }
        }
    }

//-----------------------------------------------------------------------------------------------------------------


                                    /*Enemy Group and Enemies */

    // Enemy Group
    function enemyGroup()
    {
        enemies = game.add.group()
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE
    }

    // Enemies
    function createEnemies()
    {
        for (var y = 0; y < 5; y++)
        {
            for (var x = 0; x < 3; x++)
            {
                enemy = enemies.create(x * 290, y * 120, "enemy")
                enemy.anchor.setTo(.5)
                enemy.scale.setTo(.2)
                enemy.angle = 270
            }

            enemies.x = 1050
            enemies.y = 100

            enemyTween = game.add.tween(enemies). to({y: 290}, 1500, 
                Phaser.Easing.Linear.None, true, 0, 1000, true)
        }
    }

//-----------------------------------------------------------------------------------------------------------------


                                     /*------ Other -------*/

    // Keys
    function keyInputs()
    {
        // S, D(movemant)
        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
        sKey = game.input.keyboard.addKey(Phaser.Keyboard.S)

        // Space(shooting key)
        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }

    // Text
    function createTxt()
    {
        helpText = game.add.text(10, 10, 
            "Press W to move Up \nPress S to move Down \nPress Spacebar to shoot", 
            textStyle)
        scoreText = game.add.text(1500, 40, "Score : ", scoreStyle)
        time = game.add.text(740, 40, "Time : ", timeStyle)
        winText = game.add.text(game.world.centerX, game.world.centerY, 
            "You Win!", winStyle)
        gameOverText = game.add.text(game.world.centerX, game.world.centerY,
            "You lose!", gameOverStyle)
        
        winText.visible = false
        gameOverText.visible = false

        winText.anchor.setTo(.5)
        gameOverText.anchor.setTo(.5)
    }

    // You Win PopUP
    function winTxtPopup()
    {
        scoreText.text = "Score : " + points
        
        if (points == 1500 && !Win)
        {
            CanMove = false 
            winText.visible = true
            scoreText.visible = false
            Win = true
        }
    }

    // You lose PoPUP
    function gameOverTxtPopup()
    {
        if (GameOver)
        {
            CanMove = false
            winText.visible = false
            scoreText.visible = false
            gameOverText.visible = true
        }
    }

    function getTime() 
    {
        if (!Win)
        {
            counter++
        }

        sec = Math.round(counter / 60)

        if (!Win) 
        {
            if (sec > 10)
            {
                GameOver = true
                counter = 0
                CanMove = false
            }
        }


        if (!GameOver)
        {
            if (sec > 60)  
            { sec = 0; counter = 0;  min++ }

            let timer = ''

            if (min < 10) 
            { timer += '0' + min } 
            else 
            { timer += min }

            timer += ':'

            if (sec < 10) 
            { timer += '0' + sec } 
            else 
            { timer += sec }

            time.setText('Timer: ' + timer) 
        }
        else { time.setText('Timer: 00:00') }
    }

    // Collision
    function collisionHandler(bullet, enemy)
    {   
        bullet.kill()
        enemy.kill()

        points += 100
    }

//-----------------------------------------------------------------------------------------------------------------
