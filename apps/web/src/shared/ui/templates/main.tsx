interface MainTemplateProps {
  navbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
  navbar,
  sidebar,
  header,
  children,
}) => {
  return (
    <div className="w-[100%] h-screen flex">
      {navbar}

      <div className="w-[75%] h-[100%] flex flex-col bg-paper-brand">
        {header}

        {children}
      </div>

      {sidebar}
    </div>
  );
};
