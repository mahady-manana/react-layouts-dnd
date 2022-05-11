import { typeof as _typeof } from '../../_virtual/_rollupPluginBabelHelpers.js';
import React, { useRef, useState } from 'react';
import { DraggableItem } from '../components/draggable/Draggable.js';
import { DroppableColumnItem } from '../components/DroppableColumnItem/index.js';
import '../../node_modules/classnames/index.js';
import { ResizableContainer } from '../components/ResizableContainer/ResizableContainer.js';
import { DroppableColumnContainer } from '../components/DroppableColumnContainer/index.js';
import { ILayoutTargetEnum } from '../interface/internalType.js';
import { reorderLayout } from '../helpers/reorderLayout.js';
import { changeColumnWidth } from '../helpers/changeColumnWidth.js';

var LayoutRowContainer = function LayoutRowContainer(_a) {
  var disabled = _a.disabled,
      stableKey = _a.stableKey,
      columns = _a.columns,
      layouts = _a.layouts,
      sectionId = _a.sectionId,
      rowId = _a.rowId,
      setActualLayout = _a.setActualLayout,
      renderComponent = _a.renderComponent,
      onFocusItem = _a.onFocusItem,
      onLayoutChange = _a.onLayoutChange;
  var containerRef = useRef(null);

  var _b = useState(false);
      _b[0];
      var setDragStart = _b[1];

  var _c = useState(),
      currentColumn = _c[0],
      setCurrentColumn = _c[1];

  var _d = useState(0),
      addToWidth = _d[0],
      setAddToWidth = _d[1];

  var _e = useState(false),
      isSectionDragged = _e[0],
      setIsSectionDragged = _e[1];

  var handleDragStart = function handleDragStart(e, sectionId, columnId, rowId, itemkey) {
    e.stopPropagation();

    var itemKeyType = _typeof(itemkey);

    e.dataTransfer.setData('itemKey', itemkey);
    e.dataTransfer.setData('itemKeyType', itemKeyType);
    e.dataTransfer.setData('sectionId', sectionId);
    e.dataTransfer.setData('colmunId', columnId);
    e.dataTransfer.setData('rowId', rowId);
    setIsSectionDragged(false);
    setDragStart(true);
  }; //   // Drop item to create new column or setion or add item to column


  var handleDropItem = function handleDropItem(e, target, sectionId, columnId, rowId, itemKey, layoutTarget) {
    var sourceItemKey = e.dataTransfer.getData('itemKey');
    var isSection = e.dataTransfer.getData('isSection');
    var sourceSectionId = e.dataTransfer.getData('sectionId');
    var sourceColumnKey = e.dataTransfer.getData('colmunId');
    var sourceRowId = e.dataTransfer.getData('rowId');
    var itemKeyType = e.dataTransfer.getData('itemKeyType');
    var source = {
      columnId: sourceColumnKey,
      itemKey: itemKeyType === 'number' ? parseFloat(sourceItemKey) : sourceItemKey,
      sectionId: sourceSectionId,
      isSection: !!isSection,
      rowId: sourceRowId
    };
    var destination = {
      columnId: columnId,
      itemKey: itemKey,
      sectionId: sectionId,
      targetPlace: target,
      rowId: rowId
    };

    if (!itemKey && !sourceItemKey) {
      // this is used to prevent drag resize to create new item
      return;
    }

    setDragStart(false);
    var newLayout = reorderLayout(layouts, source, destination, target, layoutTarget);
    setIsSectionDragged(false);

    if (newLayout) {
      setActualLayout(newLayout);
      onLayoutChange(newLayout);
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "section-content flex",
    style: {
      width: '100%',
      margin: 'auto'
    },
    ref: containerRef
  }, columns.map(function (column, index) {
    return /*#__PURE__*/React.createElement(ResizableContainer, {
      isCol: true,
      colIndex: index,
      key: column.id,
      resizable: true,
      colNumber: columns.length,
      styles: {
        width: addToWidth && currentColumn !== column.id ? "".concat(Math.round(column.width + addToWidth), "%") : "".concat(Math.round(column.width), "%")
      },
      type: "column",
      currentWidth: Math.round(column.width),
      onResize: function onResize(w, init) {
        setCurrentColumn(column.id);
        var rest = column.width - w;
        var add = rest / (columns.length - 1);
        setAddToWidth(function (prev) {
          return Math.abs((prev || 0) - add) > 5 ? prev : add;
        });
      },
      onResizeColEnd: function onResizeColEnd(_init, _final) {
        setCurrentColumn(undefined);
        var newLayouts = changeColumnWidth(layouts, {
          sectionId: sectionId,
          rowId: rowId
        }, {
          width: _final,
          colId: column.id,
          init: column.width
        });
        setAddToWidth(0);
        setActualLayout(newLayouts);
        onLayoutChange(newLayouts); // handleFinishResize(w, column.id);
      }
    }, /*#__PURE__*/React.createElement(DroppableColumnContainer, {
      key: column.id,
      disableChange: disabled,
      //   isSection={isSectionDragged} TO DO
      styles: column.styles,
      className: column.className,
      dndTargetKey: column.id,
      width: column.width,
      currentColumLength: 1,
      onDropItem: function onDropItem(e, target) {
        return handleDropItem(e, target, sectionId, column.id, rowId, undefined, ILayoutTargetEnum.COL);
      }
    }, /*#__PURE__*/React.createElement("div", {
      key: column.id,
      className: "rlb-col-inner"
    }, column.items.map(function (items, index) {
      if (!items) return null;
      return /*#__PURE__*/React.createElement(DroppableColumnItem, {
        disableChange: disabled,
        isSection: isSectionDragged,
        key: index,
        dndTargetKey: items[stableKey],
        onDropItem: function onDropItem(e, target) {
          return handleDropItem(e, target, sectionId, column.id, rowId, items[stableKey], ILayoutTargetEnum.ITEM);
        }
      }, /*#__PURE__*/React.createElement(DraggableItem, {
        disableChange: disabled || items['id'] === 'EMPTY_SECTION',
        dndTargetKey: items[stableKey],
        onDragStart: function onDragStart(e) {
          handleDragStart(e, sectionId, column.id, rowId, items[stableKey]);
        },
        onClick: function onClick() {
          onFocusItem && onFocusItem({
            sectionId: sectionId,
            columnId: column.id,
            itemKey: items[stableKey],
            rowId: rowId,
            isSection: false
          });
        }
      }, items['id'] === 'EMPTY_SECTION' && !disabled ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Drop or add block here...")) : null, items['id'] !== 'EMPTY_SECTION' ? renderComponent(items, {
        columnId: column.id,
        itemKey: items[stableKey],
        rowId: rowId,
        sectionId: sectionId
      }) : null));
    }))));
  }));
};

export { LayoutRowContainer };
