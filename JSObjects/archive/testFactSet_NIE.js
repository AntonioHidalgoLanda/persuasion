/* Neg, Entretain, Illustrate*/

var fact = {};

/*
mainchar = {
    selfvalue = [<relationships>],
    rapport = [<relationships>],
    pathLikehood = [<paths>]
}
*/
var createMainChar = function (name, time, energy, cash) {
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
}


/*
inhabitant = {
    selfvalue = [<relationships>],
    rapport = [<relationships>],
    pathLikehood = [<paths>]
}
*/
var createInhabitant = function (id) {
    if (id === undefined) {
        id = "inhabitant_" + Math.floor(Math.random()*(1000-1));
    }
    return {
        "id": id,
        "selfvalue": {},
        "rapport": {},
        "pathLikehood": {}
    };
};

/*
action = {
    cost: d6,
    path = <|||>;
    effect = D6,
    levelTrust = [<path>],
    levelSkill = [<path>],
    type = <ENTRETAIN|ILLUSTRATE|NEG>
}
*/
var createAction = function (path, levelTrust, levelSkill, cost, effect) {
    if (cost === undefined) {
        cost = Math.floor(Math.random()*(20)+1);
    }
    if (effect === undefined) {
        effect = Math.floor(Math.random()*(50)+1);
    }
    if (levelTrust === undefined) {
        levelTrust = Math.floor(Math.random()*(5+1));
    }
    if (levelSkill === undefined) {
        levelSkill = Math.floor(Math.random()*(10+1));
    }
    if (path === undefined) {
        path = "nice";
    }
    return {
        "cost": cost,
        "effect": effect,
        "levelTrust": levelTrust,
        "levelSkill": levelSkill,
        "path": path
    };
};

