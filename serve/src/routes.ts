import { prisma } from './lib/prisma';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs';
export async function appRoutes(app: FastifyInstance) {

  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      WeekDays: z.array(z.number().min(0).max(6))

    });
    const { title, WeekDays } = createHabitBody.parse(request.body);
    const today = dayjs().startOf('day').toDate();
    await prisma.habit.create({
      data: {
        title,
        created_at:today,
        WeekDays: {
          create: WeekDays.map(weekDay => {
            return {
              weekDay: weekDay,
            };
          })
        }
      }
    });
  });

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);
    const parsedDate = dayjs(date).startOf('day');
    const weekDay = parsedDate.get('day');
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        WeekDays: {
          some: {
            weekDay:weekDay
          }
        }
      }
    });
    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        DayHabits:true
      }
    });
    const completedHabits = day?.DayHabits.map(dayHabit => {
      return dayHabit.id;
    });
    return {
      possibleHabits,
      completedHabits
    };
  });

  // Route for  complete or not complete  a habit
  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(request.params);
    const today = dayjs().startOf('day').toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    });


    if (!day) {
      day = await prisma.day.create({
        data: {
          date :today
        }
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_Id_habit_Id: {
          day_Id: day.id,
          habit_Id: id
        }
      }
    });
    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      });
    } else {
      await prisma.dayHabit.create({
        data: {
          day_Id: day.id,
          habit_Id: id
        }
      });

    }
  });

  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
      SELECT
        D.id,
        D.date,
        (
          SELECT
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.weekDay = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
      `;

    return summary;
  });
}
