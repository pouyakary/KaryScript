# Incoming Grammars and Features
## Ideas

#### Placeholders `IMPORTANT`
This:

```
x(y(), z(), f(1, 8, 10))
```

Can be written as:

```
def p1 = (y)
def p2 = (z)
def p3 = (f 1 8 10)
(x p1 p2 p3)
```

Problem here is you __have__ to use 3 vars to write this clean. And may devs use vars like this just to write cleaner code. So place holders are macro-like vars for the _preprocessor_ that helps writing clean code while keeping it fast by just replacing place holder values:

```
hold p1 = (x) ⟶ (y) ⟶ (z $ 5)
(f (g) @p1)
```

This will compile to this:

```
// without using any variables
f(g( ), z(y(x()), 5))
```

#### Identifier Interpolation

```
"hello {{hello}}!"
```
#### Imports
Simple imports can be in KaryScript as:

```
use fs
```

Which compiles to

```
// common.js
const fs = require('fs');

// es6
import * as fs from 'fs';
```

and also can exists multiple imports

```
use fs path
```

also can be partial loads:

```
use a b c from "module"

// compiles to:
// import {a, b, c} from 'module';
```

And in the end:

```
use "fs" as fileSystem

// compiles to:
// const fileSystem = require('fs')
// or:
// import * as fileSystem from 'fs';
```

## Needs Thinking

#### Shorthand Assigns:

````
x += 4
y -= 3
````

#### Object/Array returns
JavaScript Has this

```
let [a, b, c] = f( );
let {a, b, c} = g( );
```

No clean grammar is present for this one.

#### Rest Parameters
```
def foo x [y] z:
	
end
```

#### Range Literals
With exactly the implementation CoffeeScript has for them.

```
0..3  -> [0, 1, 2]
0...3 -> [0, 1, 2, 3]
```

Also it needs special support in selector expression

```
[ x | 0..1 ]
```

## Great Ideas from other languages

```
solipsism = true if mind? and not world?

speed = 0
speed ?= 15

footprints = yeti ? "bear"
```

which compiles to

```
var footprints, solipsism, speed;

if ((typeof mind !== "undefined" && mind !== null) && (typeof world === "undefined" || world === null)) {
  solipsism = true;
}

speed = 0;

if (speed == null) {
  speed = 15;
}

footprints = typeof yeti !== "undefined" && yeti !== null ? yeti : "bear";
```

## To Be Implemented 

#### Try Catch

```
try

end
```

```
try

catch error:

end
```

```
try

catch e:

finally

end
```

#### RegExp
"Exactly like JS"

#### Literal Addresses

```
(5/toString)
("Hello, World!".substring 5)
```
