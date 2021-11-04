import { Utils } from './utils.js'
var Meyda = require('meyda')
var DynamicTimeWarping = require('dynamic-time-warping')

export class Recognize {
    // initial states
    static startTime = null;
    static endTime = null;
    static calibMode = false;
    static mfccHistoryArr = [];
    static mfccHistoryCunters = [];
    static dictionary = ['N', 'R', 'B','K','Q','a','b','c','d','e','f','g','h','x','O-O', '1','2','3','4','5','6','7','8'];
    static bufferSize = 2048;
    static _buffArrSize = 70;
    static _minNumberOfVariants = 5;
    static _minKnnConfidence = 0;
    static _minDTWDist = 3000;
    static K_factor = 20;
    static mfccDistArr = [];
    static knnClosestGlobal = {};
    static bufferMfcc = [];
    static buffer = [];

    static saveRecognizedFeature = () => {
        if (this.knnClosestGlobal && this.knnClosestGlobal.transcript !== "") {
            // save current mfcc for next recognitions
            this.mfccHistoryArr.push({
                mfcc: this.bufferMfcc,
                transcript: this.knnClosestGlobal.transcript
            });
            if (!this.mfccHistoryCunters[this.knnClosestGlobal.transcript] && this.mfccHistoryCunters[this.knnClosestGlobal.transcript] !== 0)
                this.mfccHistoryCunters[this.knnClosestGlobal.transcript] = 0;
            this.mfccHistoryCunters[this.knnClosestGlobal.transcript]++;
        }
    }
    /**
     * train the system, assume that the passed audio data in the buffer fits the transcript
     * @param {*} _buffer 
     * @param {*} transcript 
     * @param {*} setStateFunc 
     */
    static train(_buffer, transcript, setStateFunc, word) {
        setStateFunc("training");
        this.buffer = _buffer;
        Meyda.bufferSize = this.bufferSize;

        // calculate mfcc data
        this.bufferMfcc = this.createMfccMetric();

        // save current mfcc for future recognitions
        this.mfccHistoryArr.push({
            mfcc: this.bufferMfcc,
            transcript: transcript,
            word
        });

        if (!this.mfccHistoryCunters[transcript] && this.mfccHistoryCunters[transcript] !== 0)
            this.mfccHistoryCunters[transcript] = 0;
        this.mfccHistoryCunters[transcript]++;
        
        console.log("Data to be saved: >>>>>>>>>>>>>>>>>>");
        // console.log(this.mfccHistoryCunters);
        // console.log(this.mfccHistoryArr);
        console.log(this.mfccHistoryArr.length);
        if(this.mfccHistoryArr.length >= this.dictionary.length*10) {
            // save in json file
            var jsonContent = JSON.stringify(this.mfccHistoryArr);
            console.log('10 data set saved');
            console.log(jsonContent);
            console.log(JSON.stringify(this.mfccHistoryCunters));
            // fs.writeFile("output.json", jsonContent, 'utf8');;
        }
        setStateFunc("training saved");
        return true;
    }

    // static loadInBuiltDataSet() {
    //     this.mfccHistoryArr = training1;
    //     this.mfccHistoryCunters = training1Cnter;

    // }

    /**
     * try to recognize what the audio data in the buffer is
     * @param {*} _buffer 
     * @param {*} setStateFunc 
     */
    static recognize(_buffer, setStateFunc) {
        this.buffer = _buffer;
        Meyda.bufferSize = this.bufferSize;
        console.log(this.mfccHistoryArr);
        console.log(this.mfccHistoryCunters);
        // calculate mfcc data
        this.bufferMfcc = this.createMfccMetric();

        // console.log(this.bufferMfcc);

        this.startTime = Utils.getTimestamp();
        setStateFunc("recognizing");

        // calculate DTW distance from all available trained data
        this.calculateDistanceArr();
        // console.log(this.mfccDistArr);

        // get closest one using knn
        var knnClosest;
        if (this.K_factor <= this.mfccHistoryArr.length) {
            knnClosest = this.getMostSimilarKnn(this.mfccDistArr, this.compareMfcc, this.K_factor);
            console.log('check 2',knnClosest);
            if (knnClosest &&
                (this.mfccHistoryCunters[knnClosest.transcript] < this._minNumberOfVariants
                    || knnClosest.confidence < this._minKnnConfidence))
                knnClosest = null;

            if (knnClosest && knnClosest.transcript !== "") {
                this.knnClosestGlobal = knnClosest;
            }

        }

        // validate that we have minimal recognition confidence
        if (!knnClosest || knnClosest.confidence < 0.5) {
            this.endTime = Utils.getTimestamp();
            setStateFunc("not recognized");
            console.log("recognition locally failed or returned no good result (" + (this.endTime - this.startTime) + " ms)");
            return null;
        }
        else {
            knnClosest.processTime = Utils.getTimestamp() - this.startTime;
        }
        setStateFunc("recognized");
        // console.log(knnClosest);
        return knnClosest;
    };


    /**
     * calculate DTW distance from dictionary mfcc history
     */
    static calculateDistanceArr() {
        this.mfccDistArr = [];
        for (var i = 0; i < this.mfccHistoryArr.length; i++) {
            if (this.isInDictionary(this.mfccHistoryArr[i].transcript)) {
                var dtw = new DynamicTimeWarping(this.mfccHistoryArr[i].mfcc, this.bufferMfcc, this.EuclideanDistance);
                var dist = dtw.getDistance();
                this.mfccDistArr.push({
                    dist: dist,
                    transcript: this.mfccHistoryArr[i].transcript,
                    word: this.mfccHistoryArr[i].word
                });
            }
        }
    }


    /**
     * search in dictionary
     */
    static isInDictionary(word) {
        for (var i = 0; i < this.dictionary.length; i++) {
            if (this.dictionary[i] === word)
                return true;
        }
        return false;
    }

    /**
     * get the most similar transcript from audio mfcc history array, using Knn Algorithm
     * @param {*} Items 
     * @param {*} CompFunc 
     * @param {*} k 
     */
    static getMostSimilarKnn(Items, CompFunc, k) {
        if (!Items || Items.length === 0)
            return;
        if (k > Items.length)
            return;
        console.log('check 3',Items.length);
        var items = Items;
        var compFunc = CompFunc;

        items.sort(compFunc);
        
        var kArr = items.slice(0, k);
        console.log('check 4', kArr);
        var simArr = [];
        var maxElm = {
            transcript: '',
            weight: 0,
            confidence: 0,
            word: -1
        };

        for (var i = 0; i < kArr.length; i++) {
            if (kArr[i].dist > this._minDTWDist)
                {
                console.log('continue;');    
                continue;
                }

            if (!simArr[kArr[i].transcript])
                simArr[kArr[i].transcript] = {
                    weight: 1000 / kArr[i].dist,
                }
            else {
                simArr[kArr[i].transcript].weight = simArr[kArr[i].transcript].weight + 1000 / kArr[i].dist;
            }

            if (maxElm.weight < simArr[kArr[i].transcript].weight) {
                maxElm = {
                    transcript: kArr[i].transcript,
                    weight: simArr[kArr[i].transcript].weight,
                    word: kArr[i].word
                };
            }
        }
        console.log('check similar array',simArr,kArr);

        if (maxElm && maxElm.transcript === '')
            maxElm = null;

        if (maxElm) {
            // calculate confidence
            var sum = 0, count = 0;
            for (i = 0; i < items.length; i++) {
                if (items[i].transcript === maxElm.transcript) {
                    sum = sum + items[i].dist;
                    count++;
                }
            }
            maxElm.confidence = this.getGaussianKernel(sum / count).toFixed(4);
        }
        // console.log('check 2',maxElm);
        return maxElm;
    }

    // 
    static getGaussianKernel(t) {
        return Math.pow(Math.E, -1 / 2 * Math.pow(t / 1000, 2));
    }

    /**
     * calculate audio buffer mfcc data
     */
    static createMfccMetric() {
        var mfccMetricArr = [];
        for (var i = 0; i < this._buffArrSize; i++) {
            if (this.buffer[i] && this.buffer[i].length === this.bufferSize) {
                var mfccMetric = Meyda.extract("mfcc", this.buffer[i]);
                mfccMetricArr.push(mfccMetric)
            }
        }
        // console.log('mfcc coefficients: ',mfccMetricArr);
        return mfccMetricArr;
    }

    /**
     * Euclidean Distance between two victors
     * @param {*} p 
     * @param {*} q 
     */
    static EuclideanDistance(p, q) {
        var d = 0;
        if (p.length !== q.length)
            return -1;
        for (var i = 0; i < p.length; i++) {
            d = d + Math.pow(p[i] - q[i], 2);
        }
        return Math.sqrt(d);
    }

    /**
     * Mfcc object comparison
     * @param {*} a 
     * @param {*} b 
     */
    static compareMfcc(a, b) {
        if (a.dist < b.dist)
            return -1;
        if (a.dist > b.dist)
            return 1;
        return 0;
    }
}