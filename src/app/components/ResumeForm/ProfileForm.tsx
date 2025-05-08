import { useRef } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
} from "lib/redux/settingsSlice";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { name, email, phone, url, summary, location, photoUrl } = profile;
  const form = "profile";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  const handleProfileChange = (
    field: keyof ResumeProfile,
    value: string | string[]
  ) => {
    dispatch(changeProfile({ field, value: value as any }));
  };

  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleProfileChange("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    handleProfileChange("photoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="姓名"
          labelClassName="col-span-full"
          name="name"
          placeholder=""
          value={name}
          onChange={handleProfileChange}
        />
        <div className="relative col-span-full">
          <BulletListTextarea
            label="个人简介"
            labelClassName="col-span-full"
            name="summary"
            placeholder=""
            value={summary}
            onChange={handleProfileChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
        <Input
          label="邮箱"
          labelClassName="col-span-4"
          name="email"
          placeholder="仔细检查，别填错"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="电话"
          labelClassName="col-span-2"
          name="phone"
          placeholder="仔细检查，别填错"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="个人网站"
          labelClassName="col-span-4"
          name="url"
          placeholder="如：github，博客之类的"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="所在地"
          labelClassName="col-span-2"
          name="location"
          placeholder=""
          value={location}
          onChange={handleProfileChange}
        />

        <div className="col-span-full">
          <label className="mb-1 block text-sm font-medium">照片</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    className="rounded-md object-cover"
                    alt="个人照片"
                    width={96}
                    height={96}
                    style={{ width: "100%", height: "100%" }}
                    priority
                  />
                ) : (
                  <CameraIcon className="h-8 w-8" />
                )}
              </label>
              {photoUrl && (
                <button
                  type="button"
                  className="absolute -right-2 -top-2 rounded-full bg-white text-gray-500 hover:text-gray-700"
                  onClick={handleRemovePhoto}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>上传专业证件照</p>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
