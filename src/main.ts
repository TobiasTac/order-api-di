import fastify from 'fastify';

const app = fastify();

app.post('/checkout', () => {
  return {
    hello: 'Hello World!',
  }
});

app.listen({ port: 3000 })
  .then(() => {
    console.log('> Server started at http://localhost:3001');
  });
