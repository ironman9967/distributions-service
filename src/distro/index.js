
const createDistroCreator = length => ([
	ease => ([
		async (start, end) => {
			const distro = []
			for (let i = 0; i < length; i++) {
				distro.push(start + (end - start) * ease(i / (length - 1)))
			}
			return distro
		}
	])
])

export const createTweenDistroCreator = ({
	TWEEN,
	_get
}) => ({
	shape,
	length,
	start,
	end
}) => {
	const [ createDistro ] = createDistroCreator(parseInt(length))
	const ease = _get(shape)(TWEEN.Easing)
	const [ createStartEnd ] = createDistro(ease)
	return createStartEnd(parseInt(start), parseInt(end))
}
