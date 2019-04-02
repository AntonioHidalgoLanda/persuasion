/*global Rule, Inhabitant*/
function Room(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "room_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.entrance = {};
    this.works = {}; // actions
    this.inhabitants = {};
//    this.pathentryLevel = {}; // to fileter who can access to the room with go to
    this.pathEntry = "";
    this.pathEntryLevel = 0;
}

Room.DREAMING_NEIGHBOURGS = 2.9;
Room.DREAMING_NEIGHBOURGS_DEPTH = 3;

Room.nodes = {};
Room.links = {};

Room.prototype.getName = function () {
    "use strict";
    return (this.hasOwnProperty("textName")) ? this.textName : this.id;
};

/* Interaction with other rooms*/
Room.prototype.setEntrance = function (room) {
    "use strict";
    if (!Room.nodes.hasOwnProperty(room.id)) {
        Room.nodes[room.id] = room;
    }
    if (!Room.nodes.hasOwnProperty(this.id)) {
        Room.nodes[this.id] = this;
    }
    if (!Room.links.hasOwnProperty(this.id)) {
        Room.links[this.id] = {};
    }
    if (!Room.links[this.id].hasOwnProperty(room.id)) {
        Room.links[this.id][room.id] = room.id;
    }
    if (!Room.links.hasOwnProperty(room.id)) {
        Room.links[room.id] = {};
    }
    if (!Room.links[room.id].hasOwnProperty(this.id)) {
        Room.links[room.id][this.id] = this.id;
    }
    if (!this.entrance.hasOwnProperty(room.id)) {
        this.entrance[room.id] = room;
    }
    if (!room.entrance.hasOwnProperty(this.id)) {
        room.entrance[this.id] = this;
    }
    
    return this;
};

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

Room.prototype.dreamNeighbours = function () {
    "use strict";
    var totalRooms = Math.floor(Math.random() * Room.DREAMING_NEIGHBOURGS) + 1;
    if (Object.keys(this.entrance).length <= 1) {
        var neighbours = this.getNeighbours(Room.DREAMING_NEIGHBOURGS_DEPTH);
        for (var i = 0; i < totalRooms; i++){
            var newroom = Math.random() * Room.DREAMING_NEIGHBOURGS;
            if (neighbours[0].length >= newroom) {
                this.setEntrance(neighbours[0][Math.floor(newroom)]);
            } else if (neighbours[1].length >= newroom) {
                this.setEntrance(neighbours[1][Math.floor(newroom)]);
            } else if (neighbours[2].length >= newroom) {
                this.setEntrance(neighbours[2][Math.floor(newroom)]);
            } else {
                this.setEntrance(new Room());
            }
        }
    }
    return this;
}

Room.prototype.dreamNeighbouhood = function () {
    this.dreamNeighbours();
    for (var roomId in this.entrance) {
        this.entrance[roomId].dreamNeighbours();
    }
    return this;
};

/* interaction with inhabitants */
Room.prototype.enter = function (inhabitant) {
    "use strict";
    if (inhabitant.hasOwnProperty("currentRoom")) {
        inhabitant.currentRoom.inhabitants[inhabitant.id] = null;
    }
    inhabitant.currentRoom = this;
    this.inhabitants[inhabitant.id] = inhabitant;
    
    return this;
};

Room.prototype.enterGroup = function (group) {
    "use strict";
    for (var inhabitant in group) {
        if (group[inhabitant] instanceof Inhabitant) {
            this.enter(group[inhabitant]);
        }
    }
    return this;
};

/* D3 Map Functions */
Room.prototype.getD3SjonMap = function () {
    'use strict';
    var i = 0;
    var reverseNode = {};
    var jsonMap = {
        "nodes": [],
        "links": []
    };
    
    for (var nodeid in Room.nodes) {
        var node = Room.nodes[nodeid];
        jsonMap.nodes[i] = {"name": node.getName(), "occupants": Object.keys(node.inhabitants).length, "current": (this === node)};
        reverseNode[nodeid] = i++;
    }
    for (var sourceid in Room.links) {
        var targets = Room.links[sourceid];
        for (var targetid in targets) {
            jsonMap.links.push ({
                "source": reverseNode[sourceid],
                "target": reverseNode[targetid],
                "weight": 1
            });
        }
    }
    return jsonMap;
};

/*
Room.ruleSet = {
    "go": new Rule(condition, reaction),    <inhabitant, room>
    "work": new Rule(condition, reaction)   <inhabitant, room, action>  e.g. rest, manufacture
    "work": new Rule(condition, reaction)   <inhabitant, inhabitant, room, action> e.g. customer_engagement
};
*/
Room.ruleSet = {};
var condition = "L.pathLikehood[D.pathEntry] >= D.pathEntryLevel";
var reaction = "D.enter(L)";
Room.ruleSet.go = new Rule(condition, reaction);

Room.prototype.getRules = function () {
    'use strict';
    return Room.ruleSet;
};
