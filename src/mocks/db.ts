import { factory, primaryKey } from "@mswjs/data";

export const db = factory({
  task: {
    name: primaryKey(String),
    stage: Number,
  },
});

db.task.create({ name: "1", stage: 0 });
db.task.create({ name: "2", stage: 0 });
