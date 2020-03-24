<template>
  <div ref="graph_container"></div>
</template>

<script>
import {
  mxGraph,
  mxCodec,
  mxUtils,
  mxConstants,
  mxStencilRegistry,
  mxStencil
} from "mxgraph/javascript/mxClient";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    // Creates the graph inside the given container
    var graph = new mxGraph(this.$refs.graph_container);

    // Loads the stencils into the registry
    var req = mxUtils.load("./drawio/webapp/stencils/citrix.xml");
    var root = req.getDocumentElement();
    var shape = root.firstChild;

    while (shape != null) {
      if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
        mxStencilRegistry.addStencil(
          "mxgraph.citrix.".concat(
            shape
              .getAttribute("name")
              .toLowerCase()
              .replace(/ /g, "_")
          ),
          new mxStencil(shape)
        );
      }

      shape = shape.nextSibling;
    }

    var xml =
      '<root><mxCell id="2" style="shape=mxgraph.citrix.desktop;verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;align=center;outlineConnect=0;" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';
    var doc = mxUtils.parseXml(xml);
    var codec = new mxCodec(doc);
    var elt = doc.documentElement.firstChild;
    var cells = [];

    while (elt != null) {
      cells.push(codec.decode(elt));
      elt = elt.nextSibling;
    }

    graph.addCells(cells);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
