// Budget Controller
var budgetController = (function(){

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
            // this data.allItems.type.push(newItem) do not work cause variable type equals 'inc' or 'exp', not inc or exp.
            data.allItems[type].push(newItem);
            
            // Return the new item
            return newItem; 
        },
        
        deleteItem: function(type, id){
            var ids;
            
            ids = data.budget[type].map(function(current){
                return current.id;
            });
            
            ids.indexOf()
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
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
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
        container: '.container'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMclasses.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml)
        },
        
        clearInputs: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMclasses.inputDesc + ', ' + DOMclasses.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current){
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMclasses.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMclasses.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMclasses.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMclasses.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMclasses.percentageLabel).textContent = '-';
            }
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
    };
    
    var updateBudget = function() {
        var budget;
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on UI controller
        UICtrl.displayBudget(budget);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the input filed as an object
        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI controller
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the input fields
            UICtrl.clearInputs();

            // 5. Calculate and update the budget
            updateBudget();
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, el, re, splitID, type, ID;
        
        re = /exp-\d+|inc-\d+/; // matches id = inc-xx or exp-xx

        function findParent(el) {
            while (!re.test(el.id)) {
                el = el.parentNode;
                if (el === document){
                    break;
                }
            } 
            return el.id;
        };
        
        itemID = findParent(event.target);
        console.log(itemID);
        
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
            
            // 1. Delete the item from the data structure
            // 2. Delete the item from the UI
            // 3. Update and show the new budget
        }
    };
    
    return {
        init: function() {
            setupEventListeners();
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