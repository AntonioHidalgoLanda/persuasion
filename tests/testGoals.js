/* eslint-disable no-console */
/*global console, Goal, Action, Inhabitant, Room*/


console.log("TESTING GOALS");

//
// Data Initialization
//
var people = 3,
    path = "social_cause",
    levelPath = 7,
    levelRapport = 5,
    test_actions = {},
    test_facts = {},
    candidates,
    feedback = 100,
    intensity = 5;      // For Goal.Instinct

console.log("Facts (Rooms, Inhabitants, Global Actions)");
test_facts.RS0_mainchar_000 = Inhabitant.createLeader();
test_facts.RS0_mainchar_000.textName = "Me";

test_facts.RS0_inhabitant_000 = new Inhabitant();
test_facts.RS0_inhabitant_001 = new Inhabitant();

test_facts.RS0_action_000B = new Action(path);
test_actions.RS0_action_000B = test_facts.RS0_action_000B;
test_facts.RS0_action_000O = new Action(path, 0);
test_actions.RS0_action_000O = test_facts.RS0_action_000O;
test_facts.RS0_action_001O = new Action(path, 0, 0);
test_actions.RS0_action_001O = test_facts.RS0_action_001O;


test_facts.RS0_inhabitant_001.textName = "Unknown Person";
test_facts.RS0_inhabitant_001.imageUri = "img/avatar1.png";

test_facts.RS0_inhabitant_000.pathLikehood[path] = 1;
test_facts.RS0_mainchar_000.pathLikehood[path] = 10;


var room = new Room();
room.textName = "Generic Room";
room.dreamNeighbouhood();
room.enterGroup(test_facts);
Object.assign(test_facts, Room.nodes);

console.log("Facts:");
console.log(test_facts);
console.log("Room:");
console.log(room);

//
// :::TESTING GetCandidates:::
//
console.log(":::TESTING GetCandidates:::");
console.log("::inhabitant.getCandidatesRuleLeadActions");
console.log(test_facts.RS0_inhabitant_001.getCandidatesRuleLeadActions(
    Inhabitant.ruleSet.persuade,
    test_facts.RS0_mainchar_000,
    test_actions
));

console.log("::Rule.getCandidates");
candidates = Inhabitant.ruleSet.persuade.getCandidates(test_facts);
console.log(candidates);

console.log("::Rule.getCandidates - defaulting L to Me");
console.log(Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"T": test_facts.RS0_inhabitant_001}));

console.log("Test - creation of Goal - instinct " + path + ", " + intensity);
var instinct = Goal.createIntinct(path, intensity);
console.log(instinct);

console.log("Test - Instincts:: Base World Model");
instinct.updateRatting(Inhabitant.ruleSet.persuade, candidates[0], feedback);
instinct.updateRatting(Inhabitant.ruleSet.persuade, candidates[1], feedback/2);

console.log("Test - Instincts:: Get Ratting");
console.log(instinct.getRatting(Inhabitant.ruleSet.persuade,candidates[2]));

console.log("Test - Instincts:: Is Achived - true");
console.log(instinct.isAchieved({"self": test_facts.RS0_mainchar_000}));

console.log("Test - Instincts:: Is Achieved - false");
console.log(instinct.isAchieved({"self": test_facts.RS0_inhabitant_000}));
console.log(instinct.isAchieved({"self": test_facts.RS0_inhabitant_001}));


console.log("Test - Instincts:: Resolve");
// note that only RS0_mainchar_000 can be L
console.log("candidates");
console.log(Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));
instinct.calculateIntentions(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log("intentions");
console.log(instinct.intentions);

test_facts.self = test_facts.RS0_mainchar_000;
instinct.resolve(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log(instinct);



console.log("Test - creation of Goal - " + levelPath + " level on " + path + ", x" + people + "followers with " + levelRapport + "rapport.");
var followers = Goal.createPathFollowers(people, path, levelRapport, levelPath);
console.log(followers);


console.log("Test - Followers:: Base World Model");


console.log("Test - Followers:: Wolrd Model - Standarized");

console.log("Test - Followers:: Is Achived - false");
console.log(followers.isAchieved(test_facts));

console.log("Test - Followers:: Is Achieved - true");
console.log(followers.isAchieved(test_facts));


console.log("Test - Followers:: Resolve");

