import { appSchema, tableSchema } from '@nozbe/watermelondb'
import TPH from '@models/schema/tphs'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'tphs',
            // unsafeSql: sql => sql.replace(/create table [^)]+\)/, '$& without rowid'),
            columns: [
                { name: 'name', type: 'string' },
                { name: 'block', type: 'string' },
            ]
        }),
    ]
})
