var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Stop Model
 * ==========
 */
var Station = new keystone.List('Station');

Station.add({
	stopid: { type: Types.Text, required: true, index: true, initial: true, default: '' },
	origid: { type: Types.Text },
	name: { type: Types.Text, index: true },
	dbinformation: {type: Types.Text},
	mobilerservice: {type: Types.Text},
	reisezentrum: {type: Types.Text},
	dblounge: {type: Types.Text},
	sfach: {type: Types.Text},
	mobse: {type: Types.Text},
	stufr: {type: Types.Text},
	nam3s: {type: Types.Text},
	toile: {type: Types.Text},
	parkpl: {type: Types.Text},
	fahrsp: {type: Types.Text},
	oepnv: {type: Types.Text},
	taxi: {type: Types.Text},
	mietwagen: {type: Types.Text},
	rbed: {type: Types.Text},
	wlan: {type: Types.Text},
	bmission: {type: Types.Text}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
Station.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
Station.defaultColumns = 'stopid, name';
Station.register();
