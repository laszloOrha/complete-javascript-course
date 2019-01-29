let budgetController = (function () {

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    let data = {
        items: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0
    };

    return {
        addItem: function (type, desc, value) {
            let itemToAdd, ID;
            let itemArray = data.items[type];

            if(itemArray.length > 0) {
                ID = itemArray[itemArray.length - 1].id + 1;
            }else{
                ID = 1;
            }

            if (type === 'inc') {
                itemToAdd = new Income(ID, desc, value)
            } else {
                itemToAdd = new Expense(ID, desc, value)
            }

            itemArray.push(itemToAdd);

            return itemToAdd;
        }
    }
})();

let UIController = (function () {

    let DOMStrings = {
      inputType:".add__type",
      description:".add__description",
      value: ".add__value",
      inputButton: ".add__btn"
    };

    return {
        getDOMstrings: function() {
            return DOMStrings;
        },

        getInput: function () {
            return {
                inputType: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.description).value,
                value: document.querySelector(DOMStrings.value).value
            }
        }
    }
})();

let appController = (function () {

    let DOM = UIController.getDOMstrings();

    function setupEventListeners() {
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);
    }

    function controlAddItem() {
        let input = UIController.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            console.log(budgetController.addItem(input.inputType, input.description, input.value));
        }
    }

    return {
            init: function () {
                setupEventListeners();
            }
        }

})(budgetController, UIController);

appController.init();