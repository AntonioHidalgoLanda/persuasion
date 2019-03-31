/*global Rule*/

var condition = "";
var reaction = "";
var ruleSet = {};

/*
TODO
Add hasOwnProperty to the arrays
*/



condition = "L.time >= 0";
reaction = "L.time += 1";
ruleSet.timeEventRule = new Rule(condition, reaction);

condition = "L.energy >= 1";
reaction = "L.time ++; L.cash += 100; L.energy --;";
ruleSet.workRule = new Rule(condition, reaction);

condition = "L.energy <= 90";
reaction = "L.time += 10; L.energy = 100;";
ruleSet.sleepRule = new Rule(condition, reaction);


condition = "(L.energy >= action.cost) && " +
    " ((action.levelTrust === 0) || " +
    " (T.rapport.hasOwnProperty(L.id) && T.rapport[L.id] >= action.levelTrust))" +
    " && ((action.levelSkill === 0 )" +
    " || (T.pathLikehood.hasOwnProperty(action.path) && T.pathLikehood[action.path] >= action.levelSkill)" +
    " || (L.pathLikehood.hasOwnProperty(action.path) && L.pathLikehood[action.path] >= action.levelSkill))";

// Common
reaction = "L.energy -= action.cost;" +
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

ruleSet.inhabitantRule = new Rule(condition, reaction);




