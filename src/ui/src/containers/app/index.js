
import React, { useEffect } from 'react'

import { create as createFazor } from '@fazor/fazor'

import { Socket, socketInitialState } from '@fazor/socket.io-client'

const distroInitialState = { distro: {} }

const Distro = ({ useFaze }) => {
	const [ getState, getActions ] = useFaze()

	useEffect(() => {
		const { distro: { test } } = getState()
		if (test === void 0) {
			const { socketOn } = getActions()
			socketOn(
				'test',
				intArr => ({ intArr, something: 'from test event' }),
				(state, { intArr, something }) => ({
					...state,
					distro: {
						...state.distro,
						test: { intArr, something }
					}
				})
			)
		}
	})

	return (
		( <div> --- Distro --- <button onClick={() => {
			const { socketRemoveListener } = getActions()
			socketRemoveListener('test')
		}}>---</button></div> )
	)
}

export default props => {
	const [
		useFaze,
		createAction
	] = createFazor({
		...socketInitialState,
		...distroInitialState
	})

	return (
		<useFaze.Provider>
			<Socket useFaze={ useFaze } createAction={ createAction }>
				<Distro useFaze={ useFaze } />
			</Socket>
		</useFaze.Provider>
	)
}
