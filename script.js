// Budget Controller
var budgetController = (function(){

    
    
})();


// UI Controller
var UIController = (function() {
    
    var DOMclasses = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: document.querySelector(DOMclasses.inputValue).value
            };
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

    var ctrlAddItem = function() {
        // 1. Get the input filed
        var input = UICtrl.getInput();
        console.log(input);
        
        // 2. Add item to the budget controller
        
        // 3. Add item to UI controller
        
        // 4. Calculate the budget
        
        // 5. Display the budget on UI controller
    };
    
    return {
        init: function() {
            setupEventListeners();
            console.log('Application has started.');
        }
    }
    
})(budgetController, UIController);

controller.init();