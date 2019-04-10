/*global Rule*/
function Goal(achivement) {
    "use strict";
    this.priority = Goal.INITIAL_PRIORITY;
    this.duration = Goal.INITIAL_DURATION;
    this.rule_achieve = (achivement instanceof Rule) ? achivement : new Rule();
    
    this.intentions = {};
}

Goal.INITIAL_PRIORITY = 1;
Goal.INITIAL_DURATION = 5;
Goal.MAX_INTENTIONS_PER_ROUND = 3;

Goal.CONDITION_INSTINCT_ACHIEVEMNENT = "L.path >= goal.intensity";
Goal.REACTION_INSTINCT_ACHIEVEMNENT = "true";        // destroy the action (true)
Goal.CONDITION_PATH_FOLLOWER_ACHIEVEMNENT = "";      // WorldModel.levelGreaterEqual(path, rapport_level, path_level) > people
Goal.REACTION_PATH_FOLLOWER_ACHIEVEMNENT = "";       // destroy the action/ upgrade goals

Goal.RULE_INSTINCT_ACHIEVEMNENT = new Rule(Goal.CONDITION_INSTINCT_ACHIEVEMNENT, Goal.REACTION_INSTINCT_ACHIEVEMNENT);
Goal.RULE_PATH_FOLLOWER_ACHIEVEMNENT = new Rule(Goal.CONDITION_PATH_FOLLOWER_ACHIEVEMNENT, Goal.REACTION_PATH_FOLLOWER_ACHIEVEMNENT);

/*
e.g. vent-out, get-privacy, drag-attention

*/
Goal.createIntinct = function (path, intensity) {
    "use strict";
    var goal = new Goal(Goal.RULE_INSTINCT_ACHIEVEMNENT);
    
    goal.path = path;
    goal.intensity = intensity;
    goal.priority = -1;
    
    return goal;
};

Goal.createPathFollowers = function (people, path, rapport_level, path_level) {
    "use strict";
    var goal = new Goal(Goal.RULE_PATH_FOLLOWER_ACHIEVEMNENT);
    
    goal.people = people;
    goal.path = path;
    goal.rapport_level = rapport_level;
    goal.path_level = path_level;
    goal.duration = -1;
    
    return goal;
};


Goal.prototype.isAchieved = function (worldModel) {
    "use strict";
    var candidate;
    console.log("On Development... worldView.getAchievementCandidates() ...Including for aggregation rules (count, sum, avrg, max min)");
    for (candidate in worldModel.candidates) {
        if (this.rule_achieve.isValidCandidate(candidate)) {
            return true;
        }
    }
    return false;
};

// Sub Goals or Intentions (actions)
/*
@param rules Rules available
@param facts Facts/Objects available to create candidates
*/
Goal.prototype.resolve = function (rules, facts, worldModel) {
    "use strict";
    var candidate, intentions = [];
    console.log("On Development... Rule.prototype.getCandidates(facts)");
    this.clearIntentions();
    for (var ruleid in rules){
        candidates = rules[ruleid].getCandidates(facts);
        for (var candidate_i in candidates){
            var ratting = this.getRatting(rule, candidate, worldModel);
            this.addIntention(ratting, rules[ruleid], candidate);
        }
    }
    this.executeIntentions();
    // max priority
    if (this.priority >= 0) {
        this.priority--;
    }
    // permantent task
    if (this.duration >= 0) {
        this.duration--;
    }

    return this;
};

Goal.prototype.clearIntentions = function () {
    "use strict";
    this.intentions = {};
};


Goal.prototype.addIntention = function (ratting, rule, candidate) {
    "use strict";
    console.log("On Development... Defining criteria to add to intentions");
    
    if (ratting > 0.5 || this.intentions.length === 0) {
        this.intentions.push({
            "ratting": ratting,
            "rule": rule,
            "candidate": candidate
        });
    }
    
    return this;
};

Goal.prototype.executeIntentions = function () {
    "use strict";
    console.log("On Development....");
    // var doneSomething = false;
    for (var i = 0; i < intentions.length && i < Goal.MAX_INTENTIONS_PER_ROUND; i++) {
        // if (ratting + goal > Math Random) {
        //      rule.execute({},candidate)
        //      doneSomething = true;
        // }
        // if (!doneSomething) intentions[0].rule.execute(intentions[0].candidate)
    }
    return this;
};

Goal.prototype.getRatting = function (rule, candidate, worldModel) {
    "use strict";
    var sample = {}
    
    Object.assign(sample, rate_extractFeatures(rule));
    Object.assign(sample, rate_extractFeatures(candidate));
    rate_normalizeFeatures(sample);
    
    return rate_findClosestNeighbour(worldModel, sample);
};
/*
used when learing:
 * after perform action
 * with an action discovery/exploration of suroundings
 * with action verval exchange with other inhabitant
*/
Goal.prototype.updateRatting = function (rule, candidate, worldModel, feedback) {
      "use strict";
    var sample = {};

    Object.assign(sample, rate_extractFeatures(rule));
    Object.assign(sample, rate_extractFeatures(candidate));
    rate_normalizeFeatures(sample);
    rate_updateNeighbour(worldModel, sample, feedback);
    rate_alignment(); // re-clustering, condensation and removing less relevant nodes

    return this;
  
};

var rate_extractFeatures = function (candidate) {
      "use strict";
    console.log("On Development...."+candidate);
    
};
var rate_normalizeFeatures = function (sample) {
      "use strict";
    console.log("On Development...."+sample);
    
};
var rate_findClosestNeighbour = function (worldModel, sample) {
      "use strict";
    console.log("On Development...."+worldModel+sample);
};
var rate_updateNeighbour = function (worldModel, sample, feedback) {
      "use strict";
    console.log("On Development...."+worldModel+sample+feedback);
};
var rate_alignment = function (){ // re-clustering, condensation and removing less relevant nodes 
      "use strict";
    console.log("On Development....");
};


