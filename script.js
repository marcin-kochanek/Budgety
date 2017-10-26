// Budget Controller
var budgetController = (function() {

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: 0
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            
            // Push the new item into our data structure
            // this data.allItems.type.push(newItem) do not work cause variable type equals to 'inc' or 'exp', not to inc or exp.
            data.allItems[type].push(newItem);
            
            // Return the new item
            return newItem; 
        },
        
        deleteItem: function(type, id){
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            data.allItems[type].splice(index, 1);
        },
        
        calculateBudget: function() {
            
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            // Calculate the budget: total income - total expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of the expenses
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = 0;
            }
        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    };
})();


// UI Controller
var UIController = (function() {
    
    var DOMclasses = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--date'
    };
    
    var formatNumber = function(num, type) {
        var num, splitNum, int, dec, type, sign;

        num = (Math.abs(num)).toFixed(2);

        splitNum = num.split('.');
        int = splitNum[0];
        dec = splitNum[1];

        if (int.length > 3) {        
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        } else if (int.length > 6) {
            int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        
        sign = '';
        
        if (num != 0) {
            (type == 'exp' ? sign = '-' : sign = '+')
        }
        
        return sign + ' ' + int + '.' + dec;
    };
    
    var nodeListForEach = function(list, callback) {
        for (i = 0; i < list.length ; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: parseFloat(document.querySelector(DOMclasses.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create HTML element with placeholder text
            if (type === 'inc') {
                element = DOMclasses.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" id="incDeletingIcon"></i></button></div></div></div>';
            } else {
                element = DOMclasses.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" id="expDeletingIcon"></i></button></div></div></div>'
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforebegin', newHtml)
        },
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el);
        },
        
        clearInputs: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMclasses.inputDesc + ', ' + DOMclasses.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj, type) {
            document.querySelector(DOMclasses.budgetLabel).textContent = formatNumber(obj.budget, (obj.budget > 0 ? 'inc' : 'exp'));
            document.querySelector(DOMclasses.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMclasses.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMclasses.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMclasses.percentageLabel).textContent = '-';
            }
        },
        
        displayPercentages: function(percentages) {
            var fields, i;
                        
            fields = document.querySelectorAll(DOMclasses.itemPercentageLabel);
            
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '-';
                }
            });
        },
        
        displayDate: function() {
            var now, month, year, monthNames;
            
            monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            now = new Date();
            month = monthNames[now.getMonth()];
            year = now.getFullYear();
            
            document.querySelector(DOMclasses.dateLabel).textContent = month + ' ' + year;
        },
        
        changedType: function() {
            var inputFields = document.querySelectorAll(DOMclasses.inputType + ',' + DOMclasses.inputDesc + ',' + DOMclasses.inputValue); // cannot use ForEach method as the inputFields is a nodeList, not an array
            
            nodeListForEach(inputFields, function(current) {
                current.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMclasses.inputBtn).classList.toggle('red');
        },
        
        getDOMclasses: function() {
            return DOMclasses;
        }
    };
})();


//  Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
       var DOM = UICtrl.getDOMclasses();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            // some older browsers use property 'which'
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem, false);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    var updateBudget = function() {
        var budget;
        
        budgetCtrl.calculateBudget(); // Calculate the budget
        budget = budgetCtrl.getBudget(); // Return the budget
        UICtrl.displayBudget(budget); // Display the budget on UI controller
    };
        
    var updatePercentages = function() {
        var percentages;
        
        budgetCtrl.calculatePercentages(); // Calculate percentages
        percentages = budgetCtrl.getPercentages(); // Read the percentages from the budget controller
        UICtrl.displayPercentages(percentages); // Update the UI
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        input = UICtrl.getInput(); // Get the input filed as an object
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); // Add item to the budget controller
            UICtrl.addListItem(newItem, input.type); // Add item to UI controller
            UICtrl.clearInputs(); // Clear the input fields
            updateBudget(); // Calculate and update the budget
            updatePercentages(); // Calculate and update the percentages 
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, el, re, splitID, type, ID, deletingIcon;
        
        re = /exp-\d+|inc-\d+/; // Matches id = inc-xx or exp-xx

        function findParent(el) {
            while (!re.test(el.id)) {
                el = el.parentNode;
                if (el === document){
                    break;
                }
            } 
            return el.id;
        };

        expDeletingIcon = document.getElementById('expDeletingIcon');
        incDeletingIcon = document.getElementById('incDeletingIcon');
        
        if (event.target == expDeletingIcon || incDeletingIcon) {
            itemID = findParent(event.target);
        
            if (itemID) {
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);

                budgetCtrl.deleteItem(type, ID); // Delete the item from the data structure
                UICtrl.deleteListItem(itemID); // Delete the item from the UI
                updateBudget(); // Update and show the new budget
                updatePercentages(); // Calculate and update the percentages
            }
        }
    };
    
    return {
        init: function() {
            setupEventListeners();
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '-'
            });
            console.log('Application has started.');
        }
    }
    
})(budgetController, UIController);

controller.init();