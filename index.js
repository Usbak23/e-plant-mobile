import { AppRegistry } from 'react-native'
import App from './Main'
import { name as appName } from './app.json'
import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from '@models/schema/schema'
import migrations from '@models/migration/migrations'
import TPH from '@models/schema/tphs'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: Platform.OS === 'ios', /*  */
    // (optional, but you should implement this method)
    onSetUpError: error => {
        console.log('Failed to setup database on index.js:', error)
        // Database failed to load -- offer the user to reload the app or log out
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [
        TPH,
        // Post, // ⬅️ You'll add Models to Watermelon here
    ],
})



console.reportErrorsAsExceptions = false;
AppRegistry.registerComponent(appName, () => App)
