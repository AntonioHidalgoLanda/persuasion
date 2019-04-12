/*global Inference*/
function Goal() {
    "use strict";
    this.priority = Goal.INITIAL_PRIORITY;
    this.duration = Goal.INITIAL_DURATION;
    
    this.intentions = [];
    
    this.inference = new Inference();
    this.isAchievedFunction = function () {return true; };
}

Goal.INITIAL_PRIORITY = 1;
Goal.INITIAL_DURATION = 5;
Goal.MAX_INTENTIONS_PER_ROUND = 3;

/*
e.g. vent-out, get-privacy, drag-attention

facts = {
    "self": this
}

*/
Goal.createIntinct = function (path, intensity) {
    "use strict";
    var goal = new Goal(Goal.RULE_INSTINCT_ACHIEVEMNENT);
    
    goal.path = path;
    goal.intensity = intensity;
    goal.priority = -1;
    
    goal.achievedFunction = function (facts) {
        return facts.self.pathLikehood[this.path] - this.intensity;
    };
    
    return goal;
};

/*

facts = {
    "self": this,
    "inhabitants": {inhabitant.id:inhabitant, ..}
}
*/
Goal.createPathFollowers = function (people, path, rapport_level, path_level) {
    "use strict";
    var goal = new Goal(Goal.RULE_PATH_FOLLOWER_ACHIEVEMNENT);
    
    goal.people = people;
    goal.path = path;
    goal.rapport_level = rapport_level;
    goal.path_level = path_level;
    goal.duration = -1;
    
    goal.achievedFunction = function (facts) {
        var peopleCount = 0, inhabitantID, inhabitant;
        if (facts.hasOwnProperty("self") && facts.self.hasOwnProperty("rapport")) {
            for (inhabitantID in facts.self.rapport) {
                if (facts.self.rapport.hasOwnProperty(inhabitantID) && facts.self.rapport[inhabitantID] >= this.rapport_level) {
                    inhabitant = facts.inhabitants[inhabitantID];
                    if (inhabitant.pathLikehood[this.path] >= this.path_level) {
                        peopleCount += 1;
                    }
                }
            }
        }
        return peopleCount - this.people;
    };
    return goal;
};


Goal.prototype.isAchieved = function (facts) {
    "use strict";
    if (this.duration <= 0 && this.duration !== -1) {
        return true;
    }
    return this.achievedFunction(facts) >= 0;
};

// Sub Goals or Intentions (actions)
/*
@param rules Rules available
@param facts Facts/Objects available to create candidates
*/
Goal.prototype.resolve = function (rules, facts, predefined) {
    "use strict";
    var candidates, candidate, rule, ruleid, candidateI, ratting;
    this.clearIntentions();
    if (this.duration <= 0 && this.duration !== -1) {
        return this;
    }
    for (ruleid in rules) {
        rule = rules[ruleid];
        candidates = rules[ruleid].getCandidates(facts, predefined);
        for (candidateI in candidates) {
            candidate = candidates[candidateI];
            ratting = this.getRatting(rule, candidate);
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
    console.log("On Development... feedback to world model");
    console.log("Check this.achievedFunction(facts) before runing the intentions and after running the intentions. If there is positive change, updateRatting with new ratting value.");
    // var doneSomething = false;
    for (var i = 0; i < this.intentions.length && i < Goal.MAX_INTENTIONS_PER_ROUND; i++) {
        intention = this.intentions[i];
        if (intention.ratting * this.priority > p) {
            intention.rule.execute({}, intention.candidate);
            // check results
            // feedback = achievedFunction (WM);
            //this.inference.updateRatting(sample, feedback);
        }
    }
    // if (!doneSomething) {this.intentions[0].rule.execute(this.intentions[0].candidate)}
    //

    return this;
};

Goal.prototype.getRatting = function (rule, candidate) {
    "use strict";
    var sample = {}
    
    Object.assign(sample, Inference.extractFeatures(rule, ":rule", Inference.FEATURE_EXTRACTION_UNLOOP_LEVEL));
    Object.assign(sample, Inference.extractFeatures(candidate));   // Avoid skiping inhabitants
    this.inference.standarizeFeatures();

    return this.inference.findClosestNeighbour(sample);
};

/*
used when learing:
 * after perform action
 * with an action discovery/exploration of suroundings
 * with action verval exchange with other inhabitant
*/
Goal.prototype.updateRatting = function (rule, candidate, feedback) {
      "use strict";
    var sample = {};

    Object.assign(sample, Inference.extractFeatures(rule, ":rule", Inference.FEATURE_EXTRACTION_UNLOOP_LEVEL));
    Object.assign(sample, Inference.extractFeatures(candidate));   // Avoid skiping inhabitants
    this.inference.updateNeighbour(sample, feedback);
    this.inference.standarizeFeatures();
    this.inference.alignment(); // re-clustering, condensation and removing less relevant nodes

    return this;
  
};
