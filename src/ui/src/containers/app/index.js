
import React, { useEffect } from 'react'

import { loggingLevels } from '@fazor/fazor'

import { Socket } from '@fazor/socket.io-client'

import { getFaze } from '../../state'

export default () => {
	const [ state, actions, [ , logDebug ] ] = getFaze()

	const {
		counter,
		socket: { connected, id: socketId },
		__fazor: { loggingLevelName }
	} = state
	const {
		inc,
		ignored,
		getDistro,
		__fazorSetLoggingLevel,
		socketOn,
		socketRemoveListener,
		socketRemoveAllListeners,
		socketEventFromServer,
		socketEmit
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

	useEffect(() => {
		if (socketId) {
			socketOn(connected, socketEventFromServer, [
				`distro-${socketId}`,
				distro => distro,
				({ distros, ...state }, { id, ...distro }) => ({
					...state,
					distros: distros.concat([{ id: `${id}-${Date.now()}`, ...distro }])
				})
			])
		}
	}, [ socketId, socketOn, connected, socketEventFromServer ])

	return (
		<div>
			<h3> --- count: {counter}</h3>
			<button onClick={increment}>increment</button>
			<button onClick={ignored}>ignore me</button>
			<h5> --- logging level: {loggingLevelName}</h5>
			<button onClick={nextLoggingLevel}>next logging level</button>
			<Socket getFaze={getFaze} />
			<h5> --- socket</h5>
			<button onClick={() => socketRemoveListener('fazor_socket.io-client_ping')}>remove ping</button>
			<button onClick={socketRemoveAllListeners}>remove all</button>
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
