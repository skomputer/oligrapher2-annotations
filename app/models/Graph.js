import { merge, values, cloneDeep, includes } from 'lodash';

export default class Graph {
  static setHighlights(graph, highlights, otherwiseFaded = false) {
    if (!highlights) return graph;

    if (highlights.nodeIds.length + highlights.edgeIds.length + highlights.captionIds.length == 0) {
      otherwiseFaded = false;
    }

    let { nodeIds, edgeIds, captionIds } = highlights;
    let otherwise = otherwiseFaded ? "faded" : "normal";
    let newGraph = cloneDeep(graph);

    // cast all ids to strings
    nodeIds = nodeIds.map(id => String(id));
    edgeIds = edgeIds.map(id => String(id));
    captionIds = captionIds.map(id => String(id));

    values(newGraph.nodes).forEach(node => {
      newGraph.nodes[node.id].display.status = includes(nodeIds, String(node.id)) ? "highlighted" : otherwise;
    });

    values(newGraph.edges).forEach(edge => {
      newGraph.edges[edge.id].display.status = includes(edgeIds, String(edge.id)) ? "highlighted" : otherwise;
    });

    values(newGraph.captions).forEach(caption => {
      newGraph.captions[caption.id].display.status = includes(captionIds, String(caption.id)) ? "highlighted" : otherwise;
    });

    return newGraph;
  };
}