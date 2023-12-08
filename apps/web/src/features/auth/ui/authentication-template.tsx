import {Avatar, H2} from "@shared/ui";
import bg from "@shared/assets/block-bg.png";

const avatar = "https://shorturl.at/ikvZ0";

type AuthenticationTemplate = React.PropsWithChildren;

export const AuthenticationTemplate: React.FC<AuthenticationTemplate> = ({
  children,
}) => {
  return (
    <main className="w-screen h-screen flex">
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="w-[50%] h-[100%] flex items-center justify-center bg-main bg-cover bg-center"
      >
        <div className="w-[70%] flex flex-col space-y-20">
          <div className="flex flex-col space-y-6">
            <H2 className="text-main-contrast whitespace-pre-line">
              Welcome to{"\n"}our community
            </H2>

            <p className="text-main-contrast/70">
              MetaOrta helps developers to build organized and well coded
              dashboards full of beautiful and rich modules. Join us and start
              building your application today.
            </p>
          </div>

          <div className="flex items-center space-x-5">
            <div className="flex -space-x-3">
              {Array.from({length: 4}).map((_, idx) => (
                <Avatar key={idx} src={avatar} />
              ))}
            </div>

            <span className="text-main-contrast/70">
              More than 10k people joined us, it’s your turn
            </span>
          </div>
        </div>
      </div>

      <div className="w-[50%] h-[100%] flex flex-col items-start justify-center pl-[5%]">
        {children}
      </div>
    </main>
  );
};
