
# Incoming Grammars and Features
## Ideas
#### Types
```
def add ( x: number, y: number ) number: 
    return (sum x y)
end
```

#### Identifier Interpolation

```
"hello #{hello}!"
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

#### Decision Table

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


## To Be Implemented 

#### UNIX First Line
This needs to be implemented

```
#! /usr/local/bin/node
```


#### RegExp
"Exactly like JS"

#### `this` keyword
