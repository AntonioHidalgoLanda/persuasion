/*global Rule*/
function Room(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "room_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.entrance = {}
    this.works = {} // actions
    this.inhabitants ={}
    this.pathentryLevel = {} // to fileter who can access to the room with go to
}

// TODO
// create()
// resume()
// getD3Map()

/*
Room.ruleSet = {
    "go": new Rule(condition, reaction),            // enter if rigth path level
    "work": new Rule(condition, reaction)
};
*/

Room.prototype.getRules = function () {
    'use strict';
    return Room.ruleSet;
};
