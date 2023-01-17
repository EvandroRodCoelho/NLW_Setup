import Fastify from 'fastify';
import  {PrismaClient}  from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient();

app.get('/', async () => {
  console.log('foi');
  const habits = await prisma.habits.findMany({});
  return habits;
});
app.listen({
  port: 3333,
});
