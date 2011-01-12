# tastyStorage
Delicious localStorage for your webapps

## So what's the deal?
`localStorage` and `sessionStorage` are pretty fly. It'd be
superfly if we could use them without having to worry about IE and other
non-compatible browsers exploding.

## That would be rad.
That's what I thought. I've also included some added bonuses that hopefully
make it more than just another `localStorage` wrapper.

The native `Storage` interfaces are designed to be key/value storage, and it
normally doesn't allow you to store complex values. So try to do something like this:
   
    localStorage.setItem('test', {complex: [1,2,3,'a']})

and you're gonna get back this:

    localStorage.getItem('test') // "[object Object]"

Which is no fun at all. `tastyStorage` will automatically serialize
and de-serialize your objects as you store and retrieve them.

## Great! Hey, why's it called tastyStorage?
Well I had to make it work with IE (and older versions of Safari/FF) and what
better way than cookies? tastyStorage will set up a common interface so you
don't have to care about whether it's using `localStorage` or
`document.cookies` in the background.


# Usage
## Basic

Include the `tastystorage.min.js` from the `build` directory. Note that this
comes with a JSON fallback for browsers that don't support native JSON. If you
don't want to include this, see the Advanced section.

When you include the js file, you get one global object - `tastyStorage`. By
default it will try to use `localStorage` and fallback to `document.cookies`
if the browser doesn't support native DOM Storage.


# License
The MIT License

Copyright (c) 2011 Brian J. Brennan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
