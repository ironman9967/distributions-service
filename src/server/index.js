
export const createServerCreator = ({
	Hapi,
	Good,
	socketio,
	_get,
	createDistro
}) => async ({ port }) => {
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
		handler: ({ params }) => createDistro(params)
	})
	io.on('connection', socket => socket.on('get-distro', async params => {
		socket.emit(`distro-${ params.id }`, await createDistro(params))
	}))

	return server
}
