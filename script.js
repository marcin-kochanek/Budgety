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
    
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
        expensesContainer: '.expenses__list'
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMclasses.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
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
        })
    };
    
    var updateBudget = function() {
        // 1. Calculate the budget
        
        // 2. Return the budget
        
        
        // 3. Display the budget on UI controller
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
    
    return {
        init: function() {
            setupEventListeners();
            console.log('Application has started.');
        }
    }
    
})(budgetController, UIController);

controller.init();