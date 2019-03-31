/*global Rule*/
function Inhabitant(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "inhabitant_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.selfvalue = {};
    this.rapport = {};
    this.pathLikehood = {};
    // TODO: intentions
        
    // Actions (Persuade, Work) may change Goals
    // Action discover (also persuade illustrate) may change World View
    
    // TODO Leader should have energy but not necesarily time
}


// TODO: resume(room) // if (room in intentions.goto())GoTo room; resumeGoals(); resumeIntentions(); resumeWorld();
// TODO: Attempt(Intention(room))

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
// TODO - refactor rule using extracting methos into Inhabitant

var condition = "(L.energy >= action.cost) && " +
    " ((action.levelTrust === 0) || " +
    " (T.rapport.hasOwnProperty(L.id) && T.rapport[L.id] >= action.levelTrust))" +
    " && ((action.levelSkill === 0 )" +
    " || (T.pathLikehood.hasOwnProperty(action.path) && T.pathLikehood[action.path] >= action.levelSkill)" +
    " || (L.pathLikehood.hasOwnProperty(action.path) && L.pathLikehood[action.path] >= action.levelSkill))";

// Common
var reaction = "L.energy -= action.cost;" +
        " T.rapport[L.id] = T.rapport.hasOwnProperty(L.id)?T.rapport[L.id]:0;" +
        " T.pathLikehood[action.path] = T.pathLikehood.hasOwnProperty(action.path)?T.pathLikehood[action.path]:0;" +
        " L.pathLikehood[action.path] = L.pathLikehood.hasOwnProperty(action.path)?L.pathLikehood[action.path]:0;" +
        " L.time += 1;";
        
// Neg
reaction += " T.selfvalue[L.id] = (!T.selfvalue.hasOwnProperty(L.id))?" +
        "100:Math.max(0, T.selfvalue[L.id] - (action.neg*0.5));" +
        " T.rapport[L.id] += (T.selfvalue[L.id] > 0)? action.neg:0;";
            
// Illustrate
reaction += " T.pathLikehood[action.path] += action.illustrate;" +
        " L.pathLikehood[action.path] += action.illustrate * 0.1;";

// Entretain
reaction += " T.rapport[L.id] += action.entretain;";

Inhabitant.ruleSet = {
    "persuade": new Rule(condition, reaction)
};

// TODO - remplace this by something more sensible, this is only for test
Inhabitant.prototype.description = function () {
    'use strict';
    return JSON.stringify(this);
};

Inhabitant.prototype.getRules = function () {
    'use strict';
    return Inhabitant.ruleSet;
};

