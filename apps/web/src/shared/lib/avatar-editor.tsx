import {useRef, useState} from "react";
import Editor, {AvatarEditorProps as EditorProps} from "react-avatar-editor";
import * as Tabs from "@radix-ui/react-tabs";
import {BsCrop} from "react-icons/bs";
import {MdOutlineFileUpload} from "react-icons/md";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import * as Slider from "@radix-ui/react-slider";

import {Button, Upload, Modal, ModalWindowPropsWithClose} from "@shared/ui";
import {Nullable} from "@shared/lib/types";

type Tab = "crop" | "upload";

interface AvatarEditorProps extends EditorProps, ModalWindowPropsWithClose {
  onSave?: (blob: Blob) => void;
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  onSave,
  close,
  ...props
}) => {
  const editor = useRef<Nullable<Editor>>(null);

  const [avatar, setAvatar] = useState(props.image);
  const [currentTab, setCurrentTab] = useState<Tab>("crop");
  const [scale, setScale] = useState(1);

  return (
    <Modal.Window title="Edit profile picture">
      <div className="flex flex-col space-y-8">
        <div className="w-full flex flex-col justify-center items-center space-y-4 m-auto">
          <Editor
            ref={editor}
            image={avatar}
            borderRadius={125}
            scale={scale}
            border={25}
            className="w-full h-auto"
          />

          <Tabs.Root
            value={currentTab}
            onValueChange={(value) => {
              setCurrentTab(value as Tab);
            }}
            className="w-[100%] flex flex-col space-y-4"
          >
            <Tabs.List className="flex space-x-6">
              <Tabs.Trigger
                value="crop"
                className={twMerge(
                  cx(
                    "inline-flex items-center space-x-2 border-b-2 border-transparent p-2 text-paper-contrast/25",
                    {
                      "border-main text-paper-contrast": currentTab === "crop",
                    },
                  ),
                )}
              >
                <BsCrop className="w-5 h-auto" />

                <span className="font-semibold">Crop</span>
              </Tabs.Trigger>

              <Tabs.Trigger
                value="upload"
                className={twMerge(
                  cx(
                    "inline-flex items-center space-x-2 border-b-2 border-transparent p-2 text-paper-contrast/25",
                    {
                      "border-main text-paper-contrast":
                        currentTab === "upload",
                    },
                  ),
                )}
              >
                <MdOutlineFileUpload className="w-6 h-auto" />

                <span className="font-semibold">Upload</span>
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="crop">
              <div className="flex flex-col space-y-4">
                <span className="font-medium">Expand</span>

                <div className="w-[100%] flex items-center space-x-4">
                  <span className="font-bold text-xl">-</span>

                  <Slider.Root
                    value={[scale]}
                    min={1}
                    max={2}
                    step={0.01}
                    onValueChange={([value]) => {
                      setScale(value);
                    }}
                    className="flex-1 flex items-center select-none relative w-[12.5rem] h-[1.25rem]"
                  >
                    <Slider.Track className="relative grow rounded-full h-[50%] bg-paper-contrast/20">
                      <Slider.Range className="absolute rounded-lg bg-accent-400 h-[100%]" />
                    </Slider.Track>

                    <Slider.Thumb className="block w-[1.25rem] h-[1.25rem] bg-accent-600 rounded-full" />
                  </Slider.Root>

                  <span className="font-bold text-xl">+</span>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="upload">
              <div className="flex items-center space-y-4 pt-2">
                <Upload
                  onChange={({currentTarget}) => {
                    const file = currentTarget.files![0];

                    if (file) {
                      setAvatar(URL.createObjectURL(file));
                    }
                  }}
                >
                  <Button className="bg-accent-300 text-paper-contrast text-base">
                    Upload photo
                  </Button>
                </Upload>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="flex space-x-4 items-center">
          <Modal.Close>
            <Button color="secondary" className="w-[50%]">
              Cancel
            </Button>
          </Modal.Close>

          <Button
            onClick={() => {
              editor?.current!.getImage().toBlob((blob) => {
                if (onSave) onSave(blob!);

                close();
              });
            }}
            className="w-[50%]"
          >
            Save changes
          </Button>
        </div>
      </div>
    </Modal.Window>
  );
};
