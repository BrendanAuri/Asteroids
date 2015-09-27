var startFrameMilliseconds = performance.now();
var endFrameMilliseconds = performance.now();

function getDeltaTime()
{
	endFrameMilliseconds = startFrameMilliseconds;
	startFrameMilliseconds = performance.now();
	
	var deltaTime = (startFrameMilliseconds - endFrameMilliseconds) * 0.001;
	
	if(deltaTime > 1)
	{
		deltaTime = 1;
	}
	
	return deltaTime;
}

function WaitForSeconds(seconds, deltaTime)
{
	return seconds -= deltaTime;
}

var canvas 	= document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var shooting = false;
var playerFireBomb = false;
var shootTimer = 0;
var bombTimer = 0;
var width 	= canvas.width;
var height 	= canvas.height;
var asteroidDead = false;
var isPaused = false;
var asteroidsToSpawn = 10;
var showCollision = false;
var screenWait = 3;
var spawnPU = false;
var bgImage = document.createElement("img");

bgImage.src = "AsteroidsArt/space.jpg";

var player = {
	image : document.createElement("img"),
	x : canvas.width / 2,
	y : canvas.height / 2,
	width : 35,
	height : 35,
	rotation : 0,
	speed : 350,
	turnSpeed : 2.5,
	isDead : false,
	directionX : 0,
	directionY : 0,
	lives : 3,
	bombs : 5,
	points : 0,
	fireRate : 3,
	angularVelocity : 0
};

function createSlider(x, y, id)
{
	var optSlider = {
		foreimage : document.createElement("img"),
		backimage : document.createElement("img"),
		y : y,
		x : x,
		max : x + 30,
		min : x,
		current : 0	
	};
}


var livesSprite = document.createElement("img");
livesSprite.src = "AsteroidsArt/livesSprite.png";

var life = {
	image : livesSprite,
	width : 10,
	height : 10,
	x : 0,
	y : 0,
	isDead : true
};

var asteroids = [];
var asteroidsKilled = asteroids.length.toString();
var stringOfAsteroids = Number(asteroidsKilled);

function spawnAsteroid(size, x, y)
{
	var asteroid = {
		image : document.createElement("img"),
		x : x,
		y : y,
		width : 64,
		height : 64,
		speed : 300,
		velocityX : (Math.random() - 0.5) * 300,
		velocityY : (Math.random() - 0.5) * 300,
		size : size,
		isDead : false
	};	
	if(asteroid.size >= 2)
	{
		asteroid.image.src = "AsteroidsArt/rock_large.png";
		asteroid.width = 64;
		asteroid.height = 64;
	}
	else if(asteroid.size >= 1)
	{
		asteroid.image.src = "AsteroidsArt/rock_medium.png";
		asteroid.width = 34;
		asteroid.height = 34;
	}
	else
	{
		asteroid.image.src = "AsteroidsArt/rock_small.png";
		asteroid.width = 10;
		asteroid.height = 10;
	}
	stringOfAsteroids = asteroids.length.toString();
	asteroids.push(asteroid);
}

var powerUps = [];

function spawnPowerUp(type, x, y)
{
	var powerUp = {
		image : document.createElement("img"),
		x : x,
		y : y,
		width : 34,
		height : 34,
		speed : 300,
		velocityX : (Math.random() - 0.5) * 300,
		velocityY : (Math.random() - 0.5) * 300,
		type : type,
		isDead : false
	};	
	if(powerUp.type >= 1)
	{
		powerUp.image.src = "AsteroidsArt/powerUp2.png";
		powerUp.width = 64;
		powerUp.height = 64;
	}
	else
	{
		powerUp.image.src = "AsteroidsArt/powerUp1.png";
		powerUp.width = 10;
		powerUp.height = 10;
	}
	
	powerUps.push(powerUp);
}

var bullets = [];


player.image.src = "AsteroidsArt/ship.png";

var gameoverImage = document.createElement("img");
gameoverImage.src = "AsteroidsArt/gameover.png";

var backgroundTile = document.createElement("img");
backgroundTile.src = "AsteroidsArt/bg_tile.png";

//Key Constants
var SPACE 		= 32;
var UP_ARROW 	= 38;
var DOWN_ARROW 	= 40;
var LEFT_ARROW 	= 37;
var RIGHT_ARROW = 39;
var W_KEY 		= 87;
var A_KEY 		= 65;
var S_KEY 		= 83;
var D_KEY 		= 68;
var R_KEY 		= 82;
var C_KEY		= 67;

var turningLeft = false;
var turningRight = false;

var konamiCode = [UP_ARROW, UP_ARROW, DOWN_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, LEFT_ARROW, RIGHT_ARROW, A_KEY];

function intersects(minx1, miny1, maxx1, maxy1,
					minx2, miny2, maxx2, maxy2)
{
	var result = true;
	if(maxx1 < minx2 || maxx2 < minx1 || maxy1 < miny2 || maxy2 < miny1)
	{
		result = false;
	}
	
	return result;
}
var restart = false;
function OnKeyDown(event)
{
	if(player.isDead === false)
	{
		if(event.keyCode === DOWN_ARROW) //Arrow Down
		{
			player.directionY = 1;
			player.directionX = 0;
		}
		
		else if(event.keyCode === UP_ARROW)	//Arrow Up
		{
			player.directionY = -1;
			player.directionX = 0;
		}
		
		else if(event.keyCode === RIGHT_ARROW)	//Arrow Right
		{
			turningRight = true;
			player.angularVelocity = player.turnSpeed;
		}
		
		else if(event.keyCode === LEFT_ARROW)	//Arrow Left
		{
			turningLeft = true;
			player.angularVelocity = -player.turnSpeed;
		}
			
		if(event.keyCode === SPACE && shootTimer <= 0)
		{
			shooting = true;
			//playerShoot();
		}
	}
	if(event.keyCode === R_KEY)
	{
		restart = true;
	}
}

function OnKeyUp(event)
{
	if(event.keyCode === DOWN_ARROW)		//Arrow Down
	{
		player.directionY = 0;
	}
	if(event.keyCode === UP_ARROW)			//Arrow Up
	{
		player.directionY = 0;
	}
	if(event.keyCode === RIGHT_ARROW)		//Arrow Right
	{
		turningRight = false;
		player.angularVelocity = 0;
	}
	if(event.keyCode === LEFT_ARROW)	//Arrow Left
	{
		turningLeft = false;
		player.angularVelocity = 0;
	}
	if(event.keyCode === SPACE)
	{
		shooting = false;
	}

	if(event.keyCode === W_KEY)
	{
		playerFireBomb = false;
	}

}
window.addEventListener('keyup', OnKeyUp);
window.addEventListener('keydown', OnKeyDown);

bullet_image = document.createElement("img");
bullet_image.src = "AsteroidsArt/bullet.png";

function playerShoot()
{
	var bullet = {
		image : bullet_image,
		x : player.x,
		y : player.y,
		width : 20,
		height : 20,
		velocityX : 0,
		velocityY : 0,
		isDead : false,
		speed : 1500
	};
	
	//figure out which way the player is facing and set the bullet's velocity to move in that direction.
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	
	var xDir = s;
	var yDir = -c;
	
	bullet.velocityX = xDir * bullet.speed;
	bullet.velocityY = yDir * bullet.speed;
	
	bullet.x = player.x;
	bullet.y = player.y;
	
	//set the bullet to be not dead
	bullet.isDead = false;
	bullets.push(bullet);
}

function playerBomb(deltaTime)
{
	for(var i = 0; i < 36; i++)
	{
		var bullet = {
			image : bullet_image,
			x : player.x,
			y : player.y,
			width : 20,
			height : 20,
			velocityX : 0,
			velocityY : 0,
			isDead : false,
			speed : 100
		};
		var s = Math.sin(i - deltaTime);
		var c = Math.cos(i + deltaTime);
		
		var xDir = s;
		var yDir = -c;
		
		bullet.velocityX = xDir * bullet.speed * Math.random(0, 20);
		bullet.velocityY = yDir * bullet.speed * Math.random(-20, 0);
		
		bullet.x = player.x;
		bullet.y = player.y;
		
		bullets.push(bullet);
	}

	//figure out which way the player is facing and set the bullet's velocity to move in that direction.
	
	bullet.isDead = false;
	player.bombs--;
}

function dropLife(inputAsteroid, x, y, deltaTime)
{
	life.x = x;
	life.y = y;
	var lastForSeconds = 30;
	var livesDropChance = Math.random() * 7;
	if(livesDropChance >= 5)
	{
		life.isDead = true;
	}
	
	if(life.isDead === false)
	{
		lastForSeconds -= deltaTime;
		var playerIntersectingLife = intersects(player.x - player.width / 2, player.y - player.height / 2,
												player.x + player.width / 2, player.y + player.height / 2,
												life.x - life.width / 2, life.y - life.height / 2,
												life.x + life.width / 2, life.y + life.height / 2);
		if(playerIntersectingLife === true)
		{
			if(!(lastForSeconds <= 0))
			{
				player.fireRate = 20;
			}
			life.isDead = true;
		}
		else
		{
			context.drawImage(life.image, life.x, life.y);
		}
	}
}


var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_PAUSED = 3;
var STATE_FRAME = 4;

var currentWave = 1;
var gameState = STATE_SPLASH;
var asteroidsAmount = 10;

function Run()
{
	var deltaTime = getDeltaTime();
	canvas.width = canvas.width;
	
	switch(gameState)
	{		
		case STATE_SPLASH:
		splashStateUpdate(deltaTime, asteroidsAmount);
		break;
		
		case STATE_GAME:
		gameStateUpdate(deltaTime);
		break;
		
		case STATE_GAMEOVER:
		break;
		
		case STATE_PAUSED:
		paused();
		break;
		
	}
}	

var splashTimer = 1.5;
var asteroidsLeft = 10;

function splashStateUpdate(deltaTime, asteroidCount)
{
	splashTimer -= deltaTime;
	var previousAsteroidsToSpawn = asteroidsLeft;
	
	if(splashTimer < 0)
	{
		gameState = STATE_GAME;
		player.lives--;
		//asteroidCount = 0;
	

	}
	
	if(currentWave > 1)
	{
		asteroidsLeft = asteroidCount;
	}
	else
	{
		asteroidsToSpawn = 10;
	}
	context.fillRect(0, 0, 1280, 720);
	context.fillStyle = "#00ff00";
	context.font = "16px Lucida Console";
			
	for(var a = 0; a < player.lives; a++)
	{
		context.drawImage(life.image, 50 + a * 28, 130);
	}
}


function respawnAsteroids(toSpawn)
{
	for (var i = 0; i < toSpawn; i++)
	{
		spawnAsteroid(Math.random() * 3, Math.random() * 3, Math.random() * 3);
	}
}

function respawnPowerUps(toSpawn)
{
	for (var i = 0; i < toSpawn; i++)
	{
		spawnPowerUp(Math.random() * 2, Math.random() * 3, Math.random() * 3);
	}
	
}


respawnAsteroids(10);

var showTenPoints = 2;
var showHundredPoints = 2;
var addTenPoints = false;
var addHundredPoints = false;

function pointsBeforeDeath()
{
	var points = player.points;
	return points;
}

function gameStateUpdate(deltaTime)
{	
	
	splashTimer = 2;

	if(!isPaused)
	{	

		context.drawImage(bgImage, 0, 0);
		
		if(turningLeft === true)
		{
			player.angularVelocity = -player.turnSpeed;
		}
		
		if(turningRight === true)
		{
			player.angularVelocity = player.turnSpeed;
		}
		//update the player position and rotation
		var s = Math.sin(player.rotation);
		var c = Math.cos(player.rotation);
		
		var xDir = -s * player.directionY;
		var yDir = c * player.directionY;
		
		var xVel = xDir * player.speed;
		var yVel = yDir * player.speed;
		
		player.x += xVel * deltaTime;
		player.y += yVel * deltaTime;
		
		player.rotation += player.angularVelocity * deltaTime * player.turnSpeed;
		
		for(var a = 0; a < player.lives; a++)
		{
			context.drawImage(life.image, 50 + a * 28, 135);
		}

		for(var i = 0; i < asteroids.length; i++)
		{
			if(asteroids[i].isDead === false)
			{
				asteroids[i].x += asteroids[i].velocityX * deltaTime;
				asteroids[i].y += asteroids[i].velocityY * deltaTime;
				
				context.drawImage(asteroids[i].image, asteroids[i].x - asteroids[i].width / 2, asteroids[i].y - asteroids[i].height / 2);
				if(player.isDead === false)
				{
					var playerIntersectingAsteroid = intersects(player.x - player.width / 2, player.y - player.height / 2,
																player.x + player.width / 2, player.y + player.height / 2,
																asteroids[i].x - asteroids[i].width / 2, asteroids[i].y - asteroids[i].height / 2,
																asteroids[i].x + asteroids[i].width / 2, asteroids[i].y + asteroids[i].height / 2);
					if(playerIntersectingAsteroid === true)
					{
						asteroids[i].isDead = true;

						for(var b = 0; b < asteroids.length; b++)
						{
							asteroids[b].x = Math.random() * 3;
							asteroids[b].y = Math.random() * 3;
							player.x = canvas.width / 2;
							player.y = canvas.height / 2;
							player.rotation = 0;
						}

						player.isDead = true;
					}
				
				}
				for (var j = 0; j < bullets.length; j++)
				{
					var bulletIntersectingAsteroid = intersects(bullets[j].x - bullets[j].width / 2, bullets[j].y - bullets[j].height / 2,
														bullets[j].x + bullets[j].width / 2, bullets[j].y + bullets[j].height / 2,
														asteroids[i].x - asteroids[i].width / 2, asteroids[i].y - asteroids[i].height / 2,
														asteroids[i].x + asteroids[i].width / 2, asteroids[i].y + asteroids[i].height / 2);
					if(bullets[j].isDead === false)
					{											
						if(bulletIntersectingAsteroid === true)
						{		
						
							player.points += 10;
							//console.log(player.points);
							addTenPoints = true;
							bullets[j].isDead = true;
							asteroids[i].size--;
							asteroids[i].velocityX = (Math.random() - 0.5) * 300;
							asteroids[i].velocityY = (Math.random() - 0.5) * 300;
							
							if(asteroids[i].size >= 2)
							{
								player.points += 20;
							}
							
							if(asteroids[i].size < 0)
							{
								asteroidsLeft = (asteroidsToSpawn -= 1);
								asteroids[i].isDead = true;
								player.points += 40;
								if(showHundredPoints <= 0)
								{
									showHundredPoints = 2;
									context.drawImage(hundredPointsImage, asteroids[i].x, asteroids[i].y);
								}
									
								spawnAsteroid(Math.random() * 3, Math.random() * 3, Math.random() * 3);
							}
							
							if(asteroids[i].size >= 2)
							{
								asteroids[i].image.src = "AsteroidsArt/rock_large.png";
								asteroids[i].width = 64;
								asteroids[i].height = 64;
							}
							else if(asteroids[i].size >= 1)
							{
								asteroids[i].image.src = "AsteroidsArt/rock_medium.png";
								asteroids[i].width = 34;
								asteroids[i].height = 34;
								spawnAsteroid(1.5, asteroids[i].x, asteroids[i].y);
							}
							else
							{
								asteroids[i].image.src = "AsteroidsArt/rock_small.png";
								asteroids[i].width = 10;
								asteroids[i].height = 10;
							}
							
						}
					}
					else
					{
						bullets.splice(j, 1);
						
						break;
					}
				}
			}
			else
			{
				dropLife(asteroids[i], asteroids[i].x, asteroids[i].y, deltaTime);
			}
			
			
			if(asteroids[i].x > canvas.width + asteroids[i].width / 2)
			{
				asteroids[i].x = -(asteroids[i].width / 2);
			}
			
			if(asteroids[i].x < -(asteroids[i].width / 2))
			{
				asteroids[i].x = canvas.width + asteroids[i].width / 2;
			}
			
			if(asteroids[i].y > canvas.height + asteroids[i].height / 2)
			{
				asteroids[i].y = -(asteroids[i].height / 2);
			}
			
			if(asteroids[i].y < -(asteroids[i].height / 2))
			{
				asteroids[i].y = canvas.height + asteroids[i].height / 2;
			}
			
			asteroids[i].speed += 3 / deltaTime;
			
		}
		
		
		for(var x = 0; x < powerUps.length; x++)
		{
			if(powerUps[x].isDead === false)
			{
				
				powerUps[x].x += powerUps[x].velocityX * deltaTime;
				powerUps[x].y += powerUps[x].velocityY * deltaTime;
				
				context.drawImage(powerUps[x].image, powerUps[x].x - powerUps[x].width / 2, powerUps[x].y - powerUps[x].height / 2);
				
				if(powerUps[x].x > canvas.width + powerUps[x].width / 2)
				{
					powerUps[x].x = -(powerUps[x].width / 2);
				}
				
				if(powerUps[x].x < -(powerUps[x].width / 2))
				{
					powerUps[x].x = canvas.width + powerUps[x].width / 2;
				}
				
				if(powerUps[x].y > canvas.height + powerUps[x].height / 2)
				{
					powerUps[x].y = -(powerUps[x].height / 2);
				}
				
				if(powerUps[x].y < -(powerUps[x].height / 2))
				{
					powerUps[x].y = canvas.height + powerUps[x].height / 2;
				}
				
			}
		}
		
		if(player.x > canvas.width + player.width / 2)
		{
			player.x = -(player.width /2);
		}
		
		if(player.x < -(player.width /2))
		{
			player.x = canvas.width + player.width / 2;
		}
		
		if(player.y > canvas.height + player.height / 2)
		{
			player.y = -(player.width /2);
		}
		
		if(player.y < -(player.height /2))
		{
			player.y = canvas.height + player.height / 2;
		}
		for (var j = 0; j < bullets.length; j++)
		{
			if(bullets[j].isDead === false)
			{
				bullets[j].x += bullets[j].velocityX * deltaTime;
				bullets[j].y += bullets[j].velocityY * deltaTime;
				context.drawImage(bullets[j].image, bullets[j].x - 2, bullets[j].y - 2);
				
				
				if(bullets[j].x > canvas.width || bullets[j].x < 0 || bullets[j].y > canvas.height || bullets[j].y < 0)
				{	
					bullets.splice(j, 1);
				
					break;
				}
			}
		}

		shootTimer -= deltaTime;
		bombTimer -= deltaTime;
		
		if(playerFireBomb && bombTimer < 0)
		{
			bombTimer = 1 / player.fireRate;
			playerBomb(deltaTime);
		}
		if(shooting && shootTimer < 0)
		{
			shootTimer = 1/player.fireRate;
			playerShoot();
		}
		
		if(player.isDead === false)
		{
			restart = false;
			context.save();
				context.translate(player.x, player.y);
				context.rotate(player.rotation);
				context.drawImage(player.image, -player.image.width / 2, -player.image.height / 2);
			context.restore();
			
			context.font = "16px Lucida Console";
			context.fillStyle = "#00ff00";
			
		}
		else
		{
			context.font = "48px Lucida Console";
			context.fillStyle = "#00ff00";
			if(stringOfAsteroids > 0)
			{
				stringOfAsteroids--;
			}
			for(var a = 0; a < player.lives; a++)
			{
				context.drawImage(life.image, 50 + a * 28, 135);
			}
			
			context.drawImage(gameoverImage, 0, 0);
			shooting = false;
			player.rotation = 0;
			player.x = width / 2;
			player.y  = height / 2;
			screenWait -= deltaTime;

			if(player.lives >= 1)
			{
				if(restart && player.isDead === true)
				{				
					if(screenWait <= 0)
					{
						screenWait = 3;
						gameState = STATE_SPLASH;
						player.x = canvas.width / 2;
						player.y = canvas.height / 2;
						context.save();
							context.translate(player.x, player.y);
							context.rotate(player.rotation);
							context.drawImage(player.image, -player.image.width / 2, -player.image.height / 2);
						context.restore();
						
						asteroids.splice(0, asteroids.length);
						respawnAsteroids(10);
						
						
						context.font = "16px Lucida Console";
						context.fillStyle = "#00ff00";
						
						
						
						player.points = 0;
						player.isDead = false;
					}
				}
			}
			else
			{
				context.font = "16px Lucida Console";
				context.fillStyle = "#00ff00";
				
			}
			
			for (var j = 0; j < bullets.length; j++)
			{
				bullets.splice(j, 1);
			}
		} 
	}
}

(function() {
	var onEachFrame;
	if (window.requestAnimationFrame) {
		onEachFrame = function(cb) {
		var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
		_cb();
		};
	} else if (window.mozRequestAnimationFrame) {
	onEachFrame = function(cb) {
		var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
		_cb();
		};
	} else {
		onEachFrame = function(cb) {
			setInterval(cb, 1000 / 60);
		}
	}
	window.onEachFrame = onEachFrame;
	}
)();
window.onEachFrame(Run);

function Magnitude(x, y) 
{
	return Math.sqrt(x^2 + y^2);
}

function Normalize(length)
{
	return length / length;
}
