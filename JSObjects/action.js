
/* global Rule*/
// levelTrust = ,      // raport of T to L;                 - 0 for open actions
// levelSkill = ,      // skill required level of L or T;   - 0 for first actions

function Action(path, levelTrust, levelSkill, cost, entretain, illustrate, neg) {
    "use strict";
    
    this.cost = (cost === undefined || cost === null) ? Math.floor(Math.random() * 20 + 1) : cost;
    this.levelTrust = (levelTrust === undefined || levelTrust === null) ? Math.floor(Math.random() * (5 + 1)) : levelTrust;
    this.levelSkill = (levelSkill === undefined || levelSkill === null) ? Math.floor(Math.random() * (10 + 1)) : levelSkill;
    this.path = (path === undefined || path === null) ? "power" : path;
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
