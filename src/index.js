#!/usr/bin/env node

import '@babel/polyfill'

import cli from 'cli'

const args = cli.parse({
	serve: [ 's', 'start distribution service', 'true', false ]
})

console.log(process.argv)
console.log(__dirname)
console.log(require('path').resolve('./'))
// console.log(args)

import Hapi from '@hapi/hapi'
import Good from '@hapi/good'
import socketio from 'socket.io'

import { get as _get } from 'lodash/fp'
import TWEEN from '@tweenjs/tween.js'

import { createServerCreator } from './server'

import { createTweenDistroCreator } from './distro'

export const start = async () => {
	const createDistro = createTweenDistroCreator({
		TWEEN,
		_get
	})

	const createServer = createServerCreator({
		Hapi,
		Good,
		socketio,
		_get,
		createDistro
	})

	const server = await createServer({ port: 8080 })

	await server.start()

	console.log(`server up on ${server.info.uri}`)
}
