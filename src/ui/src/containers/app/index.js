
import React from 'react'

import { loggingLevels } from '@fazor/fazor'

import { Socket } from '@fazor/socket.io-client'

import { getFaze } from '../../state'

export default () => {
	const [ state, actions, [ , logDebug ] ] = getFaze()

	const { counter, __fazor: { loggingLevelName } } = state
	const { inc, ignored, __fazorSetLoggingLevel, socketOn } = actions

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

	socketOn(state, actions, 'test')

	return (
		<div>
			<h3> --- count: {counter}</h3>
			<button onClick={increment}>increment</button>
			<button onClick={ignored}>ignore me</button>
			<h5> --- logging level: {loggingLevelName}</h5>
			<button onClick={nextLoggingLevel}>next logging level</button>
			<Socket getFaze={getFaze} />
		</div>
	)
}
