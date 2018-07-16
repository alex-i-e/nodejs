'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                username: "Arsen",
                email: "arsen@global.com",
                password: "12345678",
                passwordHash: "$2b$10$W4gqRNdUqecSd3cboh/OEeofCb2dHpxEdfJOMEe7CtSCaGNnibiDK",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: "Fedor",
                email: "fedor@global.com",
                password: "12345678",
                passwordHash: "$2b$10$W4gqRNdUqecSd3cboh/OEeofCb2dHpxEdfJOMEe7CtSCaGNnibiDK",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: "Yakov",
                email: "yakov@global.com",
                password: "12345678",
                passwordHash: "$2b$10$W4gqRNdUqecSd3cboh/OEeofCb2dHpxEdfJOMEe7CtSCaGNnibiDK",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: "Petr",
                email: "petr@global.com",
                password: "12345678",
                passwordHash: "$2b$10$W4gqRNdUqecSd3cboh/OEeofCb2dHpxEdfJOMEe7CtSCaGNnibiDK",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: "Mitya",
                email: "mitya@global.com",
                password: "12345678",
                passwordHash: "$2b$10$W4gqRNdUqecSd3cboh/OEeofCb2dHpxEdfJOMEe7CtSCaGNnibiDK",
                createdAt: new Date(),
                updatedAt: new Date()
            }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
