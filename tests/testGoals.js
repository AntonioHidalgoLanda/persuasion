/* eslint-disable no-console */
/*global console, Goal, Inhabitant, test_facts*/


console.log("TESTING GOALS");

//
// Data Initialization
//
var people = 3,
    path = "social_cause",
    levelPath = 7,
    levelRapport = 5,
    candidates,
    feedback = 100,
    intensity = 5;      // For Goal.Instinct

console.log("Test Goals: Candidates");
candidates = Inhabitant.ruleSet.persuade.getCandidates(test_facts);
console.log(candidates);

console.log("Test Goals: creation of Goal - instinct " + path + ", " + intensity);
var instinct = Goal.createIntinct(path, intensity);
console.log(instinct);

console.log("Test Goals: Instincts:: Base World Model");
instinct.updateRatting(Inhabitant.ruleSet.persuade, candidates[0], feedback);
instinct.updateRatting(Inhabitant.ruleSet.persuade, candidates[1], feedback / 2);

console.log("Test Goals: Instincts:: Get Ratting");
console.log(instinct.getRatting(Inhabitant.ruleSet.persuade, candidates[2]));

console.log("Test Goals: Instincts:: Is Achived - true");
console.log(instinct.isAchieved({"self": test_facts.RS0_mainchar_000}));

console.log("Test Goals: Instincts:: Is Achieved - false");
console.log(instinct.isAchieved({"self": test_facts.RS0_inhabitant_000}));
console.log(instinct.isAchieved({"self": test_facts.RS0_inhabitant_001}));


// note that only RS0_mainchar_000 can be L
console.log("Test Goals: Instincts:: candidates");
console.log(Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));
instinct.calculateIntentions(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log("Test Goals: Instincts:: intentions");
console.log(instinct.intentions);

console.log("Test Goals: Instincts:: Resolve");
test_facts.self = test_facts.RS0_mainchar_000;
instinct.resolve(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log(instinct);



console.log("Test Goals: creation of Goal - " + levelPath + " level on " + path + ", x" + people + "followers with " + levelRapport + "rapport.");
var followers = Goal.createPathFollowers(people, path, levelRapport, levelPath);
console.log(followers);


console.log("Test Goals: Followers:: Is Achived - false");
console.log(followers.isAchieved(test_facts));

followers.people = 2;
followers.rapport_level = 0;
followers.path_level = 1;
console.log("Test Goals: creation of Goal - " + followers.path_level + " level on " + path + ", x" + followers.people + "followers with " + followers.rapport_level + "rapport.");
console.log("Test Goals: Followers:: Is Achieved - true");
console.log(followers.isAchieved(test_facts));

console.log("Test Goals: Followers:: Base World Model");
feedback = 0;
followers.updateRatting(Inhabitant.ruleSet.persuade, {"L": test_facts.RS0_mainchar_000}, feedback);


// note that only RS0_mainchar_000 can be L
console.log("Test Goals: Followers:: candidates");
console.log(Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));
followers.calculateIntentions(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log("Test Goals: Followers:: intentions");
console.log(followers.intentions);

console.log("Test Goals: Followers:: Resolve");
followers.resolve(Inhabitant.ruleSet, test_facts, {"L": test_facts.RS0_mainchar_000});
console.log(followers);

