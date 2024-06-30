import * as SQLite from 'expo-sqlite'

const dbName = 'list'
const productTable = 'CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, barcode INTEGER NOT NULL UNIQUE, name TEXT NOT NULL)'

export default new class Sql {
    // Lista os produtos
    async index(searchValue?: string): Promise<unknown[]> {
        const db = await SQLite.openDatabaseAsync(dbName)
        await db.runAsync(productTable)

        // Se tiver filtro, lista utilizando ele
        if (searchValue) {
            const result = await db.getAllAsync('SELECT * FROM product WHERE barcode LIKE $barcode OR name LIKE $name ORDER BY id DESC', {$barcode: `%${searchValue}%`, $name: `%${searchValue}%`})
            return result
        } 
        // Se não tiver filtro, lista todos os resultados
        else {
            const result = await db.getAllAsync('SELECT * FROM product ORDER BY id DESC')
            return result
        }
    }

    // Cadastra um produto
    async store(barcode: number, name: string): Promise<SQLite.SQLiteRunResult> {
        const db = await SQLite.openDatabaseAsync(dbName)
        await db.runAsync(productTable)

        const result = await db.runAsync('INSERT INTO product (barcode, name) VALUES (?, ?)', [barcode, name])
        return result
    }

    // Exclui um produto
    async del(barcode: number): Promise<SQLite.SQLiteRunResult> {
        const db = await SQLite.openDatabaseAsync(dbName)
        await db.runAsync(productTable)

        const result = await db.runAsync('DELETE FROM product WHERE barcode = $barcode', { $barcode: barcode })
        return result
    }
}
