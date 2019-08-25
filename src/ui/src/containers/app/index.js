
import React, { useEffect } from 'react'
import * as d3 from 'd3'

import { Socket } from '@fazor/socket.io-client'

import { getFaze } from '../../state'

export default () => {
	const [
		{ socket: { id: socketId, connected, listeners }, distros },
		{ getDistro, socketEmit, socketOn, socketEventFromServer }
	] = getFaze()

	useEffect(() => {
		if (socketId) {
			socketOn(connected, socketEventFromServer, listeners, [
				`distro-${socketId}`,
				({ id, ...distro }) => ({ distro }),
				({ distros, ...state }, { distro }) => {
					distros.push(distro)
					return { ...state, distros }
				}
			])
		}
	})

	useEffect(() => {
		if (distros.length > 0) {
			const h = 300
			d3.select('body')
				.append('svg')
				.attr('width', 700)
				.attr('height', h)
				.selectAll('rect')
				.data(distros[0].values)
				.enter()
				.append('rect')
				.attr('x', (d, i) => i * 30)
				.attr('y', d => h - 10 * d)
				.attr('width', 25)
				.attr('height', d => d * 20)
				.attr('fill', 'green')
		}
	})

	return (
		<div>
			<Socket getFaze={getFaze} />
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
