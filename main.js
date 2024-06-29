function randInRange(min, max) {
    return Math.floor(Math.random() * (max-min) + min)
}
function getRandomCell(width, height, cellSize) {
    return [Math.round(randInRange(0, width) / cellSize) * cellSize, 
        Math.round(randInRange(0, height) / cellSize) * cellSize]
}

const DIRECTION = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

class Snake {
    bodyPartList = []
    direction = DIRECTION.RIGHT
    constructor(x,y) {
        let head = {x:x, y:y}
        this.addBodyPart(head);
    }
    addBodyPart(part) {
        this.bodyPartList.push({x: part.x, y: part.y})
    }
    getLength() {
        return this.bodyPartList.length
    }
    getHead() {
        return this.bodyPartList[0];
    }
    getTail() {
        return this.bodyPartList[this.getLength() - 1]
    }
}

function main() {
    let score = 0
    let canvas = document.getElementById("game_area");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let cellSize = 30;
    let context = canvas.getContext('2d');
    let fontSize = 48
    context.font = `${fontSize}px monospace`
    let apple = getRandomCell(canvas.width, canvas.height,cellSize)
    let snake = new Snake(0,0);
    setInterval(() => {
        context.clearRect(0,0,canvas.width,canvas.height)
        context.fillStyle = "red";
        context.fillRect(...apple, cellSize, cellSize)
        context.fillStyle = "black";
        snake.bodyPartList.forEach(function(element, index) {
            if(apple[0] + cellSize >= canvas.width || apple[1] + cellSize >= canvas.height) {
                apple = getRandomCell(canvas.width, canvas.height, cellSize)
            }
            let list = snake.bodyPartList
            let tailIndex = list.length - 1;
            if(element.x == list[tailIndex].x && element.y == list[tailIndex].y && index < tailIndex) {
                alert(`Вы проиграли! Ваш счет: ${score}`)
                score = 0
                list.splice(0, tailIndex);
                snake = new Snake(0,0)
            }
        });
        let head = snake.getHead()
        let tail = snake.getTail()
        let newTail = {x: head.x, y: head.y}
        switch(snake.direction) {
            case DIRECTION.UP:
                newTail.x = Math.round(tail.x / cellSize) * cellSize
                newTail.y = tail.y - cellSize;
                break;
            case DIRECTION.DOWN:
                newTail.x = Math.round(tail.x / cellSize) * cellSize
                newTail.y = tail.y + cellSize;
                break;
            case DIRECTION.RIGHT:
                newTail.x = tail.x + cellSize
                newTail.y = Math.round(tail.y / cellSize) * cellSize
                break;
            case DIRECTION.LEFT:
                newTail.x = tail.x - cellSize
                newTail.y = Math.round(tail.y / cellSize) * cellSize
                break;
        }
        snake.addBodyPart(newTail)
        snake.bodyPartList.splice(0,1)
        snake.bodyPartList.forEach(function(element, index) {
            if(snake.direction == DIRECTION.UP && element.y < 0) element.y = Math.round(canvas.height / cellSize) * cellSize
            if(snake.direction == DIRECTION.DOWN && element.y > Math.round(canvas.height / cellSize) * cellSize) element.y = 0
            if(snake.direction == DIRECTION.LEFT && element.x < 0) element.x = Math.round(canvas.width / cellSize) * cellSize
            if(snake.direction == DIRECTION.RIGHT && element.x > Math.round(canvas.width / cellSize) * cellSize) element.x = 0

            if(element.x == apple[0] && element.y == apple[1]) {
                apple = getRandomCell(canvas.width, canvas.height, cellSize);
                snake.bodyPartList.unshift({x: newTail.x - cellSize, y: tail.y})
                score++;
            }
            context.fillRect(element.x, element.y, cellSize, cellSize);
        })
        const text = `Score: ${score}`
        const textMetrics = context.measureText(text)
        const paddingTop = 16
        context.fillText(text, canvas.width / 2 - textMetrics.width / 2, paddingTop + fontSize)
        
    }, 1000/15)
    onkeydown = function(e) {
        let key = e.key;
        if(["w","a","s","d"].indexOf(key) >= 0) e.preventDefault();
        if(key == "w" && snake.direction != DIRECTION.DOWN) snake.direction = DIRECTION.UP
        if(key == "a" && snake.direction != DIRECTION.RIGHT) snake.direction = DIRECTION.LEFT
        if(key == "s" && snake.direction != DIRECTION.UP) snake.direction = DIRECTION.DOWN
        if(key == "d" && snake.direction != DIRECTION.LEFT) snake.direction = DIRECTION.RIGHT
    }
}

main()