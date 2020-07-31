const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  lintOnSave: true,
  chainWebpack: config => {
    config.module
      .rule("")
      .test(/mxClient\.js$/)
      .use("exports-loader")
      .loader(
        "exports-loader?mxClient,mxLog,mxObjectIdentity,mxDictionary,mxResources,mxEffects,mxUtils,mxConstants,mxEvent,mxClipboard,mxUrlConverter,mxVmlCanvas2D,mxStencilRegistry," +
          "mxMarker,mxHierarchicalEdgeStyle,mxCellPath,mxPerimeter,mxEdgeStyle,mxStyleRegistry,mxCodecRegistry,mxGenericChangeCodec,mxStylesheetCodec,mxDefaultToolbarCodec," +
          "mxGraph,mxRubberband,mxHierarchicalLayout,mxFastOrganicLayout,mxGraphModel,mxPanningHandler,mxKeyHandler,mxParallelEdgeLayout,mxLayoutManager,mxCompactTreeLayout," +
          "mxPrintPreview,mxToolbar,mxOutline,mxCellTracker,mxCellOverlay,mxImage,mxLoadResources,mxPopupMenu,mxCylinder,mxRectangle,mxCellRenderer,mxVertexHandler,mxPoint," +
          "mxHandle,mxRhombus, mxActor,mxArrow,mxArrowConnector,mxCloud,mxConnector,mxConnector,mxEllipse,mxHexagon,mxImageShape,mxLabel,mxLine,mxPolyline,mxMarker,mxRectangleShape," +
          "mxShape,mxStencil,mxStencilRegistry,mxSwimlane,mxText,mxTriangle,mxAutoSaveManager,mxDivResizer,mxForm,mxGuide,mxImageBundle,mxImageExport,mxLog,mxMorphing,mxMouseEvent," +
          "mxPanningManager,mxSvgCanvas2D,mxUndoableEdit,mxUndoManager,mxUrlConverter,mxWindow,mxXmlCanvas2D,mxXmlRequest,mxCellEditor,mxCellState,mxCellStatePreview,mxConnectionConstraint," +
          "mxGraphSelectionModel,mxGraphView,mxMultiplicity,mxSwimlaneManager,mxTemporaryCellStates,mxGeometry,mxStackLayout,mxRadialTreeLayout,mxPartitionLayout,mxGraphLayout," +
          "mxEdgeLabelLayout,mxCompositeLayout,mxCircleLayout,mxSwimlaneOrdering,mxMinimumCycleRemover,mxMedianHybridCrossingReduction,mxHierarchicalLayoutStage,mxCoordinateAssignment," +
          "mxSwimlaneLayout,mxObjectCodec,mxGenericChangeCodec,mxTooltipHandler,mxSelectionCellsHandler,mxPopupMenuHandler,mxGraphHandler,mxElbowEdgeHandler,mxEdgeHandler," +
          "mxConstraintHandler,mxConnectionHandler,mxCellMarker,mxCellHighlight,mxDefaultPopupMenu,mxDefaultKeyHandler,mxCodec,mxGraphHierarchyModel,mxGraphAbstractHierarchyCell," +
          "mxGraphHierarchyEdge,mxGraphHierarchyNode,mxSwimlaneModel,mxEdgeSegmentHandler"
      )
      .end();
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"));
    // Add this by yourself in this format .set('', resolve(''))
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: "worker-loader" }
        }
      ]
    }
  }
};
