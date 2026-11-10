import { Model } from '@nozbe/watermelondb'
import { field, json } from '@nozbe/watermelondb/decorators'

export default class TPH extends Model {
    static table = 'tphs'
    @field('name') name;
    @json('block') block;
    @field('print_version') printVersion;
}
