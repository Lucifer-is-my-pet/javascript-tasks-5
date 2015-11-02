function initializeHandler(student, func, callsLimit) {
    var newEventHandler = {
        student: student,
        function: func.bind(student)
    };
    if (typeof callsLimit !== 'undefined') {
        newEventHandler['numOfCalls'] = 0;
        newEventHandler['callsLimit'] = callsLimit;
    }
    return newEventHandler;
}

function addHandler(listOfEvents, eventName, handler) {
    if (Object.keys(listOfEvents).indexOf(eventName) + 1) {
        listOfEvents[eventName].push(handler);
    } else {
        listOfEvents[eventName] = [handler];
    }
}

module.exports = function () {
    return {
        listOfEvents: {},
        on: function (eventName, student, callback) {
            var newEventHandler = initializeHandler(student, callback);
            addHandler(this.listOfEvents, eventName, newEventHandler);
        },

        off: function (eventName, student) {
            if (Object.keys(this.listOfEvents).indexOf(eventName) + 1) {
                var isThereSuchStudent = false;
                for (var i in this.listOfEvents) {
                    if (i.indexOf(eventName) + 1) {
                        var currentList = this.listOfEvents[i];
                        for (var j in currentList) {
                            if (currentList[j]['student'] === student) {
                                isThereSuchStudent = true;
                                currentList.splice(j, 1);
                            }
                        }
                    }
                }
                if (!isThereSuchStudent) {
                    console.error('Такого студента нет!');
                }
            } else {
                console.error('События не существует!');
            }
        },

        emit: function (eventName) {
            for (var i in this.listOfEvents) {
                if (eventName.indexOf(i) + 1) {
                    var currentEvent = this.listOfEvents[i];
                    for (var j in currentEvent) {
                        if (currentEvent[j].hasOwnProperty('callsLimit')) {
                            if (currentEvent[j]['numOfCalls'] < currentEvent[j]['callsLimit']) {
                                currentEvent[j]['numOfCalls']++;
                            } else {
                                continue;
                            }
                        }
                        currentEvent[j]['function']();
                    }
                }
            }
        },

        several: function (eventName, student, callback, n) {
            if (n < 0 || typeof n !== 'number') {
                console.error('Неверное количество повторов!');
                return;
            }
            var newEventHandler = initializeHandler(student, callback, n);
            addHandler(this.listOfEvents, eventName, newEventHandler);

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
