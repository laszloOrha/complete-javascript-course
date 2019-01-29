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
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
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
        },

        displayItem: function (newItem, type) {
            let HTMLToInsert, container;
            let incomeHTML = '<div class="item clearfix" id="income-%id%">\n' +
                '                            <div class="item__description">%description%</div>\n' +
                '                            <div class="right clearfix">\n' +
                '                                <div class="item__value">%value%</div>\n' +
                '                                <div class="item__delete">\n' +
                '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>';

            let expensesHTML ='<div class="item clearfix" id="expense-%id%">\n' +
                '                            <div class="item__description">%description%</div>\n' +
                '                            <div class="right clearfix">\n' +
                '                                <div class="item__value">%value%</div>\n' +
                '                                <div class="item__percentage">%percentage%</div>\n' +
                '                                <div class="item__delete">\n' +
                '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>';

            if(type === 'inc') {
                HTMLToInsert = incomeHTML;
                container = document.querySelector(DOMStrings.incomeContainer);
            }else {
                HTMLToInsert = expensesHTML;
                container = document.querySelector(DOMStrings.expensesContainer);
            }
            HTMLToInsert = HTMLToInsert.replace('%id%', newItem.id);
            HTMLToInsert = HTMLToInsert.replace('%description%', newItem.description);
            HTMLToInsert = HTMLToInsert.replace('%value%', newItem.value);

            container.insertAdjacentHTML('beforeend', HTMLToInsert);
        }
    }
})();

let appController = (function () {

    let DOM = UIController.getDOMstrings();

    function setupEventListeners() {
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);
        document.addEventListener('keypress', function (event) {
            if(event.keyCode === 13 || event.which === 13) {
                controlAddItem();
            }
        })
    }

    function controlAddItem() {
        let input, newItem;
        input = UIController.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            newItem = budgetController.addItem(input.inputType, input.description, input.value);

            UIController.displayItem(newItem, input.inputType)
        }


    }

    return {
            init: function () {
                setupEventListeners();
            }
        }

})(budgetController, UIController);

appController.init();