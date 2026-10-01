import { EntitySchema } from "typeorm";

export const Item = new EntitySchema({
    name: "Item",
    tableName: 'items',

    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },

        user_id: {
            type: "int",
            nullable: false
        },
        category_id: {
            type: "int",
            nullable: false
        },
        type: {
            type: "enum",
            enum: ['lost', 'found'],
            nullable: false
        },
        title: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        description: {
            type: "text",
            nullable: false
        },
        location: {
            type: "varchar",
            length: 150,
            nullable: false
        },
        event_date: {
            type: "date",
            nullable: false
        },
        secret_question: {
            type: "varchar",
            length: 200,
            nullable: true
        },
        secret_answer: {
            type: "varchar",
            nullable: true
        },
        status: {
            type: 'enum',
            enum: ['active', 'returned', 'closed'],
            default: 'active'
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "user_id"
            }
        },

        category: {
            type: "many-to-one",
            target: "Category",
            joinColumn: {
                name: "category_id"
            },
            onDelete: "RESTRICT"
        },

        images: {
            type: "one-to-many",
            target: "ItemImage",
            inverseSide: "item"
        }
    }
})