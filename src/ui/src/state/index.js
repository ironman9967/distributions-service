
import { create as createFazor, loggingLevels } from '@fazor/fazor'

import {
	initialState as socketInitialState,
	createActions as createSocketActions
} from '@fazor/socket.io-client'

const [
	createAction,
	setInitialFaze
] = createFazor({ loggingLevel: loggingLevels.dispatchedOnly })

export const getFaze = setInitialFaze({
	...socketInitialState,
	distros: []
})

export const createActions = () => {
	createAction([
		'getDistro',
		(socketEmit, id, shape, length, start, end) => {
			socketEmit('distro', { id, shape, length, start, end })
		}
	])
	createSocketActions(createAction)
}
