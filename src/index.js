
import '@babel/polyfill'

import Hapi from '@hapi/hapi'
import Good from '@hapi/good'
import socketio from 'socket.io'

import { get as _get } from 'lodash/fp'
import TWEEN from '@tweenjs/tween.js'

import { createDistroCreator } from './distro'

const getDistro = ({
	easeFuncName,
	size,
	start,
	end
}) => {
	const [ createDistro ] = createDistroCreator(parseInt(size))
	const ease = _get(easeFuncName)(TWEEN.Easing)
	const [ createStartEnd ] = createDistro(ease)
	return createStartEnd(parseInt(start), parseInt(end))
}

const startServer = async port => {
	const server = Hapi.server({ port })
	const io = socketio(server.listener)

	await server.register({
		plugin: Good,
		options: {
			reporters: {
				console: [
					{
						module: '@hapi/good-squeeze',
						name: 'Squeeze',
						args: [{ log: '*', response: '*' }]
					},
					{
						module: '@hapi/good-console'
					},
					'stdout'
				]
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/api/distro/start-end/{easeFuncName}/{size}/{start}/{end}',
		handler: ({ params }) => getDistro(params)
	})
	io.on('connection', socket => socket.on('get-distro', async params => {
		socket.emit(`distro-${ params.id }`, await getDistro(params))
	}))

	await server.start()

	console.log(`server up at ${ server.info.uri }`)
}

startServer(8080)
