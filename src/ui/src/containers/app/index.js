
import React from 'react'

import { createStateEngine } from '../../state'

import { Socket } from '../socket'

export default props => {
	const [
		createAction,
		useAppContext
	] = createStateEngine({
		socket: {
			connected: false,
			connect: true,
			connecting: false
		}
	})

	return (
		<useAppContext.Provider>
			<Socket
				useAppContext={ useAppContext }
				createAction={ createAction }
			/>
		</useAppContext.Provider>
	)
}
