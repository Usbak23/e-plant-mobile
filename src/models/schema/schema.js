import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 2,
    tables: [
        tableSchema({
            name: 'tphs',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'block', type: 'string' },
                { name: 'print_version', type: 'number', isOptional: true },
            ]
        }),
    ]
})
