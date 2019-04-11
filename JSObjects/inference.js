
/*global Goal*/
function Inference() {
    "use strict";
    this.trainedSet = [];
}

Inference.K_NEIGHBOURGS = 3;
Inference.DISCRETE_DISTANCE_ON_MISS = 1000;

Inference.extractFeatures = function (object, prefix, seen) {
    "use strict";
    var extract = {}, feature, featureId;
    if (seen === undefined || seen === null) {
        seen = [];
    }
    if (prefix === undefined || prefix === null) {
        prefix = "";
    }
    
    for (featureId in object) {
        if (object.hasOwnProperty(featureId)) {
            feature = object[featureId];
            switch (typeof feature) {
            case 'number':
            case 'string':
            case 'boolean':
                extract[prefix + ":" + featureId] = feature;
                break;
            case 'object':
                if (feature !== null) {
                    if (seen.indexOf(feature) < 0) {
                        seen.push(feature);
                        Object.assign(extract, Inference.extractFeatures(feature, prefix + ":" + featureId, seen));
                    } else {
                        extract[prefix + ":" + featureId] = featureId;
                    }
                }
                break;
            }
        }
    }
    return extract;
};

Inference.prototype.normalizeFeatures = function (sample) {
    "use strict";
    console.log("On Development...." + sample);
    
};

/*
Norm1 |x_1 - y_1| + |x_2 - y_2| + ... |x_n - y_n|
*/
Inference.distance = function (obj1, obj2) {
    "use strict";
    var key, value1, value2,
        distance = 0;
    for (key in obj1) {
        if (obj1.hasOwnProperty(key) && key !== "ratting") {
            value1 = obj1[key];
            value2 = (obj2.hasOwnProperty(key)) ? obj2[key] : null;
            if (value1 === null || value2 === null || typeof value1 !== typeof value2) {
                distance += Inference.DISCRETE_DISTANCE_ON_MISS;
            } else {
                switch (typeof value1) {
                case 'number':
                    distance += Math.abs(value2 - value1);
                    break;
                case 'string':
                case 'boolean':
                    distance += (value1 === value2) ? 0 : Inference.DISCRETE_DISTANCE_ON_MISS;
                    break;
                }
            }
        }
    }
    
    return distance;
};

Inference.prototype.findClosestNeighbour = function (sample) {
    "use strict";
    var nodes = [],
        itemRef,
        item,
        i,
        ratting = 0,
        totaLength = 0;
    
    for (itemRef in this.trainedSet) {
        if (this.trainedSet.hasOwnProperty(itemRef)) {
            item = this.trainedSet[itemRef];
            nodes.push({
                "distance": Inference.distance(item, sample),
                "ratting": item.ratting
            });
        }
    }
    nodes.sort(function (obj1, obj2) {
        return obj1.distance - obj2.distance;
    });
console.log("Verifying Sorting - Inference.prototype.findClosestNeighbour");
console.log(nodes);
    for (i = 0; i < Inference.K_NEIGHBOURGS && i < nodes.length; i += 1) {
        totaLength += nodes[i].distance;
    }
    for (i = 0; i < Inference.K_NEIGHBOURGS && i < nodes.length; i += 1) {
        ratting += (1 - (nodes[i].distance / totaLength)) * nodes[i].ratting;
    }
    return ratting;
};

Inference.prototype.updateNeighbour = function (sample, feedback) {
    "use strict";
    var i = this.trainedSet.indexOf(sample);
    if (i >= 0) {
        sample.ratting = feedback;
        this.trainedSet.push(sample);
    } else {
        this.trainedSet[i].ratting = feedback;
    }
    return this;
};

Inference.prototype.alignment = function () { // re-clustering, condensation and removing less relevant nodes 
    "use strict";
    console.log("On Development....");
};


