
import React, { useEffect } from 'react'

import socketio from 'socket.io-client'

const socket = socketio(undefined, { autoConnect: false })

export const Socket = ({
	useAppContext,
	createAction,
	children
}) => {
	const [ getState, getActions ] = useAppContext()

	createAction([
		'socketConnect',
		socket => {

			console.log('socketConnect handler called')

			const dispatchConnectionChange = connected =>
				() => getActions().socketConnectionChange(connected)
			socket.removeAllListeners()
			socket.once('connect', dispatchConnectionChange(true))
			socket.once('disconnect', dispatchConnectionChange(false))
			socket.open()
		},
		state => ({
			...state,
			socket: { ...state.socket, connecting: true },
		})
	])
	createAction([
		'socketDisconnect',
		socket => socket.close(),
		state => ({
			...state,
			socket: { ...state.socket, connect: false },
		})
	])
	createAction([
		'socketConnectionChange',
		connected => ({ connected }),
		(state, { connected }) => ({
			...state,
			socket: { ...state.socket, connected, connecting: false },
		})
	])

	const { socket: { connected, connect, connecting } } = getState()

	const { socketConnect, socketDisconnect } = getActions()

	useEffect(() => {
		console.log('useEffect called', { connect, connected, connecting })

		if (connect) {
			if (!connected) {
				if (!connecting) {
					socketConnect(socket)
				}
			}
		}
		else {
			if (connected) {
				socketDisconnect(socket)
			}
		}
	}, [ socketConnect, socketDisconnect, connect, connected, connecting ])

	return ( <div> --- Socket --- { children } </div> )
}
