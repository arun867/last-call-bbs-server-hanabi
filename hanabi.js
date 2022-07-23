let frameCount;
let drawingObjects;
let hanabiText = "*";

const width = 56;
const height = 20;

function getName()
{
    return 'Hanabi';
}

function onConnect()
{
    frameCount = 0;
    drawingObjects = [];

    addHanabi1(width/2, height);
}

function onUpdate()
{
    frameCount++;
    if(frameCount > 10000){
        frameCount = 0;
    }

    const spawnSpan = 150;
    if(frameCount % spawnSpan == 0){
        const marginX = 7;
        addHanabi1(Math.round(marginX + Math.random()*(width-(marginX*2))), height)
    }

    // 30fps/2 = 15fps
    if(frameCount % 2 == 0){
        return;
    }

    clearScreen();

    drawText("*", 17, width, height);

    drawAllObjects();
}

function onInput(key)
{
    const ALL_CHARS = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.,:;!?&#/\\%\'"0123456789+-*()[]^>`';
    let keyString = String.fromCharCode(key);
    if(ALL_CHARS.indexOf(keyString)!=-1){
        hanabiText = keyString;
    }
}

function drawAllObjects(){
    // remove dead items
    drawingObjects = drawingObjects.filter(function(item){
        return item.alive;
    });

    // limit the amount of the objects for safety
    const maxObjects = 100;
    if(drawingObjects.length > maxObjects){
        drawingObjects = drawingObjects.splice(0, maxObjects);
    }

    drawingObjects.forEach(function(obj){
        if(obj.isCompleted()){
            obj.alive = false;
            obj.onComplete();
            return;
        }
        if(obj.color < 0.5){
            obj.alive = false;
            return;
        }
        const gravity = 0.01;
        obj.dy = obj.dy*0.9 + gravity;
        obj.y += obj.dy;
        obj.dx *= 0.9;
        obj.x += obj.dx;

        obj.color += obj.dcolor;

        drawObject(obj);
        
        obj.lifetime += 1;
    });
}

function addHanabi1(x, y){
    addDrawingObject("^", 12, -0.7, x, y, 0, -1.6, 
        //isCompleted:
        function(){
            return this.color <= 1;
        },
        //onComplete:
        function(){
            //let chars = "******+++";
            //let text = chars[Math.floor(Math.random()*chars.length)];
            addHanabi2(hanabiText, this.x, this.y);
        }
    );
}

function addHanabi2(text, x, y){
    let color = 17;
    let dcolor = -0.25;
    // inner
    addParticlesOnCircle(text, color-10, dcolor, x, y, 0.75, 60);
    addParticlesOnCircle(text, color, dcolor, x, y, 1, 45);
    // outer
    addParticlesOnCircle(text, color-7, dcolor*2, x, y, 2, 25);
}

function addParticlesOnCircle(text, color, dcolor, x, y, r, degreeIncrement){
    const rad = Math.PI/180.0;
    const aspectRatio = 0.6;
    for(let deg=0; deg<360; deg+=degreeIncrement){
        let dx = r*Math.cos(rad*deg);
        let dy = r*aspectRatio*Math.sin(rad*deg);
        addDrawingObject(text, color, dcolor, x, y, dx, dy);
    }
}

function addDrawingObject(text, color, dcolor, x, y, dx, dy, isCompleted, onComplete){
    drawingObjects.push({
        "text": text,
        "color": color,
        "dcolor": dcolor,
        "x":x, "y":y,
        "dx":dx, "dy":dy,
        "isCompleted": isCompleted || function(){return false},
        "onComplete": onComplete || function(){},
        "lifetime": 0,
        "alive": true
    });
}

function drawObject(obj){
    drawText(obj.text, obj.color, obj.x, obj.y);
}
