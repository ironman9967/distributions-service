
export const createDistroCreator = size => ([
	ease => ([
		async (start, end) => {
			const distro = []
			for (let i = 0; i < size; i++) {
				distro.push(start + (end - start) * ease(i / (size - 1)))
			}
			return distro
		}
	])
])
