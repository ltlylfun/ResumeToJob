import { useRef, useEffect } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { changeFormHeading } from "lib/redux/settingsSlice";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { name, email, phone, url, summary, location, photoUrl } = profile;
  const form = "profile";

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      name: {
        en: "Name",
        zh: "姓名",
      },
      profile: {
        en: "Profile",
        zh: "个人简介",
      },
      summary: {
        en: "Summary",
        zh: "个人摘要",
      },
      summaryPlaceholder: {
        en: "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed",
        zh: "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消",
      },
      email: {
        en: "Email",
        zh: "邮箱",
      },
      phone: {
        en: "Phone",
        zh: "电话",
      },
      website: {
        en: "Website",
        zh: "个人网站",
      },
      location: {
        en: "Location",
        zh: "所在地",
      },
      photo: {
        en: "Photo",
        zh: "照片",
      },
      uploadProfessionalPhoto: {
        en: "Upload a professional photo",
        zh: "上传专业证件照",
      },
      checkCarefully: {
        en: "Check carefully",
        zh: "仔细检查，别填错",
      },
      websiteExample: {
        en: "e.g.: GitHub, blog, etc.",
        zh: "如：github，博客之类的",
      },
      personalPhoto: {
        en: "Personal Photo",
        zh: "个人照片",
      },
    };

    return translations[key]?.[language] || key;
  };
  const handleProfileChange = (
    field: keyof ResumeProfile,
    value: string | string[]
  ) => {
    dispatch(changeProfile({ field, value: value as any }));
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

  // ProfileForm本身不在formToHeading中，所以不需要调用changeFormHeading

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label={translate("name")}
          labelClassName="col-span-full"
          name="name"
          placeholder=""
          value={name}
          onChange={handleProfileChange}
        />{" "}
        <div className="col-span-full">
          <BulletListTextarea
            label={translate("summary")}
            name="summary"
            placeholder={translate("summaryPlaceholder")}
            value={summary}
            onChange={handleProfileChange}
          />
        </div>
        <Input
          label={translate("email")}
          labelClassName="col-span-4"
          name="email"
          placeholder={translate("checkCarefully")}
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label={translate("phone")}
          labelClassName="col-span-2"
          name="phone"
          placeholder={translate("checkCarefully")}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={translate("website")}
          labelClassName="col-span-4"
          name="url"
          placeholder={translate("websiteExample")}
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={translate("location")}
          labelClassName="col-span-2"
          name="location"
          placeholder=""
          value={location}
          onChange={handleProfileChange}
        />
        <div className="col-span-full">
          <label className="mb-1 block text-sm font-medium">
            {translate("photo")}
          </label>
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
                  <img
                    src={photoUrl}
                    className="rounded-md object-cover"
                    alt={translate("personalPhoto")}
                    style={{ width: "100%", height: "100%" }}
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
              <p>{translate("uploadProfessionalPhoto")}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
