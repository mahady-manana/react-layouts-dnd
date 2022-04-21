import { __assign } from '../../node_modules/tslib/tslib.es6.js';
import { DropTargetPlaceEnum } from '../interface/internalType.js';
import { createNewColumn } from './createNewColumn.js';
import { removeItemFromSource } from './removeItemFromSource.js';

var addToNewColumn = function addToNewColumn(targetColumn, targetColumnId, sourceItemKey, place) {
  var newCols = targetColumn.reduce(function (acc, next) {
    var virtualLength = targetColumn.length > 1 ? targetColumn.length : 1;
    var newWidth = Math.round(100 / virtualLength);
    var shouldRemoveFromRestWidth = Math.round(newWidth / (targetColumn.length + 1));

    if (next.id !== targetColumnId) {
      return acc.concat(__assign(__assign({}, next), {
        width: next.width - shouldRemoveFromRestWidth
      }));
    }

    var newCol = createNewColumn(sourceItemKey ? [sourceItemKey] : undefined);

    var current = __assign(__assign({}, next), {
      width: next.width - shouldRemoveFromRestWidth
    });

    var reorder = place === DropTargetPlaceEnum.LEFT ? [newCol, current] : [current, newCol];
    return acc.concat(reorder);
  }, []);
  return newCols;
};

var addToColmunElement = function addToColmunElement(targetColumn, targetColumnId, sourceColumnId, sourceItemKey, targetItemKey, targetPlace) {
  var newColumns = targetColumn.map(function (col) {
    if (col.id !== targetColumnId) {
      return col;
    }

    var newColItems = col.childIds.map(function (k) {
      return sourceColumnId === targetColumnId && k === sourceItemKey ? 'DUPLICATE' : k;
    }).reduce(function (acc, next) {
      if (next === targetItemKey) {
        switch (targetPlace) {
          case DropTargetPlaceEnum.TOP:
            return acc.concat([sourceItemKey, next]);

          case DropTargetPlaceEnum.BOTTOM:
            return acc.concat([next, sourceItemKey]);

          default:
            return acc.concat(next);
        }
      }

      return acc.concat(next);
    }, []);

    var newCol = __assign(__assign({}, col), {
      childIds: newColItems
    });

    return newCol;
  }, []);
  return newColumns;
};

var addItemToColumn = function addItemToColumn(column, source, dest, place) {
  switch (place) {
    case DropTargetPlaceEnum.LEFT:
      return addToNewColumn(column, dest.columnId, source.itemKey, DropTargetPlaceEnum.LEFT);

    case DropTargetPlaceEnum.RIGHT:
      return addToNewColumn(column, dest.columnId, source.itemKey, DropTargetPlaceEnum.RIGHT);

    case DropTargetPlaceEnum.TOP:
      return addToColmunElement(column, dest.columnId, source.columnId, source.itemKey, dest.itemKey, place);

    case DropTargetPlaceEnum.BOTTOM:
      return addToColmunElement(column, dest.columnId, source.columnId, source.itemKey, dest.itemKey, place);
  }
};
var addToColumn = function addToColumn(layouts, source, dest, place) {
  var add = layouts.map(function (layout) {
    if (layout.id !== dest.sectionId) return layout;
    return __assign(__assign({}, layout), {
      rows: layout.rows.map(function (row) {
        if (row.id !== dest.rowId) return row;
        return __assign(__assign({}, row), {
          columns: addItemToColumn(row.columns, source, dest, place) || []
        });
      })
    });
  });
  var clean = removeItemFromSource(add, source, source.columnId === dest.columnId && (place === DropTargetPlaceEnum.BOTTOM || place === DropTargetPlaceEnum.TOP));
  return clean;
};

export { addItemToColumn, addToColumn };