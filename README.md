# MMM-GoogleKeep

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This modules displays one list from Google Keep with checkboxes. 
The current state of the project is proof of concept. If you need more functionality, create a pull requests or open an issue.

As there is no official API for Google Keep, the python module [gkeepapi](https://github.com/kiwiz/gkeepapi) is used.


## Screenshot
<img width="576" alt="Screen Shot 2021-06-11 at 8 47 56 AM" src="https://user-images.githubusercontent.com/38865319/121759675-c06dc500-cadb-11eb-8d6c-ea73bc7c66ba.png">


## Dependencies

- [python-shell](https://www.npmjs.com/package/python-shell)


- [gkeepapi](https://github.com/kiwiz/gkeepapi)


## Install

To install the module, use your terminal to:

1. Navigate to your MagicMirror's `modules` folder. If you are using the default installation directory, use the command: 
```
cd ~/MagicMirror/modules
```

2. Clone the module to your computer by executing the following command:
```
git clone https://github.com/taxilof/MMM-GoogleKeep.git
```

3. Install the `python-shell` library by executing the following command:
```
npm install
```

4. Install gkeepapi 
```
pip3 install -U gkeepapi
```

## Troubleshooting
If you are hitting `gkeepapi.exception.LoginException: ('BadAuthentication', None)`, follow these steps:
- Double check your username and password
- Try downgrading requests: `pip3 install requests==2.23.0`
- Try downloading the latest python3 version. This is more involved, see [instructions here](https://www.raspberrypi.org/forums/viewtopic.php?t=291310#p1761359).

## Using the module

### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file and insert your details:
```js
var config = {
    modules: [
        {
            module: 'MMM-GoogleKeep',
            position: "bottom_top",
            header: "Google Keep",
            config: {
                username: 'test@example.com',
                password: 'pass',
                noteId: 'id',
                updateInterval: 60,
                maxLines: 30,
                //width: 400,
                //unchecked_only: true,
            }
        }
    ]
}
```


### Configuration options

| Option           | Description
|----------------- |-----------
| `username`       | *Required* Your Google Keep username
| `password`       | *Required* Your Google Keep password
| `noteId`         | *Required* The ID of the list you want to display. Open the list in browser and copy the ID from adress bar (example: '1aGdg26b2Aza6ga3aKa6gafa41e1Eag8LFVkE_klE4ap0i13HGoBmNeLp3a4')
| `updateInterval`       | *Required* How many seconds to wait before fetching an update
| `maxLines`       | *Required* Maximum number of lines to display
| `width`          | *Optional* Maximum width for the list to take up, in pixels. Default allows full width of Magic Mirror screen.
| `unchecked_only` | *Optional* Set to true to only display unchecked items. Default false

## Issues

Sometimes the gkeepapi reports a NeedsBrowser Error:
```
Error: gkeepapi.exception.LoginException: ('NeedsBrowser', 'To access your account, you must sign in on the web. Touch Next to start browser sign-in.')
```
This can be resolved by a login to keep.google.com in a browser.
    


## Todo

- [ ] add error handling
- [ ] more options, e.g. CSS settings
- [ ] use gkeepapi.sync() to keep script running instead of starting a new instance each time


## Special Thanks

- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror²](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [Furkan 'Dentrax' Türkal](https://github.com/Dentrax/MMM-ArduPort/) for creating his ArduPort module which showed me how communicate with a python script.


## The MIT License (MIT)

Copyright © 2020 taxilof

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
