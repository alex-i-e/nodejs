'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [
            {
                name: "coat",
                brand: "A",
                price: "150",
                options: "blue",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "pants",
                brand: "B",
                price: "100",
                options: "black",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "gloves",
                brand: "C",
                price: "30",
                options: "black",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "shoes",
                brand: "D",
                price: "120",
                options: "blue",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    }
};
