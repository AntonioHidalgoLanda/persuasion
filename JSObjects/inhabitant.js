/*global Rule, Action*/
function Inhabitant(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "inhabitant_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.selfvalue = {};
    this.rapport = {};
    this.pathLikehood = {};
    // TODO: intentions
        
    // Action discover (also persuade illustrate) may change World View
    
    // TODO Leader should have energy but not necesarily time
}


// TODO: resume(room) // if (room in intentions.goto())GoTo room; resumeGoals(); resumeIntentions(); resumeWorld();
// TODO: Attempt(Intention(room))

Inhabitant.prototype.getName = function () {
    "use strict";
    return (this.hasOwnProperty("textName")) ? this.textName : this.id;
};


Inhabitant.prototype.getRules = function () {
    'use strict';
    return Inhabitant.ruleSet;
};

Inhabitant.createLeader = function (id, time, energy, cash) {
    "use strict";
    var inhabitant = new Inhabitant(id);
    if (time === undefined) {
        time = 0;
    }
    if (energy === undefined) {
        energy = 100;
    }
    if (cash === undefined) {
        cash = 100;
    }
    inhabitant.time = time;
    inhabitant.energy = energy;
    inhabitant.cash = cash;
    
    return inhabitant;
};

// TODO - Multi Path action

Inhabitant.prototype.isPathLevelGreater = function (path, level) {
    "use strict";
    return ((level <= 0) || (this.pathLikehood.hasOwnProperty(path) && this.pathLikehood[path] >= level));
};

Inhabitant.prototype.isRapportLevelGreater = function (inhabitantId, level) {
    "use strict";
    return ((level <= 0) || (this.rapport.hasOwnProperty(inhabitantId) && this.rapport[inhabitantId] >= level));
};

Inhabitant.prototype.increasePathLevel = function (path, increase, limit) {
    "use strict";
    if (!this.pathLikehood.hasOwnProperty(path)) {
        this.pathLikehood[path] = 0;
    }
    increase += this.pathLikehood[path];
    this.pathLikehood[path] += Inhabitant.convergentIncrement(increase, limit);
    return this;
};

Inhabitant.prototype.increaseRapport = function (inhabitantId, increase, limit) {
    "use strict";
    if (!this.rapport.hasOwnProperty(inhabitantId)) {
        this.rapport[inhabitantId] = 0;
    }
    increase += this.rapport[inhabitantId];
    this.rapport[inhabitantId] += Inhabitant.convergentIncrement(increase, limit);
    return this;
};

Inhabitant.convergentIncrement = function (x, limit) {
    "use strict";
    if (typeof limit !== "number") {
        limit = 100;
    }
    return limit + (1 / (x + 1));
};

Inhabitant.ruleSet = {
    "persuade": new Rule(Action.persuade.condition, Action.persuade.reaction)
};

// TODO - remplace this by something more sensible, this is only for test
Inhabitant.prototype.description = function () {
    'use strict';
    var seen = [];
    // return JSON.stringify(this); // Hack to resolve Inhabitant being a cyclic object
    return JSON.stringify(this, function (key, val) {
        if (val !== null && typeof val === "object") {
            if (seen.indexOf(val) >= 0) {
                return;
            }
            seen.push(val);
        }
        return val;
    });
};


