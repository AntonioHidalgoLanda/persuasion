/*global Inference, Inhabitant*/
function Goal() {
    "use strict";
    this.priority = Goal.INITIAL_PRIORITY;
    this.duration = Goal.INITIAL_DURATION;
    this.intentionMinThreshold = Goal.DEFAULT_INTENTION_MIN_THRESHOLD;
    
    this.intentions = [];
    
    this.inference = new Inference();
    this.achievedFunction = function () {return 0; };
}

Goal.INITIAL_PRIORITY = 1;
Goal.INITIAL_DURATION = 5;
Goal.MAX_INTENTIONS_PER_ROUND = 2;
Goal.DEFAULT_INTENTION_MIN_THRESHOLD = 0.5;
Goal.FEEDBACK_THRESHOLD = 0.2;


/*
TODO: This method should be moved to Inhabitant

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
TODO: This method should be moved to Inhabitant
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
        var peopleCount = 0, inhabitantID, inhabitant, inhabitants = {};
        for (inhabitantID in facts) {
            if (facts.hasOwnProperty(inhabitantID) && facts[inhabitantID] instanceof Inhabitant) {
                inhabitants[inhabitantID] = facts[inhabitantID];
            }
        }
        
        if (facts.hasOwnProperty("self") && facts.self.hasOwnProperty("rapport")) {
            for (inhabitantID in facts.self.rapport) {
                if (facts.self.rapport.hasOwnProperty(inhabitantID) && facts.self.rapport[inhabitantID] >= this.rapport_level) {
                    inhabitant = inhabitants[inhabitantID];
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


Goal.prototype.calculateIntentions = function (rules, facts, predefined) {
    "use strict";
    var candidates, candidate, rule, ruleid, candidateI, ratting;
    this.clearIntentions();
    if (this.duration <= 0 && this.duration !== -1) {
        return this;
    }
    for (ruleid in rules) {
        if (rules.hasOwnProperty(ruleid)) {
            rule = rules[ruleid];
            candidates = rules[ruleid].getCandidates(facts, predefined);
            for (candidateI in candidates) {
                if (candidates.hasOwnProperty(candidateI)) {
                    candidate = candidates[candidateI];
                    ratting = this.getRatting(rule, candidate);
                    this.addIntention(ratting, rule, candidate);
                }
            }
        }
    }
    return this.intentions;
};

/*
@param rules Rules available
@param facts Facts/Objects available to create candidates
@param predefined - Candidate which is partially constructed, the extended candidates should keep existing assignments
*/
Goal.prototype.resolve = function (rules, facts, predefined) {
    "use strict";
    
    this.calculateIntentions(rules, facts, predefined);

    this.executeIntentions(facts);
    
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


/*
The way it works, if all intention are below threshold, the first one will come up, which is a bit random
this, however, provides a random mutation element into the algorithm
*/
Goal.prototype.addIntention = function (ratting, rule, candidate) {
    "use strict";
    
    if (ratting > this.intentionMinThreshold || this.intentions.length === 0) {
        this.intentions.push({
            "ratting": ratting,
            "rule": rule,
            "candidate": candidate
        });
    }
    
    return this;
};

Goal.prototype.executeIntentions = function (facts) {
    "use strict";
    var intention, i, achievedPre, achievedPost, feedback;
    
    this.intentions.sort(function (obj1, obj2) {
        // greater to lesser
        return obj2.ratting - obj1.ratting;
    });
    
    for (i = 0; i < this.intentions.length && i < Goal.MAX_INTENTIONS_PER_ROUND; i += 1) {
        intention = this.intentions[i];
        achievedPre = this.achievedFunction(facts);
        intention.rule.execute({}, intention.candidate);
        achievedPost = this.achievedFunction(facts);
        if (Math.abs(achievedPre - achievedPost) >= Goal.FEEDBACK_THRESHOLD) {
            feedback = (achievedPre < achievedPost) ? achievedPost : -achievedPost;
            this.updateRatting(intention.rule, intention.candidate, feedback);
        }
    }

    return this;
};

Goal.prototype.getRatting = function (rule, candidate) {
    "use strict";
    var sample = {};
    
    Object.assign(sample, Inference.extractFeatures(rule, ":rule", Inference.FEATURE_EXTRACTION_UNLOOP_LEVEL));
    Object.assign(sample, Inference.extractFeatures(candidate));   // Avoid skiping inhabitants

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
