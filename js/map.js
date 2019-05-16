const unit = 15;

// initial values
const mapCols = 50;
const mapRows = 35;
const displayInfo = false;

const divJoints = document.querySelector('.map-wrap .joints');
const divRoads = document.querySelector('.map-wrap .roads');

class Field {
    constructor() {
        this.jointNumber = -1;
    }
    addJoint(jointNumber, neighbours) {
        this.jointNumber = jointNumber;
        this.neighbours = neighbours;
    }
}

const drawRoad = ( [startY, startX], [endY, endX] ) => {
    const road = document.createElement('div');
//    console.log(startY + ', ' + startX + ', ' + endX + ', ' + endY);
    const roadLength = Math.sqrt(Math.pow(endY-startY, 2) + Math.pow(endX-startX, 2));
    road.classList.add('road');
    road.style.width = (unit * roadLength) + 'px';
//    console.log(roadLength);
    
    
    let rotate = 0;
    let triangleHorizotal = true;
    // specify quarter
    if (startY <= endY && startX < endX) { // I quarter
        // rotate = 0;        
    }
    else if (startY < endY && startX >= endX) { // II quarter
        rotate = 90;
        triangleHorizotal = false;
    }
    else if (startY >= endY && startX > endX) { // III quarter
        rotate = 180;
    }
    else { // IV quarter
        rotate = 270;
        triangleHorizotal = false;
    }
    
    let catheusOne = Math.abs(endX - startX);
    let catheusTwo = Math.abs(endY - startY);
    if (!triangleHorizotal) {
        catheusOne = Math.abs(endY - startY);
        catheusTwo = Math.abs(endX - startX);
    }
    
    const rad = Math.atan(catheusTwo / catheusOne); // additional rotate in radians
    const deg = rad * (180 / Math.PI);
    rotate += deg;
    
    road.style.transform = `rotate(${rotate}deg)`;
    road.style.top = `${startY*unit + 7}px`;
    road.style.left = `${startX*unit + 7}px`;
    
    return road;
}

class Map {
    constructor(cols = mapCols, rows = mapRows) {
        this.map = this.mapInit(cols, rows);
        this.roads = this.roadsInit();
        this.joints = this.jointsInit();
        this.mapRender();
    }
    mapInit(cols, rows) {
        const map = [];
        for(let i = 0; i < mapRows; i++) {
            const row = [];
            for(let j = 0; j < mapCols; j++) {
                const field = new Field();                
                row.push(field);
            }
            map.push(row);
        }        
        return map;
    }
    roadsInit() {
        const roads = [ // [start][end]
            [ [3,4], [10,5] ],
            [ [3,4], [6,15] ],
            [ [6,15], [10,5] ],
            [ [6,15], [14,18] ],
            [ [6,15], [17,15] ],
            [ [20,4], [10,5] ],
            [ [20,4], [17,15] ],
            [ [14,18], [17,15] ],
            [ [10,5], [15,10] ],
            [ [17,15], [15,10] ],
            [ [20,4], [15,10] ],          
            [ [7,22], [6,15] ],
            [ [7,22], [14,18] ],
            [ [2,12], [3,4] ],
            [ [2,12], [6,15] ],
            [ [2,12], [2,20] ],
            [ [2,20], [7,22] ]
        ];
        return roads;
    }
    addRoad( coordinates ) {
        console.log(coordinates);
        this.roads.push( coordinates );
        console.log(this.roads);
        this.joints = this.jointsInit();
        this.mapRender();
    }
    jointsInit() {
        let joints = [
//            [ [3,4], [1,2] ], 
//            [ [10,5], [0,2] ], 
//            [ [6,15], [0,1,3] ],
//            [ [14,18], [2] ],
        ];
        
        // create joints array based on roads array
        this.roads.forEach( road => {
            [0,1].forEach( point => { // check every start and end of road
                const match = joints.find( joint => { // check if point is already in joints array
                    return road[point][0] == joint[0][0] && road[point][1] == joint[0][1];
                });
                if (!match) { // if not, add this point
                    joints.push( [ road[point], [ /* neighbours */ ] ]);
                }
            });
        });
        
        // add neighbours to joints
        this.roads.forEach( (road, roadIndex) => {
            const startPoint = road[0];
            const endPoint = road[1];
            
            const startIndex = joints.findIndex( joint => {
                return startPoint[0] == joint[0][0] && startPoint[1] == joint[0][1];
            });
            const endIndex = joints.findIndex( joint => {
                return endPoint[0] == joint[0][0] && endPoint[1] == joint[0][1];
            });
            
            // add neighbour to both start and end joint
            joints[startIndex][1].push(endIndex);
            joints[endIndex][1].push(startIndex);
        });
        
        console.log(joints);
        
        joints.forEach( (joint, jointIndex) => {
            const row = joint[0][0];
            const col = joint[0][1];
            this.map[row][col].jointNumber = jointIndex;
            this.map[row][col].neighbours = joint[1];
        });
        
        return joints;
    }
    mapRender() {
        divJoints.innerHTML = '';
        divRoads.innerHTML = '';
        
        const rows = this.map.length;
        const cols = this.map[0].length;
        
        // draw map with joints
        this.map.forEach( (row, rowIndex) => {
            const divRow = document.createElement('div');
            divRow.classList.add('row');
            row.forEach( (field, fieldIndex) => {
                const divField = document.createElement('div');
                divField.classList.add('field');
                
                if(field.jointNumber >= 0) {
                    const divJoint = document.createElement('div');
                    divJoint.classList.add('joint');
                    divJoint.innerHTML = `<span>${field.jointNumber}</span>`;
                    divField.appendChild(divJoint);
                }
                divField.addEventListener('click', function() {
                    console.log(rowIndex, fieldIndex);
                });
                divRow.appendChild(divField);
            });
            divJoints.appendChild(divRow);
        });
        
        // draw roads
        this.roads.forEach( road => {
            const divRoad = drawRoad( [road[0][0], road[0][1]], [road[1][0], road[1][1] ] );
            divRoads.appendChild(divRoad);
        });
        
    }
}

const map = new Map();