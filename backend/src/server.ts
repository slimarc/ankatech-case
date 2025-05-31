import fastify from 'fastify';

const app = fastify();

app.get<{ Reply: { message: string } }>('/client', async () => {
    return { message: 'Route clients' };
});

app.listen({
    host: '0.0.0.0',
    port: 4000,
}).then(() => {
    console.log('Server is running http://localhost:4000');
});
