import { EntitySchema } from "typeorm";


export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        full_name: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        email: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true
        },
        phone: {
            type: "varchar",
            nullable: false,
            length: 13
        },
        password: {
            type: "varchar",
            nullable: false,
        },
        role: {
            type: "enum",
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: "boolean",
            default: false
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        }
    }
})


