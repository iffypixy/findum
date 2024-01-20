import {useState} from "react";
import Editor, {AvatarEditorProps as EditorProps} from "react-avatar-editor";
import * as Tabs from "@radix-ui/react-tabs";
import {BsCrop} from "react-icons/bs";
import {MdOutlineFileUpload} from "react-icons/md";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import * as Slider from "@radix-ui/react-slider";

import {Button, H4, Upload} from "@shared/ui";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {Nullable} from "@shared/lib/types";

type Tab = "crop" | "upload";

interface AvatarEditorProps extends WrappedModalProps, EditorProps {
  onSave?: (blob: Nullable<Blob>) => void;
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  onClose,
  open,
  onSave,
  ...props
}) => {
  let editor: Nullable<Editor> = null;

  const [avatar, setAvatar] = useState(props.image as string);
  const [currentTab, setCurrentTab] = useState<Tab>("crop");
  const [scale, setScale] = useState(1);

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[30rem] flex flex-col bg-paper rounded-lg shadow-md space-y-8 p-10">
        <H4>Edit profile picture</H4>

        <div className="w-[100%] flex flex-col justify-center items-center space-y-2 m-auto">
          <Editor
            ref={(ref) => {
              editor = ref;
            }}
            image={avatar}
            borderRadius={125}
            scale={scale}
            border={25}
            style={{width: "100%", height: "auto"}}
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
              <div className="flex items-center space-y-4">
                <Upload
                  onChange={({currentTarget}) => {
                    const file = currentTarget.files![0];

                    if (file) {
                      setAvatar(URL.createObjectURL(file));
                    }
                  }}
                >
                  <Button className="bg-accent-300 text-paper-contrast">
                    Upload photo
                  </Button>
                </Upload>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="flex space-x-4 items-center">
          <Button
            onClick={() => {
              onClose();
            }}
            color="secondary"
            type="button"
            className="w-[50%]"
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              editor?.getImage().toBlob((blob) => {
                onSave && onSave(blob);
              });
            }}
            className="w-[50%]"
          >
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
