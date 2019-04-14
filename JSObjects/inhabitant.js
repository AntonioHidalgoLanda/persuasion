/*global Rule, Action, Goal*/
function Inhabitant(id) {
    "use strict";
    this.id = (id === undefined || id === null) ? "inhabitant_" + Math.floor(Math.random() * (1000 - 1)) : id;
    this.selfvalue = {};
    this.rapport = {};
    this.pathLikehood = {};
    this.cash = 100;
        
    // Action discover (also persuade illustrate) may change World View
}

Inhabitant.AUTONOMY = {
    "GOALS_PER_TURN": 3,
    "MAX_GOALS": 10,
    "PROBABILITY_BUILD_GOAL_FOLLOWERS": 0.7,
    "PROBABILITY_BUILD_GOAL_INSTINCT": 0.3,
    "GOAL_CREATION_PARAMETERS": {
        "PEOPLE_MIN": 1,
        "PEOPLE_MAX": 5,
        "LEVEL_RAPPORT_MIN": 10,
        "LEVEL_RAPPORT_MAX": 90,
        "LEVEL_PATH_MIN": 70,
        "LEVEL_PATH_MAX": 90,
        "INTENSITY_MIN": 60,
        "INTENSITY_MAX": 150
    },
    "ruleSet": {}
};

// TODO: resume(room) // if (room in intentions.goto())GoTo room; resumeGoals(); resumeIntentions(); resumeWorld();
// TODO: Attempt(Intention(room))
Inhabitant.ruleSet = {
    "persuade": new Rule(Action.persuade.condition, Action.persuade.reaction)
};

Object.assign(Inhabitant.AUTONOMY.ruleSet, Inhabitant.ruleSet);

Inhabitant.prototype.getName = function () {
    "use strict";
    return (this.hasOwnProperty("textName")) ? this.textName : this.id;
};


Inhabitant.prototype.getRules = function () {
    'use strict';
    return Inhabitant.ruleSet;
};

Inhabitant.createLeader = function (id, time, energy, cash) {
    "use strict";
    var inhabitant = new Inhabitant(id);
    if (time === undefined) {
        time = 0;
    }
    if (energy === undefined) {
        energy = 100;
    }
    if (cash === undefined) {
        cash = 100;
    }
    inhabitant.cash = cash;
    
    return inhabitant;
};

// TODO - Multi Path action

Inhabitant.prototype.isPathLevelGreater = function (path, level) {
    "use strict";
    return ((level <= 0) || (this.pathLikehood.hasOwnProperty(path) && this.pathLikehood[path] >= level));
};

Inhabitant.prototype.isRapportLevelGreater = function (inhabitantId, level) {
    "use strict";
    return ((level <= 0) || (this.rapport.hasOwnProperty(inhabitantId) && this.rapport[inhabitantId] >= level));
};

Inhabitant.prototype.increasePathLevel = function (path, increase, limit, slope) {
    "use strict";
    var increment = increase;
    if (!this.pathLikehood.hasOwnProperty(path)) {
        this.pathLikehood[path] = 0;
    }
    increase += this.pathLikehood[path];
    this.pathLikehood[path] += Inhabitant.convergentIncrement(increase, limit, increment, slope);
    return this;
};

Inhabitant.prototype.increaseRapport = function (inhabitantId, increase, limit, slope) {
    "use strict";
    var increment = increase;
    if (!this.rapport.hasOwnProperty(inhabitantId)) {
        this.rapport[inhabitantId] = 0;
    }
    increase += this.rapport[inhabitantId];
    this.rapport[inhabitantId] += Inhabitant.convergentIncrement(increase, limit, increment, slope);
    return this;
};

/*
We are using the following sigmoid:
slope : .3
from https://www.wolframalpha.com
plot  (1 - (x-100)/(40 + abs(x-100)))/2  from 0 to 200
(1 - (x-(maxValue/2))/(((maxValue/2)*slope) + abs(x-(maxValue/2))))/2 * TopIncrement
*/
Inhabitant.convergentIncrement = function (x, limit, topIncrement, slope) {
    "use strict";
    if (typeof limit !== "number") {
        limit = 100;
    }
    if (typeof topIncrement !== "number") {
        topIncrement = 1;
    }
    if (typeof slope !== "number") {
        slope = 0.3;
    }
    return (1 - (x - (limit / 2)) / (((limit / 2) * slope) + Math.abs(x - (limit / 2)))) / 2 * topIncrement;
};

Inhabitant.random = function (max, min) {
    "use strict";
    if (typeof max !== "number") {
        max = 1;
    }
    if (typeof min !== "number") {
        min = 0;
    }
    return Math.floor(Math.random() * max) + min;
};

Inhabitant.randomPath = function (actions) {
    "use strict";
    var actionIdx,
        paths = [],
        random;
    if (actions !== undefined) {
        for (actionIdx in actions) {
            if (actions.hasOwnProperty(actionIdx) && actions[actionIdx].hasOwnProperty("pathName")) {
                paths.push(actions[actionIdx].pathName);
            }
        }
        random = Inhabitant.random(paths);
        return paths[random];
    }
    return;
};

Inhabitant.prototype.buildTurnAutomnomy = function (actions, goals) {
    "use strict";
    var goalIdx,
        goal,
        ruleName,
        rule,
        p = Math.random();
    
    this.actions = actions;
    
    if (goals === undefined) {
        this.goals = [];
        
        if (p > Inhabitant.AUTONOMY.PROBABILITY_BUILD_GOAL_FOLLOWERS) {
            this.goals.push(Goal.createPathFollowers(
                Inhabitant.random(Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.PEOPLE_MAX,
                                  Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.PEOPLE_MIN),
                Inhabitant.randomPath(actions),
                Inhabitant.random(Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.LEVEL_RAPPORT_MAX,
                                  Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.LEVEL_RAPPORT_MIN),
                Inhabitant.random(Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.LEVEL_PATH_MAX,
                                  Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.LEVEL_PATH_MIN)
            ));
        }

        if (this.goals.length < 1 || p > Inhabitant.AUTONOMY.PROBABILITY_BUILD_GOAL_INSTINCT) {
            this.goals.push(Goal.createIntinct(
                Inhabitant.randomPath(actions),
                Inhabitant.random(Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.INTENSITY_MAX,
                                  Inhabitant.AUTONOMY.GOAL_CREATION_PARAMETERS.INTENSITY_MIN)
            ));
        }
        
        for (goalIdx = 0; goalIdx < this.goals.length; goalIdx += 1) {
            goal = this.goals[goalIdx];
            for (ruleName in Inhabitant.AUTONOMY.ruleSet) {
                if (Inhabitant.AUTONOMY.ruleSet.hasOwnProperty(ruleName)) {
                    rule = Inhabitant.AUTONOMY.ruleSet[ruleName];
                    goal.updateRatting(rule, {"L": this}, 0);
                }
            }
        }
    } else {
        this.goals = goals;
    }
    return this;
};

Inhabitant.prototype.executeTurn = function () {
    "use strict";
    var goalIdx,
        goal,
        facts = {"self": this};
    
    Object.assign(facts, this.actions);
    if (this.hasOwnProperty("currentRoom")) {
        facts.currentRoom = this.currentRoom;
        Object.assign(facts, this.currentRoom.inhabitants);
        Object.assign(facts, this.currentRoom.entrance);
        //TODO MISSING ACTIONS - from the ROOM
    }
    
    if (this.goals !== undefined && this.goals !== null) {
        
        this.goal.sort(function (obj1, obj2) {
            if (obj1.priority === -1 && obj2.priority !== -1) {
                return Number.MAX_SAFE_INTEGER;
            }
            if (obj1.priority !== -1 && obj2.priority === -1) {
                return Number.MIN_SAFE_INTEGER;
            }
            return obj1.priority - obj2.priority;
        });
        
        if (this.goals.length > Inhabitant.AUTONOMY.MAX_GOALS) {
            this.goals.length = Inhabitant.AUTONOMY.MAX_GOALS;
        }
        
        for (goalIdx = 0; goalIdx < this.goals.length && goalIdx < Inhabitant.AUTONOMY.GOALS_PER_TURN; goalIdx += 1) {
            goal = this.goals[goalIdx];
            goal.resolve(Inhabitant.AUTONOMY.ruleSet, facts, {"L": this});
        }
    }
    return this;
};


// TODO - remplace this by something more sensible, this is only for test
Inhabitant.prototype.description = function () {
    'use strict';
    var innerHtml = "";
    innerHtml += this.getName() + "</br>";
    innerHtml += "Cash: " + this.cash + "</br>";
    innerHtml += "Selfsteem: " + JSON.stringify(this.selfvalue) + "</br>";
    innerHtml += "People: " + JSON.stringify(this.rapport) + "</br>";
    innerHtml += "Paths: " + JSON.stringify(this.pathLikehood) + "</br>";
    
    return innerHtml;
};


