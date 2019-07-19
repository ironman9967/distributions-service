
const createDistroCreator = size => ([
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

export const createTweenDistroCreator = ({
	TWEEN,
	_get
}) => ({
	easeFuncName,
	size,
	start,
	end
}) => {
	const [ createDistro ] = createDistroCreator(parseInt(size))
	const ease = _get(easeFuncName)(TWEEN.Easing)
	const [ createStartEnd ] = createDistro(ease)
	return createStartEnd(parseInt(start), parseInt(end))
}
