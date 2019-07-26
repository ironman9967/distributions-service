
import { useReducer } from 'react'

import createUseContext from 'constate'

export const createStateEngine = (initialState = {}) => {
	const types = []
	const actions = []
	return [
		action => {
			const typeOnly = typeof action === 'string'
			const isArray = Array.isArray(action)
			if (!isArray && !typeOnly && action.type === void 0) {
				throw new Error(`Actions must have a 'type'`)
			}
			const {
				type,
				handler = () => ({}),
				reducer = state => ({ ...state })
			} = typeOnly
				? { type: action }
				: isArray
					? { type: action[0], handler: action[1], reducer: action[2] }
					: action
			actions[type] = { handler, reducer }
			types.push(type)
		},
		createUseContext(() => {
			const [
				state,
				dispatch
			] = useReducer(
				(state, {
					type,
					...action
				}) => {
					const newState = { ...actions[type].reducer(state, action) }
					console.log(`%cDISPATCHED: %c${type}`, 'color: #00c000', 'color: #f070f0')
					console.log('%c\tPREVIOUS STATE', 'color: #555555', state)
					console.log('%c\tACTION', 'color: #c09000', { type, ...action })
					console.log('%c\tNEW STATE', 'color: #0090c0', newState)
					return newState
				},
				initialState
			)
			return [
				() => state,
				() => types.reduce((actionDispatch, type) => {
					const { handler } = actions[type]
					actionDispatch[type] = async (...args) => {

						console.log('dispatch called', type, args)

						dispatch({
							type,
							...await handler.apply(null, args)
						})
					}
					return actionDispatch
				}, {})
			]
		})
	]
}
