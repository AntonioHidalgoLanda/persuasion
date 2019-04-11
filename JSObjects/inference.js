function Inference() {
    "use strict";
    this.trainedSet = [];
    this.stdTrainingSet = [];
}

Inference.K_NEIGHBOURGS = 3;
Inference.DISCRETE_DISTANCE_ON_MISS = 1;

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

/*
z = (x - Mean)/std_deviation

z[] -> mean = 0; std = 1

*/
var populateStandarizedTrainingSet = function () {
    "use strict";
    var itemRef, item, feature;
    for (feature in this.standarized) {
        if (this.standarized.hasOwnProperty(feature)) {
            this.standarized[feature].mean = this.standarized[feature].total / this.standarized[feature].count;
            this.standarized[feature].stdDev = Math.abs(this.standarized[feature].max - this.standarized[feature].min);
            
            this.stdTrainingSet = [];
            for (itemRef in this.trainedSet) {
                if (this.trainedSet.hasOwnProperty(itemRef) && this.trainedSet[itemRef].hasOwnProperty(feature)) {
                    item = this.trainedSet[itemRef];
                    if (this.stdTrainingSet[itemRef] === undefined || this.stdTrainingSet[itemRef] === null) {
                        this.stdTrainingSet[itemRef] = {};
                        this.stdTrainingSet[itemRef].ratting = item.ratting;
                    }
                    this.stdTrainingSet[itemRef][feature] = this.zScoreFeature(item[feature], feature);
                }
            }
        }
    }
    return this;
};

Inference.prototype.standarizeFeatures = function () {
    "use strict";
    var itemRef, item, feature, value;
    this.standarized = {};
    
    for (itemRef in this.trainedSet) {
        if (this.trainedSet.hasOwnProperty(itemRef)) {
            item = this.trainedSet[itemRef];
            for (feature in item) {
                if (item.hasOwnProperty(feature) && feature !== "ratting") {
                    if (!this.standarized.hasOwnProperty(feature)) {
                        value = item[feature];
                        this.standarized[feature] = {
                            "count": 0,
                            "total": 0,
                            "max": 0,
                            "min": 0
                        };
                        this.standarized[feature].count += 1;
                        if (typeof item[feature] === "number") {
                            this.standarized[feature].total += value;
                            this.standarized[feature].max = Math.max(value, this.standarized[feature].max);
                            this.standarized[feature].min = Math.min(value, this.standarized[feature].min);
                        }
                    }
                }
            }
        }
    }
    populateStandarizedTrainingSet.call(this);  // calling function privately
    return this;
};

/*
z = (x - Mean)/std_deviation
*/
Inference.prototype.zScoreFeature = function (sample, feature) {
    "use strict";
    var featureStd;
    if (this.stdTrainingSet.length === 0 || !this.stdTrainingSet.hasOwnProperty(feature) || typeof feature !== "number") {
        return sample;
    } else {
        featureStd = this.stdTrainingSet[feature];
        if (featureStd.stdDev === 0) {
            return 0;
        } else {
            return (sample - featureStd.mean) / featureStd.stdDev;
        }
    }
};

Inference.prototype.zScore = function (sample) {
    "use strict";
    var feature, stdSample = {};
    for (feature in sample) {
        if (sample.hasOwnProperty(feature)) {
            stdSample[feature] = this.zScoreFeature(sample[feature], feature);
        }
    }
    return stdSample;
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

Inference.prototype.getTraningSample = function (index) {
    "use strict";
    if (this.stdTrainingSet.length > 0) {
        return this.stdTrainingSet[index];
    } else {
        return this.trainedSet[index];
    }
};

Inference.prototype.getTraningSetLenght = function () {
    "use strict";
    return (this.stdTrainingSet.length > 0) ? this.stdTrainingSet.length : this.trainedSet.length;
};

Inference.prototype.findClosestNeighbour = function (sample) {
    "use strict";
    var nodes = [],
        itemRef,
        item,
        stdSample,
        i,
        ratting = 0,
        totaLength = 0;
    
    for (itemRef = 0; itemRef < this.getTraningSetLenght(); itemRef += 1) {
        item = this.getTraningSample(itemRef);
        stdSample = this.zScore(sample);
        nodes.push({
            "distance": Inference.distance(item, stdSample),
            "ratting": item.ratting
        });
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
    this.standarizeFeatures();
    return this;
};

Inference.prototype.alignment = function () { // re-clustering, condensation and removing less relevant nodes 
    "use strict";
    console.log("On Development... data condensation");
};


