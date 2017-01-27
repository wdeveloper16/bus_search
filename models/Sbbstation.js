var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Sbbstation Model
 * ==========
 */
var Sbbstation = new keystone.List('Sbbstation');


Sbbstation.add({
    sbId: { type: Types.Text, required: true, index: true, initial: true, default: '' },
    name: { type: Types.Location, index: true },
    simpleName: { type: Types.Number, index: true }

}, 'Permissions', {
    isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
Sbbstation.schema.virtual('canAccessKeystone').get(function () {
    return this.isAdmin;
});

/**
 * Registration
 */
Sbbstation.defaultColumns = 'sbId, name, simpleName';
Sbbstation.register();
