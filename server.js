const express = require('express');
const db = require('./db');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ruta principal (sirve tu index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ----- RUTAS PRODUCTOS -----

// GET todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [productos] = await db.query(
            'SELECT * FROM productos WHERE id = ?', 
            [id]
        );
        res.json(productos[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST crear producto 
app.post('/api/productos', async (req, res) => {
    console.log("BODY:", req.body);

    const { nombre, precio, talla, imagen } = req.body;

    try {
        const query = `
            INSERT INTO productos (nombre, precio, talla, imagen)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            nombre,
            precio,
            talla,
            imagen || ""
        ]);

        res.status(201).json({
            id: result.insertId,
            nombre,
            precio,
            talla,
            imagen
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            "DELETE FROM productos WHERE id = ?", 
            [id]
        );
        res.json({ message: `Producto con id ${id} eliminado` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});