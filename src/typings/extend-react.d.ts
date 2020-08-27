import "react";

declare module "react" {
  declare type PropsHasClass = {
    className?: string;
  };

  declare type PropsHasChildren = {
    children: ReactNode;
  };

  declare type DispatchSetStateAction<P> = Dispatch<SetStateAction<P>>;
}