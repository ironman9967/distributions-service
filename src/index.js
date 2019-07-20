#!/usr/bin/env node

import '@babel/polyfill'

import cli from 'cli'

import Hapi from '@hapi/hapi'
import Good from '@hapi/good'
import socketio from 'socket.io'

import { get as _get } from 'lodash/fp'
import TWEEN from '@tweenjs/tween.js'

import { createServerCreator } from './server'

import { createTweenDistroCreator } from './distro'

import { name as appName, version } from './package.json'

const createDistro = createTweenDistroCreator({
	TWEEN,
	_get
})

export const serve = async ({ port }) => {
	const createServer = createServerCreator({
		Hapi,
		Good,
		socketio,
		_get,
		createDistro
	})

	const server = await createServer({ port })

	await server.start()

	cli.ok('server up on ${server.info.uri}')
}

cli.enable('version')
cli.setApp(appName, version)
cli.parse({
	port: [ 'p', "Port for the 'serve' command", 'int', 8080 ],
	shape: [ 's', "Shape function for the 'distro' command", 'string', 'Linear.None' ],
	length: [ 'l', "Length of the distribution for the 'distro' command", 'int', 10 ],
	start: [ 't', "Starting number for the 'distro' command", 'int', 1 ],
	end: [ 'e', "Ending number for the 'distro' command", 'int', 100 ]
}, [ 'serve', 'distro' ])

cli.main(async (args, {
	port,
	shape,
	length,
	start,
	end
}) => {
	switch (cli.command) {
		case 'serve':
			serve({ port })
			break
		case 'distro':
			console.log(JSON.stringify(await createDistro({
				shape,
				length,
				start,
				end
			}), null, 2))
			break
	}
})
