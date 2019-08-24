
import React from 'react'

import { loggingLevels } from '@fazor/fazor'

import { Socket } from '@fazor/socket.io-client'

import { getFaze } from '../../state'

export default () => {
	const [ state, actions, [ , logDebug ] ] = getFaze()

	const {
		counter,
		socket: { connected, id: socketId, listeners },
		__fazor: { loggingLevelName }
	} = state
	const {
		inc,
		ignored,
		getDistro,
		__fazorSetLoggingLevel,
		socketRemoveListener,
		socketRemoveAllListeners,
		socketEmit,
		socketShouldConnect
	} = actions

	const increment = async () => {
		logDebug('inc dispatch')
		const result = await inc(1)
		logDebug('inc dispatch result', result)
	}

	const nextLoggingLevel = () => {
		const loggingLevelNames = Object.keys(loggingLevels)
		const nextLoggingLevelNameIndex = loggingLevelNames.indexOf(loggingLevelName) + 1
		const nextLoggingLevelName = nextLoggingLevelNameIndex === loggingLevelNames.length
			? loggingLevelNames[0]
			: loggingLevelNames[nextLoggingLevelNameIndex]
		__fazorSetLoggingLevel(loggingLevels[nextLoggingLevelName])
	}

	return (
		<div>
			<h3> --- count: {counter}</h3>
			<button onClick={increment}>increment</button>
			<button onClick={ignored}>ignore me</button>
			<h5> --- logging level: {loggingLevelName}</h5>
			<button onClick={nextLoggingLevel}>next logging level</button>
			<h5> --- socket</h5>
			<Socket getFaze={getFaze} />
				<button onClick={() =>
					socketShouldConnect(!connected)}
				>{connected ? 'disconnect' : 'connect'}</button>
			<button onClick={() => socketRemoveListener('fazor_socket.io-client_ping')}>remove ping</button>
			<button onClick={() => socketRemoveAllListeners(listeners)}>remove all</button>
			{
				socketId
					? <button onClick={() =>
						getDistro(socketEmit, socketId, 'Linear.None', 10, 1, 10)}
					>get distro</button>
					: void 0
			}
		</div>
	)
}
