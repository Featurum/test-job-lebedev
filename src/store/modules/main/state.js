const state = {
	list: [],

    types: {
        SIMPLE: 1,
        COMPOSITE: 2
    },

    colors: {
        RED: 'red',
        GREEN: 'green'
    },

    options: {
        types: [
            { id: 1, name: "Простой" },
            { id: 2, name: "Сложный" }
        ],

        colors: [
            { id: 'red', name: "Красный" },
            { id: 'green', name: "Зеленый" }
        ]
    }
};

export default state