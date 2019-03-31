/*exported fact, createMainChar, createInhabitant, createAction, candidatesForInhabitantRule, guiActionsForInhabitant*/

var fact = {};

/*
mainchar = {
    selfvalue = [<relationships>],
    rapport = [<relationships>],
    pathLikehood = [<paths>]
}
*/
var createMainChar = function (name, time, energy, cash) {
    "use strict";
    if (name === undefined) {
        name = "mainchar";
    }
    if (time === undefined) {
        time = 0;
    }
    if (energy === undefined) {
        energy = 100;
    }
    if (cash === undefined) {
        cash = 100;
    }
    return {
        "id": name,
        "selfvalue": {},
        "rapport": {},
        "pathLikehood": {},
        "time": time,
        "energy": energy,
        "cash": cash
    };
};


/*
inhabitant = {
    selfvalue = [<relationships>],
    rapport = [<relationships>],
    pathLikehood = [<paths>]
}
*/
var createInhabitant = function (id) {
    "use strict";
    if (id === undefined) {
        id = "inhabitant_" + Math.floor(Math.random() * (1000 - 1));
    }
    return {
        "id": id,
        "selfvalue": {},
        "rapport": {},
        "pathLikehood": {}
    };
};

/*
type = <ENTRETAIN|ILLUSTRATE|NEG>
action = {
    cost: d6,
    path = <nice|bsdm|troya|exibition>;
    effect = D6,
    levelTrust = ,      // raport of T to L;                 - 0 for open actions
    levelSkill = ,      // skill required level of L or T;   - 0 for first actions
    entretain = D6,
    illustrate = D6,
    neg = D6
}
*/
var createAction = function (path, levelTrust, levelSkill, cost, entretain, illustrate, neg) {
    "use strict";
    if (cost === undefined) {
        cost = Math.floor(Math.random() * 20 + 1);
    }
    if (entretain === undefined) {
        entretain = Math.floor(Math.random() * 10 + 1);
    }
    if (illustrate === undefined) {
        illustrate = Math.floor(Math.random() * 10 + 1);
    }
    if (neg === undefined) {
        neg = Math.floor(Math.random() * 10 + 1);
    }
    if (levelTrust === undefined) {
        levelTrust = Math.floor(Math.random() * (5 + 1));
    }
    if (levelSkill === undefined) {
        levelSkill = Math.floor(Math.random() * (10 + 1));
    }
    if (path === undefined) {
        path = "nice";
    }
    return {
        "cost": cost,
        "levelTrust": levelTrust,
        "levelSkill": levelSkill,
        "path": path,
        "entretain": entretain,
        "illustrate": illustrate,
        "neg": neg
    };
};

