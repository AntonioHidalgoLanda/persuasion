/* eslint-disable no-console */
/*global console, Action, Inhabitant, Room*/


console.log("TESTING Actions");

//
// Data Initialization
//
var path = "social_cause",
    test_actions = {},
    test_facts = {},
    factid,
    candidates_main = {},
    candidates_inhabitants = {},
    candidates_persuade,
    candidates_work,
    candidates_goto;

console.log("Facts (Rooms, Inhabitants, Global Actions)");
test_facts.RS0_mainchar_000 = Inhabitant.createLeader();
test_facts.RS0_mainchar_000.textName = "Me";

test_facts.RS0_inhabitant_000 = new Inhabitant();
test_facts.RS0_inhabitant_001 = new Inhabitant();

test_facts.RS0_action_000B = new Action(path);
test_actions.RS0_action_000B = test_facts.RS0_action_000B;
test_facts.RS0_action_000O = new Action(0);
test_actions.RS0_action_000O = test_facts.RS0_action_000O;
test_facts.RS0_action_001O = new Action(0, 0);
test_actions.RS0_action_001O = test_facts.RS0_action_001O;


test_facts.RS0_inhabitant_001.textName = "Unknown Person";
test_facts.RS0_inhabitant_001.imageUri = "img/avatar1.png";

test_facts.RS0_inhabitant_000.pathLikehood[path] = 1;
test_facts.RS0_mainchar_000.pathLikehood[path] = 10;

test_facts.PATH_test = {"pathName": path};
test_facts.PATH_true_love = {"pathName": "true_love"};
test_facts.PATH_investing_startup_X = {"pathName": "investing_startup_X"};

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
console.log("Test Action: TESTING GetCandidates");
console.log("Test Action: Testing GetCandidates PERSUADE:");
candidates_persuade = Inhabitant.ruleSet.persuade.getCandidates(test_facts);
console.log(candidates_persuade);

console.log("Test Action: Testing GetCandidates PERSUADE: Defaulting self to me");
console.log(Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));

console.log("Test Action: Testing GetCandidates WORK:");
candidates_work = Room.ruleSet.work.getCandidates(test_facts);
console.log(candidates_work);
console.log("Test Action: Testing GetCandidates WORK: Defaulting self to me");
console.log(Room.ruleSet.work.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));

console.log("Test Action: Testing GetCandidates GOTO:");
candidates_goto = Room.ruleSet.go.getCandidates(test_facts);
console.log(candidates_goto);
console.log("Test Action: Testing GetCandidates GOTO: Defaulting self to me");
console.log(Room.ruleSet.go.getCandidates(test_facts, {"L": test_facts.RS0_mainchar_000}));

console.log("Test Action: Testing GetCandidates with targeted L:");
// TODO: method to me exported to Base View
candidates_main.persuade = candidates_persuade;
candidates_main.go = candidates_goto;
candidates_main.work = candidates_work;
console.log(candidates_main);

console.log("Test Action: Testing GetCandidates per each Inhabitant:");
// TODO: method to me exported to Base View
for (factid in test_facts) {
    if (test_facts.hasOwnProperty(factid) && test_facts[factid] instanceof Inhabitant) {
        candidates_inhabitants[factid] = {
            "persuade": Inhabitant.ruleSet.persuade.getCandidates(test_facts, {"L": test_facts[factid]}),
            "go": Room.ruleSet.go.getCandidates(test_facts, {"L": test_facts[factid]}),
            "work": Room.ruleSet.work.getCandidates(test_facts, {"L": test_facts[factid]})
        };
    }
}
console.log(candidates_main);

// Test Goto

// Test Work

// Test Persuade

// Test Discover
// goals.updateRattings....

// Test ConversativeDiscovery
// goals.updateRattings....




