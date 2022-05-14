import React, {
  DragEvent,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRenderableLayout } from '../helpers/createRendrableLayout';
import { ILayoutContainer, ILayoutSection } from '../interface';
import { IRenderableLayout } from '../interface/renderableInterface';
import '../index.css';
import { changeSectionStyles } from 'layouts-builder/helpers/changeSectionStyles';
import { LayoutRowContainer } from './LayoutRowContainer';
import { needRowTarget } from 'layouts-builder/helpers/shouldShowRowTarget';

export const LayoutContainer: FC<ILayoutContainer> = ({
  data,
  renderComponent,
  onLayoutChange,
  stableDataKey: stableKey,
  layouts,
  imageSizeFnLoader,
  disableChange,
  onClickSection,
  staticComponent,
  imageCheckerFn,
  onImageResizeFinished,
}) => {
  const containeRef = useRef<HTMLDivElement>(null);
  const [runChange, setRunChange] = useState<boolean>(false);
  const [actualLayout, setActualLayout] = useState<ILayoutSection[]>(
    [],
  );
  const [dragActive, setDragActive] = useState(false);

  const [renderableLayout, setRenderableLayout] = useState<
    IRenderableLayout[]
  >([]);

  useEffect(() => {
    if (layouts && layouts.length > 0) {
      setActualLayout(layouts);
    }
  }, [layouts]);

  useEffect(() => {
    if (actualLayout.length > 0) {
      const renderable = createRenderableLayout(
        data,
        actualLayout,
        stableKey,
      );

      setRenderableLayout(renderable);
    }
  }, [actualLayout, data]);

  // run layout update
  useEffect(() => {
    if (runChange) {
      onLayoutChange(actualLayout);
      setRunChange(false);
    }
  }, [runChange]);

  const handleDragSectionStart = (
    e: DragEvent<HTMLDivElement>,
    sectionId: string,
  ) => {
    e.stopPropagation();
    e.dataTransfer.setData('sectionId', sectionId);
    e.dataTransfer.setData('isSection', 'section');
  };

  const handleResizeSection = (
    currentWidth: number,
    sectionId: any,
  ) => {
    const newLayouts = changeSectionStyles(actualLayout, sectionId, {
      width: currentWidth,
    });
    setActualLayout(newLayouts);
    onLayoutChange(newLayouts);
  };

  if (staticComponent) {
    return (
      <>
        {data.map((item, index) => {
          return renderComponent(item, {} as any, index);
        })}
      </>
    );
  }

  return (
    <div className="m-auto">
      <div className="min-h-[100px]" ref={containeRef}>
        {renderableLayout.map((section, sectionIndex) => {
          return (
            <div
              className="rlb-section rlb-section-container"
              // draggable={false}
              // onDragStart={onDragStart}
              style={{
                background: section.backgroundImage
                  ? `url(${section.backgroundImage})`
                  : section.backgroundColor,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div
                className="rlb-section-content"
                style={{ width: section.width, margin: 'auto' }}
              >
                {section.rows.map((row, rowIndex) => {
                  return (
                    <LayoutRowContainer
                      key={row.id}
                      stableKey={stableKey}
                      dragActive={dragActive}
                      layouts={actualLayout}
                      columns={row.columns}
                      sectionId={section.id}
                      rowId={row.id}
                      disabled={disableChange}
                      isLastSection={
                        renderableLayout.length === sectionIndex + 1
                      }
                      isFirstSection={sectionIndex === 0}
                      needRowTarget={needRowTarget(
                        renderableLayout,
                        row,
                        {
                          rows: section.rows,
                          sectionIndex,
                          rowIndex,
                        },
                      )}
                      renderComponent={renderComponent}
                      setActualLayout={setActualLayout}
                      onLayoutChange={onLayoutChange}
                      imageCheckerFn={imageCheckerFn}
                      imageSizeFnLoader={imageSizeFnLoader}
                      onImageResizeFinished={onImageResizeFinished}
                      setDragActive={setDragActive}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
