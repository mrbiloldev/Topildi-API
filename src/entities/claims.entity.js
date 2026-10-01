import { EntitySchema } from "typeorm";

export const Claim = new EntitySchema({
  name: "Claim",
  tableName: "claims",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true
    },

    item_id: {
      type: "int",
      nullable: false
    },

    claimant_id: {
      type: "int",
      nullable: false
    },

    message: {
      type: "text",
      nullable: true
    },

    status: {
      type: "enum",
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    created_at: {
      type: "timestamp",
      createDate: true
    }
  },

  relations: {
    item: {
      type: "many-to-one",
      target: "Item",
      joinColumn: {
        name: "item_id"
      }
    },

    claimant: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "claimant_id",
      }
    }
  }
})