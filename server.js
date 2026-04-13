const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
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
        const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        res.json(productos[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST crear producto
app.post('/api/productos', async (req, res) => {
    console.log("BODY:", req.body); 

    const { nombre, precio, talla } = req.body;

    try {
        const query = `
            INSERT INTO productos (nombre, precio, talla)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(query, [nombre, precio, talla]);

        res.status(201).json({
            id: result.insertId,
            nombre,
            precio,
            talla
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});
// PUT actualizar producto
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, talla } = req.body;

    try {
        const query = `
            UPDATE productos
            SET nombre = ?, precio = ?, talla = ?
            WHERE id = ?
        `;

        await db.query(query, [nombre, precio, talla, id]);

        res.json({ id, nombre, precio, talla });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM productos WHERE id = ?", [id]);
        res.json({ message: `Producto con id ${id} eliminado` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});