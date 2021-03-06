/// <reference path="arrow.ts" />
/// <reference path="enemy.ts" />
/// <reference path="util.ts" />


class Game {
    public static instance:Game;
    private static gameWidth: number;
    private static gameHeigt: number;

    private player : Player;
    private playerX: number;
    private playerY: number;
    private playerHeight: number;
    private playerWidth: number;

    private enemies : Array<Enemy>;
    private spawnTimer: number;
    private spawnCooldown: number;

    private castle : Castle;

    public constructor() {
        Game.gameWidth = 800;
        Game.gameHeigt = 600;

        this.spawnTimer = 0;
        this.spawnCooldown = 300;

        this.castle = new Castle(0,536);

        this.playerHeight = 32;
        this.playerWidth = 32;

        this.playerX = Game.gameWidth / 2 - this.playerWidth / 2;
        this.playerY = Game.gameHeigt - this.playerHeight; 
        this.player = new Player(this.playerX,this.playerY);

        this.enemies = [];

        requestAnimationFrame(() => this.gameLoop());
    }

    public static getInstance(){
        if(!Game.instance){
            Game.instance = new Game();
        }
        return Game.instance;
    }

    private gameLoop(){
        //update player position and behaviour
        this.player.update();
        this.player.draw();

        this.spawnTimer++;

        //update the position for the arrows
        for(let i = 0; i < this.player.arrows.length; i++){
            this.player.arrows[i].update();
            this.player.arrows[i].draw();

            //check if arrow is out of the screen
            if(this.player.arrows[i].y < -32){
                //remove the arrow
                this.player.arrows[i].div.remove();
                let s : number = this.player.arrows.indexOf(this.player.arrows[i]);
                if(i != -1){
                    this.player.arrows.splice(s,1);
                }
            }

            for(let n = 0; n < this.enemies.length; n++){
                let obj1 = this.player.arrows[i];
                let obj2 = this.enemies[n];

                //check if the arrow still exists
                if (obj1 != null && obj2 != null){
                    if (Util.checkCollision(obj1,obj2)){
                        this.enemies[n].health -= this.player.damage;

                        //remove the enemy
                        if(this.enemies[n].health < 1){
                            this.enemies[n].div.remove();
                            let e : number = this.enemies.indexOf(this.enemies[n]);
                            if(i != -1){
                                this.enemies.splice(e,1);
                            }
                        }

                        //remove the arrow
                        this.player.arrows[i].div.remove();
                        let s : number = this.player.arrows.indexOf(this.player.arrows[i]);
                        if(i != -1){
                            this.player.arrows.splice(s,1);
                        }
                    }
                }
            }
            
        }

        //update the position of the enemies
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].update();
            this.enemies[i].draw();
        }

        //spawn an enemy if timer is above the cooldown delay
        if (this.spawnTimer > this.spawnCooldown)   {
            this.enemies.push(
                new Enemy(0,0)
            );
            this.spawnTimer = 0;
        }

        requestAnimationFrame(() => this.gameLoop());
    }
} 

//load
window.addEventListener("load", function() {
    Game.getInstance();
});