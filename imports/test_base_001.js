/*global Action, Inhabitant, Room, BaseView*/
// Entities
var actions = {};
var fact = {};
var autonomi = [];
var viewBase;

// PATHS
fact.PATH_true_love = {"pathName": "true_love", "id": "true_love"};
fact.PATH_investing_startup_X = {"pathName": "investing_startup_X", "id": "investing_startup_X"};

actions.PATH_true_love = fact.PATH_true_love;
actions.PATH_investing_startup_X = fact.PATH_investing_startup_X;

// ACTIONS
//levelTrust, levelSkill, entretain, illustrate, neg
fact.RS0_action_000B = new Action(15, 5, 2, 5, 1);
fact.RS0_action_000O = new Action(0, 10, 2, 2, 0.1);
fact.RS0_action_001O = new Action(0, 0, 0.2, 0.2, 0.1);

actions.RS0_action_000B = fact.RS0_action_000B;
actions.RS0_action_000O = fact.RS0_action_000O;
actions.RS0_action_001O = fact.RS0_action_001O;
actions.RS0_action_000B.id = "confident";
actions.RS0_action_000O.id = "proffesional";
actions.RS0_action_001O.id = "public";

// MAIN CHARACTER
fact.RS0_mainchar_000 = Inhabitant.createLeader();
fact.RS0_mainchar_000.textName = "Me";

// OTHER NPR
fact.RS0_inhabitant_000 = new Inhabitant();
fact.RS0_inhabitant_000.buildTurnAutomnomy(actions);
fact.RS0_inhabitant_001 = new Inhabitant();
fact.RS0_inhabitant_001.buildTurnAutomnomy(actions);
autonomi.push(fact.RS0_inhabitant_000);
autonomi.push(fact.RS0_inhabitant_001);

fact.RS0_inhabitant_001.textName = "Unknown Person";
fact.RS0_inhabitant_001.imageUri = "img/avatar1.png";

// ROOM
var room = new Room();
room.textName = "Generic Room";
room.dreamNeighbouhood();
room.enterGroup(fact);
room.pathEntry = fact.PATH_investing_startup_X.pathName;

// Visualization
viewBase = new BaseView("gui-room-div", fact.RS0_mainchar_000, actions);
viewBase.autonomi = autonomi;
viewBase.setViewee(room);