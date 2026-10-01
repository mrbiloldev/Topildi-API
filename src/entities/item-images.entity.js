import { EntitySchema } from "typeorm";

export const ItemImage = new EntitySchema({
  name: "ItemImage",
  tableName: "item_images",

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

    filename: {
      type: "varchar",
      nullable: false
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
      },
      onDelete: "CASCADE"
    }
  }
});