const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameActive = true;

const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 300,
    speed: 5,
    img: new Image()
};
player.img.src = 'https://cdn-icons-png.flaticon.com/512/3233/3233508.png';

const enemies = [];
const enemyImg = new Image();
enemyImg.src = 'https://cdn-icons-png.flaticon.com/512/2534/2534884.png';

function spawnEnemy() {
    if (!gameActive) return;
    enemies.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        size: 40,
        speed: 3 + Math.random() * 4
    });
    setTimeout(spawnEnemy, 1500);
}

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    if (!gameActive) return;

    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - 50) player.y += player.speed;

    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;

        if (
            player.x < enemy.x + enemy.size &&
            player.x + 50 > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + 40 > enemy.y
        ) {
            gameActive = false;
            alert("Game Over! Scor final: " + score);
            location.reload();
        }

        if (enemy.x + enemy.size < 0) {
            enemies.splice(index, 1);
            score++;
            scoreElement.innerText = score;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "cyan";
    ctx.drawImage(player.img, player.x, player.y, 50, 40);
    ctx.restore();

    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2);
        ctx.rotate(Date.now() / 1000);
        ctx.drawImage(enemyImg, -enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
        ctx.restore();
    });

    update();
    requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', () => {
    spawnEnemy();
    draw();
});