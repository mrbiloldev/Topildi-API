import { EntitySchema } from "typeorm";

export const Category=new EntitySchema({
    name: "Category",
    tableName: "categories",

    columns:{
        id: {
            type: "int",
            primary: true,
            generated: true
        },

        name: {
            type: "varchar",
            length: 50,
            unique: true,
            nullable: false
        },

        createdAt: {
            type: "timestamp",
            createDate: true,
        }
    }

})