'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	courses = require('../../app/controllers/courses');

module.exports = function(app) {
	// Article Routes
	app.route('/courses')
		.post(users.requiresLogin, courses.create)
		.get(courses.list);

	app.route('/courses/:courseId')
		.get(users.requiresLogin, courses.hasAuthorization, courses.read)
		.put(users.requiresLogin, courses.hasAuthorization, courses.update)
		.delete(users.requiresLogin, courses.hasAuthorization, courses.remove);

	// Finish by binding the article middleware
	app.param('courseId', courses.courseByID);
};