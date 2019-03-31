/*exported candidatesForInhabitantRule, guiActionsForInhabitant*/
/*global jQuery*/

// GUI Actions Inhabitant
var candidatesForInhabitantRule = function (rule, actions, lead, target) {
    "use strict";
    var candidates = [];
    for (var actionName in actions) {
        var action = actions[actionName];
        var candidate = {
            "action": action,
            "L": lead,
            "T": target,
            "Math": Math
        };
        if (rule.isValidCandidate(candidate)) {
            candidates.push(candidate);
        }
    }
    
    return candidates;
};

var handerExecuteCandidate = function (divId, candidate, rule, actions) {
    "use strict";
    return function() {
        rule.execute({}, candidate);
        var candidates = candidatesForInhabitantRule(rule, actions, candidate.L, candidate.T);
        guiActionsForInhabitant(divId, candidates, rule, actions);
    };
};

var guiActionsForInhabitant = function (divId, candidates, rule, actions) {
    "use strict";
    var divRules = jQuery("#" + divId);
    divRules.empty();
    for (var n in candidates) {
        var candidate = candidates[n];
        divRules.append(jQuery('<button/>', {
            text: candidate.action.path + " " + candidate.action.levelSkill,
            click: handerExecuteCandidate (divId, candidate, rule, actions)
        }));

    }  
};
