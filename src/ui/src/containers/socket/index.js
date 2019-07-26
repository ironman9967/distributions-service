
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
		'socketConnectionChange',
		connected => ({ connected }),
		(state, { connected }) => ({
			...state,
			socket: { ...state.socket, connected, connecting: false },
		})
	])
	createAction([
		'socketOpen',
		socket => {
			const dispatchConnectionChange = connected =>
				() => getActions().socketConnectionChange(connected)
			socket.removeAllListeners()
			socket.once('connect', dispatchConnectionChange(true))
			socket.once('disconnect', dispatchConnectionChange(false))
			socket.open()
		},
		state => ({ ...state, socket: { ...state.socket, connecting: true } })
	])
	createAction([
		'socketClose',
		socket => socket.close(),
		state => ({ ...state, socket: { ...state.socket, connecting: false } })
	])
	createAction([
		'socketShouldConnect',
		connect => ({ connect }),
		(state, { connect }) => ({ ...state, socket: { ...state.socket, connect } })
	])

	const { socket: { connected, connect, connecting } } = getState()

	const { socketOpen, socketClose } = getActions()

	useEffect(() => {
		if (connect) {
			if (!connected && !connecting) {
				socketOpen(socket)
			}
		}
		else if (connected) {
			socketClose(socket)
		}
	})

	return ( <div> --- Socket --- { children } </div> )
}
