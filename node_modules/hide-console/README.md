# hide-console

A NPM package which lets user override and hide the console methods


### Installation:

```JavaScript
npm install hide-console
or 
yarn add hide-console
```

### Usage for React app:

```JavaScript
import initHideConsole from "hide-console";
```

```JavaScript
initHideConsole(<["log", ...]>)
```
You have to pass all the functions which needs to be overriden and hide console messages for 

Examples:

1. To hide log console messages
```JavaScript
initHideConsole(["log"])
```

2. To hide log, error, warn console messages
```JavaScript
initHideConsole(["log", "error", "warn"])
```

3. To hide error, warn console messages
```JavaScript
initHideConsole(["error", "warn"])
```

### Usage as JavaScript library 

Download hide-console.min.js and include it as a script file inside your application and call initHideConsole() as shown in above examples





