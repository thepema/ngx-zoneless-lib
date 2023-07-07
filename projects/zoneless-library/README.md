This library try to increase the performance in your proyects using the out side zone detection. Was made for a easy use of this strategies with a directive dat make all the work with customs angular events and custom pipe async for the normal use in your aplication.

# How to use

This library was generated version 16.1.0 only dat you need is install and use de directive call zoneless, like in this example:
```html
<app-child *zoneLess [counter]="suscriptions"></app-child>
```
Now app-child is running out side zone and the component need the detectchanges method for refresh the html. In Angular events and async pipe run the markforcheck method and refresh your html but this don't work outside zone, in this library you can use a custom events dat rewrite the original method and add the detectchange. You only need add "Z" at first of de event like:
```html
<button (Zclick)="increment()">Increment</button>
```
In the case you need to suscribe we creat a custom async pipe dat have a detectchange instead a markforcheck. You can use the asyncZoneless pipe like this:
```html
{{ counter | asyncZoneless }}
```
