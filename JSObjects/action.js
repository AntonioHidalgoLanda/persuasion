/*global Rule*/
// levelTrust = ,      // raport of T to L;                 - 0 for open actions
// levelSkill = ,      // skill required level of L or T;   - 0 for first actions

function Action(levelTrust, levelSkill, cost, entretain, illustrate, neg) {
    "use strict";
    
    this.cost = (cost === undefined || cost === null) ? Math.floor(Math.random() * 20 + 1) : cost;
    this.levelTrust = (levelTrust === undefined || levelTrust === null) ? Math.floor(Math.random() * (5 + 1)) : levelTrust;

    this.levelSkill = (levelSkill === undefined || levelSkill === null) ? Math.floor(Math.random() * (10 + 1)) : levelSkill;
    
    this.entretain = (entretain === undefined || entretain === null) ? Math.floor(Math.random() * 10 + 1) : entretain;
    this.illustrate = (illustrate === undefined || illustrate === null) ? Math.floor(Math.random() * 10 + 1) : illustrate;
    this.neg = (neg === undefined || neg === null) ? Math.floor(Math.random() * 10 + 1) : neg;
    
    // Add room into equation
    // add Goals into equation - induce new goals
}
    
Action.paths = ["power", "love", "money"];
Action.ruleSet = {};

var condition = "L.time >= 0";
var reaction = "L.time += 1";
Action.ruleSet.timeEventRule = new Rule(condition, reaction);

condition = "L.energy >= 1";
reaction = "L.time ++; L.cash += 100; L.energy --;";
Action.ruleSet.workRule = new Rule(condition, reaction);

condition = "L.energy <= 90";
reaction = "L.time += 10; L.energy = 100;";
Action.ruleSet.sleepRule = new Rule(condition, reaction);


/* Inhabitant Persuade*/
Action.persuade = {};
Action.persuade.condition = "(L !== T) && (L.energy >= action.cost) && " +
    " T.isRapportLevelGreater(L.id, action.levelTrust)" +
    " && (T.isPathLevelGreater(path.pathName, action.levelSkill)" +
    " || L.isPathLevelGreater(path.pathName, action.levelSkill))";

// Common
Action.persuade.reaction = "L.energy -= action.cost;" +
        " L.time += 1;";
        
// Neg
Action.persuade.reaction += " T.selfvalue[L.id] = (!T.selfvalue.hasOwnProperty(L.id))?" +
        "100:Math.max(0, T.selfvalue[L.id] - (action.neg * 0.5));" +
        " T.increaseRapport(L.id, (T.selfvalue[L.id] > 0)? action.neg : 0);";
            
// Illustrate
Action.persuade.reaction += " T.increasePathLevel(path.pathName, action.illustrate);" +
        " L.increasePathLevel(path.pathName, action.illustrate * 0.1);";

// Entretain
Action.persuade.reaction += " T.increaseRapport(L.id, action.entretain);";



/*Room work*/
Action.work = {};
Action.work.condition = "(L !== T) && " +
    " L.currentRoom === room && " +
    " T.currentRoom === room && " +
    " L.isPathLevelGreater(room.pathEntry, room.pathEntryLevel)";

// Neg
Action.work.reaction = " T.selfvalue[L.id] = (!T.selfvalue.hasOwnProperty(L.id))?" +
        "100:Math.max(0, T.selfvalue[L.id] - (action.neg * 0.5));" +
        " T.increaseRapport(L.id, (T.selfvalue[L.id] > 0)? action.neg : 0);";
            
// Illustrate
Action.work.reaction += " T.increasePathLevel(room.pathEntry, action.illustrate);" +
        " L.increasePathLevel(room.pathEntry, action.illustrate * 0.1);";

// Entretain
Action.work.reaction += " T.increaseRapport(L.id, action.entretain);";

// TODO: Add a room multiplier to all the reactions.







