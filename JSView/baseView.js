/*global jQuery, Rule*/
/*global showMap*//*from JSView/mapView - we may create them as a class later*/
function BaseView(divId, inhabitant, actions) {
    "use strict";
    this.viewee = null;
    this.divId = null;
    this.inhabitant = inhabitant;
    this.actions = (actions !== null && actions !== undefined) ? actions : {};
    
    // structural
    this.mainDiv = null;
    this.headerDiv = null;
    this.picDiv = null;
    this.descriptionDiv = null;
    this.inhabitantsDiv = null;
    this.rulesDiv = null;
    
    // init
    this.setDivId(divId);
}

BaseView.DIV_ELEMENT_ID = {
    "HEADER_DIV": "persuasion_base_header",
    "PIC_DIV": "persuasion_base_picture",
    "DESCRIPTION_DIV": "persuasion_base_description",
    "INHABITANTS_DIV": "persuasion_base_inhabitants",
    "RULES_DIV": "persuasion_base_rules"
};

BaseView.HTML_CLASS = {
    "MAIN": "persuation"
};

BaseView.prototype.setDivId = function (divId) {
    "use strict";
    this.divId = divId;
};

BaseView.prototype.setViewee = function (viewee) {
    "use strict";
    this.viewee = viewee;
    this.refresh();
};

BaseView.prototype.refresh = function () {
    "use strict";
    if (this.divId === null) {
        return this;
    }
    
    if (this.mainDiv === null) {
        this.mainDiv = jQuery("#" + this.divId);
    }
    
    this.refreshHeader();
    this.refreshPicture();
    this.refreshDescription();
    this.refreshInhabitants();
    this.refreshRules();
    
    return this;
};

BaseView.prototype.emptyDiv = function (div, divId) {
    "use strict";
    
    if (this.divId === null) {
        return this;
    }
        
    if (this[div] === null) {
        this[div] = jQuery('<div/>', {
            id: divId,
            class: BaseView.HTML_CLASS.MAIN
        });
        
        this.mainDiv.append(this[div]);
    } else {
        this[div].empty();
    }
    
    return this;
      
};

BaseView.prototype.refreshHeader = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.HEADER_DIV + "_" + this.divId,
        content = "";
    
    if (this.viewee !== null) {
        if (typeof this.viewee.getName === "function") {
            content = this.viewee.getName();
        } else if (this.viewee.hasOwnProperty("name")) {
            content = this.viewee.name;
        }
    }
    this.emptyDiv("headerDiv", divId);
    
    if (this.headerDiv !== null) {
        this.headerDiv.append(jQuery('<h2/>', {
            text: content
        }));
    }
    
    return this;
};

BaseView.prototype.refreshPicture = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.PIC_DIV + "_" + this.divId,
        imageUri = (this.viewee !== null && this.viewee.hasOwnProperty("imageUri")) ? this.viewee.imageUri : "";

    if (this.divId === null) {
        return this;
    }
        
    if (this.picDiv === null) {
        this.picDiv = jQuery('<img/>', {
            id: divId,
            class: BaseView.HTML_CLASS.MAIN
        });
        
        this.mainDiv.append(this.picDiv);
    }
    this.picDiv.attr("src", imageUri);
    
    return this;
};

BaseView.prototype.refreshDescription = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.DESCRIPTION_DIV + "_" + this.divId,
        content = "";
    if (this.viewee !== null) {
        if (typeof this.viewee.description === "function") {
            content = this.viewee.description();
        } else if (this.viewee.hasOwnProperty("description")) {
            content = this.viewee.description;
        }
    }
    
    this.emptyDiv("descriptionDiv", divId);
    
    if (this.descriptionDiv !== null) {
        this.descriptionDiv.text(content);
    }
    
    if (this.viewee && typeof this.viewee.getD3SjonMap === "function") {
        showMap(this.viewee.getD3SjonMap(), divId);
    }
    
    return this;
};

// TODO
BaseView.prototype.refreshInhabitants = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.INHABITANTS_DIV + "_" + this.divId,
        inhabitant = null;
    
    this.emptyDiv("inhabitantsDiv", divId);
    
    if (this.viewee !== null && this.viewee.hasOwnProperty("inhabitants")) {
        for (var id in this.viewee.inhabitants) {
            inhabitant = this.viewee.inhabitants[id];
console.log("TODO - Define Inhabitant.getName()");
            this.inhabitantsDiv.append(jQuery('<button/>', {
                text: inhabitant.id,
                click: this.handerChangeViewee(inhabitant)
            }));
        }
    }
    if (this.viewee && this.viewee.currentRoom !== null && this.viewee.currentRoom !== undefined) {
        this.inhabitantsDiv.append(jQuery('<button/>', {
            text: "Check " + this.viewee.currentRoom.getName(),
            click: this.handerChangeViewee(this.viewee.currentRoom)
        }));
    }
    return this;
};

BaseView.prototype.refreshRules = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.RULES_DIV + "_" + this.divId,
        ruleSet = {};
    
    this.emptyDiv("rulesDiv", divId);
    
    if (this.viewee !== null) {
        if (typeof this.viewee.getRules === "function") {
            ruleSet = this.viewee.getRules();
        } else if (this.viewee.hasOwnProperty("ruleSet")) {
            ruleSet = this.viewee.ruleSet;
        }
    }
    
    for (var ruleName in ruleSet) {
        var rule = ruleSet[ruleName];
console.log("RULE:   " + ruleName);
        var candidates = this.candidatesForVieweeALT(rule);
                                                              
        for (var n in candidates) {
            var candidate = candidates[n];
            this.rulesDiv.append(jQuery('<button/>', {
                text: ruleName + ": " + candidate.action.path + " " + candidate.action.levelSkill,
                click: this.handerExecuteCandidate(candidate, rule)
            }));
        }
    }
    return this;
};

BaseView.prototype.candidatesForVieweeALT = function (rule) {
    "use strict";
    var candidates = [];
    for (var actionName in this.actions) {
        var action = this.actions[actionName];
        var candidate = {
            "action": action,
            "L": this.inhabitant,
            "T": this.viewee,
            "Math": Math
        };
        if (rule.isValidCandidate(candidate)) {
            candidates.push(candidate);
        }
    }
    
    return candidates;
};

BaseView.prototype.handerExecuteCandidate = function (candidate, rule) {
    "use strict";
    var that = this;
    return function() {
        rule.execute({}, candidate);
        that.refresh();
    };
};


BaseView.prototype.handerChangeViewee = function (newviewee) {
    "use strict";
    var that = this;
    return function() {
        that.setViewee(newviewee);
    };
};

