/*
  Warnings:

  - You are about to drop the column `dayId` on the `day_habits` table. All the data in the column will be lost.
  - You are about to drop the column `habitId` on the `day_habits` table. All the data in the column will be lost.
  - Added the required column `day_Id` to the `day_habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habit_Id` to the `day_habits` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habit_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habit_id" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habit_week_days" ("habit_id", "id", "weekDay") SELECT "habit_id", "id", "weekDay" FROM "habit_week_days";
DROP TABLE "habit_week_days";
ALTER TABLE "new_habit_week_days" RENAME TO "habit_week_days";
CREATE UNIQUE INDEX "habit_week_days_habit_id_weekDay_key" ON "habit_week_days"("habit_id", "weekDay");
CREATE TABLE "new_day_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_Id" TEXT NOT NULL,
    "habit_Id" TEXT NOT NULL,
    CONSTRAINT "day_habits_day_Id_fkey" FOREIGN KEY ("day_Id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_habits_habit_Id_fkey" FOREIGN KEY ("habit_Id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_day_habits" ("id") SELECT "id" FROM "day_habits";
DROP TABLE "day_habits";
ALTER TABLE "new_day_habits" RENAME TO "day_habits";
CREATE UNIQUE INDEX "day_habits_day_Id_habit_Id_key" ON "day_habits"("day_Id", "habit_Id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
