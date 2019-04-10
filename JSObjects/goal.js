/*global Rule*/
function Goal(achivement) {
    "use strict";
    this.priority = Goal.INITIAL_PRIORITY;
    this.duration = Goal.INITIAL_DURATION;
    this.rule_achieve = (achivement instanceof Rule) ? achivement : new Rule();
    
    this.intentions = [];
    this.isAchievedFunction = function () {return true; };
}

Goal.INITIAL_PRIORITY = 1;
Goal.INITIAL_DURATION = 5;
Goal.MAX_INTENTIONS_PER_ROUND = 3;

/*
e.g. vent-out, get-privacy, drag-attention

*/
Goal.createIntinct = function (path, intensity) {
    "use strict";
    var goal = new Goal(Goal.RULE_INSTINCT_ACHIEVEMNENT);
    
    goal.path = path;
    goal.intensity = intensity;
    goal.priority = -1;
    
    goal.isAchievedFunction = function (facts) {
        return facts.L.path_level[this.path] >= this.intensity;
    };
    
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
    
    // WorldModel.levelGreaterEqual(path, rapport_level, path_level) > people
    goal.isAchievedFunction = function (facts) {
console.log("On Development ...Including for aggregation rules (count, sum, avrg, max min)");
        return facts.L.path_level[this.path] >= this.intensity;
    };
    return goal;
};


Goal.prototype.isAchieved = function (facts) {
    "use strict";
    if (this.duration >= 0 && this.duration !== -1) {
        return true;
    }
    if (this.isAchievedFunction(facts)) {
        return true;
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
    var candidates, candidate, rule, ruleid, candidateI, ratting;
console.log("On Development... Rule.prototype.getCandidates(facts)");
    this.clearIntentions();
    if (this.duration <= 0 && this.duration !== -1) {
        return this;
    }
    for (ruleid in rules) {
        rule = rules[ruleid];
        candidates = rules[ruleid].getCandidates(facts);
        for (candidateI in candidates) {
            candidate = candidates[candidateI];
            ratting = this.getRatting(rule, candidate, worldModel);
            this.addIntention(ratting, rule, candidate);
        }
    }
    this.executeIntentions();
    // max priority
    if (this.priority >= 0) {
        this.priority -= 1;
    }
    // permantent task
    if (this.duration >= 0) {
        this.duration -= 1;
    }

    return this;
};

Goal.prototype.clearIntentions = function () {
    "use strict";
    this.intentions = [];
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
    var p = Math.random(), intention;
    console.log("On Development... reframe how to manage priorities (goal) and rattings (intention)");
    // var doneSomething = false;
    for (var i = 0; i < this.intentions.length && i < Goal.MAX_INTENTIONS_PER_ROUND; i++) {
        intention = this.intentions[i];
        if (intention.ratting * this.priority > p) {
            intention.rule.execute({}, intention.candidate);
        }
    }
    // if (!doneSomething) {this.intentions[0].rule.execute(this.intentions[0].candidate)}
    // update worldModel

    return this;
};

Goal.prototype.getRatting = function (rule, candidate, worldModel) {
    "use strict";
    var sample = {}
    
    Object.assign(sample, rate_extractFeatures(rule));
    Object.assign(sample, rate_extractFeatures(candidate));
    rate_normalizeFeatures(worldModel, sample);
    
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
    rate_normalizeFeatures(worldModel, sample);
    rate_updateNeighbour(worldModel, sample, feedback);
    rate_alignment(); // re-clustering, condensation and removing less relevant nodes

    return this;
  
};

var rate_extractFeatures = function (candidate) {
      "use strict";
    // iterate and re-iterate
    console.log("On Development...."+candidate);
    
};
var rate_normalizeFeatures = function (worldModel, sample) {
      "use strict";
    console.log("On Development...."+worldModel+sample);
    
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


