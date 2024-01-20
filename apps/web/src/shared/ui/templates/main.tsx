interface MainTemplateProps extends React.PropsWithChildren {
  navbar?: React.ReactNode;
  header?: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
  navbar,
  header,
  children,
}) => (
  <div className="w-[100%] h-screen flex">
    {navbar && <nav>{navbar}</nav>}

    <div className="flex-1 h-[100%] flex flex-col bg-paper overflow-x-hidden">
      {header && <header>{header}</header>}

      <main className="flex-1 overflow-y-auto overflow-x-hidden py-8">
        {children}
      </main>
    </div>
  </div>
);
