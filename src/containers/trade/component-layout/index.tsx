import { WidthProvider, Responsive, Layout } from "react-grid-layout";
import { tw } from "twind";
import {
  LayoutItemProps,
  dbInstance,
  useCurrentPageInfo,
  useCurrentPageKey,
  useLock,
  usePageList,
} from "src/models/store";
import { componentConfig } from "src/const/componentConfig";
import { useAtom } from "jotai";
import { DB_STORE } from "src/const/enum";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLS = 24;

const ComponentLayout = () => {
  const [dbIns] = useAtom(dbInstance);
  const { currentPageKey } = useCurrentPageKey();
  const { setPageList } = usePageList();

  const { currentPage } = useCurrentPageInfo(currentPageKey);

  const layout = currentPage?.componentList.map((i) => i.layout);

  // DATA
  const { isLock } = useLock();

  const renderComponent = (name: string) => {
    const { component: ComItem, title } =
      componentConfig.find((i) => i.key === name) || {};
    if (ComItem) {
      return <ComItem title={title as string} />;
    }

    return null;
  };
  /**
   * 布局变化，更新数据库信息和pageList，currentPage
   */
  const handleLayoutChange = (l: Layout[]) => {
    const pageInfo = {
      ...currentPage,
    };
    pageInfo?.componentList?.forEach((component) => {
      const currentLayout = l.find((i) => i.i === component.componentId);

      if (currentLayout) {
        component.layout = {
          ...currentLayout,
        };
      }
    });

    setPageList(
      (prev) =>
        prev.map((i) =>
          i.key === currentPageKey ? { ...pageInfo } : { ...i }
        ) as LayoutItemProps[]
    );

    dbIns.addItem(DB_STORE.LAYOUT, pageInfo);
  };

  return (
    <div className={tw`flex py-1 flex-1 overflow-y-scroll`}>
      <ResponsiveGridLayout
        className={tw`layout w-full`}
        layouts={{ lg: (layout as Layout[]) || [] }}
        cols={{ lg: COLS, md: COLS, sm: COLS, xs: COLS, xxs: COLS }}
        rowHeight={30}
        width={1200}
        isResizable={!isLock}
        isDraggable={!isLock}
        autoSize={false}
        margin={[10, 10]}
        onResizeStop={(l) => {
          handleLayoutChange(l);
        }}
        onDragStop={(l) => {
          handleLayoutChange(l);
        }}
      >
        {(currentPage?.componentList || []).map((component) => (
          <div key={component.componentId}>
            {renderComponent(component.name)}
          </div>
        ))}
      </ResponsiveGridLayout>
      {/* <MarketData /> */}
    </div>
  );
};

export default ComponentLayout;
