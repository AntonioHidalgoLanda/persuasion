/* Neg, Entretain, Illustrate*/

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

// Add hasOwnProperty to the arrays
/* Inhabitants */
// condition = "(L.energy >= 5)";
// reaction = "T.rapport[L.id] += action.effect; L.energy -= 5;";
// ruleSet.inhaOpenRule = new Rule(condition, reaction);
// Open action should be easier to perform for unknown inhabitants; action.LevelTrust = 0


condition = "(L.energy >= 1) && (!T.selfvalue.hasOwnProperty(L.id) || T.selfvalue[L.id] > 0)";
reaction = "T.selfvalue[L.id] = Math.max(0, (!T.selfvalue.hasOwnProperty(L.id))?100:T.selfvalue[L.id] - action.effect); " +
    "T.rapport[L.id] = T.rapport.hasOwnProperty(L.id)?T.rapport[L.id] + action.effect:action.effect; " +
    "L.energy --;";
ruleSet.inhaNegRule = new Rule(condition, reaction);


condition = "(L.energy >= action.cost) && " +
    " ((action.levelTrust === 0) || " +
    " (T.rapport.hasOwnProperty(L.id) && T.rapport[L.id] >= action.levelTrust))" +
    " && ((action.levelSkill === 0 )" +
    " || (T.pathLikehood.hasOwnProperty(action.path) && T.pathLikehood[action.path] >= action.levelSkill)" +
    " || (L.pathLikehood.hasOwnProperty(action.path) && L.pathLikehood[action.path] >= action.levelSkill))";

reaction = "T.rapport[L.id] = (T.rapport.hasOwnProperty(L.id))?T.rapport[L.id]:0;" +
    " T.pathLikehood[action.path] = ( T.pathLikehood.hasOwnProperty(action.path))?T.pathLikehood[action.path]:0;" +
    " L.pathLikehood[action.path] = ( L.pathLikehood.hasOwnProperty(action.path))?L.pathLikehood[action.path]:0;" +
    " T.pathLikehood[action.path] += action.effect;" +
    " L.pathLikehood[action.path] += 1 + ( T.rapport[L.id] * 0.01);" +
    " L.energy -= action.cost;";
ruleSet.inhaIllustrateRule = new Rule(condition, reaction);



condition = "(L.energy >= action.cost) && " +
    " ((action.levelTrust === 0) || " +
    " (T.rapport.hasOwnProperty(L.id) && T.rapport[L.id] >= action.levelTrust))" +
    " && ((action.levelSkill === 0 )" +
    " || (T.pathLikehood.hasOwnProperty(action.path) && T.pathLikehood[action.path] >= action.levelSkill)" +
    " || (L.pathLikehood.hasOwnProperty(action.path) && L.pathLikehood[action.path] >= action.levelSkill))";

reaction = "T.rapport[L.id] = (T.rapport.hasOwnProperty(L.id))?T.rapport[L.id]:0;" +
    " T.pathLikehood[action.path] = T.pathLikehood.hasOwnProperty(action.path)?T.pathLikehood[action.path]:0;" +
    " L.pathLikehood[action.path] = L.pathLikehood.hasOwnProperty(action.path)?L.pathLikehood[action.path]:0;" +
    " T.rapport[L.id] += action.effect;" +
    " T.pathLikehood[action.path] += (action.effect * 0.3);" +
    " L.pathLikehood[action.path] += (action.effect * 0.3);" +
    " L.energy -= action.cost;";
ruleSet.inhaEntretainRule = new Rule(condition, reaction);





