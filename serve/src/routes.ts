import { prisma } from './lib/prisma';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs';
export async function appRoutes(app: FastifyInstance) {

  app.post('/habits', async (req) => {
    const createHabitBody = z.object({
      title: z.string(),
      WeekDays: z.array(z.number().min(0).max(6))

    });
    const { title, WeekDays } = createHabitBody.parse(req.body);
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


}
