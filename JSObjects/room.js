/*global Rule*/
function Room(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "room_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.entrance = [];
    this.works = {}; // actions
    this.inhabitants = {};
//    this.pathentryLevel = {}; // to fileter who can access to the room with go to
    this.pathEntry = "";
    this.pathEntryLevel = 0;
}

Room.DREAMING_NEIGHBOURGS = 2.9;
Room.DREAMING_NEIGHBOURGS_DEPTH = 3;

// TODO
// create()
Room.prototype.getNeighbours = function (deep) {
    "use strict";
    var neighbours = [],
        level = 0;
    neighbours[level] = [];
    for (var neighbour in this.entrance) {
        neighbours[level].push(this.entrance[neighbour]);
    }
    if (deep !== undefined) {
        while (deep-- > 0) {
            level++;
            neighbours[level] = [];
            for (neighbour in neighbours[level - 1]) {
                var rooms = neighbours[level - 1][neighbour].getNeighbours();
                for (var roomNumber in rooms[0]) {
                    var room = rooms[0][roomNumber];
                    var newneighbour = true;
                    for (var i = 0; i < level; i++) {
                        if (room in neighbours[level]) {
                            newneighbour = false;
                        }
                    }
                    if (newneighbour){
                        neighbours[level].push(room);
                    }
                }
            }
        }
    }
    return neighbours;
};

Room.prototype.setEntrances = function (rooms) {
    "use strict";
    if (rooms !== undefined) {
        this.entrance = rooms.slice();
    }
    return this;
};

Room.prototype.dreamNeighbours = function () {
    "use strict";
    var totalRooms = Math.floor(Math.random() * Room.DREAMING_NEIGHBOURGS) + 1; 
    if (this.entrance.length === 0) {
        var neighbours = this.getNeighbours(Room.DREAMING_NEIGHBOURGS_DEPTH);
        for (var i = 0; i < totalRooms; i++){
            var newroom = Math.random() * Room.DREAMING_NEIGHBOURGS;
            if (neighbours[0].length >= newroom) {
                this.entrance.push(neighbours[0][Math.floor(newroom)]);
            } else if (neighbours[1].length >= newroom) {
                this.entrance.push(neighbours[1][Math.floor(newroom)]);
            } else if (neighbours[2].length >= newroom) {
                this.entrance.push(neighbours[2][Math.floor(newroom)]);
            } else {
                this.entrance.push(new Room());
            }
        }
    }
    return this;
}


// resume()

// getD3Map()

/*
Room.ruleSet = {
    "go": new Rule(condition, reaction),
    "work": new Rule(condition, reaction)
};
*/
var condition = "L.pathLikehood[R.pathEntry] >= D.pathEntryLevel[R.pathEntry]";
var reaction = "D.inhabitants[L.id] = L; S.inhabitants[L.id] = null;";
Room.ruleSet.go = new Rule(condition, reaction);

Room.prototype.getRules = function () {
    'use strict';
    return Room.ruleSet;
};
