# Oligrapher Annotations
[Oligrapher](https://github.com/skomputer/oligrapher2) is a JavaScript app for visualizing network graphs. Oligrapher accepts graph data in a specific format and allows a user to design a nice-looking SVG rendering of the graph.

The Oligrapher Annotations app is a UI for editing, annotating, and displaying Oligrapher graphs. It is build with [React](http://reactjs.com) and [Redux](http://rackt.org/redux) and is easy to embed in a web page or web application.

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

Examine ```build/index.html``` for an example of how to run Oligrapher Annotations in production.

```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/><meta charset="UTF-8">
    <title>Oligrapher 2 Annotations</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="oligrapher.css" rel="stylesheet"/>
    <link href="oligrapher.editor.css" rel="stylesheet"/>
    <link href="oligrapher.annotations.css" rel="stylesheet"/>
    <script src="oligrapher.min.js"></script>
    <script src="oligrapher.editor.min.js"></script>
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
      root.style.height = window.innerHeight - 120 + "px";

      var oliAnnotations = new OligrapherAnnotations({
        domRoot: root,
        oligrapher: Oligrapher,
        editor: OligrapherEditor,
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




