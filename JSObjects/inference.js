function Inference() {
    "use strict";
    this.trainedSet = [];
    this.stdTrainingSet = [];
}

Inference.K_NEIGHBOURGS = 3;
Inference.POPULATION_TARGET = 10; // when condensation is applied, we will reduce the population to this number
Inference.POPULATION_MAX = 15; // at this limit, the condensation will be applied
Inference.DISCRETE_DISTANCE_ON_MISS = 1;
Inference.FEATURE_EXTRACTION_UNLOOP_LEVEL = 2;

Inference.extractFeatures = function (object, prefix, level) {
    "use strict";
    var extract = {}, feature, featureId;
    if (level === undefined) {
        level = 0;
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
                    if (level < Inference.FEATURE_EXTRACTION_UNLOOP_LEVEL) {
                        Object.assign(extract, Inference.extractFeatures(feature, prefix + ":" + featureId, level + 1));
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
    this.stdTrainingSet = [];
    for (feature in this.standarized) {
        if (this.standarized.hasOwnProperty(feature)) {
            this.standarized[feature].mean = this.standarized[feature].total / this.standarized[feature].count;
            this.standarized[feature].stdDev = Math.abs(this.standarized[feature].max - this.standarized[feature].min);
            
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
                        this.standarized[feature] = {
                            "count": 0,
                            "total": 0
                        };
                    }
                    value = item[feature];
                    this.standarized[feature].count += 1;
                    if (typeof item[feature] === "number") {
                        this.standarized[feature].total += value;
                        if (!this.standarized[feature].hasOwnProperty("max") || this.standarized[feature].max < value) {
                            this.standarized[feature].max = value;
                        }
                        if (!this.standarized[feature].hasOwnProperty("min") || this.standarized[feature].min > value) {
                            this.standarized[feature].min = value;
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
    var featureStd, stdDev;
    if (this.stdTrainingSet.length === 0 || !this.standarized.hasOwnProperty(feature) || typeof sample !== "number") {
        return sample;
    } else {
        featureStd = this.standarized[feature];
        stdDev = (featureStd.stdDev === 0) ? 1 : featureStd.stdDev;
        return (sample - featureStd.mean) / stdDev;
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
    for (i = 0; i < Inference.K_NEIGHBOURGS && i < nodes.length; i += 1) {
        totaLength += nodes[i].distance;
    }
    for (i = 0; i < Inference.K_NEIGHBOURGS && i < nodes.length; i += 1) {
        if (totaLength !== 0) {
            ratting += (1 - (nodes[i].distance / totaLength)) * nodes[i].ratting;
        } else {
            ratting += nodes[i].ratting / Math.max(Inference.K_NEIGHBOURGS, nodes.length);
        }
    }
    return ratting;
};

Inference.prototype.updateNeighbour = function (sample, feedback) {
    "use strict";
    var i = this.trainedSet.indexOf(sample);
    if (i < 0) {
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
    if (this.trainedSet.length >= Inference.POPULATION_MAX) {
        
        this.trainedSet.sort(function (obj1, obj2) {
            return Math.abs(obj1.ratting - obj2.ratting);
        });
        
        this.trainedSet.length = Inference.POPULATION_TARGET;
        
        console.log("On Development... data condensation");
        
        this.standarizeFeatures();
    }
};


