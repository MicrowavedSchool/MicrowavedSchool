var programCode = function(processingInstance) {
  with (processingInstance) {
    
    size(600, 600);
    frameRate(30);
    
    //----------------------------------------------
    var Level = 2;
    var MapLocation = [0, 1];
    var l = (Level - 1);
    var globalHealth = 5;
    var keys = {};
    keyPressed = function() {
      keys[keyCode] = true;
    };
    keyReleased = function() {
      delete keys[keyCode];
    };

    var rectCollide = function(obj1, obj2) {
      return ((obj1.x + obj1.width + 0.1 > obj2.x) && (obj1.x < obj2.x + obj2.width + 0.1) && (obj1.y + obj1.height > obj2.y) && (obj1.y < obj2.y + obj2.height));
    };
    var fourSliceCollide = function(obj1, obj2) {
      var box1 = function() {
        this.x = obj2.x + 0.25 * obj2.width;
        this.width = 0.5 * obj2.width;
        this.y = obj2.y - 0.05 * obj2.height;
        this.height = 0.25 * obj2.height;
        //fill(255, 0, 0);
        //rect(this.x, this.y, this.width, this.height);
      }
      Box1 = new box1();
      var box2 = function() {
        this.x = obj2.x + 0.55 * obj2.width;
        this.width = 0.5 * obj2.width;
        this.y = obj2.y + 0.25 * obj2.height;
        this.height = 0.5 * obj2.height;
        //fill(0, 205, 205);
        //rect(this.x, this.y, this.width, this.height);
      }
      Box2 = new box2();
      var box3 = function() {
        this.x = obj2.x + 0.25 * obj2.width;
        this.width = 0.5 * obj2.width;
        this.y = obj2.y + 0.25 * obj2.height;
        this.height = 0.85 * obj2.height;
        //fill(0, 0, 255);
        //rect(this.x, this.y, this.width, this.height);
      }
      Box3 = new box3();
      var box4 = function() {
        this.x = obj2.x - 0.05 * obj2.width;
        this.width = 0.50 * obj2.width;
        this.y = obj2.y + 0.25 * obj2.height;
        this.height = 0.5 * obj2.height;
        //fill(0, 255, 0);
        //rect(this.x, this.y, this.width, this.height);
      }
      Box4 = new box4();


      if (rectCollide(Box1, obj1))
        return 1;
      if (rectCollide(Box2, obj1))
        return 2;
      if (rectCollide(Box4, obj1))
        return 4;
      if (rectCollide(Box3, obj1))
        return 3;

      return 0;
    };
    //} Colliders

    var punchingGlove = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.parentX = config.parentX;
      this.parentY = config.parentY;
      this.xDisplacement = 0;
      this.yDisplacement = 0;
      this.width = config.width || 10;
      this.height = config.height || 10;
      this.punchSpeed = 3;
      this.punchMax = false;
      this.punchSet = false;
      this.punchDir = 0;
    }
    punchingGlove.prototype.display = function() {
      this.x = this.parentX + this.xDisplacement;
      this.y = this.parentY;
      fill(255, 255, 0);
      rect(this.x, this.y, this.width, this.height);
    }
    punchingGlove.prototype.punch = function() {
      if (this.xDisplacement == 0) {
        this.punchSet = true;
        this.punchMax = false;
      }
      else
        this.punchSet = false;

      if (Math.abs(this.xDisplacement) > 25)
        this.punchMax = true

      switch (this.punchDir) {
        case 0:
          if (keys[80]) {
            if (!this.punchMax)
              this.xDisplacement += 10;
            else
              this.xDisplacement -= 5;
            if (this.xDisplacement <= 0)
              this.xDisplacement = 0;
          }
          else {
            this.xDisplacement -= 5;
            if (this.xDisplacement <= 0)
              this.xDisplacement = 0;
          }
          break;
        case 1:
          if (keys[80]) {
            if (!this.punchMax)
              this.xDisplacement -= 10;
            else
              this.xDisplacement += 5;
            if (this.xDisplacement >= 0)
              this.xDisplacement = 0;
          }
          else {
            this.xDisplacement += 5;
            if (this.xDisplacement >= 0)
              this.xDisplacement = 0;
          }
          break;

      }
    }

    var player = function(config) {
      this.name = "player";
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 15;
      this.height = config.height || 15;
      this.complete = config.complete || false;
      this.regress = config.regress || false;
      this.mapLevelUp = config.MapLevelUp || false;
      this.mapLevelDown = config.MapLevelDown || false;
      this.dead = config.dead || false;
      this.climbing = config.climbing || false;
      this.punch = new punchingGlove(this.x, this.y);

      this.health = config.health || globalHealth;
      this.iTik = 0;
      this.canDouble = false;
      this.canClimb = false;

      this.checkpoint = 0;
      this.xkb = 0;
      this.xVelocity = 0;
      this.yVelocity = 5;
      this.yAcceleration = 0.2;
      this.jumpCharge = 1;
    };
    player.prototype.display = function() {
      fill(255, 255, 255);
      rect(this.x, this.y, this.width, this.height);
      if (globalHealth > 0)
        this.heath = globalHealth;
      else
        this.dead = true;
      fill(255, 0, 0);
      rect(20, 25, globalHealth * 25, 10);

      this.punch.parentX = this.x + 0.15 * this.width;
      this.punch.parentY = this.y + 0.15 * this.height;
      this.punch.display();
      this.punch.punch();

      this.iTik -= 1;
      if (this.iTik <= 0)
        this.iTik = 0;

      if (this.x >= 600) {
        this.complete = true;
      }
      if (this.x <= 0 && (Level - 1) > this.checkpoint) {
        this.regress = true;
      }
      if (this.y < 0)
        this.MapLevelUp = true;
      if (this.y > 610)
        this.MapLevelDown = true;
      this.checkpoint = Math.floor((Level - 1) / 10)
    }
    player.prototype.moveX = function() {
      if (keys[65] && keys[68]) {
        this.xVelocity = 0;
      }
      else if (keys[65]) {
        this.xVelocity -= 7.5;
        this.punch.punchDir = 1;
      }
      else if (keys[68]) {
        this.xVelocity += 7.5;
        this.punch.punchDir = 0;
      }
      else {
        this.xVelocity = 0;
      }

      this.xkb -= 0.5 * this.xkb;
      if (Math.abs(this.xkb) < 0.25) {
        this.xkb = 0;
      }

      if (this.xVelocity > 5.5) {
        this.xVelocity = 5.5;
      }
      if (this.xVelocity < -5.5) {
        this.xVelocity = -5.5;
      }

      for (var i = 0; i < 10; i += 1) {
        this.x += this.xVelocity / 10;
      }
      //this.x += this.xVelocity + this.xkb;
    };
    player.prototype.moveY = function() {
      if (keys[87] && this.jumpCharge > 0 && this.yVelocity > 0) {
        this.yVelocity = -15;
        this.jumpCharge -= 1;
      }

      if (keys[83] && this.yVelocity < 9) {
        this.yVelocity += 2;
      }


      if (this.yVelocity < 9) {
        this.yAcceleration = 2.25;
      } else {
        this.yAcceleration = 0;
      }

      this.y += this.yVelocity;
      this.yVelocity += this.yAcceleration;
    };
    player.prototype.collide = function(object) {
      if ((rectCollide(this.punch, object) || fourSliceCollide(this.punch, object) != 0) && object.iTik <= 0 && this.punch.xDisplacement != 0) {
        object.health -= 1;
        object.stunTime = 1;
        if (this.punch.punchDir == 0) {
          object.x += 5;
        }
        else {
          object.x -= 5;
        }
      }
    };

    var Players = [];
    //{
    var block = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 15;
      this.height = config.height || 15;
    };
    block.prototype.display = function() {
      noStroke();
      fill(255, 255, 255);
      rect(this.x, this.y, this.width, this.height);
    };
    block.prototype.collideX = function(object) {
      if (rectCollide(this, object)) {
        switch (fourSliceCollide(object, this)) {
          case 2:
            object.x = this.x + 1.2 * this.width;
            if (keys[65]) {
              if (object.canClimb) {
                object.yVelocity = 0;
                if (object.canDouble)
                  object.jumpCharge = 2;
                else
                  object.jumpCharge = 1;
              }
            }
            break;
          case 4:
            object.x = this.x - (0.3 * this.width) - object.width;
            if (keys[68]) {
              if (object.canClimb) {
                object.yVelocity = 0;
                if (object.canDouble)
                  object.jumpCharge = 2;
                else
                  object.jumpCharge = 1;
              }
            }
            break;
        }
      }
    };
    block.prototype.collideY = function(object) {
      switch (fourSliceCollide(object, this)) {
        case 1:
          object.y = this.y - object.height - 0.05 * this.height;
          object.yVelocity = 0;
          if (object.canDouble)
            object.jumpCharge = 2;
          else
            object.jumpCharge = 1;
          break;
        case 3:
          object.y = this.y + 1.1 * this.height;
          object.yVelocity = 0;
          break;
      }
    };

    var Blocks = [];

    var pushBlock = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.iTik = 0;
      this.width = config.width || 15;
      this.height = config.height || 15;
    };
    pushBlock.prototype.display = function() {
      this.iTik = 0;
      noStroke();
      fill(125, 255, 125);
      rect(this.x, this.y, this.width, this.height);
    };
    pushBlock.prototype.collideX = function(object) {
      if (rectCollide(this, object)) {
        this.xVelocity = 0;
        switch (fourSliceCollide(object, this)) {
          case 2:
            object.x = this.x + 1.2 * this.width;
            if (keys[65]) {
              if (object.canClimb) {
                object.yVelocity = 0;
                if (object.canDouble)
                  object.jumpCharge = 2;
                else
                  object.jumpCharge = 1;
              }
            }
            break;
          case 4:
            object.x = this.x - (1.2 * this.width);
            if (keys[68]) {
              if (object.canClimb) {
                object.yVelocity = 0;
                if (object.canDouble)
                  object.jumpCharge = 2;
                else
                  object.jumpCharge = 1;
              }
            }
            break;
        }
      }
    };
    pushBlock.prototype.collideY = function(object) {
      switch (fourSliceCollide(object, this)) {
        case 1:
          object.y = this.y - object.height - 0.05 * this.height;
          object.yVelocity = 0;
          if (object.canDouble)
            object.jumpCharge = 2;
          else
            object.jumpCharge = 1;
          break;
        case 3:
          object.y = this.y + 1.1 * this.height;
          object.yVelocity = 0;
          break;
      }
    };

    var pushBlocks = [];

    var lavaBlock = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 15;
      this.height = config.height || 15;
    };
    lavaBlock.prototype.display = function() {
      noStroke();
      fill(255, 0, 0);
      rect(this.x, this.y, this.width, this.height);
    };
    lavaBlock.prototype.collide = function(object) {
      if (rectCollide(this, object)) {
        object.dead = true;
      }
    };
    var lavaBlocks = [];

    var shot = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 15;
      this.height = config.height || 15;
      this.rotation = config.rotation || 0;
      this.speed = config.speed || 5;
      this.isActive = true;
    };
    shot.prototype.resetTimer = function(parent, newRotation, newSpeed) {
      this.x = parent.x + (0.5 * parent.width);
      this.y = parent.y + (0.5 * parent.height);
      this.rotation = newRotation;
      this.speed = newSpeed;
      this.isActive = true;
    };
    var bulletManager = function(bullets) {
      for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].isActive == false) {
          return i;
        }
      }
      return -1;
    }
    shot.prototype.shotMove = function() {
      this.x += this.speed * Math.cos(this.rotation);
      this.y += this.speed * Math.sin(this.rotation);

      if (this.x < -50 || this.x > 650 || this.y < -50 || this.y > 650) {
        this.isActive = false;
      }
    }
    shot.prototype.collide = function(object) {
      if (rectCollide(this, object)) {
        if (object.name == "player" && object.iTik <= 0) {
          object.iTik = 128;
          globalHealth -= 1;
        }
      }
    }

    var abyssEnemy = function(config) {
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 45;
      this.height = config.height || 45;
      this.health = config.health || 250;

      this.iTik = 0;
      this.chasing = false;

      this.chaseTime = 0;
      this.chaseSet = config.chaseSet || false;
      this.patience = config.patience || 200;
      this.bullets = [];
      this.icebeams = [];
      this.shotLength = 8;
      this.shotCd = 0;
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.poi = [0, 0];
      this.stunTime = 0;
      this.img = loadImage("bat2.png");
      this.img2 = loadImage("bat.png");
    };
    abyssEnemy.prototype.display = function() {
      this.y = constrain(this.y, 20, height - this.height);
      this.x = constrain(this.x, 10, width - (this.width));

      noStroke();
      fill(255, 0, 0);
      rect(20, 50, this.health * 2, 15);
      rect(this.x, this.y, this.width, this.height);
      if (Math.atan2(this.poi[1], this.poi[0]) > -Math.PI / 2 && Math.atan2(this.poi[1], this.poi[0]) <= Math.PI / 2)
        image(this.img2, this.x - 90, this.y - 75, this.width + 180, this.height + 110);
      else
        image(this.img, this.x - 80, this.y - 55, this.width + 150, this.height + 80);

      for (var shotNum = 0; shotNum < this.bullets.length; shotNum++) {
        if (this.bullets[shotNum].isActive === true) {
          rect(this.bullets[shotNum].x - 2.5, this.bullets[shotNum].y + 2.5, this.bullets[shotNum].width + 5, this.bullets[shotNum].height + 5);

        }
        this.bullets[shotNum].shotMove();
      }

      for (var iceNum = 0; iceNum < this.icebeams.length; iceNum++) {

        if (this.icebeams[iceNum].isActive === true) {
          fill(0, 128, 255)
          rect(this.icebeams[iceNum].x, this.icebeams[iceNum].y, this.icebeams[iceNum].width, this.icebeams[iceNum].height);
        }
        this.icebeams[iceNum].shotMove();
      }
    };
    abyssEnemy.prototype.collide = function(object) {
      if (rectCollide(object, this) != 0) {
        if (object.name == "player" && object.iTik <= 0) {
          object.iTik = 128;
          globalHealth -= 1;
        }
      }
    };
    abyssEnemy.prototype.shoot = function(object) {
      //var randomness = random(Math.PI, 0);
      var randomness = 0;
      for (var i = 0; i < this.shotLength; i++) {
        if (this.bullets.length != 0) {
          if (bulletManager(this.bullets) != -1) {

            this.bullets[bulletManager(this.bullets)].resetTimer(this, ((2 * Math.PI / this.shotLength) * (i + 1)) + randomness, 5);
          }
          else {
            this.bullets.push(new object({
              x: this.x + 0.5 * this.width,
              y: this.y + (0.5 * this.height),
              rotation: ((2 * Math.PI / this.shotLength) * i),
              speed: 5,
            }));
          }
        }
        else {
          for (var i = 0; i < this.shotLength; i++) {
            this.bullets.push(new object({
              x: this.x + 0.5 * this.width,
              y: this.y + (0.5 * this.height),
            }));
            this.bullets[i].resetTimer(this, (2 * Math.PI / this.shotLength) * i, 5);
          }
        }
      }
    };
    abyssEnemy.prototype.ai = function(object) {
      if (this.stunTime <= 0) {
        var thisCoordinates = [this.x + (0.5 * this.width), this.y + (0.5 * this.height)];
        var playerCoordinates = [object.x + (0.5 * object.width), object.y + (0.5 * object.height)];
        var vector = [2];
        vector = [playerCoordinates[0] - thisCoordinates[0], playerCoordinates[1] - thisCoordinates[1]];
        var angle = Math.atan2(vector[1], vector[0]);
        var dist = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
        this.poi = [vector[0], vector[1]];

        if (this.chaseSet == false) {
          if (object.y > this.y || this.y > 200) {
            this.xVelocity = 5 * Math.cos(angle);
            this.yVelocity = 5 * Math.sin(angle);
          }
          else {
            this.patience = 0;
          }
          //this.patience -= 1;

          if (this.patience <= 0) {
            if (object.y > this.y || this.y > 150) {
              this.xVelocity = 2.5 * Math.cos(angle);
              this.yVelocity = 2.5 * Math.sin(angle);
            }
            else {
              this.xVelocity = -2.5 * Math.cos(angle);
              this.yVelocity = -2.5 * Math.sin(angle);
            }
            this.chaseTime = random(50, 100);
            if (this.y > 60) {
              this.xVelocity = -2.5 * Math.cos(angle);
              this.yVelocity = -2.5 * Math.sin(angle);
            }
            if (this.y < 500) {
              this.xVelocity = 2.5 * Math.cos(angle);
              this.yVelocity = 2.5 * Math.sin(angle);
            }
            this.chaseSet = true;
            this.chasing = false;
          }
        }
        else {
          this.chasing = true;
          this.chaseTime -= 1;
          if (this.x > 505 || this.x < 15) {
            this.xVelocity = -this.xVelocity;
            this.yVelocity = -this.yVelocity;
          }
          if (this.y > 459 || this.y < 75) {
            this.xVelocity = -this.xVelocity;
            this.yVelocity = -this.yVelocity;
          }
          if (this.chaseTime <= 0) {
            this.patience = random(200, 350);
            this.chaseSet = false;
          }
        }
      }
      else {
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.stunTime -= 1;
      }

      if (dist > 50) {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
      }
      else {
        this.x += this.xVelocity / 4;
        this.y += this.yVelocity / 4;
      }

      if (this.shotCd <= 0 && !this.chasing) {
        this.shoot(shot);
        this.shotLength = random(6, 12);
        this.shotCd = random(20, 60);
      }
      this.shotCd -= 1;
    };

    AbyssEnemies = [];

    var gruntEnemy1 = function(config){
      this.x = config.x;
      this.y = config.y;
      this.width = config.width || 45;
      this.height = config.height || 45;
      this.health = config.health || 50;
      this.img = loadImage("Ant.png");
      this.img2 = loadImage("Ant2.png");

      this.xVelocity = 0;
      this.yVelocity = 0;
      this.poi = [0, 0];
      this.stunTime = 0;
      this.jumping = false;
    }

    gruntEnemy1.prototype.display = function(){
      this.y = constrain(this.y, 20, height - this.height);
      this.x = constrain(this.x, 10, width - (this.width));

      fill(255,255,255);
      rect(this.x,this.y,this.width,this.height);
      if (Math.atan2(this.poi[1], this.poi[0]) > -Math.PI / 2 && Math.atan2(this.poi[1], this.poi[0]) <= Math.PI / 2)
        image(this.img2, this.x - 0, this.y - 0, this.width + 0, this.height + 0);
      else
        image(this.img, this.x - 0, this.y - 0, this.width + 0, this.height + 0);

      noStroke();
    }

    gruntEnemy1.prototype.move = function(pos1,pos2){
      

      if (this.yVelocity < 9) {
        this.yAcceleration = 2.25;
      } else {
        this.yAcceleration = 0;
      }

      this.x += this.xVelocity;
      this.y += this.yVelocity;
      this.yVelocity += this.yAcceleration;
    }
      
    gruntEnemy1.prototype.jump = function(){
      if(this.jumping){
        this.yVelocity -= 7;
        this.jumping = false;
      }
    }

    var LevelLevelMap = [
      {
        map: [
          "45138",
          "12671",
          "04444",
        ],
      },
    ];
    var LevelMap = [
      {
        Level: 1,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "     @                         ######   ",
          "                                ####    ",
          "                   #######       ##     ",
          "                    #####        ##     ",
          "##############       ####         #     ",
          "############         ####         ##    ",
          " #####  ###          ###          ##    ",
          "  ###   ###          ###          ##    ",
          "   ##   ##          #####         ##    ",
          "    #    #         #######       ####   ",


        ],
      },
      {
        Level: 2,
        map: [
          "                                        ",
          "                #                       ",
          "                #                       ",
          "                #                       ",
          "               #                        ",
          "              #                         ",
          "        #                               ",
          "        ##                              ",
          "        ###                             ",
          "        ####                            ",
          "        #####                           ",
          "                                        ",
          "                                        ",
          "                 ####                   ",
          "                  #####                 ",
          "                   ####                 ",
          "                   ###                  ",
          "                   ###                  ",
          "                   ###                  ",
          "                   ###                  ",
          "                   ##                   ",
          "                   ##                   ",
          "                    #                   ",
          "                    #                   ",
          "                    ##                  ",
          "                    ##                  ",
          "                    ##                  ",
          "                    ##                  ",
          "                   ###                  ",
          "                  #####                 ",
          "                                        ",
          "              #                         ",
          "             ##               #####     ",
          "            ###                ####     ",
          " @         ####      #####      ###     ",
          "                      ###        ##     ",
          "#########             ###         #     ",
          "## #####              ##                ",
          "#    ##               ##                ",
          "#     #               ###               ",


        ],
      },
      {
        Level: 3,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "###                                     ",
          "##                                      ",
          "#                                       ",
          "#                                       ",
          "#                                       ",
          "#                                       ",
          "#                                       ",
          "#                           #######     ",
          "#                              #######  ",
          "#                   ####         ###### ",
          "##           ###      ###        #######",
          "######      @ #        ##         ######",
          "##########             ###        ######",
          "###########             ####     #######",
          " #####  ####            ################",
          "  ###   ######         #################",
          "   ##    #######     ###################",


        ],
      },
      {
        Level: 4,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                    @                   ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "########################################",
          "#####    ##     ##     ##   ############",
          "######    ##     ##     ##    ##########",
          " #######################################",
          "   ###                         ##  #####",
          "    ##                         #    ####",
        ],
      },
      {
        Level: 5,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                       #",
          "                                       #",
          "                                       #",
          "                                      ##",
          "                                      ##",
          "                                     ###",
          "                                    ####",
          "                                   #####",
          "                                 #######",
          "                       @      ##########",
          "                          ##############",
          "###############     ####################",
          "#####    ##            ##   ############",
          "######    ##            ##    ##########",
          " ############         ###################",
          "   ###                         ##  #####",
          "    ##                         #    ####",
        ],
      },
      {
        Level: 6,
        map: [
          "                                        ",
          "      #                                 ",
          "       ###                              ",
          "       ##                               ",
          "       ##                               ",
          "        #                               ",
          "        #                               ",
          "                                        ",
          "               #                        ",
          "                ####                     ",
          "                 ##                     ",
          "                       ####             ",
          "                      ####              ",
          "                      ###               ",
          "                       ##               ",
          "                        #               ",
          "                        #               ",
          "                       #                ",
          "          #####        #                ",
          "           ######     #                 ",
          "            ####                        ",
          "            ####                        ",
          "            ###                         ",
          "             ##                         ",
          "             ##                         ",
          "              #                         ",
          "              #                         ",
          "                                        ",
          "                                        ",
          "   @                                    ",
          "                  #####                 ",
          "                   ###               ###",
          "                   #           #########",
          "            ####            #   ###   ##",
          "#########    ##          ###       #  ##",
          "########                  ##           #",
          "######                                 #",
          " ###                                    ",
          " ##                                     ",
          " #                                      ",



        ],
      },
      {
        Level: 7,
        map: [
          "                   ##       #           ",
          "                   ###      #           ",
          "                   #####    #           ",
          "                   #        #           ",
          "                   #        #           ",
          "                   #       ##           ",
          "                   #        #           ",
          "                   #    ##  #           ",
          "                   #        #           ",
          "                   #        #           ",
          "                   ###      #           ",
          "                   ##       #           ",
          "                   #       ##           ",
          "                   #      ###           ",
          "                   #                    ",
          "                   #                    ",
          "                   #                    ",
          "                   ##                   ",
          "                   ##                   ",
          "                   ###                  ",
          "                   #                    ",
          "                   #      ###           ",
          "                   #       ##           ",
          "                   #        #           ",
          "                   #        #           ",
          "                   ###      #           ",
          "                   ##       ##          ",
          "                  ##        ##          ",
          "                  #####     ##          ",
          "                  ##        ###         ",
          "                 ###      #####         ",
          "    @           ####       #####        ",
          "                            ######      ",
          "                            #########   ",
          "########################################",
          "#################       ################",
          "######  ####    ##      ##   ###########",
          " ####   ###      ##    ##     ##########",
          "   ##   ##      #  ## #        ##  #####",
          "    #    #     #     ##        #    ####",



        ],
      },
      {
        Level: 8,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                ####                    ",
          "                 ##                     ",
          "                                        ",
          "                                        ",
          "          ###                           ",
          "          ##                            ",
          "          ##                            ",
          "           #                            ",
          "                                        ",
          "                                        ",
          "                                        ",
          "#                                       ",
          "###                                     ",
          "#########                               ",
          "######         ###                      ",
          "##              ####                    ",
          "#                ##                     ",
          "                 #                      ",
          "                 #                      ",
          "                                        ",
          "                                        ",
          "          ####                          ",
          "           ##                           ",
          "           ##                           ",
          "            #                    ####   ",
          "                                  ##    ",
          "                        ####       #    ",
          "                         ##             ",
          "                ###                     ",
          "                 #                      ",
          "  @                                     ",
          "                                        ",
          "          #####                         ",
          "           ###                          ",
          "######                                  ",
          "#####                                   ",
          "#                                       ",



        ],
      },
      {
        Level: 0,
        map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                    @                   ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "      &                                 ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "###############           ##############",
          "#############               ############",
          "######  ###                   ##########",
          " ####   ###                   ##########",
          "   ##   ##                     ##  #####",
          "    #    #                     #    ####",



        ],
      },
    ];

    var LevelPicker = function() {
      for (var columnNum = 0; columnNum < LevelLevelMap[0].map.length; columnNum++) {
        for (var rowNum = 0; rowNum < LevelLevelMap[0].map[columnNum].length; rowNum++) {
          Level = LevelLevelMap[0].map[MapLocation[1]][MapLocation[0]];
        }
      }
      console.log(MapLocation);
    }

    var LevelRestart = function() {
      Level != 0 ? l = (Level - 1) : l = LevelMap.length - 1;
      Players[l] = [];
      Blocks[l] = [];
      AbyssEnemies[l] = [];
      pushBlocks[l] = [];
      lavaBlocks[l] = [];
      for (var columnNum = 0; columnNum < LevelMap[l].map.length; columnNum++) {
        for (var rowNum = 0; rowNum < LevelMap[l].map[columnNum].length; rowNum++) {
          var Y = columnNum * 15;
          var X = rowNum * 15;

          switch (LevelMap[l].map[columnNum][rowNum]) {
            case "@":
              Players[l].push(new player({
                x: X,
                y: Y,
                dead: false,
                complete: false,
                MapLevelUp: false,
                MapLevelDown: false,
              }));
              break;
            case "#":
              Blocks[l].push(new block({
                x: X,
                y: Y,
              }));
              break;
            case "$":
              pushBlocks[l].push(new pushBlock({
                x: X,
                y: Y,
              }));
              break;
            case "%":
              lavaBlocks[l].push(new lavaBlock({
                x: X,
                y: Y,
              }));
              break;
            case "&":
              AbyssEnemies[l].push(new abyssEnemy({
                x: X,
                y: Y,
              }));
              break;
          }
        }
      }
    };
    LevelPicker();
    LevelRestart();


    draw = function() {
      background(0, 0, 0);
      for (var blockNum = 0; blockNum < Blocks[l].length; blockNum++) {
        Blocks[l][blockNum].display();
      }
      for (var pushBlockNum = 0; pushBlockNum < pushBlocks[l].length; pushBlockNum++) {
        pushBlocks[l][pushBlockNum].display();
      }
      for (var lavaBlockNum = 0; lavaBlockNum < lavaBlocks[l].length; lavaBlockNum++) {
        lavaBlocks[l][lavaBlockNum].display();
      }

      for (var abyssEnemies = 0; abyssEnemies < AbyssEnemies[l].length; abyssEnemies++) {
        if(AbyssEnemies[l][abyssEnemies].health > 0){
          AbyssEnemies[l][abyssEnemies].display();
        }
      }
      for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
        Players[l][playerNum].display();
        if (Players[l][playerNum].complete && Level != 0) {
          MapLocation[0] += 1;
          LevelPicker();
          LevelRestart();
        }
        if (Players[l][playerNum].regress && Level != 0) {
          MapLocation[0] -= 1;
          LevelPicker();
          LevelRestart();
        }
        if (Players[l][playerNum].MapLevelUp && Level != 0) {
          MapLocation[1] -= 1;
          LevelPicker();
          LevelRestart();
        }
        else if (Players[l][playerNum].MapLevelUp) {
          globalHealth = 5;
          LevelRestart();
        }
        if (Players[l][playerNum].MapLevelDown && Level != 0) {
          MapLocation[1] += 1;
          LevelPicker();
          LevelRestart();
        }
        else if (Players[l][playerNum].MapLevelDown) {
          globalHealth = 5;
          LevelRestart();
        }
        if (Players[l][playerNum].dead) {
          globalHealth = 5;
          LevelRestart();
        }
      }
      for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
        Players[l][playerNum].moveX();
        Players[l][playerNum].moveY();
      }

      for (var blockNum = 0; blockNum < Blocks[l].length; blockNum++) {
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          Blocks[l][blockNum].collideX(Players[l][playerNum]);
        }
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          Blocks[l][blockNum].collideY(Players[l][playerNum]);
          //Players[l][playerNum].collide(Blocks[l][blockNum]);

        }
      }

      for (var pushBlockNum = 0; pushBlockNum < pushBlocks[l].length; pushBlockNum++) {
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          pushBlocks[l][pushBlockNum].collideX(Players[l][playerNum]);
        }
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          pushBlocks[l][pushBlockNum].collideY(Players[l][playerNum]);
          Players[l][playerNum].collide(pushBlocks[l][pushBlockNum]);
        }
      }

      for (var abyssEnemyNum = 0; abyssEnemyNum < AbyssEnemies[l].length; abyssEnemyNum++) {
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          if(AbyssEnemies[l][abyssEnemyNum].health > 0){
          Players[l][playerNum].collide(AbyssEnemies[l][abyssEnemyNum]);
          AbyssEnemies[l][abyssEnemyNum].collide(Players[l][playerNum]);
          AbyssEnemies[l][abyssEnemyNum].ai(Players[l][playerNum]);
          }
        }
      }

      for (var lavaBlockNum = 0; lavaBlockNum < lavaBlocks[l].length; lavaBlockNum++) {
        for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
          lavaBlocks[l][lavaBlockNum].collide(Players[l][playerNum]);
        }
      }

      for (var abyssEnemyNum = 0; abyssEnemyNum < AbyssEnemies[l].length; abyssEnemyNum++) {
        for (var shotNum = 0; shotNum < AbyssEnemies[l][abyssEnemyNum].bullets.length; shotNum++) {
          for (var playerNum = 0; playerNum < Players[l].length; playerNum++) {
            if(AbyssEnemies[l][abyssEnemyNum].health > 0)
              AbyssEnemies[l][abyssEnemyNum].bullets[shotNum].collide(Players[l][playerNum]);
          }
        }
      }


    }
    //----------------------------------------------
  }
};
const Canvas = document.createElement("canvas");
document.body.appendChild(Canvas);
const canv = Canvas.getContext("2d");
var processingInstance = new Processing(Canvas, programCode);
