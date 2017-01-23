var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Stop Model
 * ==========
 */
var Stop = new keystone.List('Stop');


Stop.add({
	stopID: { type: Types.Text, required: true, index: true, initial: true, default: '' },
	location: { type: Types.Location, index: true },
	weight: { type: Types.Number, index: true },
	img: { type: Types.Text },
	bdata: {type: Types.Boolean, default: false },
	transportation: {type: Types.TextArray },
	url: {
		state: { type: Types.Url },
    country: { type: Types.Url },
    suburb: { type: Types.Url },
    name: { type: Types.Url }	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
Stop.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
Stop.defaultColumns = 'stopID, location, weight, isAdmin';
Stop.register();
