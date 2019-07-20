# distributions-service

## installation
`npm i distributions-service`

## usage
`npx distributions-service`
 - `--help`|`-h` - show help
 - `--version`|`-v` - show version

## commands
`npx distributions-service serve`
- `--port`|`-p` - [NUMBER]    Port for the 'serve' command (Default is 8080)

`npx distributions-service distro`
- `--shape`|`-s` - shape [STRING] Shape function for the 'distro' command (Default is Linear.None)
- `--length`|`-l` - [NUMBER] Length of the distribution for the 'distro' command  (Default is 10)
- `--start`|`-t` - [NUMBER] Starting number for the 'distro' command (Default is 1)
- `--end`|`-e` - [NUMBER] Ending number for the 'distro' command (Default is 100)

###### example
`npx distributions-service distro -s Linear.None -l 10 -t 1 -e 100`
 - output - `[ 1, 12, 23, 34, 45, 56, 67, 78, 89, 100 ]`

## rest api

GET `/api/distro/start-end/{shape}/{length}/{start}/{end}`

###### example
GET `/api/distro/start-end/Quadratic.In/6/24/-4`
 - output - `[ 24, 22.88, 19.52, 13.92, 6.079999999999998, -4 ]`

## socket.io

1. listen for `distro-[id]` for results
2. emit event `distro` to service with:
```
{
	id: [ any client defined key ],
	shape: [ shape function ],
	length: [ length of the distribution ],
	start: [ starting number ],
	end: [ ending number ]
}
```

###### example
1. listen for `distro-myID`
2. emit `distro` with
```
{
	id: 'myID',
	shape: 'Circular.Out',
	length: 4,
	start: 97,
	end: 1629
}
```
3. `[ 97, 1238.8853805098925, 1541.383451703721, 1629 ]` is emitted to `distro-myID`

## shapes
- Linear.None
- Quadratic.In
- Quadratic.Out
- Quadratic.InOut
- Cubic.In
- Cubic.Out
- Cubic.InOut
- Quartic.In
- Quartic.Out
- Quartic.InOut
- Quintic.In
- Quintic.Out
- Quintic.InOut
- Sinusoidal.In
- Sinusoidal.Out
- Sinusoidal.InOut
- Exponential.In
- Exponential.Out
- Exponential.InOut
- Circular.In
- Circular.Out
- Circular.InOut
- Elastic.In
- Elastic.Out
- Elastic.InOut
- Back.In
- Back.Out
- Back.InOut
- Bounce.In
- Bounce.Out
- Bounce.InOut
###### see https://github.com/tweenjs/tween.js/blob/master/src/Tween.js
