
import { create as createFazor, loggingLevels } from '@fazor/fazor'

import {
	initialState as socketInitialState,
	createActions as createSocketActions
} from '@fazor/socket.io-client'

const [
	createAction,
	setInitialFaze
] = createFazor({ loggingLevel: loggingLevels.dispatchedOnly })

export const getFaze = setInitialFaze({ ...socketInitialState, counter: 0 })

export const createActions = () => {
	createAction([
		'inc',
		incBy => ({ incBy }),
		({ counter, ...state }, { incBy }) => ({
			...state,
			counter: counter + incBy
		})
	])

	createAction('ignored', () => false)

	createSocketActions(createAction)
}
