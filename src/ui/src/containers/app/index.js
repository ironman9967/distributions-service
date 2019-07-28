
import React, { useEffect } from 'react'

import { createStateEngine } from '../../state'

import { Socket, socketInitialState } from '../socket'

const distroInitialState = { distro: {} }

const Distro = ({ useAppContext }) => {
	const [ getState, getActions ] = useAppContext()

	useEffect(() => {
		const { distro: { test } } = getState()
		if (test === void 0) {
			const { socketOnce } = getActions()
			socketOnce(
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
		( <div> --- Distro --- <button onClick={() => console.log(getState())}>---</button></div> )
	)
}

export default props => {
	const [
		createAction,
		useAppContext
	] = createStateEngine({
		...socketInitialState,
		...distroInitialState
	})

	return (
		<useAppContext.Provider>
			<Socket useAppContext={ useAppContext } createAction={ createAction }>
				<Distro  useAppContext={ useAppContext } />
			</Socket>
		</useAppContext.Provider>
	)
}
