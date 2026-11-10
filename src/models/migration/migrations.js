import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: 'tphs',
                    columns: [
                        { name: 'print_version', type: 'number', isOptional: true },
                    ],
                }),
            ],
        },
    ],
})
