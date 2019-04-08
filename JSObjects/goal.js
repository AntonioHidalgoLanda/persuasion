/*global Rule*/
function Goal(achivement, divide) {
    "use strict";
    this.priority = Goal.INITIAL_PRIORITY;
    this.duration = Goal.INITIAL_DURATION;
    this.rule_achieve = (achivement instanceof Rule) ? achivement : new Rule();
    this.rule_divide = (divide instanceof Rule) ? divide : new Rule();
}

Goal.INITIAL_PRIORITY = 1;
Goal.INITIAL_DURATION = 5;

Goal.CONDITION_INSTINCT_ACHIEVEMNENT = "L.path >= goal.intensity";
Goal.REACTION_INSTINCT_ACHIEVEMNENT = "true";   // destroy the action
Goal.CONDITION_INSTINCT_DIVIDE = "";    // urgePath()
Goal.REACTION_INSTINCT_DIVIDE = "";
Goal.CONDITION_PATH_FOLLOWER_ACHIEVEMNENT = "";
Goal.REACTION_PATH_FOLLOWER_ACHIEVEMNENT = "";
Goal.CONDITION_PATH_FOLLOWER_DIVIDE = "";
Goal.REACTION_PATH_FOLLOWER_DIVIDE = "";

Goal.RULE_INSTINCT_ACHIEVEMNENT = new Rule(Goal.CONDITION_INSTINCT_ACHIEVEMNENT, Goal.REACTION_INSTINCT_ACHIEVEMNENT);
Goal.RULE_INSTINCT_DIVIDE = new Rule(Goal.CONDITION_INSTINCT_DIVIDE, Goal.REACTION_INSTINCT_DIVIDE);
Goal.RULE_PATH_FOLLOWER_ACHIEVEMNENT = new Rule(Goal.CONDITION_PATH_FOLLOWER_ACHIEVEMNENT, Goal.REACTION_PATH_FOLLOWER_ACHIEVEMNENT);
Goal.RULE_PATH_FOLLOWER_DIVIDE = new Rule(Goal.CONDITION_PATH_FOLLOWER_DIVIDE, Goal.REACTION_PATH_FOLLOWER_DIVIDE);

/*
e.g. vent-out, get-privacy, drag-attention

*/
Goal.createIntinct = function (path, intensity) {
    "use strict";
    var goal = new Goal(Goal.RULE_INSTINCT_ACHIEVEMNENT, Goal.RULE_INSTINCT_DIVIDE);
    
    goal.path = path;
    goal.intensity = intensity;
    
    return goal;
};

Goal.createPathFollowers = function (people, path, rapport_level, path_level) {
    "use strict";
    var goal = new Goal(Goal.RULE_PATH_FOLLOWER_ACHIEVEMNENT, Goal.RULE_PATH_FOLLOWER_DIVIDE);
    
    goal.people = people;
    goal.path = path;
    goal.rapport_level = rapport_level;
    goal.path_level = path_level;
    
    return goal;
};


Goal.prototype.isAchieved = function (worldModel) {
    "use strict";
    var candidate = {};
    candidate.worldModel = worldModel;
    console.log("On Development....");
    return this.rule_achieve.isValidCandidate(candidate);
};

// Sub Goals or Intentions (actions)
Goal.prototype.resolve = function (worldModel) {
    "use strict";
    var candidate = {};
    console.log("On Development.... priority check, Math.random>priority...");
    candidate.worldModel = worldModel;
    console.log("On Development....");
    // check priority
    // execute rule
    // if direct actions, execute actions
    // if subgoals, add to queue
    // reduce priority unless is -1 (max priority)
    // reduce duration unless is -1 (permanent)
    return this.rule_divide.execute({}, candidate);
};

// Find actions to increase/decrease or places to increase/decrease path
Goal.prototype.urgePath = function (path, worldModel) {
    "use strict";
    console.log("On Development....");
    // Find available people in WorldModel
    // Find available actions in WorldModel (room?)
    // Find rooms with heuristics for increase the path
    
    // (if direct_action(action, room, person) ) { addIntention({action, room, person}, priority=h(path,action, room, person)) }
    // else, add go to h(path,action, room)
    
    return this;
};

Goal.prototype.addIntention = function () {
    "use strict";
    console.log("On Development....");
    
};

Goal.prototype.executeIntention = function () {
    "use strict";
    console.log("On Development....");
    
};


