-- Active: 1730505290133@@127.0.0.1@5432@artesanosvirtuales

CREATE TABLE Regiones (
    id_region SERIAL PRIMARY KEY,
    nombre_region VARCHAR(100) NOT NULL
);

CREATE TABLE Ciudades (
    id_ciudad SERIAL PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL,
    id_region INTEGER REFERENCES Regiones(id_region)
);

CREATE TABLE Tipo_Usuario (
    id_tipo_usuario SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL
);

CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    direccion VARCHAR(100),
    telefono INTEGER,
    contraseña VARCHAR(255) NOT NULL,
    id_tipo_usuario INTEGER REFERENCES Tipo_Usuario(id_tipo_usuario),
    id_ciudad INTEGER REFERENCES Ciudades(id_ciudad)
);

CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    id_usuario INTEGER REFERENCES Usuarios(id_usuario),
    id_categoria INTEGER REFERENCES Categoria(id_categoria)
);

CREATE TABLE Imagenes (
    id_imagen SERIAL PRIMARY KEY,
    url_imagen VARCHAR(255) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    id_producto INTEGER REFERENCES Productos(id_producto)
);

CREATE TABLE Stock (
    id_stock SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    id_producto INTEGER UNIQUE REFERENCES Productos(id_producto)
);

CREATE TABLE Ventas_Invitados (
    id_invitado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    direccion VARCHAR(100),
    telefono INTEGER
);

CREATE TABLE Ventas (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INTEGER REFERENCES Usuarios(id_usuario),
    id_invitado INTEGER REFERENCES Ventas_Invitados(id_invitado),
    fecha_venta DATE DEFAULT CURRENT_DATE,
    hora_venta TIME DEFAULT CURRENT_TIME,
    total DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Detalle_Venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta INTEGER REFERENCES Ventas(id_venta),
    id_producto INTEGER REFERENCES Productos(id_producto),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);

INSERT INTO Regiones (nombre_region) VALUES
    ('Metropolitana'), ('Valparaíso');

INSERT INTO Ciudades (nombre_ciudad, id_region) VALUES
    ('Cerrillos', 1), ('Cerro Navia', 1), ('Conchalí', 1), ('El Bosque', 1), ('Estación Central', 1),
    ('Huechuraba', 1), ('Independencia', 1), ('La Cisterna', 1), ('La Florida', 1), ('La Granja', 1),
    ('La Pintana', 1), ('La Reina', 1), ('Las Condes', 1), ('Lo Barnechea', 1), ('Lo Espejo', 1),
    ('Lo Prado', 1), ('Macul', 1), ('Maipú', 1), ('Ñuñoa', 1), ('Pedro Aguirre Cerda', 1), ('Peñalolén', 1), 
    ('Providencia', 1), ('Pudahuel', 1), ('Quilicura', 1), ('Quinta Normal', 1), ('Recoleta', 1),
    ('Renca', 1), ('San Joaquín', 1), ('San Miguel', 1), ('San Ramón', 1), ('Santiago', 1), ('Vitacura', 1),
    ('Valparaíso', 2), ('Viña del Mar', 2), ('Concón', 2), ('Quintero', 2), ('Puchuncaví', 2),
    ('Casablanca', 2), ('Juan Fernández', 2), ('Quilpué', 2), ('Villa Alemana', 2), ('Limache', 2), ('Olmué', 2);

INSERT INTO Tipo_Usuario (nombre_tipo) VALUES
    ('Artesano'), ('Cliente');

INSERT INTO Categoria (nombre_categoria) VALUES
    ('Cerámica'), ('Madera'), ('Textiles'), ('Cuero'), ('Cestería'), ('Escultura'), ('Decoración');


INSERT INTO Usuarios (nombre, email, direccion, telefono, contraseña, id_tipo_usuario, id_ciudad) VALUES
    ('Juan Pérez', 'juan.perez@example.com', 'Av. Principal 123', 123456789, '$2a$10$Ogz9MyMrZNrvY842VyAovuDzELzAfNSilfUEz9PAhiVjt3NqzYPYe', 1, 1),
    ('Ana López', 'ana.lopez@example.com', 'Calle Secundaria 456', 987654321, '$2a$10$qqtoLeyG7OmodDq1w2jpBuLBIhY02Icq4IPLn/18p7K5XfwmK3TT2', 2, 2),
    ('Karo Rojas', 'karo.rojas@example.com', 'Calle 4 #2930', 223233323, '$2a$10$qqtoLeyG7OmodDq1w2jpBuLBIhY02Icq4IPLn/18p7K5XfwmK3TT2', 1, 2);

INSERT INTO Ventas_Invitados (nombre, email, direccion, telefono) VALUES
    ('Miguel Hernández', 'miguel.h@example.com', 'Camino de los Andes 500', 123987456),
    ('Patricia Gómez', 'patricia.g@example.com', 'Av. Costanera 300', 789123654);

INSERT INTO Productos (nombre_producto, descripcion, precio, id_usuario, id_categoria) VALUES
    ('Jarrón de Cerámica Artesanal', 'Un jarrón de cerámica hecho a mano con intrincados patrones y colores naturales que reflejan técnicas de alfarería tradicionales.', 35.00, 1, 1),
    ('Caja de Madera Tallada', 'Una caja de joyería de madera tallada con detalles florales, fabricada con técnicas artesanales.', 45.00, 1, 2),
    ('Textil Tejido a Mano', 'Un textil bellamente tejido a mano con patrones geométricos vibrantes que reflejan la artesanía indígena.', 60.00, 1, 3),
    ('Monedero de Cuero Artesanal', 'Un monedero de cuero hecho a mano con costuras detalladas y un diseño minimalista.', 25.00, 1, 4),
    ('Canasta Tejida', 'Una canasta tejida a mano con un acabado natural, ideal para decoración o almacenamiento.', 30.00, 1, 5),
    ('Plato de Cerámica Pintado a Mano', 'Un plato de cerámica pintado a mano con patrones florales vibrantes.', 20.00, 3, 1),
    ('Escultura Tallada de Madera', 'Una escultura de madera bellamente tallada de un pájaro, con detalles intrincados en las plumas.', 70.00, 1, 6),
    ('Atrapasueños Artesanal', 'Un atrapasueños tejido a mano con plumas naturales y cuentas de madera.', 15.00, 1, 7),
    ('Bufanda Tejida de Lana', 'Una bufanda de lana tejida a mano con patrones sutiles y colores cálidos.', 40.00, 3, 3),
    ('Tetera de Arcilla Artesanal', 'Una tetera de arcilla hecha a mano con un esmalte natural y un diseño orgánico.', 55.00, 3, 1);

INSERT INTO Imagenes (url_imagen, es_principal, id_producto) VALUES
    ('src/img/jarron_ceramica.png', TRUE, 1),
    ('src/img/caja_madera.png', TRUE, 2),
    ('src/img/textil_tejido.png', TRUE, 3),
    ('src/img/monedero_cuero.png', TRUE, 4),
    ('src/img/canasta_tejida.png', TRUE, 5),
    ('src/img/plato_pintado.png', TRUE, 6),
    ('src/img/escultura_pajaro.png', TRUE, 7),
    ('src/img/atrapasuenos.png', TRUE, 8),
    ('src/img/bufanda_tejida.png', TRUE, 9),
    ('src/img/tetera_arcilla.png', TRUE, 10),
    ('src/img/canasta_tejida1.png', FALSE, 5),
    ('src/img/canasta_tejida2.png', FALSE, 5),
    ('src/img/atrapasuenos1.png', FALSE, 8),
    ('src/img/atrapasuenos2.png', FALSE, 8),
    ('src/img/atrapasuenos3.png', FALSE, 8),
    ('src/img/atrapasuenos4.png', FALSE, 8);

INSERT INTO Stock (cantidad, id_producto) VALUES
    (5, 1),
    (3, 2),
    (7, 3),
    (2, 4),
    (6, 5),
    (4, 6),
    (1, 7),
    (8, 8),
    (5, 9),
    (2, 10);

INSERT INTO Ventas (id_cliente, id_invitado, fecha_venta, hora_venta, total) VALUES
    (2, NULL, '2023-10-01', '10:30:00', 95.00),
    (2, NULL, '2023-10-02', '11:45:00', 45.00),
    (2, NULL, '2023-10-03', '15:15:00', 30.00),
    (1, NULL, '2023-10-04', '13:20:00', 20.00),
    (2, NULL, '2023-10-05', '17:05:00', 25.00);

INSERT INTO Detalle_Venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
    (1, 1, 2, 35.00),
    (1, 3, 1, 60.00),
    (2, 2, 3, 45.00),
    (3, 5, 1, 30.00),
    (4, 6, 2, 20.00),
    (5, 4, 1, 25.00);


