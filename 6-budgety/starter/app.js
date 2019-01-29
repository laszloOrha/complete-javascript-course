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

    Expense.prototype.percentageCalc = function () {
        let totalInc = data.totals.inc;

        if(totalInc > 0){
            this.percentage = Math.round(this.value / totalInc * 100);
        }else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        budget: 0,
        percentage: -1
    };
    
    function calculateTotal(type) {
        let itemArray = data.items[type];
        let sum = 0;

        for(let item of itemArray) {
            sum += item.value;
        }
        data.totals[type] = sum;
    }

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
        },
        
        calculateBudget: function () {
             calculateTotal('inc');
             calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;
        },

        getBudget: function () {
            return data;
        },

        deleteItem: function (type, IDNumber) {
            let indexToDelete;
            let itemArray = data.items[type];

            for(let item of itemArray) {
                if(item.id === IDNumber) {
                    indexToDelete = itemArray.indexOf(item);
                }
            }
            itemArray.splice(indexToDelete, 1);
        },


        calculatePercentages: function () {
            let itemPercArr = [];
            let expArray = data.items.exp;
            let totalExp = data.totals.exp;
            let totalInc = data.totals.inc;
            let totalPerc = data.percentage;

            if(totalInc > 0) {
                totalPerc = Math.round(totalExp / totalInc * 100);
            }else{
                totalPerc = -1;
            }

            for(let expense of expArray) {
                expense.percentageCalc();
                itemPercArr.push(expense.getPercentage());
            }

            return {
                totalPerc,
                itemPercArr
            }
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
        expensesContainer: ".expenses__list",
        descriptionField: ".add__description",
        valueField: ".add__value",
        budgetLabel: ".budget__value",
        totalIncLabel: ".budget__income--value",
        totalExpLabel: ".budget__expenses--value",
        allPercLabel: ".budget__expenses--percentage",
        itemPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };

    return {
        getDOMStrings: function() {
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
                '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline" id="inc-%buttonid%"></i></button>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>';

            let expensesHTML ='<div class="item clearfix" id="expense-%id%">\n' +
                '                            <div class="item__description">%description%</div>\n' +
                '                            <div class="right clearfix">\n' +
                '                                <div class="item__value">%value%</div>\n' +
                '                                <div class="item__percentage">%percentage%</div>\n' +
                '                                <div class="item__delete">\n' +
                '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline" id="exp-%buttonid%"></i></button>\n' +
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
            HTMLToInsert = HTMLToInsert.replace('%buttonid%', newItem.id);
            HTMLToInsert = HTMLToInsert.replace('%description%', newItem.description);
            HTMLToInsert = HTMLToInsert.replace('%value%', newItem.value);

            container.insertAdjacentHTML('beforeend', HTMLToInsert);
        },

        clearFields: function() {
            let descField = document.querySelector(DOMStrings.descriptionField);
            let valueField = document.querySelector(DOMStrings.valueField);

            descField.value = '';
            valueField.value = '';
            descField.focus();
        },

        displayBudget: function(budgetInfo) {
            let budget = budgetInfo.budget;
            let totalInc = budgetInfo.totals.inc;
            let totalExp = budgetInfo.totals.exp;

            document.querySelector(DOMStrings.budgetLabel).innerText = budget;
            document.querySelector(DOMStrings.totalIncLabel).innerText = totalInc;
            document.querySelector(DOMStrings.totalExpLabel).innerText = totalExp;

        },

        deleteListItem: function (type, IDNumber) {
            let IDPrefix;

            if(type === 'inc'){
                IDPrefix = 'income-';
            }else{
                IDPrefix= 'expense-';
            }

            let ID = IDPrefix + IDNumber;

            document.getElementById(ID).remove();
        },

        displayPercentages: function (percentageData) {
            let totalPerc = percentageData.totalPerc;
            let itemPercArr = percentageData.itemPercArr;

            document.querySelector(DOMStrings.allPercLabel).innerText = totalPerc + '%';
            let itemPercFields = document.querySelectorAll(DOMStrings.itemPercLabel);

            for (let i = 0; i < itemPercFields.length; i++) {
                itemPercFields[i].innerText = itemPercArr[i] + '%';
            }
        },

        displayMonth: function () {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            let now = new Date;
            let year = now.getFullYear();
            let month = monthNames[now.getMonth()];

            document.querySelector(DOMStrings.dateLabel).innerText = year + ' ' + month;
        }
    }
})();

let appController = (function() {

    let DOM = UIController.getDOMStrings();

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
            newItem = budgetController.addItem(input.inputType, input.description, parseFloat(input.value));

            UIController.displayItem(newItem, input.inputType);

            addDeleteListener(newItem.id, input.inputType);

            UIController.clearFields();

            updateBudget();

            updatePercentages();
        }
    }

    function controlDeleteItem() {
        let IDArray = this.id.split('-');
        let type = IDArray[0];
        let IDNumber = IDArray[1];

        budgetController.deleteItem(type, IDNumber);
        UIController.deleteListItem(type, IDNumber);
        updateBudget();

        updatePercentages();
    }

    function addDeleteListener(ID, inputType) {
        let target = document.getElementById(inputType + '-' + ID);
        target.addEventListener('click', controlDeleteItem)
    }

    function updateBudget() {
        let budgetInfo;
        
        budgetController.calculateBudget();
        budgetInfo = budgetController.getBudget();
        UIController.displayBudget(budgetInfo);
    }

    function updatePercentages() {
        let percentageData;

        percentageData = budgetController.calculatePercentages();
        UIController.displayPercentages(percentageData);

    }

    return {
            init: function () {
                setupEventListeners();
                updateBudget();
                updatePercentages();
                UIController.displayMonth();
            }
        }

})(budgetController, UIController);

appController.init();