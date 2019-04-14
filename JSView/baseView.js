/*global jQuery, Inhabitant, Room*/
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
            'id': divId,
            'class': BaseView.HTML_CLASS.MAIN
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
        imageUri = "";
    if (this.viewee !== null) {
        if (typeof this.viewee.getImageUri === "function") {
            imageUri = this.viewee.getImageUri();
        } else if (this.viewee.hasOwnProperty("imageUri")) {
            imageUri = this.viewee.imageUri;
        }
    }

    if (this.divId === null) {
        return this;
    }
        
    if (this.picDiv === null) {
        this.picDiv = jQuery('<img/>', {
            'id': divId,
            'class': BaseView.HTML_CLASS.MAIN
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

BaseView.prototype.refreshInhabitants = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.INHABITANTS_DIV + "_" + this.divId,
        inhabitant = null;
    
    this.emptyDiv("inhabitantsDiv", divId);
    
    if (this.viewee !== null && this.viewee.hasOwnProperty("inhabitants")) {
        for (var id in this.viewee.inhabitants) {
            inhabitant = this.viewee.inhabitants[id];
            this.inhabitantsDiv.append(jQuery('<button/>', {
                text: inhabitant.getName(),
                click: this.handerChangeViewee(inhabitant)
            }));
        }
    }
    if (this.inhabitant && this.inhabitant.currentRoom !== null && this.inhabitant.currentRoom !== undefined) {
        this.inhabitantsDiv.append(jQuery('<button/>', {
            text: "Check " + this.inhabitant.currentRoom.getName(),
            click: this.handerChangeViewee(this.inhabitant.currentRoom)
        }));
    }
    return this;
};

BaseView.prototype.refreshRules = function () {
    "use strict";
    var divId = BaseView.DIV_ELEMENT_ID.RULES_DIV + "_" + this.divId,
        facts = {"self": this.inhabitant},
        ruleSet = {},
        rule,
        ruleName,
        candidates
        candidate = {
            "L": this.inhabitant,
        };
    
    
    this.emptyDiv("rulesDiv", divId);
    
    if (this.viewee !== null) {
        Object.assign(facts, this.actions);
        if (this.inhabitant !== null && this.inhabitant.hasOwnProperty("currentRoom")) {
            facts.currentRoom = this.inhabitant.currentRoom;
            Object.assign(facts, facts.currentRoom.inhabitants);
            Object.assign(facts, this.viewee.entrance);
        }
        
        if (this.viewee instanceof Inhabitant && this.viewee !== this.inhabitant) {
            candidate.T = this.viewee;
        }
        
        if (typeof this.viewee.getRules === "function") {
            ruleSet = this.viewee.getRules();
        } else if (this.viewee.hasOwnProperty("ruleSet")) {
            ruleSet = this.viewee.ruleSet;
        }
        
        for (ruleName in ruleSet) {
            if (ruleSet.hasOwnProperty(ruleName)) {
                rule = ruleSet[ruleName];
                candidates = rule.getCandidates(facts, candidate);
                for (var candidateIdx in candidates) {
                    if (candidates.hasOwnProperty(candidateIdx)) {
                        var candidate = candidates[candidateIdx];
                        this.rulesDiv.append(jQuery('<button/>', {
                            text: ruleName + " " + BaseView.candidateName(candidate),
                            click: this.handerExecuteCandidate(candidate, rule)
                        }));
                    }
                }
            }
        } 
    }
    
    return this;
};

BaseView.candidateName = function (candidate) {
    "use strict";
    var name = "";
    for (var target in candidate) {
        if(typeof candidate[target].getName === "function") {
            name += ", " + candidate[target].getName();
        } else if (candidate[target].hasOwnProperty("id")) {
            name += ", " + candidate[target].id;
        } else if (candidate[target] !== Math) {
            name += JSON.stringify(candidate[target]);
        }
    }
    return name;
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

