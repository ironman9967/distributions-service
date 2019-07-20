
const createDistroCreator = length => ([
	shape => ([
		async (start, end) => {
			const distro = []
			for (let i = 0; i < length; i++) {
				distro.push(start + (end - start) * shape(i / (length - 1)))
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
	const shapeFunc = _get(shape)(TWEEN.Easing)
	const [ createStartEnd ] = createDistro(shapeFunc)
	return createStartEnd(parseInt(start), parseInt(end))
}
