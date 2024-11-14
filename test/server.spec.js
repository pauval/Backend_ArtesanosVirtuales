const request = require("supertest");
const app = require('../src/app');
require('dotenv').config();

let server;

// Iniciar el servidor una vez antes de todas las pruebas
beforeAll(() => {
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT);
});
afterAll((done) => {
    server.close(done);
});

describe("pruebas relacionadas a articulos", () => {
    it("obtencion de productos en catalogo", async () => {
        const response = await request(app).get('/api/catalogo');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    })
});

describe("pruebas relacionadas a usuarios", () => {
    it("login se envia correctamente", async () => {
        const response = await request(app).post('/api/auth/login')
        .send({
            email: 'juan.perez@example.com',
            password: 'juan.perez@example.com'
        });
        expect(response.statusCode).toBe(200);
        expect()
    })

});

describe("pruebas relacionadas a usuarios", () => {
    it("register con contraseña igual", async () => {
        const response = await request(app).post('/api/auth/register')
        .send({
            email: 'juan.perez2@example.com',
            direccion: 'calle 123',
            name: 'matias',
            region: 'Metropolitana',
            telefono: '1234',
            comuna: 'La Florida',
            password1: '12345678',
            password2: '123456711'
        });
        expect(response.statusCode).toBe(400)
        expect(response.text).toBe("Las contraseñas no coinciden");
    })
    it("que falte un campo por ejemplo name", async () => {
        const response = await request(app).post('/api/auth/register')
        .send({
            email: 'juan.perez2@example.com',
            direccion: 'calle 123',
            region: 'Metropolitana',
            telefono: '1234',
            comuna: 'La Florida',
            password1: '12345678',
            password2: '12345678'
        });
        expect(response.statusCode).toBe(404)
        expect(response.text).toBe("Faltan campos obligatorios");
    })
    it("ingresar un email que ya existe", async () => {
        const response = await request(app).post('/api/auth/register')
        .send({
            email: 'juan.perez@example.com',
            name: 'joaquin',
            direccion: 'calle 123',
            region: 'Metropolitana',
            telefono: '1234',
            comuna: 'La Florida',
            password1: '12345678',
            password2: '12345678'
        });
        expect(response.statusCode).toBe(409)
        expect(response.text).toBe("el email ya existe");
    })
});

describe("pruebas relacionadas a historial ventas y compras", () => {
    it("token expirado no deberia funcionar, no muestra venta", async () => {
        const response = await request(app)
            .get('/api/ventas/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkXVCJ9.eyJlbW2FpbCI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzEyMTE0NzgsImV4cCI6MTczMTIxNTA3OH0.PlWBpkhpZaX-q5XCXSsiuZt4gE-tZEbuIFZXRxk2IcY');

        expect(response.statusCode).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });
    it("token expirado no deberia funcionar, no muestra compra", async () => {
        const response = await request(app)
            .get('/api/compras/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkXVCJ9.eyJlbdWFpbCI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzEyMTE0NzgsImV4cCI6MTczMTIxNTA3OH0.PlWBpkhpZaX-q5XCXSsiuZt4gE-tZEbuIFZXRxk2IcY');

        expect(response.statusCode).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });
});


