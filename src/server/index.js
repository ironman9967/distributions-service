
export const createServerCreator = ({
	Hapi,
	Inert,
	Good,
	socketio,
	_get,
	createDistro,
	pathToPublic
}) => async ({ port }) => {
	const server = Hapi.server({
		port,
		routes: { files: { relativeTo: pathToPublic } }
	})
	const io = socketio(server.listener)

	await server.register(Inert)
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
		path: '/{param*}',
		handler: { directory: { path: '.', redirectToSlash: true, index: true } }
	})

	server.route({
		method: 'GET',
		path: '/api/distro/start-end/{shape}/{length}/{start}/{end}',
		handler: ({ params }) => createDistro(params)
	})
	io.on('connection', socket => {
		const { client: { id, conn: { remoteAddress } } } = socket
		console.log(`new client (${id}) connected from ${remoteAddress}`)
		socket.on('distro', async params => {
			console.log(`distro-${ params.id }`)
			socket.emit(`distro-${ params.id }`, await createDistro(params))
		})
	})

	return server
}
