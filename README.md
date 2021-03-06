# Oligrapher Annotations
[Oligrapher](https://github.com/skomputer/oligrapher2) is a JavaScript app for visualizing network graphs. Oligrapher accepts graph data in a specific format and allows a user to design a nice-looking SVG rendering of the graph.

The Oligrapher Annotations app extends Oligrapher with a UI for editing, annotating, and displaying Oligrapher graphs. It is built with [React](http://reactjs.com) and [Redux](http://rackt.org/redux) and is easy to embed in a web page or web application.

The first version of Oligrapher was developed as part of [LittleSis](http://littlesis.org) before it was separated into a standalone library. LittleSis has a large collection of [maps created with Oligrapher](http://littlesis.org/oligrapher). 

Quick Start
-----------

To run this app in development mode:

```
cd /var/www/
clone https://github.com/skomputer/oligrapher2-annotations.git
npm install
npm run dev-build
```

Point your browser to the repository's ```build/dev.html``` to view a sample graph (with annotations) in edit mode. In development mode the React application is served by webpack with hot loading.

Embed
-----

To embed the Annotations app in a web page, include the .js file from the build directory in your page header and mount the app in an HTML element. Examine ```build/index.html``` for an example.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/><meta charset="UTF-8">
    <title>Oligrapher 2 Annotations Demo</title>
    <script src="oligrapher.annotations.min.js"></script>
    <script src="oligrapher-annotations-example-data.js"></script>
    <script src="LsDataSource.js"></script>
    <style>
    </style>
  </head>
  <body>
    <div id="annotations"></div>
    <script>
      var root = document.getElementById('annotations');
      var app = new OligrapherAnnotations({
        domRoot: root,
        dataSource: LsDataSource,
        graphData: oligrapherAnnotationsData.graph, 
        annotationsData: oligrapherAnnotationsData.annotations,
        title: "Puerto Rico, hedge funds, and the Fed",
        user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },
        date: "August 30, 2015",
        isEditor: true,
        startIndex: 0,
        onSave: function(data) { console.log(data); },
        links: [
          { text: "some", url: "http://some.net" },
          { id: "exampleLink", text: "example", url: "http://example.com" },
          { text: "links", url: "http://links.org" }
        ]
      });
    </script>
  </body>
</html>
```

Data Schema
-----------

Initial data can be provided to the app in two places, the ```graphData``` and ```annotationsData``` configuration options. If no data is provided at initialization the app will begin empty. Graph data should conform to the [Oligrapher data schema](https://github.com/skomputer/oligrapher2#data-schema), and annotations data is an ordered array of annotations.

### Annotation Attributes

- ```header:``` **(required)** a header to be displayed above the annotation
- ```text:``` **(required)** the text body of the annotation, with optional HTML markup
- ```nodeIds:``` **(required)** an array of ids of nodes to highlight from the underlying graph (can be empty)
- ```edgeIds:``` **(required)** an array of ids of edges to highlight from the underlying graph (can be empty)
- ```captionIds:``` **(required)** an array of ids of captions to highlight from the underlying graph (can be empty)

If no node, edge, or captions are highlighted, the graph will have its normal appearance when viewing the annotation. If there are highlights, non-highlighted content will appear faded.

API
---

### ```constructor(config)```
Returns an Oligrapher Annotations instance within a specified ```root``` DOM element and accepts other configuration options.

- ```domRoot:``` **(required)** a DOM element to mount the app inside of

```javascript
var root = document.getElementById('annotations');
var app = new OligrapherAnnotations({
  domRoot: root,
  dataSource: LsDataSource,
  title: oligrapherAnnotationsData.title,
  graphData: oligrapherAnnotationsData.graph, 
  annotationsData: oligrapherAnnotationsData.annotations,
  user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },
  date: "August 30, 2015",
  startIndex: 0,
  isEditor: true,
  onSave: function(data) { console.log(data); },
  onNav: function(index) { console.log("navigating to annotation " + String(index)); },
  links: [
    { text: "some", url: "http://some.net" },
    { id: "exampleLink", text: "example", url: "http://example.com" },
    { method: "POST", text: "clone", url: "http://lilsis.local/maps/118-satoshi/clone" }
  ]
});
```
